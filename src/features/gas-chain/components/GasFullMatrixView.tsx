/**
 * src/features/gas-chain/components/GasFullMatrixView.tsx
 * 母题六：气体制备/净化/尾气处理装置链 - 全景速查大表与多维专项决策矩阵
 *
 * 遵循 Rule 规范：
 * 1. 严格采用系统 Light Theme 规范，杜绝突兀深黑/暗黑包裹；
 * 2. 聚焦于全景横向对比大表与专项矩阵，深度覆盖新高考考纲；
 * 3. 规范表格网格对齐，提供高学术质感、结构严密的化学速查矩阵；
 * 4. 支持 13 种气体 100% 连通模拟。
 */

import React, { useState, useMemo } from 'react'
import {
  GAS_MATRIX_ITEMS,
  GENERATOR_APPARATUS_MODELS,
  PURIFICATION_RULES,
  DRYING_AGENT_MATRIX,
  DRYING_CROSS_MATRIX,
  KIPP_GENERATOR_RULES,
  COLLECTION_DECISION_RULES,
  TAIL_GAS_TREATMENT_MODELS,
  ANTI_SIPHON_MODELS,
  AIRTIGHTNESS_TEMPLATES,
  type GasCategory,
} from '../data/gasChainMatrixData'
import { KatexFormula } from '@/components/UI'
import {
  Filter,
  ChevronDown,
  ChevronUp,
  Beaker,
  AlertTriangle,
  ShieldAlert,
  Play,
  CheckCircle2,
  Flame,
  Droplets,
  Layers,
  TableProperties,
} from 'lucide-react'

interface GasFullMatrixViewProps {
  onApplySystemPreset?: (targetGas: string) => void
  categoryFilter?: GasCategory | 'all'
  onCategoryFilterChange?: (cat: GasCategory | 'all') => void
}

type MainTabMode = 'kipp-generator' | 'cross-drying' | 'safety-templates' | 'matrix'

