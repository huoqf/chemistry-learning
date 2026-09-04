import { SCENE_COLORS, withAlpha } from '@/theme'

export interface DropperApparatusProps {
  /** 滴管尖端中心 x 坐标（设计坐标） */
  x: number
  /** 滴管尖端 y 坐标（设计坐标，尖嘴出液口所在高度） */
  y: number
  /** 滴管玻璃管身长度（不含胶头，默认 80） */
  bodyHeight?: number
  /** 滴管管身外径宽度（默认 10） */
  bodyWidth?: number
  /** 管内吸取试剂液面高度比例 (0 ~ 1) */
  liquidLevel?: number
  /** 管内试剂液体颜色 */
  liquidColor?: string
  /** 胶头是否处于挤压状态 */
  isSqueezed?: boolean
  /** 橡胶乳头颜色（默认红/暗红） */
  bulbColor?: string
  /** 是否显示滴落中的液滴动画（0~1 动画时间或进度） */
  dropProgress?: number
  /** 动态液滴颜色 */
  dropColor?: string
  /** 是否展示伸入液面下的长滴管模式 (用于 Fe(OH)₂ 防氧化等特殊操作) */
  isDeep?: boolean
}

/**
 * DropperApparatus — 胶头滴管标准化学器材组件
 *
 * 规范：
 * - 严禁纯方块粗糙拼凑，包含胶头乳头、箍颈、透明高硼硅玻璃管身、尖嘴缩口与流线液滴
 * - 符合标准实验规范：垂直悬空滴加 vs 长滴管伸入液面下滴加
 */
