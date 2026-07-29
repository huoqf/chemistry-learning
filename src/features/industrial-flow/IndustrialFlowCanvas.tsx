/**
 * src/features/industrial-flow/IndustrialFlowCanvas.tsx
 * 母题七：无机工艺流程与沉淀调 pH 工具 - 组装入口
 */

import { useState, useCallback } from 'react'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ThreePanel } from '@/components/Layout'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { getModelQuizData } from '@/data/quiz'
import type { IndustrialFlowParams } from './types'
import { useIndustrialFlowChemistry } from './hooks/useIndustrialFlowChemistry'
import { IndustrialFlowLeftPanel } from './components/IndustrialFlowLeftPanel'
import { IndustrialFlowCenterView } from './components/IndustrialFlowCenterView'
import { IndustrialFlowRightPanel } from './components/IndustrialFlowRightPanel'

export function IndustrialFlowCanvas() {
  const navigate = useNavigate()

  const [params, setParams] = useState<IndustrialFlowParams>({
    viewMode: 0,
    systemId: 'fe-al-mn',
    pH: 5.2, // 默认处于安全区间 [4.7, 8.4]
    leachTemp: 60,
    crushSize: 'fine',
    oxidantAmount: 'sufficient',
    reagent: 'MnO',
  })

  const updateParam = useCallback((key: keyof IndustrialFlowParams, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleReset = useCallback(() => {
    setParams({
      viewMode: 0,
      systemId: 'fe-al-mn',
      pH: 5.2,
      leachTemp: 60,
      crushSize: 'fine',
      oxidantAmount: 'sufficient',
      reagent: 'MnO',
    })
  }, [])

  const chemistry = useIndustrialFlowChemistry(params)
  const model = getGaokaoModel('model-industrial-flow')
  const quizData = getModelQuizData('model-industrial-flow')

  const leftContent = (
    <IndustrialFlowLeftPanel
      params={params}
      updateParam={updateParam}
      onReset={handleReset}
      isPhInSafeRange={chemistry.isPhInSafeRange}
      safePhRange={chemistry.safePhRange}
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
      {/* 顶部 Navigation */}
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
              <span className="font-bold text-sm text-white">{model?.title}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${model?.badgeColor || 'bg-teal-100 text-teal-800'}`}>
                {model?.badgeText || '工艺流程'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">{model?.subtitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            无机工业流程与沉淀调 pH · 高考母题七
          </span>
        </div>
      </div>

      {/* 主体 ThreePanel 三栏区域 */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel left={leftContent} center={centerContent} right={rightContent} />
      </div>
    </div>
  )
}
