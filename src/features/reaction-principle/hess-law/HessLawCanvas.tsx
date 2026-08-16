import React, { useState } from 'react'
import { ThreePanel } from '@/components/Layout'
import { GaokaoToolHeader } from '@/components/UI'
import { getModelQuizData } from '@/data/quiz/index'
import { useHessLawChemistry, HESS_PRESETS } from './hooks/useHessLawChemistry'
import { HessLawLeftPanel } from './components/HessLawLeftPanel'
import { HessLawCenterView } from './components/HessLawCenterView'
import { HessLawRightPanel } from './components/HessLawRightPanel'
import type { HessLawParams } from './types'

export const HessLawCanvas: React.FC = () => {
  const modelId = 'model-hess-law'
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
      {/* 统一 Header */}
      <GaokaoToolHeader modelId={modelId} viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* 三屏主体 Layout */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel
          left={
            <HessLawLeftPanel
              params={params}
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