export function DropperApparatus({
  x,
  y,
  bodyHeight = 80,
  bodyWidth = 10,
  liquidLevel = 0.6,
  liquidColor = 'rgba(56, 189, 248, 0.4)',
  isSqueezed = false,
  bulbColor = '#EF4444',
  dropProgress = 0,
  dropColor = '#38BDF8',
  isDeep = false,
}: DropperApparatusProps) {
  const actualBodyHeight = isDeep ? bodyHeight + 40 : bodyHeight
  const bulbHeight = isSqueezed ? 20 : 26
  const bulbWidth = isSqueezed ? 18 : 16
  const tipHeight = 16

  // 滴管尖端位于 (x, y)，自底向上计算各部分 y 坐标
  const tipTipY = y
  const tipBaseY = tipTipY - tipHeight
  const bodyTopY = tipBaseY - actualBodyHeight
  const collarY = bodyTopY - 4
  const bulbTopY = collarY - bulbHeight

  const halfW = bodyWidth / 2
  const halfBulbW = bulbWidth / 2
  const tipHalfW = 2

  const liquidH = Math.max(0, Math.min(1, liquidLevel)) * (actualBodyHeight + tipHeight * 0.5)

  return (
    <g className="chem-dropper-apparatus">
      {/* 1. 胶头乳头 (Rubber Bulb) */}
      <g>
        {/* 顶部饱满胶囊弧线 */}
        <path
          d={`
            M ${x - halfBulbW} ${collarY}
            C ${x - halfBulbW - 2} ${collarY - bulbHeight * 0.4},
              ${x - halfBulbW + 1} ${bulbTopY + 2},
              ${x} ${bulbTopY}
            C ${x + halfBulbW - 1} ${bulbTopY + 2},
              ${x + halfBulbW + 2} ${collarY - bulbHeight * 0.4},
              ${x + halfBulbW} ${collarY}
            Z
          `}
          fill={bulbColor}
          stroke="#B91C1C"
          strokeWidth={1}
        />
        {/* 乳头高光 */}
        <path
          d={`
            M ${x - halfBulbW + 4} ${collarY - 4}
            C ${x - halfBulbW + 3} ${collarY - bulbHeight * 0.4},
              ${x - halfBulbW + 4} ${bulbTopY + 5},
              ${x - 2} ${bulbTopY + 3}
          `}
          fill="none"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* 橡胶套管颈圈 (Collar) */}
        <rect
          x={x - halfW - 2}
          y={collarY - 1}
          width={bodyWidth + 4}
          height={5}
          rx={1.5}
          fill="#DC2626"
          stroke="#991B1B"
          strokeWidth={0.8}
        />
      </g>

      {/* 2. 管内吸收试剂液体 (Reagent Liquid) */}
      {liquidLevel > 0 && (
        <g>
          <clipPath id={`dropper-clip-${x}-${y}`}>
            <path
              d={`
                M ${x - halfW + 1} ${bodyTopY}
                L ${x + halfW - 1} ${bodyTopY}
                L ${x + halfW - 1} ${tipBaseY}
                L ${x + tipHalfW - 0.5} ${tipTipY - 1}
                L ${x - tipHalfW + 0.5} ${tipTipY - 1}
                L ${x - halfW + 1} ${tipBaseY}
                Z
              `}
            />
          </clipPath>
          <rect
            x={x - halfW}
            y={tipTipY - liquidH}
            width={bodyWidth}
            height={liquidH}
            fill={liquidColor}
            clipPath={`url(#dropper-clip-${x}-${y})`}
          />
        </g>
      )}

      {/* 3. 玻璃管身与缩口尖嘴 (Glass Tube & Tapered Tip) */}
      <path
        d={`
          M ${x - halfW} ${bodyTopY}
          L ${x + halfW} ${bodyTopY}
          L ${x + halfW} ${tipBaseY}
          L ${x + tipHalfW} ${tipTipY}
          L ${x - tipHalfW} ${tipTipY}
          L ${x - halfW} ${tipBaseY}
          Z
        `}
        fill={withAlpha(SCENE_COLORS.materials.glass, 0.35)}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />

      {/* 玻璃左侧高光反射 */}
      <path
        d={`
          M ${x - halfW + 2} ${bodyTopY + 3}
          L ${x - halfW + 2} ${tipBaseY}
          L ${x - tipHalfW + 0.8} ${tipTipY - 2}
        `}
        fill="none"
        stroke="rgba(255, 255, 255, 0.75)"
        strokeWidth={1}
        strokeLinecap="round"
      />

      {/* 管壁微量刻度线 */}
      <line
        x1={x + halfW - 3}
        y1={bodyTopY + actualBodyHeight * 0.3}
        x2={x + halfW}
        y2={bodyTopY + actualBodyHeight * 0.3}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={0.8}
        opacity={0.6}
      />
      <line
        x1={x + halfW - 4}
        y1={bodyTopY + actualBodyHeight * 0.6}
        x2={x + halfW}
        y2={bodyTopY + actualBodyHeight * 0.6}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={0.8}
        opacity={0.6}
      />

      {/* 4. 尖嘴出液口处悬挂或滴落液滴 */}
      {dropProgress > 0 && dropProgress < 1 && (
        <g>
          {/* 正在滴落的下落液滴 1 */}
          <path
            d={`
              M ${x} ${tipTipY + 12 + ((dropProgress * 120) % 36)}
              Q ${x + 3.2} ${tipTipY + 18 + ((dropProgress * 120) % 36)} ${x} ${tipTipY + 22 + ((dropProgress * 120) % 36)}
              Q ${x - 3.2} ${tipTipY + 18 + ((dropProgress * 120) % 36)} ${x} ${tipTipY + 12 + ((dropProgress * 120) % 36)}
              Z
            `}
            fill={dropColor}
            opacity={0.9}
          />
          {/* 下落液滴 2 (微小尾随液滴) */}
          <circle
            cx={x}
            cy={tipTipY + 6 + (((dropProgress * 120) + 18) % 36)}
            r={2}
            fill={dropColor}
            opacity={0.6}
          />
        </g>
      )}
      {/* 未滴落时管口的微小湿润液珠 */}
      {dropProgress === 0 && liquidLevel > 0 && (
        <circle cx={x} cy={tipTipY + 1.5} r={1.8} fill={dropColor} opacity={0.7} />
      )}
    </g>
  )
}
