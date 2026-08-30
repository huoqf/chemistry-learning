import React from 'react'
import type { FunctionalGroupItem, TotalConsumptionResult } from '../types'
import { SCENE_COLORS, FONT, withAlpha } from '@/theme'

interface OrganicMatrixSceneProps {
  selectedGroup?: FunctionalGroupItem
  groupCounts: Record<string, number>
  consumption: TotalConsumptionResult
  font: (size: number) => number
}

export const OrganicMatrixScene: React.FC<OrganicMatrixSceneProps> = ({
  selectedGroup,
  consumption,
  font,
}) => {
  const reagents = [
    { label: '金属钠 (Na)', value: consumption.Na, unit: 'mol', color: '#3b82f6' },
    { label: '氢氧化钠 (NaOH)', value: consumption.NaOH, unit: 'mol', color: '#ec4899' },
    { label: '碳酸氢钠 (NaHCO₃)', value: consumption.NaHCO3, unit: 'mol', color: '#8b5cf6' },
    { label: '碳酸钠 (Na₂CO₃)', value: consumption.Na2CO3, unit: 'mol', color: '#6366f1' },
    { label: '溴 (Br₂)', value: consumption.Br2, unit: 'mol', color: '#f97316' },
    { label: '氢气 (H₂)', value: consumption.H2, unit: 'mol', color: '#10b981' },
  ]

  const maxVal = Math.max(...reagents.map((r) => r.value), 4)

  return (
    <g className="organic-scene">
      {/* 顶部：当前选中的官能团核心结构视窗 */}
      {selectedGroup && (
        <g transform="translate(420, 110)">
          {/* 外框 */}
          <rect
            x={-360}
            y={-70}
            width={720}
            height={140}
            rx={16}
            fill={withAlpha(SCENE_COLORS.materials.glass, 0.7)}
            stroke={SCENE_COLORS.materials.glassBorder}
            strokeWidth={1.5}
          />
          {/* 官能团结构式大字徽章 */}
          <g transform="translate(-240, 0)">
            <circle r={45} fill="#eff6ff" stroke="#3b82f6" strokeWidth={2} />
            <text
              x={0}
              y={8}
              textAnchor="middle"
              fontSize={font(FONT.title)}
              fontWeight="bold"
              fill="#1d4ed8"
              fontFamily="monospace"
            >
              {selectedGroup.structureSvg}
            </text>
          </g>

          {/* 官能团名称与定性特征 */}
          <g transform="translate(-160, -35)">
            <text
              x={0}
              y={20}
              fontSize={font(FONT.formula)}
              fontWeight="bold"
              fill="#1e293b"
            >
              {selectedGroup.name}
            </text>
            <text
              x={0}
              y={45}
              fontSize={font(FONT.small)}
              fill="#64748b"
            >
              特征鉴别试剂：{selectedGroup.testReagents.join(' / ')}
            </text>
            <text
              x={0}
              y={70}
              fontSize={font(FONT.annotation)}
              fill="#047857"
              fontWeight="bold"
            >
              现象：{selectedGroup.testPhenomenon}
            </text>
          </g>
        </g>
      )}

      {/* 中下部：分子消耗试剂定量比实时图谱 */}
      <g transform="translate(100, 220)">
        {/* 背景卡片 */}
        <rect
          x={0}
          y={0}
          width={640}
          height={380}
          rx={16}
          fill={withAlpha(SCENE_COLORS.materials.glass, 0.5)}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={1}
        />

        <text
          x={30}
          y={35}
          fontSize={font(FONT.label)}
          fontWeight="bold"
          fill="#1e293b"
        >
          组合分子与各试剂定量反应消耗柱状图 (1 mol 目标分子)
        </text>

        {/* 柱状图列表 */}
        <g transform="translate(30, 60)">
          {reagents.map((r, idx) => {
            const barWidth = maxVal > 0 ? (r.value / maxVal) * 360 : 0
            const posY = idx * 45
            return (
              <g key={r.label} transform={`translate(0, ${posY})`}>
                {/* 试剂标签 */}
                <text
                  x={0}
                  y={18}
                  fontSize={font(FONT.small)}
                  fill="#64748b"
                  fontWeight="medium"
                >
                  {r.label}
                </text>

                {/* 背景槽 */}
                <rect x={140} y={4} width={360} height={20} rx={6} fill="#f1f5f9" />

                {/* 动态柱 */}
                <rect
                  x={140}
                  y={4}
                  width={Math.max(barWidth, 0)}
                  height={20}
                  rx={6}
                  fill={r.color}
                  opacity={r.value > 0 ? 0.9 : 0.2}
                />

                {/* 消耗数值 */}
                <text
                  x={515}
                  y={19}
                  fontSize={font(FONT.label)}
                  fontWeight="bold"
                  fill={r.value > 0 ? r.color : '#94a3b8'}
                >
                  {r.value} {r.unit}
                </text>
              </g>
            )
          })}
        </g>

        {/* 产气提示 */}
        <g transform="translate(30, 340)">
          <rect x={0} y={-10} width={580} height={36} rx={8} fill="#f8fafc" stroke="#e2e8f0" />
          <text
            x={15}
            y={12}
            fontSize={font(FONT.small)}
            fill="#334155"
            fontWeight="medium"
          >
            💨 生成气体统计：产生 H₂ = <tspan fill="#2563eb" fontWeight="bold">{consumption.gasH2} mol</tspan> ；产生 CO₂ = <tspan fill="#7c3aed" fontWeight="bold">{consumption.gasCO2} mol</tspan>
          </text>
        </g>
      </g>
    </g>
  )
}
