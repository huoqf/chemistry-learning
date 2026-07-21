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

export const vseprFormulas = [
  {
    name: 'VSEPR 孤电子对计算公式',
    latex: 'n = \\frac{1}{2} (a - x - m \\cdot y)',
    level: 'core' as const,
    condition: 'a:中心最外层电子数, x:电荷, m:配体数, y:配体结合电子数(H/卤素=1, O/S=2)',
  },
  {
    name: '价电子对总数与杂化轨道关系',
    latex: 'm + n \\implies sp^{m+n-1}',
    level: 'core' as const,
    condition: '2对:sp(180°), 3对:sp²(120°), 4对:sp³(109.5°)',
  },
]

export const vseprExamPoints = [
  {
    text: '【孤电子对压缩效应】孤电子对对成键电子对的排斥力大于成键电子对之间的排斥力。如等电子对(4对)的键角：CH₄ (109.5°) > NH₃ (107°) > H₂O (104.5°)。',
    importance: 'gaokao' as const,
  },
  {
    text: '【配体结合电子数 y】H 和卤素原子作为配体时，y = 1；O 和 S 作为配体时，y = 2。阳离子减去电荷数 x，阴离子加上电荷绝对值。',
    importance: 'gaokao' as const,
  },
  {
    text: '【空间位置选择原则】在三角双锥(5对)体系中，孤电子对优先选择赤道位置(较宽广，90°相互作用最少)；在正八面体(6对)体系中，2对孤电子对处于互为 180° 的对位。',
    importance: 'hard' as const,
  },
]
