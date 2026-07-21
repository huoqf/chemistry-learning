/**
 * VSEPR 类型定义
 *
 * 纯数据与几何计算，不包含 DOM、React 或 Store 依赖
 * 三维坐标采用以中心原子为原点 (0,0,0) 的 Cartesian 世界坐标系
 */

export interface VseprMolecule {
  id: string
  name: string
  formula: string
  centralElement: string
  ligandElement: string
  charge: number
  centralValence: number // a
  ligandCount: number    // m
  ligandValence: number  // y (H/卤素=1, O/S=2)
  lonePairCount: number  // n
  totalPairs: number     // m + n
  electronGeometry: string
  molecularGeometry: string
  hybridization: string
  bondAngleText: string
  description: string
  centralColor: string
  ligandColor: string
  /** 配体 3D 坐标 */
  ligands: Array<{ pos: [number, number, number]; label: string }>
  /** 孤电子对 3D 坐标方向 */
  lonePairs: Array<{ pos: [number, number, number]; label: string }>
  /** 理想多面体虚线框架边 */
  polyEdges: Array<[[number, number, number], [number, number, number]]>
  /** 键角弧标注 */
  bondAngles: Array<{
    p1: [number, number, number]
    p2: [number, number, number]
    angleText: string
  }>
}
