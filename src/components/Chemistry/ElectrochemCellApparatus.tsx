import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface ElectrochemCellApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 160） */
  width?: number
  /** 器材高度（设计单位，默认 130） */
  height?: number
  /** 电池类型：'galvanic' 原电池 (外接电流表) | 'electrolytic' 电解池 (外接直流电源) */
  cellType?: 'galvanic' | 'electrolytic'
  /** 左电极材料标注 (如 "Zn" / "Pt") */
  leftElectrode?: string
  /** 右电极材料标注 (如 "Cu" / "C") */
  rightElectrode?: string
  /** 溶液填充比例 0~1 */
  fillLevel?: number
  /** 溶液颜色 */
  fillColor?: string
  /** 是否绘制器材内置的外电路与简易仪表，默认 false (解耦供 Scene 自由自定义电路) */
  showCircuit?: boolean
  /** 是否绘制器材内置的简易电极板，默认 true */
  showElectrodes?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * ElectrochemCellApparatus — 原电池 / 电解池基础槽体器皿组件
 *
 * 适用高中化学场景：
 * - 原电池反应容器（单槽/电解槽）
 * - 电解池反应容器
 *
 * 规范解耦设计：
 * - `showCircuit`: 默认 `false`。避免在槽体器材内强制画导线与仪表，方便 Scene 上层灵活自由编排 `<ElectronFlowPath>`、`<ExternalLoadApparatus>` 或 `<DcPowerSupplyApparatus>`。
 */
export function ElectrochemCellApparatus({
  x,
  y,
  width = 160,
  height = 130,
  cellType = 'galvanic',
  leftElectrode = 'Zn',
  rightElectrode = 'Cu',
  fillLevel = 0.65,
  fillColor = SCENE_COLORS.reagent.solution,
  showCircuit = false,
  showElectrodes = true,
  font = (n) => n,
}: ElectrochemCellApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 50

  const containerH = h * 0.7
  const containerY = h - containerH
  const liquidH = containerH * Math.min(1, Math.max(0, fillLevel))

  const leftX = w * 0.25
  const rightX = w * 0.75

  return (
    <g transform={`translate(${x}, ${y})`} className="electrochem-cell-apparatus">
      {/* 1. 槽体容器 */}
      <rect
        x={0}
        y={containerY}
        width={w}
        height={containerH}
        rx={6}
        fill={withAlpha(SCENE_COLORS.container.beaker, 0.4)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 电解质溶液 */}
      {fillLevel > 0 && (
        <rect
          x={3}
          y={h - liquidH}
          width={w - 6}
          height={liquidH - 3}
          fill={fillColor}
          opacity={0.8}
          rx={3}
        />
      )}

      {/* 2. 左右简易电极板 (可通过 showElectrodes 关闭) */}
      {showElectrodes && (
        <g>
          {/* 左电极 */}
          <rect
            x={leftX - 6}
            y={containerY - 10}
            width={12}
            height={containerH * 0.8}
            fill={SCENE_COLORS.materials.iron}
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={STROKE.reference}
          />
          {/* 右电极 */}
          <rect
            x={rightX - 6}
            y={containerY - 10}
            width={12}
            height={containerH * 0.8}
            fill={SCENE_COLORS.materials.metal}
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={STROKE.reference}
          />
        </g>
      )}

      {/* 3. 仅当 showCircuit === true 时才绘制内置简易外电路与仪表 */}
      {showCircuit && (
        <g>
          <path
            d={`
              M ${leftX} ${containerY - 10}
              L ${leftX} 15
              L ${w * 0.5 - 15} 15
              M ${w * 0.5 + 15} 15
              L ${rightX} 15
              L ${rightX} ${containerY - 10}
            `}
            fill="none"
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={STROKE.objectLine}
          />

          <circle
            cx={w * 0.5}
            cy={15}
            r={14}
            fill={SCENE_COLORS.materials.glass}
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={STROKE.objectLine}
          />
          <text
            x={w * 0.5}
            y={20}
            textAnchor="middle"
            fontSize={font(FONT.small)}
            fill={SCENE_COLORS.labels.chemicalFormula}
            fontWeight="bold"
          >
            {cellType === 'galvanic' ? 'A' : 'DC'}
          </text>
        </g>
      )}

      {/* 4. 电极材料标注 (仅在绘制简易电极时显示) */}
      {showElectrodes && !isTiny && (
        <g fontSize={font(FONT.small)} fill={SCENE_COLORS.labels.chemicalFormula} fontWeight="bold">
          <text x={leftX} y={containerY - 15} textAnchor="middle">{leftElectrode}</text>
          <text x={rightX} y={containerY - 15} textAnchor="middle">{rightElectrode}</text>
        </g>
      )}
    </g>
  )
}
