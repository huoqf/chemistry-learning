import React, { useState, useMemo, useEffect } from 'react'
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
  Filter,
  Sparkles,
  AlertTriangle,
  Beaker,
  CheckCircle2,
  XCircle,
  Crosshair,
  X,
  BookOpen,
  Maximize2,
  Minimize2,
} from 'lucide-react'

interface IonCoexistenceMatrixViewProps {
  selectedPair?: { cationId: string; anionId: string } | null
  onSelectPair?: (cationId: string, anionId: string) => void
  onNavigateToBeaker?: (cationId: string, anionId: string) => void
}

type FilterCategory = 'all' | MatrixConflictCategory

// 机制极简符号与简称定义
const CATEGORY_COMPACT_BADGE: Record<
  MatrixConflictCategory,
  { symbol: string; text: string; bg: string; textCol: string; border: string }
> = {
  none: {
    symbol: '·',
    text: '',
    bg: 'bg-slate-50/60 hover:bg-emerald-50/50',
    textCol: 'text-slate-300',
    border: 'border-slate-100',
  },
  precipitate: {
    symbol: '↓',
    text: '沉淀',
    bg: 'bg-blue-50/95 hover:bg-blue-100',
    textCol: 'text-blue-700',
    border: 'border-blue-200/80',
  },
  redox: {
    symbol: '⚡',
    text: '氧化',
    bg: 'bg-purple-50/95 hover:bg-purple-100',
    textCol: 'text-purple-700',
    border: 'border-purple-200/80',
  },
  'double-hydrolysis': {
    symbol: '⇌',
    text: '双水解',
    bg: 'bg-rose-50/95 hover:bg-rose-100',
    textCol: 'text-rose-700',
    border: 'border-rose-200/80',
  },
  'gas-weak-acid': {
    symbol: '↑',
    text: '气体',
    bg: 'bg-amber-50/95 hover:bg-amber-100',
    textCol: 'text-amber-800',
    border: 'border-amber-200/80',
  },
  'acid-medium-trap': {
    symbol: '▲',
    text: '酸陷阱',
    bg: 'bg-orange-50/95 hover:bg-orange-100',
    textCol: 'text-orange-800',
    border: 'border-orange-200/80',
  },
}

