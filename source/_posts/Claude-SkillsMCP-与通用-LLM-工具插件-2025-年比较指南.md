---
title: Claude Skills、MCP 与通用 LLM 工具插件：2025 年比较指南
date: 2025-10-24 05:53:49
tags: [药物警戒, AI]
categories: [技术分析]
---

### Claude Skills、MCP 与通用 LLM 工具/插件：2025 年比较指南

**关键洞见**

- **Claude Skills** 似乎是 Anthropic 的创新方法，用于为 Claude 模型打包 token 高效的工作流，特别适合重复任务如内容生成，但限于 Claude 生态系统，并可能引发未经验证内容的治理担忧。
- **Model Context Protocol (MCP)** 作为一个开放、可移植的标准脱颖而出，强调跨主机治理和重用，尽管它需要更多服务器设置，并可能引入延迟。
- **通用 LLM 工具/插件** 提供快速的供应商特定扩展（如 OpenAI 函数调用），最适合原型设计，但受限于供应商锁定和可移植性不一致。
- 研究表明，这些方法在分层设置中互补——Skills 用于任务编排，MCP 用于安全集成，插件用于快速原型——尽管企业更倾向于 MCP 以确保合规，但个人用户可能更青睐 Skills 的低门槛。
- 没有重大争议，但 Skills 的免费层访问仍不确定，可能更利于付费用户；证据倾向于结合使用以优化生产工作流。



![Claude Skills vs MCP vs LLM Tools: 2025 Comparison & Decision Guide](/assets/claude-skillsmcp-与通用-llm-工具插件-2025-年比较指南-be384a2d2d6544e1a894a974db7bf0a5.jpg)

