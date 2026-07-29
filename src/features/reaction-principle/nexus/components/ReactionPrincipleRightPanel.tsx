import React from 'react'
import { ChemistryPanel } from '@/components/UI'
import type { NexusParams } from '../types'

interface ReactionPrincipleRightPanelProps {
  params: NexusParams
  chemistry: any
}

export const ReactionPrincipleRightPanel: React.FC<ReactionPrincipleRightPanelProps> = ({
  params: _params,
  chemistry,
}) => {
  const { system, eaForward, eaReverse, boltzmannData, vantHoffData } = chemistry

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <ChemistryPanel
        title="化学热力学与动力学展示"
        quantities={[
          {
            label: '正反应活化能 Ea(正)',
            value: eaForward,
            unit: 'kJ/mol',
            color: '#8B5CF6',
          },
          {
            label: '逆反应活化能 Ea(逆)',
            value: eaReverse,
            unit: 'kJ/mol',
            color: '#8B5CF6',
          },
          {
            label: '反应热 ΔH',
            value: system.deltaH,
            unit: 'kJ/mol',
            highlight: system.deltaH < 0 ? 'negative' : 'positive',
          },
          {
            label: '平衡常数 Kc',
            value: vantHoffData.currentKc,
            unit: '',
            color: '#3B82F6',
          },
          {
            label: '活化分子占比',
            value: `${boltzmannData.activatedFraction}%`,
            unit: '',
            color: '#EF4444',
          },
          {
            label: 'ln K 值',
            value: vantHoffData.currentLnK,
            unit: '',
          },
        ]}
        formulas={[
          {
            name: '阿伦尼乌斯公式',
            latex: 'k = A \\cdot e^{-\\frac{E_a}{R T}}',
            note: '反应速率常数 k 与活化能 Ea 和温度 T 的定量关系',
          },
          {
            name: '活化能与反应热关系',
            latex: '\\Delta H = E_{a(\\text{正})} - E_{a(\\text{逆})}',
            note: '反应热等于正逆活化能之差',
          },
          {
            name: '范特霍夫方程',
            latex: '\\ln K = -\\frac{\\Delta H}{R T} + C',
            note: '平衡常数 K 随温度 T 变化关系',
          },
        ]}
        gaokaoPoints={[
          {
            text: '催化剂能够改变反应途径，同等程度降低 Ea(正) 与 Ea(逆)，但不改变 ΔH 与平衡常数 K。',
            importance: 'gaokao',
          },
          {
            text: '在多步催化反应中，势能垒 Highest (活化能最大) 的基元反应步骤为“决速步”。',
            importance: 'core',
          },
          {
            text: '对于放热反应 ΔH < 0，升高温度，正逆反应速率均增大，但 v(逆) 增大的幅度更大，平衡逆向移动。',
            importance: 'gaokao',
          },
          {
            text: '恒温恒容下充入 He 气，各组分浓度不变，平衡不移动；恒温恒压下充入 He 气，体积增大组分分压减小，相当于减压。',
            importance: 'hard',
          },
        ]}
        warnings={[
          {
            text: '固体或纯液体改变用量，浓度不变，不能改变反应速率，也不能引起化学平衡移动。',
            level: 'warning',
          },
          {
            text: '勒夏特列原理的“减弱”含义：平衡移动的结果只能减弱外界条件的变化，而不能消除或翻转这种变化。',
            level: 'danger',
          },
        ]}
      />
    </div>
  )
}
