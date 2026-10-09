/**
 * src/chemistry/galvanicCell.ts
 * 原电池模型 — 纯计算，零副作用，零 React/DOM 依赖
 *
 * ── 为什么单独设立本模块 ──
 * 右屏量面板（data/quantities/reaction-principle/primaryCell.ts）与中右屏图表
 * （features/.../primary-cell/hooks/usePrimaryCellChemistry.ts）各写了一份完全相同的
 * cellType 分支，且两份都把「单槽 Zn-稀 H₂SO₄」的电压写成 1.10 V——
 * 那是丹尼尔电池（Cu²⁺/Cu 正极）的值；单槽的正极实际是析氢，E° = 0.76 V。
 * 此处收敛为唯一来源。
 */

import { ELECTROLYTE_INITIAL_CONC, ELECTROLYTE_VOLUME_L } from './electrochemical'

/** 原电池模型编号（与 UI 分段控件取值一致） */
export const GALVANIC_CELL = {
  /** 单槽 Zn | 稀 H₂SO₄ | Cu（正极析氢，Cu 为惰性电极） */
  singleCellZnH2SO4: 0,
  /** 盐桥双槽丹尼尔电池 Zn | ZnSO₄ ‖ CuSO₄ | Cu */
  daniell: 1,
  /** 氢氧燃料电池 */
  hydrogenOxygen: 2,
  /** 铅蓄电池放电 */
  leadAcid: 3,
} as const;

/**
 * 标准电动势 E° (V)。
 *
 * 「单槽」与「盐桥双槽」极易混淆，务必区分正极反应：
 *   · 单槽 Zn-稀H₂SO₄：正极 2H⁺ + 2e⁻ = H₂↑，E° = 0.00 − (−0.76) = 0.76 V
 *   · 丹尼尔电池：正极 Cu²⁺ + 2e⁻ = Cu，E° = +0.34 − (−0.76) = 1.10 V
 */
export const CELL_EMF_SINGLE_ZN_H2SO4 = 0.76;

/** 丹尼尔电池（Zn | ZnSO₄ ‖ CuSO₄ | Cu）标准电动势 (V) */
export const CELL_EMF_DANIELL = 1.1;

/** 氢氧燃料电池标准电动势 (V)，对应 2H₂ + O₂ = 2H₂O */
export const CELL_EMF_HYDROGEN_OXYGEN = 1.23;

/** 铅蓄电池标准电动势 (V) */
export const CELL_EMF_LEAD_ACID = 2.04;

/** 液态水摩尔体积 (L/mol)，用于估算生成水造成的稀释 */
const WATER_MOLAR_VOLUME = 0.018;

export interface GalvanicCellState {
  /** 输出电压 U (V) */
  voltage: number;
  /** 负极质量变化 (g)：金属溶解为负，转化为沉淀为正 */
  anodeMassDelta: number;
  /** 正极质量变化 (g) */
  cathodeMassDelta: number;
  /** 关键反应物 / 关键离子浓度 (mol/L) */
  concentration: number;
}

/**
 * 给定转移电子量 n(e⁻)，求该原电池模型的状态。
 *
 * @param cellType 模型编号，见 GALVANIC_CELL
 * @param ne 转移电子物质的量 (mol)
 * @param c0 电解质初始浓度 (mol/L)
 * @param volume 电解质溶液体积 (L)
 */
export function galvanicCellState(
  cellType: number,
  ne: number,
  c0: number = ELECTROLYTE_INITIAL_CONC,
  volume: number = ELECTROLYTE_VOLUME_L
): GalvanicCellState {
  if (cellType === GALVANIC_CELL.singleCellZnH2SO4) {
    // 负极 Zn − 2e⁻ = Zn²⁺（M = 65.38）
    // 正极 2H⁺ + 2e⁻ = H₂↑ —— Cu 电极本身不参与反应，质量不变
    // 每 2 mol e⁻ 消耗 1 mol H₂SO₄
    return {
      voltage: CELL_EMF_SINGLE_ZN_H2SO4,
      anodeMassDelta: -ne * 0.5 * 65.38,
      cathodeMassDelta: 0,
      concentration: Math.max(0.05, c0 - (ne * 0.5) / volume),
    };
  }

  if (cellType === GALVANIC_CELL.daniell) {
    // 负极 Zn − 2e⁻ = Zn²⁺；正极 Cu²⁺ + 2e⁻ = Cu（M = 63.55）
    // 每 2 mol e⁻ 消耗 1 mol CuSO₄
    return {
      voltage: CELL_EMF_DANIELL,
      anodeMassDelta: -ne * 0.5 * 65.38,
      cathodeMassDelta: ne * 0.5 * 63.55,
      concentration: Math.max(0.05, c0 - (ne * 0.5) / volume),
    };
  }

  if (cellType === GALVANIC_CELL.hydrogenOxygen) {
    // 碱性：负极 2H₂ + 4OH⁻ − 4e⁻ = 4H₂O；正极 O₂ + 2H₂O + 4e⁻ = 4OH⁻
    // 酸性：负极 H₂ − 2e⁻ = 2H⁺；正极 O₂ + 4H⁺ + 4e⁻ = 2H₂O
    // 两种介质下关键离子（OH⁻ 或 H⁺）在正负极间的消耗与生成恰好抵消，物质的量守恒；
    // 唯一的变化是净生成水：每 4 mol e⁻ 生成 2 mol H₂O → n(H₂O) = ne/2，使溶液被稀释。
    // 故浓度在两种介质中同样「几乎不变」——这正是高考常考的结论，不能一边写死、
    // 一边又按伪系数下降。
    const waterFormedVolume = (ne / 2) * WATER_MOLAR_VOLUME;
    return {
      voltage: CELL_EMF_HYDROGEN_OXYGEN,
      anodeMassDelta: 0,
      cathodeMassDelta: 0,
      concentration: (c0 * volume) / (volume + waterFormedVolume),
    };
  }

  // 铅蓄电池放电：Pb + PbO₂ + 2H₂SO₄ = 2PbSO₄ + 2H₂O
  // 负极 Pb(207.2) → PbSO₄(303.3)：每 2 mol e⁻ 增重 96.1 g
  // 正极 PbO₂(239.2) → PbSO₄(303.3)：每 2 mol e⁻ 增重 64.1 g
  // 每 2 mol e⁻ 消耗 2 mol H₂SO₄
  return {
    voltage: CELL_EMF_LEAD_ACID,
    anodeMassDelta: ne * 0.5 * 96.1,
    cathodeMassDelta: ne * 0.5 * 64.1,
    concentration: Math.max(0.1, c0 - ne / volume),
  };
}
