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
import type { InquiryMode } from './types'
import { useIonCoexistence } from './hooks/useIonCoexistence'
import { IonLeftPanel } from './components/IonLeftPanel'
import { IonMatrixScene } from './components/IonMatrixScene'
import { IonRightPanel } from './components/IonRightPanel'
import { IonCoexistenceMatrixView } from './components/IonCoexistenceMatrixView'
import { IonMechanismGridView } from './components/IonMechanismGridView'

export const IonMatrixCanvas: React.FC = () => {
  const modelId = 'model-ion-matrix'
  const quizData = getModelQuizData(modelId)

  // 视角模式 (0: 矩阵探究 | 1: 规范踩分 | 2: 真题研析)
  const [viewMode, setViewMode] = useState<number>(0)

  // 探究状态：支持 4 档模式 (single-test | coexistence-check | mechanism-grid | coexistence-matrix)
  const [inquiryMode, setInquiryMode] = useState<InquiryMode>('single-test')
  const [selectedIonId, setSelectedIonId] = useState<string>('Fe3+')
  const [selectedReagentId, setSelectedReagentId] = useState<string>('fe3-kscn')
  const [dropCount, setDropCount] = useState<number>(0) // 0: 初始待测样, 1: 滴加少量, 2: 继续滴加至过量
  const [coexistenceSelectedIons, setCoexistenceSelectedIons] = useState<string[]>([
    'Fe3+',
    'I-',
    'Cl-',
  ])
  const [selectedMatrixPair, setSelectedMatrixPair] = useState<{
    cationId: string
    anionId: string
  }>({
    cationId: 'Al3+',
    anionId: 'HCO3-',
  })

  // 画布自适应
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,
  })

  // 纯计算：共存冲突检测
  const coexistenceResult = useIonCoexistence(coexistenceSelectedIons)
  const selectedIon = ION_DATA.find((i) => i.id === selectedIonId)
  const selectedReagent =
    selectedIon?.reagentOptions.find((r) => r.id === selectedReagentId) ||
    selectedIon?.reagentOptions[0]

  const handleSelectIon = useCallback((id: string) => {
    setSelectedIonId(id)
    setDropCount(0)
    const targetIon = ION_DATA.find((i) => i.id === id)
    if (targetIon && targetIon.reagentOptions.length > 0) {
      setSelectedReagentId(targetIon.reagentOptions[0].id)
    }
  }, [])

  const handleSelectReagent = useCallback((reagentId: string) => {
    setSelectedReagentId(reagentId)
    setDropCount(0)
  }, [])

  const handleToggleCoexistenceIon = useCallback((id: string) => {
    setCoexistenceSelectedIons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }, [])

  const handleResetCoexistence = useCallback(() => {
    setCoexistenceSelectedIons([])
  }, [])

  const handleDropReagent = useCallback(() => {
    setDropCount((prev) => (prev < 2 ? prev + 1 : 2))
  }, [])

  const handleResetReaction = useCallback(() => {
    setDropCount(0)
  }, [])

  const handleSelectMatrixPair = useCallback((cationId: string, anionId: string) => {
    setSelectedMatrixPair({ cationId, anionId })
  }, [])

  const handleNavigateToBeaker = useCallback((cationId: string, anionId: string) => {
    // 映射到离子清单
    setCoexistenceSelectedIons([cationId, anionId])
    setInquiryMode('coexistence-check')
  }, [])

  const handleLoadPresetPair = useCallback((cationId: string, anionId: string) => {
    setSelectedMatrixPair({ cationId, anionId })
  }, [])

  return (
    <div className="w-full h-full flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
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
              selectedReagentId={selectedReagentId}
              coexistenceSelectedIons={coexistenceSelectedIons}
              dropCount={dropCount}
              selectedMatrixPair={selectedMatrixPair}
              onSelectMode={setInquiryMode}
              onSelectIon={handleSelectIon}
              onSelectReagent={handleSelectReagent}
              onToggleCoexistenceIon={handleToggleCoexistenceIon}
              onDropReagent={handleDropReagent}
              onResetReaction={handleResetReaction}
              onResetCoexistence={handleResetCoexistence}
              onLoadPresetPair={handleLoadPresetPair}
            />
          }
          center={
            <div className="w-full h-full flex flex-col overflow-hidden">
              {viewMode === 0 && (
                inquiryMode === 'mechanism-grid' ? (
                  <IonMechanismGridView
                    selectedPair={selectedMatrixPair}
                    onSelectPair={handleSelectMatrixPair}
                    onNavigateToBeaker={handleNavigateToBeaker}
                  />
                ) : inquiryMode === 'coexistence-matrix' ? (
                  <IonCoexistenceMatrixView
                    selectedPair={selectedMatrixPair}
                    onSelectPair={handleSelectMatrixPair}
                    onNavigateToBeaker={handleNavigateToBeaker}
                  />
                ) : (
                  <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
                    <IonMatrixScene
                      mode={inquiryMode}
                      selectedIon={selectedIon}
                      selectedReagent={selectedReagent}
                      dropCount={dropCount}
                      coexistenceIons={coexistenceResult.selectedIonObjects}
                      conflicts={coexistenceResult.conflicts}
                      font={canvasSize.font}
                      onDropReagent={handleDropReagent}
                      onResetReaction={handleResetReaction}
                    />
                  </AnimationSvgCanvas>
                )
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
              selectedReagent={selectedReagent}
              dropCount={dropCount}
              conflicts={coexistenceResult.conflicts}
              coexistenceIons={coexistenceResult.selectedIonObjects}
              selectedPair={selectedMatrixPair}
            />
          }
        />
      </div>
    </div>
  )
}
