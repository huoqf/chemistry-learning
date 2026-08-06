import React, { useState } from 'react'
import { ThreePanel } from '@/components/Layout'
import { GaokaoToolHeader } from '@/components/UI'
import { getModelQuizData } from '@/data/quiz/index'
import { useElementPeriodicChemistry } from './hooks/useElementPeriodicChemistry'
import { ElementPeriodicLeftPanel } from './components/ElementPeriodicLeftPanel'
import { ElementPeriodicCenterView } from './components/ElementPeriodicCenterView'
import { ElementPeriodicRightPanel } from './components/ElementPeriodicRightPanel'
import type { ElementPeriodicParams } from './types'

export const ElementPeriodicPropertyCanvas: React.FC = () => {
  const modelId = 'model-element-periodic-property'
  const quizData = getModelQuizData(modelId) || null

  // 平级三视角 (0: 交互图谱 | 1: 规范踩分 | 2: 真题研析)
  const [viewMode, setViewMode] = useState<number>(0)

  // 控制台参数
  const [params, setParams] = useState<ElementPeriodicParams>({
    exploreMode: 'orbital-config',
    selectedAtomicNumber: 6, // 6号碳元素默认
    stateType: 'ground',
    periodFilter: 2,
    isoGroupFilter: '10e',
    inferenceId: 'case-2024-shandong',
  })

  // 纯化学计算 Hook
  const chemistry = useElementPeriodicChemistry(params)

  const handleUpdateParams = (updated: Partial<ElementPeriodicParams>) => {
    setParams((prev) => ({ ...prev, ...updated }))
  }

  const handleReset = () => {
    setParams({
      exploreMode: 'orbital-config',
      selectedAtomicNumber: 6,
      stateType: 'ground',
      periodFilter: 2,
      isoGroupFilter: '10e',
      inferenceId: 'case-2024-shandong',
    })
  }

  return (
    <div className="w-full h-screen flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
      {/* 统一 Header */}
      <GaokaoToolHeader modelId={modelId} viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* 主体 ThreePanel 架构 */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel
          left={
            <ElementPeriodicLeftPanel
              params={params}
              onUpdateParams={handleUpdateParams}
              onReset={handleReset}
            />
          }
          center={
            <ElementPeriodicCenterView
              viewMode={viewMode}
              params={params}
              chemistry={chemistry}
              quizData={quizData}
            />
          }
          right={
            <ElementPeriodicRightPanel params={params} chemistry={chemistry} />
          }
        />
      </div>
    </div>
  )
}
