/**
 * src/features/gas-chain/components/tabs/GasDryingTab.tsx
 * Tab 2: 净化除杂与干燥相容
 */

import React from 'react'
import {
  PURIFICATION_RULES,
  DRYING_CROSS_MATRIX,
  DRYING_AGENT_MATRIX,
} from '../../data/gasChainMatrixData'
import { KatexFormula } from '@/components/UI'
import { Droplets } from 'lucide-react'

export const GasDryingTab: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* 1. 8 大高考高频洗气除杂速查与原理 */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Droplets className="w-4 h-4" />
            </span>
            <span className="font-bold text-slate-900 text-sm md:text-base">
              8 大高考高频净化除杂洗气模型 (长进短出原理)
            </span>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            除杂原则：不减主、不增杂、易分离
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PURIFICATION_RULES.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/40 shadow-2xs space-y-2 flex flex-col justify-between hover:border-blue-200 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-900">{item.targetGas}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-150">
                    除 {item.impurity}
                  </span>
                </div>

                <div className="p-1.5 rounded bg-white border border-slate-200 text-[11px] font-bold text-blue-800">
                  试剂: {item.reagent}
                </div>

                <div className="p-1.5 rounded bg-white border border-slate-200 text-xs text-slate-800">
                  <KatexFormula formula={item.principleEquation} />
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  {item.mechanism}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 二维相交网格矩阵 (Cross Matrix Table) */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Droplets className="w-4 h-4" />
            </span>
            <span className="font-bold text-slate-900 text-sm md:text-base">
              气体与四大干燥剂相容性交叉速查矩阵
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            酸不过碱、碱不过酸、络合不氯化钙、氧化不浓酸
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200">
                <th className="p-2.5 font-bold">目标气体 (类别)</th>
                <th className="p-2.5 font-bold">浓硫酸 (98% H₂SO₄) [酸性液]</th>
                <th className="p-2.5 font-bold">碱石灰 (CaO+NaOH) [碱性固]</th>
                <th className="p-2.5 font-bold">无水 CaCl₂ [中性固]</th>
                <th className="p-2.5 font-bold">P₂O₅ [强酸性固]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {DRYING_CROSS_MATRIX.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-2.5 font-bold text-slate-900">
                    <span className="font-black text-indigo-700">{row.gas}</span>
                    <span className="text-[10px] text-slate-500 block font-normal">{row.gasCategory}</span>
                  </td>

                  {/* 浓硫酸 */}
                  <td className="p-2.5">
                    {row.concH2SO4.status === 'ok' ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                        ✓ {row.concH2SO4.note}
                      </span>
                    ) : (
                      <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                        ❌ {row.concH2SO4.note}
                      </span>
                    )}
                  </td>

                  {/* 碱石灰 */}
                  <td className="p-2.5">
                    {row.sodaLime.status === 'ok' ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                        ✓ {row.sodaLime.note}
                      </span>
                    ) : (
                      <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                        ❌ {row.sodaLime.note}
                      </span>
                    )}
                  </td>

                  {/* 无水 CaCl2 */}
                  <td className="p-2.5">
                    {row.cacl2.status === 'ok' ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                        ✓ {row.cacl2.note}
                      </span>
                    ) : (
                      <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                        ❌ {row.cacl2.note}
                      </span>
                    )}
                  </td>

                  {/* P2O5 */}
                  <td className="p-2.5">
                    {row.p2o5.status === 'ok' ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                        ✓ {row.p2o5.note}
                      </span>
                    ) : (
                      <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                        ❌ {row.p2o5.note}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. 四大干燥剂深度机理卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DRYING_AGENT_MATRIX.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                <span className="text-[10px] text-indigo-700 font-semibold">{item.natureLabel}</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                {item.apparatus}
              </span>
            </div>

            <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-150">
              <strong>吸水机理:</strong> {item.keyPrinciple}
            </div>

            <div>
              <span className="text-[11px] font-bold text-rose-700 block mb-1">
                ❌ 绝对禁忌气体与高考踩分机理:
              </span>
              <div className="space-y-1">
                {item.forbiddenGases.map((fg, i) => (
                  <div
                    key={i}
                    className="p-1.5 rounded bg-rose-50 border border-rose-200 text-[11px] text-rose-900"
                  >
                    <strong>{fg.gas}:</strong> {fg.reason}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
