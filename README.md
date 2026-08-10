# 个人技术博客

面向 AI / 算法岗求职的静态技术博客。Astro 7 + MDX + Tailwind CSS v4，输出纯静态站点。

站点结构围绕三条求职证据链设计：

| 页面 | 作用 |
| --- | --- |
| `/` 首页 | 技术定位 + 精选文章 + 代表项目，面试官通常只看这一屏 |
| `/posts` | 文章列表与标签筛选，体现技术深度 |
| `/projects` | 项目作品集，求职转化率最高的一页 |
| `/about` | 技术栈矩阵、经历时间线、联系方式 |

## 快速开始

```bash
npm install
npm run dev        # http://localhost:4321
```

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 本地开发，草稿文章可见 |
| `npm run build` | 生产构建，产物在 `dist/`，自动排除草稿 |
| `npm run preview` | 预览构建产物 |
| `npm run check` | TypeScript / Astro 类型检查 |

## 第一步：填写你的信息

所有个人信息集中在三个文件，搜索 `TODO` 即可定位全部待填项。

**1. `src/consts.ts`** — 站点基础信息

- `SITE_TITLE` / `SITE_DESCRIPTION`：站点标题与描述，影响 SEO
- `HERO`：首页强定位区。`tagline` 要写具体方向，`intro` 要写可验证的成果，避免「热爱技术」这类无信息量表述
- `SOCIALS`：社交与联系方式。**留空字符串的项会自动隐藏**，不用删代码
- `NAV_LINKS`：顶部导航

**2. `src/data/projects.ts`** — 项目作品集

每个项目的 `highlights` 字段是重点：写清难点和量化结果（「P99 从 4.2s 降到 1.6s」远胜「性能优化」）。

**3. `src/data/about.ts`** — 关于页

- `SKILL_GROUPS`：技术栈按掌握程度分三档（`core` / `familiar` / `exposure`），比平铺一长串技术名词更可信
- `TIMELINE`：经历时间线
- `ABOUT_INTRO`：自我介绍正文

**4. `src/consts.ts` 的 `INDEXABLE` 开关**

当前是 `false`：全站输出 `noindex,nofollow`，`robots.txt` 拒绝抓取。等 TODO 都填完、内容确认无误后改成 `true` 才会被搜索引擎收录。

站点会正常上线可访问，只是不进搜索结果——避免半成品被收录。

**5. 重新生成分享图**

改完名字和定位后执行，生成的 OG 图会在别人分享你的链接时显示：

```bash
node scripts/generate-og.mjs
```

## 写文章

在 `src/content/posts/` 下新建 `.md` 或 `.mdx` 文件，文件名即 URL：

```
src/content/posts/my-first-post.md  →  /posts/my-first-post
```

frontmatter 字段：

```yaml
---
title: '文章标题'                     # 必填
description: '摘要，用于 SEO 和列表页'   # 必填
pubDate: 2026-08-07                  # 必填
updatedDate: 2026-08-10              # 可选，显示「更新于」
tags: ['标签一', '标签二']             # 可选，自动生成标签聚合页
draft: true                          # 可选，true 则不出现在生产环境
featured: true                       # 可选，true 则出现在首页精选
heroImage: './cover.png'             # 可选，文章封面
---
```

字段由 Zod schema 强校验（`src/content.config.ts`），写错会在构建时直接报错并指出具体文件和字段。

### 支持的渲染能力

- **代码高亮**：Shiki，明暗双主题自动切换
- **数学公式**：KaTeX，行内 `$...$`，块级 `$$...$$`
- **组件嵌入**：`.mdx` 文件可导入 Astro 组件，如内置的 `Callout`
- **自动目录**：文章页右侧从 `h2` / `h3` 自动生成，滚动高亮当前小节

站内文章 `/posts/mdx-writing-guide` 本身就是完整的格式示例，可直接照抄。

> 公式密集的文章建议用 `.md`。MDX 会把 `{` 当作表达式起始符，大量 LaTeX 花括号需要转义。

### 草稿工作流

`draft: true` 的文章在 `npm run dev` 下可见（列表页带「草稿」角标），`npm run build` 时完全排除——不进列表、不生成页面、不进 RSS 和 sitemap。写到一半的文章可以放心提交到仓库。

## 部署到 GitHub Pages

站点部署在 `LeslieMathsPro/LeslieMathsPro.github.io` 仓库，地址 **https://LeslieMathsPro.github.io**。

仓库名符合 `<username>.github.io` 特殊模式，站点服务于根路径，因此 `astro.config.mjs` **不需要配置 `base`**（若换成普通仓库名则必须加，否则 CSS/JS 全部 404）。

### 日常发布流程

```bash
git add -A && git commit -m "post: 新文章"
git push
```

推送到 `main` 后，[.github/workflows/deploy.yml](.github/workflows/deploy.yml) 自动构建并部署，约 1-2 分钟生效。构建进度可在仓库 **Actions** 页查看。

### 一次性设置（只需做一次）

在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。

若这里仍是 `Deploy from a branch`，Actions 构建会成功但站点不会更新——因为 Pages 仍在直接 serve 分支上的源码文件。

> GitHub Pages 在免费账号下要求仓库为 **public**。私有仓库需要 Pages Pro。

### 网络说明

本机 SSH 22 端口被封锁，remote 已配置为走 443 端口：

```
ssh://git@ssh.github.com:443/LeslieMathsPro/LeslieMathsPro.github.io.git
```

换网络环境后如需恢复常规地址，执行：

```bash
git remote set-url origin git@github.com:LeslieMathsPro/LeslieMathsPro.github.io.git
```

### 绑定自定义域名（可选）

1. 在 `public/` 下新建 `CNAME` 文件，内容为一行域名，如 `blog.example.com`
2. 把 `astro.config.mjs` 的 `site` 改成该域名
3. 到域名注册商添加 DNS 记录：子域名用 `CNAME` 指向 `LeslieMathsPro.github.io`；根域名用 `A` 记录指向 GitHub Pages 的四个 IP（`185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`）
4. 在 **Settings → Pages → Custom domain** 填入域名并勾选 Enforce HTTPS

## 技术选型说明

| 用途 | 方案 | 选择理由 |
| --- | --- | --- |
| 框架 | Astro 7（静态输出） | 零 JS 默认输出，加载快、SEO 好 |
| 内容 | MDX + Content Collections | frontmatter 强类型校验，写错构建即失败 |
| 样式 | Tailwind CSS v4 | 无需配置文件，样式集中在 `global.css` |
| 公式 | remark-math + KaTeX | Astro 7 默认的 Sätteri 处理器暂不支持数学公式，故在 `astro.config.mjs` 中显式切回 `unified()` 管线 |
| 部署 | GitHub Pages + Actions | 完全免费，push 即部署，无需第三方账号 |

刻意没有引入 CMS、数据库和评论服务——求职博客的维护成本必须接近零，否则半年后必然荒废。后续若要加评论，推荐 [Giscus](https://giscus.app/zh-CN)（基于 GitHub Discussions，纯前端，不破坏静态架构）。

## 目录结构

```
src/
├─ consts.ts              站点配置（改信息主要动这里）
├─ content.config.ts      文章 frontmatter schema
├─ content/posts/         文章正文
├─ data/
│  ├─ projects.ts         项目作品集数据
│  └─ about.ts            关于页数据
├─ lib/posts.ts           文章取数逻辑（过滤草稿、排序、标签聚合、阅读时长）
├─ components/            UI 组件
├─ layouts/               页面骨架
├─ pages/                 路由
└─ styles/global.css      全局样式与排版规则
scripts/generate-og.mjs   生成 OG 分享图
```
