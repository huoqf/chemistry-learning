/**
 * src/features/gas-chain/components/GasChainRightPanel.tsx
 * 气体制备/净化/尾气处理装置链工具 - 右侧屏化学量与考点面板
 *
 * 遵循 Rule [AGENTS.md] 规范：
 * 100% 基于项目 UI 标准组件 ChemistryPanel 重构，将避坑诊断引擎逻辑无缝融入
 * quantities / formulas / warnings / gaokaoPoints 标准结构，彻底消除重复与异构卡片。
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
  const {
    gasPurity,
    impurityConc,
    tailAbsorbRate,
    flowRateOut,
    reactionEquation,
    purificationEquation,
    tailGasEquation,
    issues,
  } = chemistry

  // 1. 核心化学量定义
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

  // 2. 净化 Note 动态计算
  const firstReagent = params.washingSteps[0]?.reagent ?? 'none'
  let washNote = '洗气瓶必须“长进短出”；饱和 NaCl 除 HCl 抑 Cl₂；NaOH 吸收酸性杂质。'
  if (firstReagent === 'none') {
    washNote = '提示：当前选用了未净化跳过节点，请确保发生气体无有害副杂质。'
  } else if (firstReagent === 'fuchsin') {
    washNote = 'SO₂ 气体通入品红溶液，使红色褪去；加热后重新恢复红色 (SO₂ 漂白特征)。'
  } else if (firstReagent === 'kmno4') {
    washNote = '酸性 KMnO₄ 可氧化 SO₂ 除杂；但强氧化性会切断 C=C 双键把乙烯氧化成 CO₂！'
  }

  // 3. 反应公式定义
  const formulas = [
    {
      name: '① 发生反应方程式',
      latex: reactionEquation,
      note: params.heating ? '高考考点：需要酒精灯加热 (MnO₂ + 浓盐酸、乙醇脱水)' : '高考考点：固液不加热常温反应',
    },
    {
      name: '② 净化除杂与洗气反应',
      latex: purificationEquation,
      note: washNote,
    },
    {
      name: '③ 尾气吸收与防倒吸',
      latex: tailGasEquation,
      note: '极易溶气体 (NH₃/HCl/SO₂) 必须使用倒置漏斗/安全瓶防止引发倒吸试管炸裂。',
    },
  ]

  // 4. 将避坑诊断 issues 转换为 ChemistryPanel 的易错警示 (warnings)
  const warnings = issues
    .filter((issue) => issue.level === 'danger' || issue.level === 'warning')
    .map((issue) => ({
      text: `【${issue.level === 'danger' ? '事故高危' : '易错扣分'}】${issue.title} — ${issue.description}`,
      level: issue.level === 'danger' ? ('danger' as const) : ('warning' as const),
    }))

  // 5. 高考要点定义（融合经典要点与避坑引擎考点）
  const baseGaokaoPoints = [
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
  ]

  // 加上从避坑诊断中动态提取的高考考点
  const issuePoints = issues.map((issue) => ({
    text: `【避坑考点】${issue.examPoint}`,
    importance: (issue.level === 'danger' ? 'hard' : 'gaokao') as 'hard' | 'gaokao',
  }))

  // 去重后合成高考要点
  const combinedPoints = [...baseGaokaoPoints]
  issuePoints.forEach((ip) => {
    if (!combinedPoints.some((p) => p.text === ip.text)) {
      combinedPoints.push(ip)
    }
  })

  return (
    <div className="w-full h-full p-4 overflow-y-auto bg-white border-l border-slate-200">
      <ChemistryPanel
        title="气体制备装置链化学指标与踩分面板"
        quantities={quantities}
        formulas={formulas}
        warnings={warnings}
        gaokaoPoints={combinedPoints}
      />
    </div>
  )
}
