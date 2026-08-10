/**
 * VSEPR 与杂化轨道 3D 几何工具类型定义
 */

/** 杂化轨道类型 */
export type HybridizationType = 'sp' | 'sp2' | 'sp3' | 'sp3d' | 'sp3d2'

/** VSEPR 电子对构型类型 */
export type VseprGeometryType =
  | 'linear'
  | 'trigonal_planar'
  | 'tetrahedral'
  | 'trigonal_bipyramidal'
  | 'octahedral'

/** 分子实际空间构型 */
export type MolecularGeometryType =
  | 'linear'
  | 'trigonal_planar'
  | 'bent'
  | 'tetrahedral'
  | 'trigonal_pyramidal'
  | 'trigonal_bipyramidal'
  | 'octahedral'

/** 3D 显示模式 */
export type DisplayMode = 'ball_stick' | 'vsepr_cloud' | 'hybrid_orbital' | 'repulsion_demo'

/** 元素原子 3D 节点参数 */
export interface AtomNode {
  id: string
  symbol: string
  elementName: string
  role: 'center' | 'terminal'
  /** 相对中心原子的 3D 逻辑笛卡尔坐标 [x, y, z] */
  position: [number, number, number]
  color: string
  radius: number
}

/** 孤电子对 3D 节点参数 */
export interface LonePairNode {
  id: string
  /** 孤电子对的方向向量 [x, y, z] */
  direction: [number, number, number]
  label: string
}

/** 化学键参数 */
export interface BondEdge {
  id: string
  fromAtomId: string
  toAtomId: string
  bondOrder: number // 1: 单键, 2: 双键, 3: 三键
  bondType: 'sigma' | 'pi'
}

/** 键角标注节点 */
export interface BondAngleData {
  id: string
  atom1Id: string
  centerAtomId: string
  atom2Id: string
  angleDegree: number
  displayLabel: string
}

/** 必考分子/离子数据节点 */
export interface VseprMoleculeData {
  id: string
  formula: string
  name: string
  category: 'AB2' | 'AB3' | 'AB4' | 'Ion' | 'Expanded'
  centerAtomSymbol: string
  centerValenceElectrons: number // b
  terminalAtomCount: number // a
  terminalAtomElectronNeed: number // c
  charge: number // 阴离子为负，阳离子为正
  
  vseprPairs: number // (a + (b - cx)/2)
  lonePairs: number // (b - cx)/2
  bondPairs: number // a
  hybridization: HybridizationType
  vseprGeometry: VseprGeometryType
  vseprGeometryName: string
  molecularGeometry: MolecularGeometryType
  molecularGeometryName: string
  theoreticalAngle: number // 理论角度
  actualAngle: number // 实际角度 (考虑到孤对排斥)
  
  atoms: AtomNode[]
  bonds: BondEdge[]
  lonePairNodes: LonePairNode[]
  angles: BondAngleData[]
  
  examNotes: string
}

/** 化学计算 Hook 导出结果 */
export interface VseprChemistryResult {
  currentMolecule: VseprMoleculeData
  vseprFormulaText: string
  vseprCalculationSteps: string
  lonePairRepulsionDescription: string
}
