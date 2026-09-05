import React, { useState } from 'react'
import { ThreePanel } from '@/components/Layout'
import { GaokaoToolHeader } from '@/components/UI'
import { getModelQuizData } from '@/data/quiz/index'
import { REACTION_SYSTEMS, useReactionPrincipleChemistry } from './hooks/useReactionPrincipleChemistry'
import { ReactionPrincipleLeftPanel } from './components/ReactionPrincipleLeftPanel'
import { ReactionPrincipleCenterView } from './components/ReactionPrincipleCenterView'
import { ReactionPrincipleRightPanel } from './components/ReactionPrincipleRightPanel'
import type { NexusParams } from './types'

export const ReactionPrincipleNexusCanvas: React.FC = () => {
  const modelId = 'model-reaction-principle-nexus'
  const quizData = getModelQuizData(modelId)

  // 视角 0: 图谱探究 | 视角 1: 规范踩分 | 视角 2: 真题研析
  const [viewMode, setViewMode] = useState<number>(0)

  // 控制台参数状态
  const [params, setParams] = useState<NexusParams>({
    chartTab: 'energy-profile',
    reactionId: 'no2-n2o4',
    catalyst: 'none',
    temperature: 298,
    pressure: 1.0,
    addedReactant: 0,
    inertGasMode: 'none',
  })

  // 化学热力学/动力学计算 Hook
  const chemistry = useReactionPrincipleChemistry(params)

  const handleUpdateParams = (updated: Partial<NexusParams>) => {
    if (updated.reactionId && updated.reactionId !== params.reactionId) {
      const nextSys = REACTION_SYSTEMS[updated.reactionId] || REACTION_SYSTEMS['no2-n2o4']
      setParams((prev) => ({
        ...prev,
        ...updated,
        temperature: nextSys.defaultTemp,
        pressure: nextSys.defaultPressure,
        addedReactant: 0,
      }))
      return
    }
    setParams((prev) => ({ ...prev, ...updated }))
  }

  const handleReset = () => {
    setParams({
      chartTab: params.chartTab,
      reactionId: params.reactionId,
      catalyst: 'none',
      temperature: chemistry.system.defaultTemp,
      pressure: chemistry.system.defaultPressure,
      addedReactant: 0,
      inertGasMode: 'none',
    })
  }

  return (
    <div className="w-full h-full flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
      {/* 统一 Header */}
      <GaokaoToolHeader modelId={modelId} viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* 三屏主体 Layout */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel
          left={
            <ReactionPrincipleLeftPanel
              params={params}
              onUpdateParams={handleUpdateParams}
              onReset={handleReset}
            />
          }
          center={
            <ReactionPrincipleCenterView
              viewMode={viewMode}
              params={params}
              chemistry={chemistry}
              quizData={quizData}
            />
          }
          right={
            <ReactionPrincipleRightPanel
              params={params}
              chemistry={chemistry}
            />
          }
        />
      </div>
    </div>
  )
}
