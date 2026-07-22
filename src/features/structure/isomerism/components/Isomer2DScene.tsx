import { SCENE_COLORS, FONT, colors, CHART_COLORS } from '@/theme'
import type { IsomerNode } from '@/components/Chemistry'
import { BaseChart } from '@/components/Chart'

export interface Isomer2DSceneProps {
  isomer?: IsomerNode | null
  showEquivalentH: boolean
  font: (n: number) => number
  onSelectIsomer?: (isomer: IsomerNode) => void
}

// 等效氢高亮色彩池（全部走 CHART_COLORS token，禁止硬编码）
// 6 色对应最多 6 种等效氢分组，按 CHART_COLORS.primary + compareA~E 顺序
const EQUIVALENT_H_COLORS = [
  CHART_COLORS.primary,    // 浓度蓝
  CHART_COLORS.compareA,   // 温度橙
  CHART_COLORS.compareB,   // 压强紫
  CHART_COLORS.compareC,   // 速率绿
  CHART_COLORS.compareD,   // pH 青绿
  CHART_COLORS.compareE,   // 电极电势粉
]

/**
 * Isomer2DScene — 纯 SVG 2D 碳骨架与减碳法推导图景 + ¹H-NMR 氢谱图表
 *
 * 遵循 2D 规范：
 * - 上半区 (y: 0~415px)：2D 平面碳骨架与减碳树 SVG 节点 (基准中线 y=240px)
 * - 下半区 (y: 445~630px)：原生嵌入由 BaseChart 驱动的 ¹H-NMR 核磁共振氢谱吸收峰图表
 * - 所有颜色引用 @/theme token，禁止硬编码
 * - 所有文字经 font(FONT.xxx) 包裹
 */
