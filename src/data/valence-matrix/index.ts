import type { ElementValenceConfig } from './types'
import { FE_CONFIG } from './fe'
import { CU_CONFIG } from './cu'
import { AL_CONFIG } from './al'
import { NA_CONFIG } from './na'
import { S_CONFIG } from './s'
import { N_CONFIG } from './n'
import { CL_CONFIG } from './cl'
import { SI_CONFIG } from './si'
import { C_CONFIG } from './c'
import { MN_CONFIG } from './mn'
import { CR_CONFIG } from './cr'

export type {
  ValenceCategory,
  ValenceSubstanceNode,
  ValenceTransformation,
  ElementValenceConfig,
} from './types'

export const VALENCE_MATRIX_DATA: Record<string, ElementValenceConfig> = {
  Fe: FE_CONFIG,
  Cu: CU_CONFIG,
  Al: AL_CONFIG,
  Na: NA_CONFIG,
  S: S_CONFIG,
  N: N_CONFIG,
  Cl: CL_CONFIG,
  Si: SI_CONFIG,
  C: C_CONFIG,
  Mn: MN_CONFIG,
  Cr: CR_CONFIG,
}
