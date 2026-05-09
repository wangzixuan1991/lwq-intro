# 李文琦个人网站 — 实施计划 (plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建一个双语（zh/en）Astro 静态站，部署到 GitHub Pages，包含 5 页内容（Home / Research / Projects / Teaching / CV）+ 3 个可切换 theme + 一个本地内容收集器。

**Architecture:** Astro 5 + Tailwind + 内置 i18n；CSS 变量驱动 3 主题切换（localStorage 持久化）；content collections 存论文/News/项目等数据；GitHub Actions 自动部署到 Pages。

**Tech Stack:** Astro 5, Tailwind CSS 3, TypeScript 5, pnpm, Node 20+, vanilla JS（收集器）。

---

## 文件结构

```
lwq-intro/
├── package.json                                # 依赖
├── astro.config.mjs                            # Astro + i18n + base path
├── tailwind.config.mjs                         # Tailwind + CSS 变量颜色
├── tsconfig.json
├── .gitignore
├── public/
│   ├── images/                                 # 头像/横幅 placeholder
│   ├── cv-placeholder.pdf                      # PDF 下载占位
│   └── collector/index.html                    # 收集器（部署副本）
├── src/
│   ├── content/
│   │   ├── config.ts                           # collection 模式
│   │   ├── publications/*.json                 # 27 篇论文
│   │   ├── news/*.json                         # 8-10 条
│   │   ├── projects/*.json                     # 14 项
│   │   ├── talks/*.json                        # 20 项
│   │   ├── awards/*.json                       # 10 项
│   │   ├── teaching/*.json                     # 11 项
│   │   ├── experience/*.json                   # 3 段
│   │   └── education/*.json                    # 3 段
│   ├── data/profile.json                       # 姓名/单位/社交链/bio
│   ├── i18n/{zh,en}.json                       # UI 文案
│   ├── styles/
│   │   ├── base.css                            # tailwind base + 全局
│   │   └── themes.css                          # A/B/C 三主题 CSS 变量
│   ├── lib/i18n.ts                             # getStrings(locale)
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── NewsList.astro
│   │   ├── PublicationList.astro
│   │   ├── ProjectCard.astro
│   │   ├── ThemeSwitcher.astro
│   │   └── LangSwitcher.astro
│   ├── layouts/BaseLayout.astro
│   └── pages/
│       ├── index.astro                          # Home (zh)
│       ├── research.astro
│       ├── projects.astro
│       ├── teaching.astro
│       ├── cv.astro
│       └── en/{index,research,projects,teaching,cv}.astro
├── collector/index.html                        # 收集器源码（双击即用）
├── scripts/import-content.ts                   # JSON → content collections
├── .github/workflows/deploy.yml                # GitHub Pages CI
└── docs/superpowers/{specs,plans}/*.md
```

---

## Task 1: 项目脚手架（已部分完成）

**Files:**
- Verify: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `.gitignore`
- Create: `README.md`

- [ ] **Step 1: 检查脚手架文件**

```bash
ls -la /Users/wangzx2026/Desktop/lwq-intro/
```

确保已存在：`package.json` `astro.config.mjs` `tailwind.config.mjs` `tsconfig.json` `.gitignore`。

- [ ] **Step 2: 安装依赖**

```bash
cd /Users/wangzx2026/Desktop/lwq-intro && pnpm install
```

预期：`node_modules/` 出现，无报错。

- [ ] **Step 3: 初始化 git**

```bash
cd /Users/wangzx2026/Desktop/lwq-intro && git init -b main && git add -A && git commit -m "chore: scaffold Astro project"
```

---

## Task 2: 主题 CSS（base + 3 themes）

**Files:**
- Create: `src/styles/base.css`
- Create: `src/styles/themes.css`

- [ ] **Step 1: 写 base.css**

```css
/* src/styles/base.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { font-family: var(--font-sans); color: var(--c-ink); background: var(--c-bg); }
  body { min-height: 100vh; }
  h1, h2, h3, h4 { font-family: var(--font-display); letter-spacing: -0.01em; }
  .prose-serif h1, .prose-serif h2, .prose-serif h3 { font-family: var(--font-serif); }
  a { color: var(--c-accent); text-decoration: none; }
  a:hover { text-decoration: underline; text-underline-offset: 4px; }
  hr.emdash { border: 0; text-align: center; color: var(--c-rule); }
  hr.emdash::before { content: "————————————————"; letter-spacing: -0.05em; }
  ::selection { background: var(--c-accent); color: var(--c-bg); }
}
```

- [ ] **Step 2: 写 themes.css（3 个 theme）**

```css
/* src/styles/themes.css */
:root,
[data-theme="editorial"] {
  --c-bg: #F8F5EE;
  --c-surface: #FFFDF7;
  --c-ink: #1F1B16;
  --c-muted: #6B5F4E;
  --c-accent: #9C8B6E;
  --c-rule: #D7CDB8;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: 'Source Serif 4', 'Cormorant Garamond', Georgia, serif;
  --font-display: var(--font-serif);
}

[data-theme="modern"] {
  --c-bg: #FFFFFF;
  --c-surface: #F7F7F8;
  --c-ink: #0A0A0A;
  --c-muted: #6B7280;
  --c-accent: #0066FF;
  --c-rule: #E5E7EB;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: var(--font-sans);
  --font-display: 'Inter Tight', var(--font-sans);
}

[data-theme="classical"] {
  --c-bg: #FAFAFA;
  --c-surface: #FFFFFF;
  --c-ink: #1D1D1F;
  --c-muted: #86868B;
  --c-accent: #1D1D1F;
  --c-rule: #D2D2D7;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: 'Inter Tight', sans-serif;
  --font-display: var(--font-serif);
}
```

- [ ] **Step 3: commit**

```bash
git add src/styles && git commit -m "feat: add base + 3 themes CSS"
```

