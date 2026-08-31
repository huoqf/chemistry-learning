import type { IonItem } from './types'
import { CATION_DATA } from './data/cationData'
import { ANION_DATA } from './data/anionData'

export { CATION_DATA } from './data/cationData'
export { ANION_DATA } from './data/anionData'
export { COEXISTENCE_CONFLICTS } from './data/coexistenceConflicts'

/** 16 种新高考核心阴阳离子全集 */
export const ION_DATA: IonItem[] = [...CATION_DATA, ...ANION_DATA]
