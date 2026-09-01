import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layers,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  RotateCw,
  Beaker,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import type { ElementValenceConfig, ValenceSubstanceNode } from '@/data/valence-matrix'
import { ChemicalFormula } from '@/components/UI'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { matchesSubstance, getSubstancePhysicalState, getElementKnowledgeNodes } from './utils'

export interface ValenceRightPanelProps {
  currentConfig: ElementValenceConfig
  selectedSubstance: ValenceSubstanceNode | null
}

/**
 * ValenceRightPanel — 无机元素“价类二维矩阵”常驻右屏全景档案面板
 *
 * 1. 焦点物质高考全景档案（物理形态、外观色泽、性质定位、高考特征实验、规范配平方程式）
 * 2. 焦点物质专属价态升降转化链（双层清爽结构，精确匹配）
 * 3. 当前元素高考必考要点提炼
 * 4. 当前元素关联课标教材章节（直达微观场景）
 */
export const ValenceRightPanel: React.FC<ValenceRightPanelProps> = ({
  currentConfig,
  selectedSubstance,
}) => {
  const navigate = useNavigate()
  const modelNode = getGaokaoModel('model-valence-matrix')

  // 1. 计算物理聚集状态
  const physicalState = useMemo(() => {
    if (!selectedSubstance) return '澄清离子水溶液'
    return getSubstancePhysicalState(selectedSubstance)
  }, [selectedSubstance])

  // 2. 精确计算当前选中物质专属相关的价态升降转化路径
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

  // 3. 当前元素专属关联课标知识节点
  const currentElementKnowledgeNodes = useMemo(() => {
    return getElementKnowledgeNodes(currentConfig.symbol)
  }, [currentConfig.symbol])

  return (
    <div className="w-full h-full flex flex-col gap-3.5 p-3.5 bg-slate-50/60 overflow-y-auto font-sans">
      {/* 模块 1：焦点物质高考全景档案卡 */}
      {selectedSubstance && (
        <div className="p-3.5 rounded-2xl border border-indigo-200 bg-white shadow-2xs flex flex-col gap-2.5">
          {/* 顶栏：化学式与价态类别 */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-xs shadow-2xs shrink-0"
                style={{ backgroundColor: selectedSubstance.rgbColor || '#CBD5E1', color: '#0F172A' }}
              >
                {selectedSubstance.substance.slice(0, 2)}
              </div>
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-1">
                <ChemicalFormula formula={selectedSubstance.substance} />
                <span className="text-xs font-medium text-slate-400">全景档案</span>
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded-md border border-indigo-200">
                {selectedSubstance.valence > 0 ? `+${selectedSubstance.valence}` : selectedSubstance.valence} 价
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                {selectedSubstance.category}
              </span>
            </div>
          </div>

          {/* 物理形态与色泽 */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-medium">聚集形态</span>
              <span className="font-bold text-slate-800 truncate">{physicalState}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-medium">外观与颜色</span>
              <span className="font-bold text-slate-800 truncate flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block border border-slate-300 shrink-0"
                  style={{ backgroundColor: selectedSubstance.rgbColor || '#CBD5E1' }}
                />
                {selectedSubstance.colorText}
              </span>
            </div>
          </div>

          {/* 性质定位与角色 */}
          {selectedSubstance.roleDescription && (
            <div className="text-xs text-slate-700 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100 flex items-center justify-between">
              <span className="font-bold text-indigo-900 shrink-0">性质定位：</span>
              <span className="text-indigo-950 font-medium text-right">{selectedSubstance.roleDescription}</span>
            </div>
          )}

          {/* 特征实验现象与判分点 */}
          {selectedSubstance.testReaction && (
            <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col gap-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1 text-rose-700">
                  <Beaker className="w-3.5 h-3.5" />
                  高考特征实验现象与判分点：
                </span>
              </div>
              <span className="text-slate-700 leading-relaxed font-medium">
                {selectedSubstance.testReaction}
              </span>
            </div>
          )}

          {/* 规范离子/化学方程式 */}
          {selectedSubstance.equation && (
            <div className="text-xs bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl flex flex-col gap-1 font-mono shadow-2xs">
              <span className="text-[10px] text-indigo-700 font-sans font-bold">
                规范高考化学 / 离子方程式：
              </span>
              <div className="font-bold select-text text-xs leading-relaxed text-indigo-950">
                <ChemicalFormula formula={selectedSubstance.equation} />
              </div>
            </div>
          )}

          {/* 价态升降核心转化链 (结构化拆解) */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              价态升降核心转化链：
            </span>

            {/* 向上升高氧化 */}
            {upwardOxidations.length > 0 && (
              <div className="p-2.5 bg-rose-50/50 rounded-xl border border-rose-200/70 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-rose-800 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                    ↑ 升高氧化（失电子 · 表现还原性）
                  </span>
                  <span className="text-[9px] font-mono text-rose-600 bg-rose-100/80 px-1.5 py-0.2 rounded font-bold">
                    {upwardOxidations.length} 条转化
                  </span>
                </span>
                <div className="flex flex-col gap-1.5">
                  {upwardOxidations.map(t => (
                    <div
                      key={t.id}
                      className="p-2 bg-white rounded-lg border border-rose-200/80 shadow-2xs flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <ChemicalFormula formula={t.fromSubstance} />
                          <span className="text-rose-500 font-bold">➔</span>
                          <ChemicalFormula formula={t.toSubstance} />
                        </span>
                        {t.electronTransfer && (
                          <span className="text-[9px] font-mono text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded font-bold border border-rose-100">
                            {t.electronTransfer}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-start gap-1 bg-slate-50 p-1.5 rounded border border-slate-100">
                        <span className="text-rose-600 font-bold shrink-0">所需试剂:</span>
                        <span className="text-slate-700 leading-snug">{t.reagent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 向下降低还原 */}
            {downwardReductions.length > 0 && (
              <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-200/70 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-blue-800 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-blue-600" />
                    ↓ 降低还原（得电子 · 表现氧化性）
                  </span>
                  <span className="text-[9px] font-mono text-blue-600 bg-blue-100/80 px-1.5 py-0.2 rounded font-bold">
                    {downwardReductions.length} 条转化
                  </span>
                </span>
                <div className="flex flex-col gap-1.5">
                  {downwardReductions.map(t => (
                    <div
                      key={t.id}
                      className="p-2 bg-white rounded-lg border border-blue-200/80 shadow-2xs flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <ChemicalFormula formula={t.fromSubstance} />
                          <span className="text-blue-500 font-bold">➔</span>
                          <ChemicalFormula formula={t.toSubstance} />
                        </span>
                        {t.electronTransfer && (
                          <span className="text-[9px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-bold border border-blue-100">
                            {t.electronTransfer}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-start gap-1 bg-slate-50 p-1.5 rounded border border-slate-100">
                        <span className="text-blue-600 font-bold shrink-0">所需试剂:</span>
                        <span className="text-slate-700 leading-snug">{t.reagent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 类别转化 */}
            {otherTransformations.length > 0 && (
              <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-200/70 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-emerald-800 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 text-emerald-600" />
                    ↔ 类别转化（酸碱 / 沉淀 / 水化）
                  </span>
                  <span className="text-[9px] font-mono text-emerald-600 bg-emerald-100/80 px-1.5 py-0.2 rounded font-bold">
                    {otherTransformations.length} 条转化
                  </span>
                </span>
                <div className="flex flex-col gap-1.5">
                  {otherTransformations.map(t => (
                    <div
                      key={t.id}
                      className="p-2 bg-white rounded-lg border border-emerald-200/80 shadow-2xs flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <ChemicalFormula formula={t.fromSubstance} />
                          <span className="text-emerald-500 font-bold">➔</span>
                          <ChemicalFormula formula={t.toSubstance} />
                        </span>
                        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold border border-emerald-100">
                          非氧化还原
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-start gap-1 bg-slate-50 p-1.5 rounded border border-slate-100">
                        <span className="text-emerald-600 font-bold shrink-0">所需试剂:</span>
                        <span className="text-slate-700 leading-snug">{t.reagent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 模块 2：高考必考要点提炼 (随着当前选中元素 100% 联动更新) */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
        <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 pb-1 border-b border-slate-100">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          {currentConfig.name} 高考必考要点提炼
        </h4>
        <div className="flex flex-col gap-1.5">
          {(currentConfig.examTips || (modelNode ? modelNode.examPointSummary : [])).map((pt, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span className="leading-relaxed">{pt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 模块 3：当前元素关联教材知识体系 (100% 与左屏选中元素同步，绝无无关内容) */}
      {currentElementKnowledgeNodes.length > 0 && (
        <div className="p-3 bg-white rounded-2xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              {currentConfig.symbol} 关联课标教材章节
            </h4>
            <span className="text-[10px] text-indigo-600 font-medium">点击直达微观场景</span>
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
                  className="p-2 rounded-xl border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100/70 text-xs flex items-center justify-between transition-all text-left group shadow-2xs"
                  title={animId ? `点击进入微观动画场景：${knode.title}` : `点击查看教材知识体系：${knode.title}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-950 group-hover:text-indigo-700 transition-colors">
                      {knode.title}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-indigo-600 text-white">
                      {currentConfig.symbol} 核心课标
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 group-hover:text-indigo-700">
                    <span>
                      {knode.chapter} · {knode.module}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
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