---

## Task 3: i18n 字符串

**Files:**
- Create: `src/i18n/zh.json`, `src/i18n/en.json`
- Create: `src/lib/i18n.ts`

- [ ] **Step 1: 写 zh.json**

```json
{
  "nav": { "home": "首页", "research": "研究", "projects": "项目", "teaching": "教学", "cv": "履历" },
  "hero": { "viewCV": "查看履历", "downloadCV": "下载 CV (PDF)" },
  "sections": {
    "bio": "个人简介",
    "education": "教育背景",
    "experience": "工作经历",
    "news": "动态",
    "research_areas": "研究方向",
    "publications": "学术成果",
    "journal": "期刊论文",
    "conference": "会议论文",
    "under_review": "在审论文",
    "book": "编著与章节",
    "patent": "专利",
    "research_projects": "科研项目",
    "teaching_projects": "教学项目",
    "talks": "学术报告",
    "organized": "活动组织",
    "awards": "荣誉奖励",
    "teaching_exp": "教学经历",
    "contact": "联系方式"
  },
  "footer": { "rights": "保留所有权利", "switchLang": "EN" }
}
```

- [ ] **Step 2: 写 en.json**

```json
{
  "nav": { "home": "Home", "research": "Research", "projects": "Projects", "teaching": "Teaching", "cv": "CV" },
  "hero": { "viewCV": "View CV", "downloadCV": "Download CV (PDF)" },
  "sections": {
    "bio": "About",
    "education": "Education",
    "experience": "Experience",
    "news": "News",
    "research_areas": "Research Areas",
    "publications": "Publications",
    "journal": "Journal Articles",
    "conference": "Conference Papers",
    "under_review": "Under Review",
    "book": "Books & Chapters",
    "patent": "Patents",
    "research_projects": "Research Projects",
    "teaching_projects": "Teaching Projects",
    "talks": "Talks",
    "organized": "Service & Organization",
    "awards": "Awards",
    "teaching_exp": "Teaching",
    "contact": "Contact"
  },
  "footer": { "rights": "All rights reserved", "switchLang": "中" }
}
```

- [ ] **Step 3: 写 i18n helper**

```ts
// src/lib/i18n.ts
import zh from '../i18n/zh.json';
import en from '../i18n/en.json';

export type Locale = 'zh' | 'en';
export const strings = { zh, en } as const;
export const t = (locale: Locale) => strings[locale];
export const pickLang = <T extends { zh: string; en: string }>(item: T, locale: Locale) =>
  item[locale] || item.zh || item.en;
export const localePath = (locale: Locale, path: string) => locale === 'en' ? `/en${path}` : path;
```

- [ ] **Step 4: commit**

```bash
git add src/i18n src/lib && git commit -m "feat: add i18n strings and helper"
```

---

## Task 4: Profile 数据 + 内容 schema

**Files:**
- Verify: `src/content/config.ts` (already created)
- Create: `src/data/profile.json`

- [ ] **Step 1: 写 profile.json（从 CV/bio 提取）**

```json
{
  "name": { "zh": "李文琦", "en": "Wenqi Li" },
  "title": {
    "zh": "博雅博士后 · 助理研究员",
    "en": "Boya Postdoctoral Fellow · Assistant Research Fellow"
  },
  "affiliation": {
    "zh": "北京大学信息管理系 · 数字人文研究中心",
    "en": "Department of Information Management & Digital Humanities Research Center, Peking University"
  },
  "email": "wenqili@pku.edu.cn",
  "phone": "+86 18610656507",
  "phonePublic": false,
  "social": {
    "googleScholar": "https://scholar.google.com/",
    "orcid": "https://orcid.org/",
    "github": "https://github.com/",
    "linkedin": "https://www.linkedin.com/",
    "twitter": ""
  },
  "researchAreas": {
    "zh": ["数字人文", "数字文化遗产", "人机交互", "数据行为", "数据管护"],
    "en": ["Digital Humanities", "Digital Cultural Heritage", "Human-Computer Interaction", "Data Behavior", "Data Curation"]
  },
  "bio": {
    "zh": "李文琦，北京大学信息管理系博雅博士后。她于北京大学信息管理系获情报学博士学位，并在华盛顿大学人本设计与工程系获理学硕士学位。研究方向涵盖数字人文、人机交互与数据行为，关注人文学者的数据实践与数据管护，以及如何借助 AI 服务于文化遗产的保护与公众参与。研究成果发表于 JASIST、ACM CHI、JCDL 等国内外重要期刊与会议。在进入学术界之前，她在微软（美国）与阿里巴巴累计四年用户体验设计经验。",
    "en": "Li Wenqi is a Boya Postdoctoral Fellow in the Department of Information Management and the Digital Humanities Research Center at Peking University. She holds a PhD in Information Science from Peking University and an M.S. in Human-Centered Design & Engineering from the University of Washington. Her research spans digital humanities, human-computer interaction, and data behavior. She has examined humanities scholars' data practices and data curation approaches that support the shift toward data-driven research in the humanities. More recently, her work explores how AI can be applied to the preservation and public engagement of cultural heritage. Her research has been published in venues including JASIST, ACM CHI, and JCDL, and she has contributed to digital curation projects focused on ancient Chinese texts. Prior to entering academia, she gained four years of industry experience as a user experience designer at Microsoft and Alibaba Cloud."
  },
  "heroImage": "/lwq-intro/images/hero-placeholder.svg",
  "avatar": "/lwq-intro/images/avatar-placeholder.svg",
  "cvPdf": "/lwq-intro/cv-placeholder.pdf"
}
```

- [ ] **Step 2: commit**

```bash
git add src/data src/content/config.ts && git commit -m "feat: profile data + content schema"
```

---

## Task 5: 种子内容（从 CV 提取）

