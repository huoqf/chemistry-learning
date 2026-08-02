import React from 'react'
import { ChemistryPanel } from '@/components/UI/ChemistryPanel'
import type { HessLawParams } from '../types'
import type { UseHessLawChemistryReturn } from '../hooks/useHessLawChemistry'

interface HessLawRightPanelProps {
  params: HessLawParams
  chemistry: UseHessLawChemistryReturn
}

export const HessLawRightPanel: React.FC<HessLawRightPanelProps> = ({
  params,
  chemistry,
}) => {
  const { currentHessGroup, hessCalculated, bondCalculated, energyProfile } =
    chemistry

  // 1. 根据探究模式生成动态化学量数据
  const quantities = React.useMemo(() => {
    if (params.mode === 'hess-overlay') {
      return [
        {
          label: '目标反应',
          value: currentHessGroup.targetFormula,
          unit: '',
        },
        {
          label: '理论目标 ΔH',
          symbol: 'ΔH_target',
          value: currentHessGroup.targetDeltaH,
          unit: 'kJ/mol',
          highlight: currentHessGroup.targetDeltaH < 0 ? ('negative' as const) : ('positive' as const),
        },
        {
          label: '叠加推导算术值',
          symbol: '∑(k_i ΔH_i)',
          value: hessCalculated.totalDeltaH.toFixed(1),
          unit: 'kJ/mol',
          highlight: hessCalculated.isMatchTarget ? ('equilibrium' as const) : ('extreme' as const),
        },
      ]
    } else if (params.mode === 'bond-energy') {
      return [
        {
          label: '反应物断键吸收总能',
          symbol: 'Q_吸',
          value: bondCalculated.reactantEnergySum,
          unit: 'kJ',
          highlight: 'positive' as const,
        },
        {
          label: '生成物成键释放总能',
          symbol: 'Q_放',
          value: bondCalculated.productEnergySum,
          unit: 'kJ',
          highlight: 'negative' as const,
        },
        {
          label: '推导反应热 ΔH',
          symbol: 'ΔH_键能',
          value: bondCalculated.deltaH,
          unit: 'kJ/mol',
          highlight: bondCalculated.deltaH < 0 ? ('negative' as const) : ('positive' as const),
        },
      ]
    } else {
      return [
        {
          label: '正反应活化能 (无催化)',
          symbol: 'Ea(正)',
          value: energyProfile.eaForwardUncat,
          unit: 'kJ/mol',
        },
        {
          label: '逆反应活化能 (无催化)',
          symbol: 'Ea(逆)',
          value: energyProfile.eaReverseUncat,
          unit: 'kJ/mol',
        },
        {
          label: '反应热 ΔH',
          symbol: 'ΔH',
          value: energyProfile.deltaH,
          unit: 'kJ/mol',
          highlight: energyProfile.deltaH < 0 ? ('negative' as const) : ('positive' as const),
        },
        {
          label: params.hasCatalyst === 1 ? '催化后决速步能垒' : '催化剂状态',
          symbol: 'Ea(决速)',
          value: params.hasCatalyst === 1 ? energyProfile.maxCatEa : '未加入',
          unit: params.hasCatalyst === 1 ? 'kJ/mol' : '',
          highlight: 'extreme' as const,
        },
      ]
    }
  }, [params.mode, params.hasCatalyst, currentHessGroup, hessCalculated, bondCalculated, energyProfile])

  // 2. 动态 LaTeX 公式
  const formulas = React.useMemo(() => {
    return [
      {
        name: '盖斯定律代数叠加原理',
        latex: '\\Delta H_{\\text{target}} = \\sum_{i} k_i \\cdot \\Delta H_i',
        condition: '化学反应无论一步完成还是分步完成，反应焓变相同',
        level: 'core' as const,
      },
      {
        name: '微观键能计算公式',
        latex: '\\Delta H = \\sum E_{\\text{断(反应物)}} - \\sum E_{\\text{成(生成物)}}',
        condition: '断键吸收能量 Q_{吸} > 0，成键释放能量 Q_{放} > 0',
        level: 'important' as const,
      },
      {
        name: '反应活化能与 ΔH 关系',
        latex: '\\Delta H = E_{a(\\text{正})} - E_{a(\\text{逆})}',
        condition: '催化剂同等降低 E_{a(正)} 与 E_{a(逆)}，不改变 \\Delta H',
        level: 'derived' as const,
      },
    ]
  }, [])

  // 3. 高考要点
  const gaokaoPoints = React.useMemo(() => {
    return [
      {
        text: '方程式乘以系数 k，ΔH 必须同时乘以系数 k；方程式反向颠倒，ΔH 符号改变。',
        importance: 'gaokao' as const,
      },
      {
        text: '高考高频结构键数：1 mol P₄ 含 6 mol P-P 键；1 mol SiO₂ 含 4 mol Si-O 键；1 mol 金刚石含 2 mol C-C 键；1 mol 石墨含 1.5 mol C-C 键。',
        importance: 'hard' as const,
      },
      {
        text: '燃烧热必须以 1 mol 可燃物完全燃烧生成稳定氧化物 (如 H₂O(l), CO₂(g)) 为基准。',
        importance: 'core' as const,
      },
    ]
  }, [])

  // 4. 易错警示
  const warnings = React.useMemo(() => {
    return [
      {
        text: '催化剂只能改变反应历程、降低活化能以加快速率，绝对不能改变反应热 ΔH 或平衡常数 K！',
        level: 'danger' as const,
      },
      {
        text: '计算键能时，切记区分【分子结构中键的条数】与【物质的量 mol】，如 CH₄ 1mol 含 4mol C-H 键。',
        level: 'warning' as const,
      },
      {
        text: '稀强酸与稀强碱反应生成 1 mol H₂O(l) 放热 57.3 kJ/mol 为中和热，弱酸/弱碱因电离吸热导致放热量小于 57.3 kJ。',
        level: 'info' as const,
      },
    ]
  }, [])

  return (
    <div className="h-full bg-white border-l border-slate-200">
      <ChemistryPanel
        title="母题九：热化学与盖斯定律理论解析"
        quantities={quantities}
        formulas={formulas}
        gaokaoPoints={gaokaoPoints}
        warnings={warnings}
        mnemonic="口诀：方程式加减 multiplier，ΔH 同步算代数；断键吸热减成键，催化降垒 ΔH 恒不变！"
      />
    </div>
  )
}
