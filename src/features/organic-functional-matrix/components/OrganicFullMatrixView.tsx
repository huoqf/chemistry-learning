import React, { useState, useMemo } from 'react'
import { FUNCTIONAL_GROUPS } from '../constants'
import { KatexFormula } from '@/components/UI'
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Beaker,
  AlertTriangle,
  Box,
  Radio,
  ShieldCheck,
} from 'lucide-react'
import {
  get3DModelForGroup,
  ORGANIC_3D_MOLECULES,
  type Organic3DMolecule,
} from '../data/organic3dData'
import { OrganicMolecule3DModal } from './OrganicMolecule3DModal'
import { OrganicSpectroscopyView } from './OrganicSpectroscopyView'
import { OrganicProtectionPolymerView } from './OrganicProtectionPolymerView'

interface OrganicFullMatrixViewProps {
  selectedGroupId: string
  onSelectGroup?: (id: string) => void
  onAddGroupToCustom?: (id: string) => void
}

type MainTabMode = 'matrix' | 'spectroscopy' | 'protection-polymer'
type CategoryFilter = 'all' | 'oxygen' | 'hydrocarbon' | 'nitrogen'
type FeatureFilter = 'all' | 'na' | 'naoh' | 'nahco3' | 'br2' | 'h2' | 'silver'

