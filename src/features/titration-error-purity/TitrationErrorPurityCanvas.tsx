import React, { useState } from 'react'
import { ThreePanel } from '@/components/Layout'
import { GaokaoToolHeader } from '@/components/UI'
import { getModelQuizData } from '@/data/quiz'
import { useTitrationErrorChemistry } from './hooks/useTitrationErrorChemistry'
import { TitrationErrorLeftPanel } from './components/TitrationErrorLeftPanel'
import { TitrationErrorCenterView } from './components/TitrationErrorCenterView'
import { TitrationErrorRightPanel } from './components/TitrationErrorRightPanel'
import type { ViewMode, TitrationErrorParams } from './types'

export const TitrationErrorPurityCanvas: React.FC = () => {
  const modelId = 'model-titration-error-purity'
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
    rawMaterialMolarMass: 55.85, // Fe 铁粉
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
      rawMaterialMolarMass: 55.85, // Fe 铁粉
      molarMassProduct: 392.14,
      actualProductMass: 19.6,
    })
  }

  return (
    <div className="w-full h-screen flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
      {/* 统一 Header */}
      <GaokaoToolHeader
        modelId={modelId}
        viewMode={viewMode === 'explore' ? 0 : viewMode === 'scoring' ? 1 : 2}
        onViewModeChange={(m) => {
          setViewMode(m === 0 ? 'explore' : m === 1 ? 'scoring' : 'quiz')
        }}
      />

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

