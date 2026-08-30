import React from 'react'
import type { FunctionalGroupItem, TotalConsumptionResult } from '../types'
import { BookOpen, AlertTriangle, Calculator, FileSpreadsheet } from 'lucide-react'

interface OrganicRightPanelProps {
  selectedGroup?: FunctionalGroupItem
  consumption: TotalConsumptionResult
}

export const OrganicRightPanel: React.FC<OrganicRightPanelProps> = ({
  selectedGroup,
  consumption,
}) => {
  return (
    <div className="w-full h-full p-4 bg-white overflow-y-auto space-y-4 text-slate-800">
      {/* 选中官能团详解 */}
      {selectedGroup && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">{selectedGroup.name}</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-indigo-100 text-indigo-800">
              {selectedGroup.formula}
            </span>
          </div>

          <div className="text-xs space-y-1.5 pt-1">
            <div className="text-slate-600">
              <strong className="text-slate-800">代表反应方程式：</strong>
              <div className="p-2 bg-white rounded border border-slate-200 text-xs font-mono text-indigo-700 mt-1 overflow-x-auto">
                {selectedGroup.testEquation}
              </div>
            </div>

            <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900">
              <div className="flex items-center gap-1 font-bold mb-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>高考必考易错红线</span>
              </div>
              <p className="text-[11px] leading-relaxed">{selectedGroup.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* 目标分子消耗统计明细 */}
      <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-indigo-900">
          <Calculator className="w-4 h-4 text-indigo-600" />
          <span>目标组合分子定量反应统计 (1 mol)</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="p-1.5 bg-white rounded border border-indigo-100 flex justify-between">
            <span className="text-slate-500">消耗 Na:</span>
            <span className="font-bold text-blue-600">{consumption.Na} mol</span>
          </div>
          <div className="p-1.5 bg-white rounded border border-indigo-100 flex justify-between">
            <span className="text-slate-500">消耗 NaOH:</span>
            <span className="font-bold text-pink-600">{consumption.NaOH} mol</span>
          </div>
          <div className="p-1.5 bg-white rounded border border-indigo-100 flex justify-between">
            <span className="text-slate-500">消耗 NaHCO₃:</span>
            <span className="font-bold text-purple-600">{consumption.NaHCO3} mol</span>
          </div>
          <div className="p-1.5 bg-white rounded border border-indigo-100 flex justify-between">
            <span className="text-slate-500">消耗 Na₂CO₃:</span>
            <span className="font-bold text-indigo-600">{consumption.Na2CO3} mol</span>
          </div>
          <div className="p-1.5 bg-white rounded border border-indigo-100 flex justify-between">
            <span className="text-slate-500">消耗 Br₂:</span>
            <span className="font-bold text-orange-600">{consumption.Br2} mol</span>
          </div>
          <div className="p-1.5 bg-white rounded border border-indigo-100 flex justify-between">
            <span className="text-slate-500">消耗 H₂:</span>
            <span className="font-bold text-emerald-600">{consumption.H2} mol</span>
          </div>
        </div>
      </div>

      {/* 高考有机定量核心速查表 */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <FileSpreadsheet className="w-4 h-4 text-slate-600" />
          <span>高考 1mol 常见基团定量反应摩尔比速查</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-1">官能团</th>
                <th className="py-1">Na</th>
                <th className="py-1">NaOH</th>
                <th className="py-1">NaHCO₃</th>
                <th className="py-1">Br₂</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-1 font-semibold">醇 -OH</td>
                <td className="py-1 text-blue-600 font-bold">1</td>
                <td className="py-1 text-slate-300">0</td>
                <td className="py-1 text-slate-300">0</td>
                <td className="py-1 text-slate-300">0</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">酚 -OH</td>
                <td className="py-1 text-blue-600 font-bold">1</td>
                <td className="py-1 text-pink-600 font-bold">1</td>
                <td className="py-1 text-slate-300">0</td>
                <td className="py-1 text-orange-600 font-bold">3(浓)</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">羧基 -COOH</td>
                <td className="py-1 text-blue-600 font-bold">1</td>
                <td className="py-1 text-pink-600 font-bold">1</td>
                <td className="py-1 text-purple-600 font-bold">1</td>
                <td className="py-1 text-slate-300">0</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">普通酯 -COOR</td>
                <td className="py-1 text-slate-300">0</td>
                <td className="py-1 text-pink-600 font-bold">1</td>
                <td className="py-1 text-slate-300">0</td>
                <td className="py-1 text-slate-300">0</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold text-rose-700">酚酯 -COO-Ar</td>
                <td className="py-1 text-slate-300">0</td>
                <td className="py-1 text-rose-700 font-extrabold">2 (必考)</td>
                <td className="py-1 text-slate-300">0</td>
                <td className="py-1 text-slate-300">0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 酸性强弱顺口溜 */}
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>酸性相对强弱顺序（高考推断金科玉律）</span>
        </div>
        <p className="font-mono font-bold text-amber-800 text-[11px]">
          R-COOH &gt; H₂CO₃ &gt; C₆H₅OH &gt; HCO₃⁻ &gt; R-OH &gt; H₂O
        </p>
        <p className="text-[10px] text-amber-700">
          * 根据“强酸制弱酸”：向苯酚钠溶液中通入 CO₂（无论过量或少量）均只能生成 NaHCO₃ 和苯酚，绝不生成 Na₂CO₃！
        </p>
      </div>
    </div>
  )
}
