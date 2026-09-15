import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layers,
  ArrowRight,
  Beaker,
  BookOpen,
  Sparkles,
  Zap,
} from 'lucide-react'
import type { ElementValenceConfig, ValenceSubstanceNode, ValenceTransformation } from '@/data/valence-matrix'
import { ChemicalFormula } from '@/components/UI'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { matchesSubstance, getSubstancePhysicalState, getElementKnowledgeNodes } from './utils'
import { ChemicalEquationView } from './ChemicalEquationView'

export interface ValenceRightPanelProps {
  currentConfig: ElementValenceConfig
  selectedSubstance: ValenceSubstanceNode | null
  targetSubstance?: ValenceSubstanceNode | null
  activePairTransformation?: ValenceTransformation | null
}

type TransformationFilter = 'all' | 'oxidation' | 'reduction' | 'other'

/**
 * 获取反应类型友好简短标签（最多 4~5 个字符，专供右上角紧凑徽章）
 */
function getTransformationShortBadge(type: ValenceTransformation['type']): { label: string; className: string } {
  switch (type) {
    case 'oxidation':
      return { label: '↑ 氧化', className: 'text-rose-800 bg-rose-100 border-rose-200' }
    case 'reduction':
      return { label: '↓ 还原', className: 'text-blue-800 bg-blue-100 border-blue-200' }
    case 'disproportionation':
      return { label: '⇋ 歧化', className: 'text-purple-800 bg-purple-100 border-purple-200' }
    case 'comproportionation':
      return { label: '⇌ 归中', className: 'text-indigo-800 bg-indigo-100 border-indigo-200' }
    default:
      return { label: '↔ 类别', className: 'text-emerald-800 bg-emerald-100 border-emerald-200' }
  }
}

/**
 * ValenceRightPanel — 无机元素“价类二维矩阵”右屏全景档案面板
 *
 * 核心优化：
 * 1. 彻底解决文本溢出截断：将长句机理解释 (electronTransfer) 解耦为独立的教学机理信息行，绝不作为首行不换行徽章；
 * 2. 移除全量不当的 truncate 属性，长物质名与长描述全部采用 break-words 规范自然换行；
 * 3. 严格无嵌套滚动与无水平溢出，自适应保障所有屏幕宽度下内容 100% 完整展示；
 * 4. 优化各模块层级：首屏可见性高、字号适中（≥12px）、化学式不拆断、水平空间充分释放。
 */
