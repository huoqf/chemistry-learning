import { useState, useCallback, useMemo } from 'react'
import type {
  RetrosynthesisModelId,
  SynthesisMode,
  RetrosynthesisModelData,
  RetrosynthesisStep,
} from '../types'
import {
  RETRO_MODELS_DATA,
  GAOKAO_PROTECTION_CHEAT_SHEET,
} from '../data/retrosynthesisData'

export function useOrganicRetrosynthesisChemistry() {
  const [modelId, setModelId] = useState<RetrosynthesisModelId>('aspirin-benorilate')
  const [synthesisMode, setSynthesisMode] = useState<SynthesisMode>('retrosynthetic')
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [showCrashContrast, setShowCrashContrast] = useState<boolean>(false)

  // 1. 获取当前母题模型数据
  const currentModel: RetrosynthesisModelData = useMemo(() => {
    return RETRO_MODELS_DATA[modelId] || RETRO_MODELS_DATA['aspirin-benorilate']
  }, [modelId])

  // 2. 总步数与当前步数据
  const totalSteps = currentModel.steps.length
  const currentStep: RetrosynthesisStep = useMemo(() => {
    return currentModel.steps[currentStepIndex] || currentModel.steps[0]
  }, [currentModel, currentStepIndex])

  // 3. 模型切换与状态重置
  const selectModel = useCallback((id: RetrosynthesisModelId) => {
    setModelId(id)
    setCurrentStepIndex(0)
    setIsPlaying(false)
    setShowCrashContrast(false)
  }, [])

  // 4. 步骤控制
  const handleNextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < totalSteps - 1) {
        return prev + 1
      }
      return 0
    })
  }, [totalSteps])

  const handlePrevStep = useCallback(() => {
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : 0))
  }, [])

  const handleResetStep = useCallback(() => {
    setCurrentStepIndex(0)
    setIsPlaying(false)
    setShowCrashContrast(false)
  }, [])

  return {
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
    playbackSpeed,
    setPlaybackSpeed,
    showCrashContrast,
    setShowCrashContrast,
    handleNextStep,
    handlePrevStep,
    handleResetStep,
    cheatSheet: GAOKAO_PROTECTION_CHEAT_SHEET,
  }
}