export const OrganicFullMatrixView: React.FC<OrganicFullMatrixViewProps> = ({
  selectedGroupId,
  onSelectGroup,
  onAddGroupToCustom,
}) => {
  const [mainTab, setMainTab] = useState<MainTabMode>('matrix')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [featureFilter, setFeatureFilter] = useState<FeatureFilter>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(selectedGroupId || null)
  const [showFormulaCards, setShowFormulaCards] = useState<boolean>(true)
  const [preview3DMolecule, setPreview3DMolecule] = useState<Organic3DMolecule | null>(null)

  // 综合过滤
  const filteredGroups = useMemo(() => {
    return FUNCTIONAL_GROUPS.filter((g) => {
      // 1. 类别筛选
      if (categoryFilter === 'oxygen' && g.category !== 'oxygen-containing') return false
      if (categoryFilter === 'hydrocarbon' && g.category !== 'hydrocarbon-derivative') return false
      if (categoryFilter === 'nitrogen' && g.category !== 'nitrogen-containing') return false

      // 2. 特征快筛
      if (featureFilter === 'na' && g.consumptions.Na === 0) return false
      if (featureFilter === 'naoh' && g.consumptions.NaOH === 0) return false
      if (featureFilter === 'nahco3' && g.consumptions.NaHCO3 === 0) return false
      if (featureFilter === 'br2' && g.consumptions.Br2 === 0) return false
      if (featureFilter === 'h2' && g.consumptions.H2 === 0) return false
      if (
        featureFilter === 'silver' &&
        (!g.qualitativeFeatures?.silverOrFehling ||
          g.qualitativeFeatures.silverOrFehling === '不反应')
      ) {
        return false
      }

      // 3. 搜索匹配
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchName = g.name.toLowerCase().includes(query)
        const matchFormula = g.formula.toLowerCase().includes(query)
        const matchPhenomenon = g.testPhenomenon.toLowerCase().includes(query)
        const matchNotes = g.notes.toLowerCase().includes(query)
        const matchReagent = g.testReagents.some((r) => r.toLowerCase().includes(query))
        const matchIR = g.spectroscopy?.ir.toLowerCase().includes(query)
        const matchNMR = g.spectroscopy?.hnmr.toLowerCase().includes(query)
        if (
          !matchName &&
          !matchFormula &&
          !matchPhenomenon &&
          !matchNotes &&
          !matchReagent &&
          !matchIR &&
          !matchNMR
        ) {
          return false
        }
      }

      return true
    })
  }, [categoryFilter, featureFilter, searchQuery])

  const handleRowClick = (groupId: string) => {
    onSelectGroup?.(groupId)
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId))
  }

  // 动态统计各分类数量
  const categoryCounts = useMemo(() => {
    return {
      all: FUNCTIONAL_GROUPS.length,
      oxygen: FUNCTIONAL_GROUPS.filter((g) => g.category === 'oxygen-containing').length,
      hydrocarbon: FUNCTIONAL_GROUPS.filter((g) => g.category === 'hydrocarbon-derivative').length,
      nitrogen: FUNCTIONAL_GROUPS.filter((g) => g.category === 'nitrogen-containing').length,
    }
  }, [])

  return (
    <div className="w-full h-full p-3.5 overflow-y-auto overflow-x-hidden space-y-3.5 text-slate-800 bg-slate-50/50">
      {/* 0. 顶层大分类 Tab 切换 */}
      <div className="flex items-center justify-between bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMainTab('matrix')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mainTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Beaker className="w-4 h-4" />
            <span>定性特征与定量转化全表</span>
          </button>

          <button
            onClick={() => setMainTab('spectroscopy')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mainTab === 'spectroscopy'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>现代波谱定性分析 (IR & ¹H-NMR)</span>
          </button>

          <button
            onClick={() => setMainTab('protection-polymer')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mainTab === 'protection-polymer'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>有机合成保护基与高分子聚合</span>
          </button>
        </div>

        {/* 快捷 3D 手性碳分子入口 */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs">
          <button
            onClick={() => {
              const lactic = ORGANIC_3D_MOLECULES['lactic-acid-chiral']
              if (lactic) setPreview3DMolecule(lactic)
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            title="查看乳酸手性碳 (*C) 3D 对映立体异构模型"
          >
            <Box className="w-3.5 h-3.5 text-amber-600" />
            <span>手性碳母题 (*C) 3D</span>
          </button>
        </div>
      </div>

      {/* 模式一：定性特征与定量转化全表 */}
      {mainTab === 'matrix' && (
        <>
          {/* 1. 顶部：三大高考金牌秒杀口诀展板 */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="font-bold text-slate-900 text-sm md:text-base">
                  高考三大核心定性推断与定量秒杀模型
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  满分必备规律
                </span>
                <button
                  onClick={() => setShowFormulaCards((prev) => !prev)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title={showFormulaCards ? '折叠口诀展板' : '展开口诀展板'}
                >
                  {showFormulaCards ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {showFormulaCards && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pt-1">
                {/* 口诀 1：酸性阶梯 */}
                <div className="p-3 bg-gradient-to-br from-indigo-50/90 to-white rounded-xl border border-indigo-100 shadow-2xs space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-950 text-xs md:text-sm">
                        口诀一：酸性阶梯定试剂
                      </span>
                      <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded">
                        四级梯度
                      </span>
                    </div>
                    <div className="my-2 p-1.5 bg-white rounded-lg border border-indigo-100/90 shadow-2xs text-center">
                      <KatexFormula
                        formula="\text{R-COOH} > \text{H}_2\text{CO}_3 > \text{Ar-OH} > \text{HCO}_3^- > \text{R-OH}"
                        mode="inline"
                        className="!bg-transparent text-xs md:text-sm font-bold text-indigo-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-700 leading-relaxed bg-white/80 p-2 rounded-lg border border-indigo-50">
                    <div>
                      <strong className="text-rose-700">• 羧基 (-COOH)</strong>：强于碳酸，遇{' '}
                      <code className="text-indigo-800 font-bold bg-indigo-50 px-1 py-0.2 rounded text-[11px]">
                        NaHCO₃
                      </code>{' '}
                      剧烈放出 CO₂ 气体。
                    </div>
                    <div>
                      <strong className="text-purple-700">• 酚羟基 (Ar-OH)</strong>：遇{' '}
                      <code className="text-purple-800 font-bold bg-purple-50 px-1 py-0.2 rounded text-[11px]">
                        Na₂CO₃
                      </code>{' '}
                      生成 NaHCO₃（<strong>不出气</strong>）；不与 NaHCO₃ 反应。
                    </div>
                    <div>
                      <strong className="text-blue-700">• 醇羟基 (R-OH)</strong>：无酸性，只认金属{' '}
                      <code className="text-blue-800 font-bold bg-blue-50 px-1 py-0.2 rounded text-[11px]">Na</code>{' '}
                      置换放 H₂，对强碱/碳酸盐中立不反应。
                    </div>
                  </div>
                </div>

                {/* 口诀 2：水解断键 */}
                <div className="p-3 bg-gradient-to-br from-rose-50/90 to-white rounded-xl border border-rose-100 shadow-2xs space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-950 text-xs md:text-sm">
                        口诀二：水解断键看类别
                      </span>
                      <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded">
                        碱量计算
                      </span>
                    </div>
                    <div className="my-2 p-1.5 bg-white rounded-lg border border-rose-100/90 shadow-2xs text-xs md:text-sm font-bold text-rose-900 text-center">
                      普通酯耗 1 碱 ； 酚酯双重耗 2 碱
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-700 leading-relaxed bg-white/80 p-2 rounded-lg border border-rose-50">
                    <div>
                      <strong className="text-slate-800">• 醇酯 (-COOR)</strong>：水解得 1 羧酸盐 + 1 醇，消耗{' '}
                      <span className="text-rose-700 font-bold">1 mol NaOH</span>。
                    </div>
                    <div>
                      <strong className="text-rose-700">• 酚酯 (-COO-Ar)</strong>：水解得 1 羧酸盐 + 1 酚钠（双酸性位点），必耗{' '}
                      <span className="text-rose-700 font-bold">2 mol NaOH</span>！
                    </div>
                    <div>
                      <strong className="text-amber-800">• 卤代烃/肽键</strong>：脂肪卤代烃水解耗 1 碱；卤代苯水解耗 2 碱；肽键水解耗 1 碱。
                    </div>
                  </div>
                </div>

                {/* 口诀 3：加成还原与定量比 */}
                <div className="p-3 bg-gradient-to-br from-emerald-50/90 to-white rounded-xl border border-emerald-100 shadow-2xs space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 text-xs md:text-sm">
                        口诀三：加成还原与定量比
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                        定量比值
                      </span>
                    </div>
                    <div className="my-2 p-1.5 bg-white rounded-lg border border-emerald-100/90 shadow-2xs text-xs md:text-sm font-bold text-emerald-900 text-center">
                      1 双键耗 1 Br₂/H₂ ； 1 醛基出 2 Ag
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-700 leading-relaxed bg-white/80 p-2 rounded-lg border border-emerald-50">
                    <div>
                      <strong className="text-emerald-800">• 烯烃/炔烃</strong>：1 C=C 耗 1 Br₂ / 1 H₂；1 C≡C 耗 2 Br₂ / 2 H₂。
                    </div>
                    <div>
                      <strong className="text-indigo-800">• 苯环加氢</strong>：1 mol 苯环催化加氢完全还原消耗{' '}
                      <span className="text-indigo-700 font-bold">3 mol H₂</span>。
                    </div>
                    <div>
                      <strong className="text-amber-800">• 醛基氧化</strong>：1 mol -CHO 银镜出{' '}
                      <span className="text-amber-700 font-bold">2 mol Ag</span> 或出{' '}
                      <span className="text-amber-700 font-bold">1 mol Cu₂O</span> 砖红沉淀。
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. 交互控制区：类别与考点快筛 */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* 类别筛选 */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                {(
                  [
                    { label: `全部官能团 (${categoryCounts.all})`, value: 'all' },
                    { label: `含氧官能团 (${categoryCounts.oxygen})`, value: 'oxygen' },
                    { label: `烃与卤代烃 (${categoryCounts.hydrocarbon})`, value: 'hydrocarbon' },
                    { label: `含氮衍生物 (${categoryCounts.nitrogen})`, value: 'nitrogen' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCategoryFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                      categoryFilter === opt.value
                        ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* 搜索框 */}
              <div className="relative flex-1 min-w-[200px] max-w-[280px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索官能团 / 结构式 / 波谱 / 检验现象..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/70"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* 高考特征快筛标签 */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
              <span className="flex items-center gap-1 text-slate-400 shrink-0 font-medium mr-1">
                <Filter className="w-3.5 h-3.5" />
                考点快筛:
              </span>
              {[
                { label: '全部特征', value: 'all' },
                { label: '遇 Na 放 H₂', value: 'na' },
                { label: '遇 NaOH 中和/水解', value: 'naoh' },
                { label: '遇 NaHCO₃ 放 CO₂', value: 'nahco3' },
                { label: '使溴水褪色/取代', value: 'br2' },
                { label: '与 H₂ 加成还原', value: 'h2' },
                { label: '银镜 / 斐林反应', value: 'silver' },
              ].map((item) => {
                const isActive = featureFilter === item.value
                return (
                  <button
                    key={item.value}
                    onClick={() => setFeatureFilter(item.value as FeatureFilter)}
                    className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. 反应矩阵大表 */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Beaker className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-slate-900 text-sm md:text-base">
                  1 mol 官能团定量反应消耗与定性特征全景矩阵
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                共匹配 <strong className="text-indigo-600 font-bold">{filteredGroups.length}</strong> / {FUNCTIONAL_GROUPS.length} 项
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full table-fixed text-left border-collapse divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-800 font-bold select-none text-xs">
                  <tr>
                    <th className="w-[20%] py-2.5 px-3">官能团 / 结构</th>
                    <th className="w-[8%] py-2.5 px-1 text-center bg-blue-50/80 text-blue-950">Na</th>
                    <th className="w-[9%] py-2.5 px-1 text-center bg-pink-50/80 text-pink-950">NaOH</th>
                    <th className="w-[9%] py-2.5 px-1 text-center bg-purple-50/80 text-purple-950">NaHCO₃</th>
                    <th className="w-[9%] py-2.5 px-1 text-center bg-indigo-50/80 text-indigo-950">Na₂CO₃</th>
                    <th className="w-[9%] py-2.5 px-1 text-center bg-orange-50/80 text-orange-950">浓 Br₂</th>
                    <th className="w-[8%] py-2.5 px-1 text-center bg-emerald-50/80 text-emerald-950">H₂</th>
                    <th className="w-[34%] py-2.5 px-3">宏观定性检验与特异现象</th>
                    <th className="w-[4%] py-2.5 px-1 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 text-xs">
                  {filteredGroups.map((g) => {
                    const isSelected = selectedGroupId === g.id
                    const isExpanded = expandedGroupId === g.id
                    const qualitative = g.qualitativeFeatures

                    return (
                      <React.Fragment key={g.id}>
                        <tr
                          onClick={() => handleRowClick(g.id)}
                          className={`transition-colors cursor-pointer ${
                            isSelected ? 'bg-indigo-50/90 font-medium' : 'hover:bg-slate-50/90'
                          } ${isExpanded ? 'border-l-4 border-l-indigo-600' : ''}`}
                        >
                          <td className="py-2.5 px-3">
                            <div className="font-extrabold text-slate-900 text-xs sm:text-[13px] truncate leading-tight">
                              {g.name.split(' ')[0]}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded text-[11px]">
                                {g.structureSvg}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const m = get3DModelForGroup(g.id)
                                  if (m) setPreview3DMolecule(m)
                                }}
                                className="inline-flex items-center gap-1 text-[10.5px] font-bold text-indigo-600 hover:text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 px-1.5 py-0.5 rounded cursor-pointer transition-colors shadow-2xs"
                                title="原地查看该官能团代表分子的 3D 空间球棍模型"
                              >
                                <Box className="w-3 h-3 text-indigo-500" />
                                <span>3D</span>
                              </button>
                            </div>
                          </td>

                          {/* Na */}
                          <td className="py-2.5 px-1 text-center font-mono">
                            {g.consumptions.Na > 0 ? (
                              <div className="inline-flex flex-col items-center">
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-black text-xs">
                                  {g.consumptions.Na}
                                </span>
                                <span className="text-[10px] text-blue-700 font-semibold mt-0.5">0.5 H₂</span>
                              </div>
                            ) : (
                              <span className="text-slate-300 font-semibold">-</span>
                            )}
                          </td>

                          {/* NaOH */}
                          <td className="py-2.5 px-1 text-center font-mono">
                            {g.consumptions.NaOH > 0 ? (
                              <div className="inline-flex flex-col items-center">
                                <span
                                  className={`px-2 py-0.5 rounded font-black text-xs ${
                                    g.consumptions.NaOH === 2
                                      ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                                      : 'bg-pink-100 text-pink-900'
                                  }`}
                                >
                                  {g.consumptions.NaOH}
                                </span>
                                <span className="text-[10px] text-pink-800 font-bold mt-0.5">
                                  {g.consumptions.NaOH === 2 ? '双倍中和' : '中和/水解'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-300 font-semibold">-</span>
                            )}
                          </td>

                          {/* NaHCO3 */}
                          <td className="py-2.5 px-1 text-center font-mono">
                            {g.consumptions.NaHCO3 > 0 ? (
                              <div className="inline-flex flex-col items-center">
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded font-black text-xs">
                                  {g.consumptions.NaHCO3}
                                </span>
                                <span className="text-[10px] text-purple-700 font-bold mt-0.5">1 CO₂</span>
                              </div>
                            ) : (
                              <span className="text-slate-300 font-semibold">-</span>
                            )}
                          </td>

                          {/* Na2CO3 */}
                          <td className="py-2.5 px-1 text-center font-mono">
                            {g.consumptions.Na2CO3 > 0 ? (
                              <div className="inline-flex flex-col items-center">
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded font-black text-xs">
                                  {g.consumptions.Na2CO3}
                                </span>
                                <span className="text-[10px] text-indigo-700 font-semibold mt-0.5">
                                  {g.id === 'phenol-oh' ? '不产气' : '0.5 CO₂'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-300 font-semibold">-</span>
                            )}
                          </td>

                          {/* 浓 Br2 */}
                          <td className="py-2.5 px-1 text-center font-mono">
                            {g.consumptions.Br2 > 0 ? (
                              <div className="inline-flex flex-col items-center">
                                <span
                                  className={`px-2 py-0.5 rounded font-black text-xs ${
                                    g.consumptions.Br2 === 3
                                      ? 'bg-orange-600 text-white shadow-xs'
                                      : 'bg-orange-100 text-orange-900'
                                  }`}
                                >
                                  {g.consumptions.Br2}
                                </span>
                                <span className="text-[10px] text-orange-800 font-bold mt-0.5">
                                  {g.id === 'phenol-oh' ? '三溴代' : '加成/氧'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-300 font-semibold">-</span>
                            )}
                          </td>

                          {/* H2 */}
                          <td className="py-2.5 px-1 text-center font-mono">
                            {g.consumptions.H2 > 0 ? (
                              <div className="inline-flex flex-col items-center">
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-black text-xs">
                                  {g.consumptions.H2}
                                </span>
                                <span className="text-[10px] text-emerald-800 font-semibold mt-0.5">加氢</span>
                              </div>
                            ) : (
                              <span className="text-slate-300 font-semibold">-</span>
                            )}
                          </td>

                          {/* 宏观特征 */}
                          <td className="py-2.5 px-3 text-xs text-slate-700 leading-relaxed break-words">
                            {g.testPhenomenon}
                          </td>

                          <td className="py-2.5 px-1 text-center text-slate-400">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 inline-block text-indigo-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 inline-block hover:text-slate-600" />
                            )}
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-gradient-to-r from-indigo-50/60 via-white to-indigo-50/30">
                            <td colSpan={9} className="p-4 border-b border-indigo-100">
                              <div className="p-3.5 bg-white rounded-xl border border-indigo-200/90 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                                  <div className="flex items-center gap-2.5">
                                    <span className="font-bold text-slate-900 text-sm md:text-base">
                                      {g.name} 深度考点与波谱特征
                                    </span>
                                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                                      {g.formula}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        const m = get3DModelForGroup(g.id)
                                        if (m) setPreview3DMolecule(m)
                                      }}
                                      className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-lg border border-indigo-200 transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                                    >
                                      <Box className="w-3.5 h-3.5 text-indigo-600" />
                                      <span>查看 3D 球棍模型</span>
                                    </button>

                                    {onAddGroupToCustom && (
                                      <button
                                        onClick={() => onAddGroupToCustom(g.id)}
                                        className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
                                      >
                                        加入自由组装分子
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* 代表方程式 */}
                                <div className="space-y-1">
                                  <span className="text-xs font-bold text-slate-600">典型代表反应方程式：</span>
                                  <div className="p-2 bg-slate-50/90 rounded-lg border border-slate-200 text-center overflow-hidden">
                                    <KatexFormula
                                      formula={g.testEquation}
                                      mode="block"
                                      className="!bg-transparent text-xs md:text-sm text-indigo-950 font-bold"
                                    />
                                  </div>
                                </div>

                                {/* 鉴别试剂与现象 */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                  <div className="p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-100 space-y-1">
                                    <div className="font-bold text-emerald-950 text-xs">专属鉴别试剂</div>
                                    <div className="text-slate-800 text-xs leading-relaxed">
                                      {g.testReagents.join(' / ')}
                                    </div>
                                  </div>

                                  <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-100 space-y-1">
                                    <div className="font-bold text-amber-950 text-xs">特征实验现象与定性反应</div>
                                    <div className="text-slate-800 text-xs leading-relaxed">
                                      {g.testPhenomenon}
                                      {qualitative?.silverOrFehling && qualitative.silverOrFehling !== '不反应' && (
                                        <div className="text-amber-900 font-bold mt-1">
                                          • 银镜/斐林：{qualitative.silverOrFehling}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* 新增：现代波谱特征 (IR & NMR) */}
                                {g.spectroscopy && (
                                  <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-100 space-y-1.5 text-xs">
                                    <div className="font-bold text-blue-950 flex items-center gap-1.5">
                                      <Radio className="w-3.5 h-3.5 text-blue-700" />
                                      <span>现代仪器波谱定性分析 (高考前沿真题)</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-700">
                                      <div>
                                        <strong className="text-blue-900">红外光谱 (IR)：</strong> {g.spectroscopy.ir}
                                      </div>
                                      <div>
                                        <strong className="text-blue-900">¹H-NMR 核磁：</strong> {g.spectroscopy.hnmr}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* 高考陷阱 */}
                                <div className="p-3 bg-rose-50/80 rounded-lg border border-rose-100 flex items-start gap-2 text-xs">
                                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                  <div className="space-y-0.5">
                                    <span className="font-bold text-rose-950 text-xs">高考易错警示与命题陷阱：</span>
                                    <p className="text-xs text-slate-700 leading-relaxed">{g.notes}</p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 模式二：现代波谱定性分析 (IR & ¹H-NMR) */}
      {mainTab === 'spectroscopy' && (
        <OrganicSpectroscopyView onPreview3D={(m) => setPreview3DMolecule(m)} />
      )}

      {/* 模式三：有机合成保护基与高分子聚合 */}
      {mainTab === 'protection-polymer' && <OrganicProtectionPolymerView />}

      {/* 原地 3D 空间球棍模型浮层模态窗 */}
      {preview3DMolecule && (
        <OrganicMolecule3DModal
          molecule={preview3DMolecule}
          onClose={() => setPreview3DMolecule(null)}
        />
      )}
    </div>
  )
}
