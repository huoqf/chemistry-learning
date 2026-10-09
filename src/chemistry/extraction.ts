/**
 * src/chemistry/extraction.ts
 * 萃取分配平衡 — 纯计算，零副作用，零 React/DOM 依赖
 *
 * ── 为什么单独设立本模块 ──
 * 碘水-有机溶剂单级萃取的平衡浓度曾在两处各写一份且互不相同：
 *   · data/quantities/experiment/extraction-distillation.ts（量面板：用平衡式）
 *   · features/experiment/extraction-distillation/hooks/useExtractionDistillationChemistry.ts
 *     （右屏图表：用 `0.10 − 0.092·p·(V/20)` 这类经验拟合式，完全没有出现分配系数 K）
 * 结果同一时刻两处给出互相打架的浓度。此处收敛为唯一来源。
 *
 * 另：原量面板在「乙醇」反例下仍沿用苯的分配系数算出一个「单级萃取率」，
 * 而乙醇与水无限互溶、根本不存在两相界面——该数值属于凭空捏造。
 * 本模块只对真正存在两相的体系求平衡，调用方须先判溶剂是否互溶。
 */

/** 碘水中 I₂ 的初始浓度 (mol/L) — 教学设定值 */
export const IODINE_WATER_INITIAL_CONC = 0.1;

/** 碘水体积 (mL) — 教学设定值 */
export const IODINE_WATER_VOLUME_ML = 50;

/**
 * 碘在水/CCl₄ 两相间的分配系数 K = c(有机相)/c(水相)（教学示意值）。
 * K ≫ 1，故单级萃取率可达 95% 以上——这正是选用 CCl₄ 萃碘的原因。
 */
export const IODINE_PARTITION_CCL4 = 85.0;

/** 碘在水/苯两相间的分配系数（教学示意值，略低于 CCl₄） */
export const IODINE_PARTITION_BENZENE = 65.0;

/** 振荡混匀起点 (s)：与动画时序对齐（2.0s 取下倒转振荡） */
export const EXTRACTION_MIX_START_S = 2.0;

/** 振荡混匀历时 (s)：5.2s 放回铁圈静置，此时视为已达分配平衡 */
export const EXTRACTION_MIX_DURATION_S = 3.2;

/**
 * 振荡混匀进度 0~1（0 = 未混合，1 = 已达分配平衡）。
 * 量面板与右屏图表共用，避免两处各写一条时间曲线。
 */
export function extractionMixProgress(time: number): number {
  return Math.min(1, Math.max(0, (time - EXTRACTION_MIX_START_S) / EXTRACTION_MIX_DURATION_S));
}

export interface ExtractionEquilibrium {
  /** 平衡时水相 I₂ 浓度 (mol/L) */
  aqueous: number;
  /** 平衡时有机相 I₂ 浓度 (mol/L) */
  organic: number;
  /** 单级萃取率 0~1 */
  rate: number;
}

/**
 * 单级萃取达平衡时的两相浓度与萃取率。
 *
 * 推导（物料守恒 + 分配定律）：
 *   n₀ = c₀·V(aq) = c(aq)·V(aq) + c(org)·V(org)，且 c(org) = K·c(aq)
 *   ⇒ c(aq) = c₀·V(aq) / (V(aq) + K·V(org))
 *   ⇒ c(org) = K·c(aq)
 *   ⇒ 萃取率 = (c₀ − c(aq)) / c₀ = K·V(org) / (V(aq) + K·V(org))
 *
 * 注意：V(org) 增大时萃取率单调增大但趋近 100%，与「少量多次萃取」的
 * 高考结论一致（同体积溶剂分次萃取优于一次萃取）。
 */
export function extractionEquilibrium(
  c0: number,
  vAqueous: number,
  vOrganic: number,
  partitionCoefficient: number
): ExtractionEquilibrium {
  const aqueous = (c0 * vAqueous) / (vAqueous + partitionCoefficient * vOrganic);
  const organic = partitionCoefficient * aqueous;
  const rate = c0 > 0 ? (c0 - aqueous) / c0 : 0;
  return { aqueous, organic, rate };
}

/**
 * 互溶体系的均一相 I₂ 浓度 (mol/L)。
 * 乙醇与水无限互溶，碘既不富集也不分离，只是被稀释：
 *   c(均一相) = c₀·V(aq) / (V(aq) + V(乙醇))
 */
export function miscibleUniformConcentration(
  c0: number,
  vAqueous: number,
  vAdded: number
): number {
  return (c0 * vAqueous) / (vAqueous + vAdded);
}
