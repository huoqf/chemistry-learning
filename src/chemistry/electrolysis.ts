/**
 * src/chemistry/electrolysis.ts
 * 电解池模型 — 纯计算，零副作用，零 React/DOM 依赖
 *
 * ── 为什么单独设立本模块 ──
 * 右屏量面板（data/quantities/reaction-principle/electrolyticCell.ts）与中右屏图表
 * （features/.../electrolytic-cell/hooks/useElectrolyticCellChemistry.ts）各写一份完全
 * 相同的 cellType 分支，且两份都带同样的两处硬伤：
 *   · 粗铜精炼的阳极失重用裸系数 ×1.05 硬凑 —— 无依据、无法校验；
 *   · 氯碱阴极室 pH 写 `7.0 + ne × 3.0`、CuSO₄ 阳极区 pH 写 `7.0 − ne × 2.5`
 *     —— 把**摩尔量** ne (mol) 直接当成 pH 增量，量纲非法。
 *     （ne 的滑程只有 0~0.0155 mol，故两种写法都让 pH 几乎不动，掩盖了错误。）
 * 此处收敛为唯一来源，pH 一律走 c = n / V 的严格推导。
 */

import {
  ELECTROLYTE_INITIAL_CONC,
  ELECTROLYTE_VOLUME_L,
  pHFromHydrogenMoles,
  pHFromHydroxideMoles,
} from './electrochemical'

/** 电解池模型编号（与 UI 分段控件取值一致） */
export const ELECTROLYSIS_CELL = {
  copperChloride: 0,
  copperSulfate: 1,
  chlorAlkali: 2,
  copperRefining: 3,
  moltenAlumina: 4,
} as const

/** 阳极材料：0 惰性（石墨 / Pt），1 活性铜 */
export const ANODE_MATERIAL = {
  inert: 0,
  activeCopper: 1,
} as const

/** 标准状况气体摩尔体积 (L/mol) */
export const MOLAR_GAS_VOLUME = 22.4

/**
 * 粗铜中 Cu 的质量分数（教学示意值）。
 * 工业粗铜（泡铜）纯度约 95%~99%，此处取 0.95。
 * 精炼时比 Cu 不活泼的杂质（Ag、Au）不溶解，随铜一起从阳极剥离成为阳极泥，
 * 故 阳极失重 = 溶解金属质量 ÷ w(Cu)。这正是「阳极减少质量 > 阴极增加质量」的定量来源。
 */
export const BLISTER_COPPER_CU_FRACTION = 0.95

/**
 * 粗铜中比 Cu 活泼的金属杂质（Zn、Fe、Ni 等）失电子分摊的转移电子份额比例 α。
 * 教学设定取 0.05（即 5% 转移电子由 Zn/Fe 溶解承担，95% 由 Cu 承担）。
 * 这是高中化学核心考点「粗铜精炼中电解液 c(Cu²⁺) 逐渐减小」的定量依据：
 * 阴极消耗 n(Cu²⁺) = 0.5·ne，阳极补充 n(Cu²⁺) = 0.5·ne·(1−α)，
 * 净消耗 Δn(Cu²⁺) = 0.5·ne·α，使电解液中 c(Cu²⁺) 逐渐下降。
 */
export const BLISTER_ACTIVE_IMPURITY_ELECTRON_SHARE = 0.05

/**
 * Cu²⁺ 溶液（CuCl₂ / CuSO₄ 电解液）的 pH（教学示意值）。
 * 强酸弱碱盐，Cu²⁺ 水解使溶液呈弱酸性；电解过程中若不涉及 H⁺/OH⁻ 的净生成，
 * pH 即保持该值不变。
 */
export const CU2_PLUS_SOLUTION_PH = 4.5

export interface ElectrolysisState {
  /** 阳极质量变化 (g)：活性电极溶解为负，惰性电极为 0 */
  anodeMassDelta: number
  /** 阴极质量变化 (g) */
  cathodeMassDelta: number
  /** 阳极气体体积 (L)，标准状况 */
  anodeGasVolume: number
  /** 阴极气体体积 (L)，标准状况 */
  cathodeGasVolume: number
  /** 关键溶质 / 关键离子浓度 (mol/L) */
  concentration: number
  /** 溶液 pH（涉及两室时应理解为「产物积累侧」的那一室） */
  pH: number
}

/**
 * 给定转移电子量 n(e⁻)，求该电解池模型的状态。
 *
 * @param cellType 模型编号，见 ELECTROLYSIS_CELL
 * @param anodeMaterial 阳极材料，见 ANODE_MATERIAL
 * @param ne 转移电子物质的量 (mol)
 * @param c0 电解质初始浓度 (mol/L)
 * @param volume 单室溶液体积 (L)
 */