**Files (all under `src/content/`):**
- `publications/p01.json` … `p27.json`
- `news/n01.json` … `n08.json`
- `projects/r01.json`…（11 项）+ `t01.json`…（3 项）
- `talks/t01.json`…（20 项）
- `awards/a01.json`…（10 项）
- `teaching/te01.json`…（11 项）
- `experience/e01.json`…（3 项）
- `education/ed01.json`…（3 项）

> 因数量较多（共 ~100 个 JSON），**执行时一次性 write 一批**，不逐个分步。每个文件极简，schema 已在 `config.ts`。下面给出每类的**示范文件**，剩余文件按相同结构填充 CV 中其余条目。

- [ ] **Step 1: 期刊论文示范（共 9 篇）**

`src/content/publications/p01.json`:
```json
{
  "category": "journal",
  "year": 2026,
  "authors": "Wenqi Li, Zeyang Luo, Pengyi Zhang*",
  "title": {
    "zh": "Exploring Immersive Cultural Heritage Experiences: A User Study of a VR Application Featuring Ancient Manuscript",
    "en": "Exploring Immersive Cultural Heritage Experiences: A User Study of a VR Application Featuring Ancient Manuscript"
  },
  "venue": { "zh": "Information Research, 31(iConf): 392-409", "en": "Information Research, 31(iConf): 392-409" },
  "note": { "zh": "[SSCI]", "en": "[SSCI]" },
  "order": 1
}
```

