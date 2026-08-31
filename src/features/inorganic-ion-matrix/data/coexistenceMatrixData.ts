import type { IonPairCell, MatrixConflictCategory } from '../types'
import { CONFLICT_MAP } from './coexistenceConflictMap'

export interface MatrixIonItem {
  id: string
  name: string
  formula: string
  charge: number
  colorNote?: string
}

export const MATRIX_CATIONS: MatrixIonItem[] = [
  { id: 'H+', name: '氢离子', formula: 'H^+', charge: 1, colorNote: '酸性介质' },
  { id: 'Na+/K+', name: '钠/钾离子', formula: 'Na^+/K^+', charge: 1, colorNote: '无色/全共存' },
  { id: 'NH4+', name: '铵根离子', formula: 'NH_4^+', charge: 1, colorNote: '弱碱阳离子' },
  { id: 'Mg2+', name: '镁离子', formula: 'Mg^{2+}', charge: 2, colorNote: '无色' },
  { id: 'Ca2+', name: '钙离子', formula: 'Ca^{2+}', charge: 2, colorNote: '微溶陷阱' },
  { id: 'Ba2+', name: '钡离子', formula: 'Ba^{2+}', charge: 2, colorNote: '硫酸根特效' },
  { id: 'Al3+', name: '铝离子', formula: 'Al^{3+}', charge: 3, colorNote: '两性/双水解' },
  { id: 'Fe2+', name: '亚铁离子', formula: 'Fe^{2+}', charge: 2, colorNote: '浅绿/强还原' },
  { id: 'Fe3+', name: '铁离子', formula: 'Fe^{3+}', charge: 3, colorNote: '棕黄/强氧化' },
  { id: 'Cu2+', name: '铜离子', formula: 'Cu^{2+}', charge: 2, colorNote: '蓝色' },
  { id: 'Ag+', name: '银离子', formula: 'Ag^+', charge: 1, colorNote: '卤素特效' },
]

export const MATRIX_ANIONS: MatrixIonItem[] = [
  { id: 'OH-', name: '氢氧根', formula: 'OH^-', charge: -1, colorNote: '碱性介质' },
  { id: 'Cl-', name: '氯离子', formula: 'Cl^-', charge: -1, colorNote: '无色' },
  { id: 'Br-', name: '溴离子', formula: 'Br^-', charge: -1, colorNote: '无色' },
  { id: 'I-', name: '碘离子', formula: 'I^-', charge: -1, colorNote: '无色/强还原' },
  { id: 'SO42-', name: '硫酸根', formula: 'SO_4^{2-}', charge: -2, colorNote: '无色' },
  { id: 'SO32-', name: '亚硫酸根', formula: 'SO_3^{2-}', charge: -2, colorNote: '强还原/易氧化' },
  { id: 'S2-', name: '硫离子', formula: 'S^{2-}', charge: -2, colorNote: '强还原/沉淀多' },
  { id: 'CO32-', name: '碳酸根', formula: 'CO_3^{2-}', charge: -2, colorNote: '弱酸根/双水解' },
  { id: 'HCO3-', name: '碳酸氢根', formula: 'HCO_3^-', charge: -1, colorNote: '两性酸式根' },
  { id: 'NO3-', name: '硝酸根', formula: 'NO_3^-', charge: -1, colorNote: '酸性强氧化' },
  { id: 'AlO2-', name: '偏铝酸根', formula: 'AlO_2^-', charge: -1, colorNote: '强碱性/双水解' },
  { id: 'ClO-', name: '次氯酸根', formula: 'ClO^-', charge: -1, colorNote: '强氧化性' },
]

// 互斥分类配色与说明
export const CONFLICT_CATEGORY_CONFIG: Record<
  MatrixConflictCategory,
  { label: string; badgeBg: string; badgeText: string; borderColor: string; description: string }
> = {
  none: {
    label: '稳定共存',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    description: '无沉淀、无气体、无弱电解质生成，亦无氧化还原与双水解反应，可大量共存。',
  },
  precipitate: {
    label: '生成沉淀',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-200',
    description: '离子结合生成难溶物或微溶物沉淀，降低溶液离子浓度。',
  },
  redox: {
    label: '氧化还原',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'text-purple-700',
    borderColor: 'border-purple-200',
    description: '强氧化性离子与强还原性离子发生电子转移反应，不能大量共存。',
  },
  'double-hydrolysis': {
    label: '剧烈双水解',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-700',
    borderColor: 'border-rose-200',
    description: '弱碱阳离子与弱酸阴离子相互促进水解彻底进行，生成沉淀和气体。',
  },
  'gas-weak-acid': {
    label: '气体/弱电解质',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-700',
    borderColor: 'border-amber-200',
    description: '结合生成挥发性气体（如 CO₂、SO₂、H₂S、NH₃）或弱酸、弱碱分子。',
  },
  'acid-medium-trap': {
    label: '酸性介质陷阱',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    badgeText: 'text-orange-700',
    borderColor: 'border-orange-200',
    description: '在中性/碱性条件下可共存，但在酸性介质（H⁺ 存在）下诱发剧烈氧化还原。',
  },
}

