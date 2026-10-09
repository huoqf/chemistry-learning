/**
 * src/chemistry/collision.ts
 * 碰撞理论与麦克斯韦-玻尔兹曼分布物理化学计算 — 纯计算，零副作用，零 React/DOM 依赖
 *
 * ── 为什么单独设立本模块 ──
 * 碰撞理论曾在三处各自计算活化分子分数 f：
 *   1. useMaxwellBoltzmann.ts: 曲线数值积分算出 areaRatio，却用 0.4*areaRatio + 0.6*arrhenius 混合；
 *   2. collisionTheory.ts (右屏): 试图用 Arrhenius 指数项算 f，但因标度不匹配导致 f 趋近于 0 (0.00%)；
 *   3. useCollisionPhysics.ts (粒子引擎): 同样用指数项导致活化分子百分数恒为 0，粒子极难发生反应。
 *
 * 三处数值互不一致，右屏面板与中屏曲线文字严重脱节。
 * 本模块收敛为唯一权威源：以麦克斯韦-玻尔兹曼能量分布的阴影积分面积占比为基准，
 * 确保图表阴影、文字标注、右屏数值和微观粒子系统 100% 物理自洽同源。
 */

export interface BoltzmannPoint {
  /** 相对能量 E (kJ/mol) */
  energy: number
  /** 分子数比例 f(E) */
  fraction: number
  /** 是否达到活化能门槛 (E >= Ea) */
  isActivated: boolean
}

export interface MaxwellBoltzmannResult {
  /** 曲线全量数据点 (101 点) */
  curvePoints: BoltzmannPoint[]
  /** 仅 E >= Ea 的活化分子阴影数据点 */
  activatedPoints: BoltzmannPoint[]
  /** 活化分子比例 f (0 ~ 1) */
  activationFraction: number
  /** 当前温度下的最可几能量 / 峰值能量 E_max (kJ/mol) */
  peakEnergy: number
  /** 实效活化能 (kJ/mol) */
  effectiveEa: number
}

export interface CollisionKineticsResult {
  /** 实效活化能 Ea (kJ/mol) */
  effectiveEa: number
  /** 活化分子百分数 f (0 ~ 1) */
  activationFraction: number
  /** 总碰撞频率 Z0 (次/(L·s)) */
  totalCollisions: number
  /** 有效碰撞频率 Z_eff (次/(L·s)) */
  effectiveCollisions: number
  /** 相对反应速率常数 k */
  rateConstant: number
  /** 相对反应速率 v (mol/(L·s)) */
  reactionRate: number
}

/** 催化剂降低活化能的实效系数（降低约 45%，即降至 0.55 倍） */
export const CATALYST_EA_FACTOR = 0.55

/**
 * 计算实效活化能
 * @param activationEnergy 原始活化能 Ea (kJ/mol)
 * @param hasCatalyst 是否加入催化剂
 */
export function computeEffectiveActivationEnergy(
  activationEnergy: number,
  hasCatalyst: boolean
): number {
  return hasCatalyst ? activationEnergy * CATALYST_EA_FACTOR : activationEnergy
}

/**
 * 计算麦克斯韦-玻尔兹曼能量分布及活化分子占比
 * @param temperature 绝对温度 T (K)
 * @param activationEnergy 活化能 Ea (kJ/mol)
 * @param hasCatalyst 是否有催化剂
 */
export function computeMaxwellBoltzmann(
  temperature: number,
  activationEnergy: number,
  hasCatalyst: boolean
): MaxwellBoltzmannResult {
  const effectiveEa = computeEffectiveActivationEnergy(activationEnergy, hasCatalyst)

  const steps = 100
  const maxEnergy = 160 // 图表 X 轴最大能量 (kJ/mol)
  const curvePoints: BoltzmannPoint[] = []
  const activatedPoints: BoltzmannPoint[] = []

  // 特征基准能量 E0 (随 T 线性增大，T=298K 时 E0=36)
  const E0 = 36 * (temperature / 298)
  /**
   * 分布函数的尺度参数 S = E0 / 2。
   * 曲线形状为 f(u) = peakHeight · √u · e^(0.5−u)，其中自变量 u = E / S。
   */
  const scaleEnergy = E0 / 2
  /**
   * 最可几能量（曲线极大值点）：f(u) 在 u = 1/2 处取极大，
   * 故峰位 E = S / 2 = E0 / 4（298 K → 9 kJ/mol）。
   *
   * 原实现直接返回 S 并把注释写成「峰值出现在 E=18」，与曲线实际峰顶（9）
   * 相差整整一倍 —— 属自相矛盾的导出量（该字段当时无 UI 消费方，故未被发现）。
   */
  const peakEnergy = E0 / 4
  // 峰值高度随 T 升高而适度下降 (保证曲线变扁平、包围总面积近乎恒定)
  const peakHeight = 22 * Math.sqrt(36 / E0)

  let totalArea = 0
  let activatedArea = 0

  for (let i = 0; i <= steps; i++) {
    const E = (i / steps) * maxEnergy
    const ratio = Math.max(0, E / scaleEnergy)
    const fE = ratio > 0 ? peakHeight * Math.sqrt(ratio) * Math.exp(0.5 - ratio) : 0
    const isActivated = E >= effectiveEa

    const point: BoltzmannPoint = { energy: E, fraction: fE, isActivated }
    curvePoints.push(point)

    if (isActivated) {
      activatedPoints.push(point)
      activatedArea += fE
    }
    totalArea += fE
  }

  // 严格基于阴影面积积分占比作为活化分子百分数 f，保证几何与物理完全自洽
  const areaRatio = totalArea > 0 ? activatedArea / totalArea : 0
  const activationFraction = Math.max(0.005, Math.min(0.99, areaRatio))

  return {
    curvePoints,
    activatedPoints,
    activationFraction,
    peakEnergy,
    effectiveEa,
  }
}

/**
 * 计算碰撞动力学特征量
 * @param params 反应参数：温度、浓度、活化能、催化剂
 */
export function computeCollisionKinetics(params: {
  temperature: number
  concentration: number
  activationEnergy: number
  hasCatalyst: boolean
}): CollisionKineticsResult {
  const { temperature, concentration, activationEnergy, hasCatalyst } = params
  const mb = computeMaxwellBoltzmann(temperature, activationEnergy, hasCatalyst)
  const f = mb.activationFraction

  // 总碰撞频率与浓度成正比，与温度的平方根成正比
  const zTotal = 120 * concentration * Math.sqrt(temperature / 298)
  const zEff = zTotal * f
  const k = 100 * f
  const v = k * concentration

  return {
    effectiveEa: mb.effectiveEa,
    activationFraction: f,
    totalCollisions: zTotal,
    effectiveCollisions: zEff,
    rateConstant: k,
    reactionRate: v,
  }
}
