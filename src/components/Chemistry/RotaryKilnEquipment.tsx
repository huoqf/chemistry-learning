import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface RotaryKilnEquipmentProps {
  /** 设备左上角 x（设计坐标） */
  x: number
  /** 设备左上角 y（设计坐标） */
  y: number
  /** 设备宽度/长度（设计单位，默认 160） */
  width?: number
  /** 设备高度（设计单位，默认 80） */
  height?: number
  /** 运行状态：'idle' 待机 | 'running' 旋转热解中 */
  status?: 'idle' | 'running'
  /** 标注标题 */
  title?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * RotaryKilnEquipment — 回转窑组件（高考化工流程）
 *
 * 适用高考化工场景：
 * - 水泥工业、钛白粉生产、水泥窑协同处置、钛铁矿高温还原/分解
 * - 高考常见特征：微倾斜旋转长筒体，物料从高端加，逆流热气从低端进
 *
 * 颜色：`SCENE_COLORS.industrialEquipment.roastingFurnace`
 * 倾角：-4° 倾斜下下沉
 *
 * @example
 * ```tsx
 * <RotaryKilnEquipment
 *   x={250} y={150} width={160} height={80}
 *   status="running" title="回转窑" font={font}
 * />
 * ```
 */
export function RotaryKilnEquipment({
  x,
  y,
  width = 160,
  height = 80,
  title = '回转窑',
  font = (n) => n,
}: RotaryKilnEquipmentProps) {
  const w = width
  const h = height
  const isTiny = w < 50

  const kilnLen = w * 0.75
  const kilnRadius = h * 0.22
  const cx = w * 0.5
  const cy = h * 0.45

  return (
    <g transform={`translate(${x}, ${y})`} id="rotary-kiln">
      {/* 1. 底部混凝土支墩与支撑托轮 (Riding Rollers with Pier) */}
      <g id="kiln-supports">
        {/* 左托轮墩与双轮 */}
        <rect x={cx - kilnLen * 0.3 - 10} y={cy + kilnRadius + 14} width={20} height={h - (cy + kilnRadius + 14)} fill={SCENE_COLORS.materials.iron} rx={1} />
        <circle
          cx={cx - kilnLen * 0.3}
          cy={cy + kilnRadius + 10}
          r={Math.max(6, h * 0.1)}
          fill={SCENE_COLORS.materials.metal}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={1.5}
        />
        {/* 右托轮墩与双轮 */}
        <rect x={cx + kilnLen * 0.3 - 10} y={cy + kilnRadius + 14} width={20} height={h - (cy + kilnRadius + 14)} fill={SCENE_COLORS.materials.iron} rx={1} />
        <circle
          cx={cx + kilnLen * 0.3}
          cy={cy + kilnRadius + 10}
          r={Math.max(6, h * 0.1)}
          fill={SCENE_COLORS.materials.metal}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={1.5}
        />
      </g>

      {/* 2. 倾斜筒身 group (倾角 -4°) */}
      <g transform={`rotate(-4, ${cx}, ${cy})`}>
        {/* 筒身主体 */}
        <rect
          x={cx - kilnLen * 0.5}
          y={cy - kilnRadius}
          width={kilnLen}
          height={kilnRadius * 2}
          rx={4}
          fill={SCENE_COLORS.industrialEquipment.roastingFurnace}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={STROKE.objectLine}
        />
        {/* 筒身上方金属反光光带 */}
        <line
          x1={cx - kilnLen * 0.48}
          y1={cy - kilnRadius + 4}
          x2={cx + kilnLen * 0.48}
          y2={cy - kilnRadius + 4}
          stroke={SCENE_COLORS.materials.metalSheen}
          strokeWidth={1.5}
          opacity={0.6}
        />

        {/* 筒身传动大齿圈与轮带 (Tyres & Girth Gear) */}
        {!isTiny && (
          <g>
            {/* 左轮带 */}
            <rect
              x={cx - kilnLen * 0.32}
              y={cy - kilnRadius - 2.5}
              width={10}
              height={kilnRadius * 2 + 5}
              rx={1}
              fill={SCENE_COLORS.materials.iron}
              stroke={SCENE_COLORS.materials.metalBorder}
              strokeWidth={1}
            />
            {/* 中央大齿圈 */}
            <rect
              x={cx - 6}
              y={cy - kilnRadius - 3.5}
              width={12}
              height={kilnRadius * 2 + 7}
              rx={1}
              fill={SCENE_COLORS.materials.metalBorder}
              stroke={SCENE_COLORS.materials.metalSheen}
              strokeWidth={0.8}
            />
            {/* 右轮带 */}
            <rect
              x={cx + kilnLen * 0.28}
              y={cy - kilnRadius - 2.5}
              width={10}
              height={kilnRadius * 2 + 5}
              rx={1}
              fill={SCENE_COLORS.materials.iron}
              stroke={SCENE_COLORS.materials.metalBorder}
              strokeWidth={1}
            />
          </g>
        )}

        {/* 3. 左端进料窑尾罩 (Feed Hood) */}
        <path
          d={`
            M ${cx - kilnLen * 0.5 - 14} ${cy - kilnRadius - 10}
            L ${cx - kilnLen * 0.5} ${cy - kilnRadius}
            L ${cx - kilnLen * 0.5} ${cy + kilnRadius}
            L ${cx - kilnLen * 0.5 - 14} ${cy + kilnRadius + 10}
            Z
          `}
          fill={SCENE_COLORS.materials.metal}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={STROKE.objectThin}
        />

        {/* 4. 右端出料窑头罩 (Discharge Hood & Burner) */}
        <path
          d={`
            M ${cx + kilnLen * 0.5 + 14} ${cy - kilnRadius - 10}
            L ${cx + kilnLen * 0.5} ${cy - kilnRadius}
            L ${cx + kilnLen * 0.5} ${cy + kilnRadius}
            L ${cx + kilnLen * 0.5 + 14} ${cy + kilnRadius + 10}
            Z
          `}
          fill={SCENE_COLORS.materials.metal}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={STROKE.objectThin}
        />
      </g>

      {/* 5. 标题 */}
      {title && !isTiny && (
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fontSize={font(FONT.small)}
          fill="white"
          fontWeight="bold"
        >
          {title}
        </text>
      )}
    </g>
  )
}