export const IonCoexistenceMatrixView: React.FC<IonCoexistenceMatrixViewProps> = ({
  selectedPair,
  onSelectPair,
  onNavigateToBeaker,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')
  const [showRuleCards, setShowRuleCards] = useState<boolean>(false)
  const [isFullscreenMatrixOpen, setIsFullscreenMatrixOpen] = useState<boolean>(false)
  const [hoveredPair, setHoveredPair] = useState<{ cationId: string; anionId: string } | null>(null)
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

  // 外部 selectedPair 变更同步
  useEffect(() => {
    if (selectedPair) {
      setInternalSelectedPair(selectedPair)
    }
  }, [selectedPair])

  // ESC 键退出全屏大表或口诀弹窗
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreenMatrixOpen(false)
        setShowRuleCards(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 统计各类反应全景数量
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

  // 聚焦十字光标离子
  const focusedCation = hoveredPair?.cationId || currentPair.cationId
  const focusedAnion = hoveredPair?.anionId || currentPair.anionId

  return (
    <div className="w-full h-full p-2 flex flex-col gap-1.5 overflow-hidden text-slate-800 select-none">
      {/* 1. 顶部控制栏 (删除搜索框，纯净聚焦全景快筛) */}
      <div className="shrink-0 px-2.5 py-1.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2 flex-wrap">
        {/* 左侧：标题与口诀法则 */}
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            离子共存互斥全景矩阵
          </span>
          <span className="text-[11px] font-bold text-slate-400 font-mono hidden sm:inline">
            (14 阳 × 18 阴 = 252 组合)
          </span>

          <button
            type="button"
            onClick={() => setShowRuleCards(true)}
            className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-3 h-3 text-amber-600" />
            <span>审题黄金法则</span>
          </button>
        </div>

        {/* 中间/右侧：机制分类全景高亮快筛 */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-0.5 shrink-0">
            <Filter className="w-3 h-3" />
            全景高亮:
          </span>

          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-2 py-0.5 rounded-md text-xs font-bold border transition-all shrink-0 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            全部 ({stats.total})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter(activeFilter === 'precipitate' ? 'all' : 'precipitate')}
            className={`px-2 py-0.5 rounded-md text-xs font-bold border transition-all shrink-0 cursor-pointer flex items-center gap-0.5 ${
              activeFilter === 'precipitate'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-blue-50/60 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <span>↓ 沉淀</span>
            <span className="opacity-80">({stats.precipitateCount})</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveFilter(activeFilter === 'double-hydrolysis' ? 'all' : 'double-hydrolysis')
            }
            className={`px-2 py-0.5 rounded-md text-xs font-bold border transition-all shrink-0 cursor-pointer flex items-center gap-0.5 ${
              activeFilter === 'double-hydrolysis'
                ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                : 'bg-rose-50/60 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span>⇌ 双水解</span>
            <span className="opacity-80">({stats.doubleHydrolysisCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter(activeFilter === 'redox' ? 'all' : 'redox')}
            className={`px-2 py-0.5 rounded-md text-xs font-bold border transition-all shrink-0 cursor-pointer flex items-center gap-0.5 ${
              activeFilter === 'redox'
                ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                : 'bg-purple-50/60 text-purple-700 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <span>⚡ 氧化</span>
            <span className="opacity-80">({stats.redoxCount})</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveFilter(activeFilter === 'gas-weak-acid' ? 'all' : 'gas-weak-acid')
            }
            className={`px-2 py-0.5 rounded-md text-xs font-bold border transition-all shrink-0 cursor-pointer flex items-center gap-0.5 ${
              activeFilter === 'gas-weak-acid'
                ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                : 'bg-amber-50/60 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span>↑ 气体</span>
            <span className="opacity-80">({stats.gasWeakAcidCount})</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveFilter(activeFilter === 'acid-medium-trap' ? 'all' : 'acid-medium-trap')
            }
            className={`px-2 py-0.5 rounded-md text-xs font-bold border transition-all shrink-0 cursor-pointer flex items-center gap-0.5 ${
              activeFilter === 'acid-medium-trap'
                ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                : 'bg-orange-50/60 text-orange-700 border-orange-200 hover:bg-orange-100'
            }`}
          >
            <span>▲ 酸陷阱</span>
            <span className="opacity-80">({stats.acidTrapCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter(activeFilter === 'none' ? 'all' : 'none')}
            className={`px-2 py-0.5 rounded-md text-xs font-bold border transition-all shrink-0 cursor-pointer flex items-center gap-0.5 ${
              activeFilter === 'none'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                : 'bg-emerald-50/60 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span>· 共存</span>
            <span className="opacity-80">({stats.coexistCount})</span>
          </button>

          {/* 全屏放大按钮 */}
          <button
            type="button"
            onClick={() => setIsFullscreenMatrixOpen(true)}
            className="ml-1 p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="全屏全景显示"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. 核心 100% 满屏自适应全景矩阵 (19列 × 15行，绝对零滚动条！) */}
      <div className="flex-1 min-h-0 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 flex flex-col shadow-2xs">
        <div className="w-full h-full grid grid-cols-[46px_repeat(18,_minmax(0,_1fr))] grid-rows-[25px_repeat(14,_minmax(0,_1fr))] gap-0.5">
          {/* 左上角交叉头 */}
          <div className="bg-slate-100 border border-slate-200 rounded text-[10px] font-black text-slate-500 flex items-center justify-center">
            阳 \ 阴
          </div>

          {/* 表头：18 种阴离子列 */}
          {MATRIX_ANIONS.map((anion) => {
            const isColFocused = focusedAnion === anion.id
            return (
              <div
                key={anion.id}
                className={`rounded border text-center flex flex-col items-center justify-center transition-colors ${
                  isColFocused
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs z-10'
                    : 'bg-slate-50 text-slate-800 border-slate-200'
                }`}
                title={`${anion.id} (${anion.name})`}
              >
                <span className="text-[10.5px] font-black font-mono leading-none tracking-tight">
                  {anion.id}
                </span>
              </div>
            )
          })}

          {/* 14 行阳离子数据行 */}
          {MATRIX_CATIONS.map((cation) => {
            const isRowFocused = focusedCation === cation.id

            return (
              <React.Fragment key={cation.id}>
                {/* 阳离子行头 */}
                <div
                  className={`rounded border text-center flex flex-col items-center justify-center transition-colors ${
                    isRowFocused
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs z-10'
                      : 'bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                  title={`${cation.id} (${cation.name})`}
                >
                  <span className="text-[11px] font-black font-mono leading-none tracking-tight">
                    {cation.id}
                  </span>
                </div>

                {/* 18 个对应交叉单元格 */}
                {MATRIX_ANIONS.map((anion) => {
                  const cell = getIonPairCell(cation.id, anion.id)
                  const isSelected =
                    currentPair.cationId === cation.id && currentPair.anionId === anion.id
                  const isCrosshairAxis =
                    hoveredPair &&
                    (hoveredPair.cationId === cation.id || hoveredPair.anionId === anion.id)

                  const isCategoryMatch =
                    activeFilter === 'all' || cell.category === activeFilter
                  const isDimmed = !isCategoryMatch

                  const badgeCfg = CATEGORY_COMPACT_BADGE[cell.category]

                  return (
                    <div
                      key={`${cation.id}-${anion.id}`}
                      onClick={() => handleCellClick(cation.id, anion.id)}
                      onMouseEnter={() =>
                        setHoveredPair({ cationId: cation.id, anionId: anion.id })
                      }
                      onMouseLeave={() => setHoveredPair(null)}
                      className={`h-full w-full rounded border transition-all cursor-pointer flex items-center justify-center relative overflow-hidden ${
                        isSelected
                          ? 'ring-2 ring-blue-600 z-20 scale-[1.03] shadow-md ' +
                            badgeCfg.bg +
                            ' ' +
                            badgeCfg.border
                          : isCrosshairAxis
                          ? 'bg-blue-50/60 ' + badgeCfg.border
                          : isDimmed
                          ? 'opacity-15 bg-slate-50/40 border-slate-100'
                          : badgeCfg.bg + ' ' + badgeCfg.border
                      }`}
                      title={`${cation.id} + ${anion.id} : ${cell.badgeLabel} (${
                        cell.productSummary || (cell.status === 'coexist' ? '可大量共存' : cell.phenomenon)
                      })`}
                    >
                      {cell.category === 'none' ? (
                        <span className="text-slate-300 text-xs select-none">·</span>
                      ) : (
                        <div
                          className={`flex items-center justify-center gap-0.5 font-black leading-none ${badgeCfg.textCol} tracking-tighter`}
                        >
                          <span className="text-[10px]">{badgeCfg.symbol}</span>
                          <span className="text-[9.5px] hidden xl:inline">{badgeCfg.text}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* 3. 底部联动：当前选中离子对深度机理与高考真题剖析卡 (紧凑固定，联动响应) */}
      <div className="shrink-0 p-2 bg-white rounded-xl border-2 border-blue-200 shadow-2xs space-y-1.5">
        {/* 第一排：离子对标题、状态徽章与跳转按钮 */}
        <div className="flex items-center justify-between gap-2">
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

            <span className="text-xs md:text-sm font-extrabold text-slate-900">
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
              className="px-2 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <Beaker className="w-3.5 h-3.5" />
              导入烧杯微观模拟
            </button>
          )}
        </div>

        {/* 第二排：三列紧凑考点解析 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
          {/* 离子方程式 */}
          <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              离子反应方程式
            </span>
            <div className="text-xs font-semibold text-slate-900 truncate">
              {currentCell.equation ? (
                <KatexFormula formula={currentCell.equation} mode="inline" />
              ) : (
                <span className="text-xs text-slate-500">不发生化学反应，无离子方程式</span>
              )}
            </div>
          </div>

          {/* 宏观特征现象与机理 */}
          <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              宏观现象与反应机理
            </span>
            <p className="text-xs text-slate-800 leading-snug font-medium line-clamp-2">
              {currentCell.phenomenon}
            </p>
          </div>

          {/* 高考命题陷阱与考点警示 */}
          <div className="p-1.5 rounded-lg bg-amber-50/70 border border-amber-200 space-y-0.5">
            <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              高考命题陷阱与母题警示
            </span>
            <p className="text-xs text-amber-900 leading-snug line-clamp-2">
              {currentCell.examTrap ||
                '基础离子共存考查点，审题时注意题目是否附带“无色透明”、“酸性/碱性”等前置条件。'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. 审题黄金法则模态弹窗 (完全不挤占中屏高度) */}
      {showRuleCards && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-4 space-y-3 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-sm md:text-base font-bold text-slate-900">
                  高考四大离子共存审题黄金法则
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRuleCards(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {COEXISTENCE_RULE_CARDS.map((card) => (
                <div
                  key={card.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{card.title}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      {card.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.rule}</p>
                  <div className="p-1.5 rounded-lg bg-amber-50/90 border border-amber-200/70 text-[11px] text-amber-900 font-medium leading-relaxed">
                    <span className="font-bold text-amber-800">避坑要点：</span>
                    {card.tip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. 全屏全景大表模态窗口 */}
      {isFullscreenMatrixOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col p-3 md:p-5 animate-in fade-in duration-150">
          <div className="w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 p-2 gap-2">
            {/* 顶栏控制栏 */}
            <div className="shrink-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h2 className="text-sm md:text-base font-extrabold text-slate-900">
                  离子共存互斥全景矩阵 (宽屏全景视窗)
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 font-bold">
                  <Crosshair className="w-3.5 h-3.5 text-blue-600" />
                  <span>当前聚焦：</span>
                  <span className="text-blue-700 font-mono">
                    {currentPair.cationId} × {currentPair.anionId}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFullscreenMatrixOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>退出全屏 [Esc]</span>
                </button>
              </div>
            </div>

            {/* 全屏全景自适应矩阵 */}
            <div className="flex-1 min-h-0 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 flex flex-col">
              <div className="w-full h-full grid grid-cols-[56px_repeat(18,_minmax(0,_1fr))] grid-rows-[30px_repeat(14,_minmax(0,_1fr))] gap-0.5">
                <div className="bg-slate-100 border border-slate-200 rounded text-xs font-black text-slate-500 flex items-center justify-center">
                  阳 \ 阴
                </div>

                {MATRIX_ANIONS.map((anion) => {
                  const isColFocused = focusedAnion === anion.id
                  return (
                    <div
                      key={anion.id}
                      className={`rounded border text-center flex flex-col items-center justify-center transition-colors ${
                        isColFocused
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs z-10'
                          : 'bg-slate-50 text-slate-800 border-slate-200'
                      }`}
                    >
                      <span className="text-xs font-black font-mono">{anion.id}</span>
                    </div>
                  )
                })}

                {MATRIX_CATIONS.map((cation) => {
                  const isRowFocused = focusedCation === cation.id
                  return (
                    <React.Fragment key={cation.id}>
                      <div
                        className={`rounded border text-center flex flex-col items-center justify-center transition-colors ${
                          isRowFocused
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs z-10'
                            : 'bg-slate-50 text-slate-800 border-slate-200'
                        }`}
                      >
                        <span className="text-xs font-black font-mono">{cation.id}</span>
                      </div>

                      {MATRIX_ANIONS.map((anion) => {
                        const cell = getIonPairCell(cation.id, anion.id)
                        const isSelected =
                          currentPair.cationId === cation.id && currentPair.anionId === anion.id
                        const isCrosshairAxis =
                          hoveredPair &&
                          (hoveredPair.cationId === cation.id || hoveredPair.anionId === anion.id)
                        const isCategoryMatch =
                          activeFilter === 'all' || cell.category === activeFilter
                        const isDimmed = !isCategoryMatch
                        const badgeCfg = CATEGORY_COMPACT_BADGE[cell.category]

                        return (
                          <div
                            key={`fs-${cation.id}-${anion.id}`}
                            onClick={() => handleCellClick(cation.id, anion.id)}
                            onMouseEnter={() =>
                              setHoveredPair({ cationId: cation.id, anionId: anion.id })
                            }
                            onMouseLeave={() => setHoveredPair(null)}
                            className={`h-full w-full rounded border transition-all cursor-pointer flex items-center justify-center relative overflow-hidden ${
                              isSelected
                                ? 'ring-2 ring-blue-600 z-20 scale-[1.03] shadow-md ' +
                                  badgeCfg.bg +
                                  ' ' +
                                  badgeCfg.border
                                : isCrosshairAxis
                                ? 'bg-blue-50/60 ' + badgeCfg.border
                                : isDimmed
                                ? 'opacity-15 bg-slate-50/40 border-slate-100'
                                : badgeCfg.bg + ' ' + badgeCfg.border
                            }`}
                          >
                            {cell.category === 'none' ? (
                              <span className="text-slate-300 text-sm select-none">·</span>
                            ) : (
                              <div
                                className={`flex items-center justify-center gap-1 font-black leading-none ${badgeCfg.textCol}`}
                              >
                                <span className="text-xs">{badgeCfg.symbol}</span>
                                <span className="text-[11px]">{badgeCfg.text}</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>

            {/* 全屏底栏深度解析 */}
            <div className="shrink-0 p-2.5 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      currentCell.status === 'coexist'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {currentCell.status === 'coexist' ? '大量共存' : '互斥反应'}
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    【{currentCell.cationId} + {currentCell.anionId}】深度解析
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {currentCell.equation || '不发生反应'}
                  </span>
                </div>

                {onNavigateToBeaker && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsFullscreenMatrixOpen(false)
                      onNavigateToBeaker(currentCell.cationId, currentCell.anionId)
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Beaker className="w-3.5 h-3.5" />
                    导入烧杯微观模拟
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
