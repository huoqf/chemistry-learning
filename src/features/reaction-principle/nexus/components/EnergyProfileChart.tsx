import React from 'react'
import { CHEMISTRY_COLORS, colors } from '@/theme'
import type { EnergyProfilePoint, CatalystType, StepBarrierInfo } from '../types'

interface EnergyProfileChartProps {
  tsPoints: EnergyProfilePoint[]
  eaForward: number
  eaReverse: number
  deltaH: number
  catalyst: CatalystType
  stepBarriers?: StepBarrierInfo[]
  rdsIndex?: number
  font?: (v: number) => number
}

export const EnergyProfileChart: React.FC<EnergyProfileChartProps> = ({
  tsPoints,
  eaForward,
  eaReverse,
  deltaH,
  catalyst,
  stepBarriers = [],
  rdsIndex = 1,
  font = (v) => v,
}) => {
  const width = 560
  const height = 340
  const padding = { top: 48, right: 60, bottom: 45, left: 65 }

  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const maxX = 100
  // 动态优化势能纵轴定标，让势能山峰占据画面黄金视觉高度 (约 70% 垂直空间)
  const minY = Math.min(...tsPoints.map((p) => p.y), 0) - 15
  const maxY = Math.max(...tsPoints.map((p) => p.y)) + 28

  const toSvgX = (x: number) => padding.left + (x / maxX) * chartWidth
  const toSvgY = (y: number) =>
    padding.top + chartHeight - ((y - minY) / (maxY - minY)) * chartHeight

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
  const isMulti = catalyst === 'catalyst-b' && stepBarriers.length > 1

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
      {/* 定义标记箭头与滤镜 */}
      <defs>
        <marker
          id="axis-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={colors.neutral[600]} />
        </marker>
        <marker
          id="delta-arrow-down"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M 1.5 0 L 5 7 L 8.5 0 z" fill={deltaH < 0 ? CHEMISTRY_COLORS.temperature : CHEMISTRY_COLORS.amount} />
        </marker>
      </defs>

      {/* 坐标轴 (带正方向箭头) */}
      <line
        x1={padding.left}
        y1={padding.top + chartHeight}
        x2={width - padding.right + 15}
        y2={padding.top + chartHeight}
        stroke={colors.neutral[600]}
        strokeWidth={1.5}
        markerEnd="url(#axis-arrow)"
      />
      <line
        x1={padding.left}
        y1={padding.top + chartHeight}
        x2={padding.left}
        y2={padding.top - 15}
        stroke={colors.neutral[600]}
        strokeWidth={1.5}
        markerEnd="url(#axis-arrow)"
      />

      {/* 轴标签：严格放置于 viewBox 内部安全区，绝不越界截断 */}
      <text
        x={width - padding.right + 15}
        y={padding.top + chartHeight + 20}
        fontSize={font(12)}
        fill={colors.neutral[700]}
        fontWeight="bold"
        textAnchor="end"
      >
        反应历程 →
      </text>
      <text
        x={padding.left}
        y={padding.top - 16}
        fontSize={font(12)}
        fill={colors.neutral[700]}
        fontWeight="bold"
        textAnchor="start"
      >
        ↑ 相对势能 E / (kJ·mol⁻¹)
      </text>

      {/* 高考避坑醒目标签 */}
      <text
        x={width - padding.right}
        y={padding.top - 16}
        fontSize={font(11)}
        fill={isMulti ? colors.danger[600] : colors.primary[600]}
        fontWeight="bold"
        textAnchor="end"
      >
        {isMulti
          ? `★ 决速步为第 ${rdsIndex} 步 (相对能垒最大 ΔEa2 > ΔEa1)`
          : `★ 催化剂同等降低 Ea(正) 与 Ea(逆)，ΔH 恒定`}
      </text>

      {/* 能量曲线 */}
      <path
        d={generatePathD()}
        fill="none"
        stroke={catalyst === 'none' ? colors.primary[600] : colors.secondary[500]}
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* 过渡态点与物质点 */}
      {tsPoints.map((p, idx) => {
        const sx = toSvgX(p.x)
        const sy = toSvgY(p.y)
        const isRds = p.isRDS

        return (
          <g key={idx}>
            <circle
              cx={sx}
              cy={sy}
              r={p.isTS ? (isRds ? 6 : 4.5) : 3.5}
              fill={isRds ? colors.danger[500] : p.isTS ? CHEMISTRY_COLORS.temperature : colors.neutral[600]}
              stroke="#fff"
              strokeWidth={1.5}
            />
            {p.label && (
              <text
                x={sx}
                y={sy - 10}
                fontSize={font(p.isRDS ? 11 : 10)}
                fontWeight={p.isTS ? 'bold' : 'normal'}
                fill={isRds ? colors.danger[700] : p.isTS ? CHEMISTRY_COLORS.temperature : colors.neutral[700]}
                textAnchor="middle"
              >
                {p.label}
              </text>
            )}
          </g>
        )
      })}

      {/* 相对能垒标注 */}
      {!isMulti ? (
        // 单步历程：完整呈现正活化能 Ea(正) 与逆活化能 Ea(逆) 双标尺对齐
        <g>
          {/* 反应物水平基准线 */}
          <line
            x1={toSvgX(10)}
            y1={toSvgY(reactY)}
            x2={toSvgX(55)}
            y2={toSvgY(reactY)}
            stroke={colors.neutral[400]}
            strokeDasharray="3 3"
          />
          {/* 生成物水平基准线 */}
          <line
            x1={toSvgX(45)}
            y1={toSvgY(prodY)}
            x2={toSvgX(92)}
            y2={toSvgY(prodY)}
            stroke={colors.neutral[400]}
            strokeDasharray="3 3"
          />
          {/* 过渡态最高点水平基线 */}
          <line
            x1={toSvgX(38)}
            y1={toSvgY(100 + eaForward)}
            x2={toSvgX(62)}
            y2={toSvgY(100 + eaForward)}
            stroke={colors.neutral[400]}
            strokeDasharray="2 2"
          />

          {/* 正反应活化能 Ea(正) 垂直标尺 */}
          <line
            x1={toSvgX(42)}
            y1={toSvgY(reactY)}
            x2={toSvgX(42)}
            y2={toSvgY(100 + eaForward)}
            stroke={CHEMISTRY_COLORS.activationEnergy}
            strokeWidth={2}
          />
          <text
            x={toSvgX(42) - 8}
            y={toSvgY(reactY + eaForward / 2)}
            fontSize={font(12)}
            fontWeight="bold"
            fill={CHEMISTRY_COLORS.activationEnergy}
            textAnchor="end"
            paintOrder="stroke"
            stroke="#fff"
            strokeWidth={3}
            strokeLinejoin="round"
          >
            Ea(正) = {eaForward} kJ/mol
          </text>

          {/* 逆反应活化能 Ea(逆) 垂直标尺 */}
          <line
            x1={toSvgX(58)}
            y1={toSvgY(prodY)}
            x2={toSvgX(58)}
            y2={toSvgY(100 + eaForward)}
            stroke={colors.secondary[600]}
            strokeWidth={2}
          />
          <text
            x={toSvgX(58) + 8}
            y={toSvgY(prodY + eaReverse / 2)}
            fontSize={font(12)}
            fontWeight="bold"
            fill={colors.secondary[700]}
            textAnchor="start"
            paintOrder="stroke"
            stroke="#fff"
            strokeWidth={3}
            strokeLinejoin="round"
          >
            Ea(逆) = {eaReverse} kJ/mol
          </text>
        </g>
      ) : (
        // 多步历程：分别标注步骤1与步骤2能垒
        <g>
          {/* 反应物基线 */}
          <line
            x1={toSvgX(10)}
            y1={toSvgY(reactY)}
            x2={toSvgX(52)}
            y2={toSvgY(reactY)}
            stroke={colors.neutral[400]}
            strokeDasharray="3 3"
          />
          {/* 步1 能垒: 反应物 -> TS1 */}
          <line
            x1={toSvgX(24)}
            y1={toSvgY(reactY)}
            x2={toSvgX(24)}
            y2={toSvgY(stepBarriers[0]?.toY || 130)}
            stroke={colors.primary[600]}
            strokeWidth={2}
          />
          <text
            x={toSvgX(24) - 6}
            y={toSvgY(reactY + (stepBarriers[0]?.ea || 20) / 2)}
            fontSize={font(12)}
            fontWeight="bold"
            fill={colors.primary[700]}
            textAnchor="end"
            paintOrder="stroke"
            stroke="#fff"
            strokeWidth={3}
          >
            ΔEa1 = {stepBarriers[0]?.ea}
          </text>

          {/* 中间体基底线 */}
          {stepBarriers[1] && (
            <>
              <line
                x1={toSvgX(40)}
                y1={toSvgY(stepBarriers[1].fromY)}
                x2={toSvgX(85)}
                y2={toSvgY(stepBarriers[1].fromY)}
                stroke={colors.neutral[400]}
                strokeDasharray="3 3"
              />
              {/* 步2 能垒: 中间体 -> TS2 (决速步) */}
              <line
                x1={toSvgX(62)}
                y1={toSvgY(stepBarriers[1].fromY)}
                x2={toSvgX(62)}
                y2={toSvgY(stepBarriers[1].toY)}
                stroke={colors.danger[600]}
                strokeWidth={2.5}
              />
              <text
                x={toSvgX(62) - 6}
                y={toSvgY(stepBarriers[1].fromY + stepBarriers[1].ea / 2)}
                fontSize={font(12)}
                fontWeight="bold"
                fill={colors.danger[700]}
                textAnchor="end"
                paintOrder="stroke"
                stroke="#fff"
                strokeWidth={3}
              >
                ΔEa2 = {stepBarriers[1].ea} (决速步)
              </text>
            </>
          )}
        </g>
      )}

      {/* 反应热 ΔH 标注 (带方向指示箭头，内移至安全区，确保文字 100% 完整显示绝不截断) */}
      <line
        x1={toSvgX(68)}
        y1={toSvgY(reactY)}
        x2={toSvgX(82)}
        y2={toSvgY(reactY)}
        stroke={colors.neutral[400]}
        strokeDasharray="3 3"
      />
      <line
        x1={toSvgX(68)}
        y1={toSvgY(prodY)}
        x2={toSvgX(86)}
        y2={toSvgY(prodY)}
        stroke={colors.neutral[400]}
        strokeDasharray="3 3"
      />
      <line
        x1={toSvgX(76)}
        y1={toSvgY(reactY)}
        x2={toSvgX(76)}
        y2={toSvgY(prodY)}
        stroke={deltaH < 0 ? CHEMISTRY_COLORS.temperature : CHEMISTRY_COLORS.amount}
        strokeWidth={2.5}
        markerEnd="url(#delta-arrow-down)"
      />
      <text
        x={toSvgX(76) + 8}
        y={toSvgY(reactY + (prodY - reactY) / 2)}
        fontSize={font(12)}
        fontWeight="bold"
        fill={deltaH < 0 ? CHEMISTRY_COLORS.temperature : CHEMISTRY_COLORS.amount}
        textAnchor="start"
        paintOrder="stroke"
        stroke="#fff"
        strokeWidth={3}
      >
        ΔH = {deltaH} kJ/mol
      </text>
    </svg>
  )
}

