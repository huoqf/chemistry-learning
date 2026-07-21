import type { ChemistryQuantity } from '../../chemistryQuantities'

export function buildLeChatelierQuantities(
  params: Record<string, number>,
  time: number
): ChemistryQuantity[] {
  const temp = params.temp ?? 298
  const pressure = params.pressure ?? 1.0
  const addedNO2 = params.addedNO2 ?? 0

  // 基础计算
  const T0 = 298
  const K0 = 2.0
  const K = parseFloat((K0 * Math.exp(2000 * (1 / temp - 1 / T0))).toFixed(3))

  const totalEquiv = (1.5 + addedNO2) * pressure
  const a = K
  const b = 1
  const c = -totalEquiv
  const eqNO2 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a)
  const eqN2O4 = K * eqNO2 * eqNO2

  const initNO2 = (1.0 + addedNO2) * pressure
  const initN2O4 = 0.5 * pressure
  const alpha = Math.exp(-0.6 * time)

  const cNO2 = parseFloat((eqNO2 + (initNO2 - eqNO2) * alpha).toFixed(3))
  const cN2O4 = parseFloat((eqN2O4 + (initN2O4 - eqN2O4) * alpha).toFixed(3))
  const Qc = parseFloat((cN2O4 / (cNO2 * cNO2)).toFixed(3))

  return [
    {
      key: 'cNO2',
      label: 'c(NO₂) 浓度',
      value: cNO2,
      unit: 'mol/L',
      colorKey: 'concentration',
      precision: 3,
    },
    {
      key: 'cN2O4',
      label: 'c(N₂O₄) 浓度',
      value: cN2O4,
      unit: 'mol/L',
      colorKey: 'concentration',
      precision: 3,
    },
    {
      key: 'temp',
      label: '反应体系温度 T',
      value: temp,
      unit: 'K',
      colorKey: 'temperature',
      precision: 1,
    },
    {
      key: 'K',
      label: '平衡常数 K',
      value: K,
      unit: '',
      colorKey: 'equilibriumConstant',
      precision: 3,
    },
    {
      key: 'Qc',
      label: '浓度商 Qc',
      value: Qc,
      unit: '',
      colorKey: 'reactionRate',
      precision: 3,
    },
  ]
}

export const leChatelierFormulas: Array<{ name: string; latex: string; condition?: string; note?: string; level?: 'core' | 'important' | 'derived' | 'supplementary' }> = [
  {
    name: '平衡常数 K 表达式',
    latex: 'K = \\frac{c(\\text{N}_2\\text{O}_4)}{c^2(\\text{NO}_2)}',
    level: 'core',
    condition: '温度 T 一定时 K 为常数',
  },
  {
    name: '正向移动判据',
    latex: '\\begin{aligned} Q_c &< K \\\\ &\\implies \\text{正向移动} \\end{aligned}',
    level: 'important',
    condition: '反应物浓度大或生成物浓度小',
  },
  {
    name: '平衡状态判据',
    latex: '\\begin{aligned} Q_c &= K \\\\ &\\implies \\text{化学平衡} \\end{aligned}',
    level: 'core',
    condition: 'v(\\text{正}) = v(\\text{逆})',
  },
  {
    name: '逆向移动判据',
    latex: '\\begin{aligned} Q_c &> K \\\\ &\\implies \\text{逆向移动} \\end{aligned}',
    level: 'important',
    condition: '生成物浓度大或反应物浓度小',
  },
]

export const leChatelierExamPoints: Array<{ text: string; importance: 'gaokao' | 'hard' | 'core' | 'basic' | 'extend' }> = [
  {
    text: '【压强影响】增大压强，平衡向气体分子数减小的方向移动（正反应方向）；减小压强反之。',
    importance: 'gaokao',
  },
  {
    text: '【温度影响】该反应放热 (ΔH < 0)，升高温度，平衡向吸热反应方向（逆反应方向）移动，K 值减小。',
    importance: 'gaokao',
  },
  {
    text: '【高考易错点】催化剂同等程度改变正逆反应速率，V_正 = V_逆 依然成立，平衡不发生移动！',
    importance: 'hard',
  },
]
