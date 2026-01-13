---
title: Agentic Commerce The Google Protocol
date: 2026-01-13 02:59:51
tags: [药物警戒, AI, PDF]
categories: [资料库]
---

## 📄 PDF 文档

- 在线预览（幻灯片模式）：<a href="/pv-knowledge-base/pdf-slides.html?file=assets%2Fagentic_commerce_the_google_protocol.pdf&title=Agentic%20Commerce%20The%20Google%20Protocol" target="_blank" rel="noopener">点击打开</a>
- 下载：[/assets/agentic_commerce_the_google_protocol.pdf](/assets/agentic_commerce_the_google_protocol.pdf)

---

## 🖥️ 幻灯片预览（支持全屏）

<iframe src="/pv-knowledge-base/pdf-slides.html?file=assets%2Fagentic_commerce_the_google_protocol.pdf&title=Agentic%20Commerce%20The%20Google%20Protocol" frameborder="0" allowfullscreen style="width: 100%; height: 82vh; min-height: 520px; max-height: 1200px; border: 1px solid #e1e5e9; border-radius: 8px; margin: 20px 0;"></iframe>

<div class="pdf-search-index" style="display:none">
Agentic Commerce The Google Protocol (UCP)
代理式商务时代降临：解构谷歌通用商务协议（UCP）
深度解析：NRF 2026 发布会、AP2 安全机制、以及与 OpenAI 的协议之战

Slide 2 核心摘要：重构零售基础设施
Web Commerce（1990s）→ Mobile Commerce（2010s）→ Agentic Commerce（2026+）
战略转折点：谷歌不仅在构建 AI 购物助手，更在定义代理与商家沟通的底层语言——通用商务协议（UCP）
核心发布：UCP（用于发现与交易）；AP2（用于加密信任与支付）
关键盟友：Shopify（联合开发者）、Walmart、Target、PayPal、Stripe 等 20+ 行业巨头
市场目标：解决 AI 代理与数百万商家之间的 N×N 集成噩梦，推动 3-5 万亿美元市场
潜在冲突：与 OpenAI 的 ACP（Agentic Commerce Protocol）形成直接竞争，争夺未来互联网的“商务操作系统”地位

Slide 3 背景：从“搜索与浏览”到“授权与完成”
旧模式（Legacy）：Search & Scroll：用户搜索 → 打开多个标签页 → 比较 → 结账
新模式（Agentic）：Delegate & Done：用户指令 → 代理执行 → 确认
Morgan Stanley：约 50% 的在线购物者将使用 AI agents
McKinsey：Agentic Commerce 市场规模可达 3-5 Trillion（3-5 万亿美元）
结论：现有的电商基础设施是为人类点击按钮设计的，而代理式商务打破了这一基本假设

Slide 4 核心痛点：N×N 集成噩梦
Before UCP：Gemini / ChatGPT / Claude 需要分别对接 Target / Walmart / 小商家；Custom API、Auth Fail、Broken Feed
After UCP：通过 Universal Commerce Protocol（UCP）统一连接商家
互操作性（Interoperability）：零售商能够连接一次，触达所有关键（Prakhar Mehrotra，PayPal SVP）

Slide 5 解决方案：通用商务协议（UCP）
发现机制（Discovery）：代理通过读取商家的 /.well-known/ucp JSON 清单，自动识别商家能力（无需硬编码）
模块化设计（Modular Architecture）：覆盖购物全生命周期——发现（Discovery）、购物车（Cart）、结账（Checkout）及售后（Post-purchase/Returns）
商家主权（Merchant Sovereignty）：零售商保留“名义商家”（Merchant of Record）地位，继续拥有客户关系、数据和履约责任

Slide 6 信任层：代理支付协议（AP2）与加密凭证
Intent Mandate：意图凭证，委托任务（例如 100 美元以下）
Cart Mandate：购物车凭证，实时审批（Real-time Approval）
Non-repudiable Audit：不可抵赖审计
Payment Mandate：支付凭证
安全机制（Security）：所有步骤均经过加密签名，形成不可抵赖的审计追踪

