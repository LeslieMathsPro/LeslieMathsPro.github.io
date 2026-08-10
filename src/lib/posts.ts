import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/**
 * 获取全部文章，按发布时间倒序。
 * 生产构建时自动过滤 draft，本地 dev 保留草稿方便预览。
 */
export async function getPublishedPosts(): Promise<Post[]> {
	const posts = await getCollection('posts', ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** 首页精选：先取 featured，不足则用最新文章补齐 */
export async function getFeaturedPosts(limit: number): Promise<Post[]> {
	const posts = await getPublishedPosts();
	const featured = posts.filter((post) => post.data.featured);
	if (featured.length >= limit) return featured.slice(0, limit);
	const rest = posts.filter((post) => !post.data.featured);
	return [...featured, ...rest].slice(0, limit);
}

/** 标签 -> 文章数，按文章数倒序，便于渲染标签云 */
export async function getTagCounts(): Promise<{ tag: string; count: number }[]> {
	const posts = await getPublishedPosts();
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.data.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}
	return [...counts.entries()]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
	const posts = await getPublishedPosts();
	return posts.filter((post) => post.data.tags.includes(tag));
}

/**
 * 上一篇 / 下一篇（按发布时间倒序的列表相邻项）。
 * prev 指更早的文章，next 指更新的文章。
 */
export async function getAdjacentPosts(id: string): Promise<{
	prev: Post | undefined;
	next: Post | undefined;
}> {
	const posts = await getPublishedPosts();
	const index = posts.findIndex((post) => post.id === id);
	if (index === -1) return { prev: undefined, next: undefined };
	return {
		prev: posts[index + 1],
		next: posts[index - 1],
	};
}

/**
 * 估算阅读时长（分钟）。
 * 中英文混排按不同速率计算：中文 350 字/分钟，英文 220 词/分钟。
 */
export function getReadingTime(body: string | undefined): number {
	if (!body) return 1;
	const cjkChars = (body.match(/[\u4e00-\u9fa5]/g) ?? []).length;
	const words = (body.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[a-zA-Z0-9]+/g) ?? []).length;
	const minutes = cjkChars / 350 + words / 220;
	return Math.max(1, Math.round(minutes));
}

/** URL 中安全的标签片段（中文标签需要 encode） */
export function tagToPath(tag: string): string {
	return `/tags/${encodeURIComponent(tag)}`;
}
