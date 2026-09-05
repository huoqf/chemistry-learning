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
  const width = 560
  const height = 340
  const padding = { top: 48, right: 65, bottom: 45, left: 65 }

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
      {/* 定义轴箭头 */}
      <defs>
        <marker
          id="lnkt-axis-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={colors.neutral[600]} />
        </marker>
      </defs>

      <line
        x1={padding.left}
        y1={toSvgY(0)}
        x2={width - padding.right}
        y2={toSvgY(0)}
        stroke={withAlpha(colors.neutral[400], 0.5)}
        strokeDasharray="4 4"
      />

      {/* 坐标轴 (带正方向箭头) */}
      <line
        x1={padding.left}
        y1={padding.top + chartHeight}
        x2={width - padding.right + 15}
        y2={padding.top + chartHeight}
        stroke={colors.neutral[600]}
        strokeWidth={1.5}
        markerEnd="url(#lnkt-axis-arrow)"
      />
      <line
        x1={padding.left}
        y1={padding.top + chartHeight}
        x2={padding.left}
        y2={padding.top - 15}
        stroke={colors.neutral[600]}
        strokeWidth={1.5}
        markerEnd="url(#lnkt-axis-arrow)"
      />

      {/* 安全坐标标签 */}
      <text
        x={width - padding.right}
        y={padding.top + chartHeight + 20}
        fontSize={font(12)}
        fill={colors.neutral[700]}
        fontWeight="bold"
        textAnchor="end"
      >
        (1/T) / K⁻¹ →
      </text>
      <text
        x={padding.left}
        y={padding.top - 16}
        fontSize={font(12)}
        fill={colors.neutral[700]}
        fontWeight="bold"
        textAnchor="start"
      >
        ↑ ln K
      </text>

      {/* 新高考核心横坐标防错标尺 */}
      <g transform={`translate(${padding.left + chartWidth / 2}, ${padding.top + chartHeight + 24})`}>
        <text
          x={0}
          y={0}
          fontSize={font(11)}
          fontWeight="bold"
          fill={colors.primary[600]}
          textAnchor="middle"
        >
          ← 升温 (T 增大，1/T 减小) ｜ 降温 (T 减小，1/T 增大) →
        </text>
      </g>

      <path
        d={lineD}
        fill="none"
        stroke={colors.primary[600]}
        strokeWidth={2.8}
      />

      <circle
        cx={curX}
        cy={curY}
        r={6.5}
        fill={CHEMISTRY_COLORS.temperature}
        stroke="#fff"
        strokeWidth={2}
      />

      <text
        x={curX + 10}
        y={curY - 10}
        fontSize={font(12)}
        fontWeight="bold"
        fill={CHEMISTRY_COLORS.temperature}
        paintOrder="stroke"
        stroke="#fff"
        strokeWidth={3}
      >
        T = {temperature} K (ln K = {vantHoffData.currentLnK}, Kc ≈ {vantHoffData.currentKc})
      </text>

      {/* 斜率与吸放热直观判定 */}
      <g transform={`translate(${padding.left + 20}, ${padding.top + 16})`}>
        <rect
          x={-8}
          y={-6}
          width={280}
          height={32}
          fill="rgba(255, 255, 255, 0.88)"
          stroke="#cbd5e1"
          rx={6}
        />
        <text
          x={0}
          y={15}
          fontSize={font(11)}
          fontWeight="bold"
          fill={deltaH < 0 ? CHEMISTRY_COLORS.temperature : CHEMISTRY_COLORS.amount}
        >
          理论斜率 k = -ΔH/R ({deltaH < 0 ? '斜率 k > 0 ⇒ ΔH < 0 (放热)' : '斜率 k < 0 ⇒ ΔH > 0 (吸热)'})
        </text>
      </g>
    </svg>
  )
}
