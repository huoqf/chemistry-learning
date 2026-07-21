/**
 * VSEPR 分子预设数据汇总
 */

import { LINEAR_MOLECULES } from './linear'
import { TRIGONAL_PLANAR_MOLECULES } from './trigonalPlanar'
import { TETRAHEDRAL_MOLECULES } from './tetrahedral'
import { TRIGONAL_BIPYRAMIDAL_MOLECULES } from './trigonalBipyramidal'
import { OCTAHEDRAL_MOLECULES } from './octahedral'
import type { VseprMolecule } from '../types'

export const VSEPR_PRESETS: Record<string, VseprMolecule> = {
  ...LINEAR_MOLECULES,
  ...TRIGONAL_PLANAR_MOLECULES,
  ...TETRAHEDRAL_MOLECULES,
  ...TRIGONAL_BIPYRAMIDAL_MOLECULES,
  ...OCTAHEDRAL_MOLECULES,
}

export {
  LINEAR_MOLECULES,
  TRIGONAL_PLANAR_MOLECULES,
  TETRAHEDRAL_MOLECULES,
  TRIGONAL_BIPYRAMIDAL_MOLECULES,
  OCTAHEDRAL_MOLECULES,
}
