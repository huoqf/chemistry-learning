import React, { useState, useCallback, useMemo } from 'react'
import { ThreePanel, AnimationSvgCanvas } from '@/components/Layout'
import {
  GaokaoToolHeader,
  ScoringCardSection,
  GaokaoVariantQuiz,
} from '@/components/UI'
import { useAnimationViewport } from '@/hooks'
import { CANVAS_PRESETS } from '@/theme'
import { getModelQuizData } from '@/data/quiz'
import { FUNCTIONAL_GROUPS, PRESET_MOLECULES } from './constants'
import { useOrganicQuantitative } from './hooks/useOrganicQuantitative'
import { OrganicLeftPanel } from './components/OrganicLeftPanel'
import { OrganicMatrixScene } from './components/OrganicMatrixScene'
import { OrganicFullMatrixView } from './components/OrganicFullMatrixView'
import { OrganicRightPanel } from './components/OrganicRightPanel'

export const OrganicFunctionalMatrixCanvas: React.FC = () => {
  const modelId = 'model-organic-matrix'
  const quizData = getModelQuizData(modelId)

  // 视角模式 (0: 矩阵探究 | 1: 规范踩分 | 2: 真题研析)
  const [viewMode, setViewMode] = useState<number>(0)

  // 左屏模式 ('preset': 经典母题 | 'custom': 自由组装 | 'matrix': 全景大表)
  const [panelMode, setPanelMode] = useState<'preset' | 'custom' | 'matrix'>('preset')

  // 状态：选中的官能团与各官能团数量
  const [selectedGroupId, setSelectedGroupId] = useState<string>('carboxyl-cooh')
  const [groupCounts, setGroupCounts] = useState<Record<string, number>>({
    'phenol-ester': 1,
    'carboxyl-cooh': 1,
  })

  // 画布自适应
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,
  })

  // 识别当前匹配的母题预设
  const activePresetId = useMemo(() => {
    if (panelMode !== 'preset') return undefined
    for (const preset of PRESET_MOLECULES) {
      const presetEntries = Object.entries(preset.counts)
      const currentNonZero = Object.entries(groupCounts).filter(([, count]) => count > 0)
      if (presetEntries.length !== currentNonZero.length) continue

      const isMatch = presetEntries.every(
        ([id, count]) => (groupCounts[id] || 0) === count
      )
      if (isMatch) return preset.id
    }
    return undefined
  }, [groupCounts, panelMode])

  // 纯计算：定量消耗（母题模式下结合母题特异性）
  const consumption = useOrganicQuantitative(groupCounts, activePresetId)
  const selectedGroup = FUNCTIONAL_GROUPS.find((g) => g.id === selectedGroupId)

  const handleChangeCount = useCallback((id: string, delta: number) => {
    setGroupCounts((prev) => {
      const current = prev[id] || 0
      const next = Math.max(0, current + delta)
      return { ...prev, [id]: next }
    })
  }, [])

  const handleApplyPreset = useCallback((presetCounts: Record<string, number>, focusGroupId?: string) => {
    setGroupCounts(presetCounts)
    if (focusGroupId) {
      setSelectedGroupId(focusGroupId)
    }
  }, [])

  const handleResetCounts = useCallback(() => {
    setGroupCounts({})
  }, [])

  const handleAddGroupToCustom = useCallback((id: string) => {
    setGroupCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }))
    setSelectedGroupId(id)
    setPanelMode('custom')
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
            <OrganicLeftPanel
              panelMode={panelMode}
              onPanelModeChange={setPanelMode}
              selectedGroupId={selectedGroupId}
              groupCounts={groupCounts}
              onSelectGroup={setSelectedGroupId}
              onChangeCount={handleChangeCount}
              onApplyPreset={handleApplyPreset}
              onResetCounts={handleResetCounts}
            />
          }
          center={
            <div className="w-full h-full flex flex-col overflow-hidden">
              {viewMode === 0 && (
                panelMode === 'matrix' ? (
                  <OrganicFullMatrixView
                    selectedGroupId={selectedGroupId}
                    onSelectGroup={setSelectedGroupId}
                    onAddGroupToCustom={handleAddGroupToCustom}
                  />
                ) : (
                  <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
                    <OrganicMatrixScene
                      selectedGroup={selectedGroup}
                      groupCounts={groupCounts}
                      consumption={consumption}
                      font={canvasSize.font}
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
            <OrganicRightPanel
              groupCounts={groupCounts}
              selectedGroup={selectedGroup}
              consumption={consumption}
              onSelectGroup={setSelectedGroupId}
            />
          }
        />
      </div>
    </div>
  )
}
