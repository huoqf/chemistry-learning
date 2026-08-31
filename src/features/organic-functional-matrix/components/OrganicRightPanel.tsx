import React, { useMemo } from 'react'
import type { FunctionalGroupItem, TotalConsumptionResult } from '../types'
import { GAOKAO_CLUES, PRESET_MOLECULES } from '../constants'
import {
  FormulaSection,
  GaokaoSection,
  WarningSection,
} from '@/components/UI'

interface OrganicRightPanelProps {
  groupCounts: Record<string, number>
  selectedGroup?: FunctionalGroupItem
  consumption: TotalConsumptionResult
  onSelectGroup?: (id: string) => void
}

export const OrganicRightPanel: React.FC<OrganicRightPanelProps> = ({
  groupCounts,
  selectedGroup,
  onSelectGroup,
}) => {
  // 1. 识别当前匹配的母题预设
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

  // 2. 当前分子中实际存在的官能团 ID 列表 (例如阿司匹林为 ['phenol-ester', 'carboxyl-cooh'])
  const presentGroupIds = useMemo(() => {
    return Object.entries(groupCounts)
      .filter(([, count]) => count > 0)
      .map(([id]) => id)
  }, [groupCounts])

  // 3. 筛选与当前分子或当前选中基团相关的高考题眼
  const relevantClues = useMemo(() => {
    if (presentGroupIds.length > 0) {
      return GAOKAO_CLUES.filter((clue) =>
        presentGroupIds.includes(clue.matchedGroupId)
      )
    }
    if (selectedGroup) {
      return GAOKAO_CLUES.filter((clue) => clue.matchedGroupId === selectedGroup.id)
    }
    return []
  }, [presentGroupIds, selectedGroup])

  // 4. 聚焦官能团：如果在组装分子模式下有分子，优先显示分子内选中的基团；在全景大表下直接展示选中的基团
  const activeSelectedGroup = useMemo(() => {
    if (!selectedGroup) return null
    if (presentGroupIds.length > 0 && !presentGroupIds.includes(selectedGroup.id)) {
      return null
    }
    return selectedGroup
  }, [selectedGroup, presentGroupIds])

  // 构造母题对应的标准公式列表
  const presetFormulas = useMemo(() => {
    if (!activePreset) return []
    return activePreset.keyEquations.map((eq, idx) => ({
      name: idx === 0 ? '水解反应机理方程式' : '特征中和/转化方程式',
      latex: eq,
      level: 'core' as const,
    }))
  }, [activePreset])

  // 构造母题对应的高考要点
  const presetGaokaoPoints = useMemo(() => {
    if (!activePreset) return []
    return [
      { text: activePreset.examAnalysis, importance: 'gaokao' as const },
    ]
  }, [activePreset])

  // 构造母题对应的易错警示
  const presetWarnings = useMemo(() => {
    if (!activePreset) return []
    return [
      { text: activePreset.examTraps, level: 'warning' as const },
    ]
  }, [activePreset])

  // 构造单官能团对应的标准公式
  const singleGroupFormulas = useMemo(() => {
    if (!activeSelectedGroup) return []
    return [
      {
        name: `${activeSelectedGroup.name} 特征反应方程式`,
        latex: activeSelectedGroup.testEquation,
        level: 'important' as const,
      },
    ]
  }, [activeSelectedGroup])

  // 构造单官能团对应的易错警示
  const singleGroupWarnings = useMemo(() => {
    if (!activeSelectedGroup) return []
    return [
      { text: activeSelectedGroup.notes, level: 'info' as const },
    ]
  }, [activeSelectedGroup])

  return (
    <div className="w-full h-full p-3 bg-white overflow-y-auto space-y-3 text-slate-800">
      {/* 1. 当前母题深度剖析卡片 (如果选了母题) */}
      {activePreset && (
        <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 space-y-3 text-xs">
          {/* 标题栏 */}
          <div className="flex items-start justify-between gap-1 pb-2 border-b border-slate-200">
            <div>
              <div className="font-bold text-slate-900 text-sm">
                {activePreset.title}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                {activePreset.chemicalName}
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded shadow-2xs shrink-0">
              {activePreset.structureFormula}
            </span>
          </div>

          {/* 定量规律概括 */}
          <div className="p-2 bg-indigo-50/70 rounded-lg border border-indigo-200/70 text-[11.5px] font-bold text-indigo-950">
            定量规律：{activePreset.breakdownSummary}
          </div>

          {/* 规范组件：高考要点 */}
          <GaokaoSection points={presetGaokaoPoints} />

          {/* 规范组件：核心公式 */}
          <FormulaSection formulas={presetFormulas} />

          {/* 规范组件：易错警示 */}
          <WarningSection warnings={presetWarnings} />
        </div>
      )}

      {/* 2. 当前聚焦官能团深度精讲 (仅展示当前分子中实际存在的基团) */}
      {activeSelectedGroup && (
        <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-200/80 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-indigo-100">
            <div className="font-bold text-indigo-950">
              聚焦官能团：{activeSelectedGroup.name}
            </div>
            <span className="font-mono font-bold text-indigo-700 bg-white border border-indigo-200 px-1.5 py-0.5 rounded text-[10.5px]">
              {activeSelectedGroup.formula}
            </span>
          </div>

          {/* 特征鉴别与实验现象 */}
          <div className="space-y-1 bg-white p-2 rounded-lg border border-slate-200/80">
            <div className="text-[11px] text-slate-700">
              <strong>鉴别试剂</strong>：{activeSelectedGroup.testReagents.join(' / ')}
            </div>
            <div className="text-[11px] text-emerald-800 font-semibold">
              <strong>特征现象</strong>：{activeSelectedGroup.testPhenomenon}
            </div>
          </div>

          {/* 规范组件：单基团代表方程式 */}
          <FormulaSection formulas={singleGroupFormulas} />

          {/* 规范组件：单基团易错要点 */}
          <WarningSection warnings={singleGroupWarnings} />
        </div>
      )}

      {/* 3. 该母题/分子对应的高考推断题眼 (只呈现相干题眼) */}
      {relevantClues.length > 0 && (
        <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-900 pb-1 border-b border-slate-200">
            <span>本分子关联的高考推断题眼</span>
            <span className="text-[10px] text-indigo-600 bg-white px-1.5 py-0.5 rounded border border-indigo-200 font-normal">
              点击题眼聚焦基团
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {relevantClues.map((clue) => {
              const isMatched = activeSelectedGroup?.id === clue.matchedGroupId
              return (
                <div
                  key={clue.id}
                  onClick={() => onSelectGroup?.(clue.matchedGroupId)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isMatched
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-400'
                      : 'border-slate-200/80 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="font-semibold text-slate-800 text-[11.5px] leading-snug">
                    {clue.clueText}
                  </div>

                  <div className="flex items-center gap-1.5 my-1 pl-1">
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">推断结论:</span>
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded leading-tight">
                      {clue.deductionTarget}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 leading-relaxed pl-1">
                    判定依据：{clue.principle}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 如果既没有母题也没有选中任何基团 */}
      {!activePreset && !activeSelectedGroup && relevantClues.length === 0 && (
        <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
          请在左侧选择经典母题或在全景大表中点击官能团，右屏将实时同步考点精讲与真题题眼。
        </div>
      )}
    </div>
  )
}




