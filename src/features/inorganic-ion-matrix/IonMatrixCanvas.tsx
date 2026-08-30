import React, { useState, useCallback } from 'react'
import { ThreePanel, AnimationSvgCanvas } from '@/components/Layout'
import {
  GaokaoToolHeader,
  ScoringCardSection,
  GaokaoVariantQuiz,
} from '@/components/UI'
import { useAnimationViewport } from '@/hooks'
import { CANVAS_PRESETS } from '@/theme'
import { getModelQuizData } from '@/data/quiz'
import { ION_DATA } from './constants'
import { useIonCoexistence } from './hooks/useIonCoexistence'
import { IonLeftPanel } from './components/IonLeftPanel'
import { IonMatrixScene } from './components/IonMatrixScene'
import { IonRightPanel } from './components/IonRightPanel'

export const IonMatrixCanvas: React.FC = () => {
  const modelId = 'model-ion-matrix'
  const quizData = getModelQuizData(modelId)

  // 视角模式 (0: 矩阵探究 | 1: 规范踩分 | 2: 真题研析)
  const [viewMode, setViewMode] = useState<number>(0)

  // 探究状态
  const [inquiryMode, setInquiryMode] = useState<'single-test' | 'coexistence-check'>('single-test')
  const [selectedIonId, setSelectedIonId] = useState<string>('Fe3+')
  const [coexistenceSelectedIons, setCoexistenceSelectedIons] = useState<string[]>([
    'Fe3+',
    'I-',
    'Cl-',
  ])
  const [isReactionActive, setIsReactionActive] = useState<boolean>(false)

  // 画布自适应
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,
  })

  // 纯计算：共存冲突检测
  const coexistenceResult = useIonCoexistence(coexistenceSelectedIons)
  const selectedIon = ION_DATA.find((i) => i.id === selectedIonId)

  const handleSelectIon = useCallback((id: string) => {
    setSelectedIonId(id)
    setIsReactionActive(false)
  }, [])

  const handleToggleCoexistenceIon = useCallback((id: string) => {
    setCoexistenceSelectedIons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }, [])

  const handleResetCoexistence = useCallback(() => {
    setCoexistenceSelectedIons([])
  }, [])

  const handleToggleReaction = useCallback(() => {
    setIsReactionActive((prev) => !prev)
  }, [])

  return (
    <div className="w-full h-screen flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
      {/* 1. 统一顶栏 */}
      <GaokaoToolHeader
        modelId={modelId}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 2. 三栏工作区 */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel
          left={
            <IonLeftPanel
              inquiryMode={inquiryMode}
              selectedIonId={selectedIonId}
              coexistenceSelectedIons={coexistenceSelectedIons}
              isReactionActive={isReactionActive}
              onSelectMode={setInquiryMode}
              onSelectIon={handleSelectIon}
              onToggleCoexistenceIon={handleToggleCoexistenceIon}
              onToggleReaction={handleToggleReaction}
              onResetCoexistence={handleResetCoexistence}
            />
          }
          center={
            <div className="w-full h-full flex flex-col overflow-hidden bg-slate-50">
              {viewMode === 0 && (
                <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
                  <IonMatrixScene
                    mode={inquiryMode}
                    selectedIon={selectedIon}
                    isReactionActive={isReactionActive}
                    coexistenceIons={coexistenceResult.selectedIonObjects}
                    conflicts={coexistenceResult.conflicts}
                    font={canvasSize.font}
                  />
                </AnimationSvgCanvas>
              )}

              {viewMode === 1 && quizData && (
                <div className="w-full max-w-4xl mx-auto py-4 overflow-y-auto">
                  <ScoringCardSection steps={quizData.scoringSteps} />
                </div>
              )}

              {viewMode === 2 && quizData && (
                <div className="w-full max-w-4xl mx-auto py-4 overflow-y-auto">
                  <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
                </div>
              )}
            </div>
          }
          right={
            <IonRightPanel
              inquiryMode={inquiryMode}
              selectedIon={selectedIon}
              conflicts={coexistenceResult.conflicts}
              coexistenceIons={coexistenceResult.selectedIonObjects}
            />
          }
        />
      </div>
    </div>
  )
}