剩余期刊（按 CV 顺序填）：
- p02 = JASIST 2025 (Tianji Jiang, Wenqi Li, Jiqun Liu*)
- p03 = JASIST 2024 (Wenqi Li, Jun Wang*, Fengxiang Wang)
- p04 = DSH 2024 (Book cluster)
- p05 = Information Research 2024 (Ellis' model)
- p06 = 图书馆论坛 2025 (古文献 VR)
- p07 = 中国图书馆学报 2023 (历代史志目录)
- p08 = 图书情报知识 2022 (数字人文交互可视化)
- p09 = 图书情报工作 2022 (数据行为概念)

- [ ] **Step 2: 会议论文（13 篇）**

每条同结构，`category: "conference"`。完整列表：
1. CHI'26 — From Platform Data to Personal Insight
2. CHIIR'26 — Improving Data Reusability
3. CHI'25 — Beyond Explicit and Implicit
4. ASIS&T'25 — Engaging with AI in Crowdsourced Digitization (Best Conference Paper)
5. JCDL'25 — Collaborative Data Behaviors
6. CSCW'25 Companion — I feel recognized
7. iConf'23 — Towards a Useful Chinese Annotation Tool
8. ASIS&T'23 — Humanities Scholars' Understanding of Data
9. iConf'23 — Characterizing Data Practices
10. JCDL'21 — Exploring the Classification
11. CHI'21 EA — Baby Steps for Easier Accessibility
12. CSCW'19 Companion — How Consistent Is Your GUI Design
13. CSCW'16 — Out of time, out of place

- [ ] **Step 3: 在审论文（3 篇）**

`category: "under_review"`：
1. JASIST — Data-driven or Structure-driven
2. 图书情报知识 — 数据管护模型综述
3. 图书馆论坛 — AIGC 赋能图书馆典藏

- [ ] **Step 4: 编著与章节（2 项）+ 专利（1 项）**

`category: "book"` 2 项，`category: "patent"` 1 项（202511737406.2）。

- [ ] **Step 5: News（首批 8 条，由 CV 自动生成）**

`src/content/news/n01.json`:
```json
{
  "date": "2026-04",
  "text": {
    "zh": "AI 智能体协同知识建构方法专利获授权",
    "en": "Patent on AI Agent Collaborative Knowledge Construction granted"
  }
}
```
其余：
- 2026-01 CHI'26 论文录用
- 2025-12 AI 赋能文化遗产报告
- 2025-10 KU-KADH 国际会议受邀报告
- 2025-04 CHI'25 论文 Yokohama 宣讲
- 2025-XX ASIS&T Best Conference Paper
- 2024-12 JCDL'24 报告
- 2024-09 入站北京大学博雅博士后

- [ ] **Step 6: 科研项目（11 项）**

`projects/r01.json` 模板：
```json
{
  "kind": "research",
  "title": {
    "zh": "云冈石窟数字供养人智能生成系统构建",
    "en": "Digital Donor Intelligent Generation System for Yungang Grottoes"
  },
  "period": "2026-2027",
  "role": { "zh": "项目负责人", "en": "PI" },
  "funder": { "zh": "云冈研究院开放课题（重点）", "en": "Yungang Research Institute Open Grant (Key)" }
}
```
其余 10 项按 CV 提取。

- [ ] **Step 7: 教学项目（3 项）**

`kind: "teaching"`：
1. AI+ 信息资源管理专业课程建设（教育部 2025-2026）
2. AIGC 设计新范式与实践（教育部 2025-2026）
3. 北京大学人工智能助推课程建设（2022-2023）

- [ ] **Step 8: Talks（12 条受邀报告 + 8 条活动组织 = 20 条）**

`talks/t01.json`:
```json
{
  "date": "2025-12-30",
  "kind": "talk",
  "title": { "zh": "AI 赋能文化遗产活化的方法路径与教育场景初探", "en": "AI for Cultural Heritage Revitalization: Methods and Educational Scenarios" },
  "venue": { "zh": "AI 赋能出版业高质量发展暨出版产学研协同交流会", "en": "AI-Empowered Publishing Industry Forum" },
  "location": { "zh": "中国 北京", "en": "Beijing, China" }
}
```
活动组织 8 条 `kind: "organized"`（千年敦煌全球创意大赛、我用AI校古籍、东亚古籍数字人文论坛、我是校书官等）。

- [ ] **Step 9: Awards（10 项）**

`awards/a01.json`:
```json
{ "year": "2025", "title": { "zh": "ASIS&T Best Conference Paper", "en": "ASIS&T Best Conference Paper" } }
```
其余 9 项按 CV。

- [ ] **Step 10: Teaching（11 项）**

`teaching/te01.json`:
```json
{
  "role": { "zh": "联合授课", "en": "Co-Instructor" },
  "course": { "zh": "北京大学通识核心课《人机交互与用户体验》", "en": "PKU Core GenEd: Human-Computer Interaction and User Experience" },
  "period": "2025"
}
```
其余 10 项按 CV。

- [ ] **Step 11: Experience（3 段）+ Education（3 段）**

`experience/e01.json`:
```json
{
  "org": { "zh": "北京大学信息管理系", "en": "Peking University, Department of Information Management" },
  "title": { "zh": "博雅博士后 · 助理研究员", "en": "Boya Postdoctoral Fellow · Assistant Research Fellow" },
  "period": "2024.09 - 至今"
}
```
e02 = 阿里巴巴 高级 UX 设计师 2018.04-2020.09；e03 = 微软（美国）产品设计师 2016.05-2018.03。

`education/ed01.json` = 北大博士 2020-2024；ed02 = 华盛顿大学硕士 2014-2016；ed03 = 北大学士 2010-2014（含香港城市大学交换）。

- [ ] **Step 12: commit**

```bash
git add src/content && git commit -m "feat: seed all content from CV"
```

---

## Task 6: BaseLayout + Nav + Footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/LangSwitcher.astro`
- Create: `src/components/ThemeSwitcher.astro`

- [ ] **Step 1: BaseLayout**

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/themes.css';
import '../styles/base.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import ThemeSwitcher from '../components/ThemeSwitcher.astro';
import { t, type Locale } from '../lib/i18n';
import profile from '../data/profile.json';

interface Props { locale: Locale; title?: string; }
const { locale, title } = Astro.props;
const s = t(locale);
const pageTitle = title ? `${title} · ${profile.name[locale]}` : `${profile.name[locale]} · ${profile.title[locale]}`;
---
<!doctype html>
<html lang={locale === 'zh' ? 'zh-CN' : 'en'} data-theme="editorial">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{pageTitle}</title>
    <meta name="description" content={profile.bio[locale].slice(0, 160)} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700&family=Source+Serif+4:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body class="min-h-screen flex flex-col">
    <Nav locale={locale} />
    <main class="flex-1">
      <slot />
    </main>
    <Footer locale={locale} />
    <ThemeSwitcher />
    <script is:inline>
      (() => {
        const saved = localStorage.getItem('lwq-theme');
        if (saved) document.documentElement.dataset.theme = saved;
      })();
    </script>
  </body>
</html>
```

- [ ] **Step 2: Nav**

```astro
---
// src/components/Nav.astro
import { t, localePath, type Locale } from '../lib/i18n';
import LangSwitcher from './LangSwitcher.astro';
import profile from '../data/profile.json';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const s = t(locale);
const links = [
  { href: localePath(locale, '/'), label: s.nav.home },
  { href: localePath(locale, '/research'), label: s.nav.research },
  { href: localePath(locale, '/projects'), label: s.nav.projects },
  { href: localePath(locale, '/teaching'), label: s.nav.teaching },
  { href: localePath(locale, '/cv'), label: s.nav.cv },
];
---
<header class="border-b border-rule bg-bg/80 backdrop-blur sticky top-0 z-30">
  <div class="max-w-page mx-auto px-6 h-16 flex items-center justify-between">
    <a href={localePath(locale, '/')} class="font-display text-lg font-semibold text-ink no-underline">
      {profile.name[locale]}
    </a>
    <nav class="hidden md:flex items-center gap-7 text-sm">
      {links.map(l => <a href={l.href} class="text-ink/80 hover:text-accent no-underline">{l.label}</a>)}
    </nav>
    <div class="flex items-center gap-3">
      <LangSwitcher locale={locale} />
      <button id="mobile-menu-btn" class="md:hidden p-2 -mr-2" aria-label="menu">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M3 5h14v2H3zM3 9h14v2H3zM3 13h14v2H3z"/></svg>
      </button>
    </div>
  </div>
  <div id="mobile-menu" class="md:hidden hidden border-t border-rule bg-bg">
    <div class="max-w-page mx-auto px-6 py-3 flex flex-col gap-3 text-sm">
      {links.map(l => <a href={l.href} class="text-ink/80 hover:text-accent no-underline py-1">{l.label}</a>)}
    </div>
  </div>
</header>
<script is:inline>
  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.toggle('hidden');
  });
</script>
```

- [ ] **Step 3: Footer**

```astro
---
import { t, type Locale } from '../lib/i18n';
import profile from '../data/profile.json';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const s = t(locale);
---
<footer class="border-t border-rule mt-20">
  <div class="max-w-page mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-4 text-sm text-muted">
    <div>© {new Date().getFullYear()} {profile.name[locale]} · {s.footer.rights}</div>
    <div>{profile.email}</div>
  </div>
</footer>
```

- [ ] **Step 4: LangSwitcher**

```astro
---
import { type Locale } from '../lib/i18n';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const otherLocale = locale === 'zh' ? 'en' : 'zh';
const otherLabel = locale === 'zh' ? 'EN' : '中';
const currentPath = Astro.url.pathname.replace(/^\/lwq-intro/, '').replace(/^\/en/, '') || '/';
const target = otherLocale === 'en' ? `/en${currentPath === '/' ? '' : currentPath}` : currentPath;
---
<a href={target} class="text-sm font-medium text-ink/80 hover:text-accent no-underline">{otherLabel}</a>
```

- [ ] **Step 5: ThemeSwitcher**

```astro
<div class="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-surface border border-rule rounded-full shadow-md px-3 py-2 text-xs">
  <span class="text-muted hidden sm:inline">Theme</span>
  <button data-theme-set="editorial" class="px-2 py-1 rounded-full hover:bg-bg">A</button>
  <button data-theme-set="modern" class="px-2 py-1 rounded-full hover:bg-bg">B</button>
  <button data-theme-set="classical" class="px-2 py-1 rounded-full hover:bg-bg">C</button>
