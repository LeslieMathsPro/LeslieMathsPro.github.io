import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			/** 草稿：生产构建时自动排除，dev 下仍可预览 */
			draft: z.boolean().default(false),
			/** 精选：出现在首页 */
			featured: z.boolean().default(false),
			heroImage: image().optional(),
		}),
});

export const collections = { posts };
