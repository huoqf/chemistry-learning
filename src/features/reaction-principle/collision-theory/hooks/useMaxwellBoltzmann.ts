/**
 * 麦克斯韦-玻尔兹曼 (Maxwell-Boltzmann) 分子能量分布计算
 *
 * 二维/三维气体分子能量分布曲线 f(E)
 * E >= Ea 的阴影面积即为活化分子百分数 f
 */

export interface BoltzmannPoint {
  energy: number // 相对能量 E (kJ/mol)
  fraction: number // 分子数比例 f(E)
  isActivated: boolean // E >= Ea
}

export interface MaxwellBoltzmannResult {
  /** 曲线全量数据点 */
  curvePoints: BoltzmannPoint[]
  /** 仅 E >= Ea 的活化分子阴影数据点 */
  activatedPoints: BoltzmannPoint[]
  /** 活化分子比例 f (0 ~ 1) */
  activationFraction: number
  /** 当前温度下的峰值能量 E_max */
  peakEnergy: number
}

const R = 8.314 // J/(mol·K)

/**
 * 计算麦克斯韦-玻尔兹曼能量分布
 * @param temperature 绝对温度 T (K)
 * @param activationEnergy 活化能 Ea (kJ/mol)
 * @param hasCatalyst 是否加催化剂 (使 Ea 门槛左移)
 */
export function computeMaxwellBoltzmann(
  temperature: number,
  activationEnergy: number,
  hasCatalyst: boolean
): MaxwellBoltzmannResult {
  // 实效活化能 (若有催化剂，Ea 门槛降低)
  const effectiveEa = hasCatalyst ? activationEnergy * 0.55 : activationEnergy

  const steps = 100
  const maxEnergy = 160 // 图表 X 轴最大能量 (kJ/mol)
  const curvePoints: BoltzmannPoint[] = []
  const activatedPoints: BoltzmannPoint[] = []

  // 特征基准能量 E0 (随 T 线性增大，T=298K 时 E0=36, 峰值出现在 E=18)
  const E0 = 36 * (temperature / 298)
  const peakEnergy = E0 / 2
  // 峰值高度随 T 升高而适度下降 (保证曲线变扁平、包围总面积近乎恒定)
  const peakHeight = 22 * Math.sqrt(36 / E0)

  let totalArea = 0
  let activatedArea = 0

  for (let i = 0; i <= steps; i++) {
    const E = (i / steps) * maxEnergy
    // 麦克斯韦-玻尔兹曼能量分布函数: f(E) = peakHeight * sqrt(E / peakEnergy) * exp(0.5 - E / peakEnergy)
    const ratio = Math.max(0, E / peakEnergy)
    const fE = ratio > 0 ? peakHeight * Math.sqrt(ratio) * Math.exp(0.5 - ratio) : 0
    const isActivated = E >= effectiveEa

    const point = { energy: E, fraction: fE, isActivated }
    curvePoints.push(point)

    if (isActivated) {
      activatedPoints.push(point)
      activatedArea += fE
    }
    totalArea += fE
  }

  // 活化分子占比 (通过阴影面积占比与 阿伦尼乌斯指数项 平滑拟合)
  const areaRatio = totalArea > 0 ? activatedArea / totalArea : 0
  const arrheniusFraction = Math.exp((-effectiveEa * 1000) / (R * temperature * 2.5))
  const activationFraction = Math.max(0.01, Math.min(0.99, 0.4 * areaRatio + 0.6 * arrheniusFraction))

  return {
    curvePoints,
    activatedPoints,
    activationFraction,
    peakEnergy,
  }
}

