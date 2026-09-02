/**
 * src/features/gas-chain/components/tabs/GasMatrixTab.tsx
 * Tab 4: 13 大气体制备全景总表与一键联动模拟
 */

import React, { useState, useMemo } from 'react'
import {
  GAS_MATRIX_ITEMS,
  type GasCategory,
} from '../../data/gasChainMatrixData'
import { KatexFormula } from '@/components/UI'
import {
  Filter,
  Play,
  ChevronDown,
  ChevronUp,
  Flame,
  Droplets,
  Layers,
  Beaker,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react'

interface GasMatrixTabProps {
  onApplySystemPreset?: (targetGas: string) => void
  categoryFilter?: GasCategory | 'all'
  onCategoryFilterChange?: (cat: GasCategory | 'all') => void
}

export const GasMatrixTab: React.FC<GasMatrixTabProps> = ({
  onApplySystemPreset,
  categoryFilter = 'all',
  onCategoryFilterChange,
}) => {
  const [internalCategory, setInternalCategory] = useState<GasCategory | 'all'>('all')
  const [expandedGasId, setExpandedGasId] = useState<string | null>('cl2')

  const activeCategory = onCategoryFilterChange ? categoryFilter : internalCategory
  const setActiveCategory = onCategoryFilterChange || setInternalCategory

  // 综合过滤气体项（按分类）
  const filteredGases = useMemo(() => {
    return GAS_MATRIX_ITEMS.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false
      }
      return true
    })
  }, [activeCategory])

  return (
    <div className="space-y-3">
      {/* 1. 多维分类快筛条 */}
      <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            分类筛选:
          </span>
          {[
            { label: '全部 (13 种)', value: 'all' },
            { label: '强氧化/酸性气体 (Cl₂/SO₂/NO₂/HCl...)', value: 'acid-oxidant' },
            { label: '碱性/极易溶 (NH₃)', value: 'base-hydride' },
            { label: '中性/难溶 (NO/CO/O₂/H₂)', value: 'neutral-insoluble' },
            { label: '有机烃类 (C₂H₄/C₂H₂)', value: 'organic-hydrocarbon' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveCategory(item.value as GasCategory | 'all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === item.value
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 气体全景对比大表 */}
      <div className="space-y-2.5">
        {filteredGases.map((gas) => {
          const isExpanded = expandedGasId === gas.id
          return (
            <div
              key={gas.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'border-indigo-300 shadow-md ring-1 ring-indigo-200/50'
                  : 'border-slate-200 shadow-2xs hover:border-slate-300'
              }`}
            >
              {/* 核心行摘要 */}
              <div
                onClick={() => setExpandedGasId(isExpanded ? null : gas.id)}
                className="p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/50 transition-colors"
              >
                {/* 左侧：气体标识与分类 */}
                <div className="flex items-center gap-3 min-w-[190px]">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-700 font-bold shrink-0">
                    <span className="text-sm font-black">{gas.formula}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{gas.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {gas.categoryLabel}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span>发生: <strong className="text-slate-700">{gas.generatorType}</strong></span>
                    </div>
                  </div>
                </div>

                {/* 中间关键要素摘要徽章 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs flex-1 w-full md:w-auto">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">净化除杂</span>
                    <span className="text-[11px] font-bold text-slate-800 truncate block" title={gas.purifyReagent}>
                      {gas.purifyReagent.split('(')[0]}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">干燥试剂</span>
                    <span className="text-[11px] font-bold text-slate-800 truncate block">
                      {gas.dryReagents.join(' / ')}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">规范收集</span>
                    <span className="text-[11px] font-bold text-indigo-700 truncate block">
                      {gas.collectionMethod}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">尾气处理</span>
                    <span className="text-[11px] font-bold text-rose-700 truncate block" title={gas.tailGasMethod}>
                      {gas.tailGasMethod.split('(')[0]}
                    </span>
                  </div>
                </div>

                {/* 右侧操作按钮 */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onApplySystemPreset?.(gas.formula)
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="在装置链画布中100%加载并模拟该体系"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>装置模拟</span>
                  </button>

                  <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* 展开的深度全景面板 */}
              {isExpanded && (
                <div className="p-4 bg-slate-50/60 border-t border-slate-200 space-y-3.5">
                  {/* 1. 核心反应原理方程式 */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span>发生原理与化学反应方程式:</span>
                      <span className="text-[11px] font-normal text-slate-500">
                        (反应物: {gas.reactants})
                      </span>
                    </div>
                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs overflow-x-auto">
                      <KatexFormula formula={gas.reactionFormula} mode="block" />
                      {gas.secondaryFormula && (
                        <div className="mt-1 pt-1 border-t border-slate-200 text-slate-700">
                          <KatexFormula formula={gas.secondaryFormula} mode="block" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. 净化、干燥、收集、尾气四大环节详解 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* 净化除杂 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Droplets className="w-3.5 h-3.5 text-blue-600" />
                          净化除杂试剂与原理
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-150">
                          长进短出
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 font-semibold">
                        {gas.purifyReagent}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-relaxed">
                        {gas.purifyPrinciple}
                      </div>
                      {gas.impurities.length > 0 && (
                        <div className="text-[10px] text-amber-700 font-medium">
                          主要杂质: {gas.impurities.join('、')}
                        </div>
                      )}
                    </div>

                    {/* 干燥剂推荐与禁忌 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-emerald-600" />
                          干燥剂选择与禁忌
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-500">可用:</span>
                        {gas.dryReagents.map((d, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold"
                          >
                            ✓ {d}
                          </span>
                        ))}
                      </div>
                      {gas.incompatibleDrying.length > 0 && (
                        <div className="space-y-0.5 pt-1">
                          <span className="text-[10px] font-bold text-rose-600 block">严禁使用:</span>
                          {gas.incompatibleDrying.map((f, i) => (
                            <div key={i} className="text-[11px] text-rose-700 flex items-start gap-1 font-medium">
                              <span>❌</span>
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 收集与验满 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Beaker className="w-3.5 h-3.5 text-indigo-600" />
                        规范收集与定性验满
                      </span>
                      <div className="text-xs text-indigo-700 font-bold">
                        方法: {gas.collectionMethod}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        依据: {gas.collectionReason}
                      </div>
                      <div className="text-[11px] text-slate-800 font-medium p-1.5 rounded bg-slate-50 border border-slate-200">
                        🎯 验满方法: {gas.testAndFull}
                      </div>
                    </div>

                    {/* 尾气处理与吸收 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        尾气处理与防倒吸
                      </span>
                      <div className="text-xs text-rose-700 font-bold">
                        {gas.tailGasMethod}
                      </div>
                      {gas.tailGasReagent && (
                        <div className="p-1.5 rounded bg-slate-50 border border-slate-200 text-slate-800 text-[10px]">
                          <KatexFormula formula={gas.tailGasReagent} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. 高考必背高频失分雷区 */}
                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>高考答题规范与高频易错踩分点:</span>
                    </div>
                    <ul className="space-y-1 pl-1">
                      {gas.examTraps.map((trap, i) => (
                        <li key={i} className="text-xs text-amber-900 flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">▪</span>
                          <span className="leading-relaxed">{trap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
