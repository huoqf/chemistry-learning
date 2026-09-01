import type { ValenceSubstanceNode } from '@/data/valence-matrix'
import type { KnowledgeNode } from '@/data/types'
import { getKnowledgeNode } from '@/data/knowledgeTree'

/**
 * 精确物质匹配函数（按 '/'、'、' 等拆分候选物质，精确匹配避免子串污染）
 */
export function matchesSubstance(field: string, targetSubstance: string): boolean {
  if (!field || !targetSubstance) return false
  const targetClean = targetSubstance.trim()
  const parts = field.split(/[/,，、或|]/).map(p => p.trim())
  return parts.some(
    p =>
      p === targetClean ||
      p.startsWith(targetClean + '(') ||
      p.startsWith(targetClean + '（') ||
      targetClean.startsWith(p + '(') ||
      targetClean.startsWith(p + '（')
  )
}

/**
 * 严格按照高中化学常温常压物理常识与精确实体比对判定物质聚集相态
 */
export function getSubstancePhysicalState(node: ValenceSubstanceNode): string {
  // 1. 如果节点本身显式标注了 physicalState，直接映射
  if (node.physicalState === 'gas') return '气态分子 (气体)'
  if (node.physicalState === 'precipitate') return '难溶沉淀 / 胶体'
  if (node.physicalState === 'solid') return '固体粉末 / 晶体'
  if (node.physicalState === 'solution') return '澄清离子水溶液'

  // 2. 提取候选纯净化学式列表（去除中文注释括号）
  const formulas = node.substance
    .split(/[/,，、或|]/)
    .map(s => s.trim().replace(/\(.*?\)|（.*?）/g, '').trim())

  // 3. 常温液态常识清单 (精准实体匹配)
  const LIQUIDS = new Set([
    'Br2', 'Br₂', 'Hg', 'H2O', 'H₂O', 'CCl4', 'CCl₄', 'CS2', 'CS₂',
    '浓H2SO4', '浓H₂SO₄', '浓HNO3', '浓HNO₃'
  ])
  if (formulas.some(f => LIQUIDS.has(f))) {
    return '纯净液体 / 浓溶液'
  }

  // 4. 常温气态单质与化合物常识清单 (精准实体匹配)
  const GASES = new Set([
    'H2', 'H₂', 'O2', 'O₂', 'O3', 'O₃', 'N2', 'N₂', 'F2', 'F₂', 'Cl2', 'Cl₂',
    'CO', 'CO2', 'CO₂', 'NO', 'NO2', 'NO₂', 'N2O', 'N₂O', 'SO2', 'SO₂', 'ClO2', 'ClO₂',
    'NH3', 'NH₃', 'PH3', 'PH₃', 'AsH3', 'AsH₃', 'H2S', 'H₂S', 'CH4', 'CH₄',
    'HCl', 'HF', 'HBr', 'HI', 'SiH4', 'SiH₄', 'GeH4', 'GeH₄', 'B2H6', 'B₂H₆'
  ])
  if (formulas.some(f => GASES.has(f))) {
    return '气态分子 (气体)'
  }

  // 5. 难溶沉淀常识清单 (精确匹配或包含“沉淀”字样)
  if (
    node.colorText.includes('沉淀') ||
    node.precipitateType === 'transient-feoh2' ||
    node.precipitateType === 'red-brown'
  ) {
    return '难溶沉淀 / 胶体'
  }

  const PRECIPITATES = new Set([
    'Fe(OH)2', 'Fe(OH)₂', 'Fe(OH)3', 'Fe(OH)₃', 'Cu(OH)2', 'Cu(OH)₂',
    'Al(OH)3', 'Al(OH)₃', 'Mg(OH)2', 'Mg(OH)₂', 'Mn(OH)2', 'Mn(OH)₂',
    'Co(OH)2', 'Co(OH)₂', 'Co(OH)3', 'Co(OH)₃', 'Ni(OH)2', 'Ni(OH)₂',
    'Zn(OH)2', 'Zn(OH)₂', 'Pb(OH)2', 'Pb(OH)₂', 'Bi(OH)3', 'Bi(OH)₃',
    'BaSO4', 'BaSO₄', 'BaCO3', 'BaCO₃', 'BaSO3', 'BaSO₃',
    'CaCO3', 'CaCO₃', 'CaSO4', 'CaSO₄', 'CaSO3', 'CaSO₃',
    'AgCl', 'AgBr', 'AgI', 'Ag2O', 'Ag₂O', 'Ag2S', 'Ag₂S',
    'PbSO4', 'PbSO₄', 'PbI2', 'PbI₂', 'PbS',
    'CuS', 'Cu2S', 'Cu₂S', 'Cu2O', 'Cu₂O', 'CuO',
    'FeS', 'FeS2', 'FeS₂', 'FeAsO4', 'FeAsO₄',
    'H2SiO3', 'H₂SiO₃', 'H4SiO4', 'H₄SiO₄', 'H2MoO4', 'H₂MoO₄', 'H2WO4', 'H₂WO₄'
  ])
  if (formulas.some(f => PRECIPITATES.has(f))) {
    return '难溶沉淀 / 胶体'
  }

  // 6. 固体金属与非金属单质、固体氧化物 (固态晶体/粉末)
  if (node.category === '单质') {
    return '固体粉末 / 晶体'
  }

  if (node.category === '氧化物') {
    return '固体粉末 / 晶体'
  }

  // 7. 易溶强碱（如 NaOH, KOH, Ba(OH)₂）与可溶性盐/水溶液
  return '澄清离子水溶液'
}

