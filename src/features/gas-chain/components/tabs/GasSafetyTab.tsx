/**
 * src/features/gas-chain/components/tabs/GasSafetyTab.tsx
 * Tab 3: 收集决策与防倒吸安全
 */

import React from 'react'
import {
  COLLECTION_DECISION_RULES,
  TAIL_GAS_TREATMENT_MODELS,
  ANTI_SIPHON_MODELS,
  AIRTIGHTNESS_TEMPLATES,
} from '../../data/gasChainMatrixData'
import { KatexFormula } from '@/components/UI'
import {
  ShieldAlert,
  Flame,
  TableProperties,
  CheckCircle2,
} from 'lucide-react'

export const GasSafetyTab: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* 1. 气体收集方法选择四象限决策模型 */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <TableProperties className="w-4 h-4" />
            </span>
            <span className="font-bold text-slate-900 text-sm md:text-base">
              气体规范收集方法决策树与物理判据 (密度比对 M vs 29 与 水溶性)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {COLLECTION_DECISION_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 shadow-2xs space-y-2 flex flex-col justify-between hover:border-indigo-200 transition-all"
            >
              <div className="space-y-2">
                <h4 className="font-bold text-xs md:text-sm text-indigo-900">{rule.method}</h4>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                  <strong>适用判据:</strong> {rule.applicableCriteria}
                </div>
                <div className="text-[10px] text-indigo-700 font-semibold">
                  典型气体: {rule.typicalGases.join('、')}
                </div>
                <div className="text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                  <strong>导管接法:</strong> {rule.tubeConnection}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-900">
                ⚠️ {rule.cautions}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 高考尾气处理与无害化转化四大方法体系 */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
              <Flame className="w-4 h-4" />
            </span>
            <span className="font-bold text-slate-900 text-sm md:text-base">
              高考尾气处理与无害化转化四大方法体系 (吸收/燃烧/回收)
            </span>
          </div>
          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            绿色化学：杜绝有毒气体直排
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {TAIL_GAS_TREATMENT_MODELS.map((model, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 shadow-2xs space-y-2.5 flex flex-col justify-between hover:border-rose-200 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs md:text-sm text-rose-950">{model.method}</h4>
                  {model.antiSiphonRequired && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      ⚠️ 必须防倒吸
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                  <strong className="text-slate-800">装置与试剂:</strong> {model.absorberApparatus}
                </div>

                <div className="text-[10px] text-indigo-700 font-semibold">
                  适用气体: {model.applicableGases}
                </div>

                {model.typicalReactions.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 block">核心化学吸收反应:</span>
                    <div className="space-y-1">
                      {model.typicalReactions.map((r, i) => (
                        <div key={i} className="p-1.5 rounded bg-white border border-slate-200 text-xs space-y-0.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                            <span>{r.gas}</span>
                            <span className="text-[10px] text-slate-500 font-normal">{r.note}</span>
                          </div>
                          <KatexFormula formula={r.equation} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                <strong className="text-amber-800 block font-bold">⚠️ 高考规范与避坑要点:</strong>
                {model.examTraps.map((trap, i) => (
                  <p key={i} className="leading-relaxed font-medium">▪ {trap}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 6 大经典防倒吸装置图解与原理解析 */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <span className="font-bold text-slate-900 text-sm md:text-base">
              6 大防倒吸安全装置与物理化学原理解析
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ANTI_SIPHON_MODELS.map((model, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 hover:border-slate-300 transition-all"
            >
              <h4 className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
                {model.name}
              </h4>
              <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-150">
                <strong className="text-slate-800">结构特征:</strong> {model.structureFeature}
              </div>
              <div className="text-[11px] text-slate-700 leading-relaxed">
                <strong className="text-slate-800">防倒吸机理:</strong> {model.workingPrinciple}
              </div>
              <div className="text-[10px] text-emerald-800 font-semibold">
                适用场景: {model.applicableScenarios}
              </div>
              <div className="text-[10px] text-rose-700 font-bold bg-rose-50 p-1.5 rounded">
                ⚠️ 规范注意: {model.cautionPoint}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 高考气密性检验 3 大标准模板 */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <span className="font-bold text-slate-900 text-sm md:text-base">
              高考大题装置气密性检验三大规范答题模板 (填空/简答满分秘籍)
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-700">
            三要素：操作 ➔ 现象 ➔ 结论
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {AIRTIGHTNESS_TEMPLATES.map((tmpl, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-indigo-100 bg-white shadow-2xs space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-indigo-950">{tmpl.method}</h4>
                </div>
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-150">
                  <strong>适用装置:</strong> {tmpl.applicableDevice}
                </div>
                <div className="text-[11px] text-slate-800 space-y-1">
                  <strong className="text-indigo-900 block font-bold">标准操作步骤:</strong>
                  <p className="leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-150 font-medium">
                    {tmpl.standardSteps}
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950 space-y-0.5">
                <strong className="text-emerald-900 block font-bold">满分现象与结论表述:</strong>
                <p className="leading-relaxed font-semibold">{tmpl.phenomenonAndConclusion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
