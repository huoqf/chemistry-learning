import type { IonPairCell } from '../types'
import { MAIN_GROUP_CONFLICTS } from './conflicts/mainGroupConflicts'
import { TRANSITION_METAL_CONFLICTS } from './conflicts/transitionMetalConflicts'

export { MAIN_GROUP_CONFLICTS } from './conflicts/mainGroupConflicts'
export { TRANSITION_METAL_CONFLICTS } from './conflicts/transitionMetalConflicts'

/** 14 阳离子 × 18 阴离子全集所有反应互斥离子对明细数据库 (组合主族与过渡金属子库) */
export const CONFLICT_MAP: Record<string, IonPairCell> = {
  ...MAIN_GROUP_CONFLICTS,
  ...TRANSITION_METAL_CONFLICTS,
}
