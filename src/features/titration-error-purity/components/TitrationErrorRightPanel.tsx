import React from 'react'
import { ChemistryPanel } from '@/components/UI'
import type { TitrationErrorParams, TitrationChemistryResult } from '../types'

interface TitrationErrorRightPanelProps {
  params: TitrationErrorParams
  chemistry: TitrationChemistryResult
}

export const TitrationErrorRightPanel: React.FC<TitrationErrorRightPanelProps> = ({
  chemistry,
}) => {
  const { errorResult, purityResult, yieldResult } = chemistry

  // 1. 动态化学量构建 (满足 ChemistryQuantity 类型)
  const quantities = [
    {
      label: '标准液理论用量 V(真实)',
      value: errorResult.vTrue,
      unit: 'mL',
    },
    {
      label: '滴定管实际读数 V(读数)',
      value: errorResult.vRead,
      unit: 'mL',
      highlight: errorResult.effectDirection === 'high' ? ('negative' as const) : errorResult.effectDirection === 'low' ? ('extreme' as const) : undefined,
    },
    {
      label: '待测液真实浓度 c(真实)',
      value: errorResult.cTrue,
      unit: 'mol/L',
    },
    {
      label: '计算测得浓度 c(计算)',
      value: errorResult.cCalculated,
      unit: 'mol/L',
      highlight: errorResult.effectDirection === 'high' ? ('negative' as const) : errorResult.effectDirection === 'low' ? ('extreme' as const) : undefined,
    },
    {
      label: '样品纯度质量分数 w%',
      value: purityResult.purityPct,
      unit: '%',
    },
    {
      label: '实验提纯产率 Yield%',
      value: yieldResult.yieldPct,
      unit: '%',
    },
  ]

  // 2. 动态公式推导 (满足 Formula 类型)
  const formulas = [
    {
      name: '滴定测定浓度基本关系式',
      latex: 'c_{\\text{待测}} = \\frac{c_{\\text{标准}} \\times V_{\\text{标准}}}{V_{\\text{待测}}}',
      note: '式中 c(标准) 与 V(待测) 通常为已知常量，测定结果完全取决于 V(标准) 的测量读取值',
      level: 'core' as const,
    },
    {
      name: '误差机理代数表达式分析',
      latex: errorResult.equationExplanation,
      note: errorResult.description,
      level: 'important' as const,
    },
    {
      name: '样品纯度 w% 规范模版',
      latex: purityResult.calcStepsLatex,
      note: purityResult.stoichiometryRatio,
      level: 'derived' as const,
    },
    {
      name: '提纯产率 Yield% 计算公式',
      latex: yieldResult.calcFormulaLatex,
      note: 'Yield% = (实际获得质量 / 理论计算最大产量) × 100%',
      level: 'important' as const,
    },
  ]

  // 3. 高考压轴考点剖析 (满足 GaokaoPoint 类型)
  const gaokaoPoints = [
    {
      text: '高考视线读数口诀：“自上而下刻度增，仰视读大俯视小”。',
      importance: 'gaokao' as const,
    },
    {
      text: '“始仰终俯，ΔV 严重偏小” → 计算 c(待测) 偏低；“始俯终仰，ΔV 严重偏大” → 计算 c(待测) 偏高。',
      importance: 'hard' as const,
    },
    {
      text: '润洗原则：“滴定管要润洗，锥形瓶绝不润洗”；未润洗滴定管导致标准液被水稀释，消耗体积偏大，结果偏高。',
      importance: 'core' as const,
    },
    {
      text: '返滴定法（Back Titration）要领：n(被测物) = n(加入总标准液) - n(返滴定耗液)；代数推导时必须准确匹配化学计量数！',
      importance: 'gaokao' as const,
    },
    {
      text: '氧化还原滴定终点判定：无需额外指示剂（如 KMnO₄ 自指示剂），最后半滴标准液滴入时溶液变色且 30s 内不恢复。',
      importance: 'basic' as const,
    },
  ]

  // 4. 易错警示 (满足 WarningItem 类型)
  const warnings = [
    {
      text: '【易错点 1】：锥形瓶内留有洗涤蒸馏水对滴定结果无影响，因为这不改变瓶内待测溶质的总摩尔数 n(待)。',
      level: 'info' as const,
    },
    {
      text: '【易错点 2】：滴定管尖嘴有气泡，滴定后气泡消失，气泡占据的体积会被误计入标准液消耗量，导致结果偏高！',
      level: 'warning' as const,
    },
    {
      text: '【易错点 3】：返滴定法中，若滴定过量试剂的滴定管未润洗导致 V(返滴) 偏大，算出的剩余量偏大，导致被测物计算纯度反向偏低！',
      level: 'danger' as const,
    },
  ]

  return (
    <ChemistryPanel
      title="高考定量滴定误差与纯度产率解析"
      quantities={quantities}
      formulas={formulas}
      gaokaoPoints={gaokaoPoints}
      warnings={warnings}
    />
  )
}
