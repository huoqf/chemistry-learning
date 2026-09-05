import React, { useState } from 'react'
import { ThreePanel } from '@/components/Layout'
import {
  GaokaoToolHeader,
  ScoringCardSection,
  GaokaoVariantQuiz,
} from '@/components/UI'
import { getModelQuizData } from '@/data/quiz'
import type { CrystalTypeId, DisplayMode, CalculationMode, ModelStyle, AtomLocationType } from './types'
import { CRYSTAL_DATA_MAP } from './data/crystalData'
import { useCrystalChemistry } from './hooks/useCrystalChemistry'
import { Crystal3DScene } from './components/Crystal3DScene'
import { Crystal3DLeftPanel } from './components/Crystal3DLeftPanel'
import { Crystal3DRightPanel } from './components/Crystal3DRightPanel'

export const Crystal3DSplitCanvas: React.FC = () => {
  const modelId = 'model-crystal-3d-split'
  const quizData = getModelQuizData(modelId)

  // 视角模式 (0: 图谱探究 | 1: 规范踩分 | 2: 真题研析)
  const [viewMode, setViewMode] = useState<number>(0)

  // 晶胞选择与求解模式
  const [selectedTypeId, setSelectedTypeId] = useState<CrystalTypeId>('nacl')
  const [modelStyle, setModelStyle] = useState<ModelStyle>('ball-stick')
  const [displayMode, setDisplayMode] = useState<DisplayMode>('default')
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('algebraic')
  const [highlightElement, setHighlightElement] = useState<string | null>(null)
  const [selectedLocationType, setSelectedLocationType] = useState<AtomLocationType | null>(null)

  const currentCrystal = CRYSTAL_DATA_MAP[selectedTypeId]

  // 切换晶胞时清空高亮与选中位点
  const handleSelectType = (newTypeId: CrystalTypeId) => {
    setSelectedTypeId(newTypeId)
    setHighlightElement(null)
    setSelectedLocationType(null)
  }

  // 纯化学导出计算 Hook (双模：代数推导 vs 真实常数计算)
  const calcResult = useCrystalChemistry(currentCrystal, calculationMode)

  return (
    <div className="w-full h-full flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
      {/* 统一黑金 Header 导航与右侧视角 Tabs */}
      <GaokaoToolHeader
        modelId={modelId}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 视角分发 */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 0 && (
          <ThreePanel
            left={
              <Crystal3DLeftPanel
                selectedTypeId={selectedTypeId}
                onSelectType={handleSelectType}
                modelStyle={modelStyle}
                onChangeModelStyle={setModelStyle}
                displayMode={displayMode}
                onChangeDisplayMode={setDisplayMode}
                calculationMode={calculationMode}
                onChangeCalculationMode={setCalculationMode}
                highlightElement={highlightElement}
                onSelectHighlightElement={setHighlightElement}
              />
            }
            center={
              <div className="w-full h-full p-2 bg-slate-50 overflow-hidden">
                <Crystal3DScene
                  crystalData={currentCrystal}
                  displayMode={displayMode}
                  modelStyle={modelStyle}
                  highlightElement={highlightElement}
                  edgeLengthPm={currentCrystal.defaultEdgeLengthPm}
                  onSelectLocationType={setSelectedLocationType}
                />
              </div>
            }
            right={
              <Crystal3DRightPanel
                crystalData={currentCrystal}
                calcResult={calcResult}
                selectedLocationType={selectedLocationType}
              />
            }
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
