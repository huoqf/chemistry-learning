import { useContext } from 'react'
import { BaseChart, ChartContext } from '@/components/Chart'
import { CHEMISTRY_COLORS, CANVAS_COLORS, CHART_COLORS, withAlpha } from '@/theme'
import type { RedoxChemistryResult } from '../hooks/useRedoxElectronTransferChemistry'

interface ValenceStaircaseChartProps {
  chemistry: RedoxChemistryResult
}

/** 阶梯图内部绘图层 (利用 BaseChart 上下文的 toSvgX, toSvgY 坐标转换) */
function ValenceStaircaseContent({ chemistry }: { chemistry: RedoxChemistryResult }) {
  const ctx = useContext(ChartContext)
  if (!ctx) return null
  const { toSvgX, toSvgY, font } = ctx

  const { oxidized, reduced, spectator } = chemistry.model.elements
  const { progress } = chemistry
  const oxColor = CHEMISTRY_COLORS.reactionRate
  const redColor = CHEMISTRY_COLORS.concentration
  const specColor = CANVAS_COLORS.axis

  // 反应物在 x=0.4，产物在 x=1.6，游标随 progress 从左到右
  const xReactant = 0.4
  const xProduct = 1.6
  const cursorX = xReactant + (xProduct - xReactant) * progress

  const oxY1 = toSvgY(oxidized.fromValence)
  const oxY2 = toSvgY(oxidized.toValence)
  const redY1 = toSvgY(reduced.fromValence)
  const redY2 = toSvgY(reduced.toValence)

  const oxX1 = toSvgX(xReactant)
  const oxX2 = toSvgX(xProduct)

  return (
    <g>
      {/* 1. 氧化元素升价线 (升失氧) */}
      <path
        d={`M ${oxX1} ${oxY1} L ${oxX2} ${oxY2}`}
        stroke={oxColor}
        strokeWidth={3}
        fill="none"
      />
      <circle cx={oxX1} cy={oxY1} r={5} fill={oxColor} />
      <circle cx={oxX2} cy={oxY2} r={5} fill={oxColor} />
      <text x={oxX1 - 10} y={oxY1 + 4} fontSize={font(11)} fontWeight="bold" fill={oxColor} textAnchor="end">
        {`${oxidized.symbol} (${oxidized.fromValence})`}
      </text>
      <text x={oxX2 + 10} y={oxY2 + 4} fontSize={font(11)} fontWeight="bold" fill={oxColor} textAnchor="start">
        {`+${oxidized.toValence}`}
      </text>
      {/* 升价标识 */}
      <rect x={(oxX1 + oxX2) / 2 - 25} y={(oxY1 + oxY2) / 2 - 12} width={50} height={20} rx={4} fill={withAlpha(oxColor, 0.15)} />
      <text x={(oxX1 + oxX2) / 2} y={(oxY1 + oxY2) / 2 + 2} fontSize={font(10)} fontWeight="bold" fill={oxColor} textAnchor="middle">
        {`▲ 升 ${Math.abs(oxidized.delta)}`}
      </text>

      {/* 2. 还原元素降价线 (降得还) */}
      <path
        d={`M ${oxX1} ${redY1} L ${oxX2} ${redY2}`}
        stroke={redColor}
        strokeWidth={3}
        fill="none"
      />
      <circle cx={oxX1} cy={redY1} r={5} fill={redColor} />
      <circle cx={oxX2} cy={redY2} r={5} fill={redColor} />
      <text x={oxX1 - 10} y={redY1 + 4} fontSize={font(11)} fontWeight="bold" fill={redColor} textAnchor="end">
        {`${reduced.symbol} (+${reduced.fromValence})`}
      </text>
      <text x={oxX2 + 10} y={redY2 + 4} fontSize={font(11)} fontWeight="bold" fill={redColor} textAnchor="start">
        {reduced.toValence > 0 ? `+${reduced.toValence}` : `${reduced.toValence}`}
      </text>
      {/* 降价标识 */}
      <rect x={(oxX1 + oxX2) / 2 - 25} y={(redY1 + redY2) / 2 - 12} width={50} height={20} rx={4} fill={withAlpha(redColor, 0.15)} />
      <text x={(oxX1 + oxX2) / 2} y={(redY1 + redY2) / 2 + 2} fontSize={font(10)} fontWeight="bold" fill={redColor} textAnchor="middle">
        {`▼ 降 ${Math.abs(reduced.delta)}`}
      </text>

      {/* 3. 旁观/部分不变价元素 */}
      {spectator && (() => {
        const specY = toSvgY(spectator.valence)
        return (
          <g>
            <path
              d={`M ${oxX1} ${specY} L ${oxX2} ${specY}`}
              stroke={specColor}
              strokeWidth={2}
              strokeDasharray="4,4"
              fill="none"
            />
            <circle cx={oxX1} cy={specY} r={4} fill={specColor} />
            <circle cx={oxX2} cy={specY} r={4} fill={specColor} />
            <text x={(oxX1 + oxX2) / 2} y={specY - 6} fontSize={font(10)} fill={specColor} textAnchor="middle">
              {spectator.role}
            </text>
          </g>
        )
      })()}

      {/* 4. 动画游标线 — 随 progress 从反应物移向生成物 */}
      {progress > 0 && progress < 1 && (() => {
        const cx = toSvgX(cursorX)
        const yTop = toSvgY(7.5)
        const yBot = toSvgY(-1.5)
        // 游标处各元素的瞬时化合价 (线性插值)
        const oxY = toSvgY(oxidized.fromValence + (oxidized.toValence - oxidized.fromValence) * progress)
        const redY = toSvgY(reduced.fromValence + (reduced.toValence - reduced.fromValence) * progress)
        return (
          <g>
            <line x1={cx} y1={yTop} x2={cx} y2={yBot} stroke={CANVAS_COLORS.labelText} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
            <circle cx={cx} cy={oxY} r={4} fill={oxColor} stroke="#fff" strokeWidth={1.5} />
            <circle cx={cx} cy={redY} r={4} fill={redColor} stroke="#fff" strokeWidth={1.5} />
          </g>
        )
      })()}
    </g>
  )
}

