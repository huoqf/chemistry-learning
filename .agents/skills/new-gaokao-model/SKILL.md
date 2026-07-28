---
name: new-gaokao-model
description: >
  新建高考解题母题 / 创建记忆矩阵探究页面 / 新增双对比解题模型 /
  注册高考解题平行节点 / 新增高考提分模块 /
  create gaokao master model / add memory matrix / new exam tool page
---

# 新建高考解题母题专题

> 实操路由指南。铁律/禁令/CHECKLIST 见 `.agents/AGENTS.md`。
>
> **本 Skill 适用于 `GaokaoToolPage` 布局体系**（路由 `/gaokao-tool/:id`），不走 `AnimationPage` 三屏。中屏 viewMode 子视图切换（动画/踩分/真题）在本体系下合法。

## ⚠️ 前置条件（写代码前必须完成）

1. Read `.agents/AGENTS.md` — 铁律唯一权威源（颜色 Token、三屏隔离、组件复用等）
2. Read `src/features/organic/mechanism/OrganicMechanismCanvas.tsx` — viewMode 切换 + ThreePanel 组装的参考实现
3. Read `src/pages/GaokaoToolPage.tsx` — 路由分发入口（switch-case 与 顶级分支）
4. Read `src/data/gaokaoModels.ts` — 元数据注册表结构
5. Read `src/data/gaokaoQuizData.ts` — 踩分步骤与真题数据集

未完成以上读取，禁止开始编码。

## 职责边界与文件拆分原则

| 文件/目录 | 允许包含 | 禁止包含 |
|------|---------|---------|
| `gaokaoModels.ts` | 纯声明式元数据（id/title/route/relatedIds/examPoints） | 组件逻辑、状态管理 |
| `GaokaoToolPage.tsx` | switch-case 路由分发 / 顶级分支 + 全屏 nav bar | 业务逻辑、具体场景渲染 |
| `src/features/<topic>/` | 复杂母题专属模块目录 | 按单一职责拆分（见下方原则） |
| `XxxCanvas.tsx` | ThreePanel 组装入口 | 业务逻辑、化学计算 |
| `gaokaoQuizData.ts` | quiz 数据（scoringSteps/variantQuizzes） | UI 渲染逻辑 |

### 文件拆分原则（职责驱动）
复杂母题按**单一职责**拆分，每个文件只做一件事：
1. `types.ts`：数据类型定义
2. `hooks/useXxxChemistry.ts`：纯化学计算逻辑（零 JSX、零副作用）
3. `components/XxxLeftPanel.tsx`：左屏控制台 UI
4. `components/XxxCenterView.tsx`：中屏渲染（动画/踩分/真题条件切换）
5. `components/XxxRightPanel.tsx`：右屏展示面板
6. `XxxCanvas.tsx`：ThreePanel 组装入口（只做组件组合，无业务逻辑）

**拆分信号（下列任意一条触发即须拆分）**：
- 文件同时包含多种关注点（如"UI 渲染 + 化学计算"、"组件组装 + 状态管理"）
- 某个函数/组件的修改需要同时理解另一层逻辑（关注点耦合）
- 同一文件被多个不同层的模块引用（职责外溢）

**不应拆分的情形**：文件行数多但职责单一（如题库数据文件、类型声明文件），强行截断会破坏内聚性。

## Step 1：注册元数据与题库数据

1. 在 `src/data/gaokaoModels.ts` 添加元数据记录（`id`, `toolRoute`, `relatedKnowledgeIds`, `examPointSummary`）。
2. **同时必须**在 `src/data/quiz/` 目录下新建独立文件 `<model-id>.ts`，导出一个 `ModelQuizData` 对象（含 `scoringSteps` 与 `variantQuizzes`），并在 `src/data/quiz/index.ts` 的 `modelQuizMap` 中注册，避免因数据丢失导致界面判定隐藏。

```
# 题库数据目录结构（每个 model 独立文件，index.ts 仅做聚合）
src/data/quiz/
  types.ts                          ← 接口定义（ScoringStep / GaokaoVariantItem / ModelQuizData）
  index.ts                          ← 聚合导出 + modelQuizMap + getModelQuizData（禁止在此写题库数据）
  model-valence-matrix.ts           ← 单个母题题库数据
  model-reagent-step.ts
  model-<new-id>.ts                 ← 新增母题在此新建文件
```

> `src/data/gaokaoQuizData.ts` 已成为向后兼容的重导出文件，**禁止在旧文件中添加新数据**。

## Step 2：GaokaoToolPage 路由注册

- 默认工具在 `src/pages/GaokaoToolPage.tsx` 的 `renderToolComponent` switch-case 中添加 case。
- **若为全屏独立 `ThreePanel` 架构**（如母题八、专题一、专题二），直接在 `GaokaoToolPage.tsx` 顶级分支返回：
  `if (model.id === 'model-xxx') return <XxxCanvas />`

