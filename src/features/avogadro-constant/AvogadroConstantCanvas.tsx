import React, { useState } from 'react'
import { ThreePanel } from '@/components/Layout'
import { GaokaoToolHeader } from '@/components/UI'
import { getModelQuizData } from '@/data/quiz/index'
import { useAvogadroChemistry } from './hooks/useAvogadroChemistry'
import { AvogadroLeftPanel } from './components/AvogadroLeftPanel'
import { AvogadroCenterView } from './components/AvogadroCenterView'
import { AvogadroRightPanel } from './components/AvogadroRightPanel'
import type { AvogadroParams } from './types'

export const AvogadroConstantCanvas: React.FC = () => {
  const modelId = 'model-avogadro-constant'
  const quizData = getModelQuizData(modelId)

  // 视角 0: 图谱探究 | 视角 1: 规范踩分 | 视角 2: 真题研析
  const [viewMode, setViewMode] = useState<number>(0)

  // 控制台参数状态
  const [params, setParams] = useState<AvogadroParams>({
    trapCategory: 'state-volume',
    stateItem: 'SO3',
    structureItem: 'P4',
    electrolyteItem: 'CH3COOH',
    redoxItem: 'Cl2-NaOH',
    amountValue: 22.4,
    amountUnit: 'L',
    temperatureCondition: 'standard',
    solutionVolume: 1.0,
    solutionConcentration: 0.1,
    matrixStepIndex: 0,
  })

  // 纯化学计算 Hook
  const chemistry = useAvogadroChemistry(params)

  const handleUpdateParams = (updated: Partial<AvogadroParams>) => {
    setParams((prev) => ({ ...prev, ...updated }))
  }

  const handleReset = () => {
    setParams({
      trapCategory: 'state-volume',
      stateItem: 'SO3',
      structureItem: 'P4',
      electrolyteItem: 'CH3COOH',
      redoxItem: 'Cl2-NaOH',
      amountValue: 22.4,
      amountUnit: 'L',
      temperatureCondition: 'standard',
      solutionVolume: 1.0,
      solutionConcentration: 0.1,
      matrixStepIndex: 0,
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
            <AvogadroLeftPanel
              params={params}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onUpdateParams={handleUpdateParams}
              onReset={handleReset}
            />
          }
          center={
            <AvogadroCenterView
              params={params}
              chemistry={chemistry}
              quizData={quizData}
              viewMode={viewMode}
            />
          }
          right={
            <AvogadroRightPanel
              params={params}
              chemistry={chemistry}
            />
          }
        />
      </div>
    </div>
  )
}
