import type { ChemistryQuantity } from '../../chemistryQuantities'

export interface HybridPresetInfo {
  id: string
  name: string
  formula: string
  hybridType: 'sp' | 'sp2' | 'sp3'
  sRatio: number // 百分比
  pRatio: number // 百分比
  totalOrbitals: number
  bondAngle: number // 度
  description: string
}

export const HYBRID_PRESETS: Record<string, HybridPresetInfo> = {
  becl2: {
    id: 'becl2',
    name: '氯化铍 BeCl₂',
    formula: 'BeCl₂',
    hybridType: 'sp',
    sRatio: 50,
    pRatio: 50,
    totalOrbitals: 2,
    bondAngle: 180,
    description: 'Be 原子采取 sp 杂化，2 个 sp 杂化轨道夹角 180°，形成直线形分子。',
  },
  co2: {
    id: 'co2',
    name: '二氧化碳 CO₂',
    formula: 'O=C=O',
    hybridType: 'sp',
    sRatio: 50,
    pRatio: 50,
    totalOrbitals: 2,
    bondAngle: 180,
    description: 'C 原子采取 sp 杂化，2 个 sp 杂化轨道形成 2 个 σ 键，未杂化 p 轨道形成大 π 键。',
  },
  c2h2: {
    id: 'c2h2',
    name: '乙炔 C₂H₂',
    formula: 'H-C≡C-H',
    hybridType: 'sp',
    sRatio: 50,
    pRatio: 50,
    totalOrbitals: 2,
    bondAngle: 180,
    description: 'C 原子采取 sp 杂化，形成 σ 键骨架；未杂化的 py, pz 轨道形成 2 个互相垂直的 π 键。',
  },
  bf3: {
    id: 'bf3',
    name: '三氟化硼 BF₃',
    formula: 'BF₃',
    hybridType: 'sp2',
    sRatio: 33.3,
    pRatio: 66.7,
    totalOrbitals: 3,
    bondAngle: 120,
    description: 'B 原子采取 sp² 杂化，3 个 sp² 杂化轨道位于同一平面且夹角 120°，形成平面正三角形。',
  },
  so2: {
    id: 'so2',
    name: '二氧化硫 SO₂',
    formula: 'SO₂',
    hybridType: 'sp2',
    sRatio: 33.3,
    pRatio: 66.7,
    totalOrbitals: 3,
    bondAngle: 119,
    description: 'S 原子采取 sp² 杂化，1 对孤电子对占据 1 个 sp² 轨道，使分子呈现 V 形。',
  },
  c2h4: {
    id: 'c2h4',
    name: '乙烯 C₂H₄',
    formula: 'CH₂=CH₂',
    hybridType: 'sp2',
    sRatio: 33.3,
    pRatio: 66.7,
    totalOrbitals: 3,
    bondAngle: 120,
    description: 'C 原子采取 sp² 杂化形成 3 个 σ 键；剩下一个未杂化的 pz 轨道垂直于平面肩并肩重叠形成 π 键。',
  },
  co3: {
    id: 'co3',
    name: '碳酸根 CO₃²⁻',
    formula: 'CO₃²⁻',
    hybridType: 'sp2',
    sRatio: 33.3,
    pRatio: 66.7,
    totalOrbitals: 3,
    bondAngle: 120,
    description: '中心 C 原子采取 sp² 杂化，形成 3 个 σ 键，垂直于平面的 p 轨道形成离域大 π 键。',
  },
  ch4: {
    id: 'ch4',
    name: '甲烷 CH₄',
    formula: 'CH₄',
    hybridType: 'sp3',
    sRatio: 25,
    pRatio: 75,
    totalOrbitals: 4,
    bondAngle: 109.5,
    description: 'C 原子采取 sp³ 杂化，4 个等同的 sp³ 轨道指向正四面体顶点，键角 109.5°。',
  },
  nh3: {
    id: 'nh3',
    name: '氨气 NH₃',
    formula: 'NH₃',
    hybridType: 'sp3',
    sRatio: 25,
    pRatio: 75,
    totalOrbitals: 4,
    bondAngle: 107,
    description: 'N 原子采取 sp³ 杂化，1 对孤电子对占据 1 个 sp³ 轨道，由于排斥力较大使键角压缩至 107°。',
  },
  h2o: {
    id: 'h2o',
    name: '水 H₂O',
    formula: 'H₂O',
    hybridType: 'sp3',
    sRatio: 25,
    pRatio: 75,
    totalOrbitals: 4,
    bondAngle: 104.5,
    description: 'O 原子采取 sp³ 杂化，2 对孤电子对占据 2 个 sp³ 轨道，使 C-O-H 键角进一步压缩至 104.5°。',
  },
  nh4: {
    id: 'nh4',
    name: '铵根离子 NH₄⁺',
    formula: 'NH₄⁺',
    hybridType: 'sp3',
    sRatio: 25,
    pRatio: 75,
    totalOrbitals: 4,
    bondAngle: 109.5,
    description: 'N 原子采取 sp³ 杂化，形成 4 个 N-H σ 键 (含 1 个配位键)，呈现正四面体构型。',
  },
}

