import React from 'react'
import type { IonItem, CoexistenceConflict, ReagentOption, InquiryMode } from '../types'
import {
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  Flame,
  Zap,
} from 'lucide-react'
import { KatexFormula } from '@/components/UI'
import { findMechanismItem, MECHANISM_GROUPS } from '../data/mechanismGridData'

interface IonRightPanelProps {
  inquiryMode: InquiryMode
  selectedIon?: IonItem
  selectedReagent?: ReagentOption
  dropCount: number
  conflicts: CoexistenceConflict[]
  coexistenceIons: IonItem[]
  selectedPair?: { cationId: string; anionId: string } | null
}

export const IonRightPanel: React.FC<IonRightPanelProps> = ({
  inquiryMode,
  selectedIon,
  selectedReagent,
  dropCount,
  conflicts,
  coexistenceIons,
  selectedPair,
}) => {
  return (
    <div className="p-4 space-y-4 text-slate-800">
      {inquiryMode === 'single-test' && selectedIon && (
        <>
          {/* 当前选定试剂的探究反馈与避坑剖析 */}
          {selectedReagent && (
            <div
              className={`p-3 rounded-xl border ${
                selectedReagent.tag === 'optimal'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : selectedReagent.tag === 'trap'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  {selectedReagent.tag === 'optimal' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : selectedReagent.tag === 'trap' ? (
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                  ) : (
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                  )}
                  <span>
                    当前试剂：{selectedReagent.name} {dropCount > 0 && `(已滴加 ${dropCount} 阶段)`}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    selectedReagent.tag === 'optimal'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedReagent.tag === 'trap'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {selectedReagent.tag === 'optimal'
                    ? '高考最佳首选'
                    : selectedReagent.tag === 'trap'
                    ? '高考经典陷阱'
                    : '无关干扰试剂'}
                </span>
              </div>
              <div className="text-xs leading-relaxed font-medium">
                {selectedReagent.feedback}
              </div>
            </div>
          )}

          {/* 离子档案卡片 */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>{selectedIon.name}</span>
                <span className="text-xs text-slate-500 font-mono">
                  <KatexFormula formula={selectedIon.formula} mode="inline" />
                </span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                {selectedIon.examImportance === 'ultra' ? '高考高频必考' : '常见考查'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded border border-slate-100">
                <span className="text-slate-500 block">溶液原液外观</span>
                <span className="font-semibold text-slate-700">{selectedIon.colorInSolution}</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-100">
                <span className="text-slate-500 block">标配首选试剂</span>
                <span className="font-semibold text-blue-700">{selectedIon.testReagent}</span>
              </div>
            </div>
          </div>

          {/* 实验现象与方程式 */}
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>特征检验现象与反应方程式</span>
            </div>
            <div className="text-xs text-slate-700 leading-relaxed font-medium">
              {selectedIon.testPhenomenon}
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-blue-200 text-xs text-blue-900 overflow-x-auto shadow-xs">
              <KatexFormula formula={selectedIon.testEquation} mode="block" />
            </div>
          </div>

          {/* 干扰排除与避坑 */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>干扰离子排除与避坑指南</span>
            </div>
            <div className="text-xs text-amber-800 leading-relaxed">
              {selectedIon.interference}
            </div>
          </div>

          {/* 高考标准答题模板 */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>高考标准答题规范句式 (必背)</span>
            </div>
            <div className="text-xs text-emerald-800 leading-relaxed font-serif bg-white p-2 rounded border border-emerald-100">
              “{selectedIon.standardProcedure}”
            </div>
          </div>
        </>
      )}

      {inquiryMode === 'coexistence-check' && (
        <>
          {/* 共存判定概览 */}
          <div
            className={`p-3 rounded-xl border ${
              conflicts.length === 0
                ? 'bg-green-50 border-green-200 text-green-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {conflicts.length === 0 ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>
                {conflicts.length === 0
                  ? '已选离子可在同一溶液中大量共存'
                  : `无法大量共存 (发现 ${conflicts.length} 组反应互斥)`}
              </span>
            </div>
            <div className="text-xs mt-1 opacity-80">
              已选离子: {coexistenceIons.map((i) => i.id).join(', ') || '未选择'}
            </div>
          </div>

          {/* 冲突明细列表 */}
          {conflicts.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">互斥反应与机理解析：</div>
              {conflicts.map((c, idx) => (
                <div
                  key={c.id || idx}
                  className="p-3 bg-white rounded-xl border border-rose-200 space-y-1.5 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between text-rose-800 font-bold">
                    <span>
                      {idx + 1}. 【{c.typeLabel}】
                    </span>
                    <span className="text-[10px] bg-rose-100 px-1.5 py-0.5 rounded text-rose-700">
                      {c.ionA} 与 {c.ionB}
                    </span>
                  </div>
                  <div className="p-2 bg-rose-50/70 rounded border border-rose-100 text-xs text-rose-950 overflow-x-auto">
                    <KatexFormula formula={c.equation} mode="block" />
                  </div>
                  <div className="text-slate-600 text-[11px] leading-relaxed">{c.reason}</div>
                </div>
              ))}
            </div>
          )}

          {/* 高考口诀 */}
          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1.5 text-xs text-indigo-900">
            <div className="flex items-center gap-1.5 font-bold">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>高考离子共存四大互斥铁律口诀</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>
                <strong>看颜色</strong>：无色溶液中不能含有 Cu²⁺(蓝), Fe³⁺(黄), Fe²⁺(浅绿), MnO₄⁻(紫)
              </li>
              <li>
                <strong>看介质(酸碱性)</strong>：强酸性溶液不能含 CO₃²⁻/HCO₃⁻/S²⁻/SO₃²⁻/OH⁻ 等
              </li>
              <li>
                <strong>看氧化还原</strong>：Fe³⁺/NO₃⁻(H⁺)/ClO⁻ 与 S²⁻/I⁻/SO₃²⁻/Fe²⁺ 不能共存
              </li>
              <li>
                <strong>看彻底双水解</strong>：Al³⁺/Fe³⁺ 与 CO₃²⁻/HCO₃⁻/S²⁻/AlO₂⁻ 不能大量共存
              </li>
            </ul>
          </div>
        </>
      )}

      {inquiryMode === 'mechanism-grid' && (
        <>
          {(() => {
            const currentItem = selectedPair
              ? findMechanismItem(selectedPair.cationId, selectedPair.anionId)
              : undefined

            const currentGroup = currentItem
              ? MECHANISM_GROUPS.find((g) => g.id === currentItem.dimensionId)
              : undefined

            if (currentItem && currentGroup) {
              return (
                <div className="space-y-3">
                  {/* 母题芯片基本身份 */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        {currentGroup.id === 'double-hydrolysis' && (
                          <Flame className="w-4 h-4 text-rose-600" />
                        )}
                        {currentGroup.id === 'redox-hidden' && (
                          <Zap className="w-4 h-4 text-purple-600" />
                        )}
                        {currentGroup.id === 'precipitate-trap' && (
                          <ShieldAlert className="w-4 h-4 text-blue-600" />
                        )}
                        {currentGroup.id === 'gas-weak-acid' && (
                          <Sparkles className="w-4 h-4 text-amber-600" />
                        )}
                        <span>{currentItem.title}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                        {currentItem.tag}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">核心反应产物：</span>
                      <span className="font-bold text-blue-900">{currentItem.productSummary}</span>
                    </div>
                  </div>

                  {/* 离子反应方程式 (KaTeX 规范书写) */}
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>规范离子反应方程式 (必背)</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-indigo-100 text-xs text-indigo-950 overflow-x-auto shadow-2xs">
                      <KatexFormula formula={currentItem.equation} mode="block" />
                    </div>
                  </div>

                  {/* 反应机理与现象剖析 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>反应本质机理与宏观现象</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {currentItem.phenomenon}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-200">
                      <strong>驱动力：</strong>
                      {currentItem.mechanismReason}
                    </p>
                  </div>

                  {/* 高考命题设问陷阱 (提分雷达) */}
                  <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 space-y-1.5 text-xs text-rose-950">
                    <div className="flex items-center gap-1.5 font-bold text-rose-900">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>高考命题陷阱与破题点拨</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-rose-100 leading-relaxed font-medium">
                      {currentItem.examTrap}
                    </div>
                  </div>

                  {/* 维度归属与通关总结 */}
                  <div className="p-2.5 bg-slate-100/70 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>归属维度：{currentGroup.title}</span>
                    <span className="font-bold text-slate-800">一票否决共存</span>
                  </div>
                </div>
              )
            }

            return (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-950 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>新高考 4 大互斥维度命题思维导图</span>
                  </div>
                  <p className="text-[11px] text-indigo-800 leading-relaxed">
                    点击中屏九宫格中任意母题芯片，右侧将立即调取该母题的高考规范方程式、设问角度及命题避坑秘籍。
                  </p>
                </div>

                <div className="space-y-2">
                  {MECHANISM_GROUPS.map((g) => (
                    <div
                      key={g.id}
                      className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900 text-[11px]">
                        <span>{g.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {g.items.length} 组
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-600 leading-relaxed">
                        {g.examFocus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </>
      )}

      {inquiryMode === 'coexistence-matrix' && (
        <>
          {/* 当前选定离子对提示 */}
          {selectedPair && (
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs flex items-center justify-between">
              <span className="font-bold text-blue-950">
                当前大表聚焦：{selectedPair.cationId} 与 {selectedPair.anionId}
              </span>
              <span className="text-[10px] text-blue-700 font-semibold">点击大表切换</span>
            </div>
          )}

          {/* 全景大表模式下的右侧解题指南 */}
          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span>高考离子共存审题“四步秒杀法”</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="p-2 bg-white rounded-lg border border-blue-100">
                <span className="font-bold text-blue-800">第 1 步【看限制条件】：</span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  抓“无色透明”、“酸性/碱性”、“水电离出 c(H⁺)=10⁻¹³”、“通入某种气体”等前置约束。
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-blue-100">
                <span className="font-bold text-blue-800">第 2 步【排查酸碱冲突】：</span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  弱酸根（CO₃²⁻/S²⁻/SO₃²⁻/AlO₂⁻）见酸必互斥；多元弱酸酸式根（HCO₃⁻/HSO₃⁻）酸碱皆排斥。
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-blue-100">
                <span className="font-bold text-blue-800">第 3 步【排查氧化还原】：</span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  牢记 NO₃⁻(H⁺) 和 ClO⁻ 的强氧化性，必氧化 Fe²⁺/I⁻/SO₃²⁻/S²⁻。
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-blue-100">
                <span className="font-bold text-blue-800">第 4 步【排查剧烈双水解与沉淀】：</span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Al³⁺/Fe³⁺ 遇 HCO₃⁻/CO₃²⁻ 必生成沉淀与气体；Ba²⁺ 遇 SO₄²⁻ 必生成难溶白色沉淀。
                </p>
              </div>
            </div>
          </div>

          {/* 高频题干暗语破译 */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>题干高频“暗语”破译字典</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="bg-white p-2 rounded border border-amber-100">
                <span className="font-bold text-amber-900">“pH=1 的溶液”</span>
                <p className="text-[11px] text-slate-600">
                  说明含大量 H⁺，排除 OH⁻、弱酸根及弱酸酸式根。
                </p>
              </div>
              <div className="bg-white p-2 rounded border border-amber-100">
                <span className="font-bold text-amber-900">
                  “由水电离的 c(H⁺) = 10⁻¹³ mol/L”
                </span>
                <p className="text-[11px] text-slate-600">
                  水电离受抑制，溶液可能为强酸性（含 H⁺）或强碱性（含 OH⁻），所选离子需在酸碱两种情况下均能大量共存。
                </p>
              </div>
              <div className="bg-white p-2 rounded border border-amber-100">
                <span className="font-bold text-amber-900">“加入铝粉产生 H₂ 的溶液”</span>
                <p className="text-[11px] text-slate-600">
                  可能为非氧化性强酸溶液，也可能为强碱溶液；若为酸性溶液则不能含 NO₃⁻（否则生成 NO 不放 H₂）。
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
