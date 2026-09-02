import { SCENE_COLORS, STROKE, withAlpha } from '@/theme'

export interface GasWashingBottleApparatusProps {
  /** 器材左上角 x */
  x: number
  /** 器材左上角 y */
  y: number
  /** 器材宽度（默认 90） */
  width?: number
  /** 器材高度（默认 140） */
  height?: number
  /** 试剂/填充物类型：'acid' 浓硫酸 | 'base' NaOH溶液 | 'silica' 变色硅胶 | 'water' 澄清石灰水/水 */
  reagentType?: 'acid' | 'base' | 'silica' | 'water'
  /** 液体/填充物填充高度比例 0~1 (默认 0.35) */
  fillLevel?: number
  /** 是否产生气体泡 (洗气通过时) */
  bubbling?: boolean
  /** 是否管路接反 (true=短进长出/右长左短反转，极易导致喷溅) */
  reversed?: boolean
  /** 气体名称/说明 */
  label?: string
  /** 是否为末端尾气吸收瓶 (true 时只呈现进气长管与短排气孔，杜绝双出导管打架) */
  isTailGas?: boolean
}

/**
 * GasWashingBottleApparatus — 高中化学教材标准洗气瓶组件
 *
 * 严格按照高中化学教材标准绘制：
 * - 平底稳立桌面 + 圆柱瓶身 + 优雅瓶肩收口 + 垂直瓶颈 + 加厚磨砂瓶唇
 * - 内嵌标准倒梯形双孔橡皮塞（下半截塞入瓶颈，绝不悬空）
 * - 遵守“长进短出”原理（长管深入液面下 80% 深度，短管悬于液面上方）
 * - 导管外露顶端统一为 Y = -10，与全系统跨器材水平主导管线 100% 精确对齐
 */
