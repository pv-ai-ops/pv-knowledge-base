---
title: Qwen3-Next 模型概述
date: 2025-09-16 01:43:00
tags: [药物警戒, AI]
categories: [技术分析]
---

### Qwen3-Next 模型概述

**关键点：**
- Qwen3-Next 是阿里巴巴通义千问团队于 2025 年 9 月 10 日发布的下一代大语言模型架构，强调训练和推理效率，总参数 80B 但仅激活 3B 参数，实现与 Qwen3-32B 相当的性能，同时训练成本降低 90% 以上。
- 核心创新包括混合注意力机制（Gated DeltaNet + Gated Attention）和超稀疏 MoE 结构（512 专家，仅激活 11 个），支持 256K 上下文长度，并通过多令牌预测提升解码速度。
- 基准测试显示，其 Instruct 变体在知识、推理和编码任务中超越 Qwen3-32B，接近 Qwen3-235B；Thinking 变体在多步推理中优于 Gemini-2.5-Flash-Thinking。
- 模型开源，支持 Hugging Face 等平台，可在单张 NVIDIA H200 GPU 上运行，适用于企业级部署，但目前仅限文本模态。

#### 模型架构简述
Qwen3-Next 采用 48 层混合布局：每 4 层中 3 层使用 Gated DeltaNet（高效长上下文处理），1 层使用 Gated Attention（确保精度）。MoE 组件激活率仅 3.7%，结合共享专家机制，避免路由崩溃。

