import type { IonItem } from '../types'
import { HALOGEN_ANIONS } from './halogenAnions'
import { OXOACID_ANIONS } from './oxoacidAnions'

export { HALOGEN_ANIONS } from './halogenAnions'
export { OXOACID_ANIONS } from './oxoacidAnions'

/** 高中化学 18 种核心阴离子全集数据库 (5 种卤素/无氧酸根 + 13 种含氧酸根/弱酸根) */
export const ANION_DATA: IonItem[] = [
  // 核心硫酸根与含氧酸根
  OXOACID_ANIONS[0], // SO42-
  // 卤素与无氧酸根
  HALOGEN_ANIONS[0], // Cl-
  HALOGEN_ANIONS[1], // Br-
  HALOGEN_ANIONS[2], // I-
  HALOGEN_ANIONS[3], // F-
  HALOGEN_ANIONS[4], // S2-
  // 其余含氧酸根与弱酸根
  ...OXOACID_ANIONS.slice(1),
]