export const GasFullMatrixView: React.FC<GasFullMatrixViewProps> = ({
  onApplySystemPreset,
  categoryFilter = 'all',
  onCategoryFilterChange,
}) => {
  const [mainTab, setMainTab] = useState<MainTabMode>('kipp-generator')
  const [internalCategory, setInternalCategory] = useState<GasCategory | 'all'>('all')
  const [expandedGasId, setExpandedGasId] = useState<string | null>('cl2')

  const activeCategory = onCategoryFilterChange ? categoryFilter : internalCategory
  const setActiveCategory = onCategoryFilterChange || setInternalCategory

  // 综合过滤气体项（按分类）
  const filteredGases = useMemo(() => {
    return GAS_MATRIX_ITEMS.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false
      }
      return true
    })
  }, [activeCategory])

  return (
    <div className="w-full h-full p-3.5 overflow-y-auto overflow-x-hidden space-y-3.5 text-slate-800 bg-slate-50/50">
      {/* 0. 顶层 4 大专业专项 Tab 切换 (按 发生 ➔ 净化干燥 ➔ 收集安全 ➔ 全景总表 全流程顺序排列) */}
      <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1.5 w-full">
          {/* 1. 发生环节 */}
          <button
            onClick={() => setMainTab('kipp-generator')}
            className={`flex-1 min-w-fit px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              mainTab === 'kipp-generator'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Beaker className="w-4 h-4" />
            <span>发生装置与启普判据</span>
          </button>

          {/* 2. 净化与干燥环节 */}
          <button
            onClick={() => setMainTab('cross-drying')}
            className={`flex-1 min-w-fit px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              mainTab === 'cross-drying'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>净化除杂与干燥相容</span>
          </button>

          {/* 3. 收集与安全防倒吸环节 */}
          <button
            onClick={() => setMainTab('safety-templates')}
            className={`flex-1 min-w-fit px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              mainTab === 'safety-templates'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>收集决策与防倒吸安全</span>
          </button>

          {/* 4. 全景综合总表 */}
          <button
            onClick={() => setMainTab('matrix')}
            className={`flex-1 min-w-fit px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              mainTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TableProperties className="w-4 h-4" />
            <span>13 大气体制备全景总表</span>
          </button>
        </div>
      </div>

      {/* ────────────────── Tab 1: 发生装置体系与启普发生器判据 ────────────────── */}
      {mainTab === 'kipp-generator' && (
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
                      {item.suitable ? '✓ 适用' : '❌ 严禁使用'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <strong>药品:</strong> {item.reactants}
                  </div>
                  <div className="text-[11px] text-slate-700 leading-relaxed font-medium">
                    {item.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── Tab 2: 净化除杂与干燥相容 ────────────────── */}
      {mainTab === 'cross-drying' && (
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
                        <strong className="text-rose-800">{fg.gas}:</strong> {fg.reason}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────── Tab 3: 收集决策与防倒吸安全 ────────────────── */}
      {mainTab === 'safety-templates' && (
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

          {/* 3. 高考气密性检验 3 大标准模板 */}
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
      )}

      {/* ────────────────── Tab 4: 13 大气体制备全景总表 ────────────────── */}
      {mainTab === 'matrix' && (
        <div className="space-y-3">
          {/* 1. 多维分类快筛条 */}
          <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" />
                分类筛选:
              </span>
              {[
                { label: '全部 (13 种)', value: 'all' },
                { label: '强氧化/酸性气体 (Cl₂/SO₂/NO₂/HCl...)', value: 'acid-oxidant' },
                { label: '碱性/极易溶 (NH₃)', value: 'base-hydride' },
                { label: '中性/难溶 (NO/CO/O₂/H₂)', value: 'neutral-insoluble' },
                { label: '有机烃类 (C₂H₄/C₂H₂)', value: 'organic-hydrocarbon' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveCategory(item.value as GasCategory | 'all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === item.value
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. 气体全景对比大表 */}
          <div className="space-y-2.5">
            {filteredGases.map((gas) => {
              const isExpanded = expandedGasId === gas.id
              return (
                <div
                  key={gas.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'border-indigo-300 shadow-md ring-1 ring-indigo-200/50'
                      : 'border-slate-200 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  {/* 核心行摘要 */}
                  <div
                    onClick={() => setExpandedGasId(isExpanded ? null : gas.id)}
                    className="p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  >
                    {/* 左侧：气体标识与分类 */}
                    <div className="flex items-center gap-3 min-w-[190px]">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-700 font-bold shrink-0">
                        <span className="text-sm font-black">{gas.formula}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{gas.name}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {gas.categoryLabel}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <span>发生: <strong className="text-slate-700">{gas.generatorType}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* 中间关键要素摘要徽章 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs flex-1 w-full md:w-auto">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">净化除杂</span>
                        <span className="text-[11px] font-bold text-slate-800 truncate block" title={gas.purifyReagent}>
                          {gas.purifyReagent.split('(')[0]}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">干燥试剂</span>
                        <span className="text-[11px] font-bold text-slate-800 truncate block">
                          {gas.dryReagents.join(' / ')}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">规范收集</span>
                        <span className="text-[11px] font-bold text-indigo-700 truncate block">
                          {gas.collectionMethod}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">尾气处理</span>
                        <span className="text-[11px] font-bold text-rose-700 truncate block" title={gas.tailGasMethod}>
                          {gas.tailGasMethod.split('(')[0]}
                        </span>
                      </div>
                    </div>

                    {/* 右侧操作按钮 */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onApplySystemPreset?.(gas.formula)
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="在装置链画布中100%加载并模拟该体系"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>装置模拟</span>
                      </button>

                      <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 展开的深度全景面板 */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-50/60 border-t border-slate-200 space-y-3.5">
                      {/* 1. 核心反应原理方程式 */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                          <Flame className="w-4 h-4 text-amber-500" />
                          <span>发生原理与化学反应方程式:</span>
                          <span className="text-[11px] font-normal text-slate-500">
                            (反应物: {gas.reactants})
                          </span>
                        </div>
                        <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs overflow-x-auto">
                          <KatexFormula formula={gas.reactionFormula} mode="block" />
                          {gas.secondaryFormula && (
                            <div className="mt-1 pt-1 border-t border-slate-200 text-slate-700">
                              <KatexFormula formula={gas.secondaryFormula} mode="block" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 2. 净化、干燥、收集、尾气四大环节详解 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* 净化除杂 */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Droplets className="w-3.5 h-3.5 text-blue-600" />
                              净化除杂试剂与原理
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-150">
                              长进短出
                            </span>
                          </div>
                          <div className="text-xs text-slate-700 font-semibold">
                            {gas.purifyReagent}
                          </div>
                          <div className="text-[11px] text-slate-500 leading-relaxed">
                            {gas.purifyPrinciple}
                          </div>
                          {gas.impurities.length > 0 && (
                            <div className="text-[10px] text-amber-700 font-medium">
                              主要杂质: {gas.impurities.join('、')}
                            </div>
                          )}
                        </div>

                        {/* 干燥剂推荐与禁忌 */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-emerald-600" />
                              干燥剂选择与禁忌
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-slate-500">可用:</span>
                            {gas.dryReagents.map((d, i) => (
                              <span
                                key={i}
                                className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold"
                              >
                                ✓ {d}
                              </span>
                            ))}
                          </div>
                          {gas.incompatibleDrying.length > 0 && (
                            <div className="space-y-0.5 pt-1">
                              <span className="text-[10px] font-bold text-rose-600 block">严禁使用:</span>
                              {gas.incompatibleDrying.map((f, i) => (
                                <div key={i} className="text-[11px] text-rose-700 flex items-start gap-1 font-medium">
                                  <span>❌</span>
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 收集与验满 */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Beaker className="w-3.5 h-3.5 text-indigo-600" />
                            规范收集与定性验满
                          </span>
                          <div className="text-xs text-indigo-700 font-bold">
                            方法: {gas.collectionMethod}
                          </div>
                          <div className="text-[11px] text-slate-600">
                            依据: {gas.collectionReason}
                          </div>
                          <div className="text-[11px] text-slate-800 font-medium p-1.5 rounded bg-slate-50 border border-slate-200">
                            🎯 验满方法: {gas.testAndFull}
                          </div>
                        </div>

                        {/* 尾气处理与吸收 */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            尾气处理与防倒吸
                          </span>
                          <div className="text-xs text-rose-700 font-bold">
                            {gas.tailGasMethod}
                          </div>
                          {gas.tailGasReagent && (
                            <div className="p-1.5 rounded bg-slate-50 border border-slate-200 text-slate-800 text-[10px]">
                              <KatexFormula formula={gas.tailGasReagent} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 3. 高考必背高频失分雷区 */}
                      <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>高考答题规范与高频易错踩分点:</span>
                        </div>
                        <ul className="space-y-1 pl-1">
                          {gas.examTraps.map((trap, i) => (
                            <li key={i} className="text-xs text-amber-900 flex items-start gap-1.5">
                              <span className="text-amber-600 font-bold">▪</span>
                              <span className="leading-relaxed">{trap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