## Step 3：三屏组件规范与中屏平行视角渲染（严禁手写 DOM / 严禁 `<foreignObject>`）

### 1. 左屏组件规范（LeftPanel）
左屏必须 100% 使用项目已有的标准 UI 组件组合实现，绝对禁止手写原生的 `<input type="range">`、散乱 `<button>` 或容器 CSS 样式：
- **外层容器与分区**：必须使用 `<LeftPanel>` 与 `<LeftPanelSection title="...">` 组合
- **数值参数**：必须使用 `<ParamControl>` 滑块组件
- **模式与切换**：必须使用 `<ControlPanel>`、`<SegmentedControl>` 或 `<ToggleSwitch>`
- **操作按钮**：必须使用 `<Button>` 组件

### 2. 中屏平行视角与控制规范（CenterView DOM 条件渲染）
- **视角切换**：主舞台通过左屏 `viewMode` 分段按钮进行 **DOM 层平级条件切换**（绝对禁止在 SVG 内使用 `<foreignObject>`）：
  - **视角 0 (动画/图表)**：渲染 `<AnimationSvgCanvas>` + 图表组件；动画控制物理通用场景使用 `<AnimationControls>`，**化学滴定/试剂演练场景使用专属 `<TitrationControls>`**。
  - **视角 1 (规范踩分)**：直接渲染 `<ScoringCardSection steps={quizData.scoringSteps} />`
  - **视角 2 (真题变式)**：直接渲染 `<GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />`
- **零滚动自适应**：参照原电池 `PrimaryCellAnimation.tsx` 架构，中屏根容器为 `w-full h-full flex flex-col overflow-hidden`，保证装置视口（280px）、图表视口（560px）与控制条（50px）一屏自适应展示，禁止手写死高度 `min-h-[Npx]` 导致外层出现粗暴滚动条。

### 3. 右屏组件规范（RightPanel）
右屏必须 100% 使用项目已有的标准 UI 组件组合实现，绝对禁止手写原生的散乱 `<div>`/`<p>` 元素：
- **公式与条件**：必须使用 `ChemistryPanel` 的 `formulas` 或 `<FormulaSection formulas={...} />`（内部自动调用 `KatexFormula`，已支持 280px 窄屏自动折行）
- **高考要点**：必须使用 `gaokaoPoints` 或 `<GaokaoSection points={...} />`
- **易错警示**：必须使用 `warnings` 或 `<WarningSection warnings={...} />`
- **化学量与数据卡**：必须使用 `<QuantityItem />` 或 `quantities` 声明式定义

## Step 4：Theme Token 导入规范

所有 Theme 引用必须 100% 遵守 `@/theme` 统一入口，禁止子路径导入：
```tsx
// ✅ 正确：100% 从统一入口 @/theme 导入
import { CHEMISTRY_COLORS, SCENE_COLORS, CHART_COLORS, colors } from '@/theme'
```

## 常见陷阱

1. **GaokaoToolPage switch-case / 顶级分支遗漏**：新增 model 后忘记在 `GaokaoToolPage.tsx` 注册。
2. **gaokaoQuizData.ts 映射遗漏**：忘记注册 `modelQuizMap` 导致踩分卡与真题无法渲染。
3. **多模型页面 formulas 写成静态数组**：如果左屏有模型切换，`formulas` 必须写成 `(params) => ...` 动态函数。
4. **中屏真题错误使用 `<foreignObject>`**：高考真题应在 DOM 层条件切换渲染 `<GaokaoVariantQuiz>`，绝对禁止内嵌在 SVG 的 `<foreignObject>` 中。

## 自检 Checklist

- [ ] `gaokaoModels.ts` 元数据已注册
- [ ] `src/data/quiz/<model-id>.ts` 已新建（含 scoringSteps + variantQuizzes），已在 `quiz/index.ts` 中注册
- [ ] `GaokaoToolPage.tsx` 路由分支已添加
- [ ] 模块文件存放在 `src/features/<topic>/`，每个文件职责单一（编辑一处无需理解另一层逻辑）
- [ ] 左屏使用 `LeftPanel` / `LeftPanelSection` / `ParamControl` / `SegmentedControl` 组件
- [ ] 中屏物理场景使用 `<AnimationControls>`，化学滴定/试剂演练场景使用 `<TitrationControls>`
- [ ] 中屏一屏自适应（参照原电池 `overflow-hidden`），零外层滚动条
- [ ] 中屏真题/踩分卡在 DOM 层条件渲染，无 `<foreignObject>`
- [ ] 右屏使用 `ChemistryPanel` / `FormulaSection` 等标准组件渲染（公式自动折行）
- [ ] Token 导入 100% 使用 `@/theme` 统一入口
- [ ] `/gaokao-tool/model-xxx` 可访问，返回按钮正常
