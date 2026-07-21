import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface IonExchangeColumnEquipmentProps {
  /** 设备左上角 x（设计坐标） */
  x: number
  /** 设备左上角 y（设计坐标） */
  y: number
  /** 设备宽度（设计单位，默认 70） */
  width?: number
  /** 设备高度（设计单位，默认 180） */
  height?: number
  /** 树脂类型：'cation' 阳离子树脂 | 'anion' 阴离子树脂 */
  resinType?: 'cation' | 'anion'
  /** 标题名称 */
  title?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * IonExchangeColumnEquipment — 离子交换柱组件（高考化工流程）
 *
 * 适用高考化工场景：
 * - 工业硬水软化 (交换 Ca²⁺/Mg²⁺)、稀土元素柱色谱分离提纯
 *
 * @example
 * ```tsx
 * <IonExchangeColumnEquipment x={200} y={50} title="离子交换柱" font={font} />
 * ```
 */
export function IonExchangeColumnEquipment({
  x,
  y,
  width = 70,
  height = 180,
  resinType = 'cation',
  title = '离子交换柱',
  font = (n) => n,
}: IonExchangeColumnEquipmentProps) {
  const w = width
  const h = height
  const isTiny = w < 35

  const resinColor = resinType === 'cation' ? '#F59E0B' : '#3B82F6'
  const cx = w * 0.5

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 外壁玻璃/钢柱 */}
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        rx={4}
        fill={withAlpha(SCENE_COLORS.materials.glass, 0.4)}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 内部填充的离子交换树脂颗粒层 */}
      <rect
        x={4}
        y={h * 0.25}
        width={w - 8}
        height={h * 0.6}
        rx={2}
        fill={resinColor}
        opacity={0.75}
      />

      {/* 标题 */}
      {title && !isTiny && (
        <text
          x={cx}
          y={h * 0.18}
          textAnchor="middle"
          fontSize={font(FONT.annotation)}
          fill={SCENE_COLORS.labels.chemicalFormula}
          fontWeight="bold"
        >
          {title}
        </text>
      )}
    </g>
  )
}
