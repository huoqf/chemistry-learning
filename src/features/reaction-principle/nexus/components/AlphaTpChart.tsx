import React from 'react'
import { CHEMISTRY_COLORS, colors, withAlpha } from '@/theme'
import type { AlphaTpPoint } from '../types'

interface AlphaTpChartProps {
  alphaTpData: {
    points: AlphaTpPoint[]
    currentAlpha: number
    lowPressureLabel: string
    highPressureLabel: string
  }
  temperature: number
  pressure: number
  deltaH: number
  gasMolesDiff: number
  font?: (v: number) => number
}

export const AlphaTpChart: React.FC<AlphaTpChartProps> = ({
  alphaTpData,
  temperature,
  pressure,
  deltaH,
  gasMolesDiff,
  font = (v) => v,
}) => {
  const width = 560
  const height = 340
  const padding = { top: 48, right: 65, bottom: 45, left: 65 }

  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const minT = 250
  const maxT = 600
  const minAlpha = 0
  const maxAlpha = 100

  const toSvgX = (t: number) =>
    padding.left + ((t - minT) / (maxT - minT)) * chartWidth
  const toSvgY = (a: number) =>
    padding.top + chartHeight - ((a - minAlpha) / (maxAlpha - minAlpha)) * chartHeight

  const points = alphaTpData.points
  if (points.length === 0) return null

  // 低压曲线 P1
  let lowPD = ''
  // 高压曲线 P2
  let highPD = ''

  points.forEach((p, i) => {
    const x = toSvgX(p.temperature)
    const yLow = toSvgY(p.alphaLowP)
    const yHigh = toSvgY(p.alphaHighP)

    if (i === 0) {
      lowPD += `M ${x} ${yLow}`
      highPD += `M ${x} ${yHigh}`
    } else {
      lowPD += ` L ${x} ${yLow}`
      highPD += ` L ${x} ${yHigh}`
    }
  })

  // 当前状态游标
  const curX = toSvgX(temperature)
  const curY = toSvgY(alphaTpData.currentAlpha)

  // 定一议二：在当前 T 处在两条线上的交点
  const curPt = points.reduce((prev, curr) =>
    Math.abs(curr.temperature - temperature) < Math.abs(prev.temperature - temperature)
      ? curr
      : prev
  )

  // 严谨化学判据文案生成 (防护 Δng = 0 或 ΔH = 0 等边界考点)
  const gasMolesHint =
    gasMolesDiff < 0
      ? '< 0，加压正移'
      : gasMolesDiff > 0
      ? '> 0，加压逆移'
      : '= 0，加压不移动'

  const deltaHHint =
    deltaH < 0
      ? '< 0，升温逆移'
      : deltaH > 0
      ? '> 0，升温正移'
      : '= 0，升温无影响'

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
      {/* 定义轴箭头 */}
      <defs>
        <marker
          id="alphatp-axis-arrow"
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

      {/* 20%, 40%, 60%, 80% 水平参考线与刻度 */}
      {[20, 40, 60, 80].map((val) => (
        <g key={val}>
          <line
            x1={padding.left}
            y1={toSvgY(val)}
            x2={width - padding.right}
            y2={toSvgY(val)}
            stroke={withAlpha(colors.neutral[300], 0.5)}
            strokeDasharray="4 4"
          />
          <text
            x={padding.left - 8}
            y={toSvgY(val) + 4}
            fontSize={font(11)}
            fill={colors.neutral[500]}
            textAnchor="end"
          >
            {val}
          </text>
        </g>
      ))}

      {/* 横轴刻度 (300K, 400K, 500K, 600K) */}
      {[300, 400, 500, 600].map((tVal) => (
        <g key={tVal}>
          <line
            x1={toSvgX(tVal)}
            y1={padding.top + chartHeight}
            x2={toSvgX(tVal)}
            y2={padding.top + chartHeight + 4}
            stroke={colors.neutral[400]}
            strokeWidth={1}
          />
          <text
            x={toSvgX(tVal)}
            y={padding.top + chartHeight + 17}
            fontSize={font(11)}
            fill={colors.neutral[600]}
            textAnchor="middle"
          >
            {tVal}
          </text>
        </g>
      ))}

      {/* 坐标轴 (带正方向箭头) */}
      <line
        x1={padding.left}
        y1={padding.top + chartHeight}
        x2={width - padding.right + 15}
        y2={padding.top + chartHeight}
        stroke={colors.neutral[600]}
        strokeWidth={1.5}
        markerEnd="url(#alphatp-axis-arrow)"
      />
      <line
        x1={padding.left}
        y1={padding.top + chartHeight}
        x2={padding.left}
        y2={padding.top - 15}
        stroke={colors.neutral[600]}
        strokeWidth={1.5}
        markerEnd="url(#alphatp-axis-arrow)"
      />

      {/* 坐标安全标签：绝不截断 */}
      <text
        x={width - padding.right + 15}
        y={padding.top + chartHeight + 20}
        fontSize={font(12)}
        fill={colors.neutral[700]}
        fontWeight="bold"
        textAnchor="end"
      >
        体系温度 T / K →
      </text>
      <text
        x={padding.left}
        y={padding.top - 16}
        fontSize={font(12)}
        fill={colors.neutral[700]}
        fontWeight="bold"
        textAnchor="start"
      >
        ↑ 平衡转化率 α / %
      </text>

      {/* 高考核心解题法定一议二标语 */}
      <text
        x={width - padding.right}
        y={padding.top - 16}
        fontSize={font(11)}
        fill={colors.primary[600]}
        fontWeight="bold"
        textAnchor="end"
      >
        ★【定一议二法】：同温下加压 α {gasMolesDiff < 0 ? '增大 (P₂ > P₁)' : gasMolesDiff > 0 ? '减小 (P₂ < P₁)' : '不变'}；升温 α {deltaH < 0 ? '减小 (ΔH < 0)' : deltaH > 0 ? '增大 (ΔH > 0)' : '不变'}
      </text>

      {/* 定一议二辅助虚线：作 T 轴垂线贯穿两条压强线 */}
      <line
        x1={curX}
        y1={padding.top}
        x2={curX}
        y2={padding.top + chartHeight}
        stroke={CHEMISTRY_COLORS.temperature}
        strokeWidth={1.5}
        strokeDasharray="4 4"
      />
      {/* 高压交点 */}
      <circle
        cx={curX}
        cy={toSvgY(curPt.alphaHighP)}
        r={5}
        fill={colors.secondary[600]}
        stroke="#fff"
        strokeWidth={1.5}
      />
      <text
        x={curX + 8}
        y={toSvgY(curPt.alphaHighP) - 6}
        fontSize={font(11)}
        fontWeight="bold"
        fill={colors.secondary[700]}
        paintOrder="stroke"
        stroke="#fff"
        strokeWidth={3}
      >
        P₂: α={curPt.alphaHighP}%
      </text>

      {/* 低压交点 */}
      <circle
        cx={curX}
        cy={toSvgY(curPt.alphaLowP)}
        r={5}
        fill={colors.primary[600]}
        stroke="#fff"
        strokeWidth={1.5}
      />
      <text
        x={curX + 8}
        y={toSvgY(curPt.alphaLowP) + 14}
        fontSize={font(11)}
        fontWeight="bold"
        fill={colors.primary[700]}
        paintOrder="stroke"
        stroke="#fff"
        strokeWidth={3}
      >
        P₁: α={curPt.alphaLowP}%
      </text>

      {/* 高压曲线 P2 */}
      <path
        d={highPD}
        fill="none"
        stroke={colors.secondary[500]}
        strokeWidth={2.8}
        strokeLinecap="round"
      />

      {/* 低压曲线 P1 */}
      <path
        d={lowPD}
        fill="none"
        stroke={colors.primary[500]}
        strokeWidth={2.8}
        strokeLinecap="round"
      />

      {/* 当前操作点实心圆与清晰大字标注 */}
      <circle
        cx={curX}
        cy={curY}
        r={6.5}
        fill={colors.danger[500]}
        stroke="#fff"
        strokeWidth={2}
      />
      <text
        x={curX + 10}
        y={curY - 10}
        fontSize={font(12)}
        fontWeight="bold"
        fill={colors.danger[600]}
        paintOrder="stroke"
        stroke="#fff"
        strokeWidth={3}
      >
        当前点 (T={temperature}K, P={pressure}atm): α ≈ {alphaTpData.currentAlpha}%
      </text>

      {/* 图例与判据卡片（移至右上角无曲线空白安全区域，杜绝与竖虚线及交点冲突） */}
      <g transform={`translate(${width - padding.right - 220}, ${padding.top + 8})`}>
        <rect
          x={-8}
          y={-6}
          width={220}
          height={68}
          fill="rgba(255, 255, 255, 0.88)"
          stroke="#cbd5e1"
          strokeWidth={1}
          rx={6}
        />
        <line x1={0} y1={10} x2={26} y2={10} stroke={colors.secondary[500]} strokeWidth={3} />
        <text x={34} y={14} fontSize={font(11)} fill={colors.neutral[800]} fontWeight="bold">
          {alphaTpData.highPressureLabel} (α 较高)
        </text>

        <line x1={0} y1={28} x2={26} y2={28} stroke={colors.primary[500]} strokeWidth={3} />
        <text x={34} y={32} fontSize={font(11)} fill={colors.neutral[800]} fontWeight="bold">
          {alphaTpData.lowPressureLabel} (α 较低)
        </text>

        <text x={0} y={52} fontSize={font(10)} fill={colors.neutral[600]}>
          判据：Δng = {gasMolesDiff} {gasMolesHint}；ΔH = {deltaH} kJ/mol {deltaHHint}
        </text>
      </g>
    </svg>
  )
}
