import { useState, useEffect } from 'react'
import { ThreePanel } from '@/components/Layout'
import { GaokaoToolHeader } from '@/components/UI'
import { getModelQuizData } from '@/data/gaokaoQuizData'
import { useOrganicRetrosynthesisChemistry } from './hooks/useOrganicRetrosynthesisChemistry'
import { OrganicRetrosynthesisLeftPanel } from './components/OrganicRetrosynthesisLeftPanel'
import { OrganicRetrosynthesisCenterView } from './components/OrganicRetrosynthesisCenterView'
import { OrganicRetrosynthesisRightPanel } from './components/OrganicRetrosynthesisRightPanel'

export function OrganicRetrosynthesisCanvas() {
  const {
    modelId,
    selectModel,
    synthesisMode,
    setSynthesisMode,
    currentModel,
    currentStepIndex,
    setCurrentStepIndex,
    currentStep,
    totalSteps,
    isPlaying,
    setIsPlaying,
    showCrashContrast,
    setShowCrashContrast,
    handleNextStep,
    handleResetStep,
  } = useOrganicRetrosynthesisChemistry()

  const [viewMode, setViewMode] = useState<number>(0)

  // 自动播放 Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null
    if (isPlaying) {
      timer = setInterval(() => {
        handleNextStep()
      }, 3000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isPlaying, handleNextStep])

  // 自动停止
  useEffect(() => {
    if (isPlaying && currentStepIndex === totalSteps - 1) {
      setIsPlaying(false)
    }
  }, [currentStepIndex, totalSteps, isPlaying, setIsPlaying])

  const quizData = getModelQuizData('model-organic-retrosynthesis') || null

  const leftContent = (
    <OrganicRetrosynthesisLeftPanel
      modelId={modelId}
      onSelectModel={selectModel}
      synthesisMode={synthesisMode}
      onSetSynthesisMode={setSynthesisMode}
      currentModel={currentModel}
      currentStepIndex={currentStepIndex}
      onStepChange={(s) => setCurrentStepIndex(s)}
      showCrashContrast={showCrashContrast}
      onToggleCrashContrast={() => setShowCrashContrast(!showCrashContrast)}
    />
  )

  const centerContent = (
    <OrganicRetrosynthesisCenterView
      viewMode={viewMode}
      synthesisMode={synthesisMode}
      currentModel={currentModel}
      currentStep={currentStep}
      currentStepIndex={currentStepIndex}
      totalSteps={totalSteps}
      quizData={quizData}
      isPlaying={isPlaying}
      onTogglePlay={() => setIsPlaying(!isPlaying)}
      onResetStep={handleResetStep}
      onStepChange={(s) => setCurrentStepIndex(s)}
      showCrashContrast={showCrashContrast}
      onToggleCrashContrast={() => setShowCrashContrast(!showCrashContrast)}
    />
  )

  const rightContent = (
    <OrganicRetrosynthesisRightPanel
      currentModel={currentModel}
      currentStep={currentStep}
      synthesisMode={synthesisMode}
    />
  )

  return (
    <div className="w-full h-full flex flex-col font-sans text-slate-900 overflow-hidden">
      {/* 统一 Header */}
      <GaokaoToolHeader
        modelId="model-organic-retrosynthesis"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 完整 ThreePanel 三栏区域 */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel left={leftContent} center={centerContent} right={rightContent} />
      </div>
    </div>
  )
}
