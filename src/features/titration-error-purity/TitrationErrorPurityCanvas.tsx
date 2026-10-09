import React, { useState } from 'react'
import { ThreePanel } from '@/components/Layout'
import { GaokaoToolHeader } from '@/components/UI'
import { getModelQuizData } from '@/data/quiz'
import { useTitrationErrorChemistry } from './hooks/useTitrationErrorChemistry'
import { TitrationErrorLeftPanel } from './components/TitrationErrorLeftPanel'
import { TitrationErrorCenterView } from './components/TitrationErrorCenterView'
import { TitrationErrorRightPanel } from './components/TitrationErrorRightPanel'
import { DEFAULT_TITRATION_ERROR_PARAMS } from './constants'
import type { ViewMode, TitrationErrorParams } from './types'

export const TitrationErrorPurityCanvas: React.FC = () => {
  const modelId = 'model-titration-error-purity'
  const quizData = getModelQuizData(modelId) ?? null

  // 'explore' | 'scoring' | 'quiz'
  const [viewMode, setViewMode] = useState<ViewMode>('explore')

  // 控制台参数状态（出厂默认值集中在 ./constants，避免与 handleReset 两处漂移）
  const [params, setParams] = useState(() => ({ ...DEFAULT_TITRATION_ERROR_PARAMS }))

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
    setParams({ ...DEFAULT_TITRATION_ERROR_PARAMS })
  }

  return (
    <div className="w-full h-full flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
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

