import React, { useState } from 'react'
import { KatexFormula } from '@/components/UI'
import type { CrystalTypeData, CrystalCalculationResult } from '../types'

interface Crystal3DRightPanelProps {
  crystalData: CrystalTypeData
  calcResult: CrystalCalculationResult
  edgeLengthPm: number
}

export const Crystal3DRightPanel: React.FC<Crystal3DRightPanelProps> = ({
  crystalData,
  calcResult,
  edgeLengthPm,
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopyFormula = () => {
    const copyText = `【${crystalData.name}】晶胞密度推导公式：\n${calcResult.densityLatex}\n其中 N = ${calcResult.totalZ}, M = ${crystalData.molarMass} g/mol, a = ${edgeLengthPm} pm = ${edgeLengthPm}×10⁻¹⁰ cm\n计算密度结果 ρ = ${calcResult.densityValue.toFixed(3)} g/cm³`
    navigator.clipboard.writeText(copyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full h-full p-4 bg-white overflow-y-auto font-sans flex flex-col gap-4">
      {/* 标题与化学式卡片 */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-800">{crystalData.name}</h3>
          <div className="text-xs text-blue-600 font-semibold mt-0.5">
            化学式 / 比例: {calcResult.formulaRatioStr}
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold shadow-xs">
          Z = {calcResult.totalZ}
        </div>
      </div>

      {/* 均摊切割数计算表 */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <span>✂️</span> 均摊法计算单个晶胞内原子个数 (N)
        </h4>

        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2 px-3">微粒</th>
                <th className="py-2 px-2 text-center">顶点 (1/8)</th>
                <th className="py-2 px-2 text-center">棱心 (1/4)</th>
                <th className="py-2 px-2 text-center">面心 (1/2)</th>
                <th className="py-2 px-2 text-center">体心/内部</th>
                <th className="py-2 px-3 text-right">净个数 N</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {calcResult.elementDetails.map((detail) => (
                <tr key={detail.element} className="hover:bg-slate-50/50">
                  <td className="py-2 px-3 font-semibold flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: detail.color }}
                    />
                    {detail.element}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-slate-500">
                    {detail.cornerCount ? `${detail.cornerCount}×1/8` : '-'}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-slate-500">
                    {detail.edgeCount ? `${detail.edgeCount}×1/4` : '-'}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-slate-500">
                    {detail.faceCount ? `${detail.faceCount}×1/2` : '-'}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-slate-500">
                    {detail.bodyCount + detail.internalCount > 0
                      ? `${detail.bodyCount + detail.internalCount}×1`
                      : '-'}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-blue-600">
                    {detail.netCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 晶胞密度 ρ 导出算式与一键复制 */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span>📐</span> 晶胞密度 (ρ) 代数推导与求解
          </h4>
          <button
            onClick={handleCopyFormula}
            className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
          >
            {copied ? '✓ 已复制算式' : '📋 一键导出公式'}
          </button>
        </div>

        {/* 实时 KaTeX 动态算式渲染 */}
        <div className="p-3 bg-white rounded-lg border border-slate-200/80 font-mono text-xs text-slate-800 leading-relaxed overflow-x-auto">
          <div className="text-blue-700 font-bold mb-1">
            <KatexFormula formula={calcResult.densityLatex} mode="block" />
          </div>
          <div className="mt-2 text-emerald-600 font-bold text-sm border-t border-slate-100 pt-1.5 flex items-center justify-between">
            <span>密度实时计算结果:</span>
            <span className="font-mono text-base">ρ ≈ {calcResult.densityValue.toFixed(3)} g/cm³</span>
          </div>
        </div>
      </div>

      {/* 相切几何与空间利用率 */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 shadow-xs flex flex-col gap-2">
        <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
          <span>📏</span> 几何相切关系与配位数
        </h4>
        <div className="text-xs text-amber-800 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold shrink-0">相切公式：</span>
            <KatexFormula formula={crystalData.tangentFormulaLatex} mode="inline" />
          </div>
          <div>
            <span className="font-semibold">几何说明：</span>
            {crystalData.tangentDescription}
          </div>
          <div>
            <span className="font-semibold">配位数：</span>
            {crystalData.coordNumberDescription}
          </div>
          {calcResult.spaceOccupancyPercent && (
            <div className="mt-1 pt-1.5 border-t border-amber-200/60 font-semibold text-amber-900 flex items-center justify-between">
              <span>空间利用率:</span>
              <span className="font-mono font-bold text-amber-950">η ≈ {calcResult.spaceOccupancyPercent}%</span>
            </div>
          )}
        </div>
      </div>

      {/* 高考避坑指南 */}
      <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80 shadow-xs flex flex-col gap-2">
        <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
          <span>⚠️</span> 高考选必二大题易错防坑陷阱
        </h4>
        <ul className="text-xs text-rose-800 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-rose-950">单位统一：</strong>
            晶胞边长 a 单位必须从 pm 换算为 cm (a pm = a × 10⁻¹⁰ cm)，体积 V = a³ × 10⁻³⁰ cm³。
          </li>
          <li>
            <strong className="text-rose-950">均摊位置归属：</strong>
            顶点占比 1/8（被 8 个晶胞共用）、棱心 1/4、面心 1/2、体心与内部完整计算为 1。
          </li>
          <li>
            <strong className="text-rose-950">六方晶胞底面积：</strong>
            六方平行六面体晶胞底面积 S = a² sin 60° = (√3 / 2) a²。
          </li>
        </ul>
      </div>
    </div>
  )
}
