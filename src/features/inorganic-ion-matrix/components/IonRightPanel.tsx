import React from 'react'
import type { IonItem, CoexistenceConflict, ReagentOption } from '../types'
import { AlertCircle, CheckCircle2, ShieldAlert, Sparkles, HelpCircle, BookOpen } from 'lucide-react'
import { KatexFormula } from '@/components/UI'

interface IonRightPanelProps {
  inquiryMode: 'single-test' | 'coexistence-check'
  selectedIon?: IonItem
  selectedReagent?: ReagentOption
  dropCount: number
  conflicts: CoexistenceConflict[]
  coexistenceIons: IonItem[]
}

export const IonRightPanel: React.FC<IonRightPanelProps> = ({
  inquiryMode,
  selectedIon,
  selectedReagent,
  dropCount,
  conflicts,
  coexistenceIons,
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

          {/* 实验现象与方程式 (KaTeX 科学排版) */}
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

          {/* 冲突明细列表 (KaTeX 科学排版) */}
          {conflicts.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">互斥反应与机理解析：</div>
              {conflicts.map((c, idx) => (
                <div
                  key={c.id || idx}
                  className="p-3 bg-white rounded-xl border border-rose-200 space-y-1.5 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between text-rose-800 font-bold">
                    <span>{idx + 1}. 【{c.typeLabel}】</span>
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
              <li><strong>看颜色</strong>：无色溶液中不能含有 Cu²⁺(蓝), Fe³⁺(黄), Fe²⁺(浅绿), MnO₄⁻(紫)</li>
              <li><strong>看介质(酸碱性)</strong>：强酸性溶液不能含 CO₃²⁻/HCO₃⁻/S²⁻/SO₃²⁻/OH⁻ 等</li>
              <li><strong>看氧化还原</strong>：Fe³⁺/NO₃⁻(H⁺)/ClO⁻ 与 S²⁻/I⁻/SO₃²⁻/Fe²⁺ 不能共存</li>
              <li><strong>看彻底双水解</strong>：Al³⁺/Fe³⁺ 与 CO₃²⁻/HCO₃⁻/S²⁻/AlO₂⁻ 不能大量共存</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
