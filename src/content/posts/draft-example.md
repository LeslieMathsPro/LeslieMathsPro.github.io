---
title: '草稿示例：这篇不会出现在线上'
description: '用于验证草稿机制。draft 为 true 的文章在生产构建中会被完全排除，但本地 npm run dev 时仍然可以正常预览。'
pubDate: 2026-08-01
tags: ['写作']
draft: true
---

这篇文章的 frontmatter 里写了 `draft: true`。

它的行为是：

- `npm run dev` 本地开发时**可以**看到，列表页会标上「草稿」角标
- `npm run build` 生产构建时**完全不会**出现，既不进文章列表，也不生成独立页面，也不进 RSS 和 sitemap

写到一半的文章可以放心留在仓库里，不用担心被提前发布。想发布时把 `draft: true` 删掉或改成 `false` 即可。
