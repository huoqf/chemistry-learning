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
  | 'square_planar'
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

/**
 * σ 骨架键（每个成键原子对一条边，无方向性区分）
 *
 * 口径约定（与 `sigmaBonds` / `piBonds` 严格一致）：
 *   - 一条边 = 中心原子与一个配位原子之间的一个成键原子对；
 *   - `bondOrder` 为**平均键级** = (σ 键数 + π 键数) / 边数；
 *     离域 π 键（如 SO₂ 的 Π³₄、SO₃/CO₃²⁻/NO₃⁻ 的 Π⁴₆）按整体计 1 个 π 键，
 *     因此其平均键级可为非整数（SO₂ 为 1.5，SO₃/CO₃²⁻/NO₃⁻ 为 4/3）。
 *   - 恒有不变式：Σ bondOrder = sigmaBonds + piBonds，且 bonds.length = sigmaBonds。
 */
export interface BondEdge {
  id: string
  fromAtomId: string
  toAtomId: string
  /** 平均键级（σ 键数 + π 键数）/ 边数；非整数表示离域 π 键均摊（如 1.5、4/3） */
  bondOrder: number
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
  /** 中心原子价电子数 a (主族元素即最外层电子数) */
  centerValenceElectrons: number
  /** 配位原子数 x (即 σ 键电子对数) */
  terminalAtomCount: number
  /** 每个配位原子最多能结合的电子数 b (H/卤素为 1, O/S 为 2, N 为 3) */
  terminalAtomElectronNeed: number
  /** 离子电荷 q (阴离子为负，阳离子为正) */
  charge: number

  /** 价层电子对数 x + (a ± q - xb) / 2 */
  vseprPairs: number
  /** 孤电子对数 (a ± q - xb) / 2 */
  lonePairs: number
  /** σ 键电子对数 x */
  bondPairs: number
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

  /** σ 键总数 (高考必考) */
  sigmaBonds?: number
  /** π 键总数 (高考必考) */
  piBonds?: number
  /** 分子极性判断 (极性分子 / 非极性分子) */
  polarity?: 'polar' | 'nonpolar'
  /** 分子极性判断理由 */
  polarityReason?: string
  /** 键角多值或特殊标注 (如 PCl₅ 为 90° / 120°) */
  angleDisplay?: string
}

/** 化学计算 Hook 导出结果 */
export interface VseprChemistryResult {
  currentMolecule: VseprMoleculeData
  vseprFormulaText: string
  vseprCalculationSteps: string
  lonePairRepulsionDescription: string
}