export function GasWashingBottleApparatus({
  x,
  y,
  width = 90,
  height = 140,
  reagentType = 'acid',
  fillLevel = 0.4,
  bubbling = false,
  reversed = false,
  isTailGas = false,
}: GasWashingBottleApparatusProps) {
  const w = width
  const h = height
  const cx = w * 0.5

  // ── 几何尺寸标定（人教版教材标准广口洗气瓶黄金比例）──
  const neckW = Math.round(w * 0.38)       // 瓶颈宽约 34px (38% 挺拔比例)
  const neckLeft = (w - neckW) / 2
  const neckRight = neckLeft + neckW
  const lipW = neckW + 6                   // 瓶唇外翻凸缘宽 40px
  const lipLeft = (w - lipW) / 2
  const lipRight = lipLeft + lipW

  const lipTopY = 8                        // 磨砂瓶口顶端 Y
  const lipBottomY = 12                    // 瓶口外翻底端 Y
  const neckBottomY = 28                   // 瓶颈垂直段底部/瓶肩起点 Y
  const shoulderBottomY = 48               // 瓶肩结束/直壁起点 Y
  const bodyBottomY = h                    // 瓶底贴实验桌面
  const wallT = 3                          // 玻璃壁厚度

  // 导管孔位：严格位于瓶颈塞孔内（距中心左右各 6px，完全在瓶颈内，绝不刺穿瓶肩）
  const holeLeftX = cx - 7
  const holeRightX = cx + 7

  // 动态长短管 X 坐标（reversed 为 true 时两管对调）
  const longTubeX = reversed ? holeRightX : holeLeftX
  const shortTubeX = reversed ? holeLeftX : holeRightX

  // 导管插入深度：长管直达距瓶底 12px，短管深入瓶颈下方 16px
  const longTubeBottomY = h - 12
  const shortTubeBottomY = shoulderBottomY + 8

  // 导管顶端：藏于橡皮塞内部 (lipTopY - 2)，外部连线直接插入塞孔对接，空中零接缝！
  const tubeTopY = lipTopY - 2

  // 填充颜色计算
  let fillColor = withAlpha(SCENE_COLORS.reagent.acid, 0.4)
  if (reagentType === 'base') {
    fillColor = withAlpha(SCENE_COLORS.reagent.base, 0.35)
  } else if (reagentType === 'water') {
    fillColor = withAlpha(SCENE_COLORS.materials.glass, 0.35)
  }

  // 洗液液面高度
  const liquidH = (h - shoulderBottomY - wallT) * Math.min(0.8, Math.max(0.2, fillLevel))
  const liquidY = h - wallT - liquidH

  // 肩部椭圆弧半径（饱满外凸）
  const shoulderRx = w - neckRight
  const shoulderRy = shoulderBottomY - neckBottomY

  return (
    <g transform={`translate(${x}, ${y})`} id="gas-washing-bottle-apparatus">
      {/* ── 1. 洗液层填充 ── */}
      {reagentType !== 'silica' ? (
        <g id="wash-solution">
          <path
            d={`
              M ${wallT} ${liquidY}
              L ${w - wallT} ${liquidY}
              L ${w - wallT} ${bodyBottomY - wallT}
              L ${wallT} ${bodyBottomY - wallT}
              Z
            `}
            fill={fillColor}
            opacity={0.85}
          />
          {/* 液体凹液面高光 */}
          <line
            x1={wallT + 1}
            y1={liquidY}
            x2={w - wallT - 1}
            y2={liquidY}
            stroke={fillColor}
            strokeWidth={1.5}
            opacity={0.95}
          />
        </g>
      ) : (
        /* 变色硅胶颗粒 */
        <rect
          x={wallT}
          y={liquidY}
          width={w - wallT * 2}
          height={liquidH}
          fill={SCENE_COLORS.desiccantAndIndicator.silicaBlue}
          opacity={0.7}
          rx={2}
        />
      )}

      {/* ── 2. 广口瓶玻璃外壁轮廓（平底 + 圆柱身 + 饱满外凸圆弧肩 + 竖直颈 + 磨砂唇） ── */}
      <path
        d={`
          M ${lipLeft} ${lipTopY}
          L ${lipRight} ${lipTopY}
          L ${lipRight} ${lipBottomY}
          L ${neckRight} ${lipBottomY}
          L ${neckRight} ${neckBottomY}
          A ${shoulderRx} ${shoulderRy} 0 0 1 ${w} ${shoulderBottomY}
          L ${w} ${bodyBottomY - 2}
          Q ${w} ${bodyBottomY}, ${w - 3} ${bodyBottomY}
          L 3 ${bodyBottomY}
          Q 0 ${bodyBottomY}, 0 ${bodyBottomY - 2}
          L 0 ${shoulderBottomY}
          A ${shoulderRx} ${shoulderRy} 0 0 1 ${neckLeft} ${neckBottomY}
          L ${neckLeft} ${lipBottomY}
          L ${lipLeft} ${lipBottomY}
          Z
        `}
        fill={withAlpha(SCENE_COLORS.materials.glass, 0.28)}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={STROKE.objectLine}
        strokeLinejoin="round"
      />

      {/* 瓶口加厚磨砂凸缘双线 */}
      <rect
        x={lipLeft}
        y={lipTopY}
        width={lipW}
        height={lipBottomY - lipTopY}
        fill={withAlpha(SCENE_COLORS.materials.glass, 0.5)}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={STROKE.reference}
      />

      {/* ── 3. 内部玻璃导管系统（绘制在塞子下方/后方，端点完全被塞子遮蔽） ── */}
      <g id="wash-tubes">
        {/* 长导管（废气深入液面吸收：外壁 6px / 高光空腔 3px） */}
        <line
          x1={longTubeX}
          y1={tubeTopY}
          x2={longTubeX}
          y2={longTubeBottomY}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={6}
          strokeLinecap="square"
        />
        <line
          x1={longTubeX}
          y1={tubeTopY}
          x2={longTubeX}
          y2={longTubeBottomY}
          stroke={withAlpha(SCENE_COLORS.tube.glass, 0.85)}
          strokeWidth={3}
          strokeLinecap="square"
        />

        {/* 短导管 / 通气排空口：
            - 常规洗气时：伸入瓶颈下方，向上端点在塞内
            - 尾气吸收时：仅作为排空气孔露出塞面 2px */}
        <line
          x1={shortTubeX}
          y1={isTailGas ? lipTopY - 2 : tubeTopY}
          x2={shortTubeX}
          y2={isTailGas ? neckBottomY + 4 : shortTubeBottomY}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={6}
          strokeLinecap="square"
        />
        <line
          x1={shortTubeX}
          y1={isTailGas ? lipTopY - 2 : tubeTopY}
          x2={shortTubeX}
          y2={isTailGas ? neckBottomY + 4 : shortTubeBottomY}
          stroke={withAlpha(SCENE_COLORS.tube.glass, 0.85)}
          strokeWidth={3}
          strokeLinecap="square"
        />
      </g>

      {/* ── 4. 双孔橡皮塞（倒梯形，盖在导管上层，完美遮蔽塞内对接痕迹） ── */}
      <polygon
        points={`
          ${neckLeft - 1},${lipTopY - 2}
          ${neckRight + 1},${lipTopY - 2}
          ${neckRight - 2},${neckBottomY}
          ${neckLeft + 2},${neckBottomY}
        `}
        fill={SCENE_COLORS.stopper.rubberStopper}
        stroke={SCENE_COLORS.stopper.rubberStopperBorder}
        strokeWidth={1}
      />

      {/* 塞子打孔处的导管穿出高光孔 */}
      <circle cx={longTubeX} cy={lipTopY - 2} r={3} fill="#475569" opacity={0.6} />
      <circle cx={shortTubeX} cy={lipTopY - 2} r={3} fill="#475569" opacity={0.6} />

      {/* ── 5. 洗气动态气泡粒子 (跟随长管出口底部) ── */}
      {bubbling && !reversed && (
        <g transform={`translate(${longTubeX}, ${longTubeBottomY})`}>
          <circle cx={-3} cy={-10} r={2.5} fill="#FFFFFF" opacity={0.8} />
          <circle cx={4} cy={-22} r={3.5} fill="#FFFFFF" opacity={0.8} />
          <circle cx={-1} cy={-36} r={4} fill="#FFFFFF" opacity={0.7} />
        </g>
      )}
    </g>
  )
}
