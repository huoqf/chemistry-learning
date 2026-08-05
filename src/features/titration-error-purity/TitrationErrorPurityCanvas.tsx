import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { ThreePanel } from '@/components/Layout'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { getModelQuizData } from '@/data/quiz'
import { useTitrationErrorChemistry } from './hooks/useTitrationErrorChemistry'
import { TitrationErrorLeftPanel } from './components/TitrationErrorLeftPanel'
import { TitrationErrorCenterView } from './components/TitrationErrorCenterView'
import { TitrationErrorRightPanel } from './components/TitrationErrorRightPanel'
import type { ViewMode, TitrationErrorParams } from './types'

export const TitrationErrorPurityCanvas: React.FC = () => {
  const navigate = useNavigate()
  const modelId = 'model-titration-error-purity'
  const model = getGaokaoModel(modelId)
  const quizData = getModelQuizData(modelId) ?? null

  // 'explore' | 'scoring' | 'quiz'
  const [viewMode, setViewMode] = useState<ViewMode>('explore')

  // 控制台参数状态
  const [params, setParams] = useState<TitrationErrorParams>({
    mode: 'error-analysis',
    titrationType: 'acid-base',
    errorOp: 'none',
    viewAngle: 0,
    cStandardTrue: 0.1,
    vSampleTrue: 20.0,
    cSampleTrue: 0.1,

    purityMethod: 'direct',
    sampleMass: 2.0,
    solutionTotalVol: 250,
    pipetteVol: 25,

    reagent1Conc: 1.0,
    reagent1Vol: 50.0,
    reagent2Conc: 0.1,
    reagent2Vol: 20.0,

    rawMaterialMass: 2.8,
    molarMassProduct: 392.14,
    actualProductMass: 19.6,
  })

  // 滴定播放与体积状态
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false)
  const [currentVolume, setCurrentVolume] = useState<number>(20.0)

  // 纯化学与代数 Hook
  const chemistry = useTitrationErrorChemistry(params)

  // 自动滴定计时器
  React.useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setCurrentVolume((prev) => {
        if (prev >= 40.0) {
          setIsAutoPlaying(false)
          return 40.0
        }
        return Number((prev + 0.2).toFixed(2))
      })
    }, 100)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const handleUpdateParams = (updated: Partial<TitrationErrorParams>) => {
    setParams((prev) => ({ ...prev, ...updated }))
  }

  const handleSingleDrop = () => {
    setIsAutoPlaying(false)
    setCurrentVolume((prev) => Math.min(40.0, Number((prev + 0.05).toFixed(2))))
  }

  const handleBulkAdd = () => {
    setIsAutoPlaying(false)
    setCurrentVolume((prev) => Math.min(40.0, Number((prev + 1.0).toFixed(2))))
  }

  const handleReset = () => {
    setIsAutoPlaying(false)
    setCurrentVolume(20.0)
    setParams({
      mode: 'error-analysis',
      titrationType: 'acid-base',
      errorOp: 'none',
      viewAngle: 0,
      cStandardTrue: 0.1,
      vSampleTrue: 20.0,
      cSampleTrue: 0.1,

      purityMethod: 'direct',
      sampleMass: 2.0,
      solutionTotalVol: 250,
      pipetteVol: 25,

      reagent1Conc: 1.0,
      reagent1Vol: 50.0,
      reagent2Conc: 0.1,
      reagent2Vol: 20.0,

      rawMaterialMass: 2.8,
      molarMassProduct: 392.14,
      actualProductMass: 19.6,
    })
  }

  return (
    <div className="w-full h-screen flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
      {/* 顶级 Navigation Bar (浅色 Light Theme 统一样式) */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            返回母题索引
          </button>
          <div className="h-4 w-px bg-slate-300 mx-1" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800">
                {model?.title || '母题十二：定量滴定误差与纯度产率计算工具'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800">
                {model?.badgeText || '定量误差'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {model?.subtitle || '高考定量实验大题突破'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            全屏 ThreePanel 架构
          </span>
        </div>
      </div>

      {/* 下方 ThreePanel 容器 */}
      <div className="flex-1 min-h-0 relative">
        <ThreePanel
          left={
            <TitrationErrorLeftPanel
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              params={params}
              onUpdateParams={handleUpdateParams}
              onReset={handleReset}
            />
          }
          center={
            <TitrationErrorCenterView
              viewMode={viewMode}
              params={params}
              chemistry={chemistry}
              quizData={quizData}
              currentVolume={currentVolume}
              isAutoPlaying={isAutoPlaying}
              onPlayPause={() => setIsAutoPlaying((prev) => !prev)}
              onSingleDrop={handleSingleDrop}
              onBulkAdd={handleBulkAdd}
              onReset={handleReset}
              onVolumeChange={(v) => {
                setIsAutoPlaying(false)
                setCurrentVolume(v)
              }}
              onUpdateParams={handleUpdateParams}
            />
          }
          right={
            <TitrationErrorRightPanel params={params} chemistry={chemistry} />
          }
        />
      </div>
    </div>
  )
}

