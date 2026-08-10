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
	// 部署后改成你的真实域名，sitemap / RSS / canonical 都依赖它生成绝对地址
	site: 'https://your-domain.com',
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
