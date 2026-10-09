/**
 * src/chemistry/electrochemical.ts
 * 电化学基础量 — 纯计算，零副作用，零 React/DOM 依赖
 *
 * ── 为什么单独设立本模块 ──
 * 电化学综合应用页的「n(e⁻) → 溶液 pH」曾在三处各写一份：
 *   · features/.../electrochemical-application/hooks/useElectrochemicalApplicationChemistry.ts
 *   · data/quantities/reaction-principle/electrochemicalApplication.ts
 *   · features/.../electrochemical-application/ElectrochemicalApplicationAnimation.tsx
 * 三份实现中，pH 一律写成 `14 + lg(1e-7 + ne × 0.5 × c0)`——把**摩尔量** ne (mol)
 * 与**浓度** c0 (mol/L) 相乘，得到的量纲是 mol²/L，既不是浓度也不是任何有意义的物理量。
 * 本文件是这些量的唯一来源，三处调用方一律改为 import，禁止就地重写。
 *
 * 量纲口径（修复后）：
 *   n(OH⁻) = n(e⁻)          （2H₂O + 2e⁻ = H₂↑ + 2OH⁻，每 1 mol e⁻ 生成 1 mol OH⁻）
 *   n(H⁺)  = n(e⁻)          （2H₂O − 4e⁻ = O₂↑ + 4H⁺，每 4 mol e⁻ 生成 4 mol H⁺）
 *   c = n / V               （V 为单室溶液体积 L）
 *   pH = −lg c(H⁺) = 14 − pOH
 * 学生可见的关键结论：**同样电量下，pH 只由 n(e⁻) 与溶液体积决定，
 * 与初始电解质浓度 c0 无关**。原实现让 pH 随 c0 变化，属实质性化学错误。
 */

/** 法拉第常数 F (C/mol) */
export const FARADAY_CONSTANT = 96485;

/**
 * 动画时间 → 真实物理时间的放大倍数 k。
 * 动画区间仅 0~10 s；真实电流下 10 s 内转移电子量约 1.6e-4 mol，
 * 曲线几乎无可见变化，故整体放大 50 倍（教学示意口子，非真实时标）。
 */
export const ELECTROLYSIS_TIME_SCALE = 50;

/**
 * 单室电解质溶液体积 V (L) — 教学设定取 1.0 L。
 * 阴极室与阳极室各自独立计量：生成的 OH⁻/H⁺ 物质的量由电量唯一决定，
 * 浓度 c = n / V，与初始电解质浓度 c0 无关。
 *
 * 本常量是电解池 / 原电池各页公用的溶液体积口径，禁止各页另设一份。
 */
export const ELECTROLYTE_VOLUME_L = 1.0;

/**
 * 电解质溶液初始浓度 c₀ (mol/L) — 教学设定取 1.0 mol/L。
 * 电解池与原电池各页公用的浓度口径。
 */
export const ELECTROLYTE_INITIAL_CONC = 1.0;

/** 中性水本底 c(H⁺) = c(OH⁻) = 1.0e-7 mol/L */
const WATER_BASELINE = 1.0e-7;

/** 转移电子物质的量 n(e⁻) = I·t·k / F (mol) */
export function transferredElectronMoles(current: number, time: number): number {
  return (current * time * ELECTROLYSIS_TIME_SCALE) / FARADAY_CONSTANT;
}

/**
 * 由碱性室 OH⁻ 物质的量求 pH（叠加中性本底，t=0 时回 7.00）。
 * c(OH⁻) = n(OH⁻) / V；pOH = −lg c(OH⁻)；pH = 14 − pOH。
 */
export function pHFromHydroxideMoles(hydroxideMoles: number): number {
  const cOH = hydroxideMoles / ELECTROLYTE_VOLUME_L + WATER_BASELINE;
  const pOH = -Math.log10(cOH);
  return 14 - pOH;
}

/**
 * 由酸性室 H⁺ 物质的量求 pH（叠加中性本底，t=0 时回 7.00）。
 * c(H⁺) = n(H⁺) / V；pH = −lg c(H⁺)。
 */
export function pHFromHydrogenMoles(hydrogenMoles: number): number {
  const cH = hydrogenMoles / ELECTROLYTE_VOLUME_L + WATER_BASELINE;
  return -Math.log10(cH);
}
