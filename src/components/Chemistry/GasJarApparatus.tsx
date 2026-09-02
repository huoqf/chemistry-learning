import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

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
  /** 内部洗液/气体颜色 */
  fillColor?: string
  /** 是否盖有毛玻璃片 */
  hasCover?: boolean
  /** 是否配有洗气/除杂双玻璃导管 */
  hasTubes?: boolean
  /** 导管进出模式：'long-in-short-out' (默认, 向上排空气/洗气: 左长右短) | 'short-in-long-out' (向下排空气: 左短右长) */
  tubeMode?: 'long-in-short-out' | 'short-in-long-out'
  /** 是否有后续尾气吸收装置 (false 时短出气管仅微露塞面 2px 作为排气孔) */
  hasTailGas?: boolean
  /** 气体名称标注（如 "Cl₂" / "O₂"） */
  gasLabel?: string
  /** 是否为干瓶排空气法收集气体 (true 时全瓶充盈半透明气体，绝不画底部溶液块) */
  isGasCollection?: boolean
  /** 是否为倒扣模式 (用于排水集气等倒扣广口瓶场景) */
  inverted?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * GasJarApparatus — 高中化学教材标准广口集气瓶组件
 *
 * 严格按照高中化学教科书与高考实验试题标准绘制：
 * 1. 平底稳立台面 + 圆柱瓶身 + 优雅圆弧瓶肩（Shoulder）收口 + 垂直瓶颈（Neck） + 加厚磨砂瓶唇（Lip）
 * 2. 真实嵌在瓶颈内部的标准倒梯形橡皮塞（Rubber Stopper）
 * 3. 玻璃导管严格从橡皮塞孔垂直贯穿进入，杜绝刺穿瓶肩
 * 4. 干瓶排空气收集：彻底消除底部溶液块和气泡，整瓶充满半透明气体色
 */