const PRESET_KEYS = [
  'becl2', 'co2', 'c2h2', 'bf3', 'so2', 'c2h4', 'co3', 'ch4', 'nh3', 'h2o', 'nh4',
]

export function buildHybridQuantities(params: Record<string, number>): ChemistryQuantity[] {
  const rawIdx = params.presetIdx ?? 7
  const safeIdx = Math.min(Math.max(0, Math.floor(rawIdx)), PRESET_KEYS.length - 1)
  const key = PRESET_KEYS[safeIdx] || 'ch4'
  const preset = HYBRID_PRESETS[key] || HYBRID_PRESETS.ch4

  return [
    {
      key: 'totalOrbitals',
      label: '杂化轨道总数 N',
      value: preset.totalOrbitals,
      unit: '个',
      colorKey: 'concentration',
      precision: 0,
    },
    {
      key: 'sRatio',
      label: 's 轨道成分比例',
      value: preset.sRatio,
      unit: '%',
      colorKey: 'temperature',
      precision: 1,
    },
    {
      key: 'pRatio',
      label: 'p 轨道成分比例',
      value: preset.pRatio,
      unit: '%',
      colorKey: 'reactionRate',
      precision: 1,
    },
    {
      key: 'bondAngle',
      label: '理想/实际键角',
      value: preset.bondAngle,
      unit: '°',
      colorKey: 'equilibriumConstant',
      precision: 1,
    },
  ]
}

export function getHybridFormulas(params: Record<string, number>) {
  const rawIdx = params.presetIdx ?? 7
  const safeIdx = Math.min(Math.max(0, Math.floor(rawIdx)), PRESET_KEYS.length - 1)
  const key = PRESET_KEYS[safeIdx] || 'ch4'
  const preset = HYBRID_PRESETS[key] || HYBRID_PRESETS.ch4

  const nP = preset.hybridType === 'sp' ? 1 : preset.hybridType === 'sp2' ? 2 : 3

  return [
    {
      name: `${preset.name} (${preset.hybridType} 杂化) 成分占比`,
      latex: `\\text{s\\%} = \\frac{1}{1+${nP}} = ${preset.sRatio}\\% \\quad \\text{p\\%} = \\frac{${nP}}{1+${nP}} = ${preset.pRatio}\\%`,
      level: 'core' as const,
      condition: `杂化轨道总数 N = ${preset.totalOrbitals}`,
    },
    {
      name: '理想/实际键角与空间构型',
      latex: `\\text{键角} = ${preset.bondAngle}^\\circ \\quad (${preset.hybridType} \\text{ 杂化})`,
      level: 'important' as const,
      condition: preset.description,
    },
  ]
}

export function getHybridExamPoints(params: Record<string, number>) {
  const rawIdx = params.presetIdx ?? 7
  const safeIdx = Math.min(Math.max(0, Math.floor(rawIdx)), PRESET_KEYS.length - 1)
  const key = PRESET_KEYS[safeIdx] || 'ch4'
  const preset = HYBRID_PRESETS[key] || HYBRID_PRESETS.ch4

  return [
    {
      text: `【${preset.name} 杂化特征】${preset.description}`,
      importance: 'gaokao' as const,
    },
    {
      text: `【s/p 成分比例】${preset.formula} 中心原子采取 ${preset.hybridType} 杂化，s 轨道占比 ${preset.sRatio}%，p 轨道占比 ${preset.pRatio}%。s 成分越高，杂化轨道在近核处越集中。`,
      importance: 'gaokao' as const,
    },
    {
      text: `【σ 与 π 键区分】杂化轨道仅用于形成 σ 键或存放孤电子对，未杂化的 p 轨道才用于形成 π 键（如乙烯、乙炔、CO₂ 等）。`,
      importance: 'hard' as const,
    },
  ]
}

export const hybridizationFormulas = getHybridFormulas
export const hybridizationExamPoints = getHybridExamPoints

