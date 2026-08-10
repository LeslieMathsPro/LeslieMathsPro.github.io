---
title: '为什么 Attention 要除以 √d_k：一次完整的方差推导'
description: '缩放点积注意力里的 1/√d_k 不是经验参数，而是方差归一化的必然结果。本文从随机变量的方差出发完整推导，并说明它为什么直接决定训练能否收敛。'
pubDate: 2026-07-28
tags: ['Transformer', '数学推导', '深度学习']
featured: true
---

几乎所有讲 Transformer 的文章都会提一句「除以 $\sqrt{d_k}$ 是为了防止梯度消失」，然后就过去了。但这句话本身解释不了两个问题：为什么偏偏是 $\sqrt{d_k}$ 而不是 $d_k$？梯度又是怎么消失的？

这两个问题的答案都藏在一次方差计算里。

## 从点积的方差说起

缩放点积注意力的定义是：

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

先看没有缩放的情况。设 query 向量 $q$ 和 key 向量 $k$ 的每一个分量都是独立的随机变量，且满足

$$
\mathbb{E}[q_i] = \mathbb{E}[k_i] = 0, \quad \mathrm{Var}(q_i) = \mathrm{Var}(k_i) = 1
$$

这个假设是合理的：现代网络的初始化（Xavier / Kaiming）和 LayerNorm 都在把激活值往零均值单位方差上拉。

那么点积 $q \cdot k = \sum_{i=1}^{d_k} q_i k_i$ 的期望是

$$
\mathbb{E}[q \cdot k] = \sum_{i=1}^{d_k} \mathbb{E}[q_i]\,\mathbb{E}[k_i] = 0
$$

关键是方差。由于各项独立，方差可以逐项相加：

$$
\mathrm{Var}(q \cdot k) = \sum_{i=1}^{d_k} \mathrm{Var}(q_i k_i)
$$

对于两个独立的零均值随机变量，$\mathrm{Var}(q_i k_i) = \mathbb{E}[q_i^2 k_i^2] - (\mathbb{E}[q_i k_i])^2 = \mathbb{E}[q_i^2]\,\mathbb{E}[k_i^2] = 1$。代回去得到

$$
\mathrm{Var}(q \cdot k) = d_k
$$

**方差随维度线性增长**，标准差则是 $\sqrt{d_k}$。这就是全部问题的根源。

## 方差膨胀如何杀死梯度

$d_k = 64$ 时，点积的标准差是 8；$d_k = 512$ 时是约 22.6。也就是说，进入 softmax 的 logits 会以几十为单位波动。

看 softmax 在这种输入下的行为。假设两个 logit 分别是 $z_1 = 20$、$z_2 = 0$：

$$
\mathrm{softmax}(z)_1 = \frac{e^{20}}{e^{20} + e^{0}} = \frac{1}{1 + e^{-20}} \approx 1 - 2 \times 10^{-9}
$$

输出几乎是 one-hot。而 softmax 的雅可比矩阵为

$$
\frac{\partial p_i}{\partial z_j} = p_i(\delta_{ij} - p_j)
$$

当某个 $p_i \to 1$、其余 $p_j \to 0$ 时，所有偏导数都趋于 0——因为 $p_i(1 - p_i) \to 0$，而 $p_i p_j \to 0$。梯度在这里被彻底压平，反向传播传不回去任何有效信号。

> **这不是数值溢出。**
> 注意区分两个问题。`exp(20)` 完全在 float32 范围内，不会溢出；工程实现里减去最大值（max subtraction）解决的是溢出问题。而这里的梯度消失是 softmax 饱和的**数学性质**，减最大值救不了它。

## 缩放因子的选择

既然问题是标准差为 $\sqrt{d_k}$，那么除以 $\sqrt{d_k}$ 正好把方差拉回 1：

$$
\mathrm{Var}\!\left(\frac{q \cdot k}{\sqrt{d_k}}\right) = \frac{1}{d_k}\mathrm{Var}(q \cdot k) = \frac{d_k}{d_k} = 1
$$

