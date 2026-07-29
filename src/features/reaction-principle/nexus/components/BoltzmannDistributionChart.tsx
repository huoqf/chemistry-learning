import React from 'react'
import { CHEMISTRY_COLORS, colors, withAlpha } from '@/theme'

interface BoltzmannDistributionChartProps {
  boltzmannData: {
    distribution: { energy: number; fraction: number; isActivated: boolean }[]
    activatedFraction: number
  }
  eaForward: number
  temperature: number
  font?: (v: number) => number
}

export const BoltzmannDistributionChart: React.FC<BoltzmannDistributionChartProps> = ({
  boltzmannData,
  eaForward,
  temperature,
  font = (v) => v,
}) => {
  const width = 540
  const height = 320
  const padding = { top: 40, right: 40, bottom: 50, left: 60 }

  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const maxE = 180
  const maxF = Math.max(...boltzmannData.distribution.map((d) => d.fraction), 0.05)

  const toSvgX = (e: number) => padding.left + (e / maxE) * chartWidth
  const toSvgY = (f: number) => padding.top + chartHeight - (f / maxF) * chartHeight

  let lineD = ''
  let fillD = ''

  boltzmannData.distribution.forEach((d, i) => {
    const x = toSvgX(d.energy)
    const y = toSvgY(d.fraction)
    if (i === 0) {
      lineD += `M ${x} ${y}`
    } else {
      lineD += ` L ${x} ${y}`
    }
  })

  const activatedPoints = boltzmannData.distribution.filter((d) => d.isActivated)
  if (activatedPoints.length > 0) {
    const startX = toSvgX(activatedPoints[0].energy)
    const baseY = toSvgY(0)
    fillD = `M ${startX} ${baseY}`
    activatedPoints.forEach((d) => {
      fillD += ` L ${toSvgX(d.energy)} ${toSvgY(d.fraction)}`
    })
    fillD += ` L ${toSvgX(activatedPoints[activatedPoints.length - 1].energy)} ${baseY} Z`
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
      {fillD && (
        <path
          d={fillD}
          fill={withAlpha(CHEMISTRY_COLORS.temperature, 0.35)}
          stroke="none"
        />
      )}

      <line
        x1={padding.left}
        y1={padding.top + chartHeight}
        x2={width - padding.right}
        y2={padding.top + chartHeight}
        stroke={colors.neutral[600]}
        strokeWidth={1.5}
      />
      <line
        x1={padding.left}
        y1={padding.top}
        x2={padding.left}
        y2={padding.top + chartHeight}
        stroke={colors.neutral[600]}
        strokeWidth={1.5}
      />

      <text
        x={width - padding.right + 10}
        y={padding.top + chartHeight + 4}
        fontSize={font(11)}
        fill={colors.neutral[600]}
        fontWeight="bold"
      >
        分子能量 E / (kJ·mol⁻¹)
      </text>
      <text
        x={padding.left - 10}
        y={padding.top - 15}
        fontSize={font(11)}
        fill={colors.neutral[600]}
        fontWeight="bold"
        textAnchor="end"
      >
        分子数分数 f(E)
      </text>

      <path
        d={lineD}
        fill="none"
        stroke={colors.primary[600]}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      <line
        x1={toSvgX(eaForward)}
        y1={padding.top}
        x2={toSvgX(eaForward)}
        y2={padding.top + chartHeight}
        stroke={CHEMISTRY_COLORS.temperature}
        strokeWidth={2}
        strokeDasharray="4 4"
      />

      <text
        x={toSvgX(eaForward) + 6}
        y={padding.top + 20}
        fontSize={font(11)}
        fontWeight="bold"
        fill={CHEMISTRY_COLORS.temperature}
      >
        Ea = {eaForward} kJ/mol
      </text>

      <text
        x={toSvgX(eaForward) + 6}
        y={padding.top + 38}
        fontSize={font(11)}
        fontWeight="bold"
        fill={CHEMISTRY_COLORS.temperature}
      >
        活化分子占比: {boltzmannData.activatedFraction}%
      </text>

      <text
        x={width - padding.right - 20}
        y={padding.top + 30}
        fontSize={font(12)}
        fontWeight="bold"
        fill={CHEMISTRY_COLORS.concentration}
        textAnchor="end"
      >
        T = {temperature} K
      </text>
    </svg>
  )
}
