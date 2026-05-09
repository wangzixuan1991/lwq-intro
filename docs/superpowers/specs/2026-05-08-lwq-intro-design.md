# 李文琦个人网站 — 设计规格 (spec)

**作者**: wangzx@microsoft.com  ·  **日期**: 2026-05-08  ·  **网站主体**: 李文琦（北大博雅博士后）

---

## 1. 目标

为李文琦搭建一个**双语（zh/en）个人学术站**，部署到 GitHub Pages，移动+桌面端响应式。

工作流分两段：

1. **第一段（本 spec 范围）**：搭网站骨架 + 内容收集器 + 风格切换器，全部用 placeholder/已知 CV 内容。
2. **第二段（后续）**：李文琦填好收集器 → 导出 JSON → 我导入 → 网站上线最终内容；同时她确认风格后删除另外两个 theme。

## 2. 参考与风格

- **结构 1:1 仿** [renwenzhang.com](https://renwenzhang.com/)：单页滚动 + 顶部 nav 切到独立子页面；衬线/无衬线混排；neutral 调色；em-dash 风格分隔线。
- **第二参考** [qunfangwu.com/home](https://www.qunfangwu.com/home)：近现代学术站的 social 链接条 + News 区。
- **设计语言**：现代、大气、温润，呼应李文琦的数字人文/古文献研究方向（Editorial 候选会偏古典；Modern Minimal 与 Classical Premium 提供对照）。

## 3. 站点结构

5 个一级 nav：

| Nav | 内容 |
|---|---|
| **Home** | Hero 横幅 + 头像 + 名字 + 单位/职称 + 联系方式 + 社交链 + Bio + 教育/工作经历摘要 + News（动态） |
| **Research** | 研究方向（标签云/小卡片）+ Publications（按 Journal / Conference / Under Review / Books & Chapters / Patents 5 类列出，可展开摘要） |
| **Projects** | 科研项目（横幅卡片，含起止年/角色/资助方）+ 教学项目 |
| **Teaching** | 联合/客座/助教经历 + Talks（按年倒序）+ Awards |
| **CV** | 全部内容年表 + 下载 PDF 按钮（链接到 placeholder PDF） |

底部 footer：版权 / 主题作者归属 / 双语切换。

中英切换：nav 右上角 `中 / EN` 按钮。

### 3.1 Hero 区块（Home 页）

- 顶部全宽横幅图（默认 placeholder gradient，李文琦后续提供）
- 头像（圆形或方形圆角，placeholder 灰底）
- 中文名「李文琦」+ 英文名「Wenqi Li」
- 一行职位/单位：「博雅博士后 · 助理研究员 / 北京大学信息管理系」
- 一行 social 链：Email · Google Scholar · ORCID · GitHub · LinkedIn（placeholder URL）

### 3.2 News 区块（Home 页底部）

renwenzhang 风格：每条 `[YYYY-MM]` 起始，dated entries 倒序。
首批从 CV 自动生成 6-10 条（如「2025.10 受邀报告 KU-KADH」「2025.04 CHI'25 Yokohama」「2025 ASIS&T Best Paper」「2024 北京大学博雅博士后入站」等），由收集器中可让她增改。

### 3.3 已有内容映射

CV 中以下内容直接进入网站，不需她重填：

- 期刊论文 9 篇 / 会议论文 13 篇 / 在审 3 篇 / 编著 2 项 / 专利 1 项
- 科研项目 11 项 / 教学项目 3 项
- 荣誉 10 项
- 教学经历 11 项
- 学术报告 12 项 / 活动组织 8 项
- 教育背景 3 段 / 工作经历 3 段
- 中文 bio + 英文 bio

收集器中**预填**这些字段，李文琦只需确认/微调。

## 4. 技术栈

- **Astro 4** + Tailwind CSS + 内置 i18n（zh 默认、en 可切换）
- **Content Collections**（type: `data`）：`publications` / `news` / `projects` / `talks` / `awards` / `teaching` / `experience`，每个集合一个 zh + en 字段对照
- **Theme system**：CSS variable 三套主题（`theme-editorial` / `theme-modern` / `theme-classical`），切换器写 localStorage + body class
- **构建/部署**：GitHub Actions workflow `.github/workflows/deploy.yml`，push to main → astro build → publish to `gh-pages` branch
- **包管理**：pnpm（最快），Node 20

## 5. 风格切换器

右上角浮动按钮 `Theme: A · B · C`，点击循环切换。

### 5.1 三个 theme

| | A · Editorial | B · Modern Minimal | C · Classical Premium |
|---|---|---|---|
| 灵感 | 我手写，参考 Notion / Claude DESIGN.md | Linear / Vercel DESIGN.md | Apple DESIGN.md |
| 标题字 | Source Serif / Cormorant | Inter / Geist | SF Pro Display alt（Inter Tight） |
| 正文字 | Inter | Inter | Inter |
| 主色 | `#F8F5EE` 米白 + `#1F1B16` 深棕字 + `#9C8B6E` 暖金 | `#FFFFFF` 纯白 + `#0A0A0A` 黑字 + `#0066FF` 蓝重点 | `#FAFAFA` 浅灰 + `#1D1D1F` 深灰 + 极少 accent |
| 分隔 | em-dash `————` | 1px hairline 灰线 | 大留白，无线 |
| 风格关键词 | 温润、学术、有书卷气 | 紧凑、克制、冷峻 | 极简、奢华、屏息感 |

源文件来自 `VoltAgent/awesome-claude-design`（按需 fetch 对应 DESIGN.md 转 CSS variables）。

### 5.2 选定后清理

李文琦回复「我选 X」后，由我执行：
- 删除其他两个 theme 的 CSS 文件
- 删除切换器 UI
- 把选中 theme 设为唯一的 root 样式

## 6. 内容收集器（`/collector/index.html`）

**单文件，零依赖**，用 vanilla JS。本地双击打开即用。

### 6.1 字段（按 section 分组，所有字段预填现有内容）

1. **基本信息**：中英文姓名、职称、单位、邮箱、电话（可选公开）、办公地址
2. **照片与图片**：头像（建议 ≥ 800×800，placeholder 占位提示）、Hero 横幅（可选）、备用照片若干
3. **社交/学术 ID**：Google Scholar、ORCID、GitHub、LinkedIn、X/Twitter、ResearchGate、个人邮箱
4. **Bio**：中文 + 英文（已预填）
5. **研究方向**：标签列表（已预填 5 个）
6. **News 动态**：日期 + 文本，可增删（已预填 8 条）
7. **Publications**：5 个分类 × 多条（已预填全部 27 项），可改顺序、增删、加链接
8. **Projects**：科研 + 教学（已预填 14 项）
9. **Talks / Activities**（已预填 20 项）
10. **Awards**（已预填 10 项）
11. **Teaching**（已预填 11 项）
12. **Experience**（已预填 3 段）
13. **Section 选择题**：是否要 Blog · 是否要 Photo Gallery · 是否要单独 News 页 · 是否公开手机号
14. **Theme 偏好**：A/B/C，可选「都看一下再决定」
15. **PDF CV 上传**（base64 内嵌或仅文件名标记）

### 6.2 交互

- 顶栏：`保存草稿` / `恢复草稿` / `导出 JSON` / `重置`
- 输入即自动写 localStorage（key: `lwq-content-draft`）
- `导出 JSON` 下载 `lwq-content-YYYYMMDD-HHmm.json`
- 顶栏进度条显示填写比例

### 6.3 导入流程

李文琦发回 JSON 后，我跑 `pnpm tsx scripts/import-content.ts <path>`，脚本把 JSON 拆进各 content collection 文件 + 把图片 base64 解出来放 `public/images/`。

## 7. GitHub 部署

1. `gh repo create wangzx_microsoft/lwq-intro --public --description "李文琦个人网站"`
2. 推首版代码
3. `.github/workflows/deploy.yml`：on push main → setup node 20 + pnpm → `pnpm build` → upload artifact → GitHub Pages action
4. 在 GitHub repo Settings → Pages → Source: GitHub Actions
5. 上线 URL：`https://wangzx_microsoft.github.io/lwq-intro/`（`astro.config.mjs` 设 `base: '/lwq-intro/'`）

## 8. 目录结构

```
lwq-intro/
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
├── public/
│   ├── images/          # 头像、横幅、PDF CV（placeholder）
│   └── collector/       # 收集器单文件副本（也可独立访问）
├── src/
│   ├── content/
│   │   ├── config.ts
│   │   ├── publications/  (zh.json, en.json 或合并 bilingual)
│   │   ├── news/
│   │   ├── projects/
│   │   ├── talks/
│   │   ├── awards/
│   │   ├── teaching/
│   │   └── experience/
│   ├── data/
│   │   └── profile.json   # 姓名、bio、社交链等单值字段
│   ├── i18n/
│   │   ├── zh.json
│   │   └── en.json
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── NewsList.astro
│   │   ├── PublicationList.astro
│   │   ├── ProjectCard.astro
│   │   ├── ThemeSwitcher.astro
│   │   └── LangSwitcher.astro
│   ├── styles/
│   │   ├── theme-editorial.css
│   │   ├── theme-modern.css
│   │   ├── theme-classical.css
│   │   └── base.css
│   └── pages/
│       ├── index.astro          # Home (zh)
│       ├── research.astro
│       ├── projects.astro
│       ├── teaching.astro
│       ├── cv.astro
│       └── en/                  # 英文版镜像
│           ├── index.astro
│           └── ...
├── collector/
│   └── index.html              # 独立单文件收集器（也复制一份到 public/）
├── scripts/
│   └── import-content.ts       # JSON → content collections 导入器
├── docs/
│   └── superpowers/specs/2026-05-08-lwq-intro-design.md
└── .github/workflows/deploy.yml
```

## 9. 范围边界（YAGNI）

**本 spec 不做**：
- 后端、CMS、数据库
- 评论系统、分析埋点、SEO 高级优化
- 多语言切换的自动翻译（中英都由收集器人工提供）
- Blog（除非她在收集器里勾选）
- Theme 编辑器（只让她在 3 个固定 theme 中选）

**本 spec 不包含**：第二段流程（导入她填好的 JSON、删 theme、迭代视觉细节）—— 等她填回再做。

## 10. 验收标准

- [ ] `pnpm dev` 本地能跑，5 个 nav 都通，中英都通
- [ ] 移动端（< 768px）单列流式，桌面（≥ 1024px）多列；Lighthouse mobile ≥ 90
- [ ] 3 个 theme 切换无白屏，刷新保留选中
- [ ] `collector/index.html` 双击 macOS Safari/Chrome 都可用，导出 JSON schema 与 import 脚本对齐
- [ ] GitHub Actions 绿、`https://wangzx_microsoft.github.io/lwq-intro/` 可访问
- [ ] 全站可见处至少 80% 由 CV 真实内容渲染（剩下 20% 为 photo / 个性化内容 placeholder）

## 11. 后续 plan 文件

实施计划见同目录 `2026-05-08-lwq-intro-plan.md`（下一步生成）。
