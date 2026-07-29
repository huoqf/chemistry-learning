import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { ThreePanel } from '@/components/Layout'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { getModelQuizData } from '@/data/quiz/index'
import { useReactionPrincipleChemistry } from './hooks/useReactionPrincipleChemistry'
import { ReactionPrincipleLeftPanel } from './components/ReactionPrincipleLeftPanel'
import { ReactionPrincipleCenterView } from './components/ReactionPrincipleCenterView'
import { ReactionPrincipleRightPanel } from './components/ReactionPrincipleRightPanel'
import type { NexusParams } from './types'

export const ReactionPrincipleNexusCanvas: React.FC = () => {
  const navigate = useNavigate()
  const modelId = 'model-reaction-principle-nexus'
  const model = getGaokaoModel(modelId)
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
    setParams((prev) => ({ ...prev, ...updated }))
  }

  const handleReset = () => {
    setParams({
      chartTab: 'energy-profile',
      reactionId: 'no2-n2o4',
      catalyst: 'none',
      temperature: 298,
      pressure: 1.0,
      addedReactant: 0,
      inertGasMode: 'none',
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
              <span className="font-bold text-sm text-white">
                {model?.title || '母题四：勒夏特列移动与活化能图谱工具'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                {model?.badgeText || '原理大题'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {model?.subtitle || '反应原理大题图表分析'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            全屏 ThreePanel 架构 · 平级三视角
          </span>
        </div>
      </div>

      {/* 三屏主体 Layout */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel
          left={
            <ReactionPrincipleLeftPanel
              params={params}
              viewMode={viewMode}
              setViewMode={setViewMode}
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
