import type { IonPairCell } from '../types'
import { MAIN_GROUP_CONFLICTS } from './conflicts/mainGroupConflicts'
import { TRANSITION_METAL_CONFLICTS } from './conflicts/transitionMetalConflicts'
import { PHOSPHATE_CONFLICTS } from './conflicts/phosphateConflicts'

export { MAIN_GROUP_CONFLICTS } from './conflicts/mainGroupConflicts'
export { TRANSITION_METAL_CONFLICTS } from './conflicts/transitionMetalConflicts'
export { PHOSPHATE_CONFLICTS } from './conflicts/phosphateConflicts'

/** 14 阳离子 × 19 阴离子全集所有反应互斥离子对明细数据库 (主族 + 过渡金属 + 磷酸根子库) */
export const CONFLICT_MAP: Record<string, IonPairCell> = {
  ...MAIN_GROUP_CONFLICTS,
  ...TRANSITION_METAL_CONFLICTS,
  ...PHOSPHATE_CONFLICTS,
}
