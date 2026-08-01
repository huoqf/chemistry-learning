import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { ThreePanel } from '@/components/Layout'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { getModelQuizData } from '@/data/quiz/index'
import { useAvogadroChemistry } from './hooks/useAvogadroChemistry'
import { AvogadroLeftPanel } from './components/AvogadroLeftPanel'
import { AvogadroCenterView } from './components/AvogadroCenterView'
import { AvogadroRightPanel } from './components/AvogadroRightPanel'
import type { AvogadroParams } from './types'

export function renderNaText(text: string): React.ReactNode {
  if (!text) return text
  const parts = text.split(/(\(N_A\)|N_A|\$N_A\$|\$N_\{A\}\$|\$N_{\\text\{A\}}\$)/g)
  if (parts.length === 1) return text

  return parts.map((part, index) => {
    if (part === '(N_A)') {
      return (
        <span key={index} className="inline-flex items-baseline">
          (<i>N</i><sub className="font-normal text-[0.85em]">A</sub>)
        </span>
      )
    }
    if (
      part === 'N_A' ||
      part === '$N_A$' ||
      part === '$N_{A}$' ||
      part === '$N_{\\text{A}}$'
    ) {
      return (
        <span key={index} className="inline-flex items-baseline ml-0.5">
          <i>N</i><sub className="font-normal text-[0.85em]">A</sub>
        </span>
      )
    }
    return part
  })
}

export const AvogadroConstantCanvas: React.FC = () => {
  const navigate = useNavigate()
  const modelId = 'model-avogadro-constant'
  const model = getGaokaoModel(modelId)
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
                {model?.title ? (
                  renderNaText(model.title)
                ) : (
                  <>
                    母题十一：阿伏加德罗常数 (<i>N</i><sub className="font-normal">A</sub>) 陷阱与粒子统计工具
                  </>
                )}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 flex items-center">
                {model?.badgeText ? renderNaText(model.badgeText) : <><i>N</i><sub className="font-normal">A</sub> 陷阱</>}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {model?.subtitle || '选择题高频必考拆解'}
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
