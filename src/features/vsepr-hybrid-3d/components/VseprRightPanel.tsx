import React from 'react'
import {
  Card,
  Badge,
  KatexFormula,
  TipCard,
} from '@/components/UI'
import type { VseprChemistryResult, DisplayMode } from '../types'

interface VseprRightPanelProps {
  calcResult: VseprChemistryResult
  displayMode: DisplayMode
}

/**
 * VSEPR 3D 几何工具右屏面板组件
 * 采用 UI 组件库，并与左屏微粒选择 & 4种 3D 观察模式 100% 动态焦点高亮联动
 */
export const VseprRightPanel: React.FC<VseprRightPanelProps> = ({ calcResult, displayMode }) => {
  const { currentMolecule, vseprFormulaText, vseprCalculationSteps, lonePairRepulsionDescription } = calcResult

  return (
    <div className="w-full h-full p-4 bg-white overflow-y-auto font-sans flex flex-col gap-4">
      {/* 1. 顶部当前微粒元数据 Card (受 displayMode === 'hybrid_orbital' 联动高亮) */}
      <Card
        className={`p-3.5 border transition-all duration-300 ${
          displayMode === 'hybrid_orbital'
            ? 'bg-gradient-to-r from-indigo-100 to-blue-100 border-indigo-400 shadow-md ring-2 ring-indigo-300'
            : 'bg-gradient-to-r from-indigo-50/80 to-blue-50/80 border-indigo-100 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-800">
                {currentMolecule.formula}
              </h3>
              <span className="text-xs text-slate-500 font-medium">({currentMolecule.name})</span>
            </div>
            <div className="text-xs text-indigo-600 font-semibold mt-1 flex items-center gap-1.5">
              <span>杂化类型:</span>
              <Badge variant="core" className="font-mono text-xs">
                {currentMolecule.hybridization}
              </Badge>
              {displayMode === 'hybrid_orbital' && (
                <span className="text-[11px] font-bold text-indigo-700">
                  正在观察 {currentMolecule.hybridization} 杂化 Lobes
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <Badge variant="gaokao" className="font-mono text-xs px-2.5 py-1">
              价层对数 = {currentMolecule.vseprPairs}
            </Badge>
          </div>
        </div>
      </Card>

      {/* 2. 关键定量参数 Card 网格 (高中选必2课标: a 中心价电子, x 配位原子数, n 孤对数) */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Card className="p-2.5 bg-slate-50 border-slate-200 flex flex-col">
          <span className="text-slate-500 text-[11px]">中心原子价电子 (a)</span>
          <span className="font-bold text-slate-800 text-sm mt-0.5">
            {currentMolecule.centerAtomSymbol} <span className="text-xs font-normal text-slate-500">({currentMolecule.centerValenceElectrons} e⁻)</span>
          </span>
        </Card>

        <Card className="p-2.5 bg-slate-50 border-slate-200 flex flex-col">
          <span className="text-slate-500 text-[11px]">配位原子数 (x)</span>
          <span className="font-bold text-slate-800 text-sm mt-0.5">
            {currentMolecule.terminalAtomCount} 个
          </span>
        </Card>

        <Card
          className={`p-2.5 flex flex-col transition-all duration-300 ${
            displayMode === 'vsepr_cloud'
              ? 'bg-indigo-100 border-indigo-400 ring-2 ring-indigo-300 shadow-sm'
              : 'bg-indigo-50/60 border-indigo-200'
          }`}
        >
          <span className="text-indigo-600 text-[11px] font-semibold">价层电子对数 (x + n)</span>
          <span className="font-bold text-indigo-900 text-sm mt-0.5">
            {currentMolecule.vseprPairs} 对
          </span>
        </Card>

        <Card
          className={`p-2.5 flex flex-col transition-all duration-300 ${
            displayMode === 'repulsion_demo' || displayMode === 'vsepr_cloud'
              ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300 shadow-sm'
              : 'bg-amber-50/60 border-amber-200'
          }`}
        >
          <span className="text-amber-700 text-[11px] font-semibold">孤电子对数 (n)</span>
          <span className="font-bold text-amber-900 text-sm mt-0.5">
            {currentMolecule.lonePairs} 对
          </span>
        </Card>
      </div>

      {/* 3. 几何构型与实际键角对比 Card (受 displayMode 焦点联动高亮) */}
      <Card className="p-3 bg-slate-50 border-slate-200 space-y-2 text-xs">
        {/* VSEPR 理想模型 - 联动 vsepr_cloud */}
        <div
          className={`flex justify-between items-center p-1.5 rounded transition-all duration-300 ${
            displayMode === 'vsepr_cloud'
              ? 'bg-indigo-100 border border-indigo-300 font-bold'
              : 'border-b border-slate-200'
          }`}
        >
          <span className="text-slate-600 font-semibold">
            VSEPR 理想模型：
          </span>
          <Badge variant="basic" className="font-bold">
            {currentMolecule.vseprGeometryName}
          </Badge>
        </div>

        {/* 分子实际构型 - 联动 ball_stick */}
        <div
          className={`flex justify-between items-center p-1.5 rounded transition-all duration-300 ${
            displayMode === 'ball_stick'
              ? 'bg-blue-100 border border-blue-300 font-bold ring-1 ring-blue-300'
              : 'border-b border-slate-200'
          }`}
        >
          <span className="text-slate-600 font-semibold">
            分子/离子空间构型：
          </span>
          <Badge variant="core" className="font-bold">
            {currentMolecule.molecularGeometryName}
          </Badge>
        </div>

        {/* 实际键角 - 联动 repulsion_demo */}
        <div
          className={`flex justify-between items-center p-1.5 rounded transition-all duration-300 ${
            displayMode === 'repulsion_demo'
              ? 'bg-emerald-100 border border-emerald-300 font-bold'
              : ''
          }`}
        >
          <span className="text-slate-600 font-semibold">
            实际键角：
          </span>
          <span className="font-bold text-emerald-700 font-mono text-xs">
            {currentMolecule.actualAngle}° {currentMolecule.actualAngle !== currentMolecule.theoreticalAngle ? `(理想:${currentMolecule.theoreticalAngle}°)` : '(无孤对挤压)'}
          </span>
        </div>
      </Card>

      {/* 4. VSEPR 推导公式 Section (受 displayMode === 'vsepr_cloud' 焦点联动) */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
          <span>VSEPR 课标推导计算</span>
          {displayMode === 'vsepr_cloud' && (
            <span className="text-[10px] text-indigo-600 font-normal">〔理想模型推导〕</span>
          )}
        </h4>

        <div
          className={`p-3 rounded-xl overflow-x-auto transition-all duration-300 ${
            displayMode === 'vsepr_cloud'
              ? 'bg-indigo-100 border-2 border-indigo-400 shadow-md ring-2 ring-indigo-300'
              : 'bg-indigo-50/70 border border-indigo-200'
          }`}
        >
          <KatexFormula formula={vseprFormulaText} mode="block" />
        </div>

        <Card className="p-3 bg-slate-50 border-slate-200 text-xs space-y-1.5 text-slate-700">
          <div className="font-bold text-slate-800 text-[11px] mb-1">分步踩分推导步骤：</div>
          <pre className="whitespace-pre-wrap font-sans leading-relaxed text-[11px] text-slate-600">
            {vseprCalculationSteps}
          </pre>
        </Card>

        {/* 孤电子对排斥理论 TipCard (受 displayMode === 'repulsion_demo' 焦点高亮) */}
        <div
          className={`transition-all duration-300 ${
            displayMode === 'repulsion_demo'
              ? 'transform scale-[1.02] shadow-md ring-2 ring-amber-400 rounded-lg'
              : ''
          }`}
        >
          <TipCard variant={displayMode === 'repulsion_demo' ? 'warning' : 'primary'}>
            <div className="font-semibold mb-0.5 text-xs text-amber-900 flex items-center gap-1">
              <span>孤电子对静电排斥解析：</span>
              {displayMode === 'repulsion_demo' && (
                <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                  高亮透视中
                </span>
              )}
            </div>
            <div className="text-[11px] leading-relaxed">{lonePairRepulsionDescription}</div>
          </TipCard>
        </div>
      </div>

      {/* 5. 高考核心踩分切口 */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
          <span>高考命题核心踩分点</span>
        </h4>
        <Card className="p-3 bg-amber-50/70 border-amber-200 text-xs space-y-2 text-amber-900">
          <p className="leading-normal font-medium">{currentMolecule.examNotes}</p>
          <div className="pt-2 border-t border-amber-200/60 text-[11px] text-amber-800 space-y-1">
            <p>• <b>键角递减律：</b> 孤电子对排斥力 &gt; 成键电子对排斥力。孤电子对越多，成键电子对被挤压越严重，键角越小。</p>
            <p>• <b>构型区分：</b> VSEPR 模型包含孤电子对顶点；实际分子空间构型仅由原子核位置决定。</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
