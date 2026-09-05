import React from 'react'
import { KatexFormula } from '@/components/UI'
import type { CrystalTypeData, CrystalCalculationResult, AtomLocationType } from '../types'

interface Crystal3DRightPanelProps {
  crystalData: CrystalTypeData
  calcResult: CrystalCalculationResult
  selectedLocationType?: AtomLocationType | null
}

export const Crystal3DRightPanel: React.FC<Crystal3DRightPanelProps> = ({
  crystalData,
  calcResult,
  selectedLocationType,
}) => {
  const isCornerSelected = selectedLocationType === 'corner'
  const isEdgeSelected = selectedLocationType === 'edge'
  const isFaceSelected = selectedLocationType === 'face'
  const isBodyOrInternalSelected = selectedLocationType === 'body' || selectedLocationType === 'internal'

  return (
    <div className="w-full h-full p-4 bg-white overflow-y-auto overflow-x-hidden font-sans flex flex-col gap-4">
      {/* 标题与化学式卡片 */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-slate-800 truncate">{crystalData.name}</h3>
            <div className="text-xs text-blue-600 font-semibold mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>化学式: {calcResult.formulaRatioStr}</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-slate-600">a = {crystalData.defaultEdgeLengthPm} pm</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-slate-600">M = {crystalData.molarMass} g/mol</span>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold shadow-xs shrink-0">
            Z = {calcResult.totalZ}
          </div>
        </div>

        {/* 晶胞点阵与构型特征解析 */}
        <div className="text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-blue-100/80">
          <span className="font-semibold text-slate-700">点阵构型：</span>
          {crystalData.description}
        </div>
      </div>

      {/* 均摊切割数计算表 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <span>✂️</span> 均摊法计算单个晶胞内原子个数 (N)
          </h4>
          {selectedLocationType && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium animate-pulse">
              🎯 聚焦位点: {selectedLocationType === 'corner' ? '顶点' : selectedLocationType === 'edge' ? '棱心' : selectedLocationType === 'face' ? '面心' : '体心/内部'}
            </span>
          )}
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs text-xs bg-white">
          <table className="w-full table-fixed text-left border-collapse">
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[17%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[17%]" />
              <col className="w-[18%]" />
            </colgroup>
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                <th className="py-2 px-1 text-center">微粒</th>
                <th className={`py-1.5 px-0.5 text-center transition-colors ${isCornerSelected ? 'bg-blue-100/70 text-blue-900 font-bold' : ''}`}>
                  <div>顶点</div>
                  <div className="text-[10px] text-slate-400 font-normal leading-none mt-0.5">
                    {crystalData.cellParams.gamma === 120 ? '1/12, 1/6' : '1/8'}
                  </div>
                </th>
                <th className={`py-1.5 px-0.5 text-center transition-colors ${isEdgeSelected ? 'bg-blue-100/70 text-blue-900 font-bold' : ''}`}>
                  <div>棱心</div>
                  <div className="text-[10px] text-slate-400 font-normal leading-none mt-0.5">1/4</div>
                </th>
                <th className={`py-1.5 px-0.5 text-center transition-colors ${isFaceSelected ? 'bg-blue-100/70 text-blue-900 font-bold' : ''}`}>
                  <div>面心</div>
                  <div className="text-[10px] text-slate-400 font-normal leading-none mt-0.5">1/2</div>
                </th>
                <th className={`py-1.5 px-0.5 text-center transition-colors ${isBodyOrInternalSelected ? 'bg-blue-100/70 text-blue-900 font-bold' : ''}`}>
                  <div>体心/内</div>
                  <div className="text-[10px] text-slate-400 font-normal leading-none mt-0.5">1</div>
                </th>
                <th className="py-2 px-1 text-center">
                  <div>净个数</div>
                  <div className="text-[10px] text-slate-400 font-normal leading-none mt-0.5">N</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {calcResult.elementDetails.map((detail) => (
                <tr key={detail.element} className="hover:bg-slate-50/50">
                  <td className="py-2 px-1 font-semibold text-center flex items-center justify-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: detail.color }}
                    />
                    <span className="truncate">{detail.element}</span>
                  </td>
                  <td className={`py-2 px-0.5 text-center font-mono text-[11px] transition-colors ${isCornerSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500'}`}>
                    {detail.cornerDetailFormula ? (
                      detail.cornerDetailFormula.includes('+') ? (
                        <div className="leading-tight text-[10px]">
                          <div>4×1/12</div>
                          <div>+4×1/6</div>
                        </div>
                      ) : (
                        detail.cornerDetailFormula
                      )
                    ) : detail.cornerCount ? (
                      `${detail.cornerCount}×1/8`
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className={`py-2 px-0.5 text-center font-mono text-[11px] transition-colors ${isEdgeSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500'}`}>
                    {detail.edgeCount ? `${detail.edgeCount}×1/4` : '-'}
                  </td>
                  <td className={`py-2 px-0.5 text-center font-mono text-[11px] transition-colors ${isFaceSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500'}`}>
                    {detail.faceCount ? `${detail.faceCount}×1/2` : '-'}
                  </td>
                  <td className={`py-2 px-0.5 text-center font-mono text-[11px] transition-colors ${isBodyOrInternalSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500'}`}>
                    {detail.bodyCount + detail.internalCount > 0
                      ? `${detail.bodyCount + detail.internalCount}×1`
                      : '-'}
                  </td>
                  <td className="py-2 px-1 text-center font-mono font-bold text-blue-600">
                    {detail.netCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 新高考核心考点：原子分数坐标与空间定位 */}
      <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 shadow-xs flex flex-col gap-2">
        <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
          <span>📍</span> 新高考高频考点：原子分数坐标 (Fractional Coordinates)
        </h4>
        <div className="text-xs text-indigo-900/90 leading-relaxed space-y-1">
          <p>
            以晶胞基底晶轴向量 <span className="font-mono font-bold text-indigo-800">a, b, c</span> 为基准坐标系，将空间原子位置坐标归一化为无量纲参数 <span className="font-mono font-bold text-indigo-800">(x, y, z)</span>，取值通常在 <span className="font-mono">[0, 1)</span> 区间。
          </p>
          <div className="mt-1.5 text-[11px] text-indigo-700 bg-white/90 p-2 rounded-lg border border-indigo-100">
            💡 <strong>解题互动提示：</strong>在 3D 画布中直接点击任意原子，左下方弹窗即可实时读出该微粒的精确分数坐标与均摊归属。
          </div>
        </div>
      </div>

      {/* 晶胞密度 ρ 导出算式 */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col gap-2.5">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <span>📐</span> {calcResult.calculationMode === 'algebraic' ? '高考标准字母代数推导' : '真实实测常数代入计算'}
        </h4>

        {/* 实时 KaTeX 动态算式渲染 (严格杜绝水平滚动条，自动折行居中) */}
        <div className="p-3 bg-white rounded-lg border border-slate-200/80 font-mono text-xs text-slate-800 leading-relaxed overflow-hidden space-y-2.5">
          <div>
            <div className="text-[11px] text-slate-500 font-sans font-semibold mb-1">
              {calcResult.calculationMode === 'algebraic' ? '① 晶胞密度 ρ 纯字母表达式 (踩分点):' : '① 实验常数代入与 10⁻³⁰ 单位换算:'}
            </div>
            <div className="text-blue-700 font-bold max-w-full overflow-hidden flex justify-center py-0.5">
              <KatexFormula formula={calcResult.densityLatex} mode="block" />
            </div>
          </div>

          {calcResult.calculationMode === 'algebraic' ? (
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] text-slate-500 font-sans font-semibold mb-1">
                ② 高考经典变形：阿伏加德罗常数 (N_A) 反推式:
              </div>
              <div className="text-indigo-700 font-bold max-w-full overflow-hidden flex justify-center py-0.5">
                <KatexFormula formula={calcResult.naReverseFormulaLatex} mode="block" />
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-emerald-600 font-bold">
              <span className="font-sans">② 最终晶胞理论密度:</span>
              <span className="font-mono text-base">ρ ≈ {calcResult.densityValue.toFixed(3)} g/cm³</span>
            </div>
          )}
        </div>
      </div>

      {/* 相切几何与空间利用率 */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 shadow-xs flex flex-col gap-2">
        <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
          <span>📏</span> 几何相切关系与配位数
        </h4>
        <div className="text-xs text-amber-800 space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
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
            <strong className="text-rose-950">均摊位置空间几何：</strong>
            立方晶胞顶点占比 1/8；六方平行六面体晶胞底面 60° 顶角由 12 个晶胞共用 (1/12)、120° 顶角由 6 个共用 (1/6)；棱心 1/4、面心 1/2、体心与内部为 1。
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
