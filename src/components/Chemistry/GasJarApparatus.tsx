import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface GasJarPorts {
  /** 瓶口左侧导管顶部端口 */
  topStopperLeft: { x: number; y: number }
  /** 瓶口右侧导管顶部端口 */
  topStopperRight: { x: number; y: number }
}

export function getGasJarPorts(x: number, y: number, width = 70): GasJarPorts {
  const lipW = width * 0.7
  const lipLeft = (width - lipW) / 2
  return {
    topStopperLeft: { x: x + lipLeft + lipW * 0.3, y: y - 15 },
    topStopperRight: { x: x + lipLeft + lipW * 0.7, y: y - 15 },
  }
}

export interface GasJarApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 70） */
  width?: number
  /** 器材高度（设计单位，默认 110） */
  height?: number
  /** 内部洗液填充比例 0~1 (如浓硫酸或 NaOH 溶液) */
  fillLevel?: number
  /** 内部洗液颜色 */
  fillColor?: string
  /** 是否盖有毛玻璃片 */
  hasCover?: boolean
  /** 是否配有洗气/除杂双玻璃导管 */
  hasTubes?: boolean
  /** 导管进出模式：'long-in-short-out' (默认, 向上排空气/洗气: 左长右短) | 'short-in-long-out' (向下排空气: 左短右长) */
  tubeMode?: 'long-in-short-out' | 'short-in-long-out'
  /** 气体名称标注（如 "Cl₂" / "O₂"） */
  gasLabel?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * GasJarApparatus — 集气瓶/洗气瓶组件
 *
 * 适用高中化学场景：
 * - 气体收集（向上/向下排空气法、排水集气法）
 * - 气体除杂与洗气（长导管进气深入液面下，短导管出气）
 *
 * 颜色：`SCENE_COLORS.container.gasJar`
 *
 * @example
 * ```tsx
 * <GasJarApparatus
 *   x={250} y={120} width={70} height={110}
 *   fillLevel={0.4} fillColor={SCENE_COLORS.reagent.acid}
 *   hasTubes={true} gasLabel="Cl₂" font={font}
 * />
 * ```
 */
export function GasJarApparatus({
  x,
  y,
  width = 70,
  height = 110,
  fillLevel = 0,
  fillColor = SCENE_COLORS.reagent.solution,
  hasCover = false,
  hasTubes = false,
  tubeMode = 'long-in-short-out',
  gasLabel,
  font = (n) => n,
}: GasJarApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 40

  const lipW = w * 0.7
  const lipLeft = (w - lipW) / 2
  const lipRight = lipLeft + lipW

  const wallT = Math.max(2, w * 0.04)
  const innerW = w - wallT * 2

  const bodyTopY = 12
  const bodyH = h - bodyTopY

  const liquidH = (bodyH - wallT) * Math.min(1, Math.max(0, fillLevel))

  // 根据 tubeMode 决定左/右导管深入高度
  const leftTubeH = tubeMode === 'short-in-long-out' ? 25 : h - wallT - 15
  const rightTubeH = tubeMode === 'short-in-long-out' ? h - wallT - 15 : 25

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 瓶口边缘 Lip */}
      <rect
        x={lipLeft}
        y={4}
        width={lipW}
        height={8}
        rx={2}
        fill={SCENE_COLORS.container.gasJar}
        stroke={SCENE_COLORS.container.gasJarBorder}
        strokeWidth={STROKE.reference}
      />

      {/* 集气瓶瓶身 */}
      <rect
        x={0}
        y={bodyTopY}
        width={w}
        height={bodyH}
        rx={Math.max(2, w * 0.04)}
        fill={withAlpha(SCENE_COLORS.container.gasJar, 0.4)}
        stroke={SCENE_COLORS.container.gasJarBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 洗液/溶液 */}
      {fillLevel > 0 && (
        <rect
          x={wallT}
          y={h - wallT - liquidH}
          width={innerW}
          height={liquidH}
          fill={fillColor}
          opacity={0.8}
          rx={1}
        />
      )}

      {/* 毛玻璃盖片 */}
      {hasCover && (
        <line
          x1={lipLeft - 4}
          y1={3}
          x2={lipRight + 4}
          y2={3}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={STROKE.objectLine}
          strokeLinecap="round"
        />
      )}

      {/* 洗气/集气瓶双玻璃导管 (高保真带管壁粗管) */}
      {hasTubes && (
        <g id="gas-jar-tubes">
          {/* 双孔胶塞 */}
          <rect
            x={lipLeft + 2}
            y={2}
            width={lipW - 4}
            height={10}
            fill={SCENE_COLORS.materials.rubber}
            rx={1}
          />

          {/* 左导管 (进气口) */}
          <g id="left-tube">
            {/* 玻璃外轮廓线 */}
            <line
              x1={lipLeft + lipW * 0.3}
              y1={-15}
              x2={lipLeft + lipW * 0.3}
              y2={leftTubeH}
              stroke={SCENE_COLORS.materials.glassBorder}
              strokeWidth={6}
              strokeLinecap="square"
            />
            {/* 玻璃内管高光 */}
            <line
              x1={lipLeft + lipW * 0.3}
              y1={-15}
              x2={lipLeft + lipW * 0.3}
              y2={leftTubeH}
              stroke={withAlpha(SCENE_COLORS.tube.glass ?? '#E0F2FE', 0.85)}
              strokeWidth={3}
              strokeLinecap="square"
            />
          </g>

          {/* 右导管 (出气口) */}
          <g id="right-tube">
            {/* 玻璃外轮廓线 */}
            <line
              x1={lipLeft + lipW * 0.7}
              y1={-15}
              x2={lipLeft + lipW * 0.7}
              y2={rightTubeH}
              stroke={SCENE_COLORS.materials.glassBorder}
              strokeWidth={6}
              strokeLinecap="square"
            />
            {/* 玻璃内管高光 */}
            <line
              x1={lipLeft + lipW * 0.7}
              y1={-15}
              x2={lipLeft + lipW * 0.7}
              y2={rightTubeH}
              stroke={withAlpha(SCENE_COLORS.tube.glass ?? '#E0F2FE', 0.85)}
              strokeWidth={3}
              strokeLinecap="square"
            />
          </g>
        </g>
      )}

      {/* 气体名称/状态标识 */}
      {gasLabel && !isTiny && (
        <text
          x={w * 0.5}
          y={bodyTopY + bodyH * 0.4}
          textAnchor="middle"
          fontSize={font(FONT.small)}
          fill={SCENE_COLORS.labels.chemicalFormula}
          fontWeight="bold"
          opacity={0.7}
        >
          {gasLabel}
        </text>
      )}
    </g>
  )
}
