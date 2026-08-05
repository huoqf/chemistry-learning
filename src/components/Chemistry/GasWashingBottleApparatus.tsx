import { SCENE_COLORS, STROKE, FONT, withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'

export interface GasWashingBottlePorts {
  /** 长进气管入口 (洗气瓶左上方) */
  inletPort: { x: number; y: number }
  /** 短出气管出口 (洗气瓶右上方) */
  outletPort: { x: number; y: number }
  /** 橡皮塞顶部中心 */
  topNeckPort: { x: number; y: number }
  /** 洗气瓶底部中心 */
  bottomPort: { x: number; y: number }
}

/**
 * 静态计算洗气瓶组件的关键连接锚点 (Design Space)
 */
export function getGasWashingBottlePorts(
  x: number,
  y: number,
  width = 90,
  height = 140
): GasWashingBottlePorts {
  return {
    inletPort: { x: x + width * 0.3, y: y - 20 },
    outletPort: { x: x + width * 0.7, y: y - 10 },
    topNeckPort: { x: x + width * 0.5, y: y + 12 },
    bottomPort: { x: x + width * 0.5, y: y + height },
  }
}

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
  /** 气体名称/说明 */
  label?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * GasWashingBottleApparatus — 高考标准洗气瓶组件
 *
 * 特性：
 * - 遵守高考“长进短出”气流净化原理
 * - 双孔橡皮塞密封、长管深入液面下方、短管停留在液面上方
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
  label,
  font = (n) => n,
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

      {/* 4. 长进气管 (长进：深入液面下方) */}
      <g>
        {/* 外套厚度与管壁 */}
        <path
          d={`
            M ${w * 0.3 - 4} -20
            L ${w * 0.3 + 4} -20
            L ${w * 0.3 + 4} ${h - 20}
            L ${w * 0.3 - 4} ${h - 20}
            Z
          `}
          fill={SCENE_COLORS.materials.glass}
          stroke={SCENE_COLORS.tube.glass}
          strokeWidth={1}
          opacity={0.9}
        />
        {/* 长管进气箭头指示 */}
        <line
          x1={w * 0.3}
          y1={-25}
          x2={w * 0.3}
          y2={-10}
          stroke={SCENE_COLORS.labels.chemicalFormula}
          strokeWidth={2}
        />
      </g>

      {/* 5. 短出气管 (短出：留在液面上方) */}
      <g>
        <path
          d={`
            M ${w * 0.7 - 4} -10
            L ${w * 0.7 + 4} -10
            L ${w * 0.7 + 4} ${neckH + 20}
            L ${w * 0.7 - 4} ${neckH + 20}
            Z
          `}
          fill={SCENE_COLORS.materials.glass}
          stroke={SCENE_COLORS.tube.glass}
          strokeWidth={1}
          opacity={0.9}
        />
      </g>

      {/* 6. 洗气动态气泡粒子 */}
      {bubbling && (
        <g transform={`translate(${w * 0.3}, ${h - 20})`}>
          <circle cx={-3} cy={-10} r={2.5} fill="none" stroke={SCENE_COLORS.materials.glassBorder} strokeWidth={1} />
          <circle cx={4} cy={-25} r={3.5} fill="none" stroke={SCENE_COLORS.materials.glassBorder} strokeWidth={1} />
          <circle cx={-1} cy={-45} r={4.5} fill="none" stroke={SCENE_COLORS.materials.glassBorder} strokeWidth={1.2} />
        </g>
      )}

      {/* 标注提示 */}
      {label && (
        <text
          x={w * 0.5}
          y={h + 16}
          textAnchor="middle"
          fontSize={font(FONT.annotation)}
          fill={SCENE_COLORS.labels.chemicalFormula}
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </g>
  )
}
