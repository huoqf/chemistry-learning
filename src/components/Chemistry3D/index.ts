/**
 * Chemistry3D 组件库
 *
 * 可复用的 3D 化学场景组件，基于 React Three Fiber。
 * 使用场景：晶胞结构、分子构型、轨道形状等 WebGL 渲染。
 *
 * @example
 * ```tsx
 * import { AtomMesh, UnitCellMesh } from '@/components/Chemistry3D'
 * import { fracToWorld } from '@/components/Chemistry3D'
 * ```
 */

// ── 可复用 Mesh 组件 ──
export { AtomMesh } from './AtomMesh'
export type { AtomMeshProps } from './AtomMesh'

export { UnitCellMesh } from './UnitCellMesh'
export type { UnitCellMeshProps } from './UnitCellMesh'

export { BondMesh } from './BondMesh'
export type { BondMeshProps } from './BondMesh'


// ── 工具函数（barrel re-export）──
export { isWebGLAvailable, resetWebGLCache } from './utils/webgl'
export {
  fracToCartesian,
  cartesianToWorld,
  fracToWorld,
  batchFracToWorld,
} from './utils/coordTransform'
export type { CellParams } from './utils/coordTransform'
