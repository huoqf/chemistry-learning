/**
 * 麦克斯韦-玻尔兹曼 (Maxwell-Boltzmann) 分子能量分布图表组件
 *
 * 展示分子能量分布 f(E) 与活化能 Ea 切割线右侧活化分子阴影占比
 */

import { BaseChart } from '@/components/Chart'
import { useChartContext } from '@/components/Chart/ChartContext'
import { CHEMISTRY_COLORS, CANVAS_COLORS, withAlpha, FONT } from '@/theme'
import type { MaxwellBoltzmannResult } from '../hooks/useMaxwellBoltzmann'

interface BoltzmannContentProps {
  mbData: MaxwellBoltzmannResult
  temperature: number
  activationEnergy: number
  hasCatalyst: boolean
}

function BoltzmannContent({
  mbData,
  temperature,
  activationEnergy,
  hasCatalyst,
}: BoltzmannContentProps) {
  const ctx = useChartContext()
  if (!ctx) return null
  const { toSvgX, toSvgY, font } = ctx

  const effectiveEa = hasCatalyst ? activationEnergy * 0.55 : activationEnergy
  const { curvePoints, activatedPoints, activationFraction } = mbData

  // 1. 全量曲线 svg path
  let curveD = ''
  curvePoints.forEach((p, idx) => {
    const sx = toSvgX(p.energy)
    const sy = toSvgY(p.fraction)
    if (idx === 0) curveD += `M ${sx} ${sy}`
    else curveD += ` L ${sx} ${sy}`
  })

  // 2. 活化分子阴影填充 path (E >= Ea)
  let areaD = ''
  if (activatedPoints.length > 0) {
    const startX = toSvgX(activatedPoints[0].energy)
    const startY = toSvgY(0)
    areaD = `M ${startX} ${startY}`
    activatedPoints.forEach((p) => {
      areaD += ` L ${toSvgX(p.energy)} ${toSvgY(p.fraction)}`
    })
    const endX = toSvgX(activatedPoints[activatedPoints.length - 1].energy)
    areaD += ` L ${endX} ${startY} Z`
  }

  const eaX = toSvgX(effectiveEa)

  return (
    <g>
      {/* 活化分子阴影填充区 */}
      {areaD && (
        <path
          d={areaD}
          fill={withAlpha(CHEMISTRY_COLORS.activation, 0.4)}
          stroke="none"
        />
      )}

      {/* 分子能量分布曲线 */}
      <path
        d={curveD}
        fill="none"
        stroke={CHEMISTRY_COLORS.concentration}
        strokeWidth={2.5}
      />

      {/* Ea 活化能竖直分割线 */}
      <line
        x1={eaX}
        y1={toSvgY(0)}
        x2={eaX}
        y2={toSvgY(26)}
        stroke={CHEMISTRY_COLORS.activation}
        strokeWidth={2}
        strokeDasharray="5 3"
      />

      {/* Ea 文本标注 */}
      <text
        x={Math.min(toSvgX(120), eaX + 6)}
        y={toSvgY(25)}
        fontSize={font(FONT.small)}
        fill={CHEMISTRY_COLORS.activation}
        fontWeight="bold"
      >
        {`Ea ${hasCatalyst ? '(催化剂)' : ''} = ${effectiveEa.toFixed(0)} kJ/mol`}
      </text>

      {/* 活化分子占比标注 */}
      <text
        x={toSvgX(100)}
        y={toSvgY(18)}
        fontSize={font(FONT.small)}
        fill={CHEMISTRY_COLORS.activation}
        fontWeight="bold"
      >
        {`活化分子占比 f ≈ ${(activationFraction * 100).toFixed(1)}%`}
      </text>

      {/* 温度 T 标注 */}
      <text
        x={toSvgX(12)}
        y={toSvgY(25)}
        fontSize={font(FONT.small)}
        fill={CANVAS_COLORS.labelText}
        fontWeight="bold"
      >
        {`T = ${temperature} K`}
      </text>
    </g>

  )
}

interface BoltzmannDistributionChartProps {
  mbData: MaxwellBoltzmannResult
  temperature: number
  activationEnergy: number
  hasCatalyst: boolean
  title?: string
}

export function BoltzmannDistributionChart({
  mbData,
  temperature,
  activationEnergy,
  hasCatalyst,
  title = '分子能量分布 (麦克斯韦-玻尔兹曼分布)',
}: BoltzmannDistributionChartProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <BaseChart
        xDomain={[0, 160]}
        yDomain={[0, 30]}
        xLabel="分子能量 E /(kJ/mol)"
        yLabel="分子数占比 f(E)"
        title={title}
        showGrid={true}
      >
        <BoltzmannContent
          mbData={mbData}
          temperature={temperature}
          activationEnergy={activationEnergy}
          hasCatalyst={hasCatalyst}
        />
      </BaseChart>
    </div>
  )
}