![Qwen3-Next 混合架构示意图](https://pbs.twimg.com/media/G0lVrz1aMAMqnVP.jpg)

#### 性能与效率亮点
在推理速度上，预填充阶段在 4K 上下文下吞吐量比 Qwen3-32B 高 7 倍，长上下文下超 10 倍。训练仅需 Qwen3-32B 的 9.3% 计算资源。

![预训练效率与推理速度图](https://pbs.twimg.com/media/G0ldAWZakAAGBdx.jpg)

#### 可用性
模型可在 Hugging Face（https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct）和 Alibaba Cloud API 上获取，支持 Transformers、vLLM 等框架。

---

阿里巴巴通义千问团队于 2025 年 9 月 10 日正式发布 Qwen3-Next 系列模型，这标志着大语言模型（LLM）设计向极致效率方向的重大跃进。该架构作为 Qwen3.5 的预览版本，针对训练和推理阶段的资源瓶颈进行了全面优化，实现了参数规模与性能的完美平衡。旗舰模型 Qwen3-Next-80B-A3B 拥有 800 亿总参数，但每令牌仅激活约 30 亿参数，激活率低至 3.7%，从而大幅降低计算成本，同时在多项基准测试中表现出色，接近甚至超越更大规模的 Qwen3-235B 模型。

### 架构创新：混合注意力与超稀疏 MoE
Qwen3-Next 的核心在于其创新的混合注意力机制和 MoE 设计，彻底改变了传统 Transformer 的范式。模型总共 48 层，采用重复的 12 个模块模式：每个模块包含 3 层 Gated DeltaNet（门控 DeltaNet，用于高效的增量更新和长序列处理）后跟 1 层 Gated Attention（门控注意力，用于精确的全局依赖捕捉）。这种 75% DeltaNet + 25% Attention 的布局，确保了在长上下文（原生支持 256K 令牌，可扩展至 1M）下的高效性和稳定性。

Gated DeltaNet 作为“快速阅读器”，通过线性注意力机制减少二次方复杂度，支持更好的上下文学习；Gated Attention 则作为“仔细检查器”，集成输出门控以缓解低秩退化问题，使用 16 个查询头和 2 个键-值头（每个 256 维），并将旋转位置嵌入（RoPE）限制在前 64 维以提升外推能力。此外，模型引入零中心 RMSNorm 替换 QK-Norm，对归一化参数施加权重衰减，并以归一化方式初始化 MoE 路由器，进一步提升训练稳定性。

MoE 组件是另一大亮点：总计 512 个专家，每步仅路由 10 个专家 + 1 个共享专家，激活率远低于前代 Qwen3 的 128 专家。该共享专家处理常见模式，避免路由崩溃，并与多令牌预测（MTP）结合，支持推测解码，提高接受率和多步推理速度。

![Qwen3-Next 混合架构示意图](https://pbs.twimg.com/media/G0lVrz1aMAMqnVP.jpg)

### 训练效率：资源节约的典范
Qwen3-Next 在 15 万亿令牌数据集上预训练，仅消耗 Qwen3-32B 的 9.3% 计算资源和 Qwen3-30B-A3B 的 80% GPU 时长。在 32 张 GPU A6000 集群上，与 Megatron-LM、Tutel-2DH 和 SmartMoE 等基线相比，实现 1.55–3.32 倍 All-to-All 通信加速和 1.18–1.27 倍端到端训练加速。这种高效性源于稀疏激活和优化通信策略，使其适用于中小型研究团队。

### 推理性能：速度与精度的双赢
推理阶段，Qwen3-Next 展现出惊人优势：在 4K 上下文下，预填充吞吐量比 Qwen3-32B 高近 7 倍，超过 32K 时超 10 倍；解码阶段在 4K 下高 4 倍，长上下文仍保持 10 倍以上优势。FP8 精度下，可在单张 NVIDIA H200 GPU 上运行，或 8-12GB VRAM + 64GB RAM 的系统。支持框架包括 Transformers、SGLang 和 vLLM，Alibaba Cloud API 定价为每百万令牌 0.5 美元输入 / 2-6 美元输出，比前代降低 25%。

![预填充阶段吞吐量图](https://pbs.twimg.com/media/G0ldN9sbAAAwSft.jpg)

![解码阶段吞吐量图](https://pbs.twimg.com/media/G0ldUVubUAA_LbW.jpg)

### 基准测试：超越同规模，媲美旗舰
Qwen3-Next 的变体包括 Base（基础模型）、Instruct（通用任务）和 Thinking（逐步推理）。Base 模型在下游任务中超越 Qwen3-32B-Base，尽管训练成本仅为其 10%。Instruct 变体在知识（MMLU-Pro 80.6）、推理（AIME25 69.5）和编码（LiveCodeBench 56.6）上领先 Qwen3-32B 非思考版，接近 Qwen3-235B-A22B-Instruct-2507。在长上下文 RULER 基准中，256K 内表现优异。

Thinking 变体在多步任务中击败 Gemini-2.5-Flash-Thinking，Intelligence Index 达 54（Artificial Analysis），与 DeepSeek V3.1 (Reasoning) 相当。以下表格总结 Instruct 变体的关键基准对比（数据基于官方评估）：

| 类别   | 基准测试                       | Qwen3-30B-A3B-Instruct-2507 | Qwen3-32B 非思考版 | Qwen3-235B-A22B-Instruct-2507 | Qwen3-Next-80B-A3B-Instruct |
| ------ | ------------------------------ | --------------------------- | ------------------ | ----------------------------- | --------------------------- |
| 知识   | MMLU-Pro                       | 78.4                        | 71.9               | 83.0                          | 80.6                        |
|        | MMLU-Redux                     | 89.3                        | 85.7               | 93.1                          | 90.9                        |
|        | GPQA                           | 70.4                        | 54.6               | 77.5                          | 72.9                        |
|        | SuperGPQA                      | 53.4                        | 43.2               | 62.6                          | 58.8                        |
| 推理   | AIME25                         | 61.3                        | 20.2               | 70.3                          | 69.5                        |
|        | HMMT25                         | 43.0                        | 9.8                | 55.4                          | 54.1                        |
|        | LiveBench 20241125             | 69.0                        | 59.8               | 75.4                          | 75.8                        |
| 编码   | LiveCodeBench v6 (25.02-25.05) | 43.2                        | 29.1               | 51.8                          | 56.6                        |
|        | MultiPL-E                      | 83.8                        | 76.9               | 87.9                          | 87.8                        |
|        | Aider-Polyglot                 | 35.6                        | 40.0               | 57.3                          | 49.8                        |
| 对齐   | IFEval                         | 84.7                        | 83.2               | 88.7                          | 87.6                        |
|        | Arena-Hard v2                  | 69.0                        | 34.1               | 79.2                          | 82.7                        |
|        | Creative Writing v3            | 86.0                        | 78.3               | 87.5                          | 85.3                        |
| 代理   | AgentBench v2                  | 49.3                        | 39.5               | 62.7                          | 52.4                        |
|        | GAIA                           | 55.3                        | 47.3               | 64.2                          | 58.7                        |
|        | WebArena                       | 42.7                        | 38.1               | 51.9                          | 46.5                        |
| 多语言 | M-MMLU                         | 81.2                        | 74.6               | 85.3                          | 83.4                        |
|        | M-MT-Bench                     | 8.5                         | 7.9                | 8.9                           | 8.7                         |

![Instruct 模型性能对比图](https://pbs.twimg.com/media/G0nOUlmbMAABj52.jpg)

![Thinking 模型性能图](https://pbs.twimg.com/media/G0ldzaoaMAMiw3H.jpg)

![RULER 长上下文基准图](https://pbs.twimg.com/media/G0ldsnuaYAAMsm7.jpg)

### 社区反馈与未来展望
社区反应热烈：Hacker News 和 Reddit 用户赞赏其在有限硬件上的可访问性（如 8-12GB VRAM），并称其为“高效 LLM 的未来”。然而，一些开发者指出，需要专用推理框架以最大化效率。目前模型为纯文本，支持 Qwen-Agent 工具调用，但缺乏多模态功能。未来 Qwen3.5 将在此基础上进一步提升生产力，推动高性能 AI 的民主化。

总体而言，Qwen3-Next 以其平衡功率与实用性的设计，为企业和研究者提供了强大工具，尤其在资源受限场景下表现出色。

### Key Citations
- [Qwen3-Next - Qwen AI](https://qwen.ai/blog?id=4074cca80393150c248e508aa62983f9cb7d27cd&from=research.latest-advancements-list)
- [Qwen3-Next-80B-A3B: Towards Ultimate Training & Inference Efficiency](https://news.smol.ai/issues/25-09-11-qwen3-next)
- [Qwen/Qwen3-Next-80B-A3B-Instruct - Hugging Face](https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct)
- [Qwen released Qwen3-Next-80B-A3B — the FUTURE of efficient LLMs](https://www.reddit.com/r/LocalLLaMA/comments/1nefmzr/qwen_released_qwen3next80ba3b_the_future_of/)
- [Qwen3-Next: Towards Ultimate Training and Inference Efficiency](https://news.ycombinator.com/item?id=45214130)
- [Introducing Qwen3-Next-80B-A3B (X Post)](https://x.com/Alibaba_Qwen/status/1966197643904000262)
- [Pretraining Efficiency & Inference Speed (X Post)](https://x.com/Alibaba_Qwen/status/1966204984179175866)
- [Thinking Model Performance (X Post)](https://x.com/Alibaba_Qwen/status/1966205861292093471)
- [Instruct Model Performance (X Post)](https://x.com/Alibaba_Qwen/status/1966329580127727745)