---
title: Anthropic Agent Skills Analysis Report
date: 2025-12-23 06:47:07
tags: [药物警戒, AI]
categories: [技术分析]
---

### 主要发现

- **Anthropic 的战略转变**：研究表明，AI 行业应优先开发模块化“技能”（Skills），而非大量专用 AI 代理（Agents）。Skills 可增强通用代理如 Claude 的领域专长，并提供可复用工作流，这有助于解决当前代理在实际任务中的上下文缺失或精度不足问题。
- **模块化设计优势**：Skills 是简单的文件包（如包含 Markdown 指令、脚本和资源的文件夹），支持渐进式加载信息，减少 token 使用，实现高效扩展。尽管在企业环境中显示出生产力潜力，但一些专家质疑其广泛采用，认为它类似于现有 API。
- **开放标准与生态**：截至 2025 年 12 月 18 日，Agent Skills 已成为开放标准，获得 Atlassian、Canva 等伙伴贡献。虽然在生产力和安全性方面有优势，但静态性质可能需要仔细管理更新和安全。
- **潜在争议**：证据倾向于 Skills 在企业设置中的益处，但实际扩展可能引入依赖管理等挑战。视频中提到此方法可能被视为“销售说辞”，若不改进底层 LLM 一致性，其效果有限。

#### 视频概述

YouTube 视频《Anthropic：别再造 Agent 了，未来是Skills的！》由频道“白白说大模型”于 2025 年 12 月 22 日上传，聚焦 Anthropic 从 AI 代理转向 Skills 的观点。 视频从 t=199s 开始深入讨论，批评代理中心模式的低效，并倡导 Skills 作为可扩展替代方案。内容基于 Anthropic 的 2025 年 10 月工程文章和 12 月更新，无完整转录，但与官方公告一致。

#### 核心概念

Anthropic 的 Agent Skills 框架通过模块化包为 AI 代理提供实际能力。不同于从零构建的传统代理，Skills 作为通用代理如 Claude 的附加组件，提供程序知识文件。 例如，PDF Skills 允许 Claude 处理文档——其原生无法实现——通过引用指令和脚本，而不一次性加载所有内容。



