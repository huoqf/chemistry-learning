/**
 * src/features/gas-chain/components/tabs/GasGeneratorTab.tsx
 * Tab 1: 发生装置体系与启普发生器判据
 */

import React from 'react'
import {
  GENERATOR_APPARATUS_MODELS,
  KIPP_GENERATOR_RULES,
} from '../../data/gasChainMatrixData'
import { KatexFormula } from '@/components/UI'
import { Beaker } from 'lucide-react'

export const GasGeneratorTab: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* 1. 四大气体制备发生装置类型全景解析 */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Beaker className="w-4 h-4" />
            </span>
            <span className="font-bold text-slate-900 text-sm md:text-base">
              高中化学气体制备四大发生装置体系全景解析
            </span>
          </div>
          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            按“反应物状态 (固/液) 与反应条件 (加热/常温)”决策
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {GENERATOR_APPARATUS_MODELS.map((model) => (
            <div
              key={model.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 shadow-2xs space-y-2.5 flex flex-col justify-between hover:border-indigo-200 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs md:text-sm text-indigo-900">
                    {model.name}
                  </h4>
                </div>

                <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                  <strong className="text-slate-800">核心仪器:</strong> {model.apparatus}
                </div>

                {/* 适用反应方程式列表 */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 block">代表性反应原理:</span>
                  {model.suitableReactions.map((r, i) => (
                    <div key={i} className="p-1.5 rounded bg-white border border-slate-200 text-xs text-slate-800 space-y-0.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <span>{r.gas}</span>
                        <span className="text-[10px] text-indigo-600 font-normal">{r.condition}</span>
                      </div>
                      <KatexFormula formula={r.equation} />
                    </div>
                  ))}
                </div>

                {/* 核心操作要点 */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 block">规范操作要点:</span>
                  <ul className="space-y-0.5 pl-0.5 text-[11px] text-slate-700">
                    {model.keyOperations.map((op, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="leading-relaxed">{op}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 高考避坑防爆 */}
              <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                <strong className="text-amber-800 block font-bold">⚠️ 高考易错防爆避坑:</strong>
                {model.examTraps.map((trap, i) => (
                  <p key={i} className="leading-relaxed font-medium">▪ {trap}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 启普发生器适用判定矩阵 */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Beaker className="w-4 h-4" />
            </span>
            <span className="font-bold text-slate-900 text-sm md:text-base">
              启普发生器适用条件与判定矩阵 (随开随用、随关随停)
            </span>
          </div>
        </div>

        <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1.5">
          <span className="text-xs font-bold text-indigo-950 block">启普发生器四大约束铁律:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-indigo-900">
            {KIPP_GENERATOR_RULES.principles.map((p, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">▪</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {KIPP_GENERATOR_RULES.items.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border ${
                item.suitable
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-rose-50/40 border-rose-200'
              } space-y-1.5`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{item.gas}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.suitable
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {item.suitable ? '✓ 符合' : '❌ 严禁使用'}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                反应物: {item.reactants}
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                {item.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
