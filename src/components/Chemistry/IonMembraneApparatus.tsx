import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface IonMembraneApparatusProps {
  /** 膜左上角 x（设计坐标） */
  x: number
  /** 膜左上角 y（设计坐标） */
  y: number
  /** 膜高度（设计单位，默认 120） */
  height?: number
  /** 交换膜类型：'cation' 阳离子交换膜 | 'anion' 阴离子交换膜 | 'proton' 质子交换膜 */
  membraneType?: 'cation' | 'anion' | 'proton'
  /** 允许透过的离子标注 (如 "Na⁺" / "Cl⁻" / "H⁺") */
  ionLabel?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * IonMembraneApparatus — 离子交换膜组件
 *
 * 适用高中化学场景：
 * - 高考压轴热点：工业氯碱电解（阳离子交换膜只允许 Na⁺ 通过）、膜电池、二氧化碳电催化
 *
 * @example
 * ```tsx
 * <IonMembraneApparatus x={150} y={50} height={120} membraneType="cation" ionLabel="Na⁺" font={font} />
 * ```
 */
export function IonMembraneApparatus({
  x,
  y,
  height = 120,
  membraneType = 'cation',
  ionLabel = 'Na⁺',
  font = (n) => n,
}: IonMembraneApparatusProps) {
  const h = height

  const membraneColor = membraneType === 'cation' ? '#38BDF8' : membraneType === 'anion' ? '#F43F5E' : '#10B981'
  const title = membraneType === 'cation' ? '阳离子交换膜' : membraneType === 'anion' ? '阴离子交换膜' : '质子交换膜'

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 薄膜主体 (双虚线/高亮矩形) */}
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={h}
        stroke={membraneColor}
        strokeWidth={STROKE.objectLine * 2}
        strokeDasharray="6 3"
      />

      {/* 离子透过箭头指示 */}
      {ionLabel && (
        <g transform={`translate(0, ${h * 0.5})`}>
          <path
            d="M -15 0 L 15 0 M 9 -5 L 15 0 L 9 5"
            stroke={membraneColor}
            strokeWidth={STROKE.objectLine}
            fill="none"
          />
          <text
            x={0}
            y={-8}
            textAnchor="middle"
            fontSize={font(FONT.annotation)}
            fill={membraneColor}
            fontWeight="bold"
          >
            {ionLabel}
          </text>
        </g>
      )}

      {/* 膜类型标注 */}
      <text
        x={0}
        y={h + 16}
        textAnchor="middle"
        fontSize={font(FONT.annotation)}
        fill={SCENE_COLORS.labels.chemicalFormula}
        fontWeight="bold"
      >
        {title}
      </text>
    </g>
  )
}
