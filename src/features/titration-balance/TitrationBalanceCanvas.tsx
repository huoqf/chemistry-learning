/**
 * src/features/titration-balance/TitrationBalanceCanvas.tsx
 * 母题一：滴定突跃与离子浓度排序解题工具 - 组装入口
 */

import { useState, useCallback, useEffect } from 'react'
import { ThreePanel } from '@/components/Layout'
import { GaokaoToolHeader } from '@/components/UI'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { getModelQuizData } from '@/data/quiz'
import type { TitrationParams } from './types'
import { useTitrationChemistry } from './hooks/useTitrationChemistry'
import { TitrationLeftPanel } from './components/TitrationLeftPanel'
import { TitrationCenterView } from './components/TitrationCenterView'
import { TitrationRightPanel } from './components/TitrationRightPanel'

export function TitrationBalanceCanvas() {

  const [params, setParams] = useState<TitrationParams>({
    viewMode: 0,
    systemType: 'strongBaseWeakAcid',
    vRatio: 0.5, // 默认半中和点
    pKa: 4.75, // 醋酸默认 pKa
    c0: 0.1,
    indicator: 'phenolphthalein',
  })

  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  const updateParam = useCallback((key: keyof TitrationParams, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleReset = useCallback(() => {
    setIsAutoPlaying(false)
    setParams({
      viewMode: 0,
      systemType: 'strongBaseWeakAcid',
      vRatio: 0,
      pKa: 4.75,
      c0: 0.1,
      indicator: 'phenolphthalein',
    })
  }, [])

  const handleSingleDrop = useCallback(() => {
    setIsAutoPlaying(false)
    setParams((prev) => ({
      ...prev,
      vRatio: Math.min(2.0, prev.vRatio + 0.025), // 单滴约 0.5 mL (0.025 Veq)
    }))
  }, [])

  const handleBulkAdd = useCallback(() => {
    setIsAutoPlaying(false)
    setParams((prev) => ({
      ...prev,
      vRatio: Math.min(2.0, prev.vRatio + 0.1), // 批量滴加约 2.0 mL (0.1 Veq)
    }))
  }, [])

  // 自动滴定播放定时器
  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setParams((prev) => {
        if (prev.vRatio >= 2.0) {
          setIsAutoPlaying(false)
          return prev
        }
        return {
          ...prev,
          vRatio: Math.min(2.0, prev.vRatio + 0.01),
        }
      })
    }, 100)

    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const chemistry = useTitrationChemistry(params)
  const model = getGaokaoModel('model-titration-balance')
  const quizData = getModelQuizData('model-titration-balance')

  const leftContent = (
    <TitrationLeftPanel
      params={params}
      updateParam={updateParam}
      onReset={handleReset}
    />
  )

  const centerContent = (
    <TitrationCenterView
      params={params}
      chemistry={chemistry}
      quizData={quizData}
      updateParam={updateParam}
      isAutoPlaying={isAutoPlaying}
      setIsAutoPlaying={setIsAutoPlaying}
      onSingleDrop={handleSingleDrop}
      onBulkAdd={handleBulkAdd}
      onReset={handleReset}
    />
  )

  const rightContent = (
    <TitrationRightPanel
      chemistry={chemistry}
      model={model}
    />
  )

  return (
    <div className="w-full h-full flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden">
      {/* 统一 Header */}
      <GaokaoToolHeader
        modelId="model-titration-balance"
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