/**
 * 获取当前元素专属关联的课标教材章节节点
 */
export function getElementKnowledgeNodes(symbol: string): KnowledgeNode[] {
  const directNodeMap: Record<string, string[]> = {
    Fe: ['iron', 'redox-basic'],
    Cu: ['copper', 'redox-basic'],
    Al: ['aluminum', 'redox-basic'],
    Na: ['sodium', 'redox-basic'],
    K: ['sodium', 'redox-basic'],
    Li: ['sodium', 'redox-basic'],
    Mg: ['aluminum', 'redox-basic'],
    Ca: ['sodium', 'redox-basic'],
    Ba: ['aluminum', 'precipitation-equilibrium'],
    S: ['sulfur', 'redox-basic'],
    N: ['nitrogen', 'redox-basic'],
    P: ['nitrogen', 'redox-basic'],
    As: ['nitrogen', 'redox-basic'],
    Cl: ['chlorine', 'redox-basic'],
    Br: ['chlorine', 'redox-basic'],
    I: ['chlorine', 'redox-basic'],
    F: ['chlorine', 'redox-basic'],
    Si: ['silicon', 'chemical-bond'],
    C: ['silicon', 'redox-basic'],
    Mn: ['manganese-chromium', 'redox-basic'],
    Cr: ['manganese-chromium', 'redox-basic'],
    Ti: ['manganese-chromium', 'redox-basic'],
    V: ['manganese-chromium', 'redox-basic'],
    Co: ['iron', 'redox-basic'],
    Ni: ['iron', 'redox-basic'],
    Zn: ['aluminum', 'redox-basic'],
    Ag: ['copper', 'precipitation-equilibrium'],
    Mo: ['manganese-chromium', 'redox-basic'],
    W: ['manganese-chromium', 'redox-basic'],
    Pb: ['aluminum', 'redox-basic'],
    Bi: ['nitrogen', 'redox-basic'],
    Sn: ['silicon', 'redox-basic'],
    Sb: ['nitrogen', 'redox-basic'],
    Se: ['sulfur', 'redox-basic'],
    Te: ['sulfur', 'redox-basic'],
    B: ['silicon', 'chemical-bond'],
    Ga: ['aluminum', 'redox-basic'],
    In: ['aluminum', 'redox-basic'],
    Tl: ['aluminum', 'redox-basic'],
    H: ['redox-basic', 'chemical-bond'],
    O: ['redox-basic', 'chemical-bond'],
  }

  const nodeIds = directNodeMap[symbol] || ['redox-basic']
  return nodeIds
    .map(id => getKnowledgeNode(id))
    .filter((node): node is NonNullable<typeof node> => Boolean(node))
}
