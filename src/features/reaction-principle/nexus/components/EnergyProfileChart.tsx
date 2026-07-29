import React from 'react'
import { CHEMISTRY_COLORS, colors, withAlpha } from '@/theme'
import type { EnergyProfilePoint, CatalystType } from '../types'

interface EnergyProfileChartProps {
  tsPoints: EnergyProfilePoint[]
  eaForward: number
  eaReverse: number
  deltaH: number
  catalyst: CatalystType
  font?: (v: number) => number
}

export const EnergyProfileChart: React.FC<EnergyProfileChartProps> = ({
  tsPoints,
  eaForward,
  eaReverse,
  deltaH,
  catalyst,
  font = (v) => v,
}) => {
  const width = 540
  const height = 320
  const padding = { top: 40, right: 40, bottom: 50, left: 60 }

  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const maxX = 100
  const maxY = 280

  const toSvgX = (x: number) => padding.left + (x / maxX) * chartWidth
  const toSvgY = (y: number) => padding.top + chartHeight - (y / maxY) * chartHeight

  const generatePathD = () => {
    if (tsPoints.length === 0) return ''
    let d = `M ${toSvgX(tsPoints[0].x)} ${toSvgY(tsPoints[0].y)}`

    for (let i = 0; i < tsPoints.length - 1; i++) {
      const curr = tsPoints[i]
      const next = tsPoints[i + 1]
      const cx1 = toSvgX(curr.x + (next.x - curr.x) * 0.5)
      const cy1 = toSvgY(curr.y)
      const cx2 = toSvgX(curr.x + (next.x - curr.x) * 0.5)
      const cy2 = toSvgY(next.y)
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toSvgX(next.x)} ${toSvgY(next.y)}`
    }
    return d
  }

  const reactY = tsPoints[0]?.y || 100
  const prodY = tsPoints[tsPoints.length - 1]?.y || 100 + deltaH
  const peakY = Math.max(...tsPoints.map((p) => p.y))

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
      {/* 网格线 */}
      <line
        x1={padding.left}
        y1={toSvgY(50)}
        x2={width - padding.right}
        y2={toSvgY(50)}
        stroke={withAlpha(colors.neutral[300], 0.4)}
        strokeDasharray="4 4"
      />
      <line
        x1={padding.left}
        y1={toSvgY(150)}
        x2={width - padding.right}
        y2={toSvgY(150)}
        stroke={withAlpha(colors.neutral[300], 0.4)}
        strokeDasharray="4 4"
      />

      {/* 坐标轴 */}
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

      {/* 轴标签 */}
      <text
        x={width - padding.right + 10}
        y={padding.top + chartHeight + 4}
        fontSize={font(11)}
        fill={colors.neutral[600]}
        fontWeight="bold"
      >
        反应历程
      </text>
      <text
        x={padding.left - 10}
        y={padding.top - 15}
        fontSize={font(11)}
        fill={colors.neutral[600]}
        fontWeight="bold"
        textAnchor="end"
      >
        势能 E / (kJ·mol⁻¹)
      </text>

      {/* 能量曲线 */}
      <path
        d={generatePathD()}
        fill="none"
        stroke={catalyst === 'none' ? colors.primary[600] : colors.secondary[500]}
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* 过渡态点 */}
      {tsPoints.map((p, idx) => {
        const sx = toSvgX(p.x)
        const sy = toSvgY(p.y)
        return (
          <g key={idx}>
            <circle
              cx={sx}
              cy={sy}
              r={p.isTS ? 5 : 3.5}
              fill={p.isTS ? CHEMISTRY_COLORS.temperature : colors.neutral[600]}
              stroke="#fff"
              strokeWidth={1.5}
            />
            {p.label && (
              <text
                x={sx}
                y={sy - 10}
                fontSize={font(11)}
                fontWeight="bold"
                fill={p.isTS ? CHEMISTRY_COLORS.temperature : colors.neutral[700]}
                textAnchor="middle"
              >
                {p.label}
              </text>
            )}
          </g>
        )
      })}

      {/* 正反应活化能 Ea(正) 虚线 */}
      <line
        x1={toSvgX(10)}
        y1={toSvgY(reactY)}
        x2={toSvgX(90)}
        y2={toSvgY(reactY)}
        stroke={colors.neutral[400]}
        strokeDasharray="3 3"
      />
      <line
        x1={toSvgX(50)}
        y1={toSvgY(reactY)}
        x2={toSvgX(50)}
        y2={toSvgY(peakY)}
        stroke={CHEMISTRY_COLORS.activationEnergy}
        strokeWidth={1.5}
        strokeDasharray="2 2"
      />
      <text
        x={toSvgX(50) - 8}
        y={toSvgY(reactY + (peakY - reactY) / 2)}
        fontSize={font(11)}
        fontWeight="bold"
        fill={CHEMISTRY_COLORS.activationEnergy}
        textAnchor="end"
      >
        Ea(正) = {eaForward} kJ/mol (Ea逆={eaReverse})
      </text>

      {/* 反应热 ΔH 标注 */}
      <line
        x1={toSvgX(90)}
        y1={toSvgY(prodY)}
        x2={toSvgX(100)}
        y2={toSvgY(prodY)}
        stroke={colors.neutral[400]}
        strokeDasharray="3 3"
      />
      <text
        x={toSvgX(85)}
        y={toSvgY(reactY + (prodY - reactY) / 2)}
        fontSize={font(11)}
        fontWeight="bold"
        fill={deltaH < 0 ? CHEMISTRY_COLORS.temperature : CHEMISTRY_COLORS.amount}
        textAnchor="start"
      >
        ΔH = {deltaH} kJ/mol ({deltaH < 0 ? '放热' : '吸热'})
      </text>
    </svg>
  )
}
