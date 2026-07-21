import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface KippApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 90） */
  width?: number
  /** 器材高度（设计单位，默认 200） */
  height?: number
  /** 活塞开关：true 开启(制气中)，false 关闭(自动停止) */
  isOpen?: boolean
  /** 气体名称标识（如 "H₂" / "CO₂"） */
  gasLabel?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * KippApparatus — 启普发生器组件
 *
 * 适用高中化学场景与高考考点：
 * - 块状固体与液体常温制气（H₂、CO₂、H₂S），高考必考“随关随停”原理
 * - 特征：中球内带多孔筛板（置放锌粒/石灰石），关活塞时气压将酸液压入下球与上漏斗，使固液分离自动停止反应
 */
export function KippApparatus({
  x,
  y,
  width = 90,
  height = 200,
  isOpen = true,
  gasLabel = 'H₂',
  font = (n) => n,
}: KippApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 40

  const cx = w * 0.5
  const sphereR = w * 0.35

  const topY = sphereR + 10
  const midY = h * 0.5
  const botY = h - sphereR - 10

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 上球 (加酸长颈漏斗) */}
      <circle
        cx={cx}
        cy={topY}
        r={sphereR * 0.8}
        fill={withAlpha(SCENE_COLORS.reactionAndGas.kippApparatus, 0.4)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
      />
      {/* 贯穿的长管 */}
      <line
        x1={cx}
        y1={topY}
        x2={cx}
        y2={botY}
        stroke={SCENE_COLORS.tube.glass}
        strokeWidth={STROKE.objectThin}
      />

      {/* 中球 (反应室) */}
      <circle
        cx={cx}
        cy={midY}
        r={sphereR}
        fill={withAlpha(SCENE_COLORS.reactionAndGas.kippApparatus, 0.4)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 中球带孔筛板 (高考特征：支撑块状固体) */}
      {!isTiny && (
        <line
          x1={cx - sphereR * 0.8}
          y1={midY + sphereR * 0.4}
          x2={cx + sphereR * 0.8}
          y2={midY + sphereR * 0.4}
          stroke={SCENE_COLORS.materials.iron}
          strokeWidth={STROKE.reference}
          strokeDasharray="3 2"
        />
      )}

      {/* 中球块状固体 (Zn 粒 / 石灰石) */}
      {!isTiny && (
        <g fill={SCENE_COLORS.materials.iron} opacity={0.75}>
          <rect x={cx - 12} y={midY - 2} width={8} height={8} rx={1} />
          <rect x={cx + 4} y={midY - 4} width={9} height={9} rx={1} />
          <rect x={cx - 4} y={midY + 4} width={7} height={7} rx={1} />
        </g>
      )}

      {/* 下球 (贮液室) */}
      <circle
        cx={cx}
        cy={botY}
        r={sphereR}
        fill={withAlpha(SCENE_COLORS.reactionAndGas.kippApparatus, 0.5)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 侧面出气管与活塞 */}
      <g transform={`translate(${cx + sphereR}, ${midY})`}>
        <path
          d={`M 0 0 L 20 0 L 20 -20`}
          fill="none"
          stroke={SCENE_COLORS.tube.glass}
          strokeWidth={STROKE.objectThin}
        />
        {/* 活塞 */}
        <circle
          cx={10}
          cy={0}
          r={4}
          fill={isOpen ? SCENE_COLORS.reagent.acid : SCENE_COLORS.materials.rubber}
        />
      </g>

      {/* 气体标识 */}
      {gasLabel && !isTiny && (
        <text
          x={cx}
          y={topY + 4}
          textAnchor="middle"
          fontSize={font(FONT.annotation)}
          fill={SCENE_COLORS.labels.chemicalFormula}
          fontWeight="bold"
        >
          {gasLabel}
        </text>
      )}
    </g>
  )
}
