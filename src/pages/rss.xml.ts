import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/consts';
import { getPublishedPosts } from '@/lib/posts';

export const GET: APIRoute = async (context) => {
	const posts = await getPublishedPosts();

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site ?? 'https://your-domain.com',
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			categories: [...post.data.tags],
			link: `/posts/${post.id}/`,
		})),
		customData: '<language>zh-CN</language>',
	});
};
