import { useState } from 'react'
import { SCENE_COLORS, FONT, colors } from '@/theme'
import type { FontScaler } from '@/theme'

export interface CarbonNode {
  id: string
  label: string // 化学式文本，例如 "CH₃", "CH₂", "CH", "C"
  x: number // 相对 Canvas x 坐标
  y: number // 相对 Canvas y 坐标
  equivalentHydrogenGroup?: number // 等效氢分组编号 (1, 2, 3...)
  isBranch?: boolean // 是否为侧链分支
}

export interface CarbonBond {
  fromId: string
  toId: string
  type?: 'single' | 'double' | 'triple' // 单键 C-C / 双键 C=C / 三键 C≡C
}

export interface HnmrPeak {
  group: number // 对应等效氢分组编号 (1, 2, 3...)
  delta: number // 化学位移 δ (ppm)
  count: number // 吸收峰积分强度 / 氢原子个数
  multiplicity?: string // 峰分裂说明，如 "单峰 (s)", "三重峰 (t)"
}

export interface IsomerNode {
  id: string
  name: string // 异构体命名，如 "正戊烷", "异戊烷", "新戊烷"
  formula: string // 分子式 "C₅H₁₂"
  iupacName?: string // 规范命名 "2-甲基丁烷"
  nodes: CarbonNode[]
  bonds: CarbonBond[]
  equivalentHCount: number // 等效氢种类数目 (高考必考)
  boilingPoint?: number // 沸点 (°C)
  description?: string
  hnmrPeaks?: HnmrPeak[] // 核磁共振氢谱 1H-NMR 吸收峰数据
}

export interface CarbonChain2DProps {
  /** 当前选中的同分异构体数据 */
  isomer: IsomerNode
  /** 所有可供选择对比的异构体列表 */
  isomerList?: IsomerNode[]
  /** 点击选择其他异构体回调 */
  onSelectIsomer?: (isomer: IsomerNode) => void
  /** 是否开启“等效氢”染色高亮模式 */
  showEquivalentH?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
  /** 宽度 */
  width?: number
  /** 高度 */
  height?: number
}

// 等效氢高亮色彩池（预置 6 种明亮对比色）
const EQUIVALENT_H_COLORS = [
  '#EF4444', // 红
  '#3B82F6', // 蓝
  '#10B981', // 绿
  '#F59E0B', // 黄
  '#8B5CF6', // 紫
  '#EC4899', // 粉
]

/**
 * CarbonChain2D — 2D 平面碳骨架与同分异构体树组件
 *
 * 适用高中化学场景与高考考点：
 * - 减碳法推导同分异构体（主链由长到短、支链由整到散、位置由中心到边缘）
 * - 官能团位置异构与碳链异构
 * - 等效氢种类计算（高考必考：决定一氯代物 / NMR 氢谱峰面积比）
 *
 * @example
 * ```tsx
 * <CarbonChain2D
 *   isomer={currentIsomer}
 *   isomerList={pentaneIsomers}
 *   onSelectIsomer={setSelectedIsomer}
 *   showEquivalentH={true}
 *   font={font}
 * />
 * ```
 */
export function CarbonChain2D({
  isomer,
  isomerList = [],
  onSelectIsomer,
  showEquivalentH = true,
  font = (n) => n,
  width = 500,
  height = 300,
}: CarbonChain2DProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  const getNodePos = (id: string) => {
    return isomer.nodes.find((n) => n.id === id)
  }

  return (
    <div className="w-full h-full flex flex-col gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* 顶部异构体切换标签栏 */}
      {isomerList.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-500 shrink-0">同分异构体列表：</span>
          {isomerList.map((item) => {
            const isSelected = item.id === isomer.id
            return (
              <button
                key={item.id}
                onClick={() => onSelectIsomer?.(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                <span>{item.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.equivalentHCount}种H
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* 2D 碳链平面 Canvas / SVG 主体 */}
      <div className="flex-1 relative w-full h-full bg-slate-50/70 rounded-lg border border-slate-200/80 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full max-w-full max-h-full"
        >
          {/* 1. 绘制 C-C 化学键连线 */}
          {isomer.bonds.map((bond, idx) => {
            const start = getNodePos(bond.fromId)
            const end = getNodePos(bond.toId)
            if (!start || !end) return null

            const isDouble = bond.type === 'double'

            return (
              <g key={`${bond.fromId}-${bond.toId}-${idx}`}>
                {isDouble ? (
                  <>
                    <line
                      x1={start.x - 3}
                      y1={start.y - 3}
                      x2={end.x - 3}
                      y2={end.y - 3}
                      stroke={SCENE_COLORS.materials.iron}
                      strokeWidth={2.5}
                    />
                    <line
                      x1={start.x + 3}
                      y1={start.y + 3}
                      x2={end.x + 3}
                      y2={end.y + 3}
                      stroke={SCENE_COLORS.materials.iron}
                      strokeWidth={2.5}
                    />
                  </>
                ) : (
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={SCENE_COLORS.materials.iron}
                    strokeWidth={2.5}
                  />
                )}
              </g>
            )
          })}

          {/* 2. 绘制碳原子节点与氢原子标注 */}
          {isomer.nodes.map((node) => {
            const eqGroup = node.equivalentHydrogenGroup || 1
            const groupColor = EQUIVALENT_H_COLORS[(eqGroup - 1) % EQUIVALENT_H_COLORS.length]
            const isHovered = hoveredNodeId === node.id

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                {/* 等效氢高亮背景光晕 */}
                {showEquivalentH && (
                  <circle
                    r={22}
                    fill={groupColor}
                    opacity={isHovered ? 0.35 : 0.2}
                    className="transition-opacity"
                  />
                )}

                {/* 节点气泡白框 */}
                <circle
                  r={16}
                  fill="white"
                  stroke={showEquivalentH ? groupColor : colors.neutral[300]}
                  strokeWidth={showEquivalentH ? 2.5 : 1.5}
                />

                {/* 基团化学式文本 (如 CH₃) */}
                <text
                  textAnchor="middle"
                  dy="4"
                  fontSize={font(FONT.label)}
                  fontWeight="bold"
                  fill={showEquivalentH ? groupColor : colors.neutral[800]}
                >
                  {node.label}
                </text>

                {/* 等效氢编号 Badge */}
                {showEquivalentH && (
                  <g transform="translate(12, -12)">
                    <circle r={7} fill={groupColor} />
                    <text
                      textAnchor="middle"
                      dy="3"
                      fontSize={font(FONT.small - 3)}
                      fill="white"
                      fontWeight="bold"
                    >
                      H{eqGroup}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* 底部高考解题要点提示与对比说明 */}
      <div className="flex items-center justify-between text-xs bg-indigo-50/70 px-3 py-2 rounded-lg border border-indigo-100">
        <div className="flex items-center gap-2">
          <span className="font-bold text-indigo-900">当前选择：{isomer.name}</span>
          {isomer.iupacName && (
            <span className="text-indigo-700">（IUPAC 命名：{isomer.iupacName}）</span>
          )}
        </div>
        <div className="flex items-center gap-3 font-medium">
          <span className="text-slate-600">
            等效氢种类：<strong className="text-indigo-600 font-bold">{isomer.equivalentHCount} 种</strong>
          </span>
          {isomer.boilingPoint !== undefined && (
            <span className="text-slate-600">
              沸点：<strong className="text-amber-600 font-bold">{isomer.boilingPoint} °C</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
