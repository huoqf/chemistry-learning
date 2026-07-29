import React from 'react'
import { CHEMISTRY_COLORS, colors, withAlpha } from '@/theme'

interface LnkInvTChartProps {
  vantHoffData: {
    points: { invT: number; lnK: number; temp: number }[]
    currentLnK: number
    currentKc: number
  }
  temperature: number
  deltaH: number
  font?: (v: number) => number
}

export const LnkInvTChart: React.FC<LnkInvTChartProps> = ({
  vantHoffData,
  temperature,
  deltaH,
  font = (v) => v,
}) => {
  const width = 540
  const height = 320
  const padding = { top: 40, right: 40, bottom: 50, left: 60 }

  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const points = vantHoffData.points
  if (points.length === 0) return null

  const minInvT = 0.0016
  const maxInvT = 0.0037
  const minLnK = Math.min(...points.map((p) => p.lnK), -20)
  const maxLnK = Math.max(...points.map((p) => p.lnK), 20)

  const toSvgX = (invT: number) =>
    padding.left + ((invT - minInvT) / (maxInvT - minInvT)) * chartWidth
  const toSvgY = (lnK: number) =>
    padding.top + chartHeight - ((lnK - minLnK) / (maxLnK - minLnK)) * chartHeight

  let lineD = ''
  points.forEach((p, i) => {
    const x = toSvgX(p.invT)
    const y = toSvgY(p.lnK)
    if (i === 0) lineD += `M ${x} ${y}`
    else lineD += ` L ${x} ${y}`
  })

  const curInvT = 1 / temperature
  const curX = toSvgX(curInvT)
  const curY = toSvgY(vantHoffData.currentLnK)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
      <line
        x1={padding.left}
        y1={toSvgY(0)}
        x2={width - padding.right}
        y2={toSvgY(0)}
        stroke={withAlpha(colors.neutral[400], 0.5)}
        strokeDasharray="4 4"
      />

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
        (1/T) / K⁻¹
      </text>
      <text
        x={padding.left - 10}
        y={padding.top - 15}
        fontSize={font(11)}
        fill={colors.neutral[600]}
        fontWeight="bold"
        textAnchor="end"
      >
        ln K
      </text>

      <path
        d={lineD}
        fill="none"
        stroke={colors.primary[600]}
        strokeWidth={2.5}
      />

      <circle
        cx={curX}
        cy={curY}
        r={6}
        fill={CHEMISTRY_COLORS.temperature}
        stroke="#fff"
        strokeWidth={2}
      />

      <text
        x={curX + 10}
        y={curY - 10}
        fontSize={font(11)}
        fontWeight="bold"
        fill={CHEMISTRY_COLORS.temperature}
      >
        T = {temperature} K (ln K = {vantHoffData.currentLnK}, Kc ≈ {vantHoffData.currentKc})
      </text>

      <text
        x={padding.left + 20}
        y={padding.top + 30}
        fontSize={font(12)}
        fontWeight="bold"
        fill={deltaH < 0 ? CHEMISTRY_COLORS.temperature : CHEMISTRY_COLORS.amount}
      >
        斜率 k = -ΔH/R ({deltaH < 0 ? 'k > 0 (放热反应)' : 'k < 0 (吸热反应)'})
      </text>
    </svg>
  )
}
