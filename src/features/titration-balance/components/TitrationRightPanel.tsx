/**
 * src/features/titration-balance/components/TitrationRightPanel.tsx
 * 滴定突跃与离子浓度排序解题工具 - 右屏展示 UI Component (规范 KaTeX 表达式渲染)
 */

import { Sparkles, BookOpen, Layers, AlertTriangle, ArrowRight } from 'lucide-react'
import type { TitrationChemistryResult } from '../types'
import type { GaokaoModelNode } from '@/data/gaokaoModels'
import { getKnowledgeNode } from '@/data/knowledgeTree'
import { KatexFormula } from '@/components/UI'
import { useNavigate } from 'react-router-dom'

export interface TitrationRightPanelProps {
  chemistry: TitrationChemistryResult
  model: GaokaoModelNode | undefined
}

export function TitrationRightPanel({ chemistry, model }: TitrationRightPanelProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-3 p-4 h-full overflow-y-auto bg-white font-sans text-slate-900 border-l border-slate-200">
      {/* 1. 实时离子浓度排序与微粒对比 */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2.5 shadow-2xs">
        <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          当前节点离子浓度大小排序 (高考核心)
        </h4>

        {/* 规范 Katex 渲染离子浓度排序 */}
        <div className="p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-950 leading-relaxed overflow-x-auto flex justify-center items-center">
          <KatexFormula formula={chemistry.concOrderingLatex} mode="inline" />
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed bg-white p-2 rounded border border-slate-100">
          <strong className="text-slate-800">解题推导：</strong>
          {chemistry.orderingExplanation}
        </p>

        {/* 各微粒浓度柱状对比 */}
        <div className="flex flex-col gap-1.5 mt-1">
          <span className="text-[11px] font-bold text-slate-700">微粒定量数值对比 (mol/L)：</span>
          {chemistry.ionConcs.map((ion) => {
            const maxConc = Math.max(...chemistry.ionConcs.map((i) => i.conc), 1e-4)
            const percent = Math.min(100, Math.max(3, (ion.conc / maxConc) * 100))
            return (
              <div key={ion.name} className="flex items-center gap-2 text-xs">
                <span className="w-16 font-bold text-slate-700 shrink-0 text-right overflow-hidden flex justify-end">
                  <KatexFormula formula={ion.labelLatex || ion.name} mode="inline" />
                </span>
                <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${percent}%`, backgroundColor: ion.color }}
                  />
                </div>
                <span className="w-16 font-mono text-[10px] text-slate-500 text-right shrink-0">
                  {ion.formatted}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. 三大守恒方程式实时手算代导 */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2.5 shadow-2xs">
        <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
          <Layers className="w-4 h-4 text-indigo-600" />
          三大守恒推导卡片
        </h4>

        <div className="flex flex-col gap-2 text-xs">
          {/* 电荷守恒 */}
          <div className="p-2 bg-white rounded border border-slate-200 flex flex-col gap-1">
            <span className="font-bold text-indigo-900 text-[11px]">{chemistry.chargeBalance.title}</span>
            <div className="bg-slate-50 p-1.5 rounded border border-slate-100 overflow-x-auto flex justify-start items-center">
              <KatexFormula formula={chemistry.chargeBalance.equationLatex} mode="inline" />
            </div>
            <span className="text-[10px] text-slate-500">{chemistry.chargeBalance.explanation}</span>
          </div>

          {/* 物料守恒 */}
          <div className="p-2 bg-white rounded border border-slate-200 flex flex-col gap-1">
            <span className="font-bold text-indigo-900 text-[11px]">{chemistry.massBalance.title}</span>
            <div className="bg-slate-50 p-1.5 rounded border border-slate-100 overflow-x-auto flex justify-start items-center">
              <KatexFormula formula={chemistry.massBalance.equationLatex} mode="inline" />
            </div>
            <span className="text-[10px] text-slate-500">{chemistry.massBalance.explanation}</span>
          </div>

          {/* 质子守恒 */}
          <div className="p-2 bg-white rounded border border-slate-200 flex flex-col gap-1">
            <span className="font-bold text-indigo-900 text-[11px]">{chemistry.protonBalance.title}</span>
            <div className="bg-slate-50 p-1.5 rounded border border-slate-100 overflow-x-auto flex justify-start items-center">
              <KatexFormula formula={chemistry.protonBalance.equationLatex} mode="inline" />
            </div>
            <span className="text-[10px] text-slate-500">{chemistry.protonBalance.explanation}</span>
          </div>
        </div>
      </div>

      {/* 3. 指示剂选择与突跃评价 */}
      <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex flex-col gap-1.5 text-xs text-amber-900 shadow-2xs">
        <h5 className="font-bold flex items-center gap-1 text-amber-950">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          指示剂与突跃评估
        </h5>
        <p className="leading-relaxed text-[11px] font-medium">{chemistry.indicatorTip}</p>
      </div>

      {/* 4. 关联高考要点与教材节点 */}
      {model && (
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
          <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            关联高考教材知识节点
          </h4>
          <div className="flex flex-col gap-1.5">
            {model.relatedKnowledgeIds.map((kid) => {
              const knode = getKnowledgeNode(kid)
              const animId = knode?.animationIds?.[0]
              return (
                <button
                  key={kid}
                  onClick={() => {
                    if (animId) navigate(`/animation/${animId}`)
                  }}
                  className="p-2 rounded bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-100 text-xs flex items-center justify-between text-indigo-950 transition-colors text-left group"
                >
                  <span className="font-semibold group-hover:text-indigo-700">{knode ? knode.title : kid}</span>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600" />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
