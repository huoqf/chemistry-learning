/**
 * src/features/gas-chain/GasChainCanvas.tsx
 * 母题六：气体制备/净化/尾气处理装置链工具 - 核心组装入口
 */

import { useState, useCallback } from 'react'
import { ThreePanel } from '@/components/Layout'
import { GaokaoToolHeader } from '@/components/UI'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { getModelQuizData } from '@/data/quiz'
import type { GasChainParams, GasChainSystemId } from './types'
import type { GasCategory } from './data/gasChainMatrixData'
import { GAS_PRESET_CONFIGS } from './data/gasChainMatrixData'
import { useGasChainChemistry } from './hooks/useGasChainChemistry'
import { GasChainLeftPanel } from './components/GasChainLeftPanel'
import { GasChainCenterView } from './components/GasChainCenterView'
import { GasChainRightPanel } from './components/GasChainRightPanel'

// 5 大经典体系默认预设表
const SYSTEM_PRESETS: Record<GasChainSystemId, Partial<GasChainParams>> = {
  'cl2-prep': GAS_PRESET_CONFIGS['Cl₂'],
  'nh3-prep': GAS_PRESET_CONFIGS['NH₃'],
  'so2-chain': GAS_PRESET_CONFIGS['SO₂'],
  'no-no2-chain': GAS_PRESET_CONFIGS['NO₂'],
  'c2h4-prep': GAS_PRESET_CONFIGS['C₂H₄'],
  custom: {
    systemId: 'custom',
    targetGas: 'Cl₂',
    generator: 'flask-heat',
    washingSteps: [
      { id: 's1', device: 'wash-bottle', reagent: 'sat-nacl', role: 'purify' },
      { id: 's2', device: 'acid-bottle', reagent: 'conc-h2so4', role: 'dry' },
    ],
    collection: 'upward-air',
    tailGas: 'naoh-absorber',
    temp: 85,
    heating: true,
  },
}

export function GasChainCanvas() {
  const modelId = 'model-gas-chain'
  const model = getGaokaoModel(modelId)
  const quizData = getModelQuizData(modelId)

  // 默认使用 Cl2 强氧化性制备体系，panelMode 默认为 chain
  const [params, setParams] = useState<GasChainParams>({
    viewMode: 0,
    panelMode: 'chain',
    systemId: 'cl2-prep',
    targetGas: 'Cl₂',
    generator: 'flask-heat',
    washingSteps: [
      { id: 's1', device: 'wash-bottle', reagent: 'sat-nacl', role: 'purify' },
      { id: 's2', device: 'acid-bottle', reagent: 'conc-h2so4', role: 'dry' },
    ],
    collection: 'upward-air',
    tailGas: 'naoh-absorber',
    flowRate: 50,
    temp: 90,
    heating: true,
  })

  const [categoryFilter, setCategoryFilter] = useState<GasCategory | 'all'>('all')

  const updateParam = useCallback((key: keyof GasChainParams, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }, [])

  // 预设体系一键切换
  const handleSelectSystem = useCallback((sysId: GasChainSystemId) => {
    const preset = SYSTEM_PRESETS[sysId]
    if (preset) {
      setParams((prev) => ({
        ...prev,
        ...preset,
      }))
    }
  }, [])

  // 13 种核心气体一键精准加载并模拟
  const handleSelectGas = useCallback((targetGas: string) => {
    const config = GAS_PRESET_CONFIGS[targetGas]
    if (config) {
      setParams((prev) => ({
        ...prev,
        ...config,
        targetGas,
        panelMode: 'chain',
      }))
    } else {
      setParams((prev) => ({
        ...prev,
        targetGas,
        panelMode: 'chain',
      }))
    }
  }, [])

  const handleReset = useCallback(() => {
    handleSelectSystem('cl2-prep')
  }, [handleSelectSystem])

  const chemistry = useGasChainChemistry(params)

  return (
    <div className="w-full h-screen flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
      {/* 统一 Header */}
      <GaokaoToolHeader
        modelId={modelId}
        viewMode={params.viewMode}
        onViewModeChange={(m) => updateParam('viewMode', m)}
      />

      {/* 主体 ThreePanel 三栏区域 */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel
          left={
            <GasChainLeftPanel
              params={params}
              updateParam={updateParam}
              onReset={handleReset}
              onSelectSystem={handleSelectSystem}
              onSelectGas={handleSelectGas}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
            />
          }
          center={
            <GasChainCenterView
              params={params}
              chemistry={chemistry}
              quizData={quizData}
              onApplySystemPreset={handleSelectGas}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
            />
          }
          right={
            <GasChainRightPanel
              params={params}
              chemistry={chemistry}
              model={model}
            />
          }
        />
      </div>
    </div>
  )
}
