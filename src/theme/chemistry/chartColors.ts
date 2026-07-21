import { CHEMISTRY_COLORS, withAlpha } from './colors'

export const CHART_COLORS = {
  gridLine: '#E5E7EB',
  axisLine: '#374151',
  axisArrow: '#374151',
  labelText: '#4B5563',
  tickMark: '#9CA3AF',
  tickLabel: '#6B7280',
  zeroline: '#D1D5DB',
  reference: '#9CA3AF',
  tangent: '#6B7280',
  highlight: '#F59E0B',
  criticalPt: '#EF4444',
  /** 图表标题色 */
  titleText: '#4B5563',
  /** 平衡态标注线色 */
  equilibrium: CHEMISTRY_COLORS.equilibrium,

  primary: CHEMISTRY_COLORS.concentration,
  compareA: CHEMISTRY_COLORS.temperature,
  compareB: CHEMISTRY_COLORS.pressure,
  compareC: CHEMISTRY_COLORS.reactionRate,
  compareD: CHEMISTRY_COLORS.pH,
  compareE: CHEMISTRY_COLORS.electrodePotential,

  areaFill: withAlpha(CHEMISTRY_COLORS.concentration, 0.18),
  areaFillAlt: withAlpha(CHEMISTRY_COLORS.temperature, 0.15),
  areaFillWarm: withAlpha(CHEMISTRY_COLORS.exothermic, 0.15),
} as const

// ─── 图表插件颜色变体 ──────────────────────────────────────────────────────
/** 参考线/游标/切线颜色变体 */
export type ChartReferenceVariant = 'default' | 'highlight' | 'tangent'
/** 数据曲线颜色变体 */
export type ChartSeriesVariant = 'primary' | 'secondary' | 'accent' | 'warm' | 'success'
/** 面积填充变体 */
export type ChartAreaVariant = 'default' | 'alt' | 'warm' | 'impulse'
/** 面积填充强度 */
export type ChartAreaIntensity = 'subtle' | 'normal' | 'strong'

/** 参考线 token 映射 */
export const REFERENCE_MAP: Record<ChartReferenceVariant, string> = {
  default:   CHART_COLORS.reference,
  highlight: CHART_COLORS.highlight,
  tangent:   CHART_COLORS.tangent,
}

/** 数据曲线 token 映射 */
export const SERIES_MAP: Record<ChartSeriesVariant, string> = {
  primary:   CHART_COLORS.primary,
  secondary: CHART_COLORS.compareA,
  accent:    CHART_COLORS.compareB,
  warm:      CHART_COLORS.compareC,
  success:   CHART_COLORS.compareD,
}

/** 面积填充 token 映射 */
export const AREA_FILL_MAP: Record<ChartAreaVariant, string> = {
  default: CHART_COLORS.areaFill,
  alt:     CHART_COLORS.areaFillAlt,
  warm:    CHART_COLORS.areaFillWarm,
  impulse: CHEMISTRY_COLORS.enthalpy,
}

/** 面积填充强度映射 */
export const AREA_INTENSITY_MAP: Record<ChartAreaIntensity, number> = {
  subtle:  0.12,
  normal:  0.18,
  strong:  0.32,
}

export const CT_CHART_COLORS = {
  concentrationCurve: CHEMISTRY_COLORS.concentration,
  rateCurve: CHEMISTRY_COLORS.reactionRate,
  equilibriumLine: CHEMISTRY_COLORS.equilibrium,
  areaShade: withAlpha(CHEMISTRY_COLORS.concentration, 0.18),
} as const

export const RATE_CHART_COLORS = {
  rateCurve: CHEMISTRY_COLORS.reactionRate,
  rateForward: CHEMISTRY_COLORS.rateForward,
  rateReverse: CHEMISTRY_COLORS.rateReverse,
  equilibrium: CHEMISTRY_COLORS.equilibrium,
} as const

export const PV_CHART_COLORS = {
  isotherm: CHEMISTRY_COLORS.temperature,
  isobar: CHEMISTRY_COLORS.pressure,
  isochor: CHEMISTRY_COLORS.volume,
} as const

export const PH_CHART_COLORS = {
  phCurve: CHEMISTRY_COLORS.pH,
  acid: CHEMISTRY_COLORS.acid,
  base: CHEMISTRY_COLORS.base,
  neutral: CHEMISTRY_COLORS.equilibrium,
} as const
