/**
 * src/features/gas-chain/physics/constraintSolver.ts
 * 气体制备/净化/尾气处理装置链 — 物理与化学约束求解器 (Constraint Solver)
 *
 * 职责：
 * 1. 接收化学逻辑诊断状态与操作参数
 * 2. 求解倒置漏斗触液深度、分液漏斗活塞避让侧、酒精灯外焰贴合高度
 * 3. 解除魔法数字，输出纯数据物理咬合参数
 */

export interface ConstraintSolveInput {
  targetGas: string
  generator: string
  washReagent: string
  dryer: string
  collection: string
  tailGas: string
  flowRate: number
  hasDangerAlert: boolean
  dangerType: string
  baseY: number
}

export interface ApparatusPhysicalConstraints {
  /** 固液常温分液漏斗活塞避让朝向 */
  noHeatHandwheelSide: 'left' | 'right'
  /** 固液常温分液漏斗管口深入深度 */
  noHeatFunnelDipDepth: number
  /** 固固加热酒精灯 Y 偏置 (使外焰顶端精准相切试管下壁) */
  solidHeatingLampYOffset: number
  /** 固液加热酒精灯 Y 偏置 (使外焰顶端精准相切石棉网下壁) */
  liquidHeatingLampYOffset: number
  /** 倒置漏斗大口相切浸入液面深度 (mm/px) */
  funnelContactDepth: number
  /** 干燥管支持底座高度 */
  dryerHolderHeight: number
}

export function solvePhysicalConstraints(
  input: ConstraintSolveInput
): ApparatusPhysicalConstraints {
  const { generator, dryer, tailGas } = input

  // 1. 固液常温分液漏斗活塞硬避让约束
  const noHeatHandwheelSide: 'left' | 'right' = 'left' // 硬性向左侧外侧延伸，避开右出气管 20px
  const noHeatFunnelDipDepth = generator === 'flask-noheat' ? 25 : 0 // 深入锥形瓶反应液面下 25px

  // 2. 酒精灯外焰相切物理约束
  const solidHeatingLampYOffset = -132 // 外焰顶端 100% 紧贴倾斜试管底部外壁
  const liquidHeatingLampYOffset = -68 // 外焰顶端 100% 紧贴石棉网下壁

  // 3. 倒置漏斗触液缓冲物理约束
  const funnelContactDepth = tailGas === 'inverted-funnel' ? 2 : 0 // 相切浸入 2px

  // 4. 干燥管支撑台高度约束
  const dryerHolderHeight = dryer === 'soda-lime' ? 85 : 40

  return {
    noHeatHandwheelSide,
    noHeatFunnelDipDepth,
    solidHeatingLampYOffset,
    liquidHeatingLampYOffset,
    funnelContactDepth,
    dryerHolderHeight,
  }
}