export function electrolysisState(
  cellType: number,
  anodeMaterial: number,
  ne: number,
  c0: number = ELECTROLYTE_INITIAL_CONC,
  volume: number = ELECTROLYTE_VOLUME_L
): ElectrolysisState {
  if (cellType === ELECTROLYSIS_CELL.copperChloride) {
    // 阳极 2Cl⁻ − 2e⁻ = Cl₂↑（每 2 mol e⁻ 放出 1 mol Cl₂）
    // 阴极 Cu²⁺ + 2e⁻ = Cu（每 2 mol e⁻ 析出 1 mol Cu）
    // 全程不涉及 H⁺/OH⁻，pH 保持 Cu²⁺ 水解形成的弱酸性不变
    return {
      anodeMassDelta: 0,
      cathodeMassDelta: ne * 0.5 * 63.55,
      anodeGasVolume: ne * 0.5 * MOLAR_GAS_VOLUME,
      cathodeGasVolume: 0,
      concentration: Math.max(0.05, c0 - (ne * 0.5) / volume),
      pH: CU2_PLUS_SOLUTION_PH,
    }
  }

  if (cellType === ELECTROLYSIS_CELL.copperSulfate) {
    if (anodeMaterial === ANODE_MATERIAL.inert) {
      // 阳极 2H₂O − 4e⁻ = O₂↑ + 4H⁺（每 4 mol e⁻ 放出 1 mol O₂，生成 4 mol H⁺ → n(H⁺) = ne）
      // 阴极 Cu²⁺ + 2e⁻ = Cu
      // 教学简化：只跟踪电解新生成的 H⁺ 对 pH 的贡献，溶液本身的初始酸度不叠加
      return {
        anodeMassDelta: 0,
        cathodeMassDelta: ne * 0.5 * 63.55,
        anodeGasVolume: ne * 0.25 * MOLAR_GAS_VOLUME,
        cathodeGasVolume: 0,
        concentration: Math.max(0.05, c0 - (ne * 0.5) / volume),
        pH: pHFromHydrogenMoles(ne),
      }
    }
    // 活性铜阳极：阳极 Cu − 2e⁻ = Cu²⁺，阴极 Cu²⁺ + 2e⁻ = Cu
    // 溶解与析出的 n(Cu) 严格相等 → c(Cu²⁺) 恒定，pH 亦不变
    return {
      anodeMassDelta: -(ne * 0.5 * 63.55),
      cathodeMassDelta: ne * 0.5 * 63.55,
      anodeGasVolume: 0,
      cathodeGasVolume: 0,
      concentration: c0,
      pH: CU2_PLUS_SOLUTION_PH,
    }
  }

  if (cellType === ELECTROLYSIS_CELL.chlorAlkali) {
    // 2NaCl + 2H₂O = 2NaOH + H₂↑ + Cl₂↑（该方程式转移 2 mol e⁻）
    // 阳极 2Cl⁻ − 2e⁻ = Cl₂↑；阴极 2H₂O + 2e⁻ = H₂↑ + 2OH⁻
    // 每 1 mol e⁻：消耗 1 mol NaCl、生成 1 mol OH⁻、放出 0.5 mol H₂ 与 0.5 mol Cl₂
    // 注意：浓度取阳极区（NaCl 被消耗），pH 取阴极区（OH⁻ 积累），分属两室
    return {
      anodeMassDelta: 0,
      cathodeMassDelta: 0,
      anodeGasVolume: ne * 0.5 * MOLAR_GAS_VOLUME,
      cathodeGasVolume: ne * 0.5 * MOLAR_GAS_VOLUME,
      concentration: Math.max(0.05, c0 - ne / volume),
      pH: pHFromHydroxideMoles(ne),
    }
  }

  if (cellType === ELECTROLYSIS_CELL.copperRefining) {
    // 阳极：粗铜溶解。
    //   · 活泼杂质（Zn、Fe、Ni）优先失电子溶解，分摊份额 α = BLISTER_ACTIVE_IMPURITY_ELECTRON_SHARE；
    //   · Cu 失电子承担 (1 − α) 份额：n(Cu²⁺)阳 = 0.5·ne·(1 − α)；
    //   · 不活泼杂质（Ag、Au）不溶解，成为阳极泥脱落。
    // 阴极：仅 Cu²⁺ + 2e⁻ = Cu 析出：n(Cu²⁺)阴 = 0.5·ne，析出质量 cathodeMass = ne·0.5·63.55。
    //
    // 【高考核心考点】：
    // 阳极补充的 Cu²⁺ 小于阴极消耗的 Cu²⁺，净消耗量 Δn(Cu²⁺) = 0.5·ne·α，
    // 导致电解液中 c(Cu²⁺) 逐渐下降：c(Cu²⁺) = c₀ − Δn(Cu²⁺)/V。
    const copperDepositedMass = ne * 0.5 * 63.55
    const netCu2PlusConsumed = ne * 0.5 * BLISTER_ACTIVE_IMPURITY_ELECTRON_SHARE
    return {
      anodeMassDelta: -(copperDepositedMass / BLISTER_COPPER_CU_FRACTION),
      cathodeMassDelta: copperDepositedMass,
      anodeGasVolume: 0,
      cathodeGasVolume: 0,
      concentration: Math.max(0.05, c0 - netCu2PlusConsumed / volume),
      pH: CU2_PLUS_SOLUTION_PH,
    }
  }

  // 熔融 Al₂O₃ 电解炼铝
  // 阳极 2O²⁻ − 4e⁻ = O₂↑，C 电极与 O₂ 生成 CO₂ 而被消耗（每 4 mol e⁻ 消耗 1 mol C）
  // 阴极 Al³⁺ + 3e⁻ = Al（每 3 mol e⁻ 析出 1 mol Al）
  return {
    anodeMassDelta: -(ne * 0.25 * 12.0),
    cathodeMassDelta: (ne / 3) * 27.0,
    anodeGasVolume: ne * 0.25 * MOLAR_GAS_VOLUME,
    cathodeGasVolume: 0,
    // 熔融电解质不讨论体积摩尔浓度与 pH，保持占位值以免图表断线
    concentration: c0,
    pH: 7.0,
  }
}
