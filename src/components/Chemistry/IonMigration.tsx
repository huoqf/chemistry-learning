import { STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface IonMigrationProps {
  /** 起点 x（设计坐标） */
  x: number
  /** 起点 y（设计坐标） */
  y: number
  /** 移动方向向量 [dx, dy] */
  direction?: [number, number]
  /** 离子符号 (如 "Na⁺" / "Cl⁻" / "Cu²⁺") */
  ionSymbol?: string
  /** 离子电荷性质：'cation' 阳离子 (红色/蓝色) | 'anion' 阴离子 */
  ionType?: 'cation' | 'anion'
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * IonMigration — 电极离子定向迁移指示组件
 *
 * 适用高中化学场景：
 * - 电解池/原电池中“阴离子移向阳极/正极，阳离子移向阴极/负极”的微观迁移过程
 *
 * @example
 * ```tsx
 * <IonMigration x={100} y={150} direction={[40, 0]} ionSymbol="Na⁺" ionType="cation" font={font} />
 * ```
 */
export function IonMigration({
  x,
  y,
  direction = [30, 0],
  ionSymbol = 'Na⁺',
  ionType = 'cation',
  font = (n) => n,
}: IonMigrationProps) {
  const [dx, dy] = direction
  const color = ionType === 'cation' ? '#EF4444' : '#3B82F6'

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 离子球状图示 */}
      <circle cx={0} cy={0} r={12} fill={color} opacity={0.9} />
      <text
        x={0}
        y={4}
        textAnchor="middle"
        fontSize={font(FONT.annotation)}
        fill="white"
        fontWeight="bold"
      >
        {ionSymbol}
      </text>

      {/* 定向移动指示箭头 */}
      <path
        d={`M 14 0 L ${14 + dx} ${dy}`}
        stroke={color}
        strokeWidth={STROKE.objectLine}
        fill="none"
        strokeDasharray="3 2"
      />
      <path
        d={`M ${14 + dx} ${dy} L ${10 + dx} ${dy - 4} M ${14 + dx} ${dy} L ${10 + dx} ${dy + 4}`}
        stroke={color}
        strokeWidth={STROKE.objectLine}
      />
    </g>
  )
}