Slide 7 技术架构：全栈解析
User Surfaces：Search AI Mode、Gemini App、Specialized Assistants
The Agent Layer：Logic & Reasoning（LLMs）
Protocol Layer（The Bridge）：UCP（Standardizes Commerce Actions）+ AP2（Security & Payment Tokens）
Transports：REST API / MCP / A2A
Merchant Backend：Shopify、Magento、Salesforce Commerce Cloud、Custom SQL
商家只需在 /.well-known/ucp 托管清单文件即可被发现

Slide 8 用户体验与商业化：“直接报价”与“商业代理”
商业代理（Business Agents）：虚拟导购，直接在聊天窗口内完成结账
直接报价（Direct Offers）：实时注入折扣，捕捉高意向时刻（Ready-to-buy moments）

Slide 9 生态联盟：谁在支持 UCP？
零售巨头（Retail）：Walmart、Target、Wayfair、Best Buy、Macy's、Home Depot
平台与技术（Tech/Platform）：Shopify、Etsy、Salesforce、ServiceNow
支付与金融（Payments）：Visa、Mastercard、American Express、PayPal、Stripe、Adyen
Web3/Crypto：Coinbase、Ethereum Foundation
Shopify 的深度参与确保了数百万中小商家的即时接入

Slide 10 战略深析：Shopify 的“基建化”转型
The Paradox（悖论）：为什么 Shopify 要支持一个可能使其结账页面商品化的标准？
The Strategy（战略）：Shopify 正在转型为 AI 时代的“底层供应库”
Agentic Plan：允许非 Shopify 商家将产品目录上传至 Shopify Catalog，利用其基础设施在 AI 渠道销售
Tobi Lütke（Shopify CEO）观点：商业往往发生在意想不到的地方（right on the other side）

Slide 11 协议之战：Google UCP vs. OpenAI ACP
Core Philosophy：Google UCP 生态系统优先（Ecosystem First）；OpenAI ACP 平台优先（Platform First）
Checkout Model：Google UCP 商家主导（Merchant of Record）；OpenAI ACP 平台托管（Instant Checkout）
Payment Rail：Google UCP：Google Pay、PayPal、AP2；OpenAI ACP：Stripe Link、Native
Strengths：Google UCP 深度集成零售巨头，控制权在商家；OpenAI ACP 用户体验极简，摩擦力最小
Verdict：UCP 旨在成为行业的 HTTP（通用标准），而 ACP 更像是 iOS App Store（高效围墙花园）

Slide 12 新支付轨道：加密货币与稳定币（x402）
为机器对机器（M2M）经济做准备
Tech Spec：x402 扩展协议（AP2 的扩展）
Partners：Coinbase、Ethereum Foundation、MetaMask
Use Case：代理进行的微支付（Micro-transactions）、托管支付（Escrow）以及即时结算

Slide 13 挑战与风险：通往 5 万亿市场的障碍
Hurdle 1：信任鸿沟（Trust Gap）：仅 46% 的消费者完全信任 AI 的产品推荐
Hurdle 2：数据卫生（Data Hygiene）：垃圾进，垃圾出；UCP 依赖高质量的结构化数据
Hurdle 3：采用率（Adoption）：让数百万长尾商家部署 .well-known 清单需要时间
监管不确定性（Regulation）：当 AI 买错东西时，谁负责？

Slide 14 路线图与实施计划
Now（Launch）：在美版 Google Search/Gemini 上线；合作伙伴：Lowe's、Michael's 启用“商业代理”
Q1 2026（Commercial Rollout）：更多零售商接入 UCP Checkout；PayPal 集成上线
Future（The Roadmap）：Multi-item carts、Identity Linking、Global Expansion（India、LATAM）

Slide 15 结论：零售业的新规则
我们正在见证商务领域的 HTTP 时刻
For Brands：清洗你的数据（Clean Data）；Merchant Center 的数据质量决定 AI 能否“看见”你
For Tech：构建互操作性（Build for Interoperability），而非围墙花园
For Strategy：准备好从 SEO（搜索引擎优化）转向 ACO（代理式商务优化）
结语：未来的商业不是关于谁控制界面，而是关于谁能让生态系统协同工作
</div>
