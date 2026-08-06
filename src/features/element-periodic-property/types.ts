export type PeriodicExploreMode =
  | 'orbital-config'    // 维度 1: 电子排布与轨道表示
  | 'ion-energy'        // 维度 2: 第一电离能反常与同周期递变
  | 'step-ion-energy'   // 维度 2B: 逐级电离能突跃
  | 'radius-matrix'     // 维度 3: 微粒半径与等电子体对比
  | 'inference-nexus'   // 维度 4: 高考位-构-性推断链

export type StateType = 'ground' | 'excited'

export interface ElementInfo {
  z: number                 // 原子序数 (1~30)
  symbol: string            // 元素符号
  name: string              // 中文名称
  period: number            // 周期
  group: string             // 族 (如 IA, IIA, IIIA, IVA, VA, VIA, VIIA, 0, IB, IIB, IIIB~VIIB, VIII)
  block: 's' | 'p' | 'd' | 'ds'  // 区
  outerConfig: string       // 价电子排布式
  fullConfig: string        // 完整电子排布式
  shortConfig: string       // 简化排布式
  electronLayers: number[]  // 各层电子数 (如 [2, 8, 5])
  unpairedElectrons: number // 基态未成对电子数
  maxOxidation: number      // 最高正化合价
  minOxidation?: number     // 最低负化合价
  electronegativity: number // 鲍林电负性
  firstIonization: number   // 第一电离能 (kJ/mol)
  stepIonization: number[]  // I1, I2, I3, I4 逐级电离能 (kJ/mol)
  atomicRadius: number      // 原子半径 (pm)
  isHundSpecial?: boolean   // 是否洪特规则特例 (Cr, Cu 等)
  specialNote?: string      // 特别提示说明
}

export interface ElementPeriodicParams {
  exploreMode: PeriodicExploreMode
  selectedAtomicNumber: number  // 当前选择的元素 atomic number (1~30)
  stateType: StateType          // 基态还是激发态
  periodFilter: number          // 电离能/半径对比的周期 (2 或 3)
  isoGroupFilter: '10e' | '18e' // 等电子体对比组
  inferenceId: string           // 推断矩阵当前例题 ID
}

export interface OrbitalElectron {
  n: number     // 主量子数
  l: 's' | 'p' | 'd'  // 轨道类型
  label: string // 轨道名称 如 1s, 2s, 2px, 2py, 2pz, 3d1~5
  electrons: ('up' | 'down')[] // 包含的电子及自旋
  isFull: boolean
  isHalf: boolean
}

export interface IsoElectronParticle {
  symbol: string
  name: string
  charge: number
  z: number
  radius: number // pm
  electronCount: number
  configStr: string
}

export interface InferenceStep {
  elementCode: string     // 字母代号 (如 X, Y, Z, W)
  realSymbol: string      // 真实元素 (如 O, F, Na, Al)
  clues: string[]         // 题干关键线索
  derivation: string      // 推演步骤
  keyPoint: string        // 考点突破
}

export interface GaokaoInferenceCase {
  id: string
  title: string
  source: string
  elements: InferenceStep[]
  coreQuestion: string
  analysis: string
}