</div>
<script is:inline>
  document.querySelectorAll('[data-theme-set]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.getAttribute('data-theme-set');
      document.documentElement.dataset.theme = t;
      localStorage.setItem('lwq-theme', t);
    });
  });
</script>
```

- [ ] **Step 6: commit**

```bash
git add src/layouts src/components && git commit -m "feat: BaseLayout, Nav, Footer, theme/lang switchers"
```

---

## Task 7: 内容组件

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/NewsList.astro`
- Create: `src/components/PublicationList.astro`
- Create: `src/components/ProjectCard.astro`

- [ ] **Step 1: Hero**

```astro
---
import { type Locale, t } from '../lib/i18n';
import profile from '../data/profile.json';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const s = t(locale);
---
<section class="relative">
  <div class="h-56 sm:h-72 md:h-80 w-full bg-gradient-to-br from-accent/30 via-surface to-rule" aria-hidden="true"></div>
  <div class="max-w-page mx-auto px-6 -mt-20 sm:-mt-24">
    <div class="flex flex-col md:flex-row items-start gap-6 md:gap-10">
      <img src={profile.avatar} alt={profile.name[locale]} class="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-bg shadow-lg bg-surface object-cover"/>
      <div class="pt-4 md:pt-20 flex-1">
        <h1 class="font-display text-3xl sm:text-4xl font-semibold mb-2">{profile.name[locale]}</h1>
        <p class="text-muted text-base">{profile.title[locale]}</p>
        <p class="text-muted text-sm mt-1">{profile.affiliation[locale]}</p>
        <div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          {profile.social.googleScholar && <a href={profile.social.googleScholar}>Google Scholar</a>}
          {profile.social.orcid && <a href={profile.social.orcid}>ORCID</a>}
          {profile.social.github && <a href={profile.social.github}>GitHub</a>}
          {profile.social.linkedin && <a href={profile.social.linkedin}>LinkedIn</a>}
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: NewsList**

```astro
---
import { getCollection } from 'astro:content';
import { pickLang, type Locale } from '../lib/i18n';
interface Props { locale: Locale; limit?: number; }
const { locale, limit } = Astro.props;
const items = (await getCollection('news')).sort((a, b) => b.data.date.localeCompare(a.data.date));
const list = limit ? items.slice(0, limit) : items;
---
<ul class="space-y-3">
  {list.map(it => (
    <li class="flex gap-3 text-sm leading-relaxed">
      <span class="text-muted shrink-0 font-mono">[{it.data.date}]</span>
      <span class="text-ink">{pickLang(it.data.text, locale)}{it.data.link && <> · <a href={it.data.link}>link</a></>}</span>
    </li>
  ))}
</ul>
```

- [ ] **Step 3: PublicationList**

```astro
---
import { getCollection } from 'astro:content';
import { pickLang, t, type Locale } from '../lib/i18n';
interface Props { locale: Locale; category: 'journal' | 'conference' | 'under_review' | 'book' | 'patent'; }
const { locale, category } = Astro.props;
const s = t(locale);
const items = (await getCollection('publications', e => e.data.category === category))
  .sort((a, b) => (b.data.year - a.data.year) || ((a.data.order ?? 99) - (b.data.order ?? 99)));
---
<section class="my-10">
  <h3 class="font-display text-lg font-semibold mb-4">{s.sections[category]}</h3>
  <ol class="space-y-4 list-none">
    {items.map(p => (
      <li class="text-sm leading-relaxed">
        <span class="text-ink">{p.data.authors}. </span>
        <span class="font-medium">{pickLang(p.data.title, locale)}.</span>
        <span class="text-muted"> {pickLang(p.data.venue, locale)}.</span>
        {p.data.note && <span class="text-muted"> {pickLang(p.data.note, locale)}</span>}
        {p.data.link && <> · <a href={p.data.link}>link</a></>}
      </li>
    ))}
  </ol>
</section>
```

- [ ] **Step 4: ProjectCard**

```astro
---
import { pickLang, type Locale } from '../lib/i18n';
interface Props { locale: Locale; project: any; }
const { locale, project } = Astro.props;
---
<article class="border border-rule rounded-lg p-5 bg-surface">
  <h4 class="font-display text-base font-semibold leading-snug">{pickLang(project.title, locale)}</h4>
  <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
    <span>{project.period}</span>
    <span>· {pickLang(project.role, locale)}</span>
    {project.funder && <span>· {pickLang(project.funder, locale)}</span>}
  </div>
  {project.note && <p class="mt-3 text-sm text-ink/80">{pickLang(project.note, locale)}</p>}
