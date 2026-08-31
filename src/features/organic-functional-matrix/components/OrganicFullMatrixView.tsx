import React, { useState } from 'react'
import { FUNCTIONAL_GROUPS } from '../constants'
import { KatexFormula } from '@/components/UI'

interface OrganicFullMatrixViewProps {
  selectedGroupId: string
  onSelectGroup?: (id: string) => void
}

export const OrganicFullMatrixView: React.FC<OrganicFullMatrixViewProps> = ({
  selectedGroupId,
  onSelectGroup,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'oxygen' | 'hydrocarbon' | 'nitrogen'>('all')

  const filteredGroups = FUNCTIONAL_GROUPS.filter((g) => {
    if (filterCategory === 'oxygen') return g.category === 'oxygen-containing'
    if (filterCategory === 'hydrocarbon') return g.category === 'hydrocarbon-derivative'
    if (filterCategory === 'nitrogen') return g.category === 'nitrogen-containing'
    return true
  })

  return (
    <div className="w-full h-full p-4 overflow-y-auto space-y-4 text-slate-800">
      {/* 1. 顶部：三大高考金牌秒杀口诀展板 */}
      <div className="p-4 bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-slate-900 text-sm">
            高考三大核心推断口诀 (推断与计算核心模型)
          </div>
          <span className="text-xs font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 shadow-2xs">
            高考必背
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          {/* 口诀 1 */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="font-bold text-slate-900 text-[11.5px]">
                口诀一：酸性阶梯定试剂
              </div>
              <div className="my-1.5 p-1 bg-indigo-50/80 rounded border border-indigo-100 overflow-x-auto">
                <KatexFormula
                  formula="\text{R-COOH} > \text{H}_2\text{CO}_3 > \text{Ar-OH} > \text{HCO}_3^- > \text{R-OH}"
                  mode="inline"
                  className="!bg-transparent text-[11px] font-bold text-indigo-900"
                />
              </div>
            </div>
            <p className="text-[10.5px] text-slate-600 leading-relaxed">
              • 羧基：遇 NaHCO₃ 剧烈放出 CO₂ 气泡；<br />
              • 酚：遇 Na₂CO₃ 转化为 NaHCO₃（不出气），通 CO₂ 必生成苯酚与 NaHCO₃；<br />
              • 醇：只认金属 Na 放 H₂，对强碱/碳酸盐中立不反应。
            </p>
          </div>

          {/* 口诀 2 */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="font-bold text-slate-900 text-[11.5px]">
                口诀二：水解断键看类别
              </div>
              <div className="my-1.5 p-1.5 bg-rose-50/80 rounded border border-rose-100 text-[11px] font-bold text-rose-900">
                普通酯耗 1 碱；酚酯双重耗 2 碱
              </div>
            </div>
            <p className="text-[10.5px] text-slate-600 leading-relaxed">
              • 普通醇酯 (-COOR)：水解得 1 羧酸盐 + 1 醇，消耗 1 mol NaOH；<br />
              • 酚酯 (-COO-Ar)：水解得 1 羧酸盐 + 1 酚钠，产生两个酸性位点，消耗 2 mol NaOH！
            </p>
          </div>

          {/* 口诀 3 */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="font-bold text-slate-900 text-[11.5px]">
                口诀三：加成还原数不饱和度
              </div>
              <div className="my-1.5 p-1.5 bg-emerald-50/80 rounded border border-emerald-100 text-[11px] font-bold text-emerald-900">
                1 双键耗 1 Br₂/H₂；1 醛基氧化耗 1 Br₂
              </div>
            </div>
            <p className="text-[10.5px] text-slate-600 leading-relaxed">
              • 1 mol C=C 消耗 1 mol Br₂ / 1 mol H₂；<br />
              • 1 mol C≡C 消耗 2 mol Br₂ / 2 mol H₂；<br />
              • 1 mol 苯环加氢催化还原消耗 3 mol H₂。
            </p>
          </div>
        </div>
      </div>

      {/* 2. 中部：10 大官能团 × 6 大核心试剂全景反应矩阵大表 */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-slate-900 text-sm">
            1 mol 官能团定量反应消耗与特征产物全景矩阵大表
          </div>

          {/* 分类筛选器 */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg text-xs">
            {(
              [
                { label: '全部', value: 'all' },
                { label: '含氧官能团', value: 'oxygen' },
                { label: '烃与卤代烃', value: 'hydrocarbon' },
                { label: '含氮衍生物', value: 'nitrogen' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterCategory(opt.value)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  filterCategory === opt.value
                    ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 宽幅响应式矩阵大表 */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-bold">
              <tr>
                <th className="py-2.5 px-3">官能团名称</th>
                <th className="py-2.5 px-2 text-center">结构简式</th>
                <th className="py-2.5 px-2 text-center bg-blue-50/60 text-blue-900">Na (mol)</th>
                <th className="py-2.5 px-2 text-center bg-pink-50/60 text-pink-900">NaOH (mol)</th>
                <th className="py-2.5 px-2 text-center bg-purple-50/60 text-purple-900">NaHCO₃ (mol)</th>
                <th className="py-2.5 px-2 text-center bg-indigo-50/60 text-indigo-900">Na₂CO₃ (mol)</th>
                <th className="py-2.5 px-2 text-center bg-orange-50/60 text-orange-900">浓 Br₂ (mol)</th>
                <th className="py-2.5 px-2 text-center bg-emerald-50/60 text-emerald-900">H₂ (mol)</th>
                <th className="py-2.5 px-3">宏观特征现象 / 产物</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredGroups.map((g) => {
                const isSelected = selectedGroupId === g.id
                return (
                  <tr
                    key={g.id}
                    onClick={() => onSelectGroup?.(g.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/90 font-medium'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* 官能团 */}
                    <td className={`py-2.5 px-3 font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {g.name}
                    </td>

                    {/* 结构式 */}
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-indigo-700 bg-slate-50/40">
                      {g.structureSvg}
                    </td>

                    {/* Na */}
                    <td className="py-2.5 px-2 text-center font-mono font-bold">
                      {g.consumptions.Na > 0 ? (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                          {g.consumptions.Na}
                        </span>
                      ) : (
                        <span className="text-slate-300">0</span>
                      )}
                    </td>

                    {/* NaOH */}
                    <td className="py-2.5 px-2 text-center font-mono font-bold">
                      {g.consumptions.NaOH > 0 ? (
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            g.consumptions.NaOH === 2
                              ? 'bg-rose-600 text-white font-extrabold shadow-2xs'
                              : 'bg-pink-100 text-pink-800'
                          }`}
                        >
                          {g.consumptions.NaOH}
                        </span>
                      ) : (
                        <span className="text-slate-300">0</span>
                      )}
                    </td>

                    {/* NaHCO3 */}
                    <td className="py-2.5 px-2 text-center font-mono font-bold">
                      {g.consumptions.NaHCO3 > 0 ? (
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded">
                          {g.consumptions.NaHCO3}
                        </span>
                      ) : (
                        <span className="text-slate-300">0</span>
                      )}
                    </td>

                    {/* Na2CO3 */}
                    <td className="py-2.5 px-2 text-center font-mono font-bold">
                      {g.consumptions.Na2CO3 > 0 ? (
                        <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                          {g.consumptions.Na2CO3}
                        </span>
                      ) : (
                        <span className="text-slate-300">0</span>
                      )}
                    </td>

                    {/* Br2 */}
                    <td className="py-2.5 px-2 text-center font-mono font-bold">
                      {g.consumptions.Br2 > 0 ? (
                        <span className="px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded">
                          {g.consumptions.Br2}
                        </span>
                      ) : (
                        <span className="text-slate-300">0</span>
                      )}
                    </td>

                    {/* H2 */}
                    <td className="py-2.5 px-2 text-center font-mono font-bold">
                      {g.consumptions.H2 > 0 ? (
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                          {g.consumptions.H2}
                        </span>
                      ) : (
                        <span className="text-slate-300">0</span>
                      )}
                    </td>

                    {/* 现象 */}
                    <td className="py-2.5 px-3 text-[11px] text-slate-600 max-w-xs truncate" title={g.testPhenomenon}>
                      {g.testPhenomenon}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
