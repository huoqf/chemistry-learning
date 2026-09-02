import { SCENE_COLORS, STROKE } from '@/theme'
import type { FontScaler } from '@/theme'

export interface IronSupportApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 100） */
  width?: number
  /** 器材高度（设计单位，默认 240） */
  height?: number
  /** 是否带有铁夹 */
  hasClamp?: boolean
  /** 铁夹高度比例 0~1 (0 在顶部，1 在底部) */
  clampPos?: number
  /** 目标夹持设计坐标 (若提供，自动解算 clampPos) */
  targetClampPoint?: { x: number; y: number }
  /** 铁夹倾斜角度 (例如试管倾斜 6°) */
  clampAngle?: number
  /** 是否带有铁圈 */
  hasRing?: boolean
  /** 铁圈高度比例 0~1 */
  ringPos?: number
  /** 铁圈半径 */
  ringRadius?: number
  /** 底座朝向：'left' 时底座向左展开(立柱靠右，完全避开右侧酒精灯)，默认向右 */
  baseAlign?: 'left' | 'right'
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * IronSupportApparatus — 铁架台组件
 *
 * 适用高中化学场景：
 * - 支撑烧杯加热（铁圈+石棉网）、固定试管/滴定管（铁夹）
 * - 严格物理规范：立杆在左侧/后方，延伸杆伸向底座正上方，确保几何平衡。
 */
export function IronSupportApparatus({
  x,
  y,
  width = 100,
  height = 240,
  hasClamp = true,
  clampPos = 0.35,
  targetClampPoint,
  clampAngle = 0,
  hasRing = false,
  ringPos = 0.65,
  ringRadius = 35,
  baseAlign = 'right',
}: IronSupportApparatusProps) {
  const w = width
  const h = height

  const baseH = 10
  // baseAlign === 'left' 时采用紧凑型 56px 重心平衡底座；默认时为全宽底座
  const baseW = baseAlign === 'left' ? 56 : (w * 0.9)
  const baseLeft = baseAlign === 'left' ? (w - baseW) : ((w - baseW) / 2)

  const poleW = 6
  // baseAlign === 'left' 时，立柱位于底座右侧，向左仅展开 44px，完全避开右侧酒精灯与左侧边栏！
  const poleLeft = baseAlign === 'left' ? (baseLeft + baseW - 12) : (baseLeft + baseW * 0.2)
  const poleCenterX = poleLeft + poleW / 2

  // 若提供了 targetClampPoint，智能反推 clampPos
  let effectiveClampPos = clampPos
  let armLength = w * 0.45
  if (targetClampPoint) {
    const targetRelY = targetClampPoint.y - y
    effectiveClampPos = Math.max(0.05, Math.min(0.95, (targetRelY - 10) / (h - baseH - 20)))
    armLength = Math.max(20, targetClampPoint.x - (x + poleCenterX))
  }

  const clampY = 10 + (h - baseH - 20) * effectiveClampPos
  const ringY = 10 + (h - baseH - 20) * ringPos

  return (
    <g transform={`translate(${x}, ${y})`} id="iron-support">
      {/* ── 1. 铁架台底座 (深灰色重质金属底座) ── */}
      <rect
        x={baseLeft}
        y={h - baseH}
        width={baseW}
        height={baseH}
        rx={2}
        fill={SCENE_COLORS.heatingAndSupport.ironSupport}
        stroke={SCENE_COLORS.materials.iron}
        strokeWidth={STROKE.objectLine}
      />
      {/* 底座防滑垫片脚扣 */}
      <rect x={baseLeft + 4} y={h - 3} width={10} height={3} fill="#1E293B" rx={0.5} />
      <rect x={baseLeft + baseW - 14} y={h - 3} width={10} height={3} fill="#1E293B" rx={0.5} />

      {/* ── 2. 竖立铁杆 (立在底座左侧 20% 位置) ── */}
      <rect
        x={poleLeft}
        y={4}
        width={poleW}
        height={h - baseH - 4}
        rx={1}
        fill={SCENE_COLORS.heatingAndSupport.ironSupport}
        stroke={SCENE_COLORS.materials.iron}
        strokeWidth={STROKE.reference}
      />

      {/* ── 3. 铁夹 (Clamp) ── */}
      {hasClamp && (
        <g transform={`translate(${poleCenterX}, ${clampY})`}>
          {/* 万向十字螺丝扣 (Bosshead / Clamp Holder) */}
          <rect
            x={-7}
            y={-7}
            width={14}
            height={14}
            rx={2}
            fill="#334155"
            stroke="#1E293B"
            strokeWidth={1}
          />
          {/* 紧固旋钮柄 */}
          <circle cx={-9} cy={0} r={3} fill="#475569" stroke="#0F172A" strokeWidth={0.8} />

          {/* 横向延伸金属臂 */}
          <line
            x1={0}
            y1={0}
            x2={armLength}
            y2={0}
            stroke={SCENE_COLORS.heatingAndSupport.ironRing}
            strokeWidth={STROKE.objectLine}
          />

          {/* 教材标准两爪夹 (Prong Clamp Jaws: 紧扣瓶颈) */}
          <g transform={`translate(${armLength}, 0) rotate(${clampAngle})`}>
            {/* 上夹爪主体与防滑胶套 (紧贴瓶颈上半弧) */}
            <path
              d="M -6,-2 L 0,-10 L 14,-13"
              fill="none"
              stroke="#334155"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 2,-10 L 14,-13"
              fill="none"
              stroke="#7F1D1D" // 暗红褐色防滑胶套
              strokeWidth={4.5}
              strokeLinecap="round"
            />

            {/* 下夹爪主体与防滑胶套 (紧贴瓶颈下半弧) */}
            <path
              d="M -6,2 L 0,10 L 14,13"
              fill="none"
              stroke="#334155"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 2,10 L 14,13"
              fill="none"
              stroke="#7F1D1D"
              strokeWidth={4.5}
              strokeLinecap="round"
            />

            {/* 铁夹中轴调节螺母 */}
            <rect x={-4} y={-5} width={5} height={10} rx={1} fill="#475569" stroke="#1E293B" strokeWidth={0.8} />
          </g>
        </g>
      )}

      {/* ── 4. 铁圈 (Iron Ring) ── */}
      {hasRing && (
        <g transform={`translate(${poleCenterX}, ${ringY})`}>
          {/* 螺丝固定扣 */}
          <rect
            x={-6}
            y={-6}
            width={12}
            height={12}
            rx={2}
            fill={SCENE_COLORS.heatingAndSupport.ironRing}
          />
          {/* 横杆 */}
          <line
            x1={0}
            y1={0}
            x2={w * 0.3}
            y2={0}
            stroke={SCENE_COLORS.heatingAndSupport.ironRing}
            strokeWidth={STROKE.objectLine}
          />
          {/* 铁圈环 */}
          <ellipse
            cx={w * 0.3 + ringRadius * 0.6}
            cy={0}
            rx={ringRadius * 0.6}
            ry={ringRadius * 0.25}
            fill="none"
            stroke={SCENE_COLORS.heatingAndSupport.ironRing}
            strokeWidth={STROKE.objectLine}
          />
        </g>
      )}
    </g>
  )
}