</article>
```

- [ ] **Step 5: commit**

```bash
git add src/components && git commit -m "feat: Hero, NewsList, PublicationList, ProjectCard"
```

---

## Task 8: 5 个页面（zh + en，共 10 文件）

**Files:**
- Create: `src/pages/index.astro`, `research.astro`, `projects.astro`, `teaching.astro`, `cv.astro`
- Create: `src/pages/en/index.astro`, `research.astro`, `projects.astro`, `teaching.astro`, `cv.astro`

> 中英结构一致，仅 `locale` prop 不同。下文给中文版，英文版 import 同名组件、传 `locale="en"`。

- [ ] **Step 1: Home (zh)**

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import NewsList from '../components/NewsList.astro';
import { t } from '../lib/i18n';
import profile from '../data/profile.json';
import { getCollection } from 'astro:content';
const locale = 'zh';
const s = t(locale);
const edu = (await getCollection('education')).sort((a, b) => b.data.period.localeCompare(a.data.period));
---
<BaseLayout locale={locale}>
  <Hero locale={locale} />
  <section class="max-w-page mx-auto px-6 mt-12">
    <h2 class="font-display text-xl font-semibold mb-4">{s.sections.bio}</h2>
    <p class="max-w-prose text-base leading-relaxed text-ink/90 whitespace-pre-line">{profile.bio[locale]}</p>
  </section>
  <section class="max-w-page mx-auto px-6 mt-10">
    <h2 class="font-display text-xl font-semibold mb-4">{s.sections.research_areas}</h2>
    <div class="flex flex-wrap gap-2">
      {profile.researchAreas[locale].map(tag => (
        <span class="px-3 py-1 rounded-full border border-rule text-sm text-ink/80">{tag}</span>
      ))}
    </div>
  </section>
  <section class="max-w-page mx-auto px-6 mt-10">
    <h2 class="font-display text-xl font-semibold mb-4">{s.sections.education}</h2>
    <ul class="space-y-2 text-sm">
      {edu.map(e => (
        <li class="flex flex-col sm:flex-row sm:gap-4">
          <span class="text-muted font-mono shrink-0 w-32">{e.data.period}</span>
          <span><strong>{e.data.school[locale]}</strong> · {e.data.degree[locale]}</span>
        </li>
      ))}
    </ul>
  </section>
  <hr class="emdash my-12" />
  <section class="max-w-page mx-auto px-6">
    <h2 class="font-display text-xl font-semibold mb-4">{s.sections.news}</h2>
    <NewsList locale={locale} />
  </section>
</BaseLayout>
```

- [ ] **Step 2: Research (zh)**

```astro
---
// src/pages/research.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import PublicationList from '../components/PublicationList.astro';
import profile from '../data/profile.json';
import { t } from '../lib/i18n';
const locale = 'zh';
const s = t(locale);
---
<BaseLayout locale={locale} title={s.nav.research}>
  <section class="max-w-page mx-auto px-6 pt-14">
    <h1 class="font-display text-3xl font-semibold mb-3">{s.nav.research}</h1>
    <h2 class="font-display text-lg font-semibold mt-8 mb-3">{s.sections.research_areas}</h2>
    <div class="flex flex-wrap gap-2 mb-8">
      {profile.researchAreas[locale].map(tag => (
        <span class="px-3 py-1 rounded-full border border-rule text-sm">{tag}</span>
      ))}
    </div>
    <hr class="emdash my-10" />
    <h2 class="font-display text-2xl font-semibold mb-2">{s.sections.publications}</h2>
    <PublicationList locale={locale} category="journal" />
    <PublicationList locale={locale} category="conference" />
    <PublicationList locale={locale} category="under_review" />
    <PublicationList locale={locale} category="book" />
    <PublicationList locale={locale} category="patent" />
  </section>
</BaseLayout>
```

- [ ] **Step 3: Projects (zh)**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { getCollection } from 'astro:content';
import { t } from '../lib/i18n';
const locale = 'zh';
const s = t(locale);
const all = await getCollection('projects');
const research = all.filter(p => p.data.kind === 'research').sort((a, b) => b.data.period.localeCompare(a.data.period));
const teaching = all.filter(p => p.data.kind === 'teaching').sort((a, b) => b.data.period.localeCompare(a.data.period));
---
<BaseLayout locale={locale} title={s.nav.projects}>
  <section class="max-w-page mx-auto px-6 pt-14">
    <h1 class="font-display text-3xl font-semibold mb-8">{s.nav.projects}</h1>
    <h2 class="font-display text-xl font-semibold mb-4">{s.sections.research_projects}</h2>
    <div class="grid sm:grid-cols-2 gap-4 mb-12">
      {research.map(p => <ProjectCard locale={locale} project={p.data} />)}
    </div>
    <h2 class="font-display text-xl font-semibold mb-4">{s.sections.teaching_projects}</h2>
    <div class="grid sm:grid-cols-2 gap-4">
      {teaching.map(p => <ProjectCard locale={locale} project={p.data} />)}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Teaching (zh) — 含 Talks + Awards**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import { pickLang, t } from '../lib/i18n';
