import { SCENE_COLORS, STROKE } from '@/theme'
import type { FontScaler } from '@/theme'

export interface TripodMeshApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 100） */
  width?: number
  /** 器材高度（设计单位，默认 110） */
  height?: number
  /** 是否带石棉网/陶土网（默认 true） */
  hasMesh?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * TripodMeshApparatus — 三脚架与石棉网组件
 *
 * 适用高中化学场景：
 * - 加热烧杯、锥形瓶时提供支撑与均匀传热
 *
 * 颜色：`SCENE_COLORS.heatingAndSupport.asbestosMesh` / `ironSupport`
 *
 * @example
 * ```tsx
 * <TripodMeshApparatus x={100} y={150} width={100} height={110} font={font} />
 * ```
 */
export function TripodMeshApparatus({
  x,
  y,
  width = 100,
  height = 110,
  hasMesh = true,
}: TripodMeshApparatusProps) {
  const w = width
  const h = height

  const topW = w * 0.8
  const topLeft = (w - topW) / 2

  const meshH = 8

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 1. 石棉网/陶土网 (如果带 mesh) */}
      {hasMesh && (
        <g>
          {/* 石棉网基板 */}
          <rect
            x={0}
            y={0}
            width={w}
            height={meshH}
            rx={2}
            fill={SCENE_COLORS.heatingAndSupport.asbestosMesh}
            stroke={SCENE_COLORS.materials.iron}
            strokeWidth={STROKE.reference}
          />
          {/* 网格纹理 */}
          <line
            x1={w * 0.2}
            y1={meshH * 0.5}
            x2={w * 0.8}
            y2={meshH * 0.5}
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={STROKE.reference}
            strokeDasharray="2 2"
          />
        </g>
      )}

      {/* 2. 三脚架顶圈 */}
      <rect
        x={topLeft}
        y={hasMesh ? meshH : 0}
        width={topW}
        height={6}
        rx={1}
        fill={SCENE_COLORS.heatingAndSupport.ironRing}
      />

      {/* 3. 支撑架腿 (左中右) */}
      <line
        x1={topLeft + 10}
        y1={hasMesh ? meshH + 6 : 6}
        x2={2}
        y2={h}
        stroke={SCENE_COLORS.heatingAndSupport.ironSupport}
        strokeWidth={STROKE.objectLine}
      />
      <line
        x1={w - topLeft - 10}
        y1={hasMesh ? meshH + 6 : 6}
        x2={w - 2}
        y2={h}
        stroke={SCENE_COLORS.heatingAndSupport.ironSupport}
        strokeWidth={STROKE.objectLine}
      />
      <line
        x1={w * 0.5}
        y1={hasMesh ? meshH + 6 : 6}
        x2={w * 0.5}
        y2={h - 5}
        stroke={SCENE_COLORS.heatingAndSupport.ironSupport}
        strokeWidth={STROKE.reference}
        opacity={0.7}
      />
    </g>
  )
}
