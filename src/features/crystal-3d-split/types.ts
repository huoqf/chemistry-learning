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
  /** 紧密堆积真实相切刚球半径 (如 Cu 约为 0.3535，Fe 约为 0.433) */
  tangentRadius?: number
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
  | 'zns'
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
  cornerDetailFormula?: string // 如 "4×1/12 + 4×1/6" 或 "8×1/8"
}

/** 展示/切割模式 */
export type DisplayMode = 'default' | 'exploded' | 'cutting' | 'geometry'

/** 模型视觉呈现风格：晶格骨架点阵 vs 紧密堆积刚球相切 */
export type ModelStyle = 'ball-stick' | 'space-filling'

/** 相切几何辅助线规格 */
export type TangentLineSpec = {
  startFrac: [number, number, number]
  endFrac: [number, number, number]
  label?: string
  color?: string
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
  /** 专属相切几何辅助线段 */
  tangentLines?: TangentLineSpec[]
  /** 各元素紧密堆积真实相切半径 (微观相切几何真实比例) */
  tangentRadii: Record<string, number>
}

/** 高考求解模式：代数符号推导 vs 真实常数代入 */
export type CalculationMode = 'algebraic' | 'numerical'

/** 计算导出结果 */
export type CrystalCalculationResult = {
  calculationMode: CalculationMode
  elementDetails: ElementCountDetail[]
  formulaRatioStr: string // 如 "Na₄Cl₄ ➔ 4 NaCl"
  totalZ: number // 净公式单位数 Z
  cellMassGram: number // 单个晶胞质量 (g)
  cellMassLatex: string // 质量公式 Latex
  cellVolumeCm3: number // 晶胞体积 (cm³)
  cellVolumeLatex: string // 体积公式 Latex
  densityValue: number // 晶胞密度 (g/cm³)
  densityLatex: string // 当前模式下的密度公式 Latex
  densityAlgebraicLatex: string // 纯字母代数式 (高考标准采分)
  densityNumericalLatex: string // 真实数值代入式 (含 10^-30 换算)
  naReverseFormulaLatex: string // N_A 反推代数表达式
  spaceOccupancyPercent?: number // 空间利用率 %
  spaceOccupancyLatex?: string // 空间利用率 Latex Formula
}
