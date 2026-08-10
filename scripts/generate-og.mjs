/**
 * 生成 OG 分享图 public/og-default.png（1200×630）。
 * 改完 src/consts.ts 里的名字或定位后重新执行：node scripts/generate-og.mjs
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { HERO, SITE_DESCRIPTION } from '../src/consts.ts';

const escapeXml = (text) =>
	text.replace(
		/[<>&'"]/g,
		(char) =>
			({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char],
	);

// 关键词最多取 5 个，多了在图上排不开
const keywords = HERO.keywords.slice(0, 5);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
	<defs>
		<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stop-color="#18181b" />
			<stop offset="100%" stop-color="#312e81" />
		</linearGradient>
	</defs>
	<rect width="1200" height="630" fill="url(#bg)" />
	<rect x="0" y="0" width="1200" height="6" fill="#6366f1" />
	<text x="80" y="250" font-family="PingFang SC, Helvetica, Arial, sans-serif" font-size="72" font-weight="700" fill="#fafafa">${escapeXml(HERO.name)}</text>
	<text x="80" y="320" font-family="PingFang SC, Helvetica, Arial, sans-serif" font-size="34" fill="#a5b4fc">${escapeXml(HERO.tagline)}</text>
	<text x="80" y="390" font-family="PingFang SC, Helvetica, Arial, sans-serif" font-size="24" fill="#a1a1aa">${escapeXml(SITE_DESCRIPTION.slice(0, 46))}</text>
	${keywords
		.map((keyword, index) => {
			const x = 80 + index * 210;
			return `<g><rect x="${x}" y="470" width="190" height="46" rx="23" fill="#3f3f46" opacity="0.7" />
		<text x="${x + 95}" y="500" text-anchor="middle" font-family="PingFang SC, Helvetica, Arial, sans-serif" font-size="20" fill="#e4e4e7">${escapeXml(keyword)}</text></g>`;
		})
		.join('\n\t')}
</svg>`;

const output = fileURLToPath(new URL('../public/og-default.png', import.meta.url));
const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(output, png);

console.log(`已生成 ${output}`);
