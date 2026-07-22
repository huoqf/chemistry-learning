/**
 * 碰撞理论公式、高考考点与动态化学量构建器
 */

import type { ChemistryQuantity } from '@/data/chemistryQuantities'

/**
 * 碰撞理论动态化学量构建器 (供右屏 QuantitySection 展示)
 */
export function buildCollisionTheoryQuantities(
  params: Record<string, number>
): ChemistryQuantity[] {
  const temperature = (params['temperature'] as number) ?? 298
  const concentration = (params['concentration'] as number) ?? 1.0
  const activationEnergy = (params['activationEnergy'] as number) ?? 80
  const hasCatalyst = ((params['catalyst'] as number) ?? 0) > 0.5

  const R = 8.314
  const effectiveEa = hasCatalyst ? activationEnergy * 0.55 : activationEnergy
  const f = Math.exp((-effectiveEa * 1000) / (R * temperature * 2.5))
  const zTotal = 120 * concentration * Math.sqrt(temperature / 298)
  const zEff = zTotal * f
  const k = 100 * f
  const v = k * concentration

  return [
    {
      key: 'temperature',
      label: '体系绝对温度 T',
      value: temperature,
      unit: 'K',
      colorKey: 'temperature',
      precision: 0,
    },
    {
      key: 'concentration',
      label: '反应物浓度 c',
      value: concentration,
      unit: 'mol/L',
      colorKey: 'concentration',
      precision: 1,
    },
    {
      key: 'activationEnergy',
      label: '实效活化能 Ea',
      value: effectiveEa,
      unit: 'kJ/mol',
      colorKey: 'activation',
      precision: 1,
    },
    {
      key: 'activationFraction',
      label: '活化分子百分数 f',
      value: f * 100,
      unit: '%',
      colorKey: 'activation',
      precision: 2,
    },
    {
      key: 'effectiveCollisions',
      label: '有效碰撞频率 Z_eff',
      value: zEff,
      unit: '次/(L·s)',
      colorKey: 'reactionRate',
      precision: 1,
    },
    {
      key: 'reactionRate',
      label: '相对反应速率 v',
      value: v,
      unit: 'mol/(L·s)',
      colorKey: 'reactionRate',
      precision: 2,
    },
  ]
}

export const collisionTheoryFormulas = [
  {
    name: '活化能与反应热关系',
    latex: '\\Delta H = E_{a1} - E_{a2}',
    level: 'core' as const,
    note: 'Ea1 为正反应活化能，Ea2 为逆反应活化能；ΔH < 0 为放热反应，ΔH > 0 为吸热反应',
  },
  {
    name: '阿伦尼乌斯方程',
    latex: 'k = A \\cdot \\exp\\left(-\\frac{E_a}{RT}\\right)',
    level: 'core' as const,
    note: 'k 为速率常数，A 指前因子，Ea 活化能，R 气体常数 (8.314 J/(mol·K))，T 热力学温度',
  },
  {
    name: '活化分子比例',
    latex: 'f \\approx \\exp\\left(-\\frac{E_a}{RT}\\right)',
    level: 'derived' as const,
    note: '能量 E ≥ Ea 的活化分子占总分子的比例，温度升高或催化剂降低 Ea 均使 f 显著增大',
  },
  {
    name: '有效碰撞频率方程',
    latex: 'Z_{\\text{eff}} = Z_0 \\cdot f \\cdot P',
    level: 'important' as const,
    note: 'Z₀ 为总碰撞频率，f 为活化分子百分数，P 为空间方位/取向因子',
  },
  {
    name: '反应速率基元方程',
    latex: 'v = k \\cdot c^m(\\text{A}) \\cdot c^n(\\text{B})',
    level: 'core' as const,
    note: 'v 与有效碰撞频率成正比，温度与催化剂通过改变 k 影响速率，浓度通过改变碰撞频率影响速率',
  },
]

export const collisionTheoryExamPoints = [
  {
    text: '【有效碰撞双条件】分子发生化学反应必须同时满足：①能量达到或超过活化能 Ea；②碰撞发生于正确的空间取向。',
    importance: 'gaokao' as const,
  },
  {
    text: '【催化剂微观本质】催化剂改变反应历程（出现中间体），降低活化能 Ea，使活化分子百分数 f 显著增加；但不能改变反应热 ΔH 和化学平衡位置。',
    importance: 'gaokao' as const,
  },
  {
    text: '【温度影响本质】升高温度既增加分子运动速率（碰撞频率 Z0 小幅上升），更主要显著增加活化分子百分数 f（能量指数上升）。',
    importance: 'gaokao' as const,
  },
  {
    text: '【浓度/压强影响本质】增大浓度或压强增加单位体积内总分子数和活化分子数，碰撞频率 Z0 上升，但活化分子百分数 f 保持不变。',
    importance: 'core' as const,
  },
  {
    text: '【正逆活化能判定】放热反应正活化能 Ea1 < 逆活化能 Ea2；吸热反应正活化能 Ea1 > 逆活化能 Ea2。',
    importance: 'core' as const,
  },
]
