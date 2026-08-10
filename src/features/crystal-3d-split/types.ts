import type { CellParams } from '@/components/Chemistry3D'

/** 原子均摊类型 */
export type AtomLocationType = 'corner' | 'edge' | 'face' | 'body' | 'internal'

/** 原子位点规格 */
export type AtomSpec = {
  id: string
  element: string
  fracPos: [number, number, number]
  locationType: AtomLocationType
  /** 均摊份额 (如 1/8, 1/4, 1/2, 1) */
  sharingRatio: number
  /** 位置说明 (如 '顶点 (1/8)') */
  sharingLabel: string
  color: string
  radius: number
  label?: string
}

/** 键/晶格连线规格 */
export type BondSpec = {
  fromIndex: number
  toIndex: number
  color?: string
}

/** 晶胞类型标识 */
export type CrystalTypeId =
  | 'nacl'
  | 'cscl'
  | 'cu-fcc'
  | 'fe-bcc'
  | 'diamond'
  | 'caf2'
  | 'catio3'
  | 'hcp-mg'

/** 单种元素均摊统计 */
export type ElementCountDetail = {
  element: string
  color: string
  cornerCount: number
  edgeCount: number
  faceCount: number
  bodyCount: number
  internalCount: number
  netCount: number // 归一化后的净个数 N
}

/** 晶胞完整数据定义 */
export type CrystalTypeData = {
  id: CrystalTypeId
  name: string
  chemicalFormula: string
  description: string
  cellParams: CellParams
  defaultEdgeLengthPm: number
  defaultHeightPm?: number // 针对六方晶胞 (Mg) 的 c
  molarMass: number // g/mol
  atoms: AtomSpec[]
  bonds: BondSpec[]
  /** 几何相切或比例关系说明 (如 4r = √2 a) */
  tangentFormulaLatex: string
  tangentDescription: string
  coordNumberDescription: string
}

/** 展示/切割模式 */
export type DisplayMode = 'default' | 'exploded' | 'cutting' | 'geometry'

/** 计算导出结果 */
export type CrystalCalculationResult = {
  elementDetails: ElementCountDetail[]
  formulaRatioStr: string // 如 "Na₄Cl₄ ➔ NaCl"
  totalZ: number // 净公式单位数 Z
  cellMassGram: number // 单个晶胞质量 (g)
  cellMassLatex: string // 质量公式 Latex
  cellVolumeCm3: number // 晶胞体积 (cm³)
  cellVolumeLatex: string // 体积公式 Latex
  densityValue: number // 晶胞密度 (g/cm³)
  densityLatex: string // 密度代数导出公式 Latex
  spaceOccupancyPercent?: number // 空间利用率 %
  spaceOccupancyLatex?: string // 空间利用率 Latex Formula
}
