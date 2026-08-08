/**
 * src/features/gas-chain/types.ts
 * 气体制备/净化/尾气处理装置链工具 - 类型定义
 */

// 预设的高考经典气体制备体系 ID
export type GasChainSystemId =
  | 'cl2-prep'     // 氯气制备与提纯 (MnO2 + 浓HCl)
  | 'nh3-prep'     // 氨气制备与防倒吸 (NH4Cl + Ca(OH)2)
  | 'so2-chain'    // 二氧化硫制备与性质检验链 (Na2SO3 + H2SO4)
  | 'no-no2-chain' // 氮氧化物发生与收集 (Cu + HNO3)
  | 'c2h4-prep'    // 乙烯制备与除杂 (乙醇 + 浓H2SO4)
  | 'custom'       // 自定义组合探究

// 发生装置类型
export type GeneratorType =
  | 'flask-heat'   // 圆底/蒸馏烧瓶+酒精灯 (固液加热)
  | 'testtube-heat'// 试管+酒精灯 (固固加热)
  | 'flask-noheat' // 锥形瓶/分液漏斗 (固液不加热)
  | 'kipp'         // 启普发生器 (随开随用)

// 单个洗气/检验/干燥步骤的试剂类型（统一枚举）
export type WashStepReagent =
  | 'sat-nacl'     // 饱和食盐水 (除 HCl)
  | 'naoh'         // NaOH 溶液 (除 SO2/H2S/Cl2)
  | 'fuchsin'      // 品红溶液 (检验 SO2 漂白性)
  | 'kmno4'        // 酸性 KMnO4 溶液 (检验还原性)
  | 'water'        // 蒸馏水 (吸收/检验)
  | 'conc-h2so4'   // 浓硫酸洗气瓶 (干燥/酸性)
  | 'soda-lime'    // 碱石灰干燥管 (球形)
  | 'cacl2'        // 无水 CaCl2 干燥管 (U型/球形)
  | 'p2o5'         // P2O5 干燥管
  | 'naoh-solid'   // NaOH 固体干燥管（碱石灰替代品）
  | 'none'         // 无（占位符）

// 单个洗气/检验/干燥步骤的器材形态
export type WashStepDevice =
  | 'wash-bottle'  // 洗气瓶（液相试剂：饱和食盐水/NaOH/品红/KMnO4/水）
  | 'dry-tube'     // 干燥管（固相干燥剂：碱石灰/CaCl2/P2O5）
  | 'acid-bottle'  // 浓硫酸洗气瓶（液相干燥）

// 单个洗气/净化/检验/干燥步骤
export interface WashStep {
  /** 步骤唯一 ID（用于 React key） */
  id: string
  /** 器材形态 */
  device: WashStepDevice
  /** 试剂类型 */
  reagent: WashStepReagent
  /** 步骤角色标注 */
  role: 'purify' | 'detect' | 'dry'
  /** 洗气瓶管路是否接反（仅 wash-bottle 有效） */
  reversed?: boolean
}

// 收集方式
export type CollectionMethod =
  | 'upward-air'   // 向上排空气法 (密度比空气大，如 Cl2, SO2, NO2, CO2)
  | 'downward-air' // 向下排空气法 (密度比空气小，如 NH3, H2)
  | 'water-displacement' // 排水集气法 (不溶于水，如 O2, H2, NO, C2H4)
  | 'none'         // 不收集 (直接检验/废弃)

// 尾气处理/防倒吸装置
export type TailGasDevice =
  | 'inverted-funnel' // 倒置漏斗 (水/碱液防倒吸)
  | 'safety-bottle'   // 安全瓶/空瓶防倒吸
  | 'naoh-absorber'   // NaOH 溶液直通吸收
  | 'combustion'      // 点燃/燃烧吸收 (如 CO/H2)
  | 'balloon'         // 气球收集
  | 'direct-pipe'     // 普通直导管直接插入水/碱液 (极易溶气体易引发倒吸警告!)
  | 'none'            // 不处理

// 全链参数接口（v2：多节点串联）
export interface GasChainParams {
  viewMode: number          // 视角: 0-图谱探究 | 1-规范踩分 | 2-真题研析
  systemId: GasChainSystemId// 经典体系
  targetGas: string         // 目标气体名称，如 Cl2, NH3, SO2 等
  generator: GeneratorType  // 发生装置
  /** 串联洗气/检验/干燥步骤列表（可 0~N 个，替代原 washReagent + dryer） */
  washingSteps: WashStep[]
  collection: CollectionMethod // 收集方式
  tailGas: TailGasDevice    // 尾气处理装置
  flowRate: number          // 气体流速 (0 - 100 mL/min)
  temp: number              // 反应温度 (°C)
  heating: boolean          // 是否正在加热
}

// 诊断警告与风险提示
export interface DiagnosticIssue {
  id: string
  level: 'danger' | 'warning' | 'info' | 'success'
  title: string
  description: string
  examPoint: string // 对应高考考点总结
}

// 气体流控与各节点化学状态
export interface GasNodeState {
  stage: number
  gasComposition: string[] // 包含的气体成分，如 ['Cl2', 'HCl', 'H2O']
  flowRate: number         // 此时气体流量
  color?: string           // 气体视觉呈现色
  reagentColor?: string    // 溶液或干燥剂变色态
  isClogged: boolean       // 该节点是否被封堵
}

// ── 向后兼容辅助类型（供 LeftPanel 使用）──
/** @deprecated 改用 WashStepReagent */
export type WashReagentType = WashStepReagent
/** @deprecated 改用 WashStepReagent */
export type DryerType = WashStepReagent
