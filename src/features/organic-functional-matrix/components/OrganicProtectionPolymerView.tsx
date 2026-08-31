import React from 'react'
import { PROTECTION_GROUPS, POLYMERIZATION_MODELS } from '../constants'
import { KatexFormula } from '@/components/UI'
import { ShieldCheck, Layers } from 'lucide-react'

export const OrganicProtectionPolymerView: React.FC = () => {
  return (
    <div className="space-y-4 text-xs text-slate-800">
      {/* 1. 高频保护基矩阵 */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm md:text-base">
                新高考高频有机合成保护基与脱保护策略
              </h3>
              <p className="text-xs text-slate-500">
                定向反应、掩盖活泼质子、控制区域选择性的金牌题眼
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            合成大题压轴
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {PROTECTION_GROUPS.map((p) => (
            <div
              key={p.id}
              className="p-3.5 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-2xs space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm text-indigo-950">
                    {p.name}
                  </h4>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    保护：{p.targetGroup}
                  </span>
                </div>

                <div className="p-2 bg-white rounded-lg border border-slate-100 text-[11.5px] space-y-1">
                  <div>
                    <strong className="text-emerald-800">引入保护：</strong> {p.protectionReagent}
                  </div>
                  <div className="text-center font-mono py-1 overflow-x-auto">
                    <KatexFormula formula={p.protectionEquation} mode="inline" className="!bg-transparent text-xs" />
                  </div>
                  <div>
                    <strong className="text-rose-800">脱除保护：</strong> {p.deprotectionCondition}
                  </div>
                  <div className="text-center font-mono py-1 overflow-x-auto">
                    <KatexFormula formula={p.deprotectionEquation} mode="inline" className="!bg-transparent text-xs" />
                  </div>
                </div>
              </div>

              <div className="p-2 bg-amber-50/70 rounded-lg border border-amber-100 text-[11.5px] text-amber-950 leading-relaxed">
                <strong>高考题眼意义：</strong> {p.examSignificance}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 高分子聚合脱水定量矩阵 */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm md:text-base">
                高分子加聚与缩聚反应化学计量脱水模型
              </h3>
              <p className="text-xs text-slate-500">
                单体官能团、端基分析及生成小分子摩尔规律 (2n-1 与 n-1)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
            选必三聚合考点
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {POLYMERIZATION_MODELS.map((poly) => (
            <div
              key={poly.id}
              className="p-3.5 bg-gradient-to-br from-indigo-50/40 via-white to-white rounded-xl border border-indigo-100 shadow-2xs space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{poly.polymerName}</h4>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {poly.category === 'condensation' ? '缩聚反应' : '加聚反应'}
                  </span>
                </div>

                <div className="p-2 bg-white rounded-lg border border-slate-100 text-xs space-y-1">
                  <div className="text-slate-700 font-medium">
                    <strong>原料单体：</strong> {poly.monomers.map((m) => `${m.name} (${m.formula})`).join(' + ')}
                  </div>
                  <div className="text-center font-mono py-1.5 overflow-x-auto bg-slate-50/80 rounded border border-slate-100">
                    <KatexFormula formula={poly.reactionEquation} mode="block" className="!bg-transparent text-xs" />
                  </div>
                  <div className="text-indigo-900 font-bold">
                    • 脱除规律：{poly.smallMoleculeOutput}
                  </div>
                </div>
              </div>

              <div className="p-2 bg-blue-50/70 rounded-lg border border-blue-100 text-[11.5px] text-blue-950 leading-relaxed">
                <strong>端基与考点分析：</strong> {poly.examPoints}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
