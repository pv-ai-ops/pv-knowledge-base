---
title: OpenAI Codex 升级概述
date: 2025-09-16 01:43:00
tags: [药物警戒, AI]
categories: [技术分析]
---

### OpenAI Codex 升级概述

- **主要更新**：OpenAI 于 2025 年 9 月 15 日发布了 Codex 的重大升级，引入了 GPT-5-Codex 模型，这是一个针对代理式编码优化的 GPT-5 变体，似乎能显著提升编码效率和自主性。
- **关键优势**：模型在简单任务上减少了 93.7% 的令牌使用，在复杂任务上增加两倍推理时间，能够独立处理超过 7 小时的大型项目；但需注意，AI 生成代码仍需人工审查以确保准确性。
- **适用范围**：集成于 CLI、IDE 扩展、云环境、GitHub 和 ChatGPT iOS 应用中，适用于软件工程师，但并非完全取代人类开发者的工具。
- **潜在争议**：虽然基准测试显示性能提升（如 SWE-bench 得分从 72.8% 提高到 74.5%），但一些观点认为这可能加剧开发者对 OpenAI 生态的依赖，同时需权衡安全风险。

#### GPT-5-Codex 的核心功能
GPT-5-Codex 专为真实世界的软件工程任务设计，包括构建项目、调试、重构和代码审查。它能根据任务复杂性动态调整思考时间，在交互式会话中快速响应，或独立执行长时间任务。根据报道，在测试中它能自主工作超过 7 小时，迭代修复问题并交付成功实现。 这使得它更像一个可靠的“编程伙伴”，但研究建议开发者始终监督输出，以避免潜在错误。

#### 工具与集成改进
升级包括 Codex CLI 的重建，支持图像附件（如截图和线框图）和进度跟踪；IDE 扩展兼容 VS Code 和 Cursor，实现本地-云无缝切换；云环境完成时间减少 90%，通过容器缓存和自动设置。 GitHub 代码审查功能能自动分析拉取请求，识别关键问题，并建议编辑。 这些改进旨在加速开发周期，但需考虑生态绑定可能带来的长期影响。

![Codex 云环境示例](/assets/openai-codex-升级概述-g07jg95aeams5rp.jpg)  
*图示：Codex 云环境的性能优化示例，展示任务完成时间减少 90%。*

#### 对开发者的影响
证据显示，这项升级可能帮助开发者卸载重复性工作，例如 Cisco Meraki 的技术主管表示，它帮助快速重构代码并保持项目进度。 然而，在敏感话题如安全上，建议平衡观点：AI 虽提升效率，但过度依赖可能引入风险。总体而言，它似乎适合专业开发者，但初学者应结合人工判断使用。

---

OpenAI 于 2025 年 9 月 15 日正式宣布了对 Codex 的全面升级，这一举措标志着 AI 辅助编程工具进入了一个新阶段。Codex 作为 OpenAI 的 AI 编码助手，此次更新引入了 GPT-5-Codex，这是一个基于 GPT-5 进一步优化的模型，专为“代理式编码”（agentic coding）任务设计。 该模型在处理复杂软件工程任务时表现出色，包括从零构建完整项目、添加功能、调试、执行大规模重构以及进行代码审查。不同于通用 GPT-5，GPT-5-Codex 被训练为更可控、更高效，能够遵循特定的代理指令（如 AGENTS.md 指南），生成高质量代码而无需过多风格提示。

此次升级的核心在于统一 Codex 体验，所有功能均通过单一 ChatGPT 账户访问，支持本地（如终端和 IDE）和云端之间的无缝上下文转移。这不仅提升了协作效率，还扩展了可用性，包括 GitHub 集成和 ChatGPT iOS 应用。 开发者可以通过 ChatGPT Plus、Pro、Business、Edu 和 Enterprise 计划访问，定价根据使用量灵活调整，企业计划支持共享积分池。

在性能方面，GPT-5-Codex 展示了显著的效率提升。根据内部基准，对于用户交互的最简单 10% 转弯，它比 GPT-5 消耗的令牌减少了 93.7%；对于最复杂 10% 的转弯，它则投入两倍的推理时间，包括编辑、测试和迭代循环。 在 SWE-bench Verified 数据集上，该模型现在覆盖所有 500 个任务（此前基础设施限制下仅 477 个），得分从 GPT-5 的 72.8% 提升至 74.5%。 一个典型示例是处理 Gitea 拉取请求，该请求修改了 232 个文件和 3,541 行代码，以在整个应用逻辑中传播上下文变量，展示了其处理复杂依赖的能力。

前端开发能力也得到强化，GPT-5-Codex 能处理图像输入如截图，进行视觉检查，并在云中启动浏览器预览变化，并将进度截图附加到任务或 GitHub PR 中。这在人类偏好评估中表现更可靠，尤其在构建美观桌面应用和移动网站时。

工具链的更新同样值得关注。Codex CLI 被完全重建为开源工具（GitHub: https://github.com/openai/codex），围绕代理式工作流设计，支持图像附件（如截图、线框图和图表）以构建共享上下文，包含进度跟踪的待办事项列表，以及如网络搜索和 MCP（模型控制协议）的集成工具。 终端 UI 改进包括更好的工具调用和代码差异格式化。批准模式分为三种：只读（需显式批准行动）、自动（全工作区访问加外部批准）和全访问（允许文件读取和网络命令）。 此外，它支持压缩对话状态以管理长会话。

Codex IDE 扩展将代理集成到 VS Code、Cursor 等环境中，利用打开文件或选定代码的上下文，实现更短提示和更快结果。开发者可在 IDE 中创建云任务、跟踪进度，并无缝切换本地-云工作。 云环境基础设施优化显著，新任务完成时间中位数减少 90%，通过容器缓存和自动环境配置（如扫描设置脚本并执行）。可配置互联网访问允许运行如 pip install 的命令获取依赖。

