import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { ThreePanel } from '@/components/Layout'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { getModelQuizData } from '@/data/quiz/index'
import { useHessLawChemistry, HESS_PRESETS } from './hooks/useHessLawChemistry'
import { HessLawLeftPanel } from './components/HessLawLeftPanel'
import { HessLawCenterView } from './components/HessLawCenterView'
import { HessLawRightPanel } from './components/HessLawRightPanel'
import type { HessLawParams } from './types'

export const HessLawCanvas: React.FC = () => {
  const navigate = useNavigate()
  const modelId = 'model-hess-law'
  const model = getGaokaoModel(modelId)
  const quizData = getModelQuizData(modelId)

  // 视角 0: 图谱探究 | 视角 1: 规范踩分 | 视角 2: 真题研析
  const [viewMode, setViewMode] = useState<number>(0)

  // 参数状态
  const [params, setParams] = useState<HessLawParams>({
    mode: 'hess-overlay',
    hessGroupIndex: 0,
    k1: HESS_PRESETS[0].equations[0]?.defaultK ?? 1,
    k2: HESS_PRESETS[0].equations[1]?.defaultK ?? -0.5,
    bondMoleculeIndex: 0,
    hasCatalyst: 0,
    temperature: 298,
  })

  // 纯化学计算
  const chemistry = useHessLawChemistry(params)

  const handleUpdateParams = (updated: Partial<HessLawParams>) => {
    setParams((prev) => ({ ...prev, ...updated }))
  }

  const handleReset = () => {
    setParams({
      mode: 'hess-overlay',
      hessGroupIndex: 0,
      k1: HESS_PRESETS[0].equations[0]?.defaultK ?? 1,
      k2: HESS_PRESETS[0].equations[1]?.defaultK ?? -0.5,
      bondMoleculeIndex: 0,
      hasCatalyst: 0,
      temperature: 298,
    })
  }

  return (
    <div className="w-full h-screen flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
      {/* 顶级 Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            返回高考母题索引
          </button>
          <div className="h-4 w-px bg-slate-700 mx-1" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white flex items-center gap-1">
                {model?.title || '母题九：盖斯定律与热化学键能计算工具'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-indigo-100 text-indigo-800 flex items-center border border-indigo-200">
                {model?.badgeText || '盖斯定律'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {model?.subtitle || '反应热 ΔH 叠加与键能推导'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            全屏 ThreePanel 架构 · 高考解题母题
          </span>
        </div>
      </div>

      {/* 三屏主体 Layout */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel
          left={
            <HessLawLeftPanel
              params={params}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onUpdateParams={handleUpdateParams}
              onReset={handleReset}
            />
          }
          center={
            <HessLawCenterView
              params={params}
              chemistry={chemistry}
              quizData={quizData}
              viewMode={viewMode}
            />
          }
          right={
            <HessLawRightPanel
              params={params}
              chemistry={chemistry}
            />
          }
        />
      </div>
    </div>
  )
}

export default HessLawCanvas
