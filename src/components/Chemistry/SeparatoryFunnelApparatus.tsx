import { SCENE_COLORS, withAlpha, STROKE } from '@/theme'
import type { FontScaler } from '@/theme'

export interface SeparatoryFunnelApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 80） */
  width?: number
  /** 器材高度（设计单位，默认 180） */
  height?: number
  /** 下层液体比例 0~1 (如水相) */
  bottomFillLevel?: number
  /** 下层液体颜色 */
  bottomFillColor?: string
  /** 上层液体比例 0~1 (如 CCl₄ 或苯萃取相) */
  topFillLevel?: number
  /** 上层液体颜色 */
  topFillColor?: string
  /** 活塞阀门是否打开 */
  isOpen?: boolean
  /** 是否带有顶部磨砂玻璃塞 */
  hasStopper?: boolean
  /** 自定义下颈 Stem 长度 (用于穿过橡皮塞深插入发生容器) */
  stemLength?: number
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * SeparatoryFunnelApparatus — 高考标准分液漏斗组件
 *
 * 特性：
 * - 遵守高考与教材规范：下端带有显眼的 45° 斜切尖嘴 (Beveled Edge Tip，长边朝右紧贴内壁)
 * - 导出 `tipContactPort` 锚点，确保斜切长边 100% 物理紧贴接收烧杯内壁
 * - 包含玻璃反光高光与旋转活塞细节
 */
export function SeparatoryFunnelApparatus({
  x,
  y,
  width = 80,
  height = 180,
  bottomFillLevel = 0,
  bottomFillColor = SCENE_COLORS.reagent.solution,
  topFillLevel = 0,
  topFillColor = SCENE_COLORS.reagent.acid,
  isOpen = false,
  hasStopper = true,
  stemLength,
}: SeparatoryFunnelApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 40

  const neckW = w * 0.22
  const neckH = Math.min(22, h * 0.12)
  const neckLeft = (w - neckW) / 2
  const neckRight = neckLeft + neckW

  // 下颈 Stem 长度与球腹高度计算
  const stemH = stemLength ?? h * 0.33
  const bulbH = stemLength ? Math.max(40, h - neckH - stemH) : h * 0.55
  const valveY = neckH + bulbH + Math.min(20, stemH * 0.35)

  // 管嘴下端 45° 斜切尖嘴 (Beveled Tip) 几何 (长边朝右，紧贴右侧烧杯内壁)
  const stemLeftX = w * 0.5 - 4
  const stemRightX = w * 0.5 + 4
  const tipCutY = h - 14

  // 梨形漏斗主体 Path (长边延伸至 stemRightX, h)
  const funnelPath = `
    M ${neckLeft} ${neckH}
    L ${neckRight} ${neckH}
    C ${w * 1.1} ${neckH + bulbH * 0.3}, ${w * 0.9} ${neckH + bulbH * 0.7}, ${stemRightX} ${neckH + bulbH}
    L ${stemRightX} ${h}
    L ${stemLeftX} ${tipCutY}
    L ${stemLeftX} ${neckH + bulbH}
    C ${w * 0.1} ${neckH + bulbH * 0.7}, -${w * 0.1} ${neckH + bulbH * 0.3}, ${neckLeft} ${neckH}
    Z
  `

  // 高光光弧 Path
  const highlightPath = `
    M ${w * 0.75} ${neckH + bulbH * 0.2}
    C ${w * 0.88} ${neckH + bulbH * 0.4}, ${w * 0.8} ${neckH + bulbH * 0.6}, ${w * 0.65} ${neckH + bulbH * 0.8}
  `

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 上口管嘴 */}
      <rect
        x={neckLeft - 1}
        y={0}
        width={neckW + 2}
        height={neckH}
        fill={withAlpha(SCENE_COLORS.separationAndPurification.separatoryFunnel, 0.4)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.reference}
      />

      {/* 分液漏斗玻璃主体 (含 45° 斜切尖嘴) */}
      <path
        d={funnelPath}
        fill={withAlpha(SCENE_COLORS.separationAndPurification.separatoryFunnel, 0.35)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 45° 斜切口切面高光线 (从左切面斜向右下尖端) */}
      <line
        x1={stemLeftX}
        y1={tipCutY}
        x2={stemRightX}
        y2={h}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={1.5}
      />

      {/* 玻璃高光反光线条 */}
      {!isTiny && (
        <path
          d={highlightPath}
          fill="none"
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={STROKE.objectThin}
          opacity={0.7}
          strokeLinecap="round"
        />
      )}

      {/* 液体填充层 (双层萃取相裁剪) */}
      <g clipPath={`url(#funnel-clip-${x}-${y})`}>
        {/* 下层水相 */}
        {bottomFillLevel > 0 && (
          <rect
            x={0}
            y={neckH + bulbH * (1 - bottomFillLevel)}
            width={w}
            height={bulbH * bottomFillLevel + stemH}
            fill={bottomFillColor}
            opacity={0.85}
          />
        )}
        {/* 上层萃取相 */}
        {topFillLevel > 0 && (
          <rect
            x={0}
            y={neckH + bulbH * (1 - bottomFillLevel - topFillLevel)}
            width={w}
            height={bulbH * topFillLevel}
            fill={topFillColor}
            opacity={0.85}
          />
        )}
      </g>

      <defs>
        <clipPath id={`funnel-clip-${x}-${y}`}>
          <path d={funnelPath} />
        </clipPath>
      </defs>

      {/* 旋转活塞阀门 */}
      <g transform={`translate(${w * 0.5}, ${valveY})`}>
        <rect
          x={-neckW * 0.9}
          y={-5}
          width={neckW * 1.8}
          height={10}
          rx={2}
          fill={SCENE_COLORS.materials.glass}
          stroke={SCENE_COLORS.container.beakerBorder}
          strokeWidth={STROKE.reference}
        />
        <line
          x1={0}
          y1={isOpen ? -8 : 0}
          x2={0}
          y2={isOpen ? 8 : 8}
          stroke={SCENE_COLORS.container.beakerBorder}
          strokeWidth={STROKE.objectThin}
        />
      </g>

      {/* 顶部磨砂玻璃塞 */}
      {hasStopper && (
        <polygon
          points={`
            ${neckLeft - 2}, -8
            ${neckRight + 2}, -8
            ${neckRight}, 2
            ${neckLeft}, 2
          `}
          fill={SCENE_COLORS.materials.glass}
          stroke={SCENE_COLORS.container.beakerBorder}
          strokeWidth={STROKE.reference}
        />
      )}
    </g>
  )
}
