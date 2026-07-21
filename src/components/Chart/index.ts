/**
 * 图表组件库
 */
export { BaseChart } from './BaseChart'
export type { BaseChartProps } from './BaseChart'
export { ChartContext, useChartContext } from './ChartContext'
export type { ChartContextValue } from './ChartContext'
export { ChartCursor } from './ChartCursor'
export { ChartArea } from './ChartArea'
export { ChartLine } from './ChartLine'
export { ChartTangent } from './ChartTangent'
export { ChartSecant } from './ChartSecant'
export type { ChartSecantProps } from './ChartSecant'
export { RelationChart } from './RelationChart'
export type { RelationChartProps, RelationDataSeries, RelationMarker } from './RelationChart'
export { SvgDataTable } from './SvgDataTable'
export type { SvgDataTableColumn, SvgDataTableProps } from './SvgDataTable'

// ── 高考化学专有高阶图表组件 ──
export { TitrationCurveChart } from './TitrationCurveChart'
export type { TitrationCurveChartProps } from './TitrationCurveChart'

export { EnergyProfileChart } from './EnergyProfileChart'
export type { EnergyProfileChartProps } from './EnergyProfileChart'

export { EquilibriumChart } from './EquilibriumChart'
export type { EquilibriumChartProps } from './EquilibriumChart'

export { PrecipitationEquilibriumChart } from './PrecipitationEquilibriumChart'
export type { PrecipitationEquilibriumChartProps } from './PrecipitationEquilibriumChart'

// 插值工具（纯函数）
export { interpolateY } from './interpolation'