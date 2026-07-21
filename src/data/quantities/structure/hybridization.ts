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

export const hybridizationFormulas = [
  {
    name: '杂化轨道成分计算公式',
    latex: '\\text{s \\%} = \\frac{1}{1 + n} \\times 100\\%, \\quad \\text{p \\%} = \\frac{n}{1 + n} \\times 100\\%',
    level: 'core' as const,
    condition: '对 spⁿ 杂化轨道，n 为参与杂化的 p 轨道个数 (sp: 50%/50%, sp²: 33.3%/66.7%, sp³: 25%/75%)',
  },
  {
    name: '杂化轨道数与 VSEPR 电子对数关系',
    latex: 'N_{\\text{hybrid}} = \\text{中心原子 } \\sigma \\text{ 键数} + \\text{孤电子对数}',
    level: 'core' as const,
    condition: 'N=2 为 sp 杂化(180°), N=3 为 sp² 杂化(120°), N=4 为 sp³ 杂化(109.5°)',
  },
]

export const hybridizationExamPoints = [
  {
    text: '【杂化轨道类型快速判断】中心原子价电子对数 = σ 键数 + 孤电子对数。等于 2 采取 sp 杂化(直线形)；3 采取 sp² 杂化(平面三角形)；4 采取 sp³ 杂化(正四面体)。',
    importance: 'gaokao' as const,
  },
  {
    text: '【σ 键与 π 键重叠特征】σ 键由杂化轨道/s轨道“头碰头”重叠，关于键轴对称，可自由旋转；π 键由未杂化的 p 轨道“肩并肩”平行重叠，镜像对称，不能自由旋转。',
    importance: 'gaokao' as const,
  },
  {
    text: '【s 成分对键长与电负性的影响】s 成分比例越高(sp > sp² > sp³)，杂化轨道在原子核附近分布越集中、越短胖，原子的电负性表现越强，所形成的 σ 键越短越牢固。',
    importance: 'hard' as const,
  },
]