export function GasJarApparatus({
  x,
  y,
  width = 70,
  height = 110,
  fillLevel = 0,
  fillColor = SCENE_COLORS.reagent.solution,
  hasCover = false,
  hasTubes = true,
  tubeMode = 'long-in-short-out',
  hasTailGas = true,
  gasLabel,
  isGasCollection = true,
  inverted = false,
  font = (n) => n,
}: GasJarApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 40
  const cx = w * 0.5

  // ── 几何尺寸标定（完全符合人教版教材广口瓶黄金比例）──
  const neckW = Math.round(w * 0.42)      // 瓶颈宽约 30px (42% 挺拔比例)
  const neckLeft = (w - neckW) / 2
  const neckRight = neckLeft + neckW
  const lipW = neckW + 6                  // 瓶唇外翻凸缘宽 36px
  const lipLeft = (w - lipW) / 2
  const lipRight = lipLeft + lipW

  const lipTopY = 6                       // 磨砂瓶唇顶端 Y
  const lipBottomY = 10                   // 磨砂瓶唇底端 Y
  const neckBottomY = 24                  // 瓶颈垂直段底部 / 瓶肩拱起点 Y
  const shoulderBottomY = 42              // 瓶肩结束 / 瓶身直壁起点 Y
  const bodyBottomY = h                   // 瓶底贴实验桌面
  const wallT = 3                         // 玻璃壁厚度

  // 导管孔位：严格位于瓶颈塞孔内（距中心左右各 6px，完全在瓶颈内，绝不穿刺瓶肩）
  const holeLeftX = cx - 6
  const holeRightX = cx + 6

  // 导管插入深度：长管直达距瓶底 10px，短管仅深入瓶颈下方 12px
  const longTubeBottomY = h - 10
  const shortTubeBottomY = shoulderBottomY - 4

  const isLongIn = tubeMode === 'long-in-short-out'
  const leftBottomY = isLongIn ? longTubeBottomY : shortTubeBottomY
  const rightBottomY = isLongIn ? shortTubeBottomY : longTubeBottomY

  // 导管顶端：藏于橡皮塞内部 (lipTopY - 2)，外部连线直接插入塞孔对接，空中零接缝！
  const tubeTopY = lipTopY - 2

  // 肩部椭圆弧半径（饱满外凸）
  const shoulderRx = w - neckRight
  const shoulderRy = shoulderBottomY - neckBottomY

  // 标准教材瓶体内腔路径（饱满外拱肩剪裁）
  const innerGlassPath = `
    M ${neckLeft + wallT} ${neckBottomY}
    A ${shoulderRx - wallT} ${shoulderRy - wallT} 0 0 0 ${wallT} ${shoulderBottomY}
    L ${wallT} ${bodyBottomY - wallT}
    L ${w - wallT} ${bodyBottomY - wallT}
    L ${w - wallT} ${shoulderBottomY}
    A ${shoulderRx - wallT} ${shoulderRy - wallT} 0 0 0 ${neckRight - wallT} ${neckBottomY}
    Z
  `

  return (
    <g transform={inverted ? `translate(${x + w}, ${y + h}) rotate(180)` : `translate(${x}, ${y})`} id="gas-jar-apparatus">
      {/* ── 1. 气体/液体充盈层 ── */}
      {fillLevel > 0 && (
        isGasCollection ? (
          // 干瓶排空气法收集气体：整瓶充盈半透明气体色
          <path
            d={innerGlassPath}
            fill={fillColor}
            opacity={Math.min(0.9, fillLevel * 0.9)}
          />
        ) : (
          // 洗液/湿法模式（非干瓶）：底部溶液
          <rect
            x={wallT}
            y={h - wallT - (h - shoulderBottomY) * fillLevel}
            width={w - wallT * 2}
            height={(h - shoulderBottomY) * fillLevel}
            fill={fillColor}
            opacity={0.8}
            rx={1}
          />
        )
      )}

      {/* ── 2. 集气瓶玻璃外壁轮廓（平底 + 圆柱身 + 饱满外凸圆弧肩 + 竖直颈 + 加厚磨砂唇） ── */}
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

      {/* 瓶口磨砂嘴双线加厚 */}
      <rect
        x={lipLeft}
        y={lipTopY}
        width={lipW}
        height={lipBottomY - lipTopY}
        fill={withAlpha(SCENE_COLORS.materials.glass, 0.45)}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={STROKE.reference}
      />

      {/* ── 3. 玻璃导管系统（绘制在塞子下层，顶端被塞子完全覆盖隐形） ── */}
      {hasTubes && (
        <g id="gasjar-tubes">
          {/* 左导管（外壁 6px / 高光空腔 3px） */}
          <line
            x1={holeLeftX}
            y1={tubeTopY}
            x2={holeLeftX}
            y2={leftBottomY}
            stroke={SCENE_COLORS.materials.glassBorder}
            strokeWidth={6}
            strokeLinecap="square"
          />
          <line
            x1={holeLeftX}
            y1={tubeTopY}
            x2={holeLeftX}
            y2={leftBottomY}
            stroke={withAlpha(SCENE_COLORS.tube.glass, 0.85)}
            strokeWidth={3}
            strokeLinecap="square"
          />

          {/* 右导管（外壁 6px / 高光空腔 3px）：若无后续尾气，仅作为安全排气孔微穿塞体 */}
          <line
            x1={holeRightX}
            y1={tubeTopY}
            x2={holeRightX}
            y2={!hasTailGas && isLongIn ? neckBottomY + 4 : rightBottomY}
            stroke={SCENE_COLORS.materials.glassBorder}
            strokeWidth={6}
            strokeLinecap="square"
          />
          <line
            x1={holeRightX}
            y1={tubeTopY}
            x2={holeRightX}
            y2={!hasTailGas && isLongIn ? neckBottomY + 4 : rightBottomY}
            stroke={withAlpha(SCENE_COLORS.tube.glass, 0.85)}
            strokeWidth={3}
            strokeLinecap="square"
          />
        </g>
      )}
        {/* ── 4. 双孔橡皮塞（倒梯形，覆盖在导管上方，完美隐藏塞内对接头） ── */}
        {hasTubes && (
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
        )}

      {/* ── 5. 毛玻璃盖片（若无导管收集或盖片封存时） ── */}
      {hasCover && !hasTubes && (
        <g id="frosted-cover">
          <line
            x1={lipLeft - 5}
            y1={lipTopY - 2}
            x2={lipRight + 5}
            y2={lipTopY - 2}
            stroke={SCENE_COLORS.materials.glassBorder}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* ── 6. 气体名称居中标注 ── */}
      {gasLabel && !isTiny && (
        <text
          x={cx}
          y={shoulderBottomY + (bodyBottomY - shoulderBottomY) * 0.45}
          textAnchor="middle"
          fontSize={font(FONT.small)}
          fill={SCENE_COLORS.labels.chemicalFormula}
          fontWeight="bold"
          opacity={0.85}
        >
          {gasLabel}
        </text>
      )}
    </g>
  )
}

