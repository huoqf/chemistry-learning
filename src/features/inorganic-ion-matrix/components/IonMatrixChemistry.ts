/**
 * 分步连续滴加的真实化学相变计算（统一门面入口）。
 * 遵循铁律 10 领域内聚准则，按化学大类拆分为阳离子与阴离子相变子模块：
 * - cationStepChemistry.ts: 14 种阳离子（内聚金属显色、沉淀与焰色）
 * - anionStepChemistry.ts: 18 种阴离子（内聚酸根与卤素置换、产气与沉淀）
 */
import { computeCationStepChemistry } from './cationStepChemistry'
import { computeAnionStepChemistry } from './anionStepChemistry'

export interface StepChemistryState {
  fillLevel: number
  fillColor: string
  hasPrecipitate: boolean
  precipitateLevel: number
  precipitateColor: string
  hasGas: boolean
  litmusChange: boolean
  annotation: string
  stepTitle: string
  isFlameTest?: boolean
  flameColor?: string
  hasCobaltGlass?: boolean
}

/** 计算分步连续滴加的真实化学相变与现象描述 */
export function computeStepChemistry(
  ionId: string,
  reagentId: string,
  dropCount: number,
  baseColor: string
): StepChemistryState {
  // ── 0 滴：未滴加初始状态 ──
  if (dropCount === 0) {
    return {
      fillLevel: 0.38,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '待测原液准备就绪，请在上方悬空滴加试剂',
      stepTitle: '未开始实验',
      isFlameTest:
        ionId === 'Na+' ||
        ionId === 'K+' ||
        (ionId === 'Ca2+' && reagentId.includes('flame')),
    }
  }

  // 1. 优先按阳离子领域计算 (14 种阳离子)
  const cationResult = computeCationStepChemistry(ionId, reagentId, dropCount, baseColor)
  if (cationResult) {
    return cationResult
  }

  // 2. 按阴离子领域计算 (18 种阴离子)
  const anionResult = computeAnionStepChemistry(ionId, reagentId, dropCount, baseColor)
  if (anionResult) {
    return anionResult
  }

  // 3. 通用兜底状态
  return {
    fillLevel: dropCount === 1 ? 0.52 : 0.68,
    fillColor: baseColor,
    hasPrecipitate: false,
    precipitateLevel: 0,
    precipitateColor: '#ffffff',
    hasGas: false,
    litmusChange: false,
    annotation: `滴加 ${dropCount === 1 ? '少量' : '过量'} 试剂：反应进行`,
    stepTitle: dropCount === 1 ? '阶段 1/2：滴加少量试剂' : '阶段 2/2：继续滴加过量',
  }
}