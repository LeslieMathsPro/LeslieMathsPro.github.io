/**
 * 站点全局配置：改站点信息只需要动这一个文件。
 * TODO 标记的地方请替换成你自己的真实信息。
 */

export const SITE_TITLE = 'TODO 你的名字 · 技术博客';
export const SITE_DESCRIPTION =
	'AI / 算法工程师的技术笔记：大模型应用、推理优化、Agent 架构与工程实践。';

/**
 * 是否允许搜索引擎收录。
 *
 * false（当前值）：全站输出 noindex + robots.txt 拒绝抓取。
 *   信息还没填完、只想先跑通部署链路时保持 false，避免半成品被搜索引擎收录。
 * true：正式公开。把 TODO 都替换成真实信息、确认页面无误后再改成 true。
 */
export const INDEXABLE = false;

/** 首页强定位区文案：面试官通常只看这一屏 */
export const HERO = {
	/** TODO 换成你的名字 */
	name: 'TODO 你的名字',
	/** 一句话技术定位，越具体越好，避免"热爱技术"这类无信息量表述 */
	tagline: 'AI 应用工程师 · 大模型推理优化与 Agent 系统',
	/** 2-3 句自我介绍，突出方向、深度和可验证的成果 */
	intro:
		'TODO：用两三句话说清你做什么方向、做到什么深度、有什么可验证的成果。例如「专注大模型推理性能优化，主导过某推理服务的吞吐优化，P99 延迟下降 60%；对 vLLM / TensorRT-LLM 的调度与显存管理有源码级理解」。',
	/** 技术关键词，用于快速传达技术栈画像 */
	keywords: [
		'LLM 推理优化',
		'Agent 架构',
		'RAG',
		'PyTorch',
		'CUDA',
		'分布式训练',
		'Python',
		'Go',
	],
} as const;

/** 社交与联系方式；留空字符串则该项自动不展示 */
export const SOCIALS = {
	/** TODO 换成你的 GitHub */
	github: 'https://github.com/your-username',
	/** TODO 换成你的邮箱，求职场景务必填写 */
	email: 'your-email@example.com',
	/** 可选：知乎 / X / 掘金 / LinkedIn，不用就留空 */
	zhihu: '',
	x: '',
	linkedin: '',
	/** 可选：在线简历 PDF，放到 public/ 目录后填 '/resume.pdf' */
	resume: '',
} as const;

/** 顶部导航 */
export const NAV_LINKS = [
	{ href: '/', label: '首页' },
	{ href: '/posts', label: '文章' },
	{ href: '/projects', label: '项目' },
	{ href: '/about', label: '关于' },
] as const;

/** 首页展示的精选文章 / 项目数量 */
export const FEATURED_POST_COUNT = 3;
export const FEATURED_PROJECT_COUNT = 2;
