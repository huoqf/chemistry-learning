/**
 * src/features/electrochemical-twin/ElectrochemicalTwinCanvas.tsx
 * 母题二：原电池 vs 电解池双对比解题工具 - 统一入口容器
 */

import { useState } from 'react'
import { ThreePanel } from '@/components/Layout'
import { GaokaoToolHeader } from '@/components/UI'
import { getModelQuizData } from '@/data/quiz'
import { ElectrochemicalTwinLeftPanel } from './components/ElectrochemicalTwinLeftPanel'
import { ElectrochemicalTwinCenterView } from './components/ElectrochemicalTwinCenterView'
import { ElectrochemicalTwinRightPanel } from './components/ElectrochemicalTwinRightPanel'
import { useElectrochemicalTwin } from './hooks/useElectrochemicalTwin'
import type { ElectrochemicalParams } from './types'

export function ElectrochemicalTwinCanvas() {
  const modelId = 'model-electrochemical-twin'
  const quizData = getModelQuizData(modelId)

  // 三视角 (0: 图谱探究 | 1: 规范踩分 | 2: 真题研析)
  const [viewMode, setViewMode] = useState<number>(0)

  // 状态调控参数
  const [params, setParams] = useState<ElectrochemicalParams>({
    mode: 0,
    batteryState: 0,
    membraneType: 1,
    currentAmp: 1.0,
    timeSec: 30,
    electrolyteConc: 1.0,
    showElectrons: 1,
    showIons: 1,
    showMembraneFlow: 1,
  })

  // 纯化学计算
  const { cellDetails, quantResult } = useElectrochemicalTwin(params)

  const handleParamChange = <K extends keyof ElectrochemicalParams>(
    key: K,
    value: ElectrochemicalParams[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="w-full h-screen flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
      {/* 统一 Header 与视角 Tabs */}
      <GaokaoToolHeader
        modelId={modelId}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 响应式三栏 */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel
          left={
            <ElectrochemicalTwinLeftPanel
              params={params}
              onChange={handleParamChange}
            />
          }
          center={
            <ElectrochemicalTwinCenterView
              viewMode={viewMode}
              params={params}
              cellDetails={cellDetails}
              quantResult={quantResult}
              quizData={quizData}
            />
          }
          right={
            <ElectrochemicalTwinRightPanel
              params={params}
              cellDetails={cellDetails}
              quantResult={quantResult}
            />
          }
        />
      </div>
    </div>
  )
}