[skywork.ai](https://skywork.ai/blog/ai-agent/claude-skills-vs-mcp-vs-llm-tools-comparison-2025/)

。Claude Skills 与 MCP 的概念关系图，展示 Skills 如何调用 MCP 或原生工具（来源：Skywork.ai，2025 年）。



#### 差异概述

截至 2025 年 10 月，这些扩展以不同方式解决 LLM 的局限性：Skills 专注于 Anthropic Claude 中的指令效率，MCP 提供中立协议用于更广泛的连接，插件则启用快速但孤立的供应商特定功能。文章将它们定位为非直接替代品，在工具调用上有重叠，但可移植性和设置权衡各异。支持来源包括 Anthropic 的 2025 年 10 月公告和 MCP 规范更新。

#### 优势与权衡

- **效率与成本**：Skills 通过按需加载最小化 token；MCP 增加服务器开销但支持低延迟本地使用；插件涉及 API 往返。
- **安全/治理**：MCP 在集中认证和审计方面领先；Skills 依赖用户策展；插件依赖平台 RBAC。
- **用例**：Skills 适合个人工作流，MCP 适合企业集成，插件适合快速实验。

#### 推荐

对于个人，从 Skills 开始低开销任务。团队应从插件原型开始，然后扩展到 MCP 以实现治理。验证请参考官方文档：[Anthropic Claude Skills 概述](https://www.anthropic.com/news/claude-skills-overview-oct-2025) 和 [MCP 规范](https://mcp-protocol.org/spec/architecture-2025-03-26)。

------

### 2025 年 LLM 扩展景观：Claude Skills、MCP 与平台特定工具/插件的深度分析

#### 引言：LLM 扩展的演进

在大型语言模型（LLM）领域快速成熟的背景下，将核心能力扩展到纯文本生成之外已成为实际部署的关键。截至 2025 年 10 月，生态系统提供了三种主要范式：Anthropic 的 Claude Skills、开放的 Model Context Protocol (MCP)，以及供应商特定的通用 LLM 工具/插件（如 OpenAI 的函数调用或 Google 的 Gemini 扩展）。本报告综合了 Skywork AI 博客文章的内容，并交叉验证了 Anthropic 公告、MCP 规范更新以及平台文档。分析证实了文章的核心论点——这些是互补层而非直接替代品——同时突出了经验证的优势、局限性和实际含义。基于最近发展，似乎混合方法将成为企业采用的主流，平衡速度、可移植性和合规性。

文章发表于 Skywork AI 平台（一个专注于研究和生产力的多模态 AI 工具），其披露注明 Skywork AI 为作者产品，引入了轻微的推广偏向，但内容事实稳健，与官方发布高度一致。验证涉及审查 Anthropic 的 2025 年 10 月新闻材料、MCP 规范以及生态讨论，未发现重大差异。例如，Anthropic 的“Claude Skills”发布强调了 token 效率，与文章主张一致。



![Claude Skills vs MCP vs LLM Tools: 2025 Comparison & Decision Guide](/assets/claude-skillsmcp-与通用-llm-工具插件-2025-年比较指南-ecb7bf41dd344723a0353b6c61c62e81-1024x683.jpg)

[skywork.ai](https://skywork.ai/blog/ai-agent/claude-skills-vs-mcp-vs-llm-tools-comparison-2025/)

。Claude Skills 中的文件系统与 MCP 集成示意图，展示本地文件操作和安全写文件流程（来源：Skywork.ai，2025 年）。



#### 范式定义：边界与重叠

为清晰起见，以下基于经验证定义划分每个扩展：

- **Claude Skills**：这些是模块化的“任务包”，包括 Markdown 文件（YAML 前置元数据和指令提示），可选捆绑脚本或资源。Claude 动态加载相关 Skills 以避免上下文窗口膨胀，使其 token 高效。Anthropic 的 2025 年 10 月概述将其描述为“可重用工作流”，适用于报告生成或风格执行等任务。与传统提示不同，Skills 支持渐进加载，例如仅在需要时调用代码执行进行文件操作，如 Anthropic 2024 年“创建文件”更新扩展到 Skills 中。
- **Model Context Protocol (MCP)**：2025 年 3 月最终确定的开放客户端-服务器协议，MCP 通过 stdio（本地）或 HTTP+SSE（远程）等传输标准化 AI 与外部工具、数据资源和提示模板的交互。核心组件包括类型化工具（动作）、资源（数据获取）和提示（可重用模板）。规范概述了多主机兼容架构，将 MCP 定位为“中立集成框架”。最近生态增长包括 Red Hat 和 OpenAI Agents SDK 的服务器，证实其采用扩展。
- **通用 LLM 工具/插件**：这些是专有机制，用于特定平台内的函数调用和服务集成。例如，OpenAI 的函数调用（用于结构化输出和 API 调用）、Google 的 Vertex AI 扩展（带 IAM 控制），以及其他供应商的类似功能。它们使模型“逐步推理”后调用工具，但紧密耦合于其生态，导致供应商锁定。

重叠存在：Claude Skill 可以编排 MCP 暴露的工具或原生插件，创建分层架构。然而，边界清晰——Skills 是 Claude 中心抽象，MCP 是协议级，插件是实现特定。OpenAI 的 2025 年 Agents SDK 文档验证了 MCP 支持，实现跨平台重用，支持文章的“可结合”断言。

#### 比较框架：经验证的并排分析

文章的比较表格准确全面，以下基于交叉检查增强版，融入 Red Hat 的 MCP 安全报告中的延迟基准和供应商网站可用性说明。

| 维度                       | Claude Skills                                       | Model Context Protocol (MCP)                                 | 通用 LLM 工具/插件                                        |
| -------------------------- | --------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| **主要目的**               | Claude 的任务导向工作流包（如检查列表、内容运营）   | 跨 AI 主机的开放协议，用于工具/资源/提示暴露                 | 供应商特定函数调用和扩展（如 OpenAI API、Gemini 动作）    |
| **抽象级别**               | 高层指令 + 脚本（渐进加载）                         | 协议标准（JSON-RPC 接口）                                    | 低层 API/SDK 构造                                         |
| **设置负责人**             | 高级用户/开发者（基于文件夹，无需基础设施）         | DevOps 团队（服务器编写/托管）                               | 开发者/市场管理员（平台依赖）                             |
| **治理**                   | 用户/组织库；Claude 代码执行权限                    | 集中服务器（认证、白名单、审计）                             | 平台 RBAC（如 Google IAM、OpenAI 组织策略）               |
| **可移植性**               | Claude 专用（跨生态低）                             | 高（多供应商、开放规范）                                     | 低（供应商锁定）                                          |
| **依赖**                   | 可选外部 API；基础任务离线可用                      | MCP 服务器（本地/远程）                                      | 平台运行时 + 外部服务                                     |
| **延迟/成本**              | 低（token 高效；Anthropic 基准 ~50-200ms 本地脚本） | 可变（stdio 近零；HTTP 跳跃 100-500ms；托管 ~$0.01-0.05/调用） | 中等（API 往返；模型层依赖，如 GPT-4o ~200ms + 外部 SLA） |
| **最适合**                 | 可重复个人/团队任务                                 | 企业集成、多主机重用                                         | 单平台快速原型                                            |
| **可用性 (2025 年 10 月)** | 跨 Claude.ai/API/Code；付费层强调（免费不确定）     | 开放生态；OpenAI、Claude、IDE 客户端                         | 成熟（如 OpenAI v1.2025、Google Vertex 更新）             |

此表格强调权衡：Skills 优先简单性（无需服务器设置），MCP 治理（凭证隔离），插件速度（OpenAI 并行调用）。The Register 的 2025 年 10 月 16 日报道证实 Skills  rollout 聚焦付费层，免费访问“待审”。



![Claude Skills are awesome, maybe a bigger deal than MCP](/assets/claude-skillsmcp-与通用-llm-工具插件-2025-年比较指南-skills_vs_mcps_still.gif)

[simonwillison.net](https://simonwillison.net/2025/Oct/16/claude-skills/)

。Skills 与 MCP 的比较 GIF，突出 Skills 在最佳实践和高级功能方面的优势（来源：Simon Willison 博客，2025 年）。



#### 深度评估：优势、局限性与实际适用性

##### Claude Skills：工作流效率与 Claude 原生力量的结合

优势在结构化重复中闪耀——例如，通过预加载模板生成合规报告，利用 Claude 的计算机使用进行文件操作而无需完整上下文重载。根据 Anthropic 工程深度剖析，token 节省可达 70% 用于多步任务。它们对非开发者友好，通过 Claude 接口文件夹安装 Skills。

局限包括 Claude 独占性（无法导出到 GPT 或 Gemini）和未经验证脚本的安全风险——Anthropic 建议审查和确认，尤其在默认禁用代码执行的组织中。免费层支持模糊；文章注明“不确定”，Anthropic 网站暗示广泛可用，但媒体如 The Register 强调专业功能。

适用性：理想用于内容/运营团队（如营销检查列表）。Claude 代码插件入门指南证实了 IDE 集成的简易性。

##### Model Context Protocol (MCP)：可扩展 AI 的开放骨干

MCP 架构——通过可发现端点暴露工具/资源/提示——启用重用，例如一个服务器为 Claude 和 OpenAI 代理提供 CRM 数据。优势包括强大安全：Red Hat 2025 年报告详述白名单和审计日志，缓解凭证泄露风险。本地 stdio 模式适合离线开发，HTTP 用于生产。

缺点：设置需求（如服务器 OAuth/JWT 认证）和远程设置潜在延迟，尽管基准显示平均 <300ms。生态成熟度增长中，OpenAI 的 MCP 文档（2025）启用无缝连接。

适用性：需要合规的企业（如受监管行业隔离 SaaS 访问）。入门参考“What is an MCP Server?” 概述，强调跨供应商实用性。

##### 通用 LLM 工具/插件：标准化优先于速度

这些在快速迭代中卓越——例如，OpenAI 函数调用用于 JSON 结构化 API 调用，或 Google 扩展用于 Vertex AI 管道带 VPC 控制。优势：成熟市场减少开发时间，特征如并行执行降低延迟。

局限：可移植性需重写（例如，从 OpenAI 函数迁移到 Claude），治理跨供应商碎片化。成本从模型 + 外部调用累积，无 MCP 重用效率。

适用性：标准化栈或原型；Google IAM 文档指导安全 rollout。



![Claude Skills vs Prompt Libraries (2025): Maintainability & Versioning](/assets/claude-skillsmcp-与通用-llm-工具插件-2025-年比较指南-52fa85aea015498fa00eb7389e565191-768x512.jpg)

[skywork.ai](https://skywork.ai/blog/ai-agent/claude-skills-vs-prompt-libraries-2025-comparison/)

。Claude Skills 与提示库的维护性比较图，展示版本控制和 CI/CD 集成（来源：Skywork.ai，2025 年）。



#### 安全、性能与集成模式

安全责任各异：Skills 需策展（视为“可信代码”），MCP 通过服务器集中（Red Hat 指南中的加密模式），插件利用平台控制（OpenAI 组织策略）。性能指标与文章一致——Skills 最小开销，MCP 灵活，插件 API 绑定。

集成：Skills 叠加 MCP 用于治理工作流，或插件用于供应商特定调整。OpenAI Agents SDK 验证 MCP 支持，实现混合代理。

#### 决策框架与 rollout 策略

文章指南务实：

- **Skills** 用于低设置重复。
- **MCP** 用于可移植治理。
- **插件** 用于快速获胜。

Rollout 从个人（Skills + 选择性代码使用）扩展到企业（MCP 带 RBAC，Skills 用于 UX 一致性）。对于研究工作流，工具如 Skywork AI 通过多模态摘要互补，尽管独立验证青睐主要规范。

常见查询解答：Skills ≠ MCP（抽象 vs. 协议）；基础 Skills 离线可能；MCP 速度依赖拓扑；OpenAI-MCP 通过 SDK 连接。



![Claude Skills vs MCP vs LLM Tools: 2025 Comparison & Decision Guide](/assets/claude-skillsmcp-与通用-llm-工具插件-2025-年比较指南-094e3d9d6bdb45b4ad04bf025c7c93fa-1024x683.jpg)

[skywork.ai](https://skywork.ai/blog/ai-agent/claude-skills-vs-mcp-vs-llm-tools-comparison-2025/)

。2025 年开源 vs. 专有 AI 工具景观图，突出 MCP 在开源生态中的作用（来源：Skywork.ai，2025 年）。



#### 结论：迈向分层、未来-proof 扩展

证据倾向于混合作为 2025 年规范——Skills 用于敏捷，MCP 用于规模，插件用于入口——减少锁定同时提升生产力。构建者应根据可移植性和合规审计需求，从官方试用开始。本分析基于经验证来源，将文章定位为 LLM 演进中的可靠导航。

### 关键引用

- [Anthropic — Claude Skills 概述 (2025 年 10 月)](https://www.anthropic.com/news/claude-skills-overview-oct-2025)
- [Anthropic 工程 — 代理 Skills 深度剖析 (2025 年 10 月)](https://www.anthropic.com/engineering/agent-skills-deep-dive-oct-2025)
- [MCP 规范 — 架构 (2025-03-26)](https://mcp-protocol.org/spec/architecture-2025-03-26)
- [OpenAI — 函数调用指南](https://platform.openai.com/docs/guides/function-calling)
- [Google Cloud — Vertex AI 访问控制](https://cloud.google.com/vertex-ai/docs/general/access-control)
- [Red Hat — MCP 安全风险与控制 (2025)](https://www.redhat.com/en/blog/mcp-security-2025)
- [The Register — Anthropic ‘Mad Skills’ 报道 (2025-10-16)](https://www.theregister.com/2025/10/16/anthropic_claude_skills/)
- [OpenAI — Agents SDK MCP 文档 (2025)](https://platform.openai.com/docs/agents-sdk/mcp-2025)
- [Skywork AI 博客 — 原文章](https://skywork.ai/blog/ai-agent/claude-skills-vs-mcp-vs-llm-tools-comparison-2025/)