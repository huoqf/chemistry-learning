/**
 * src/features/industrial-flow/IndustrialFlowCanvas.tsx
 * 母题七：无机工艺流程与沉淀调 pH 工具 - 组装入口
 */

import { useState, useCallback } from 'react'
import { ThreePanel } from '@/components/Layout'
import { GaokaoToolHeader } from '@/components/UI'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { getModelQuizData } from '@/data/quiz'
import type { IndustrialFlowParams } from './types'
import { useIndustrialFlowChemistry } from './hooks/useIndustrialFlowChemistry'
import { IndustrialFlowLeftPanel } from './components/IndustrialFlowLeftPanel'
import { IndustrialFlowCenterView } from './components/IndustrialFlowCenterView'
import { IndustrialFlowRightPanel } from './components/IndustrialFlowRightPanel'

export function IndustrialFlowCanvas() {

  const [params, setParams] = useState<IndustrialFlowParams>({
    viewMode: 0,
    systemId: 'fe-al-mn',
    activeStep: 3, // 默认聚焦核心工序 3 (调 pH 沉淀槽)
    pH: 5.2, // 默认处于安全区间 [4.7, 8.4]
    leachTemp: 60,
    crushSize: 'fine',
    oxidantAmount: 'sufficient',
    reagent: 'MnO',
    crystallizeMethod: 'cooling',
    washSolvent: 'ethanol',
  })

  const updateParam = useCallback((key: keyof IndustrialFlowParams, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleReset = useCallback(() => {
    setParams({
      viewMode: 0,
      systemId: 'fe-al-mn',
      activeStep: 3,
      pH: 5.2,
      leachTemp: 60,
      crushSize: 'fine',
      oxidantAmount: 'sufficient',
      reagent: 'MnO',
      crystallizeMethod: 'cooling',
      washSolvent: 'ethanol',
    })
  }, [])

  const chemistry = useIndustrialFlowChemistry(params)
  const model = getGaokaoModel('model-industrial-flow')
  const quizData = getModelQuizData('model-industrial-flow')

  const leftContent = (
    <IndustrialFlowLeftPanel
      params={params}
      chemistry={chemistry}
      updateParam={updateParam}
      onReset={handleReset}
    />
  )

  const centerContent = (
    <IndustrialFlowCenterView
      params={params}
      chemistry={chemistry}
      quizData={quizData}
      updateParam={updateParam}
    />
  )

  const rightContent = (
    <IndustrialFlowRightPanel
      chemistry={chemistry}
      params={params}
      model={model}
    />
  )

  return (
    <div className="w-full h-screen flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden">
      {/* 统一 Header */}
      <GaokaoToolHeader
        modelId="model-industrial-flow"
        viewMode={params.viewMode}
        onViewModeChange={(m) => updateParam('viewMode', m)}
      />

      {/* 主体 ThreePanel 三栏区域 */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel left={leftContent} center={centerContent} right={rightContent} />
      </div>
    </div>
  )
}
