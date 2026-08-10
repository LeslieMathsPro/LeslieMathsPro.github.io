import type { APIRoute } from 'astro';
import { INDEXABLE } from '@/consts';

/**
 * 动态生成 robots.txt，跟随 consts.ts 里的 INDEXABLE 开关。
 * 未公开时拒绝全站抓取；公开后开放并指向 sitemap。
 */
export const GET: APIRoute = ({ site }) => {
	const body = INDEXABLE
		? `User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site)}
`
		: `User-agent: *
Disallow: /
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
