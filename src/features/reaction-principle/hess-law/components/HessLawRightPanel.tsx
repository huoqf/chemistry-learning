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
          unit: 'kJ/mol',
          highlight: 'positive' as const,
        },
        {
          label: '生成物成键释放总能',
          symbol: 'Q_放',
          value: bondCalculated.productEnergySum,
          unit: 'kJ/mol',
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
        ...(params.hasCatalyst === 1
          ? [
              {
                label: '催化后表观活化能 (相对反应物)',
                symbol: 'Ea(表观)',
                value: energyProfile.apparentCatEa,
                unit: 'kJ/mol',
                highlight: 'positive' as const,
              },
            ]
          : []),
      ]
    }
  }, [params.mode, params.hasCatalyst, currentHessGroup, hessCalculated, bondCalculated, energyProfile])

  // 2. 动态 LaTeX 公式（按当前探究模式精准匹配）
  const formulas = React.useMemo(() => {
    if (params.mode === 'hess-overlay') {
      return [
        {
          name: '盖斯定律代数叠加原理',
          latex: '\\Delta H_{\\text{target}} = \\sum_{i} k_i \\cdot \\Delta H_i',
          condition: '化学反应无论一步完成还是分步完成，反应焓变相同（状态函数）',
          level: 'core' as const,
        },
        {
          name: '方程式系数缩放与反向法则',
          latex: '\\text{反向: } \\Delta H\' = -\\Delta H; \\quad \\text{乘倍 } k: \\Delta H\' = k \\cdot \\Delta H',
          condition: 'k 需与热化学方程式化学计量数同步变换',
          level: 'important' as const,
        },
      ]
    }
    if (params.mode === 'bond-energy') {
      return [
        {
          name: '微观键能计算公式',
          latex: '\\Delta H = \\sum E_{\\text{断(反应物)}} - \\sum E_{\\text{成(生成物)}}',
          condition: '断键吸收能量 Q(吸) > 0，成键释放能量 Q(放) > 0',
          level: 'core' as const,
        },
        {
          name: '反应物与生成物相对能阶判定',
          latex: 'Q_{\\text{吸}} < Q_{\\text{放}} \\implies \\Delta H < 0 \\text{ (放热)}',
          condition: '生成物总键能越大越稳定，体系能量越低',
          level: 'important' as const,
        },
      ]
    }
    return [
      {
        name: '反应活化能与 ΔH 关系',
        latex: '\\Delta H = E_{a(\\text{正})} - E_{a(\\text{逆})}',
        condition: '催化剂同等降低 Ea(正) 与 Ea(逆)，不改变 ΔH',
        level: 'core' as const,
      },
      {
        name: '多步反应速控步判定',
        latex: 'v_{\\text{总}} \\propto \\text{第 } i \\text{ 步，其中 } E_{a,i} = \\max(E_{a,1}, E_{a,2}, \\dots)',
        condition: '活化能最高的基元反应步决定总反应速率（决速步）',
        level: 'derived' as const,
      },
    ]
  }, [params.mode])

  // 3. 高考要点（按模式聚焦核心考法）
  const gaokaoPoints = React.useMemo(() => {
    if (params.mode === 'hess-overlay') {
      return [
        {
          text: '方程式乘以系数 k，ΔH 必须同时乘以系数 k；方程式反向颠倒，ΔH 符号改变。',
          importance: 'gaokao' as const,
        },
        {
          text: '燃烧热必须以 1 mol 可燃物完全燃烧生成稳定氧化物 (如 H₂O(l)、CO₂(g)) 为基准，关注物质聚集状态。',
          importance: 'core' as const,
        },
      ]
    }
    if (params.mode === 'bond-energy') {
      return [
        {
          text: '高考高频结构键数：1 mol P₄ 含 6 mol P-P 键；1 mol SiO₂ 含 4 mol Si-O 键；1 mol 金刚石含 2 mol C-C 键；1 mol 石墨含 1.5 mol C-C 键。',
          importance: 'hard' as const,
        },
        {
          text: '微观键能估算以气态分子断裂/形成化学键为基准；若涉及液态水或分子晶体等相态变化需计入相变潜热（如汽化热、升华热），共价晶体（如 Si(s)）原子化则对应断键吸热。',
          importance: 'gaokao' as const,
        },
      ]
    }
    return [
      {
        text: '在催化剂双峰历程图中，Ea1 与 Ea2 分别对应各步过渡态能垒；Ea 越大该步速率越慢，即总反应的决速步。',
        importance: 'gaokao' as const,
      },
      {
        text: '无论经过几步基元反应、是否存在中间产物，始态与终态能量差不变，ΔH = E(生成物) - E(反应物) 保持恒定。',
        importance: 'core' as const,
      },
    ]
  }, [params.mode])

  // 4. 易错警示
  const warnings = React.useMemo(() => {
    if (params.mode === 'hess-overlay') {
      return [
        {
          text: '热化学方程式必须标明聚集状态（s/l/g/aq）；同一物质不同状态（如 H₂O(g) 与 H₂O(l)）不能直接消去。',
          level: 'danger' as const,
        },
        {
          text: '稀强酸与稀强碱反应生成 1 mol H₂O(l) 放热 57.3 kJ/mol 为中和热；弱酸/弱碱因电离吸热导致放热量小于 57.3 kJ。',
          level: 'info' as const,
        },
      ]
    }
    if (params.mode === 'bond-energy') {
      return [
        {
          text: '计算键能时，切记区分【分子结构中键的条数】与【物质的量 mol】，如 1 mol CH₄ 含 4 mol C-H 键，1 mol NH₃ 含 3 mol N-H 键。',
          level: 'warning' as const,
        },
        {
          text: '谨防公式符号颠倒：ΔH = 断键吸热之和 - 成键放热之和，切勿误写成“生成物键能 - 反应物键能”。',
          level: 'danger' as const,
        },
      ]
    }
    return [
      {
        text: '催化剂只能改变反应历程、降低活化能以同倍数加快正逆反应速率，绝对不能改变反应热 ΔH、平衡常数 K 或平衡转化率！',
        level: 'danger' as const,
      },
      {
        text: '第二步活化能是从中间产物能级到第二过渡态峰顶的垂直高差，而非从反应物基线起算。',
        level: 'warning' as const,
      },
    ]
  }, [params.mode])

  const mnemonic =
    params.mode === 'hess-overlay'
      ? '口诀：方程式加减乘倍，ΔH 同步算代数；聚集状态须对齐，稳定态基准莫相忘！'
      : params.mode === 'bond-energy'
        ? '口诀：断键吸热正计入，成键放热作减项；P₄六键金刚二，键数莫与分子混！'
        : '口诀：催化降垒改历程，正逆同降速齐升；峰高定速步，始末差值 ΔH 恒！'

  return (
    <div className="w-full bg-white border-l border-slate-200">
      <ChemistryPanel
        scrollable={false}
        title="母题七：热化学与盖斯定律理论解析"
        quantities={quantities}
        formulas={formulas}
        gaokaoPoints={gaokaoPoints}
        warnings={warnings}
        mnemonic={mnemonic}
      />
    </div>
  )
}