// 基础默认共存格子生成器
function makeCoexistCell(cationId: string, anionId: string): IonPairCell {
  return {
    cationId,
    anionId,
    status: 'coexist',
    category: 'none',
    badgeLabel: '共存',
    phenomenon: '无明显反应现象，溶液澄清透明，可大量共存。',
    reason: `${cationId} 与 ${anionId} 不发生复分解、氧化还原或剧烈双水解反应。`,
  }
}

/** 获取特定阳离子与阴离子交叉点的共存/互斥完整数据 */
export function getIonPairCell(cationId: string, anionId: string): IonPairCell {
  const key = `${cationId}:${anionId}`
  if (CONFLICT_MAP[key]) {
    return CONFLICT_MAP[key]
  }
  return makeCoexistCell(cationId, anionId)
}

/** 高考四大离子共存审题黄金法则口诀卡 */
export interface CoexistenceRuleCard {
  id: string
  title: string
  tag: string
  rule: string
  tip: string
  examples: string[]
}

export const COEXISTENCE_RULE_CARDS: CoexistenceRuleCard[] = [
  {
    id: 'rule-acid-base',
    title: '① 介质酸碱性与隐含条件 (一票否决)',
    tag: '酸碱介质',
    rule: '审题先看介质：pH=1/甲基橙红（酸性）或 pH=13/酚酞红（碱性）或由水电离的 c(H⁺)=10⁻¹³（酸或碱）。',
    tip: 'HCO₃⁻/HSO₃⁻ 遇酸放出气体、遇碱生成沉淀，酸碱介质均不能大量共存！',
    examples: ['H⁺ 与 OH⁻/CO₃²⁻/HCO₃⁻/AlO₂⁻/S²⁻/ClO⁻ 排斥', 'OH⁻ 与 H⁺/NH₄⁺/Mg²⁺/Fe³⁺/Cu²⁺/Al³⁺/HCO₃⁻ 排斥'],
  },
  {
    id: 'rule-redox-trap',
    title: '② 隐蔽氧化还原与酸性催化',
    tag: '氧化还原',
    rule: '强氧化性离子遇到强还原性离子必发生氧化还原互斥。尤其注意“酸性条件诱发氧化性”。',
    tip: 'NO₃⁻ 在中性/碱性下可与 Fe²⁺/I⁻ 共存，但在酸性（含 H⁺）下具有相当于硝酸的强氧化性，必互斥！',
    examples: ['Fe³⁺ 与 I⁻ / S²⁻ / SO₃²⁻ 自发氧化还原', 'NO₃⁻(H⁺) 或 ClO⁻ 氧化 Fe²⁺ / SO₃²⁻ / I⁻ / S²⁻'],
  },
  {
    id: 'rule-double-hydrolysis',
    title: '③ 彻底双水解“气+沉”组合',
    tag: '彻底双水解',
    rule: '弱酸阴离子（如 CO₃²⁻、HCO₃⁻、S²⁻、HS⁻、SO₃²⁻、AlO₂⁻）遇弱碱阳离子（Al³⁺、Fe³⁺）互相促进水解进行到底。',
    tip: '泡沫灭火器原理：Al³⁺ + 3HCO₃⁻ = Al(OH)₃↓ + 3CO₂↑，高考出题频率最高！',
    examples: ['Al³⁺ 与 HCO₃⁻ / CO₃²⁻ / S²⁻ / AlO₂⁻', 'Fe³⁺ 与 HCO₃⁻ / CO₃²⁻ / AlO₂⁻'],
  },
  {
    id: 'rule-color-condition',
    title: '④ 溶液颜色限制（无色透明陷阱）',
    tag: '颜色排除',
    rule: '题目要求“无色溶液”时，哪怕离子之间完全不发生反应，有色离子也必须一票否决排除！',
    tip: '“透明”不等于“无色”，硫酸铜溶液是透明的但显蓝色！',
    examples: ['Fe³⁺ (棕黄)', 'Fe²⁺ (浅绿)', 'Cu²⁺ (蓝色)', 'MnO₄⁻ (紫红)'],
  },
]
