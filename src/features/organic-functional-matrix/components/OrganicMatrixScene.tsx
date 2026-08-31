import React, { useMemo } from 'react'
import type { FunctionalGroupItem, TotalConsumptionResult } from '../types'
import { PRESET_MOLECULES, FUNCTIONAL_GROUPS } from '../constants'
import { SCENE_COLORS, FONT, withAlpha } from '@/theme'

interface OrganicMatrixSceneProps {
  selectedGroup?: FunctionalGroupItem
  groupCounts: Record<string, number>
  consumption: TotalConsumptionResult
  font: (size: number) => number
}

export const OrganicMatrixScene: React.FC<OrganicMatrixSceneProps> = ({
  groupCounts,
  consumption,
  font,
}) => {
  const reagents = [
    { key: 'Na' as const, label: '金属钠 (Na)', value: consumption.Na, unit: 'mol', color: '#3b82f6' },
    { key: 'NaOH' as const, label: '氢氧化钠 (NaOH)', value: consumption.NaOH, unit: 'mol', color: '#ec4899' },
    { key: 'NaHCO3' as const, label: '碳酸氢钠 (NaHCO₃)', value: consumption.NaHCO3, unit: 'mol', color: '#8b5cf6' },
    { key: 'Na2CO3' as const, label: '碳酸钠 (Na₂CO₃)', value: consumption.Na2CO3, unit: 'mol', color: '#6366f1' },
    { key: 'Br2' as const, label: '溴 (Br₂)', value: consumption.Br2, unit: 'mol', color: '#f97316' },
    { key: 'H2' as const, label: '氢气 (H₂)', value: consumption.H2, unit: 'mol', color: '#10b981' },
  ]

  const maxVal = Math.max(...reagents.map((r) => r.value), 4)

  // 识别当前匹配的母题预设
  const activePreset = useMemo(() => {
    for (const preset of PRESET_MOLECULES) {
      const presetEntries = Object.entries(preset.counts)
      const currentNonZero = Object.entries(groupCounts).filter(([, count]) => count > 0)
      if (presetEntries.length !== currentNonZero.length) continue

      const isMatch = presetEntries.every(
        ([id, count]) => (groupCounts[id] || 0) === count
      )
      if (isMatch) return preset
    }
    return null
  }, [groupCounts])

  // 当前分子包含的非零官能团列表
  const activeGroups = useMemo(() => {
    return Object.entries(groupCounts)
      .filter(([, count]) => count > 0)
      .map(([id, count]) => {
        const group = FUNCTIONAL_GROUPS.find((g) => g.id === id)
        return { group, count }
      })
      .filter((item): item is { group: FunctionalGroupItem; count: number } => Boolean(item.group))
  }, [groupCounts])

  // 格式化拆解公式字符串
  const getBreakdownFormula = (key: keyof typeof consumption.breakdowns) => {
    const items = consumption.breakdowns[key]
    if (!items || items.length === 0) return '0 mol (无反应基团)'
    return items
      .map((item) => `${item.totalMol} mol [${item.groupFormula}]`)
      .join(' + ')
  }

  return (
    <g className="organic-scene">
      {/* 1. 顶部：当前目标分子核心档案视窗 (居中聚焦) */}
      <g transform="translate(420, 85)">
        <rect
          x={-380}
          y={-55}
          width={760}
          height={115}
          rx={14}
          fill={withAlpha(SCENE_COLORS.materials.glass, 0.8)}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={1.5}
        />

        {/* 目标分子标题与化学式 */}
        <g transform="translate(-350, -25)">
          <text
            x={0}
            y={12}
            fontSize={font(FONT.label)}
            fontWeight="bold"
            fill="#0f172a"
          >
            {activePreset ? activePreset.title : '目标分子模型'}
            <tspan fontSize={font(FONT.annotation)} fill="#6366f1" fontWeight="normal">
              {' '}
              {activePreset ? `(${activePreset.chemicalName})` : '(自定义组合分子体系)'}
            </tspan>
          </text>

          {/* 结构简式或基团列表 */}
          <g transform="translate(0, 32)">
            {activeGroups.length > 0 ? (
              <g>
                <text x={0} y={15} fontSize={font(FONT.small)} fill="#475569" fontWeight="medium">
                  分子内官能团构成：
                </text>
                {activeGroups.map((item, idx) => {
                  const posX = 120 + idx * 140
                  if (posX > 660) return null
                  return (
                    <g key={item.group.id} transform={`translate(${posX}, 0)`}>
                      <rect
                        x={0}
                        y={0}
                        width={130}
                        height={24}
                        rx={6}
                        fill="#eff6ff"
                        stroke="#bfdbfe"
                      />
                      <text
                        x={8}
                        y={16}
                        fontSize={font(FONT.annotation)}
                        fontWeight="bold"
                        fill="#1e40af"
                      >
                        {item.group.structureSvg}{' '}
                        <tspan fill="#3b82f6">× {item.count}</tspan>
                      </text>
                    </g>
                  )
                })}
              </g>
            ) : (
              <text x={0} y={15} fontSize={font(FONT.small)} fill="#94a3b8">
                暂未添加官能团，请在左侧选择经典母题或增加基团数量
              </text>
            )}
          </g>
        </g>
      </g>

      {/* 2. 中部：试剂定量消耗与来源微观拆解方程式 */}
      <g transform="translate(40, 165)">
        <rect
          x={0}
          y={0}
          width={760}
          height={340}
          rx={14}
          fill={withAlpha(SCENE_COLORS.materials.glass, 0.5)}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={1}
        />

        <text
          x={25}
          y={30}
          fontSize={font(FONT.label)}
          fontWeight="bold"
          fill="#0f172a"
        >
          各核心试剂定量反应消耗与加法拆解 (基准：1 mol 目标分子)
        </text>

        {/* 柱状图列表 */}
        <g transform="translate(25, 48)">
          {reagents.map((r, idx) => {
            const barWidth = maxVal > 0 ? (r.value / maxVal) * 230 : 0
            const posY = idx * 44
            const breakdownStr = getBreakdownFormula(r.key)

            return (
              <g key={r.label} transform={`translate(0, ${posY})`}>
                {/* 试剂标签 */}
                <text
                  x={0}
                  y={18}
                  fontSize={font(FONT.small)}
                  fill="#334155"
                  fontWeight="bold"
                >
                  {r.label}
                </text>

                {/* 柱槽背景 */}
                <rect x={150} y={4} width={230} height={18} rx={5} fill="#f1f5f9" />

                {/* 动态柱 */}
                <rect
                  x={150}
                  y={4}
                  width={Math.max(barWidth, 0)}
                  height={18}
                  rx={5}
                  fill={r.color}
                  opacity={r.value > 0 ? 0.95 : 0.25}
                />

                {/* 消耗总数 */}
                <text
                  x={390}
                  y={18}
                  fontSize={font(FONT.label)}
                  fontWeight="bold"
                  fill={r.value > 0 ? r.color : '#94a3b8'}
                >
                  {r.value} {r.unit}
                </text>

                {/* 右侧微观拆解公式 */}
                <g transform="translate(465, 0)">
                  <rect
                    x={0}
                    y={1}
                    width={245}
                    height={23}
                    rx={4}
                    fill={r.value > 0 ? '#f8fafc' : '#f1f5f9'}
                    stroke={r.value > 0 ? '#e2e8f0' : 'transparent'}
                  />
                  <text
                    x={8}
                    y={16}
                    fontSize={font(FONT.annotation)}
                    fill={r.value > 0 ? '#4338ca' : '#94a3b8'}
                    fontFamily="monospace"
                  >
                    = {breakdownStr.length > 28 ? breakdownStr.slice(0, 26) + '...' : breakdownStr}
                  </text>
                </g>
              </g>
            )
          })}
        </g>
      </g>

      {/* 3. 底部：生成气体与特征沉淀直观指示板 (仅展示当前分子实际生成的产物) */}
      <g transform="translate(40, 525)">
        <rect
          x={0}
          y={0}
          width={760}
          height={90}
          rx={12}
          fill={withAlpha(SCENE_COLORS.materials.glass, 0.7)}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={1}
        />

        <text
          x={20}
          y={24}
          fontSize={font(FONT.small)}
          fontWeight="bold"
          fill="#1e293b"
        >
          宏观实验特征产物实时监控看板
        </text>

        <g transform="translate(20, 36)">
          {(() => {
            const productCards: Array<{
              label: string
              valStr: string
              bg: string
              border: string
              textColor: string
              valColor: string
            }> = []

            if (consumption.gasH2 > 0) {
              productCards.push({
                label: '氢气 (H₂) 析出量',
                valStr: `${consumption.gasH2} mol`,
                bg: '#eff6ff',
                border: '#bfdbfe',
                textColor: '#1e40af',
                valColor: '#2563eb',
              })
            }
            if (consumption.gasCO2 > 0) {
              productCards.push({
                label: '二氧化碳 (CO₂) 放出',
                valStr: `${consumption.gasCO2} mol`,
                bg: '#faf5ff',
                border: '#e9d5ff',
                textColor: '#6b21a8',
                valColor: '#7c3aed',
              })
            }
            if (consumption.precipitateAg > 0) {
              productCards.push({
                label: '银镜析出 (Ag 沉淀)',
                valStr: `${consumption.precipitateAg} mol`,
                bg: '#f8fafc',
                border: '#cbd5e1',
                textColor: '#475569',
                valColor: '#334155',
              })
            }
            if (consumption.precipitateCu2O > 0) {
              productCards.push({
                label: '砖红沉淀 (Cu₂O)',
                valStr: `${consumption.precipitateCu2O} mol`,
                bg: '#fff1f2',
                border: '#fecdd3',
                textColor: '#9f1239',
                valColor: '#e11d48',
              })
            }

            if (productCards.length === 0) {
              return (
                <text x={0} y={26} fontSize={font(FONT.small)} fill="#94a3b8">
                  当前分子体系与常用定性试剂反应不产生特征气体或专属沉淀（无 H₂/CO₂ 气体、无银镜或砖红沉淀）。
                </text>
              )
            }

            const cardWidth = Math.min(220, (720 - (productCards.length - 1) * 16) / productCards.length)

            return productCards.map((card, idx) => (
              <g key={card.label} transform={`translate(${idx * (cardWidth + 16)}, 0)`}>
                <rect
                  x={0}
                  y={0}
                  width={cardWidth}
                  height={42}
                  rx={6}
                  fill={card.bg}
                  stroke={card.border}
                />
                <text
                  x={10}
                  y={18}
                  fontSize={font(FONT.annotation)}
                  fill={card.textColor}
                >
                  {card.label}
                </text>
                <text
                  x={10}
                  y={34}
                  fontSize={font(FONT.label)}
                  fontWeight="bold"
                  fill={card.valColor}
                >
                  {card.valStr}
                </text>
              </g>
            ))
          })()}
        </g>
      </g>
    </g>
  )
}