![Claude Skills: A Deep Dive into Anthropic's Agent Framework ...](/assets/anthropic-agent-skills-analysis-report-1tw55rzyzccuanx7av7v28a.png)

[gyliu513.medium.com](https://gyliu513.medium.com/claude-skills-a-deep-dive-into-anthropics-agent-framework-9c4b57eb9a27)

Claude Skills: A Deep Dive into Anthropic's Agent Framework ...



上图展示了 Anthropic Agent Skills 框架，说明模块化组件如何集成到核心系统中处理任务。

#### 益处与应用

Skills 通过“渐进式披露”实现效率，仅加载相关细节，适用于复杂工作流。 实际中，用于创建电子表格或在 Figma 中应用品牌指南。 非工程师可构建它们，导致数千用户创建的 Skills 在会计和法律领域应用，财富 100 强公司用于内部指南。

#### 批评与考虑

尽管创新，一些讨论认为 Skills 若未改进 LLM 一致性，则可能为“无用销售说辞”。 其他指出它们可能不适合需要动态适应的自治代理，安全风险如提示注入也值得关注。 此方法验证了结构化指令优于模糊提示，但需清晰的标准操作程序 (SOP) 以成功。

------

Anthropic 最近推动 Agent Skills 标志着 AI 发展的关键演变，挑战行业对专用代理的痴迷，转向更模块化的技能范式。本报告分析了 2025 年 12 月 22 日上传的 YouTube 视频《Anthropic：别再造 Agent 了，未来是Skills的！》，该视频由中文 AI 频道“白白说大模型”制作，似乎总结并批判 Anthropic 的框架。 视频从指定时间戳 (t=199s) 开始，强调代理中心模式的低效，并推广 Skills 作为可扩展替代，源于 Anthropic 的 2025 年 10 月工程帖子和 12 月更新。 无公开转录，本分析基于视频标题、描述、上下文讨论，以及 Anthropic 官方帖子、行业文章和社会媒体反应的综合来源，包括 Anthropic 的官方帖子、行业文章和社会媒体反应，以提供平衡观点。 本全面分析涵盖框架起源、机制、优势、潜在缺点、实际应用以及对 AI 未来的更广泛含义，融入多样视角以确保平衡。

#### Agent Skills 的背景与起源

Agent Skills 概念源于 Anthropic 努力弥合高度智能但上下文受限的 AI 模型与实际任务需求之间的差距。该框架于 2025 年 10 月 16 日的工程博客中引入，解决核心问题：即使是先进的 大语言模型 (LLM) 如 Claude，也在领域特定专长或实际场景精确执行中挣扎。 Anthropic 研究者 Barry Zhang 和 Mahesh Murag 在 2025 年 12 月 8 日的演示和文章中，明确反对行业构建“大量 AI 代理”的趋势，称其低效。 相反，他们倡导用可复用“技能”装备单一通用代理——这些模块化知识包可迭代改进并共享。

这一转变根源于观察：当前代理常因缺失关键上下文或性能不一致而失败，导致炒作驱动但浅显实现（如在 LLM 上附加聊天界面以溢价销售）。 所审视频呼应此观点，将 Skills 定位为 AI 的“未来”，鉴于其发布时间仅在 Anthropic 2025 年 12 月 18 日开放标准公告后几天。

#### Agent Skills 如何工作：技术分解

本质上，Agent Skill 是一个目录（文件夹），包含主要 SKILL.md 文件，以 YAML 前置元数据（例如名称和描述）开头，其后是详细指令，以及可选支持文件如脚本、参考或资产。 此结构启用“渐进式披露”，代理初始仅加载轻量元数据到系统提示中。若 skill 相关，则通过工具访问完整 SKILL.md，并按需加载更深文件——防止上下文窗口过载，实现有效无限可扩展性。

例如，PDF 操作 skill 可能包括：

- YAML 中的元数据用于快速扫描。
- SKILL.md 中的一般处理指令。
- 单独的 forms.md 用于表单填写细节。
- 可执行 Python 脚本用于确定性任务如提取字段，而不膨胀 token 计数。

这与传统 AI 代理截然不同，后者往往是整体或自定义构建，导致碎片化。Skills 与 Anthropic 的 Model Context Protocol (MCP) 集成，用于外部工具通信，创建混合工作流。 创建易于访问：用户在 Claude 接口中描述需求，它生成 skill，企业计划支持组织级管理。



![Equipping agents for the real world with Agent Skills ...](/assets/anthropic-agent-skills-analysis-report-imageurlhttps-www-cdnanthropiccomimages4zrzovbbwebsiteddd7e6e572ad0b6a943cacefe957248455f6d522-1650x929.webp)

[anthropic.com](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

Equipping agents for the real world with Agent Skills ...



上图描绘了 Agent Skills 框架，突出文件夹结构、渐进式披露过程，以及与 AI 代理的集成以高效执行任务。

#### 益处与实际应用

Skills 提供可组合性、可移植性和效率，将通用代理转化为专家而无需定制开发。 益处包括减少 token 使用、确定性代码执行以精确，以及跨平台如 Claude.ai、Claude Code 和 SDK 的易共享。 在企业中，它们提升生产力：Anthropic 工程师报告转向高层 AI 管理，Skills 编码最佳实践。

应用跨行业：

- **基础 Skills**：添加如网页浏览或表单填充能力。
- **第三方集成**：伙伴如 Stripe 用于支付或 Notion 用于任务管理。
- **内部使用**：数千用户创建的 Skills 用于会计、法律或品牌语音执行，被大型公司采用。

社交媒体讨论赞扬其启用持续学习——代理可动态“添加”Skills，在外部存储知识以可解释性和更新。 一条 X 帖子指出生态在数周内增长至数千 Skills。

| 类别      | 示例                                        | 益处                       | 挑战               |
| --------- | ------------------------------------------- | -------------------------- | ------------------ |
| 基础      | PDF 操作、数据分析脚本                      | 添加原生能力；确定性执行   | 需要代码的安全沙箱 |
| 第三方    | Jira 任务创建 (Atlassian)、设计指南 (Figma) | 无缝集成；伙伴生态增长     | 依赖供应商更新     |
| 内部/企业 | 会计工作流、法律文档审查                    | 可定制组织知识；非技术创建 | 无动态适应可能静态 |
| 高级      | 多代理研究系统、长期项目                    | 支持重启和跨会话改进       | 提示注入等安全风险 |

此表总结 Skills 类型，源于 Anthropic 的实现和伙伴贡献。



![Cracking the Code of Building of AI Agents: Using Principles ...](/assets/anthropic-agent-skills-analysis-report-1c1rl3-rxuhc5paczccpthg.png)

[medium.com](https://medium.com/@rajneeshkaggarwal/cracking-the-code-of-building-of-ai-agents-using-principles-from-anthropics-playbook-that-7c4954051755)

Cracking the Code of Building of AI Agents: Using Principles ...



此插图显示 AI 代理增强 Skills，可视化其处理多样任务如文档编辑或工作流自动化。

#### 批评与反驳

尽管热情，一些观点认为 Skills 过于简单或静态，不适合需要动态适应的真正自治代理。 分析师 Holger Mueller 质疑采用，指出其与 API 相似，并对单一供应商标准持怀疑，即使 MCP 成功。 安全担忧突出：作为文本文件的 Skills 可能启用提示注入攻击，根据早期研究。 视频评论暗示 Anthropic 的宣传若无 LLM 架构全面改革，则效果不佳。

支持者的反驳，包括 Anthropic 的 Barry Zhang，强调 Skills 的 AGI 兼容可组合性，并作为持续学习桥梁。 日本开发者讨论突出沙箱需求因环境耦合，而其他人视其为程序记忆扩展的“大步”。

#### 未来含义与开放标准

作为 agentskills.io 的开放标准，Skills 旨在跨平台可移植，即将添加全生命周期管理功能（创建、编辑、共享）。 Anthropic 设想代理自主生成 Skills，最终将知识蒸馏到模型权重中。 这可能简化医疗或金融等关键领域的 AI，但成功取决于解决批评并在 Anthropic 生态外促进采用。

总之，视频作为此辩论的及时切入点，与行业向模块化 AI 增强的更广泛转变一致。尽管 Skills 承诺可靠性和可访问性，其长期影响取决于创新与鲁棒性的平衡。



![AI Agent Architecture: 4 Key Modules Explained | Gaurav ...](/assets/anthropic-agent-skills-analysis-report-1750941347426.jpeg)

[linkedin.com](https://www.linkedin.com/posts/gauravkheterpal_aiagents-agentarchitecture-genai-activity-7343980302039465987-8ynF)

AI Agent Architecture: 4 Key Modules Explained | Gaurav ...



此 Anthropic 多代理系统图表说明 Skills 如何启用复杂、长期研究工作流，展示可扩展性。

### 关键引用

- [Equipping agents for the real world with Agent Skills - Anthropic](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills?referrer=grok.com)
- [Agent Skills - Claude Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview?referrer=grok.com)
- [anthropics/skills: Public repository for Agent Skills - GitHub](https://github.com/anthropics/skills?referrer=grok.com)
- [Anthropic launches enterprise 'Agent Skills' and opens the standard - VentureBeat](https://venturebeat.com/ai/anthropic-launches-enterprise-agent-skills-and-opens-the-standard?referrer=grok.com)
- [Agent Skills: Anthropic's Next Bid to Define AI Standards - The New Stack](https://thenewstack.io/agent-skills-anthropics-next-bid-to-define-ai-standards/?referrer=grok.com)
- [Equipping Agents for the Real World with Agent Skills: A Practical Guide - Medium](https://medium.com/@martinkeywood/equipping-agents-for-the-real-world-with-agent-skills-a-practical-guide-of-a-brilliant-anthropic-0f546d9be089?referrer=grok.com)
- [Agent Skills is now an open standard - Reddit](https://www.reddit.com/r/ClaudeAI/comments/1ppw38d/agent_skills_is_now_an_open_standard/?referrer=grok.com)
- [Agent Skills Am I missing something - Reddit](https://www.reddit.com/r/Anthropic/comments/1phrhs2/agent_skills_am_i_missing_something_or_is_it_just/?referrer=grok.com)
