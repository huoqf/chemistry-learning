/**
 * VSEPR 预设数据库与 3D 坐标几何分布算法
 *
 * 本文件为统一导出入口（barrel file），保持向后兼容。
 * 具体实现已拆分到同目录下的子模块中。
 */

export type { VseprMolecule } from './types'
export {
  R_BOND,
  normalize,
  GEOMETRY_VERTICES,
  generatePolyEdgesByIndices,
  POLY_EDGES,
} from './geometry'
export {
  VSEPR_PRESETS,
  LINEAR_MOLECULES,
  TRIGONAL_PLANAR_MOLECULES,
  TETRAHEDRAL_MOLECULES,
  TRIGONAL_BIPYRAMIDAL_MOLECULES,
  OCTAHEDRAL_MOLECULES,
} from './presets'