这就回答了开头的第二个问题：**不能除以 $d_k$**。方差是二次量，缩放系数进入方差时要平方，除以 $d_k$ 会让方差变成 $1/d_k$，logits 被压得过于集中，softmax 输出趋近均匀分布，注意力退化成平均池化，同样学不到东西。

$\sqrt{d_k}$ 是唯一让方差恰好归一的选择。

## 用代码验证

推导要能对上实测才算数：

```python
import torch

torch.manual_seed(42)

def logit_stats(d_k: int, n: int = 100_000) -> tuple[float, float]:
    """采样 n 对随机向量，返回缩放前后 logits 的标准差。"""
    q = torch.randn(n, d_k)
    k = torch.randn(n, d_k)
    raw = (q * k).sum(dim=-1)
    scaled = raw / (d_k ** 0.5)
    return raw.std().item(), scaled.std().item()

for d_k in (16, 64, 256, 1024):
    raw_std, scaled_std = logit_stats(d_k)
    print(f"d_k={d_k:>5}  理论 √d_k={d_k ** 0.5:>7.2f}  "
          f"实测 raw std={raw_std:>7.2f}  缩放后 std={scaled_std:.3f}")
```

输出：

```text
d_k=   16  理论 √d_k=   4.00  实测 raw std=   4.00  缩放后 std=1.000
d_k=   64  理论 √d_k=   8.00  实测 raw std=   7.99  缩放后 std=0.999
d_k=  256  理论 √d_k=  16.00  实测 raw std=  16.02  缩放后 std=1.001
d_k= 1024  理论 √d_k=  32.00  实测 raw std=  31.97  缩放后 std=0.999
```

实测标准差和 $\sqrt{d_k}$ 完全吻合，缩放后稳定在 1。

再看梯度的实际情况：

```python
def max_softmax_grad(d_k: int, scale: bool) -> float:
    """返回 softmax 雅可比中对角元的最大值，衡量梯度是否还活着。"""
    q, k = torch.randn(1, d_k), torch.randn(64, d_k)
    logits = q @ k.T
    if scale:
        logits = logits / (d_k ** 0.5)
    p = logits.softmax(dim=-1)
    return (p * (1 - p)).max().item()

for d_k in (64, 512):
    print(f"d_k={d_k}  未缩放 {max_softmax_grad(d_k, False):.2e}  "
          f"缩放后 {max_softmax_grad(d_k, True):.2e}")
```

未缩放时梯度量级常常落到 $10^{-4}$ 甚至更低，缩放后稳定在 $10^{-2}$ 量级。差了两个数量级以上，这在深层网络里会被逐层放大成致命问题。

## 一个延伸的工程问题

推导依赖「$q$、$k$ 各分量零均值单位方差」这个前提。真实训练中这个前提会被打破——尤其是长时间训练后，$W_Q$、$W_K$ 的权重范数会漂移，导致 logits 的实际方差重新膨胀。这就是后来 QK-Norm 被提出的动机：在算点积之前先对 $q$、$k$ 做一次归一化，把前提重新钉住。

$$
\mathrm{logits} = \frac{\mathrm{LN}(q) \cdot \mathrm{LN}(k)}{\sqrt{d_k}}
$$

> 这类「假设失效」的分析方式比记住结论更有价值。看到一个公式时，先找出它成立的前提，再问这个前提在什么情况下会被破坏——大部分工程问题都出在前提破了而公式还在用。

## 小结

- 点积方差随 $d_k$ 线性增长，标准差为 $\sqrt{d_k}$
- 大方差让 softmax 饱和，雅可比 $p_i(\delta_{ij} - p_j)$ 整体趋零，梯度消失
- 除以 $\sqrt{d_k}$ 使方差精确归一；除以 $d_k$ 会过度压缩，注意力退化为均匀分布
- 推导的前提是激活值零均值单位方差，训练中该前提会漂移，QK-Norm 是针对性的修补
