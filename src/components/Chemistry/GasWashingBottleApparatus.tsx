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
}

/**
 * GasWashingBottleApparatus — 高考标准洗气瓶组件
 *
 * 特性：
 * - 遵守高考“长进短出”气流净化原理
 * - 双孔橡皮塞密封、支持 reversed 正反接长短管动态对调视效
 * - 动态支持澄清石灰水、浓硫酸、变色硅胶及洗气气泡效果
 * - 导出静态 `getGasWashingBottlePorts` 接口，解决导管组合错位问题
 */
export function GasWashingBottleApparatus({
  x,
  y,
  width = 90,
  height = 140,
  reagentType = 'acid',
  fillLevel = 0.35,
  bubbling = false,
  reversed = false,
}: GasWashingBottleApparatusProps) {
  const w = width
  const h = height

  // 几何推算
  const neckW = w * 0.4
  const neckH = 20
  const neckLeft = (w - neckW) / 2

  const bodyH = h - neckH - 10

  // 填充颜色计算
  let fillColor = withAlpha(SCENE_COLORS.reagent.acid, 0.6)
  if (reagentType === 'base') {
    fillColor = withAlpha(SCENE_COLORS.reagent.base, 0.6)
  } else if (reagentType === 'water') {
    fillColor = withAlpha(SCENE_COLORS.materials.glass, 0.7)
  }

  // 液面高度
  const liquidH = Math.min(bodyH - 10, bodyH * fillLevel)
  const liquidY = h - 10 - liquidH

  // 动态长短管 X 坐标计算 (reversed 为 true 时长短管对调)
  const longTubeX = reversed ? w * 0.7 : w * 0.3
  const shortTubeX = reversed ? w * 0.3 : w * 0.7

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 1. 广口/细口瓶主体玻璃外壳 */}
      <path
        d={`
          M ${neckLeft} 0
          L ${neckLeft + neckW} 0
          L ${neckLeft + neckW} ${neckH}
          Q ${w * 0.95} ${neckH + 5}, ${w - 4} ${neckH + 25}
          L ${w - 4} ${h - 10}
          Q ${w - 4} ${h}, ${w - 15} ${h}
          L 15 ${h}
          Q 4 ${h}, 4 ${h - 10}
          L 4 ${neckH + 25}
          Q 5 ${neckH + 5}, ${neckLeft} ${neckH}
          Z
        `}
        fill={withAlpha(SCENE_COLORS.materials.glass, 0.35)}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 2. 液体或变色硅胶填充 */}
      {reagentType === 'silica' ? (
        /* 变色硅胶颗粒 */
        <g transform={`translate(8, ${h - 12 - liquidH})`}>
          <rect
            x={0}
            y={0}
            width={w - 16}
            height={liquidH}
            fill={SCENE_COLORS.desiccantAndIndicator.silicaBlue}
            opacity={0.7}
            rx={4}
          />
          {/* 蓝/粉颗粒斑点 */}
          <circle cx={12} cy={liquidH * 0.4} r={3} fill={SCENE_COLORS.desiccantAndIndicator.silicaPink} />
          <circle cx={w * 0.4} cy={liquidH * 0.7} r={2.5} fill={SCENE_COLORS.desiccantAndIndicator.silicaBlue} />
          <circle cx={w * 0.65} cy={liquidH * 0.3} r={3} fill="#38BDF8" />
        </g>
      ) : (
        /* 洗液 / 浓硫酸 */
        liquidH > 0 && (
          <path
            d={`
              M 6 ${liquidY}
              L ${w - 6} ${liquidY}
              L ${w - 6} ${h - 10}
              Q ${w - 6} ${h - 2}, ${w - 15} ${h - 2}
              L 15 ${h - 2}
              Q 6 ${h - 2}, 6 ${h - 10}
              Z
            `}
            fill={fillColor}
          />
        )
      )}

      {/* 3. 双孔橡皮塞 */}
      <rect
        x={neckLeft + 2}
        y={2}
        width={neckW - 4}
        height={neckH - 4}
        rx={2}
        fill={SCENE_COLORS.stopper.rubberStopper}
        stroke={SCENE_COLORS.stopper.rubberStopperBorder}
        strokeWidth={1}
      />

      {/* 4. 长管：外壁 strokeWidth=6 / 内高光 strokeWidth=3，与路由连接管 100% 融为一体零补丁 */}
      <g id="wash-long-tube">
        {/* 外壁 */}
        <line
          x1={longTubeX} y1={-12}
          x2={longTubeX} y2={h - 20}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={6}
          strokeLinecap="square"
        />
        {/* 内高光 */}
        <line
          x1={longTubeX} y1={-12}
          x2={longTubeX} y2={h - 20}
          stroke={withAlpha(SCENE_COLORS.tube.glass, 0.85)}
          strokeWidth={3}
          strokeLinecap="square"
        />
      </g>

      {/* 5. 短管：外壁 strokeWidth=6 / 内高光 strokeWidth=3 */}
      <g id="wash-short-tube">
        {/* 外壁 */}
        <line
          x1={shortTubeX} y1={-12}
          x2={shortTubeX} y2={28}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={6}
          strokeLinecap="square"
        />
        {/* 内高光 */}
        <line
          x1={shortTubeX} y1={-12}
          x2={shortTubeX} y2={28}
          stroke={withAlpha(SCENE_COLORS.tube.glass, 0.85)}
          strokeWidth={3}
          strokeLinecap="square"
        />
      </g>

      {/* 6. 洗气动态气泡粒子 (跟随长管出口底部) */}
      {bubbling && (
        <g transform={`translate(${longTubeX}, ${h - 20})`}>
          <circle cx={-3} cy={-10} r={2.5} fill="none" stroke={SCENE_COLORS.materials.glassBorder} strokeWidth={1} />
          <circle cx={4} cy={-25} r={3.5} fill="none" stroke={SCENE_COLORS.materials.glassBorder} strokeWidth={1} />
          <circle cx={-1} cy={-45} r={4.5} fill="none" stroke={SCENE_COLORS.materials.glassBorder} strokeWidth={1.2} />
        </g>
      )}
    </g>
  )
}