export function Isomer2DScene({
  isomer,
  showEquivalentH,
  font,
}: Isomer2DSceneProps) {
  if (!isomer || !isomer.nodes || !Array.isArray(isomer.nodes)) {
    return null
  }

  const getNodePos = (id: string) => {
    return isomer.nodes.find((n) => n.id === id)
  }

  const safeBonds = Array.isArray(isomer.bonds) ? isomer.bonds : []
  const peaks = isomer.hnmrPeaks || []

  // 计算 NMR 谱图 Y 轴最大刻度 (根据最高吸收氢数动态决定)
  const maxPeakCount = peaks.reduce((acc, p) => Math.max(acc, p.count), 6)
  const yUpper = Math.max(12, Math.ceil((maxPeakCount + 2) / 2) * 2)

  return (
    <g className="isomer-2d-scene">
      {/* 1. 顶部 2D 信息条 (x: 15, y: 20, 宽 390, 高 32) */}
      <g transform="translate(15, 20)">
        <rect
          x={0}
          y={0}
          width={390}
          height={32}
          rx={6}
          fill={colors.neutral[100]}
          stroke={colors.neutral[200]}
        />
        <text
          x={12}
          y={20}
          fontSize={font(FONT.small)}
          fontWeight="bold"
          fill={colors.neutral[700]}
        >
          {`2D 平面碳骨架：${isomer.name || ''} (${isomer.formula || ''})`}
        </text>
        <text
          x={250}
          y={20}
          fontSize={font(FONT.small)}
          fontWeight="bold"
          fill={colors.primary[700]}
        >
          {`等效氢：${isomer.equivalentHCount || 0} 种`}
        </text>
      </g>

      {/* 2. 绘制 C-C / C=C 矢量化学键 */}
      {safeBonds.map((bond, idx) => {
        const start = getNodePos(bond.fromId)
        const end = getNodePos(bond.toId)
        if (!start || !end) return null

        const isDouble = bond.type === 'double'

        return (
          <g key={`bond-${bond.fromId}-${bond.toId}-${idx}`}>
            {isDouble ? (
              <>
                <line
                  x1={start.x - 3}
                  y1={start.y - 3}
                  x2={end.x - 3}
                  y2={end.y - 3}
                  stroke={SCENE_COLORS.materials.iron}
                  strokeWidth={2.5}
                />
                <line
                  x1={start.x + 3}
                  y1={start.y + 3}
                  x2={end.x + 3}
                  y2={end.y + 3}
                  stroke={SCENE_COLORS.materials.iron}
                  strokeWidth={2.5}
                />
              </>
            ) : (
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={SCENE_COLORS.materials.iron}
                strokeWidth={2.5}
              />
            )}
          </g>
        )
      })}

      {/* 3. 绘制 2D 碳原子与基团节点 */}
      {isomer.nodes.map((node) => {
        const eqGroup = node.equivalentHydrogenGroup || 1
        const groupColor = EQUIVALENT_H_COLORS[(eqGroup - 1) % EQUIVALENT_H_COLORS.length]

        return (
          <g key={`node-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
            {/* 等效氢染色背景圈 */}
            {showEquivalentH && (
              <circle
                r={20}
                fill={groupColor}
                opacity={0.25}
              />
            )}

            {/* 节点气泡白框 */}
            <circle
              r={15}
              fill={colors.neutral.white}
              stroke={showEquivalentH ? groupColor : colors.neutral[400]}
              strokeWidth={showEquivalentH ? 2.5 : 1.5}
            />

            {/* 基团化学式文字 (如 CH₃) */}
            <text
              textAnchor="middle"
              dy="4"
              fontSize={font(FONT.label)}
              fontWeight="bold"
              fill={showEquivalentH ? groupColor : colors.neutral[800]}
            >
              {node.label}
            </text>

            {/* 等效氢编号 Badge 标注 */}
            {showEquivalentH && (
              <g transform="translate(12, -12)">
                <circle r={7} fill={groupColor} />
                <text
                  textAnchor="middle"
                  dy="3"
                  fontSize={font(FONT.small - 3)}
                  fill={colors.neutral.white}
                  fontWeight="bold"
                >
                  {`H${eqGroup}`}
                </text>
              </g>
            )}
          </g>
        )
      })}

      {/* 4. 分隔栏标题 (y: 420~440px) */}
      <g transform="translate(15, 420)">
        <line
          x1={0}
          y1={0}
          x2={390}
          y2={0}
          stroke={colors.neutral[300]}
          strokeWidth={1}
          strokeDasharray="4 3"
        />
        <text
          x={0}
          y={15}
          fontSize={font(FONT.small - 1)}
          fontWeight="bold"
          fill={CHART_COLORS.titleText}
        >
          {`¹H-NMR 核磁共振氢谱吸收峰 (峰数: ${peaks.length} 组)`}
        </text>
      </g>

      {/* 5. 下半区：¹H-NMR 图表组件 (BaseChart fixedSize 模式，位于 translate(15, 445)) */}
      <g transform="translate(15, 445)">
        <BaseChart
          fixedSize={{ width: 390, height: 185 }}
          xDomain={[0, 10]}
          yDomain={[0, yUpper]}
          xLabel="化学位移 δ (ppm)"
          yLabel="吸收强度/H"
          showGrid={true}
        >
          {/* 自定义等效氢 1H-NMR 吸收峰线与峰顶标注 */}
          <HnmrPeakOverlay peaks={peaks} font={font} showEquivalentH={showEquivalentH} />
        </BaseChart>
      </g>
    </g>
  )
}

/**
 * HnmrPeakOverlay — BaseChart 插槽子组件，利用 BaseChart 的 toSvgX/toSvgY 画吸收峰
 */
function HnmrPeakOverlay({
  peaks,
  font,
  showEquivalentH,
}: {
  peaks: Array<{ group: number; delta: number; count: number; multiplicity?: string }>
  font: (n: number) => number
  showEquivalentH: boolean
}) {
  return (
    <g className="hnmr-peaks-layer">
      {peaks.map((peak, idx) => {
        const groupColor = EQUIVALENT_H_COLORS[(peak.group - 1) % EQUIVALENT_H_COLORS.length]
        const drawColor = showEquivalentH ? groupColor : CHART_COLORS.primary

        // 计算峰的化学位移对应的物理位置 (10 -> 0 ppm)
        // 注意 NMR 习惯高场 (0ppm) 在右侧，低场 (10ppm) 在左侧
        const physX = 10 - Math.min(10, Math.max(0, peak.delta))

        return (
          <g key={`peak-${idx}`}>
            {/* 使用已渲染的 BaseChart 上插槽线条 */}
            <HnmrSinglePeak
              physX={physX}
              count={peak.count}
              color={drawColor}
              group={peak.group}
              multiplicity={peak.multiplicity}
              font={font}
              showEquivalentH={showEquivalentH}
            />
          </g>
        )
      })}
    </g>
  )
}

import { useChartContext } from '@/components/Chart'

function HnmrSinglePeak({
  physX,
  count,
  color,
  group,
  multiplicity,
  font,
  showEquivalentH,
}: {
  physX: number
  count: number
  color: string
  group: number
  multiplicity?: string
  font: (n: number) => number
  showEquivalentH: boolean
}) {
  const chartCtx = useChartContext()
  if (!chartCtx) return null
  const { toSvgX, toSvgY } = chartCtx

  const x = toSvgX(physX)
  const yBase = toSvgY(0)
  const yPeak = toSvgY(count)

  return (
    <g className="single-hnmr-peak">
      {/* 吸收主峰垂直线 */}
      <line
        x1={x}
        y1={yBase}
        x2={x}
        y2={yPeak}
        stroke={color}
        strokeWidth={3}
      />

      {/* 左右两侧对称拟合小副峰 (模拟多重峰 Splitting 视觉效果) */}
      <line
        x1={x - 3}
        y1={yBase}
        x2={x - 3}
        y2={yBase - (yBase - yPeak) * 0.4}
        stroke={color}
        strokeWidth={1.5}
        opacity={0.7}
      />
      <line
        x1={x + 3}
        y1={yBase}
        x2={x + 3}
        y2={yBase - (yBase - yPeak) * 0.4}
        stroke={color}
        strokeWidth={1.5}
        opacity={0.7}
      />

      {/* 峰顶强度控制圆点 */}
      <circle cx={x} cy={yPeak} r={4} fill={color} />

      {/* 峰顶积分标注（如 "6H"） */}
      <text
        x={x}
        y={yPeak - 6}
        textAnchor="middle"
        fontSize={font(FONT.small - 2)}
        fontWeight="bold"
        fill={color}
      >
        {`${count}H${multiplicity ? ` (${multiplicity})` : ''}`}
      </text>

      {/* 等效氢组号标注 (如 H1) */}
      {showEquivalentH && (
        <text
          x={x}
          y={yPeak - 18}
          textAnchor="middle"
          fontSize={font(FONT.small - 4)}
          fontWeight="bold"
          fill={color}
        >
          {`[H${group}]`}
        </text>
      )}
    </g>
  )
}

