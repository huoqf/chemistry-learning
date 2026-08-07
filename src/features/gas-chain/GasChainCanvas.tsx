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
import { useGasChainChemistry } from './hooks/useGasChainChemistry'
import { GasChainLeftPanel } from './components/GasChainLeftPanel'
import { GasChainCenterView } from './components/GasChainCenterView'
import { GasChainRightPanel } from './components/GasChainRightPanel'

// 5 大经典体系默认预设表
const SYSTEM_PRESETS: Record<GasChainSystemId, Partial<GasChainParams>> = {
  'cl2-prep': {
    systemId: 'cl2-prep',
    targetGas: 'Cl₂',
    generator: 'flask-heat',
    washReagent: 'sat-nacl',
    washReverse: false,
    dryer: 'conc-h2so4',
    collection: 'upward-air',
    tailGas: 'naoh-absorber',
    temp: 90,
    heating: true,
  },
  'nh3-prep': {
    systemId: 'nh3-prep',
    targetGas: 'NH₃',
    generator: 'testtube-heat',
    washReagent: 'none',
    washReverse: false,
    dryer: 'soda-lime',
    collection: 'downward-air',
    tailGas: 'inverted-funnel',
    temp: 110,
    heating: true,
  },
  'so2-chain': {
    systemId: 'so2-chain',
    targetGas: 'SO₂',
    generator: 'flask-noheat',
    washReagent: 'fuchsin',
    washReverse: false,
    dryer: 'conc-h2so4',
    collection: 'upward-air',
    tailGas: 'naoh-absorber',  // SO₂ 有毒，尾气用 NaOH 溶液吸收（高考标准答案）
    temp: 25,
    heating: false,
  },
  'no-no2-chain': {
    systemId: 'no-no2-chain',
    targetGas: 'NO₂',
    generator: 'flask-noheat',
    washReagent: 'none',
    washReverse: false,
    dryer: 'cacl2',
    collection: 'upward-air',
    tailGas: 'naoh-absorber',
    temp: 25,
    heating: false,
  },
  'c2h4-prep': {
    systemId: 'c2h4-prep',
    targetGas: 'C₂H₄',
    generator: 'flask-heat',
    washReagent: 'naoh',
    washReverse: false,
    dryer: 'cacl2',
    collection: 'water-displacement',
    tailGas: 'combustion',
    temp: 170,
    heating: true,
  },
  custom: {
    systemId: 'custom',
    targetGas: 'Cl₂',
    generator: 'flask-heat',
    washReagent: 'sat-nacl',
    washReverse: false,
    dryer: 'conc-h2so4',
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

  // 默认使用 Cl2 强氧化性制备体系
  const [params, setParams] = useState<GasChainParams>({
    viewMode: 0,
    systemId: 'cl2-prep',
    targetGas: 'Cl₂',
    generator: 'flask-heat',
    washReagent: 'sat-nacl',
    washReverse: false,
    dryer: 'conc-h2so4',
    collection: 'upward-air',
    tailGas: 'naoh-absorber',
    flowRate: 50,
    temp: 90,
    heating: true,
  })

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
            />
          }
          center={
            <GasChainCenterView
              params={params}
              chemistry={chemistry}
              quizData={quizData}
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
