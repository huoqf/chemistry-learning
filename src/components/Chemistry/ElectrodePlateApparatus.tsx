import { SCENE_COLORS, CHEMISTRY_COLORS } from '@/theme'
import type { FontScaler } from '@/theme'

export type ElectrodeMaterial =
  | 'Zn'
  | 'Cu'
  | 'Carbon'
  | 'Pt'
  | 'Pb'
  | 'PbO2'
  | 'ImpureCu'

export interface ElectrodePlateApparatusProps {
  /** 电极板中心顶端 x 坐标 */
  x: number
  /** 电极板中心顶端 y 坐标 */
  y: number
  /** 电极板宽度，默认 16 */
  width?: number
  /** 电极板高度，默认 120 */
  height?: number
  /** 电极材质类型 */
  material: ElectrodeMaterial
  /** 电极名称/极性标识文本 (如 "Zn (-)", "阳极(+)") */
  label?: string
  /** 极性颜色标识 ('anode' | 'cathode' | 'positive' | 'negative' | 'none') */
  polarity?: 'anode' | 'cathode' | 'positive' | 'negative' | 'none'
  /** 析出镀层/沉淀厚度 (px)，如阴极镀铜 */
  depositThickness?: number
  /** 溶解减薄宽度 (px)，如阳极溶解 */
  thinningAmount?: number
  /** 是否在电极两侧/底部显示附着沉淀 ('none' | 'PbSO4' | 'AnodeMud') */
  attachmentType?: 'none' | 'PbSO4' | 'AnodeMud'
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * ElectrodePlateApparatus — 通用电极板与动态变化器材组件
 *
 * 适用高考化学场景：
 * - 原电池/电解池中的各类电极板（锌棒、铜棒、石墨、铂电极、铅板、二氧化铅板、粗铜等）
 * - 动态显示电极溶解减薄、阴极铜析出厚度、铅蓄电池白色 PbSO₄ 沉淀附着、粗铜精炼阳极泥 (Au/Ag) 沉淀。
 */
export function ElectrodePlateApparatus({
  x,
  y,
  width = 16,
  height = 120,
  material,
  label,
  polarity = 'none',
  depositThickness = 0,
  thinningAmount = 0,
  attachmentType = 'none',
  font = (n) => n,
}: ElectrodePlateApparatusProps) {
  // 根据材质获取基础填充颜色
  const getMaterialColor = (mat: ElectrodeMaterial) => {
    switch (mat) {
      case 'Zn':
        return SCENE_COLORS.materials.iron // 锌银灰色
      case 'Cu':
      case 'ImpureCu':
        return '#B45309' // 铜红棕色
      case 'Carbon':
      case 'Pt':
        return '#334155' // 石墨/铂石墨黑
      case 'Pb':
        return '#64748B' // 铅暗灰色
      case 'PbO2':
        return '#78350F' // 二氧化铅棕黑色
      default:
        return SCENE_COLORS.materials.metal
    }
  }

  // 极性标识颜色
  const getPolarityColor = (pol: string) => {
    switch (pol) {
      case 'anode':
      case 'positive':
        return CHEMISTRY_COLORS.anode
      case 'cathode':
      case 'negative':
        return CHEMISTRY_COLORS.cathode
      default:
        return SCENE_COLORS.materials.iron
    }
  }

  const effectiveWidth = Math.max(4, width - thinningAmount)
  const plateX = x - effectiveWidth / 2

  return (
    <g transform="translate(0, 0)" className="electrode-plate">
      {/* 1. 电极主金属板 */}
      <rect
        x={plateX}
        y={y}
        width={effectiveWidth}
        height={height}
        rx={2}
        fill={getMaterialColor(material)}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={1.5}
      />

      {/* 2. 阴极镀层析出动画 (如 Cu 析出) */}
      {depositThickness > 0 && (
        <rect
          x={x - (width + depositThickness) / 2}
          y={y + height * 0.25}
          width={width + depositThickness}
          height={height * 0.7}
          rx={3}
          fill="#B45309"
          opacity={0.85}
          stroke="#78350F"
          strokeWidth={1}
        />
      )}

      {/* 3. 特殊附着物 (如 铅蓄电池白色 PbSO4 沉淀) */}
      {attachmentType === 'PbSO4' && (
        <rect
          x={x - (width + 4) / 2}
          y={y + height * 0.2}
          width={width + 4}
          height={height * 0.65}
          rx={3}
          fill="#E2E8F0"
          opacity={0.75}
          stroke="#94A3B8"
          strokeWidth={1}
          strokeDasharray="2 2"
        />
      )}

      {/* 4. 阳极泥沉淀 (粗铜精炼底部 Au/Ag 沉积) */}
      {attachmentType === 'AnodeMud' && (
        <g transform={`translate(${x}, ${y + height + 10})`}>
          <circle cx={-8} cy={4} r={3} fill="#EAB308" />
          <circle cx={0} cy={6} r={2.5} fill="#94A3B8" />
          <circle cx={8} cy={3} r={3} fill="#EAB308" />
          <text
            x={0}
            y={18}
            textAnchor="middle"
            fontSize={font(9)}
            fill="#EAB308"
            fontWeight="bold"
          >
            阳极泥(Au/Ag)
          </text>
        </g>
      )}

      {/* 5. 顶端极性标签徽章 */}
      {polarity !== 'none' && (
        <g transform={`translate(${x}, ${y - 10})`}>
          <rect
            x={-20}
            y={-9}
            width={40}
            height={16}
            rx={4}
            fill={getPolarityColor(polarity)}
          />
          <text
            x={0}
            y={3}
            textAnchor="middle"
            fontSize={font(9)}
            fill="#FFFFFF"
            fontWeight="bold"
          >
            {polarity === 'anode'
              ? '阳极(+)'
              : polarity === 'cathode'
              ? '阴极(-)'
              : polarity === 'positive'
              ? '正极(+)'
              : '负极(-)'}
          </text>
        </g>
      )}

      {/* 6. 底部/说明标签 */}
      {label && (
        <text
          x={x}
          y={y + height + (attachmentType === 'AnodeMud' ? 35 : 18)}
          textAnchor="middle"
          fontSize={font(10)}
          fill={
            polarity !== 'none'
              ? getPolarityColor(polarity)
              : SCENE_COLORS.labels.chemicalFormula
          }
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </g>
  )
}
