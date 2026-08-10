// @ts-check
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// https://astro.build/config
export default defineConfig({
	// GitHub Pages 用户站点，仓库名为 <username>.github.io 时服务于根路径，
	// 因此不需要配置 base。将来若绑定自定义域名，改这里并在 public/ 下加 CNAME 文件。
	site: 'https://LeslieMathsPro.github.io',
	integrations: [mdx(), sitemap()],
	markdown: {
		// Astro 7 默认使用 Sätteri 处理器，但它暂不支持数学公式。
		// 这里显式切回 unified(remark/rehype) 管线以启用 KaTeX。
		processor: unified({
			remarkPlugins: [remarkMath],
			rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: false }]],
		}),
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			wrap: false,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
