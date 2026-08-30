import React from 'react'
import type { IonItem, CoexistenceConflict } from '../types'
import { AlertCircle, CheckCircle2, ShieldAlert, BookOpen, Sparkles } from 'lucide-react'

interface IonRightPanelProps {
  inquiryMode: 'single-test' | 'coexistence-check'
  selectedIon?: IonItem
  conflicts: CoexistenceConflict[]
  coexistenceIons: IonItem[]
}

export const IonRightPanel: React.FC<IonRightPanelProps> = ({
  inquiryMode,
  selectedIon,
  conflicts,
  coexistenceIons,
}) => {
  return (
    <div className="w-full h-full p-4 bg-white overflow-y-auto space-y-4 text-slate-800">
      {inquiryMode === 'single-test' && selectedIon && (
        <>
          {/* 离子档案卡片 */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-900">{selectedIon.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                {selectedIon.examImportance === 'ultra' ? '高考高频必考' : '常见考查'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded border border-slate-100">
                <span className="text-slate-500 block">溶液颜色</span>
                <span className="font-semibold text-slate-700">{selectedIon.colorInSolution}</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-100">
                <span className="text-slate-500 block">特效试剂</span>
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
            <div className="p-2 bg-white rounded border border-blue-200 text-xs font-mono text-blue-800 overflow-x-auto">
              {selectedIon.testEquation}
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
                  className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-700">
                      {c.ionA} 与 {c.ionB}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      {c.typeLabel}
                    </span>
                  </div>
                  <div className="font-mono text-slate-700 bg-white p-1.5 rounded border border-slate-100">
                    {c.equation}
                  </div>
                  <div className="text-slate-600">{c.reason}</div>
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
