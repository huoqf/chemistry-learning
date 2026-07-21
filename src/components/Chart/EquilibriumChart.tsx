import { useMemo } from 'react'
import { RelationChart } from './RelationChart'
import type { RelationMarker, RelationDataSeries } from './RelationChart'
import {
  RATE_CHART_COLORS,
} from '@/theme'

export interface EquilibriumChartProps {
  /** 正反应速率数据点 [{x: time, y: v_forward}] */
  forwardPoints: { x: number; y: number }[]
  /** 逆反应速率数据点 [{x: time, y: v_reverse}] */
  reversePoints: { x: number; y: number }[]
  /** X 轴范围 [min, max]（如 [0, 10]），固定定标解耦动态显示 */
  xDomain?: [number, number]
  /** Y 轴范围 [min, max] */
  yDomain?: [number, number]
  /** 达成化学平衡时刻 t1 (时间) */
  equilibriumTime?: number
  /** 当前时间游标 cursorX */
  currentTime?: number
  /** X 轴标签，默认 "时间 t / s" */
  xLabel?: string
  /** Y 轴标签，默认 "反应速率 v / (mol·L⁻¹·s⁻¹)" */
  yLabel?: string
  /** 图表标题，默认 "反应速率与化学平衡-时间图" */
  title?: string
  /** 固定尺寸 */
  fixedSize?: { width: number; height: number }
}

/**
 * EquilibriumChart — 反应速率与化学平衡-时间图组件（高考专有）
 *
 * 高考考点契合：
 * - 正逆反应速率线 ($v_{正}$ 与 $v_{逆}$) 随时间动态演化
 * - 达化学平衡时 $v_{正} = v_{逆}$ 的特征点 $t_1$
 * - “已达化学平衡”徽章与条件改变突变
 *
 * Token 规范：100% 遵从 `@/theme` 的 `RATE_CHART_COLORS` 与 `CHEMISTRY_COLORS`
 */
export function EquilibriumChart({
  forwardPoints,
  reversePoints,
  xDomain,
  yDomain,
  equilibriumTime,
  currentTime,
  xLabel = '时间 t / s',
  yLabel = '反应速率 v / (mol·L⁻¹·s⁻¹)',
  title = '反应速率与化学平衡-时间图',
  fixedSize,
}: EquilibriumChartProps) {
  // 逆反应速率追加系列
  const additionalSeries = useMemo((): RelationDataSeries[] => {
    return [
      {
        points: reversePoints,
        label: 'v(逆)',
        color: RATE_CHART_COLORS.rateReverse,
        strokeWidth: 2,
      },
    ]
  }, [reversePoints])

  // 平衡点 marker
  const markers = useMemo((): RelationMarker[] => {
    if (equilibriumTime == null) return []
    return [
      {
        x: equilibriumTime,
        axis: 'vertical',
        label: '已达平衡 (t1)',
        color: RATE_CHART_COLORS.equilibrium,
      },
    ]
  }, [equilibriumTime])

  return (
    <RelationChart
      points={forwardPoints}
      additionalSeries={additionalSeries}
      xDomain={xDomain}
      yDomain={yDomain}
      mainLabel="v(正)"
      color={RATE_CHART_COLORS.rateForward}
      xLabel={xLabel}
      yLabel={yLabel}
      title={title}
      cursorX={currentTime}
      cursorLabel={(x, y) => `t=${x.toFixed(1)}s, v=${y.toFixed(2)}`}
      markers={markers}
      fixedSize={fixedSize}
    />
  )
}
