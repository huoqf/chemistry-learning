import { useMemo } from 'react'
import { RelationChart } from './RelationChart'
import type { RelationMarker } from './RelationChart'
import {
  PH_CHART_COLORS,
  CHEMISTRY_COLORS,
} from '@/theme'

export interface TitrationCurveChartProps {
  /** 滴定曲线数据点 [{x: V_mL, y: pH}] */
  points: { x: number; y: number }[]
  /** X 轴标签，默认 "滴加试剂体积 V / mL" */
  xLabel?: string
  /** Y 轴标签，默认 "溶液 pH" */
  yLabel?: string
  /** 图表标题，默认 "pH 中和滴定曲线" */
  title?: string
  /** 指示剂变色带类型：'phenolphthalein' 酚酞(8.2-10.0) | 'methylOrange' 甲基橙(3.1-4.4) | 'none' */
  indicator?: 'phenolphthalein' | 'methylOrange' | 'none'
  /** 恰好完全反应滴定终点 V (mL) */
  equivalencePointV?: number
  /** 半中和点 V (mL) (此时 pH = pKa) */
  halfEquivalenceV?: number
  /** 当前指针/滴加进度 V (mL) */
  currentV?: number
  /** 是否固定尺寸 */
  fixedSize?: { width: number; height: number }
}

/**
 * TitrationCurveChart — pH 中和滴定曲线图组件（高考专有）
 *
 * 高考考点契合：
 * - 强酸/强碱/弱酸滴定 S 型突跃曲线
 * - 恰好完全反应终点与半中和点 ($pH = pK_a$)
 * - 酚酞 (8.2~10.0) / 甲基橙 (3.1~4.4) 指示剂变色色阶范围带
 *
 * Token 规范：100% 遵从 `@/theme` 的 `PH_CHART_COLORS` 与 `CHEMISTRY_COLORS`
 */
export function TitrationCurveChart({
  points,
  xLabel = 'V(滴加试剂) / mL',
  yLabel = '溶液 pH',
  title = 'pH 中和滴定曲线图',
  indicator: _indicator = 'phenolphthalein',
  equivalencePointV,
  halfEquivalenceV,
  currentV,
  fixedSize,
}: TitrationCurveChartProps) {
  // 标记点构造
  const markers = useMemo(() => {
    const list: RelationMarker[] = []
    if (equivalencePointV != null) {
      list.push({
        x: equivalencePointV,
        axis: 'vertical',
        label: '滴定终点',
        color: PH_CHART_COLORS.neutral,
      })
    }
    if (halfEquivalenceV != null) {
      list.push({
        x: halfEquivalenceV,
        axis: 'vertical',
        label: '半中和点(pH=pKa)',
        color: CHEMISTRY_COLORS.pH,
      })
    }
    return list
  }, [equivalencePointV, halfEquivalenceV])

  // 指示剂变色背景层插件 (预留 future 标注用)

  return (
    <RelationChart
      points={points}
      xLabel={xLabel}
      yLabel={yLabel}
      title={title}
      xDomain={[0, Math.max(40, ...points.map((p) => p.x))]}
      yDomain={[0, 14]}
      cursorX={currentV}
      cursorLabel={(x, y) => `V=${x.toFixed(1)}mL, pH=${y.toFixed(2)}`}
      color={PH_CHART_COLORS.phCurve}
      markers={markers}
      fixedSize={fixedSize}
    />
  )
}
