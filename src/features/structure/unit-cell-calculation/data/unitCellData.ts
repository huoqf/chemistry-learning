/**
 * 晶胞预设数据库
 *
 * 本文件为统一导出入口（barrel file），保持向后兼容。
 * 具体实现已拆分到同目录下的子模块中。
 */

export type { AtomSpec, BondSpec, CrystalTypeData } from './types'
export { getCornerFracs, getFaceFracs, getEdgeFracs } from './helpers'
export {
  CRYSTAL_DATABASE,
  createNaClData,
  createCsClData,
  createCuData,
  createFeData,
  createDiamondData,
  createCaF2Data,
  createHcpMgData,
  createCO2Data,
} from './crystals'
