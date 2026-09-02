import React, { useMemo } from 'react'
import type { FunctionalGroupItem, TotalConsumptionResult } from '../types'
import { PRESET_MOLECULES, FUNCTIONAL_GROUPS } from '../constants'
import {
  SCENE_COLORS,
  CANVAS_COLORS,
  CHEMISTRY_COLORS,
  PHENOMENON_COLORS,
  FONT,
  withAlpha,
} from '@/theme'

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
    { key: 'Na' as const, label: '金属钠 (Na)', value: consumption.Na, unit: 'mol', color: CHEMISTRY_COLORS.concentration },
    { key: 'NaOH' as const, label: '氢氧化钠 (NaOH)', value: consumption.NaOH, unit: 'mol', color: CHEMISTRY_COLORS.indicator },
    { key: 'NaHCO3' as const, label: '碳酸氢钠 (NaHCO₃)', value: consumption.NaHCO3, unit: 'mol', color: CHEMISTRY_COLORS.volume },
    { key: 'Na2CO3' as const, label: '碳酸钠 (Na₂CO₃)', value: consumption.Na2CO3, unit: 'mol', color: CHEMISTRY_COLORS.cation },
    { key: 'Br2' as const, label: '溴 (Br₂)', value: consumption.Br2, unit: 'mol', color: PHENOMENON_COLORS.br2Water },
    { key: 'H2' as const, label: '氢气 (H₂)', value: consumption.H2, unit: 'mol', color: CHEMISTRY_COLORS.forwardDirection },
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
            fill={CANVAS_COLORS.labelText}
          >
            {activePreset ? activePreset.title : '目标分子模型'}
            <tspan fontSize={font(FONT.annotation)} fill={CANVAS_COLORS.annotation} fontWeight="normal">
              {' '}
              {activePreset ? `(${activePreset.chemicalName})` : '(自定义组合分子体系)'}
            </tspan>
          </text>

          {/* 结构简式或基团列表 */}
          <g transform="translate(0, 32)">
            {activeGroups.length > 0 ? (
              <g>
                <text x={0} y={15} fontSize={font(FONT.small)} fill={CANVAS_COLORS.labelTextLight} fontWeight="medium">
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
                        fill={CANVAS_COLORS.objectFill}
                        stroke={CANVAS_COLORS.axis}
                      />
                      <text
                        x={8}
                        y={16}
                        fontSize={font(FONT.annotation)}
                        fontWeight="bold"
                        fill={CANVAS_COLORS.objectStroke}
                      >
                        {item.group.structureSvg}{' '}
                        <tspan fill={CHEMISTRY_COLORS.concentration}>× {item.count}</tspan>
                      </text>
                    </g>
                  )
                })}
              </g>
            ) : (
              <text x={0} y={15} fontSize={font(FONT.small)} fill={CANVAS_COLORS.textMuted}>
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
          fill={CANVAS_COLORS.labelText}
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
                  fill={CANVAS_COLORS.labelText}
                  fontWeight="bold"
                >
                  {r.label}
                </text>

                {/* 柱槽背景 */}
                <rect x={150} y={4} width={230} height={18} rx={5} fill={CANVAS_COLORS.gridSubtle} />

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
                  fill={r.value > 0 ? r.color : CANVAS_COLORS.textMuted}
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
                    fill={r.value > 0 ? CANVAS_COLORS.objectFillNeutral : CANVAS_COLORS.gridSubtle}
                    stroke={r.value > 0 ? CANVAS_COLORS.grid : 'transparent'}
                  />
                  <text
                    x={8}
                    y={16}
                    fontSize={font(FONT.annotation)}
                    fill={r.value > 0 ? CANVAS_COLORS.objectStroke : CANVAS_COLORS.textMuted}
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
          fill={CANVAS_COLORS.labelText}
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
                label: '与 Na 反应放 H₂',
                valStr: `${consumption.gasH2} mol`,
                bg: CANVAS_COLORS.objectFill,
                border: CANVAS_COLORS.axis,
                textColor: CANVAS_COLORS.objectStroke,
                valColor: CHEMISTRY_COLORS.concentration,
              })
            }
            if (consumption.gasCO2 > 0) {
              productCards.push({
                label: '与 NaHCO₃ 放 CO₂',
                valStr: `${consumption.gasCO2} mol`,
                bg: withAlpha(CHEMISTRY_COLORS.entropy, 0.08),
                border: withAlpha(CHEMISTRY_COLORS.entropy, 0.3),
                textColor: CHEMISTRY_COLORS.entropy,
                valColor: CHEMISTRY_COLORS.entropy,
              })
            }
            if (consumption.precipitateAg > 0) {
              productCards.push({
                label: '银镜析出 (Ag 沉淀)',
                valStr: `${consumption.precipitateAg} mol`,
                bg: CANVAS_COLORS.objectFillNeutral,
                border: CANVAS_COLORS.axis,
                textColor: CANVAS_COLORS.labelTextLight,
                valColor: CANVAS_COLORS.labelText,
              })
            }
            if (consumption.precipitateCu2O > 0) {
              productCards.push({
                label: '砖红沉淀 (Cu₂O)',
                valStr: `${consumption.precipitateCu2O} mol`,
                bg: CANVAS_COLORS.dangerBg,
                border: CANVAS_COLORS.dangerBorder,
                textColor: CANVAS_COLORS.dangerText,
                valColor: PHENOMENON_COLORS.cu2oPrecipitate,
              })
            }

            if (productCards.length === 0) {
              return (
                <text x={0} y={26} fontSize={font(FONT.small)} fill={CANVAS_COLORS.textMuted}>
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



