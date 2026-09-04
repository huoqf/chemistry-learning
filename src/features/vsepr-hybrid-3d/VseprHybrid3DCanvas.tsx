import React, { useState } from 'react'
import { ThreePanel } from '@/components/Layout'
import {
  GaokaoToolHeader,
  ScoringCardSection,
  GaokaoVariantQuiz,
} from '@/components/UI'
import { getModelQuizData } from '@/data/quiz'
import type { DisplayMode } from './types'
import { VSEPR_MOLECULE_MAP } from './data/vseprData'
import { useVseprChemistry } from './hooks/useVseprChemistry'
import { VseprLeftPanel } from './components/VseprLeftPanel'
import { VseprCenterView } from './components/VseprCenterView'
import { VseprRightPanel } from './components/VseprRightPanel'

export const VseprHybrid3DCanvas: React.FC = () => {
  const modelId = 'model-vsepr-hybrid-3d'
  const quizData = getModelQuizData(modelId)

  // 视角模式 (0: 图谱探究 | 1: 规范踩分 | 2: 真题研析)
  const [viewMode, setViewMode] = useState<number>(0)

  // 交互状态
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>('ch4')
  const [displayMode, setDisplayMode] = useState<DisplayMode>('ball_stick')
  const [showAngleAnnotation, setShowAngleAnnotation] = useState<boolean>(true)
  const [showSpaceFilling, setShowSpaceFilling] = useState<boolean>(false)

  const currentMolecule = VSEPR_MOLECULE_MAP[selectedMoleculeId] || VSEPR_MOLECULE_MAP.ch4

  // 纯化学计算 Hook
  const calcResult = useVseprChemistry(currentMolecule)

  return (
    <div className="w-full h-full flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
      {/* 1. 统一黑金 Header 导航与右侧视角 Tabs */}
      <GaokaoToolHeader
        modelId={modelId}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 2. 视角分发与 ThreePanel 组装 */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 0 && (
          <ThreePanel
            left={
              <VseprLeftPanel
                selectedMoleculeId={selectedMoleculeId}
                onSelectMoleculeId={setSelectedMoleculeId}
                displayMode={displayMode}
                onChangeDisplayMode={setDisplayMode}
                showAngleAnnotation={showAngleAnnotation}
                onToggleAngleAnnotation={setShowAngleAnnotation}
                showSpaceFilling={showSpaceFilling}
                onToggleSpaceFilling={setShowSpaceFilling}
              />
            }
            center={
              <VseprCenterView
                molecule={currentMolecule}
                displayMode={displayMode}
                showAngleAnnotation={showAngleAnnotation}
                showSpaceFilling={showSpaceFilling}
              />
            }
            right={<VseprRightPanel calcResult={calcResult} displayMode={displayMode} />}
          />
        )}

        {viewMode === 1 && quizData && (
          <div className="w-full h-full bg-slate-50 overflow-y-auto py-6 px-4">
            <div className="max-w-4xl mx-auto">
              <ScoringCardSection steps={quizData.scoringSteps} />
            </div>
          </div>
        )}

        {viewMode === 2 && quizData && (
          <div className="w-full h-full bg-slate-50 overflow-y-auto py-6 px-4">
            <div className="max-w-4xl mx-auto">
              <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
