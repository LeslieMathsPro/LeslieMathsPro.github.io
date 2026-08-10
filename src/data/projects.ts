/**
 * 项目作品集数据。求职场景下这是转化率最高的一页：
 * 招聘方最关心「你解决了什么难题」和「结果是否可量化」，
 * 所以每个项目都强制填写 highlights（难点与结果），不要只堆技术名词。
 *
 * TODO 把下面的示例替换成你的真实项目。
 */

export type Project = {
	name: string;
	/** 一句话说清这个项目是什么 */
	summary: string;
	/** 技术栈标签 */
	stack: string[];
	/** 难点与可量化结果，2-4 条，每条一句话 */
	highlights: string[];
	/** 项目状态，展示在卡片角标 */
	status?: '生产运行中' | '持续迭代' | '已归档' | '实验原型';
	repo?: string;
	demo?: string;
	/** 是否在首页精选展示 */
	featured?: boolean;
};

export const PROJECTS: Project[] = [
	{
		name: 'TODO 项目一：LLM 推理服务优化',
		summary:
			'为内部大模型问答服务重构推理链路，在不增加 GPU 的前提下把吞吐提升到原来的数倍。',
		stack: ['Python', 'vLLM', 'CUDA', 'Triton', 'Prometheus'],
		highlights: [
			'定位到 KV Cache 碎片化是吞吐瓶颈，改用 PagedAttention 后显存利用率从 54% 提升到 89%',
			'引入连续批处理（continuous batching），QPS 从 12 提升到 47，P99 延迟下降 60%',
			'补齐了 token 级别的指标埋点，让容量规划从拍脑袋变成可测算',
		],
		status: '生产运行中',
		repo: 'https://github.com/your-username/your-repo',
		demo: '',
		featured: true,
	},
	{
		name: 'TODO 项目二：多智能体协作框架',
		summary:
			'一个面向复杂任务拆解的 Agent 编排框架，支持工具调用、状态回溯与失败重试。',
		stack: ['TypeScript', 'Node.js', 'LangGraph', 'Redis', 'PostgreSQL'],
		highlights: [
			'设计了基于有向图的任务编排模型，把长链路任务的成功率从 61% 提升到 88%',
			'实现了执行状态快照，Agent 中断后可从任意节点恢复，避免整链重跑',
			'抽象出统一的工具协议，接入新工具的成本从两天降到半小时',
		],
		status: '持续迭代',
		repo: 'https://github.com/your-username/your-repo',
		demo: 'https://your-demo.com',
		featured: true,
	},
	{
		name: 'TODO 项目三：检索增强问答（RAG）实验平台',
		summary:
			'用于快速对比不同切分策略、embedding 模型和重排方案对最终答案质量的影响。',
		stack: ['Python', 'FastAPI', 'pgvector', 'Sentence-Transformers'],
		highlights: [
			'搭建了可复现的离线评测集，把「换个模型好不好」从主观判断变成可比对的指标',
			'实验发现语义切分 + 重排的组合在业务问答集上比朴素切分召回率高 23 个百分点',
		],
		status: '实验原型',
		repo: 'https://github.com/your-username/your-repo',
	},
];
