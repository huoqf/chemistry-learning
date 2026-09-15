import React, { useMemo } from 'react'
import type { FunctionalGroupItem, TotalConsumptionResult } from '../types'
import { GAOKAO_CLUES, PRESET_MOLECULES, FUNCTIONAL_GROUPS } from '../constants'
import {
  WarningSection,
} from '@/components/UI'
import { OrganicChemEquation } from './OrganicChemEquation'
import { Sparkles, Layers, BookOpen, ArrowRight, ShieldCheck, Flame } from 'lucide-react'

interface OrganicRightPanelProps {
  panelMode?: 'preset' | 'custom' | 'matrix'
  groupCounts: Record<string, number>
  selectedGroup?: FunctionalGroupItem
  consumption: TotalConsumptionResult
  onSelectGroup?: (id: string) => void
}

export const OrganicRightPanel: React.FC<OrganicRightPanelProps> = ({
  panelMode = 'preset',
  groupCounts,
  selectedGroup,
  consumption,
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

  // 当前分子内官能团详细对象列表
  const presentGroupItems = useMemo(() => {
    return presentGroupIds
      .map((id) => FUNCTIONAL_GROUPS.find((g) => g.id === id))
      .filter((g): g is FunctionalGroupItem => Boolean(g))
  }, [presentGroupIds])

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

  // 4. 聚焦官能团：如果在有分子的模式下，优先显示分子内选中的基团；大表模式直接显示选中的基团
  const activeSelectedGroup = useMemo(() => {
    if (!selectedGroup) return null
    if (presentGroupIds.length > 0 && !presentGroupIds.includes(selectedGroup.id)) {
      // 若当前选中的不在当前分子中，默认选中该分子的第一个官能团
      return presentGroupItems[0] || selectedGroup
    }
    return selectedGroup
  }, [selectedGroup, presentGroupIds, presentGroupItems])

  // 构造母题对应的易错警示
  const presetWarnings = useMemo(() => {
    if (!activePreset) return []
    return [
      { text: activePreset.examTraps, level: 'warning' as const },
    ]
  }, [activePreset])

  // 构造单官能团对应的易错警示
  const singleGroupWarnings = useMemo(() => {
    if (!activeSelectedGroup) return []
    return [
      { text: activeSelectedGroup.notes, level: 'info' as const },
    ]
  }, [activeSelectedGroup])

  // 针对当前母题动态提取最具高考代表性的定量考点指标
  const presetKeyMetrics = useMemo(() => {
    if (!activePreset) return []

    const list: { label: string; value: string; note: string; color: string }[] = []

    // 1. 银镜反应特异性（甲酸酚酯/水杨醛等新高考明星考点）
    if (consumption.precipitateAg > 0) {
      list.push({
        label: '+ 银氨溶液',
        value: `析出 ${consumption.precipitateAg} Ag`,
        note: '特征银镜反应',
        color: 'text-purple-700',
      })
    }

    // 2. NaOH 水解/中和（极值高频考点）
    if (consumption.NaOH > 0 || activePreset.id.includes('ester')) {
      list.push({
        label: '+ NaOH 水解',
        value: `耗 ${consumption.NaOH} mol`,
        note: consumption.NaOH >= 2 ? '极值高频考点' : '完全中和水解',
        color: 'text-emerald-700',
      })
    }

    // 3. Na 置换反应（活泼氢）
    if (consumption.Na > 0 || activePreset.id.includes('alcohol') || activePreset.id.includes('phenol')) {
      list.push({
        label: '+ Na 置换',
        value: `耗 ${consumption.Na} mol`,
        note: consumption.gasH2 > 0 ? `放 ${consumption.gasH2} H₂` : '活泼氢置换',
        color: 'text-indigo-700',
      })
    }

    // 4. NaHCO3 反应（羧基特异性）
    if (consumption.NaHCO3 > 0 || activePreset.id.includes('aspirin') || activePreset.id.includes('comprehensive')) {
      list.push({
        label: '+ NaHCO₃',
        value: `耗 ${consumption.NaHCO3} mol`,
        note: consumption.gasCO2 > 0 ? `放 ${consumption.gasCO2} CO₂` : '仅羧基反应',
        color: 'text-amber-700',
      })
    }

    // 5. 浓溴水反应（苯环取代或不饱和加成）
    if (consumption.Br2 > 0) {
      list.push({
        label: '+ 浓溴水',
        value: `耗 ${consumption.Br2} mol`,
        note: '加成或取代',
        color: 'text-rose-700',
      })
    }

    // 6. 催化加氢
    if (consumption.H2 > 0 && list.length < 3) {
      list.push({
        label: '+ H₂ 加氢',
        value: `耗 ${consumption.H2} mol`,
        note: '不饱和键还原',
        color: 'text-cyan-700',
      })
    }

    if (list.length === 0) {
      list.push({
        label: '化学反应性',
        value: '常温惰性',
        note: '不与Na/NaOH反应',
        color: 'text-slate-600',
      })
    }

    return list.slice(0, 3)
  }, [activePreset, consumption])

  return (
    <div className="w-full max-w-full p-2 space-y-2.5 text-slate-800 select-text overflow-x-hidden">
      {/* ────────────────── 1. 当前母题深度剖析卡片 (经典母题模式) ────────────────── */}
      {activePreset && (
        <div className="p-2.5 bg-slate-50/95 rounded-xl border border-slate-200/90 space-y-2.5 shadow-2xs">
          {/* 标题栏与结构式 */}
          <div className="flex items-start justify-between gap-1.5 pb-2 border-b border-slate-200">
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">{activePreset.title}</span>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                {activePreset.chemicalName}
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded shadow-2xs shrink-0 self-start">
              {activePreset.structureFormula}
            </span>
          </div>

          {/* 新高考核心计量反应台阶（动态适配当前母题的特异考点） */}
          <div className="p-2 bg-indigo-50/80 rounded-lg border border-indigo-200/80 space-y-1.5">
            <div className="text-xs font-bold text-indigo-950 flex items-center justify-between">
              <span>高考反应计量阶梯关系：</span>
              <span className="text-[11px] text-indigo-600 font-normal truncate max-w-[150px]">
                {activePreset.subtitle || '母题特异性计量'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
              {presetKeyMetrics.map((m, idx) => (
                <div key={idx} className="bg-white/90 p-1.5 rounded border border-indigo-100">
                  <div className="text-[11px] text-slate-500 font-medium">{m.label}</div>
                  <div className={`text-xs font-bold ${m.color} mt-0.5`}>
                    {m.value}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.2">
                    {m.note}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-indigo-900 leading-relaxed font-medium pt-0.5">
              定量规律：{activePreset.breakdownSummary}
            </div>
          </div>

          {/* 分子内官能团快速切换条（阿司匹林内含酚酯基与羧基，点击一键联动） */}
          {presentGroupItems.length > 1 && (
            <div className="space-y-1 pt-0.5">
              <div className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                <span>分子内核心官能团：</span>
                <span className="text-[11px] text-slate-400 font-normal">点击切换右屏聚焦</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {presentGroupItems.map((g) => {
                  const isFocused = activeSelectedGroup?.id === g.id
                  return (
                    <button
                      key={g.id}
                      onClick={() => onSelectGroup?.(g.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors flex items-center gap-1 ${
                        isFocused
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <span>{g.name}</span>
                      <span className={`font-mono text-[11px] ${isFocused ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {g.formula}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 高考要点深度解析 */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>高考真题推断规律精析</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              {activePreset.examAnalysis}
            </div>
          </div>

          {/* 核心反应方程式（无水平滚动条，自动折行排版） */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>核心代表反应方程式</span>
            </div>
            {activePreset.keyEquations.map((eq, i) => (
              <OrganicChemEquation
                key={i}
                equation={eq}
                highlight={i === 0}
                label={i === 0 ? '水解反应机理方程式' : '特征反应与转化'}
              />
            ))}
          </div>

          {/* 易错警示与命题陷阱 */}
          <WarningSection warnings={presetWarnings} />
        </div>
      )}

      {/* ────────────────── 2. 自由组装分子·高考定量推断报告 (仅组装模式) ────────────────── */}
      {panelMode === 'custom' && !activePreset && presentGroupIds.length > 0 && (
        <div className="p-2.5 bg-slate-50/95 rounded-xl border border-slate-200/90 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>组装分子·高考定量推断报告</span>
            </div>
            <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
              共含 {presentGroupIds.reduce((acc, id) => acc + (groupCounts[id] || 0), 0)} 个基团
            </span>
          </div>

          {/* 试剂消耗指标矩阵 */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="bg-white p-1.5 rounded-lg border border-slate-200/80">
              <div className="text-[11px] text-slate-500 font-medium">消耗 Na</div>
              <div className="text-sm font-bold text-indigo-700 mt-0.5">{consumption.Na} mol</div>
              <div className="text-[11px] text-slate-400">放 {consumption.gasH2} H₂</div>
            </div>
            <div className="bg-white p-1.5 rounded-lg border border-slate-200/80">
              <div className="text-[11px] text-slate-500 font-medium">消耗 NaOH</div>
              <div className="text-sm font-bold text-emerald-700 mt-0.5">{consumption.NaOH} mol</div>
              <div className="text-[11px] text-slate-400">中和与水解</div>
            </div>
            <div className="bg-white p-1.5 rounded-lg border border-slate-200/80">
              <div className="text-[11px] text-slate-500 font-medium">消耗 NaHCO₃</div>
              <div className="text-sm font-bold text-amber-700 mt-0.5">{consumption.NaHCO3} mol</div>
              <div className="text-[11px] text-slate-400">放 {consumption.gasCO2} CO₂</div>
            </div>
            <div className="bg-white p-1.5 rounded-lg border border-slate-200/80">
              <div className="text-[11px] text-slate-500 font-medium">消耗 Br₂</div>
              <div className="text-sm font-bold text-rose-700 mt-0.5">{consumption.Br2} mol</div>
              <div className="text-[11px] text-slate-400">加成或取代</div>
            </div>
            <div className="bg-white p-1.5 rounded-lg border border-slate-200/80">
              <div className="text-[11px] text-slate-500 font-medium">消耗 H₂</div>
              <div className="text-sm font-bold text-cyan-700 mt-0.5">{consumption.H2} mol</div>
              <div className="text-[11px] text-slate-400">催化加氢</div>
            </div>
            <div className="bg-white p-1.5 rounded-lg border border-slate-200/80">
              <div className="text-[11px] text-slate-500 font-medium">银镜析出</div>
              <div className="text-sm font-bold text-purple-700 mt-0.5">{consumption.precipitateAg} mol</div>
              <div className="text-[11px] text-slate-400">Ag 沉淀</div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── 3. 当前聚焦官能团 360° 全景精讲 ────────────────── */}
      {activeSelectedGroup && (
        <div className="p-2.5 bg-indigo-50/40 rounded-xl border border-indigo-200/80 space-y-2 text-xs shadow-2xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-indigo-100">
            <div className="font-bold text-indigo-950 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>聚焦官能团：{activeSelectedGroup.name}</span>
            </div>
            <span className="font-mono font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded text-xs">
              {activeSelectedGroup.formula}
            </span>
          </div>

          {/* 特征鉴别与实验现象（紧凑双列网格，充分利用水平空间） */}
          <div className="bg-white p-2 rounded-lg border border-slate-200/80 space-y-1.5">
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900">鉴别试剂：</span>
              {activeSelectedGroup.testReagents.join(' / ')}
            </div>
            <div className="text-xs text-emerald-800 font-semibold leading-relaxed">
              <span className="font-bold text-slate-900">特征现象：</span>
              {activeSelectedGroup.testPhenomenon}
            </div>
          </div>

          {/* 现代波谱定性特征 (高考前沿) */}
          {activeSelectedGroup.spectroscopy && (
            <div className="space-y-1 bg-blue-50/70 p-2 rounded-lg border border-blue-100 text-xs">
              <div className="font-bold text-blue-950 flex items-center gap-1">
                <span>现代波谱指纹特征 (红外与核磁)：</span>
              </div>
              <div className="text-slate-700 leading-relaxed">
                • <strong className="text-blue-900">IR 红外光谱</strong>：{activeSelectedGroup.spectroscopy.ir}
              </div>
              <div className="text-slate-700 leading-relaxed">
                • <strong className="text-blue-900">¹H-NMR 核磁</strong>：{activeSelectedGroup.spectroscopy.hnmr}
              </div>
            </div>
          )}

          {/* 单基团代表方程式（无水平滚动条） */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-700">典型代表反应方程式：</div>
            <OrganicChemEquation
              equation={activeSelectedGroup.testEquation}
              label="典型方程式"
            />
          </div>

          {/* 高考注意事项 */}
          <WarningSection warnings={singleGroupWarnings} />
        </div>
      )}

      {/* ────────────────── 4. 高考推断题眼速查字典 ────────────────── */}
      {relevantClues.length > 0 && (
        <div className="p-2.5 bg-slate-50/95 rounded-xl border border-slate-200/90 space-y-2 text-xs shadow-2xs">
          <div className="flex items-center justify-between font-bold text-slate-900 pb-1.5 border-b border-slate-200">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>本分子关联的高考推断题眼</span>
            </div>
            <span className="text-[11px] text-indigo-600 bg-white px-1.5 py-0.5 rounded border border-indigo-200 font-normal">
              点击题眼聚焦基团
            </span>
          </div>

          <div className="space-y-1.5 pt-0.5">
            {relevantClues.map((clue) => {
              const isMatched = activeSelectedGroup?.id === clue.matchedGroupId
              return (
                <div
                  key={clue.id}
                  onClick={() => onSelectGroup?.(clue.matchedGroupId)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                    isMatched
                      ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-1 ring-indigo-400'
                      : 'border-slate-200/80 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="font-semibold text-slate-800 text-xs leading-snug">
                    {clue.clueText}
                  </div>

                  <div className="flex items-center gap-1.5 my-1">
                    <span className="text-xs text-slate-400 font-medium shrink-0 flex items-center gap-0.5">
                      <ArrowRight className="w-3 h-3 text-indigo-500" />
                      推断结论:
                    </span>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded leading-tight">
                      {clue.deductionTarget}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 leading-relaxed">
                    判定依据：{clue.principle}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ────────────────── 5. 空态引导提示 ────────────────── */}
      {!activePreset && !activeSelectedGroup && relevantClues.length === 0 && (
        <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
          请在左侧选择经典母题或在全景大表中点击官能团，右屏将实时同步考点精讲与真题题眼。
        </div>
      )}
    </div>
  )
}
