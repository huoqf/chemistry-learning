/**
 * src/data/e2ePageCatalog.ts
 *
 * E2E（Playwright）页面级断言的**清单与考点锚点**（审查项 G5 / G6）。
 *
 * 为什么单独成模块：
 *   Playwright 的 e2e 用例由 esbuild 直接转译，**不做 Vite/TS 别名解析**，
 *   因此无法 import 依赖 `@/...` 且引用 React 组件的动画注册表。
 *   这里放一份**无任何依赖**的清单，供 e2e 直接引用。
 *
 * 如何防止漂移：
 *   `src/data/__tests__/e2ePageCatalog.test.ts` 会断言本文件与真实注册表
 *   （reaction-principle / structure / inorganic / experiment）**逐条完全一致**，
 *   并断言每个高考母题都有考点锚点。清单漏项或标题过时都会让单测变红。
 *
 * 考点锚点（`GAOKAO_TOOL_ANCHORS`）：
 *   每个高考工具页必须出现的“关键考点字符串”（不是“化学/高考”这类口水词），
 *   用于把 TruthAuditor 的“化学事实断言”思路延伸到页面级——
 *   页面渲染出来但考点讲错/丢失时，E2E 不再一律变绿。
 */

export interface AnimationPageEntry {
  id: string
  title: string
}

/** 与四大动画注册表保持一致的动画页面清单 */
export const ANIMATION_PAGES: AnimationPageEntry[] = [
  { id: 'anim-le-chatelier', title: '勒夏特列原理与化学平衡移动' },
  { id: 'anim-collision-theory', title: '碰撞理论与活化能' },
  { id: 'anim-hybrid-orbital', title: '杂化轨道理论 3D 空间叠加' },
  { id: 'anim-vsepr', title: 'VSEPR 模型 3D 构型演示' },
  { id: 'anim-unit-cell-calculation', title: '晶胞结构与密度计算' },
  { id: 'anim-chirality', title: '手性分子与立体异构 3D 对比' },
  { id: 'anim-isomerism', title: '同分异构体 (2D减碳树 ↔ 3D球棍联动)' },
  { id: 'anim-primary-cell', title: '原电池工作原理与高考经典模型分析' },
  { id: 'anim-electrolytic-cell', title: '电解池工作原理与高考经典模型分析' },
  { id: 'anim-electrochemical-application', title: '电化学综合应用与多池联动分析' },
  { id: 'anim-extraction-distillation', title: '萃取分液与蒸馏实验' },
  { id: 'anim-redox-electron-transfer', title: '电子转移与化合价' },
]

/**
 * 高考工具页的考点锚点：键为 `gaokaoModels` 的 id，
 * 值为该页**必须渲染**的关键考点字符串。
 */
export const GAOKAO_TOOL_ANCHORS: Record<string, string> = {
  'model-valence-matrix': '价类二维矩阵',
  'model-ion-matrix': '血红色',
  'model-organic-matrix': '阿司匹林母题',
  'model-reagent-step': '灰绿色',
  'model-flash-cards': '结合型漂白',
  'model-titration-balance': '半中和点',
  'model-electrochemical-twin': '盐桥',
  'model-crystal-3d-split': '面心立方',
  'model-reaction-principle-nexus': '决速步',
  'model-vsepr-hybrid-3d': '价层电子对数',
  'model-organic-mechanism': '马氏规则',
  'model-hess-law': '盖斯定律',
  'model-element-periodic-property': '洪特规则',
  'model-avogadro-constant': '非气态',
  'model-organic-retrosynthesis': '逆合成',
  'model-gas-chain': '长进短出',
  'model-industrial-flow': '不增杂',
  'model-titration-error-purity': '仰视',
}
