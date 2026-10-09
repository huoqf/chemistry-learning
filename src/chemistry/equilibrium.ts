/**
 * src/chemistry/equilibrium.ts
 * 2NO₂(g) ⇌ N₂O₄(g) 体系的平衡与速率计算 — 纯计算，零副作用，零 React/DOM 依赖
 *
 * ── 为什么单独设立本模块 ──
 * 该体系曾在两处各写一份完全相同的推导（K、物料守恒二次方程、弛豫演化、
 * Qc），且**只有 hook 那份带 `Math.max(0.01, …)` 钳制、量面板那份没有**，
 * 同一时刻两处可能给出不同浓度。此处收敛为唯一来源。
 *
 * ── 速率常数的温度依赖（P1-9）──
 * 原实现把 k(正) 写成与温度无关的常数，再令 k(逆) = k(正)/K，
 * 于是升温（K 减小）会让 k(逆) 减小，出现「升温后正反应速率不动、
 * 逆反应速率反而下降」—— 与「升温正逆速率均增大」的规律直接冲突。
 * 现按 Arrhenius 给出 k(正) 的正确温度依赖，k(逆) = k(正)/K 即自动获得
 * Ea₂/R = Ea₁/R + |ΔH|/R，从而升温时两者同增、且活化能更大的逆反应增幅更快。
 */

/** 基准温度 T₀ (K) */
export const EQUILIBRIUM_T0 = 298;

/** 基准温度 T₀ 下该反应的平衡常数 K */
export const EQUILIBRIUM_K0 = 2.0;

/**
 * −ΔH/R (K)。本体系 ΔH < 0（放热），取 2000 K 即 ΔH ≈ −16.6 kJ/mol。
 *
 * 说明：2NO₂ → N₂O₄ 的真实 ΔH ≈ −57 kJ/mol（对应 −ΔH/R ≈ 6857 K）。
 * 此处刻意取小值（教学示意），使 K 在 298~398 K 的滑块区间内平缓变化、
 * 颜色深浅渐变便于观察；若用真实值，升温到上限时 K 将缩小三个数量级，
 * 画面直接跳到几乎纯 NO₂。
 */
export const NEG_DELTA_H_OVER_R = 2000;

/**
 * 正反应活化能 Ea₁/R (K)，取 3000 K（≈25 kJ/mol）。
 * 放热反应必有 Ea₁ < Ea₂，结合 NEG_DELTA_H_OVER_R = 2000 得
 * Ea₂/R = Ea₁/R + |ΔH|/R = 5000 K。
 */
export const EA1_OVER_R = 3000;

/** 基准温度 T₀ 下的正反应速率常数（只决定速率的绝对大小，不影响平衡位置） */
const KF_AT_T0 = 0.8;

/** 弛豫演化速率常数 (s⁻¹)，控制动画中体系趋近新平衡的快慢 */
export const RELAX_RATE = 0.6;

/** 浓度下限 (mol/L)，避免弛豫过程中出现 0 或负值导致 Qc 发散 */
export const CONCENTRATION_FLOOR = 0.01;

/** 温度 T 下的平衡常数 K(T)：放热反应，升温 K 减小 */
export function equilibriumConstant(temp: number): number {
  return EQUILIBRIUM_K0 * Math.exp(NEG_DELTA_H_OVER_R * (1 / temp - 1 / EQUILIBRIUM_T0));
}

/** 温度 T 下的正反应速率常数 k(正)：Arrhenius 形式，升温增大 */
export function forwardRateConstant(temp: number): number {
  return KF_AT_T0 * Math.exp(-EA1_OVER_R * (1 / temp - 1 / EQUILIBRIUM_T0));
}

/** 温度 T 下的逆反应速率常数 k(逆) = k(正)/K，自动携带 Ea₂/R = 5000 K */
export function reverseRateConstant(temp: number): number {
  return forwardRateConstant(temp) / equilibriumConstant(temp);
}

export interface No2N2o4EquilibriumState {
  /** 当前温度下的平衡常数 K */
  K: number;
  /** NO₂ 浓度 (mol/L) */
  cNO2: number;
  /** N₂O₄ 浓度 (mol/L) */
  cN2O4: number;
  /** 浓度商 Qc = c(N₂O₄)/c²(NO₂) */
  Qc: number;
  /** 正反应速率 v(正) = k(正)·c²(NO₂) */
  vForward: number;
  /** 逆反应速率 v(逆) = k(逆)·c(N₂O₄) */
  vReverse: number;
}

/**
 * 基准平衡状态（298 K, 1.0 atm, totalN = 2.0）下的理论平衡浓度 (mol/L)。
 * 由 2K₀·c² + c − 2.0 = 0（K₀ = 2.0）严格解析求解：
 *   c(NO₂) = (−1 + √33) / 8 ≈ 0.59307 mol/L
 *   c(N₂O₄) = K₀·c² = 2·c² ≈ 0.70346 mol/L
 * 物料守恒 c(NO₂) + 2c(N₂O₄) = 2.000 严格成立，且 Qc = K₀ 严格处于平衡态。
 * 消除此前默认状态写死 1.0 与 0.5 导致未受任何扰动时自发剧烈演化的反常 bug。
 */
export const BASE_EQ_NO2 = (-1 + Math.sqrt(33)) / 8;
export const BASE_EQ_N2O4 = 2.0 * BASE_EQ_NO2 * BASE_EQ_NO2;

/**
 * 任意扰动后的弛豫状态（指数趋近新平衡）。
 *
 * 物料守恒（N 原子）：c(NO₂) + 2c(N₂O₄) = (2 + 外加NO₂)·p
 * 平衡处另有 c(N₂O₄) = K·c²(NO₂)，代入得 2K·c²(NO₂) + c(NO₂) − totalN = 0。
 *
 * @param temp 温度 (K)
 * @param pressure 压强相对倍率（同时充当浓度压缩倍率）
 * @param addedNO2 外加 NO₂ 浓度 (mol/L)
 * @param time 动画演化时间 (s)
 */
export function no2N2o4State(
  temp: number,
  pressure: number,
  addedNO2: number,
  time: number
): No2N2o4EquilibriumState {
  const K = equilibriumConstant(temp);

  // 平衡目标浓度：解 2K·c² + c − totalN = 0
  const totalN = (2.0 + addedNO2) * pressure;
  const a = 2 * K;
  const eqNO2 = (-1 + Math.sqrt(1 + 4 * a * totalN)) / (2 * a);
  const eqN2O4 = K * eqNO2 * eqNO2;

  // 扰动初态浓度：基于基准平衡态在加压/加试剂瞬间响应得到
  const initNO2 = (BASE_EQ_NO2 + addedNO2) * pressure;
  const initN2O4 = BASE_EQ_N2O4 * pressure;

  // 指数弛豫
  const alpha = Math.exp(-RELAX_RATE * time);
  const cNO2 = Math.max(CONCENTRATION_FLOOR, eqNO2 + (initNO2 - eqNO2) * alpha);
  const cN2O4 = Math.max(CONCENTRATION_FLOOR, eqN2O4 + (initN2O4 - eqN2O4) * alpha);

  const kf = forwardRateConstant(temp);
  const kr = kf / K;

  return {
    K,
    cNO2,
    cN2O4,
    Qc: cN2O4 / (cNO2 * cNO2),
    vForward: kf * cNO2 * cNO2,
    vReverse: kr * cN2O4,
  };
}