/** 柱状对比图内部绘图层 — 柱高随 progress 从 0 生长到终值 */
function MoleBarChartContent({ chemistry }: { chemistry: RedoxChemistryResult }) {
  const ctx = useContext(ChartContext)
  if (!ctx) return null
  const { toSvgX, toSvgY, font } = ctx

  const { actualTransferredElectrons, actualOxidantMoles, actualOxProductMoles, progress } = chemistry
  const oxColor = CHEMISTRY_COLORS.reactionRate
  const redColor = CHEMISTRY_COLORS.concentration

  const moleData = [
    { label: '还原剂', value: actualOxidantMoles, color: oxColor },
    { label: '氧化剂', value: actualOxidantMoles, color: redColor },
    { label: '氧化产物', value: actualOxProductMoles, color: oxColor },
    { label: '转移电子', value: actualTransferredElectrons, color: CHART_COLORS.primary },
  ]

  const yZero = toSvgY(0)

  return (
    <g>
      {moleData.map((item, idx) => {
        const xCenter = toSvgX(idx + 0.5)
        const barWidth = 36
        // 柱高随 progress 线性生长
        const animatedValue = item.value * progress
        const yVal = toSvgY(animatedValue)
        const height = Math.abs(yZero - yVal)

        return (
          <g key={`mole-bar-${idx}`}>
            <rect
              x={xCenter - barWidth / 2}
              y={yVal}
              width={barWidth}
              height={height}
              rx={4}
              fill={withAlpha(item.color, 0.85)}
              stroke={item.color}
              strokeWidth={1.5}
            />
            <text
              x={xCenter}
              y={yVal - 6}
              fontSize={font(10)}
              fontWeight="bold"
              fill={item.color}
              textAnchor="middle"
            >
              {`${animatedValue.toFixed(1)}m`}
            </text>
          </g>
        )
      })}
    </g>
  )
}

/**
 * 右区图表组件：100% 组合自 BaseChart 原子图表基座组件
 */
export function ValenceStaircaseChart({ chemistry }: ValenceStaircaseChartProps) {
  const { actualTransferredElectrons, actualOxidantMoles, actualOxProductMoles } = chemistry
  const moleDataValues = [actualOxidantMoles, actualOxProductMoles, actualTransferredElectrons]
  const maxMole = Math.max(...moleDataValues, 1.0) * 1.25

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* 1. 化合价升降阶梯图 (组合自 BaseChart) */}
      <div className="flex-1 min-h-0 w-full p-2 border-b border-slate-200/60 overflow-hidden">
        <BaseChart
          title="元素化合价升降阶梯图"
          xDomain={[0, 2]}
          yDomain={[-1.5, 7.5]}
          xLabel=""
          yLabel="化合价 (Valence)"
          formatX={(v) => (Math.abs(v - 0.4) < 0.2 ? '反应物' : Math.abs(v - 1.6) < 0.2 ? '生成物' : '')}
          formatY={(v) => (v > 0 ? `+${Math.round(v)}` : `${Math.round(v)}`)}
          showGrid={true}
        >
          <ValenceStaircaseContent chemistry={chemistry} />
        </BaseChart>
      </div>

      {/* 2. 反应化学量与转移电子对比图 (组合自 BaseChart) */}
      <div className="flex-1 min-h-0 w-full p-2 overflow-hidden">
        <BaseChart
          title="反应化学量与转移电子数对比 (mol)"
          xDomain={[0, 4]}
          yDomain={[0, maxMole]}
          xLabel=""
          yLabel="物质的量 (mol)"
          formatX={(v) => {
            const labels = ['还原剂', '氧化剂', '氧化产物', '转移电子']
            const idx = Math.floor(v)
            return labels[idx] ?? ''
          }}
          formatY={(v) => `${v.toFixed(1)}`}
          showGrid={true}
        >
          <MoleBarChartContent chemistry={chemistry} />
        </BaseChart>
      </div>
    </div>
  )
}
