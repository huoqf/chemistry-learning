/**
 * 反应历程与势能曲线计算 hook / 纯函数
 *
 * 计算反应物 -> 过渡态 (TS) -> 生成物 势能变化及催化剂影响
 */

export interface EnergyPoint {
  x: number // 反应历程 (0 ~ 1)
  y: number // 相对能量 (kJ/mol)
}

export interface EnergyProfileResult {
  reactantsEnergy: number
  productsEnergy: number
  deltaH: number
  /** 无催化剂正活化能 (kJ/mol) */
  ea1Normal: number
  /** 无催化剂逆活化能 (kJ/mol) */
  ea2Normal: number
  /** 催化剂正活化能 (kJ/mol) */
  ea1Catalyst: number
  /** 无催化剂势能曲线点 (用于绘图) */
  normalPath: EnergyPoint[]
  /** 有催化剂势能曲线点 (用于绘图，双峰中间体模型) */
  catalystPath: EnergyPoint[]
  /** 过渡态/峰值位置 */
  peakNormal: EnergyPoint
  peakCatalyst1: EnergyPoint
  intermediate: EnergyPoint
  peakCatalyst2: EnergyPoint
}

/**
 * 计算反应历程势能数据
 * @param reactionType 反应类型 ('exothermic' 放热 | 'endothermic' 吸热)
 * @param activationEnergy 正反应活化能 Ea1 (kJ/mol, 范围 30~120)
 * @param hasCatalyst 是否加入催化剂
 */
export function computeEnergyProfile(
  reactionType: 'exothermic' | 'endothermic',
  activationEnergy: number,
  hasCatalyst: boolean = false
): EnergyProfileResult {
  const deltaH = reactionType === 'exothermic' ? -40 : 40
  const reactantsEnergy = 50 // 基准点 (kJ/mol)
  const productsEnergy = reactantsEnergy + deltaH

  const ea1Normal = activationEnergy
  const ea2Normal = ea1Normal - deltaH
  const peakYNormal = reactantsEnergy + ea1Normal

  // 催化剂降低活化能（通常降低 30%~50%）
  const ea1Catalyst = hasCatalyst ? ea1Normal * 0.55 : ea1Normal * 0.55
  const peakYCat1 = reactantsEnergy + ea1Catalyst
  const intermediateY = reactantsEnergy + ea1Catalyst * 0.3
  const peakYCat2 = reactantsEnergy + ea1Catalyst * 0.95

  // 1. 无催化剂路径（单峰平滑高斯/贝塞尔插值）
  const normalPath: EnergyPoint[] = []
  const steps = 50
  for (let i = 0; i <= steps; i++) {
    const t = i / steps // 0 ~ 1
    const base = (1 - t) * reactantsEnergy + t * productsEnergy
    const peakContribution = ea1Normal * Math.pow(Math.sin(Math.PI * t), 1.8)
    normalPath.push({ x: t, y: base + peakContribution })
  }

  // 2. 有催化剂路径（双峰中间体路径）
  const catalystPath: EnergyPoint[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const base = (1 - t) * reactantsEnergy + t * productsEnergy
    let peakContribution = 0
    if (t <= 0.5) {
      const subT = t / 0.5
      peakContribution = ea1Catalyst * Math.pow(Math.sin(Math.PI * subT), 1.8)
    } else {
      const subT = (t - 0.5) / 0.5
      const secondPeakHeight = ea1Catalyst * 0.95
      peakContribution = secondPeakHeight * Math.pow(Math.sin(Math.PI * subT), 1.8)
    }
    catalystPath.push({ x: t, y: base + peakContribution })
  }

  return {
    reactantsEnergy,
    productsEnergy,
    deltaH,
    ea1Normal,
    ea2Normal,
    ea1Catalyst,
    normalPath,
    catalystPath,
    peakNormal: { x: 0.5, y: peakYNormal },
    peakCatalyst1: { x: 0.25, y: peakYCat1 },
    intermediate: { x: 0.5, y: intermediateY },
    peakCatalyst2: { x: 0.75, y: peakYCat2 },
  }
}
