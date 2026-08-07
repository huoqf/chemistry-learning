/**
 * src/features/electrochemical-twin/components/ElectrochemicalTwinRightPanel.tsx
 * 右屏三段式：化学量监控 + 公式与原理 + 高考要点卡片 (基于 ChemistryPanel)
 */

import React from 'react'
import { ChemistryPanel } from '@/components/UI'
import type { CellDetails, QuantResult, ElectrochemicalParams } from '../types'

interface Props {
  params: ElectrochemicalParams
  cellDetails: CellDetails
  quantResult: QuantResult
}

export const ElectrochemicalTwinRightPanel: React.FC<Props> = ({ params, cellDetails, quantResult }) => {
  // 1. 化学量定义
  const quantities = [
    {
      label: '回路电流强度 I',
      value: params.currentAmp,
      unit: 'A',
    },
    {
      label: '反应电解时间 t',
      value: params.timeSec,
      unit: 's',
    },
    {
      label: '转移电子 n(e⁻)',
      value: quantResult.molesElectron,
      unit: 'mol',
    },
    {
      label: '左极质量变化 Δm',
      value: quantResult.massChangeLeft,
      unit: 'g',
    },
    {
      label: '右极质量变化 Δm',
      value: quantResult.massChangeRight,
      unit: 'g',
    },
    {
      label: '右极生成气体体积 V',
      value: quantResult.gasVolumeRight,
      unit: 'L(标况)',
    },
  ]

  // 2. 公式定义
  const formulas = [
    {
      name: '法拉第电解第一定律',
      latex: 'n(e^-) = \\frac{I \\cdot t}{F}',
      note: 'F = 96485 C/mol。电子只在导线中传递，绝不经过溶液或隔膜！',
      level: 'core' as const,
    },
    {
      name: '原电池与电解池电极判定口诀',
      latex: '\\text{负失氧, 正得还; 阳失氧, 阴得还}',
      note: '负极/阳极永远发生氧化反应；正极/阴极永远发生还原反应。',
      level: 'important' as const,
    },
    {
      name: '溶液离子定向漂移规律',
      latex: '\\text{阳往正/阴极，阴往负/阳极}',
      note: '阳离子向正极/阴极移动，阴离子向负极/阳极移动。',
      level: 'derived' as const,
    },
  ]

  // 3. 高考要点
  const gaokaoPoints = [
    {
      text: '电源/自发性判定：有外接电源必为电解池，无电源且能自发反应为原电池。蓄电池放电=原电池，充电=电解池。',
      importance: 'gaokao' as const,
    },
    {
      text: '离子交换膜透膜方向：阳离子交换膜仅允许阳离子穿膜（由负极/阳极区向正极/阴极区漂移）。',
      importance: 'hard' as const,
    },
    {
      text: '全钒液流电池放电负极失电子（V²⁺→V³⁺），充电阴极得电子（V³⁺→V²⁺）。',
      importance: 'core' as const,
    },
  ]

  // 4. 易错警示
  const warnings = [
    {
      text: '【警示 1】：电子绝对不能穿过电解质溶液或离子交换膜！溶液中只有离子（阴/阳离子）发生定向漂移。',
      level: 'danger' as const,
    },
    {
      text: '【警示 2】：二次电池充电时，阴极接电源负极（发生还原），阳极接电源正极（发生氧化）。',
      level: 'warning' as const,
    },
  ]

  return (
    <ChemistryPanel
      title={cellDetails.title}
      quantities={quantities}
      formulas={formulas}
      gaokaoPoints={gaokaoPoints}
      warnings={warnings}
    />
  )
}
