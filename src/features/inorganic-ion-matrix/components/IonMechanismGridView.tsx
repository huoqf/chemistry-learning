import React, { useState, useMemo } from 'react'
import { MECHANISM_GROUPS } from '../data/mechanismGridData'
import type { MechanismDimensionId } from '../types'
import {
  Sparkles,
  Beaker,
  ShieldAlert,
  Flame,
  Zap,
  Filter,
  Layers,
} from 'lucide-react'

interface IonMechanismGridViewProps {
  selectedPair?: { cationId: string; anionId: string } | null
  onSelectPair?: (cationId: string, anionId: string) => void
  onNavigateToBeaker?: (cationId: string, anionId: string) => void
}

type FilterType = 'all' | MechanismDimensionId

const DIMENSION_ICONS: Record<MechanismDimensionId, React.ReactNode> = {
  'double-hydrolysis': <Flame className="w-3.5 h-3.5 text-rose-600" />,
  'redox-hidden': <Zap className="w-3.5 h-3.5 text-purple-600" />,
  'precipitate-trap': <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />,
  'gas-weak-acid': <Sparkles className="w-3.5 h-3.5 text-amber-600" />,
}

const TAG_BADGE_STYLES: Record<string, string> = {
  必考: 'bg-red-100 text-red-700 border-red-200',
  高频: 'bg-amber-100 text-amber-700 border-amber-200',
  易错: 'bg-purple-100 text-purple-700 border-purple-200',
  压轴: 'bg-blue-100 text-blue-700 border-blue-200',
}

export const IonMechanismGridView: React.FC<IonMechanismGridViewProps> = ({
  selectedPair,
  onSelectPair,
  onNavigateToBeaker,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const filteredGroups = useMemo(() => {
    if (activeFilter === 'all') return MECHANISM_GROUPS
    return MECHANISM_GROUPS.filter((g) => g.id === activeFilter)
  }, [activeFilter])

  const isSingleGroup = filteredGroups.length === 1

  return (
    <div className="w-full h-full flex flex-col p-2.5 gap-2 overflow-hidden select-none bg-slate-50/50">
      {/* 1. 顶栏控制台：机理归类理念与快速筛选条 */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-2xs shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-xs">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>新高考 4 大互斥维度九宫格</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            “不按元素周期排，按高考命题考法排” · 28 组核心母题芯片
          </span>
        </div>

        {/* 维度切换过滤器 */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 border cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>全景 (28)</span>
          </button>
          {MECHANISM_GROUPS.map((g) => {
            const isActive = activeFilter === g.id
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveFilter(g.id)}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 border cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-950 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {DIMENSION_ICONS[g.id]}
                <span className="truncate max-w-[80px]">{g.title.slice(2, 6)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. 主卡片区：2×2 紧凑四分屏九宫格阵列（单屏无滚动条自适应） */}
      <div
        className={`flex-1 min-h-0 grid gap-2.5 ${
          isSingleGroup
            ? 'grid-cols-1 grid-rows-1'
            : 'grid-cols-1 md:grid-cols-2 grid-rows-2'
        }`}
      >
        {filteredGroups.map((group) => {
          return (
            <div
              key={group.id}
              className={`flex flex-col rounded-xl border bg-white shadow-2xs overflow-hidden transition-all ${group.borderColor}`}
            >
              {/* 卡片头部 */}
              <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="p-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    {DIMENSION_ICONS[group.id]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-slate-900 truncate">
                        {group.title}
                      </h3>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold border ${group.badgeBg}`}
                      >
                        {group.items.length} 核心组
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate leading-none mt-0.5">
                      {group.subtitle}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-medium hidden lg:block max-w-[200px] truncate text-right">
                  {group.examFocus}
                </div>
              </div>

              {/* 卡片主体：母题芯片阵列 (Grid 布局单屏完全自适应) */}
              <div className="p-2 flex-1 min-h-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 content-start overflow-hidden">
                {group.items.map((item) => {
                  const isSelected =
                    (selectedPair?.cationId === item.cationId &&
                      selectedPair?.anionId === item.anionId) ||
                    (selectedPair?.cationId === item.anionId &&
                      selectedPair?.anionId === item.cationId)

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectPair?.(item.cationId, item.anionId)}
                      className={`relative flex flex-col justify-between p-1.5 rounded-lg border transition-all cursor-pointer group text-left ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-500 shadow-sm ring-1 ring-blue-400'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      {/* 芯片头部：反应标题与考法标签 */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1 truncate">
                          <span className="text-slate-900">{item.cationId}</span>
                          <span className="text-slate-400 text-[9px]">×</span>
                          <span className="text-slate-900">{item.anionId}</span>
                        </span>
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-bold border shrink-0 ${
                            TAG_BADGE_STYLES[item.tag] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.tag}
                        </span>
                      </div>

                      {/* 核心产物简写 */}
                      <div className="text-[10px] font-semibold text-blue-800 bg-blue-50/60 px-1 py-0.5 rounded border border-blue-100/80 truncate mb-1">
                        {item.productSummary}
                      </div>

                      {/* 考法点睛与速测入口 */}
                      <div className="flex items-center justify-between text-[9px] text-slate-500 mt-auto pt-0.5 border-t border-slate-100">
                        <span className="truncate max-w-[90px]" title={item.examTrap}>
                          {item.phenomenon}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onNavigateToBeaker?.(item.cationId, item.anionId)
                          }}
                          className="text-[9px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="带入烧杯模拟观察反应"
                        >
                          <Beaker className="w-2.5 h-2.5" />
                          <span>模拟</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
