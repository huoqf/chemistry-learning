import { SCENE_COLORS, withAlpha, STROKE } from '@/theme'
import type { FontScaler } from '@/theme'

export interface BuchnerFunnelApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 100） */
  width?: number
  /** 器材高度（设计单位，默认 160） */
  height?: number
  /** 抽滤瓶内部滤液高度比例 0~1 */
  fillLevel?: number
  /** 是否在漏斗内留有晶体滤饼 */
  hasFilterCake?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * BuchnerFunnelApparatus — 布氏漏斗与抽滤瓶组件
 *
 * 适用高中化学场景：
 * - 减压抽滤（阿司匹林制备、重结晶提纯，高考工业流程压轴常考）
 *
 * 颜色：`SCENE_COLORS.separationAndPurification.buchnerFunnel` / `suctionFlask`
 */
export function BuchnerFunnelApparatus({
  x,
  y,
  width = 100,
  height = 160,
  fillLevel = 0.35,
  hasFilterCake = true,
}: BuchnerFunnelApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 40

  const funnelH = h * 0.35
  const flaskH = h * 0.65
  const neckW = w * 0.3
  const neckLeft = (w - neckW) / 2

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 1. 抽滤瓶主体 (具支烧瓶/抽滤瓶) */}
      <path
        d={`
          M ${neckLeft} ${funnelH}
          L ${w - neckLeft} ${funnelH}
          L ${w - neckLeft} ${funnelH + 15}
          L ${w} ${h - 10}
          Q ${w} ${h} ${w - 10} ${h}
          L 10 ${h}
          Q 0 ${h} 0 ${h - 10}
          L ${neckLeft} ${funnelH + 15}
          Z
        `}
        fill={withAlpha(SCENE_COLORS.container.beaker, 0.4)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 抽滤瓶侧抽气口 (连接抽气泵) */}
      <rect
        x={w - neckLeft - 2}
        y={funnelH + 8}
        width={16}
        height={6}
        fill={SCENE_COLORS.materials.glass}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.reference}
      />

      {/* 滤液 */}
      {fillLevel > 0 && (
        <rect
          x={4}
          y={h - (flaskH - 20) * fillLevel}
          width={w - 8}
          height={(flaskH - 20) * fillLevel}
          fill={SCENE_COLORS.reagent.solution}
          opacity={0.8}
          rx={2}
        />
      )}

      {/* 2. 瓷质布氏漏斗 (白瓷/黄瓷) */}
      <polygon
        points={`
          ${w * 0.1}, 0
          ${w * 0.9}, 0
          ${w * 0.9}, ${funnelH * 0.5}
          ${neckLeft + 4}, ${funnelH * 0.8}
          ${neckLeft + 4}, ${funnelH + 15}
          ${neckLeft + 10}, ${funnelH + 15}
          ${w - neckLeft - 4}, ${funnelH * 0.8}
          ${w * 0.9}, ${funnelH * 0.5}
        `}
        fill={SCENE_COLORS.separationAndPurification.buchnerFunnel}
        stroke={SCENE_COLORS.materials.wood}
        strokeWidth={STROKE.objectLine}
      />

      {/* 漏斗内滤纸与晶体滤饼 */}
      {hasFilterCake && !isTiny && (
        <g>
          {/* 滤纸 */}
          <line
            x1={w * 0.15}
            y1={funnelH * 0.48}
            x2={w * 0.85}
            y2={funnelH * 0.48}
            stroke={SCENE_COLORS.materials.glass}
            strokeWidth={STROKE.objectThin}
          />
          {/* 晶体滤饼 */}
          <rect
            x={w * 0.2}
            y={funnelH * 0.3}
            width={w * 0.6}
            height={funnelH * 0.18}
            fill={SCENE_COLORS.reagent.precipitate}
            opacity={0.9}
            rx={1}
          />
        </g>
      )}
    </g>
  )
}