const locale = 'zh';
const s = t(locale);
const teaching = (await getCollection('teaching')).sort((a, b) => b.data.period.localeCompare(a.data.period));
const talks = await getCollection('talks');
const tList = talks.filter(x => x.data.kind === 'talk').sort((a, b) => b.data.date.localeCompare(a.data.date));
const orgList = talks.filter(x => x.data.kind === 'organized').sort((a, b) => b.data.date.localeCompare(a.data.date));
const awards = (await getCollection('awards')).sort((a, b) => b.data.year.localeCompare(a.data.year));
---
<BaseLayout locale={locale} title={s.nav.teaching}>
  <section class="max-w-page mx-auto px-6 pt-14 space-y-12">
    <div>
      <h1 class="font-display text-3xl font-semibold mb-6">{s.nav.teaching}</h1>
      <h2 class="font-display text-xl font-semibold mb-4">{s.sections.teaching_exp}</h2>
      <ul class="space-y-2 text-sm">
        {teaching.map(it => (
          <li class="flex flex-col sm:flex-row sm:gap-4">
            <span class="text-muted font-mono shrink-0 w-28">{it.data.period}</span>
            <span><strong>{pickLang(it.data.role, locale)}</strong> · {pickLang(it.data.course, locale)}</span>
          </li>
        ))}
      </ul>
    </div>
    <hr class="emdash" />
    <div>
      <h2 class="font-display text-xl font-semibold mb-4">{s.sections.talks}</h2>
      <ul class="space-y-3 text-sm">
        {tList.map(it => (
          <li class="flex flex-col sm:flex-row sm:gap-4">
            <span class="text-muted font-mono shrink-0 w-28">{it.data.date}</span>
            <span><strong>{pickLang(it.data.title, locale)}</strong> · {pickLang(it.data.venue, locale)}{it.data.location && <span class="text-muted"> · {pickLang(it.data.location, locale)}</span>}</span>
          </li>
        ))}
      </ul>
    </div>
    <div>
      <h2 class="font-display text-xl font-semibold mb-4">{s.sections.organized}</h2>
      <ul class="space-y-2 text-sm">
        {orgList.map(it => (
          <li class="flex flex-col sm:flex-row sm:gap-4">
            <span class="text-muted font-mono shrink-0 w-28">{it.data.date}</span>
            <span>{pickLang(it.data.title, locale)} · <span class="text-muted">{pickLang(it.data.venue, locale)}</span></span>
          </li>
        ))}
      </ul>
    </div>
    <hr class="emdash" />
    <div>
      <h2 class="font-display text-xl font-semibold mb-4">{s.sections.awards}</h2>
      <ul class="space-y-2 text-sm">
        {awards.map(a => (
          <li class="flex gap-4">
            <span class="text-muted font-mono shrink-0 w-20">{a.data.year}</span>
            <span>{pickLang(a.data.title, locale)}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 5: CV (zh)**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import { pickLang, t } from '../lib/i18n';
import profile from '../data/profile.json';
const locale = 'zh';
const s = t(locale);
const edu = (await getCollection('education')).sort((a, b) => b.data.period.localeCompare(a.data.period));
const exp = (await getCollection('experience')).sort((a, b) => b.data.period.localeCompare(a.data.period));
const allPub = (await getCollection('publications')).sort((a, b) => b.data.year - a.data.year);
const projects = await getCollection('projects');
const awards = (await getCollection('awards')).sort((a, b) => b.data.year.localeCompare(a.data.year));
const teaching = (await getCollection('teaching')).sort((a, b) => b.data.period.localeCompare(a.data.period));
const Section = ({ title, children }: any) => null; // 占位让 TS 满意
---
<BaseLayout locale={locale} title={s.nav.cv}>
  <section class="max-w-page mx-auto px-6 pt-14">
    <div class="flex items-baseline justify-between flex-wrap gap-4 mb-8">
      <h1 class="font-display text-3xl font-semibold">{s.nav.cv}</h1>
      <a href={profile.cvPdf} class="text-sm border border-rule rounded-full px-4 py-2 hover:bg-surface no-underline">{s.hero.downloadCV}</a>
    </div>

    <h2 class="font-display text-xl font-semibold mt-8 mb-3">{s.sections.experience}</h2>
    <ul class="space-y-2 text-sm">
      {exp.map(e => (
        <li class="flex flex-col sm:flex-row sm:gap-4">
          <span class="text-muted font-mono shrink-0 w-32">{e.data.period}</span>
          <span><strong>{pickLang(e.data.org, locale)}</strong> · {pickLang(e.data.title, locale)}</span>
        </li>
      ))}
    </ul>

    <h2 class="font-display text-xl font-semibold mt-8 mb-3">{s.sections.education}</h2>
    <ul class="space-y-2 text-sm">
      {edu.map(e => (
        <li class="flex flex-col sm:flex-row sm:gap-4">
          <span class="text-muted font-mono shrink-0 w-32">{e.data.period}</span>
          <span><strong>{pickLang(e.data.school, locale)}</strong> · {pickLang(e.data.degree, locale)}</span>
        </li>
      ))}
    </ul>

    <h2 class="font-display text-xl font-semibold mt-8 mb-3">{s.sections.publications}</h2>
    <ol class="space-y-3 text-sm">
      {allPub.map(p => (
        <li>
          <span class="text-muted font-mono mr-2">{p.data.year}</span>
          {p.data.authors}. <strong>{pickLang(p.data.title, locale)}</strong>. <span class="text-muted">{pickLang(p.data.venue, locale)}</span>
        </li>
      ))}
    </ol>

    <h2 class="font-display text-xl font-semibold mt-8 mb-3">{s.sections.awards}</h2>
    <ul class="space-y-1 text-sm">
      {awards.map(a => <li><span class="text-muted font-mono mr-2">{a.data.year}</span>{pickLang(a.data.title, locale)}</li>)}
    </ul>

    <h2 class="font-display text-xl font-semibold mt-8 mb-3">{s.sections.teaching_exp}</h2>
    <ul class="space-y-1 text-sm">
      {teaching.map(t => <li><span class="text-muted font-mono mr-2 w-20 inline-block">{t.data.period}</span>{pickLang(t.data.role, locale)} · {pickLang(t.data.course, locale)}</li>)}
    </ul>
  </section>
</BaseLayout>
```

- [ ] **Step 6: 英文版 5 页**

每个 `src/pages/en/<page>.astro` 完全复制 zh 版，仅修改：
- 第一行注释
- `const locale = 'en';`
- `import` 路径多一层 `../../`（`../layouts/` → `../../layouts/`）

例如 `src/pages/en/index.astro`：
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/Hero.astro';
import NewsList from '../../components/NewsList.astro';
import { t } from '../../lib/i18n';
import profile from '../../data/profile.json';
import { getCollection } from 'astro:content';
const locale = 'en';
/* …其余与 zh 版完全相同… */
```

- [ ] **Step 7: commit**

```bash
git add src/pages && git commit -m "feat: 5 pages × zh+en"
```

---

## Task 9: 构建验证 + 本地预览

- [ ] **Step 1: 启动 dev**

```bash
cd /Users/wangzx2026/Desktop/lwq-intro && pnpm dev
```

- [ ] **Step 2: 浏览器打开 5 个页面 × 2 语言 = 10 URL**

```
http://localhost:4321/lwq-intro/
http://localhost:4321/lwq-intro/research
http://localhost:4321/lwq-intro/projects
http://localhost:4321/lwq-intro/teaching
http://localhost:4321/lwq-intro/cv
http://localhost:4321/lwq-intro/en/
http://localhost:4321/lwq-intro/en/research
... (其余英文页)
```

每页验收：nav 5 项可点；中英切换工作；3 个 theme 切换无白屏；移动尺寸（< 768px）单列。

- [ ] **Step 3: 构建**

```bash
pnpm build
```

预期：`dist/` 目录生成；无 TS/Astro 错误；首页 HTML > 5KB。

- [ ] **Step 4: commit（如有微调）**

```bash
git add -A && git commit -m "chore: build verification"
```

---

## Task 10: 内容收集器（单文件 HTML）

**File:**
- Create: `collector/index.html`（同时复制到 `public/collector/index.html`）

- [ ] **Step 1: 写收集器**

包含：
- 完整表单：基本信息、社交链、bio（zh/en）、研究方向、News（动态行）、Publications 5 类（动态行）、Projects 2 类（动态行）、Talks 2 类（动态行）、Awards、Teaching、Experience、Education、Section 选择题、Theme 偏好、PDF/图片上传
- localStorage 自动保存（key `lwq-content-draft`）
- 顶栏：保存草稿 / 恢复草稿 / 导出 JSON / 重置 / 进度条
- 全部字段**预填**当前 CV 提取的内容

完整 HTML 太长，参见执行时 inline write 的具体内容。骨架：

```html
<!doctype html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><title>李文琦 - 内容收集器</title>
<style>/* 样式 */</style></head>
<body>
  <header class="topbar">
    <h1>个人网站内容收集器</h1>
    <div class="actions">
      <button id="save">保存草稿</button>
      <button id="restore">恢复草稿</button>
      <button id="export">导出 JSON</button>
      <button id="reset">重置</button>
    </div>
    <div id="progress"></div>
  </header>
  <main id="form">
    <!-- 各 section 表单，IIFE 用预填数据动态构造 -->
  </main>
  <script>
    const SEED = { /* 从 CV 提取的预填值 */ };
    /* 构造 UI、保存/导出逻辑 */
  </script>
</body>
</html>
```

- [ ] **Step 2: 复制副本到 public 以便部署后访问**

```bash
mkdir -p public/collector && cp collector/index.html public/collector/index.html
```

- [ ] **Step 3: 浏览器测试**

```bash
open collector/index.html
```

验收：所有字段预填可见；改动自动保存；点导出下载 `lwq-content-*.json` 包含全部字段；浏览器刷新数据恢复。

- [ ] **Step 4: commit**

```bash
git add collector public/collector && git commit -m "feat: content collector single-file HTML"
```

---

## Task 11: 导入脚本

**File:**
- Create: `scripts/import-content.ts`

- [ ] **Step 1: 写脚本**

```ts
// scripts/import-content.ts
import fs from 'node:fs';
import path from 'node:path';

const jsonPath = process.argv[2];
if (!jsonPath) { console.error('Usage: pnpm import-content <json>'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const ROOT = path.resolve(process.cwd());
const writeJson = (rel: string, obj: any) => {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
};

if (data.profile) writeJson('src/data/profile.json', data.profile);

const writeList = (collection: string, items: any[]) => {
  const dir = path.join(ROOT, 'src/content', collection);
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) if (f.endsWith('.json')) fs.unlinkSync(path.join(dir, f));
  items.forEach((item, i) => writeJson(`src/content/${collection}/${String(i + 1).padStart(3, '0')}.json`, item));
};

for (const k of ['publications', 'news', 'projects', 'talks', 'awards', 'teaching', 'experience', 'education']) {
  if (Array.isArray(data[k])) writeList(k, data[k]);
}

if (data.images) {
  const imgDir = path.join(ROOT, 'public/images');
  fs.mkdirSync(imgDir, { recursive: true });
  for (const [name, b64] of Object.entries(data.images as Record<string, string>)) {
    const m = b64.match(/^data:(image\/[^;]+);base64,(.+)$/);
    if (m) {
      const ext = m[1].split('/')[1];
      fs.writeFileSync(path.join(imgDir, `${name}.${ext}`), Buffer.from(m[2], 'base64'));
    }
  }
}

console.log('Imported.');
```

- [ ] **Step 2: commit**

```bash
git add scripts && git commit -m "feat: import-content script"
```

---

## Task 12: GitHub Pages 部署

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 写 workflow**

```yaml
name: Deploy to GitHub Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 创建 GitHub repo**

```bash
gh repo create wangzx_microsoft/lwq-intro --public --source=. --remote=origin --description "李文琦个人网站"
```

- [ ] **Step 3: 推送**

```bash
git add .github && git commit -m "ci: GitHub Pages workflow"
git push -u origin main
```

- [ ] **Step 4: 启用 Pages**

```bash
gh api -X POST /repos/wangzx_microsoft/lwq-intro/pages -f build_type=workflow 2>&1 || \
  gh api -X PUT /repos/wangzx_microsoft/lwq-intro/pages -f build_type=workflow
```

或在 GitHub web UI: Settings → Pages → Source: GitHub Actions

- [ ] **Step 5: 等 CI 完成 + 验证上线**

```bash
gh run watch
curl -I https://wangzx_microsoft.github.io/lwq-intro/
```

预期：HTTP 200；浏览器访问 URL 看到首页。

---

## 验收清单

- [ ] `pnpm dev` 本地 5 页 × 2 语言全通
- [ ] 移动端（< 768px）单列流式无溢出
- [ ] 3 个 theme 循环切换无白屏，刷新保留
- [ ] `collector/index.html` 双击可用，导出 JSON 完整
- [ ] `pnpm import-content` 能把测试 JSON 拆进 content collections
- [ ] `pnpm build` 无错
- [ ] GitHub Actions 绿，`https://wangzx_microsoft.github.io/lwq-intro/` 可访问
- [ ] 站点至少 80% 内容来自 CV 真实条目
