/**
 * src/features/gas-chain/components/GasChainRightPanel.tsx
 * 气体制备/净化/尾气处理装置链工具 - 右侧屏化学量与考点面板
 */

import React from 'react'
import { ChemistryPanel } from '@/components/UI'
import type { GasChainParams } from '../types'
import type { GasChainChemistryResult } from '../hooks/useGasChainChemistry'
import type { GaokaoModelNode } from '@/data/gaokaoModels'

interface GasChainRightPanelProps {
  params: GasChainParams
  chemistry: GasChainChemistryResult
  model?: GaokaoModelNode
}

export const GasChainRightPanel: React.FC<GasChainRightPanelProps> = ({
  params,
  chemistry,
}) => {
  const { gasPurity, impurityConc, tailAbsorbRate, flowRateOut, reactionEquation, purificationEquation, tailGasEquation } = chemistry

  // 1. 化学量定义
  const quantities = [
    {
      label: '目标气体收集纯度',
      value: `${gasPurity.toFixed(1)}`,
      unit: '%',
      color: gasPurity > 90 ? 'emerald' : 'amber',
      description: '高考标准: 纯度 > 95% 方可集满使用',
    },
    {
      label: '杂质气体残留率',
      value: `${impurityConc.toFixed(1)}`,
      unit: '%',
      color: impurityConc === 0 ? 'emerald' : 'blue',
      description: impurityConc === 0 ? '杂质完全去除' : '洗气瓶与干燥管协同净化中',
    },
    {
      label: '尾气吸收效率',
      value: `${tailAbsorbRate.toFixed(1)}`,
      unit: '%',
      color: tailAbsorbRate > 95 ? 'emerald' : 'amber',
      description: '绿色化学防环境污染',
    },
    {
      label: '气体生成流速',
      value: `${flowRateOut}`,
      unit: 'mL/min',
      color: flowRateOut > 0 ? 'blue' : 'amber',
      description: flowRateOut === 0 ? '导管封堵或已停止' : '稳定生成',
    },
    {
      label: '发生反应温度',
      value: `${params.temp}`,
      unit: '°C',
      color: 'blue',
      description: params.heating ? '酒精灯持续加热' : '常温发生',
    },
  ]

  // 2. 反应公式定义
  const formulas = [
    {
      name: '① 发生反应方程式',
      latex: reactionEquation,
      note: params.heating ? '高考考点：需要酒精灯加热 (MnO₂ + 浓盐酸、乙醇脱水)' : '高考考点：固液不加热常温反应',
    },
    {
      name: '② 净化除杂与洗气反应',
      latex: purificationEquation,
      note: '洗气瓶必须“长进短出”；饱和 NaCl 除 HCl 抑 Cl₂；NaOH 吸收酸性杂质。',
    },
    {
      name: '③ 尾气吸收与防倒吸',
      latex: tailGasEquation,
      note: '极易溶气体 (NH₃/HCl) 必须使用倒置漏斗/安全瓶防止引发倒吸试管炸裂。',
    },
  ]

  // 3. 高考要点定义
  const gaokaoPoints = [
    {
      text: '【气体制备全链顺序】：发生 ➔ 净化除杂 ➔ 干燥脱水 ➔ 规范收集 ➔ 尾气处理/防倒吸。',
      importance: 'gaokao' as const,
    },
    {
      text: '【管道进出规则】：洗气瓶必须“长进短出”；球形干燥管“大进小出”；防倒吸漏斗边缘下沿刚好接触液面。',
      importance: 'gaokao' as const,
    },
    {
      text: '【干燥剂匹配铁律】：浓硫酸不干燥 NH₃ (发生反应)；碱石灰不干燥酸性气体 (Cl₂/SO₂/NO₂)；无水 CaCl₂ 络合 NH₃。',
      importance: 'hard' as const,
    },
    {
      text: '【极易溶气体防倒吸】：NH₃/HCl 直接插入水/碱液会引致剧烈倒吸炸裂；倒置漏斗大容积可在液体倒吸时自动脱离液面防倒吸。',
      importance: 'hard' as const,
    },
    {
      text: '【收集方法选择】：密度比空气大 (Cl₂/SO₂/NO₂) 用向上排空气法；密度比空气小 (NH₃) 用向下排空气法；难溶于水 (O₂/NO/C₂H₄) 用排水法。',
      importance: 'basic' as const,
    },
  ]

  // 4. 易错警示
  const warnings = [
    ...(chemistry.hasDangerAlert
      ? [
          {
            text: `高危警示：当前装置链存在事故患隐 (${chemistry.dangerType})，请查看中屏诊断卡并即时修复！`,
            level: 'danger' as const,
          },
        ]
      : []),
  ]

  return (
    <div className="w-full h-full p-4 overflow-y-auto bg-white border-l border-slate-200">
      <ChemistryPanel
        quantities={quantities}
        formulas={formulas}
        gaokaoPoints={gaokaoPoints}
        warnings={warnings}
      />
    </div>
  )
}