export const ValenceRightPanel: React.FC<ValenceRightPanelProps> = ({
  currentConfig,
  selectedSubstance,
  targetSubstance,
  activePairTransformation,
}) => {
  const navigate = useNavigate()
  const modelNode = getGaokaoModel('model-valence-matrix')
  const [filterType, setFilterType] = useState<TransformationFilter>('all')

  // 1. 计算物理聚集状态
  const physicalState = useMemo(() => {
    if (!selectedSubstance) return '澄清离子水溶液'
    return getSubstancePhysicalState(selectedSubstance)
  }, [selectedSubstance])

  // 2. 焦点物质的所有转化路径
  const upwardOxidations = useMemo(() => {
    if (!selectedSubstance) return []
    return currentConfig.transformations.filter(
      t => matchesSubstance(t.fromSubstance, selectedSubstance.substance) && t.type === 'oxidation'
    )
  }, [selectedSubstance, currentConfig])

  const downwardReductions = useMemo(() => {
    if (!selectedSubstance) return []
    return currentConfig.transformations.filter(
      t => matchesSubstance(t.fromSubstance, selectedSubstance.substance) && t.type === 'reduction'
    )
  }, [selectedSubstance, currentConfig])

  const otherTransformations = useMemo(() => {
    if (!selectedSubstance) return []
    return currentConfig.transformations.filter(
      t =>
        matchesSubstance(t.fromSubstance, selectedSubstance.substance) &&
        t.type !== 'oxidation' &&
        t.type !== 'reduction'
    )
  }, [selectedSubstance, currentConfig])

  // 当前激活列表
  const displayedTransformations = useMemo(() => {
    if (filterType === 'oxidation') return upwardOxidations
    if (filterType === 'reduction') return downwardReductions
    if (filterType === 'other') return otherTransformations
    return [...upwardOxidations, ...downwardReductions, ...otherTransformations]
  }, [filterType, upwardOxidations, downwardReductions, otherTransformations])

  // 3. 当前元素关联课标知识节点
  const currentElementKnowledgeNodes = useMemo(() => {
    return getElementKnowledgeNodes(currentConfig.symbol)
  }, [currentConfig.symbol])

  const totalTransformCount = upwardOxidations.length + downwardReductions.length + otherTransformations.length

  return (
    <div className="w-full h-full flex flex-col gap-3 p-2.5 bg-slate-50/50 overflow-y-auto font-sans min-w-0">
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 状态 A：双选推演深度联动置顶卡片 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activePairTransformation && targetSubstance && selectedSubstance && (
        <div className="p-3 rounded-xl border border-amber-300 bg-amber-50/90 shadow-2xs flex flex-col gap-2 min-w-0 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>推演路径深度剖析</span>
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-950 border border-amber-300">
              {getTransformationShortBadge(activePairTransformation.type).label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-sm font-black text-slate-900 bg-white/90 px-2.5 py-1.5 rounded-lg border border-amber-200">
            <ChemicalFormula formula={selectedSubstance.substance} />
            <span className="text-amber-600 font-bold px-1">➔</span>
            <ChemicalFormula formula={targetSubstance.substance} />
          </div>

          <div className="text-xs text-slate-800 flex items-start gap-1.5 leading-relaxed break-words">
            <span className="font-bold text-amber-900 shrink-0">所需试剂:</span>
            <span className="font-medium">{activePairTransformation.reagent}</span>
          </div>

          {activePairTransformation.electronTransfer && (
            <div className="text-xs text-amber-950 bg-amber-100/60 p-2 rounded-lg border border-amber-200/80 flex items-start gap-1.5 leading-relaxed break-words">
              <Zap className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-amber-900 mr-1">转移机理:</span>
                <span className="font-medium">{activePairTransformation.electronTransfer}</span>
              </div>
            </div>
          )}

          {activePairTransformation.equation && (
            <div className="p-2 bg-white rounded-lg border border-amber-200/90 text-xs">
              <div className="text-[11px] font-bold text-slate-500 mb-1">规范配平方程式：</div>
              <ChemicalEquationView equation={activePairTransformation.equation} className="text-xs font-bold" />
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 模块 1：焦点物质全景档案卡 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {selectedSubstance ? (
        <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col gap-2.5 min-w-0">
          {/* 顶栏：化学式与关键标签（不截断，自适应折行） */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-300 shadow-2xs"
                style={{ backgroundColor: selectedSubstance.rgbColor || '#CBD5E1' }}
              />
              <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5 break-words">
                <ChemicalFormula formula={selectedSubstance.substance} />
                <span className="text-xs font-normal text-slate-400">全景档案</span>
              </h3>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded-md border border-indigo-200">
                {selectedSubstance.valence > 0 ? `+${selectedSubstance.valence}` : selectedSubstance.valence} 价
              </span>
              <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                {selectedSubstance.category}
              </span>
            </div>
          </div>

          {/* 属性栅格：聚集态 + 外观颜色（支持正常折行） */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-0.5 min-w-0">
              <span className="text-slate-400 text-[11px]">聚集形态</span>
              <span className="font-bold text-slate-800 break-words">{physicalState}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-0.5 min-w-0">
              <span className="text-slate-400 text-[11px]">外观与颜色</span>
              <span className="font-bold text-slate-800 break-words">{selectedSubstance.colorText}</span>
            </div>
          </div>

          {/* 性质定位与角色 */}
          {selectedSubstance.roleDescription && (
            <div className="text-xs text-slate-800 bg-indigo-50/60 p-2 rounded-lg border border-indigo-100 flex items-start gap-1 leading-relaxed break-words">
              <span className="font-bold text-indigo-900 shrink-0">性质定位:</span>
              <span className="font-medium text-slate-700">{selectedSubstance.roleDescription}</span>
            </div>
          )}

          {/* 特征实验现象与判分点 */}
          {selectedSubstance.testReaction && (
            <div className="text-xs bg-slate-50 p-2 rounded-lg border border-slate-200/80 flex flex-col gap-1 leading-relaxed break-words">
              <span className="flex items-center gap-1 font-bold text-rose-700">
                <Beaker className="w-3.5 h-3.5 shrink-0" />
                <span>高考特征实验与现象判分点：</span>
              </span>
              <span className="text-slate-700 font-medium">{selectedSubstance.testReaction}</span>
            </div>
          )}

          {/* 规范高考离子/化学方程式（智能规范换行） */}
          {selectedSubstance.equation && (
            <div className="text-xs bg-indigo-50/40 border border-indigo-100 p-2 rounded-lg flex flex-col gap-1">
              <span className="text-[11px] text-indigo-800 font-bold">
                高考规范化学 / 离子方程式：
              </span>
              <ChemicalEquationView equation={selectedSubstance.equation} className="text-xs text-indigo-950 font-bold" />
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* 价态升降核心转化链（胶囊过滤 + 结构化多行展示） */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-2 pt-1 border-t border-slate-100 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>核心转化链</span>
                <span className="text-slate-400 font-normal">({totalTransformCount})</span>
              </span>

              {/* 维度胶囊切换 */}
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    filterType === 'all'
                      ? 'bg-slate-800 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  全部
                </button>
                {upwardOxidations.length > 0 && (
                  <button
                    onClick={() => setFilterType('oxidation')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      filterType === 'oxidation'
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    ↑氧化({upwardOxidations.length})
                  </button>
                )}
                {downwardReductions.length > 0 && (
                  <button
                    onClick={() => setFilterType('reduction')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      filterType === 'reduction'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    ↓还原({downwardReductions.length})
                  </button>
                )}
                {otherTransformations.length > 0 && (
                  <button
                    onClick={() => setFilterType('other')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      filterType === 'other'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    ↔类别({otherTransformations.length})
                  </button>
                )}
              </div>
            </div>

            {/* 转化条目列表 */}
            {displayedTransformations.length > 0 ? (
              <div className="flex flex-col gap-2 min-w-0">
                {displayedTransformations.map(t => {
                  const badge = getTransformationShortBadge(t.type)

                  return (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex flex-col gap-1.5 text-xs transition-colors min-w-0"
                    >
                      {/* 1. 标题行：反应物 ➔ 产物，右上角为简明类型徽章 */}
                      <div className="flex flex-wrap items-center justify-between gap-1 min-w-0">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5 break-words">
                          <ChemicalFormula formula={t.fromSubstance} />
                          <span className="text-slate-400 font-bold px-0.5">➔</span>
                          <ChemicalFormula formula={t.toSubstance} />
                        </div>
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>

                      {/* 2. 所需试剂行 */}
                      <div className="text-slate-700 flex items-start gap-1 leading-relaxed break-words">
                        <span className="text-slate-500 font-bold shrink-0">试剂:</span>
                        <span className="font-medium text-slate-800">{t.reagent}</span>
                      </div>

                      {/* 3. 电子转移与教学机理行（独立多行通栏展开，杜绝截断与溢出） */}
                      {t.electronTransfer && (
                        <div className="p-1.5 rounded bg-white/90 border border-slate-200/80 text-xs text-slate-800 flex items-start gap-1.5 leading-relaxed break-words shadow-2xs">
                          <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-slate-900 mr-1">机理:</span>
                            <span className="text-slate-700 font-medium">{t.electronTransfer}</span>
                          </div>
                        </div>
                      )}

                      {/* 4. 规范离子/化学方程式 */}
                      {t.equation && (
                        <div className="pt-1 border-t border-slate-200/70">
                          <ChemicalEquationView equation={t.equation} className="text-xs text-slate-900 font-bold" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-3 text-xs text-slate-400 bg-slate-50 rounded-lg">
                该分类下暂无专属转化路径
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-white rounded-xl border border-slate-200 text-center flex flex-col items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <div className="text-xs font-bold text-slate-800">请在中屏选择物质节点</div>
          <div className="text-xs text-slate-500">点击二维网格中的任意物质，即刻展开高考全景档案与性质拆解。</div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 模块 2：高考必考要点提炼 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col gap-2 shadow-2xs min-w-0">
        <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 pb-1 border-b border-slate-100">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{currentConfig.name} 高考必考要点提炼</span>
        </h4>
        <div className="flex flex-col gap-1.5">
          {(currentConfig.examTips || (modelNode ? modelNode.examPointSummary : [])).map((pt, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-relaxed break-words">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span className="font-medium">{pt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 模块 3：当前元素关联教材章节 (直达微观场景) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {currentElementKnowledgeNodes.length > 0 && (
        <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col gap-2 shadow-2xs min-w-0">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{currentConfig.symbol} 关联课标教材章节</span>
            </h4>
            <span className="text-xs text-indigo-600 font-medium">直达微观场景</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {currentElementKnowledgeNodes.map(knode => {
              const animId = knode.animationIds?.[0]
              return (
                <button
                  key={knode.id}
                  onClick={() => {
                    if (animId) {
                      navigate(`/animation/${animId}`)
                    } else {
                      navigate('/')
                    }
                  }}
                  className="p-2 rounded-lg border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100/70 text-xs flex items-center justify-between transition-colors text-left group min-w-0 gap-2"
                >
                  <span className="font-bold text-indigo-950 group-hover:text-indigo-700 break-words flex-1 leading-snug">
                    {knode.title}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0">
                    <span>{knode.chapter}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
