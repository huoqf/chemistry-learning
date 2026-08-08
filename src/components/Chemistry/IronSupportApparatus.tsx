import { SCENE_COLORS, STROKE } from '@/theme'
import type { FontScaler } from '@/theme'

export interface IronSupportPorts {
  /** 铁夹爪卡扣尖端位置 */
  clampTipPos: { x: number; y: number }
  /** 铁圈托环中心位置 */
  ringCenterPos: { x: number; y: number }
  /** 铁架台底座中心 */
  baseCenterPos: { x: number; y: number }
}

/**
 * 静态计算铁架台组件的关键连接锚点 (Design Space)
 */
export function getIronSupportPorts(
  x: number,
  y: number,
  width = 100,
  height = 240,
  clampPos = 0.35,
  ringPos = 0.65,
  ringRadius = 35
): IronSupportPorts {
  const baseH = 14
  const baseW = width * 0.9
  const baseLeft = (width - baseW) / 2
  const poleW = 6
  const poleLeft = baseLeft + baseW * 0.2

  const clampY = y + 10 + (height - baseH - 20) * clampPos
  const ringY = y + 10 + (height - baseH - 20) * ringPos

  return {
    clampTipPos: { x: x + poleLeft + poleW / 2 + width * 0.45, y: clampY },
    ringCenterPos: { x: x + poleLeft + poleW / 2 + width * 0.3 + ringRadius * 0.6, y: ringY },
    baseCenterPos: { x: x + width * 0.5, y: y + height - baseH / 2 },
  }
}

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
}: IronSupportApparatusProps) {
  const w = width
  const h = height

  const baseH = 14
  const baseW = w * 0.9
  const baseLeft = (w - baseW) / 2

  const poleW = 6
  const poleLeft = baseLeft + baseW * 0.2
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

          {/* 橡皮包覆双叉夹爪 (Prong Clamp Jaws) */}
          <g transform={`translate(${armLength}, 0) rotate(${clampAngle})`}>
            {/* 上夹爪 (带红色/黑色防滑胶套) */}
            <path
              d="M -12,-4 C -4,-14 6,-14 12,-10"
              fill="none"
              stroke="#334155"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <path
              d="M 2,-14 C 6,-14 10,-13 12,-10"
              fill="none"
              stroke="#991B1B" // 黑色/红色防滑胶套
              strokeWidth={4.5}
              strokeLinecap="round"
            />

            {/* 下夹爪 */}
            <path
              d="M -12,4 C -4,14 6,14 12,10"
              fill="none"
              stroke="#334155"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <path
              d="M 2,14 C 6,14 10,13 12,10"
              fill="none"
              stroke="#991B1B"
              strokeWidth={4.5}
              strokeLinecap="round"
            />

            {/* 夹爪调节螺栓 */}
            <rect x={-8} y={-4} width={4} height={8} rx={1} fill="#64748B" />
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

