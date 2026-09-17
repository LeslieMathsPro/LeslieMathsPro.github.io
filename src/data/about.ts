/**
 * 关于页数据。TODO 全部替换成你的真实信息。
 * 技术栈矩阵按「掌握程度」分组，比一长串平铺的技术名词更有信息量。
 */

export type SkillGroup = {
	category: string;
	/** core = 能独立解决复杂问题；familiar = 能熟练使用；exposure = 了解原理、用过 */
	level: 'core' | 'familiar' | 'exposure';
	items: string[];
};

export const SKILL_GROUPS: SkillGroup[] = [
	{
		category: '大模型与推理',
		level: 'core',
		items: ['vLLM', 'TensorRT-LLM', '量化（GPTQ / AWQ）', 'KV Cache 优化', 'Flash Attention'],
	},
	{
		category: '语言与框架',
		level: 'core',
		items: ['Python', 'PyTorch', 'FastAPI', 'TypeScript'],
	},
	{
		category: 'Agent 与应用层',
		level: 'familiar',
		items: ['LangGraph', 'MCP', 'RAG 检索链路', 'Function Calling', '向量检索'],
	},
	{
		category: '工程与基建',
		level: 'familiar',
		items: ['Docker', 'Kubernetes', 'Ray', 'Prometheus / Grafana', 'CI/CD'],
	},
	{
		category: '了解',
		level: 'exposure',
		items: ['CUDA Kernel 编写', 'Triton', '模型并行', 'Go'],
	},
];

export const LEVEL_LABELS: Record<SkillGroup['level'], string> = {
	core: '核心能力',
	familiar: '熟练使用',
	exposure: '了解原理',
};

export type TimelineItem = {
	period: string;
	title: string;
	org: string;
	/** 2-3 条职责与产出，突出可量化结果 */
	points: string[];
};

export const TIMELINE: TimelineItem[] = [
	{
		period: '2026.09 — 至今',
		title: '运筹优化算法工程师',
		org: '顺丰集团',
		points: [
			'TODO：负责什么系统 / 什么方向，规模量级是多少',
			'TODO：做出了什么改进，指标从多少变成多少',
		],
	},
	{
		period: '2025.04 — 2026.08',
		title: '资深应用算法工程师',
		org: '阿里巴巴淘宝闪购',
		points: [
			'负责运力规划中骑手时段出勤规划，规模量级亿级产能分配与百万级骑手规划',
			'分阶段运筹建模+Spark高并发产出，落地应用全国，经AB实验履约效能提升15%，单均成本下降0.0x元',
		],
	},
	{
		period: '2023.07 — 2025.04',
		title: '算法工程师',
		org: '奔曜科技',
		points: ['垂类机器人调度通用全局最优模型'],
	},
	{
		period: '2020 — 2023',
		title: '计算机科学与技术 / 工程师学位',
		org: '法国国立圣埃蒂安高等矿业学院',
		points: ['TODO：研究方向、获奖、或有代表性的课程项目'],
	},
];

/** 关于页的自我介绍正文，支持多段 */
export const ABOUT_INTRO: string[] = [
	'TODO：第一段讲你现在做什么方向、专注什么问题。写具体的技术问题，不要写"热爱技术"。',
	'TODO：第二段讲你的技术判断和方法论 —— 你怎么定位问题、怎么权衡方案。这是区分资深与初级的关键信息。',
	'TODO：第三段讲你在找什么样的机会，以及为什么。让招聘方判断匹配度。',
];
