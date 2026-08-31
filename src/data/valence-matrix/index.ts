import type { ElementValenceConfig } from './types'
import { H_CONFIG } from './h'
import { B_CONFIG } from './b'
import { C_CONFIG } from './c'
import { SI_CONFIG } from './si'
import { N_CONFIG } from './n'
import { P_CONFIG } from './p'
import { AS_CONFIG } from './as'
import { O_CONFIG } from './o'
import { S_CONFIG } from './s'
import { SE_CONFIG } from './se'
import { F_CONFIG } from './f'
import { CL_CONFIG } from './cl'
import { BR_CONFIG } from './br'
import { I_CONFIG } from './i'

import { LI_CONFIG } from './li'
import { BE_CONFIG } from './be'
import { NA_CONFIG } from './na'
import { MG_CONFIG } from './mg'
import { AL_CONFIG } from './al'
import { K_CONFIG } from './k'
import { CA_CONFIG } from './ca'
import { GA_CONFIG } from './ga'
import { GE_CONFIG } from './ge'
import { SN_CONFIG } from './sn'
import { SB_CONFIG } from './sb'
import { PB_CONFIG } from './pb'
import { BI_CONFIG } from './bi'
import { BA_CONFIG } from './ba'

import { TI_CONFIG } from './ti'
import { V_CONFIG } from './v'
import { CR_CONFIG } from './cr'
import { MN_CONFIG } from './mn'
import { FE_CONFIG } from './fe'
import { CO_CONFIG } from './co'
import { NI_CONFIG } from './ni'
import { CU_CONFIG } from './cu'
import { ZN_CONFIG } from './zn'
import { MO_CONFIG } from './mo'
import { AG_CONFIG } from './ag'
import { W_CONFIG } from './w'

export type {
  ValenceCategory,
  ValenceSubstanceNode,
  ValenceTransformation,
  ElementGroupCategory,
  ElementValenceConfig,
} from './types'

export const VALENCE_MATRIX_DATA: Record<string, ElementValenceConfig> = {
  // ── A. 主族典型非金属 (14 种) ──
  H: H_CONFIG,
  B: B_CONFIG,
  C: C_CONFIG,
  Si: SI_CONFIG,
  N: N_CONFIG,
  P: P_CONFIG,
  As: AS_CONFIG,
  O: O_CONFIG,
  S: S_CONFIG,
  Se: SE_CONFIG,
  F: F_CONFIG,
  Cl: CL_CONFIG,
  Br: BR_CONFIG,
  I: I_CONFIG,

  // ── B. 主族典型金属与两性金属 (14 种) ──
  Li: LI_CONFIG,
  Be: BE_CONFIG,
  Na: NA_CONFIG,
  Mg: MG_CONFIG,
  Al: AL_CONFIG,
  K: K_CONFIG,
  Ca: CA_CONFIG,
  Ga: GA_CONFIG,
  Ge: GE_CONFIG,
  Sn: SN_CONFIG,
  Sb: SB_CONFIG,
  Ba: BA_CONFIG,
  Pb: PB_CONFIG,
  Bi: BI_CONFIG,

  // ── C. 过渡与工业流程核心金属 (12 种) ──
  Ti: TI_CONFIG,
  V: V_CONFIG,
  Cr: CR_CONFIG,
  Mn: MN_CONFIG,
  Fe: FE_CONFIG,
  Co: CO_CONFIG,
  Ni: NI_CONFIG,
  Cu: CU_CONFIG,
  Zn: ZN_CONFIG,
  Mo: MO_CONFIG,
  Ag: AG_CONFIG,
  W: W_CONFIG,
}
