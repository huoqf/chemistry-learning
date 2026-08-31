import React, { useState, useMemo } from 'react'
import {
  MATRIX_CATIONS,
  MATRIX_ANIONS,
  CONFLICT_CATEGORY_CONFIG,
  COEXISTENCE_RULE_CARDS,
  getIonPairCell,
} from '../data/coexistenceMatrixData'
import type { MatrixConflictCategory, IonPairCell } from '../types'
import { KatexFormula } from '@/components/UI'
import {
  Search,
  Filter,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Beaker,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

interface IonCoexistenceMatrixViewProps {
  selectedPair?: { cationId: string; anionId: string } | null
  onSelectPair?: (cationId: string, anionId: string) => void
  onNavigateToBeaker?: (cationId: string, anionId: string) => void
}

type FilterCategory = 'all' | MatrixConflictCategory

export const IonCoexistenceMatrixView: React.FC<IonCoexistenceMatrixViewProps> = ({
  selectedPair,
  onSelectPair,
  onNavigateToBeaker,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showRuleCards, setShowRuleCards] = useState<boolean>(false)
  const [internalSelectedPair, setInternalSelectedPair] = useState<{
    cationId: string
    anionId: string
  }>({
    cationId: selectedPair?.cationId || 'Al3+',
    anionId: selectedPair?.anionId || 'HCO3-',
  })

  // 当前选中的离子对
  const currentPair = selectedPair || internalSelectedPair
  const currentCell: IonPairCell = useMemo(() => {
    return getIonPairCell(currentPair.cationId, currentPair.anionId)
  }, [currentPair.cationId, currentPair.anionId])

  // 统计各类反应数量
  const stats = useMemo(() => {
    let total = 0
    let coexistCount = 0
    let precipitateCount = 0
    let redoxCount = 0
    let doubleHydrolysisCount = 0
    let gasWeakAcidCount = 0
    let acidTrapCount = 0

    MATRIX_CATIONS.forEach((c) => {
      MATRIX_ANIONS.forEach((a) => {
        total++
        const cell = getIonPairCell(c.id, a.id)
        if (cell.category === 'none') coexistCount++
        else if (cell.category === 'precipitate') precipitateCount++
        else if (cell.category === 'redox') redoxCount++
        else if (cell.category === 'double-hydrolysis') doubleHydrolysisCount++
        else if (cell.category === 'gas-weak-acid') gasWeakAcidCount++
        else if (cell.category === 'acid-medium-trap') acidTrapCount++
      })
    })

    return {
      total,
      coexistCount,
      precipitateCount,
      redoxCount,
      doubleHydrolysisCount,
      gasWeakAcidCount,
      acidTrapCount,
    }
  }, [])

  const handleCellClick = (cationId: string, anionId: string) => {
    setInternalSelectedPair({ cationId, anionId })
    onSelectPair?.(cationId, anionId)
  }

  // 搜索判定匹配
  const isCellMatchSearch = (cell: IonPairCell, query: string) => {
    if (!query) return true
    const q = query.toLowerCase().trim()
    return (
      cell.cationId.toLowerCase().includes(q) ||
      cell.anionId.toLowerCase().includes(q) ||
      cell.badgeLabel.toLowerCase().includes(q) ||
      (cell.productSummary && cell.productSummary.toLowerCase().includes(q)) ||
      cell.phenomenon.toLowerCase().includes(q) ||
      cell.reason.toLowerCase().includes(q) ||
      (cell.examTrap && cell.examTrap.toLowerCase().includes(q))
    )
  }

  return (
    <div className="w-full h-full p-3 overflow-y-auto overflow-x-hidden space-y-3 text-slate-800 bg-slate-50/40">
      {/* 1. 顶部：四大高考离子共存审题法则（默认轻量折叠，支持展开） */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-blue-100 text-blue-700">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-slate-900 text-xs md:text-sm">
              高考四大离子共存审题黄金法则
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              （介质酸碱一票否决 / 隐蔽氧化还原 / 泡沫灭火器双水解 / 无色透明限制）
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowRuleCards((prev) => !prev)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            {showRuleCards ? '收起口诀' : '展开口诀'}
            {showRuleCards ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showRuleCards && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 border-t border-slate-100">
            {COEXISTENCE_RULE_CARDS.map((card) => (
              <div
                key={card.id}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1 hover:bg-blue-50/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{card.title}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-800">
                    {card.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{card.rule}</p>
                <div className="p-1.5 rounded bg-amber-50/80 border border-amber-200/60 text-[10px] text-amber-900 font-medium leading-tight">
                  <span className="font-bold text-amber-800">避坑：</span>
                  {card.tip}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. 筛选控制栏与数据统计 */}
      <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          {/* 分类快筛标签 */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" />
              快筛:
            </span>

            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-2 py-0.5 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              全部 ({stats.total})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('precipitate')}
              className={`px-2 py-0.5 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                activeFilter === 'precipitate'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-blue-50/60 text-blue-700 border-blue-200 hover:bg-blue-100'
              }`}
            >
              沉淀 ({stats.precipitateCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('double-hydrolysis')}
              className={`px-2 py-0.5 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                activeFilter === 'double-hydrolysis'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                  : 'bg-rose-50/60 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
            >
              双水解 ({stats.doubleHydrolysisCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('redox')}
              className={`px-2 py-0.5 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                activeFilter === 'redox'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                  : 'bg-purple-50/60 text-purple-700 border-purple-200 hover:bg-purple-100'
              }`}
            >
              氧化还原 ({stats.redoxCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('gas-weak-acid')}
              className={`px-2 py-0.5 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                activeFilter === 'gas-weak-acid'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-amber-50/60 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              气体/弱酸 ({stats.gasWeakAcidCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('acid-medium-trap')}
              className={`px-2 py-0.5 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                activeFilter === 'acid-medium-trap'
                  ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                  : 'bg-orange-50/60 text-orange-700 border-orange-200 hover:bg-orange-100'
              }`}
            >
              酸性陷阱 ({stats.acidTrapCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('none')}
              className={`px-2 py-0.5 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                activeFilter === 'none'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-emerald-50/60 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              共存 ({stats.coexistCount})
            </button>
          </div>

          {/* 实时搜索框 */}
          <div className="relative w-full md:w-48 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索离子或反应..."
              className="w-full pl-7 pr-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 3. 11×12 全景自适应网格大表 (table-fixed 100% 满宽，无横向滚动条，无局部嵌套滚动) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full table-fixed border-collapse text-center">
          {/* 表头：阴离子 (列) */}
          <thead className="bg-slate-100 text-slate-800 border-b border-slate-200">
            <tr>
              <th className="p-1 border-r border-slate-200 font-bold text-[10px] md:text-xs text-slate-700 bg-slate-200/70 w-[9%]">
                阳 \ 阴
              </th>
              {MATRIX_ANIONS.map((anion) => (
                <th
                  key={anion.id}
                  className="p-1 border-r border-slate-200 text-center font-bold"
                  style={{ width: `${91 / 12}%` }}
                >
                  <div className="text-[10px] md:text-[11px] font-extrabold text-slate-900 leading-tight">
                    {anion.id}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* 表体：阳离子 (行) */}
          <tbody>
            {MATRIX_CATIONS.map((cation) => (
              <tr key={cation.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                {/* 阳离子行头 */}
                <th className="p-1 border-r border-slate-200 font-bold bg-slate-100/90 text-slate-900 text-center">
                  <div className="text-[10px] md:text-xs font-extrabold text-blue-950 leading-tight truncate">
                    {cation.id}
                  </div>
                </th>

                {/* 交叉单元格 */}
                {MATRIX_ANIONS.map((anion) => {
                  const cell = getIonPairCell(cation.id, anion.id)
                  const isSelected =
                    currentPair.cationId === cation.id && currentPair.anionId === anion.id

                  // 筛选与搜索高亮判定
                  const isCategoryMatch =
                    activeFilter === 'all' || cell.category === activeFilter
                  const isSearchMatch = isCellMatchSearch(cell, searchQuery)
                  const isDimmed = !isCategoryMatch || !isSearchMatch

                  const categoryConfig = CONFLICT_CATEGORY_CONFIG[cell.category]

                  return (
                    <td
                      key={`${cation.id}-${anion.id}`}
                      onClick={() => handleCellClick(cation.id, anion.id)}
                      className={`p-0.5 border-r border-slate-200 cursor-pointer transition-all ${
                        isSelected
                          ? 'ring-2 ring-blue-600 bg-blue-100 z-10'
                          : isDimmed
                          ? 'opacity-20 bg-slate-50/40'
                          : 'hover:bg-blue-50/60'
                      }`}
                      title={`${cation.id} + ${anion.id}: ${cell.badgeLabel} (${cell.phenomenon})`}
                    >
                      <div
                        className={`h-7 md:h-8 rounded text-[9px] md:text-[10px] font-bold border transition-all flex flex-col items-center justify-center p-0.5 leading-none ${
                          cell.status === 'coexist'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : `${categoryConfig.badgeBg} ${categoryConfig.borderColor}`
                        }`}
                      >
                        <span className="truncate w-full text-center">{cell.badgeLabel}</span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. 底部：当前选中离子对深度机理与高考真题剖析卡 */}
      <div className="p-3.5 bg-white rounded-xl border-2 border-blue-200/90 shadow-2xs space-y-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1 ${
                currentCell.status === 'coexist'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              {currentCell.status === 'coexist' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              {currentCell.status === 'coexist' ? '可以大量共存' : '不能大量共存 (互斥)'}
            </span>

            <span className="text-sm md:text-base font-extrabold text-slate-900">
              【{currentCell.cationId} + {currentCell.anionId}】反应机理深度解析
            </span>

            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                CONFLICT_CATEGORY_CONFIG[currentCell.category].badgeBg
              }`}
            >
              {CONFLICT_CATEGORY_CONFIG[currentCell.category].label}
            </span>
          </div>

          {onNavigateToBeaker && (
            <button
              type="button"
              onClick={() => onNavigateToBeaker(currentCell.cationId, currentCell.anionId)}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer self-start md:self-auto"
            >
              <Beaker className="w-3.5 h-3.5" />
              导入烧杯微观模拟
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-0.5">
          {/* 离子反应方程式 */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              离子反应方程式
            </span>
            <div className="pt-0.5 text-xs md:text-sm font-semibold text-slate-900">
              {currentCell.equation ? (
                <KatexFormula formula={currentCell.equation} mode="inline" />
              ) : (
                <span className="text-xs text-slate-500">不发生化学反应，无离子方程式</span>
              )}
            </div>
          </div>

          {/* 宏观特征现象与机理 */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              宏观现象与反应机理
            </span>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {currentCell.phenomenon}
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">{currentCell.reason}</p>
          </div>

          {/* 高考命题陷阱与考点警示 */}
          <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 space-y-1">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              高考命题陷阱与母题警示
            </span>
            <p className="text-xs text-amber-900 leading-relaxed">
              {currentCell.examTrap ||
                '基础离子共存考查点，审题时注意题目是否附带“无色透明”、“酸性/碱性”等前置条件。'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