代码审查功能是另一个亮点，GPT-5-Codex 能在 GitHub PR 从草稿转为就绪时自动触发，发布详细审查，识别关键缺陷，并建议编辑。可通过“@codex review”显式调用，并指定焦点如安全漏洞或过时依赖。 在 OpenAI 内部，它审查大部分 PR，每天捕获数百问题，帮助团队更快迭代。

![GPT-5-Codex 性能图表](/assets/openai-codex-升级概述-g07glujwiaageir.png)  
*图示：GPT-5-Codex 在编码效率上的基准比较，展示其在 SWE-bench 中的得分提升。*

从开发者反馈看，这一升级正改变工作流。Cisco Meraki 技术主管 Tres Wong-Godfrey 表示：“我需要为功能发布更新另一个团队的代码库……用 Codex，我卸载了重构和测试生成，同时专注于其他优先事项。它产生了高质量、全面测试的代码，我能快速交还——保持功能进度而不增加风险。” 类似证言显示，它适合协作设置，但需人工监督。

安全性和可信赖性是重点。Codex 默认在禁用网络访问的沙盒环境中运行，以防有害行动或提示注入。 模型可在危险操作前请求许可，并验证输出。开发者可自定义设置，如限制云网络到受信任域，或在 CLI/IDE 中批准命令。GPT-5-Codex 在生物和化学领域被分类为“高能力”，实施额外防护（如系统卡附录所述）。 OpenAI 强调，始终审查代理工作，使用提供的引用、日志和测试结果；Codex 作为辅助审查者，而非人类替代。

![Codex CLI 更新示例](/assets/openai-codex-升级概述-g07ge_8akaaa3ga.jpg)  
*图示：Codex CLI 的新界面，展示 GPT-5-Codex 的推荐动画和版本更新。*

展望未来，这一升级可能加速 AI 在编程中的采用，但也引发讨论：OpenAI 通过垂直优化构建生态护城河，开发者需权衡绑定风险。 与 Claude Code 等竞品比较，GPT-5-Codex 在代理任务上更强，但需更多实测验证。 OpenAI 邀请社区反馈，并提供快速入门指南（如 https://developers.openai.com/codex/security）。总体而言，这次更新强化了 Codex 作为 AI 增强工具的地位，但成功取决于开发者采用和持续迭代。

| 功能             | 关键改进                                          | 示例用例                   | 性能指标                               |
| ---------------- | ------------------------------------------------- | -------------------------- | -------------------------------------- |
| GPT-5-Codex 效率 | 简单任务令牌减少 93.7%；复杂任务推理时间增加 2 倍 | 独立执行 7+ 小时大型任务   | SWE-bench：全 500 任务覆盖，得分 74.5% |
| CLI 批准模式     | 只读、自动、全访问                                | 带图像的安全命令执行       | 长会话状态压缩                         |
| 云设置           | 完成时间减少 90%；自动脚本执行                    | 依赖获取（如 pip install） | 浏览器集成用于前端                     |
| 代码审查         | 自动 PR 分析；测试验证                            | GitHub 集成检查漏洞        | OpenAI 内部每天捕获数百问题            |
| IDE 扩展         | 上下文感知编辑                                    | 本地-云无缝转移            | 通过打开文件上下文更快提示             |

![OpenAI 公告海报](/assets/openai-codex-升级概述-g07felhxgaa1wki.jpg)  
*图示：OpenAI 关于 GPT-5-Codex 的宣传图，强调其编码自动化潜力。*

### Key Citations
- [Introducing upgrades to Codex - OpenAI](https://openai.com/index/introducing-upgrades-to-codex/)
- [OpenAI upgrades Codex with a new version of GPT-5 - TechCrunch](https://techcrunch.com/2025/09/15/openai-upgrades-codex-with-a-new-version-of-gpt-5/)
- [OpenAI debuts GPT-5-Codex model to automate time-consuming coding tasks - SiliconANGLE](https://siliconangle.com/2025/09/15/openai-debuts-gpt-5-codex-model-automate-time-consuming-coding-tasks/)
- [Addendum to GPT-5 system card: GPT-5-Codex - OpenAI](https://openai.com/index/gpt-5-system-card-addendum-gpt-5-codex/)
- [GPT-5-Codex, IDE upgrades, faster cloud, and built-in code review - Reddit](https://www.reddit.com/r/cursor/comments/1nhwcmq/new_codex_release_gpt5codex_ide_upgrades_faster/)
- [OpenAI Introduces GPT-5-Codex: An Advanced Version of GPT-5 - MarkTechPost](https://www.marktechpost.com/2025/09/15/openai-introduces-gpt-5-codex-an-advanced-version-of-gpt-5-further-optimized-for-agentic-coding-in-codex/)
- [OpenAI unveils new model GPT-5-Codex optimized for 'agentic coding' - VentureBeat](https://venturebeat.com/dev/openai-unveils-new-model-gpt-5-codex-optimized-for-agentic-coding)
- [GPT‑5-Codex and upgrades to Codex - Simon Willison's Weblog](https://simonwillison.net/2025/Sep/15/gpt-5-codex/)
- [OpenAI Launches a New GPT-5 Model for Its Codex Coding Agent - The New Stack](https://thenewstack.io/openai-launches-a-new-gpt-5-model-for-its-codex-coding-agent/)
- [OpenAI 刚刚发布了 GPT-5-Codex！ - X Post by @geekshellio](https://x.com/geekshellio/status/1967759953302786399)