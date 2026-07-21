import { useMemo } from 'react'
import { RelationChart } from './RelationChart'
import type { RelationMarker } from './RelationChart'
import {
  CHEMISTRY_COLORS,
  CHART_COLORS,
} from '@/theme'

export interface PrecipitationEquilibriumChartProps {
  /** 溶度积 Ksp 数值 (例如 1e-10) */
  ksp?: number
  /** 试样测试点列表 [{x: c(B), y: c(A), label: 'A点'}] */
  testPoints?: { x: number; y: number; label?: string }[]
  /** X 轴标签，默认 "c(B⁻) / (mol·L⁻¹)" */
  xLabel?: string
  /** Y 轴标签，默认 "c(A⁺) / (mol·L⁻¹)" */
  yLabel?: string
  /** 图表标题，默认 "沉淀溶解平衡曲线图" */
  title?: string
  /** 固定尺寸 */
  fixedSize?: { width: number; height: number }
}

/**
 * PrecipitationEquilibriumChart — 沉淀溶解平衡图组件（高考专有）
 *
 * 高考考点契合：
 * - $K_{sp}$ 沉淀溶解平衡等温曲线
 * - 沉淀析出区 (过饱和 $Q_c > K_{sp}$) 与未沉淀区 (不饱和 $Q_c < K_{sp}$)
 * - 难溶电解质转化为高考压轴计算常考点
 *
 * Token 规范：100% 遵从 `@/theme` 的 `CHEMISTRY_COLORS` 与 `CHART_COLORS`
 */
export function PrecipitationEquilibriumChart({
  ksp = 1e-4,
  testPoints = [],
  xLabel = 'c(B⁻) / (10⁻² mol·L⁻¹)',
  yLabel = 'c(A⁺) / (10⁻² mol·L⁻¹)',
  title = '沉淀溶解平衡曲线图 (Ksp)',
  fixedSize,
}: PrecipitationEquilibriumChartProps) {
  // 基于 Ksp 生成反比例曲线 (y = Ksp / x)
  const curvePoints = useMemo(() => {
    const pts: { x: number; y: number }[] = []
    const scale = Math.sqrt(ksp)
    const minX = scale * 0.2
    const maxX = scale * 3.0
    const count = 40

    for (let i = 0; i <= count; i++) {
      const x = minX + ((maxX - minX) * i) / count
      const y = ksp / x
      pts.push({ x, y })
    }
    return pts
  }, [ksp])

  // 测试点 markers
  const markers = useMemo((): RelationMarker[] => {
    return testPoints.map((tp) => ({
      x: tp.x,
      y: tp.y,
      axis: 'point',
      label: tp.label ?? `(${tp.x.toFixed(1)}, ${tp.y.toFixed(1)})`,
      color: CHART_COLORS.criticalPt,
    }))
  }, [testPoints])

  return (
    <RelationChart
      points={curvePoints}
      color={CHEMISTRY_COLORS.equilibrium}
      strokeWidth={2.5}
      xLabel={xLabel}
      yLabel={yLabel}
      title={title}
      markers={markers}
      fixedSize={fixedSize}
    />
  )
}
