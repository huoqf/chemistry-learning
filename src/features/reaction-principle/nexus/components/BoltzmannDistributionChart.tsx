import React from 'react'
import { CHEMISTRY_COLORS, colors, withAlpha } from '@/theme'

interface BoltzmannDistributionChartProps {
  boltzmannData: {
    distribution: { energy: number; fraction: number; isActivated: boolean }[]
    activatedFraction: number
    baselineDistribution?: { energy: number; fraction: number; isActivated: boolean }[]
    baselineActivatedFraction?: number
    baselineEa?: number
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
  const width = 560
  const height = 340
  const padding = { top: 48, right: 60, bottom: 45, left: 65 }

  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // 标定能量范围 0 ~ 120，让曲线峰值位于约 1/4~1/3，右侧活化区饱满展开
  const maxE = 120
  const maxF = Math.max(
    ...boltzmannData.distribution.map((d) => d.fraction),
    ...(boltzmannData.baselineDistribution?.map((d) => d.fraction) || []),
    0.05
  )

  const toSvgX = (e: number) => padding.left + (e / maxE) * chartWidth
  const toSvgY = (f: number) => padding.top + chartHeight - (f / maxF) * chartHeight

  // 当前态曲线与阴影
  let lineD = ''
  let fillD = ''
  boltzmannData.distribution.forEach((d, i) => {
    const x = toSvgX(d.energy)
    const y = toSvgY(d.fraction)
    if (i === 0) lineD += `M ${x} ${y}`
    else lineD += ` L ${x} ${y}`
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

  // 基准态曲线 (298K, 无催化剂)
  let baselineLineD = ''
  const hasBaseline =
    boltzmannData.baselineDistribution &&
    (temperature !== 298 || (boltzmannData.baselineEa && boltzmannData.baselineEa !== eaForward))

  if (hasBaseline && boltzmannData.baselineDistribution) {
    boltzmannData.baselineDistribution.forEach((d, i) => {
      const x = toSvgX(d.energy)
      const y = toSvgY(d.fraction)
      if (i === 0) baselineLineD += `M ${x} ${y}`
      else baselineLineD += ` L ${x} ${y}`
    })
  }

  const isTempChanged = temperature !== 298
  const isCatalystApplied = boltzmannData.baselineEa && boltzmannData.baselineEa !== eaForward

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
      {/* 定义轴箭头 */}
      <defs>
        <marker
          id="boltzmann-axis-arrow"
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

      {/* 活化高能区阴影 */}
      {fillD && (
        <path
          d={fillD}
          fill={withAlpha(CHEMISTRY_COLORS.temperature, 0.35)}
          stroke="none"
        />
      )}

      {/* 坐标轴 (带正方向箭头) */}
      <line
        x1={padding.left}
        y1={padding.top + chartHeight}
        x2={width - padding.right + 15}
        y2={padding.top + chartHeight}
        stroke={colors.neutral[600]}
        strokeWidth={1.5}
        markerEnd="url(#boltzmann-axis-arrow)"
      />
      <line
        x1={padding.left}
        y1={padding.top + chartHeight}
        x2={padding.left}
        y2={padding.top - 15}
        stroke={colors.neutral[600]}
        strokeWidth={1.5}
        markerEnd="url(#boltzmann-axis-arrow)"
      />

      {/* 坐标轴标签：严格放置于内部安全区 */}
      <text
        x={width - padding.right}
        y={padding.top + chartHeight + 20}
        fontSize={font(12)}
        fill={colors.neutral[700]}
        fontWeight="bold"
        textAnchor="end"
      >
        分子动能 E / (kJ·mol⁻¹) →
      </text>
      <text
        x={padding.left}
        y={padding.top - 16}
        fontSize={font(12)}
        fill={colors.neutral[700]}
        fontWeight="bold"
        textAnchor="start"
      >
        ↑ 分子数百分数 f(E)
      </text>

      {/* 顶部醒目标题 */}
      <text
        x={width - padding.right}
        y={padding.top - 16}
        fontSize={font(11)}
        fill={isCatalystApplied ? colors.secondary[600] : colors.primary[600]}
        fontWeight="bold"
        textAnchor="end"
      >
        {isCatalystApplied
          ? '★ 催化本质：能量分布曲线不变，活化能门槛向左降低！'
          : isTempChanged
          ? '★ 升温本质：曲线右移变宽变矮，活化能 Ea 恒定不变！'
          : '★ 灰色虚线为常温基准态，彩色实线为当前状态'}
      </text>

      {/* 基准态对照曲线 (灰色虚线) */}
      {baselineLineD && (
        <path
          d={baselineLineD}
          fill="none"
          stroke={colors.neutral[400]}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      )}

      {/* 当前态曲线 */}
      <path
        d={lineD}
        fill="none"
        stroke={colors.primary[600]}
        strokeWidth={2.8}
        strokeLinecap="round"
      />

      {/* 基准态 Ea 门槛 (若催化剂改变了 Ea) */}
      {isCatalystApplied && boltzmannData.baselineEa && (
        <g>
          <line
            x1={toSvgX(boltzmannData.baselineEa)}
            y1={padding.top + 20}
            x2={toSvgX(boltzmannData.baselineEa)}
            y2={padding.top + chartHeight}
            stroke={colors.neutral[400]}
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
          <text
            x={toSvgX(boltzmannData.baselineEa) + 4}
            y={padding.top + 32}
            fontSize={font(11)}
            fill={colors.neutral[500]}
            paintOrder="stroke"
            stroke="#fff"
            strokeWidth={3}
          >
            无催化 Ea={boltzmannData.baselineEa}
          </text>
        </g>
      )}

      {/* 当前活化能 Ea 门槛线 */}
      <line
        x1={toSvgX(eaForward)}
        y1={padding.top + 10}
        x2={toSvgX(eaForward)}
        y2={padding.top + chartHeight}
        stroke={CHEMISTRY_COLORS.temperature}
        strokeWidth={2}
        strokeDasharray="4 4"
      />

      {/* 活化能与活化分子占比标签 (清晰大字 + 白色衬底) */}
      <text
        x={toSvgX(eaForward) + 8}
        y={padding.top + 32}
        fontSize={font(12)}
        fontWeight="bold"
        fill={CHEMISTRY_COLORS.temperature}
        paintOrder="stroke"
        stroke="#fff"
        strokeWidth={3}
      >
        Ea = {eaForward} kJ/mol
      </text>

      <text
        x={toSvgX(eaForward) + 8}
        y={padding.top + 50}
        fontSize={font(12)}
        fontWeight="bold"
        fill={CHEMISTRY_COLORS.temperature}
        paintOrder="stroke"
        stroke="#fff"
        strokeWidth={3}
      >
        活化分子占比: {boltzmannData.activatedFraction}%
      </text>

      {/* 活化分子区指向标注 (避免遮挡，放置在右侧下坡段) */}
      {activatedPoints.length > 0 && (
        <g>
          <text
            x={toSvgX(Math.min(maxE - 18, eaForward + 26))}
            y={toSvgY(maxF * 0.35)}
            fontSize={font(12)}
            fontWeight="bold"
            fill={CHEMISTRY_COLORS.temperature}
            textAnchor="middle"
            paintOrder="stroke"
            stroke="#fff"
            strokeWidth={3}
          >
            活化分子区 (E ≥ Ea)
          </text>
          <line
            x1={toSvgX(Math.min(maxE - 18, eaForward + 26))}
            y1={toSvgY(maxF * 0.3)}
            x2={toSvgX(Math.min(maxE - 18, eaForward + 18))}
            y2={toSvgY(maxF * 0.12)}
            stroke={CHEMISTRY_COLORS.temperature}
            strokeWidth={1.5}
          />
        </g>
      )}

      {/* 图例 (放置于右上角安全空白区域，绝不与左侧曲线和中间 Ea 线撞车) */}
      <g transform={`translate(${width - padding.right - 145}, ${padding.top + 8})`}>
        <rect
          x={-6}
          y={-6}
          width={145}
          height={baselineLineD ? 48 : 28}
          fill="rgba(255, 255, 255, 0.85)"
          stroke="#e2e8f0"
          rx={4}
        />
        <line x1={0} y1={8} x2={22} y2={8} stroke={colors.primary[600]} strokeWidth={2.8} />
        <text x={28} y={12} fontSize={font(11)} fill={colors.neutral[800]} fontWeight="bold">
          当前温度 T = {temperature} K
        </text>
        {baselineLineD && (
          <>
            <line
              x1={0}
              y1={28}
              x2={22}
              y2={28}
              stroke={colors.neutral[400]}
              strokeWidth={2}
              strokeDasharray="4 4"
            />
            <text x={28} y={32} fontSize={font(11)} fill={colors.neutral[600]}>
              基准常温 298 K
            </text>
          </>
        )}
      </g>
    </svg>
  )
}


