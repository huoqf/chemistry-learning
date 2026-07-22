import type { ChemistryQuantity } from '../../chemistryQuantities'
import { VSEPR_PRESETS } from '../../../features/structure/vsepr-model/data/vseprData'
import { VSEPR_PRESET_KEYS } from '../../../features/structure/vsepr-model/hooks/useVseprChemistry'

export function buildVseprQuantities(params: Record<string, number>): ChemistryQuantity[] {
  const rawIdx = params.presetIdx ?? 0
  const safeIdx = Math.min(Math.max(0, Math.floor(rawIdx)), VSEPR_PRESET_KEYS.length - 1)
  const key = VSEPR_PRESET_KEYS[safeIdx] || 'co2'
  const mol = VSEPR_PRESETS[key] || VSEPR_PRESETS.co2

  return [
    {
      key: 'totalPairs',
      label: '价电子对总数 (m+n)',
      value: mol.totalPairs,
      unit: '对',
      colorKey: 'concentration',
      precision: 0,
    },
    {
      key: 'sigmaBonds',
      label: 'σ 键电子对数 m',
      value: mol.ligandCount,
      unit: '对',
      colorKey: 'temperature',
      precision: 0,
    },
    {
      key: 'lonePairs',
      label: '孤电子对数 n',
      value: mol.lonePairCount,
      unit: '对',
      colorKey: 'equilibriumConstant',
      precision: 0,
    },
    {
      key: 'centralValence',
      label: '中心原子价电子数 a',
      value: mol.centralValence,
      unit: 'e⁻',
      colorKey: 'reactionRate',
      precision: 0,
    },
  ]
}

export function getVseprFormulas(params: Record<string, number>) {
  const rawIdx = params.presetIdx ?? 0
  const safeIdx = Math.min(Math.max(0, Math.floor(rawIdx)), VSEPR_PRESET_KEYS.length - 1)
  const key = VSEPR_PRESET_KEYS[safeIdx] || 'co2'
  const mol = VSEPR_PRESETS[key] || VSEPR_PRESETS.co2

  const a = mol.centralValence
  const m = mol.ligandCount
  const y = mol.ligandValence
  const x = mol.charge
  const n = mol.lonePairCount
  const total = mol.totalPairs

  const chargeStr = x > 0 ? ` - ${x}` : x < 0 ? ` + ${Math.abs(x)}` : ''

  return [
    {
      name: `${mol.name} 孤电子对代入计算`,
      latex: `n = \\frac{1}{2}(a - x - m \\cdot y) = \\frac{1}{2}(${a}${chargeStr} - ${m} \\times ${y}) = ${n}`,
      level: 'core' as const,
      condition: `a=${a}(最外层电子), m=${m}(配体数), y=${y}(配体结合电子数)`,
    },
    {
      name: '价电子对总数与杂化轨道构型',
      latex: `m + n = ${m} + ${n} = ${total} \\implies ${mol.hybridization} \\text{ 杂化}`,
      level: 'core' as const,
      condition: `电子对构型: ${mol.electronGeometry}；分子构型: ${mol.molecularGeometry}`,
    },
    {
      name: '实际键角',
      latex: `\\text{键角} \\approx ${mol.bondAngleText}`,
      level: 'important' as const,
      condition: n > 0 ? `受 ${n} 对孤电子对排斥压缩` : '无孤电子对排斥',
    },
  ]
}

export function getVseprExamPoints(params: Record<string, number>) {
  const rawIdx = params.presetIdx ?? 0
  const safeIdx = Math.min(Math.max(0, Math.floor(rawIdx)), VSEPR_PRESET_KEYS.length - 1)
  const key = VSEPR_PRESET_KEYS[safeIdx] || 'co2'
  const mol = VSEPR_PRESETS[key] || VSEPR_PRESETS.co2

  return [
    {
      text: `【${mol.name} 构型考点】${mol.description}`,
      importance: 'gaokao' as const,
    },
    {
      text: `【电子对与分子构型对比】${mol.formula} 的价电子对构型为【${mol.electronGeometry}】，由于包含 ${mol.lonePairCount} 对孤电子对，实际分子构型为【${mol.molecularGeometry}】。注意高考辨析两者区别！`,
      importance: 'gaokao' as const,
    },
    {
      text: `【杂化类型与键角】中心原子 ${mol.centralElement} 采取 ${mol.hybridization} 杂化，实际键角为 ${mol.bondAngleText}。`,
      importance: 'hard' as const,
    },
  ]
}

export const vseprFormulas = getVseprFormulas
export const vseprExamPoints = getVseprExamPoints

