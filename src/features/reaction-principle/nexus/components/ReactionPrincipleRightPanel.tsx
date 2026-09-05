/**
 * src/features/reaction-principle/nexus/components/ReactionPrincipleRightPanel.tsx
 * 母题四：勒夏特列移动与活化能图谱工具 - 右屏面板
 * 遵循 08_THREE_PANEL_RULES.md 3.4 节：与左屏 params.chartTab 及 reactionId 100% 动态同步，严禁静态残留不相干内容
 */

import React, { useMemo } from 'react'
import { ChemistryPanel } from '@/components/UI'
import type { NexusParams } from '../types'

interface ReactionPrincipleRightPanelProps {
  params: NexusParams
  chemistry: any
}

export const ReactionPrincipleRightPanel: React.FC<ReactionPrincipleRightPanelProps> = ({
  params,
  chemistry,
}) => {
  const { system, eaForward, eaReverse, boltzmannData, vantHoffData } = chemistry
  const { chartTab, inertGasMode } = params

  // 1. 依当前 chartTab 与体系动态提供专属化学量
  const quantities = useMemo(() => {
    // 反应体系基础热力学量
    const baseQuantities = [
      {
        label: '反应热 ΔH',
        value: system.deltaH,
        unit: 'kJ/mol',
        highlight: system.deltaH < 0 ? ('negative' as const) : ('positive' as const),
      },
    ]

    if (chartTab === 'energy-profile') {
      // 活化能与能量分布：监控活化能与活化分子占比
      return [
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
        ...(chemistry.isMultistep && chemistry.stepBarriers?.length > 1
          ? [
              {
                label: '第1步能垒 ΔEa1',
                value: chemistry.stepBarriers[0].ea,
                unit: 'kJ/mol',
                color: '#3B82F6',
              },
              {
                label: '第2步能垒 ΔEa2 (决速步)',
                value: chemistry.stepBarriers[1].ea,
                unit: 'kJ/mol',
                color: '#EF4444',
              },
            ]
          : []),
        ...baseQuantities,
        {
          label: '活化分子占比',
          value: `${boltzmannData.activatedFraction}%`,
          unit: '',
          color: '#EF4444',
        },
      ]
    }

    if (chartTab === 'le-chatelier') {
      // 勒夏特列平衡移动：监控温度、压强与即时平衡常数 Kc
      return [
        {
          label: '体系温度 T',
          value: params.temperature,
          unit: 'K',
          color: '#F59E0B',
        },
        {
          label: '体系总压 P',
          value: params.pressure,
          unit: 'atm',
          color: '#3B82F6',
        },
        ...baseQuantities,
        {
          label: '化学平衡常数 Kc',
          value: vantHoffData.currentKc,
          unit: '',
          color: '#10B981',
        },
      ]
    }

    if (chartTab === 'alpha-tp') {
      // 转化率 α-T-P：监控温度、压强、理论平衡转化率
      return [
        {
          label: '体系温度 T',
          value: params.temperature,
          unit: 'K',
          color: '#F59E0B',
        },
        {
          label: '体系总压 P',
          value: params.pressure,
          unit: 'atm',
          color: '#3B82F6',
        },
        ...baseQuantities,
        {
          label: '平衡转化率 α',
          value: `${chemistry.alphaTpData?.currentAlpha ?? 50}%`,
          unit: '',
          color: '#10B981',
        },
      ]
    }

    // lnK - 1/T 范特霍夫图：重点监控 1/T 与 ln K 线性参数
    const invT = +(1000 / params.temperature).toFixed(3)
    return [
      ...baseQuantities,
      {
        label: '千倍倒数 1000/T',
        value: invT,
        unit: 'K⁻¹',
        color: '#F59E0B',
      },
      {
        label: '平衡常数自然对数 ln K',
        value: vantHoffData.currentLnK,
        unit: '',
        color: '#3B82F6',
      },
      {
        label: '图像理论斜率 (-ΔH/R)',
        value: +((-system.deltaH * 1000) / 8.314).toFixed(0),
        unit: 'K',
        color: system.deltaH < 0 ? '#10B981' : '#EF4444',
      },
    ]
  }, [chartTab, system.deltaH, eaForward, eaReverse, boltzmannData.activatedFraction, vantHoffData.currentKc, vantHoffData.currentLnK, params.temperature, params.pressure, chemistry.alphaTpData])

  // 2. 依当前 chartTab 动态提供核心公式
  const formulas = useMemo(() => {
    const reactionFormula = {
      name: `当前探究体系：${system.name}`,
      latex: system.equation,
      note: `ΔH = ${system.deltaH} kJ/mol (${system.deltaH < 0 ? '放热反应' : '吸热反应'})`,
      level: 'core' as const,
    }

    if (chartTab === 'energy-profile') {
      return [
        reactionFormula,
        {
          name: '活化能与反应热关系式',
          latex: '\\Delta H = E_{a(\\text{正})} - E_{a(\\text{逆})}',
          note: '催化剂同等降低正逆活化能，故不改变 ΔH。',
          level: 'core' as const,
        },
        {
          name: '多步历程决速步判据',
          latex: 'E_a(\\text{决速步}) = \\max(\\Delta E_{a1}, \\Delta E_{a2}, \\dots)',
          note: '各基元反应中相对能垒最大（活化能最高）的一步决定全反应速率。',
          level: 'important' as const,
        },
      ]
    }

    if (chartTab === 'le-chatelier') {
      return [
        reactionFormula,
        {
          name: '勒夏特列移动方向判据',
          latex: 'Q_c < K_c \\Rightarrow \\text{正向移动}; \\quad Q_c > K_c \\Rightarrow \\text{逆向移动}',
          note: '外界条件改变导致浓度商 Qc 偏离平衡常数 Kc，系统自发趋向新平衡。',
          level: 'core' as const,
        },
        {
          name: '压强对气态平衡移动规律',
          latex: '\\Delta n_g = \\sum \\nu(\\text{气态产物}) - \\sum \\nu(\\text{气态反应物})',
          note: `当前反应 Δn_g = ${system.gasMolesDiff}。增大压强平衡向气体体积缩小的方向移动。`,
          level: 'important' as const,
        },
      ]
    }

    if (chartTab === 'alpha-tp') {
      return [
        reactionFormula,
        {
          name: '平衡转化率定义式',
          latex: '\\alpha(\\text{反应物}) = \\frac{\\Delta n(\\text{反应物})}{n_0(\\text{反应物})} \\times 100\\%',
          note: '转化率直接反映平衡移动的限度；放热反应升温 α 减小。',
          level: 'core' as const,
        },
        {
          name: '定一议二作图判据',
          latex: 'T_1 = T_2 \\implies \\alpha(P_2) > \\alpha(P_1) \\iff P_2 > P_1 \\;(\\Delta n_g < 0)',
          note: '固定同一温度作垂线，纵坐标转化率大者对应压强更大。',
          level: 'important' as const,
        },
      ]
    }

    // lnK - 1/T 范特霍夫公式
    return [
      reactionFormula,
      {
        name: '范特霍夫方程 (Van\'t Hoff)',
        latex: '\\ln K = -\\frac{\\Delta H}{R} \\cdot \\frac{1}{T} + C',
        note: 'ln K 与 1/T 呈线性关系，斜率严格由反应热 -ΔH/R 决定。',
        level: 'core' as const,
      },
      {
        name: '斜率与反应热符号关系',
        latex: '\\text{斜率 } k_{\\text{line}} = -\\frac{\\Delta H}{R} \\quad (R = 8.314\\text{ J/(mol}\\cdot\\text{K)})',
        note: system.deltaH < 0 ? '放热反应 ΔH < 0，斜率为正，直线向上倾斜' : '吸热反应 ΔH > 0，斜率为负，直线向下倾斜',
        level: 'important' as const,
      },
    ]
  }, [chartTab, system])

  // 3. 依当前 chartTab 动态提供高考要点与答题三段论模板
  const gaokaoPoints = useMemo(() => {
    if (chartTab === 'energy-profile') {
      return [
        {
          text: '【答题模板·催化剂本质】：催化剂改变反应历程，同等程度降低 Ea(正) 与 Ea(逆)，同等程度增大正逆反应速率，故平衡不移动，ΔH 与平衡常数 K 不变。',
          importance: 'gaokao' as const,
        },
        {
          text: '【决速步避坑】：在多步基元反应中，决速步由相对能垒 ΔEa = E(TS) - E(底物/中间体) 决定，绝非绝对最高势能点！',
          importance: 'core' as const,
        },
        {
          text: '【玻尔兹曼升温 vs 催化】：升温使分子能量分布变宽右移，Ea 门槛不变；加入催化剂使能量分布完全不变，Ea 门槛向左平移。',
          importance: 'hard' as const,
        },
      ]
    }

    if (chartTab === 'le-chatelier') {
      const inertPoint = inertGasMode === 'constant-v'
        ? '恒温恒容充入惰性气体：各反应组分浓度不变，正逆反应速率不变，平衡不移动。'
        : inertGasMode === 'constant-p'
        ? '恒温恒压充入惰性气体：容器体积扩大，各组分分压与浓度减小，相当于减压，平衡向气体分子数增大方向移动。'
        : '恒温恒容充惰性气体平衡不移动；恒温恒压充惰性气体相当于减压。'

      return [
        {
          text: '【答题模板·升温移动三段论】：① 升高温度正逆反应速率均增大；② 但吸热方向增大幅度大于放热方向 (v逆 > v正)；③ 平衡向吸热反应方向移动。',
          importance: 'gaokao' as const,
        },
        {
          text: `压强影响：当前体系气体计量数差 Δn_g = ${system.gasMolesDiff}，增大压强平衡向${system.gasMolesDiff < 0 ? '正向' : '逆向'}移动。`,
          importance: 'core' as const,
        },
        {
          text: inertPoint,
          importance: 'hard' as const,
        },
      ]
    }

    if (chartTab === 'alpha-tp') {
      return [
        {
          text: '【答题模板·定一议二破题】：作垂直于 T 轴的虚线（固定温度），读取不同压强曲线交点，结合正反应气体计量数判断 P 大小；作水平线（固定转化率）判断 T 与 P 相互制约。',
          importance: 'gaokao' as const,
        },
        {
          text: '【最佳催化温度】：实际化工生产中，升温虽使平衡转化率下降，但提高催化剂活性与反应速率，需在综合拐点确定最适宜温度。',
          importance: 'core' as const,
        },
        {
          text: '【两线相对高低】：加压使平衡向气体分子数缩小的方向移动，故高压线必定位于产物增加/转化率增大的上方。',
          importance: 'hard' as const,
        },
      ]
    }

    // lnK - 1/T 要点
    return [
      {
        text: '读图定反应热 ΔH：若图像中随 1/T 增大 lnK 增大（斜率 > 0），则 -ΔH/R > 0 即 ΔH < 0 (放热反应)；反之则为吸热反应。',
        importance: 'gaokao' as const,
      },
      {
        text: '平衡常数唯一决定因素：化学平衡常数 K 仅是温度 T 的函数，压强、浓度、催化剂的改变均不能改变 K 的值。',
        importance: 'core' as const,
      },
      {
        text: '图谱两线交点含义：两反应 ln K 曲线交点处，表示在该温度下两反应的平衡常数恰好相等。',
        importance: 'hard' as const,
      },
    ]
  }, [chartTab, system, inertGasMode])

  // 4. 依当前 chartTab 动态提供易错警示
  const warnings = useMemo(() => {
    if (chartTab === 'energy-profile') {
      return [
        {
          text: '【警示 1】：严禁混淆“活化能”与“反应热”：催化剂能降低活化能 Ea，但绝对不能改变反应热 ΔH！',
          level: 'danger' as const,
        },
        {
          text: '【警示 2】：升高温度能加快反应速率的原因是增加了活化分子百分数，而不是降低了活化能。',
          level: 'warning' as const,
        },
      ]
    }

    if (chartTab === 'le-chatelier') {
      return [
        {
          text: '【警示 1】：勒夏特列原理的“减弱”含义：平衡移动只能“减弱”改变，绝对不能“消除”或“翻转”外界变化。',
          level: 'danger' as const,
        },
        {
          text: '【警示 2】：固体或纯液体用量改变时，浓度视为常数，不能改变化学反应速率与平衡。',
          level: 'warning' as const,
        },
      ]
    }

    if (chartTab === 'alpha-tp') {
      return [
        {
          text: '【警示 1】：横坐标温度升高时，切忌看错吸放热符号：放热反应 (ΔH < 0) 升温曲线必然向下走。',
          level: 'danger' as const,
        },
        {
          text: '【警示 2】：压强仅对有气体参与且两边气态化学计量数不相等的可逆反应有平衡移动效应。',
          level: 'warning' as const,
        },
      ]
    }

    // lnK - 1/T 警示
    return [
      {
        text: '【警示 1】：横坐标陷阱：横坐标为 1/T，向右移动代表 1/T 增大，即温度 T 实际是在降低！看图切勿看反。',
        level: 'danger' as const,
      },
      {
        text: '【警示 2】：斜率公式单位：R = 8.314 J/(mol·K)，计算 ΔH 时注意 kJ 与 J 的 1000 倍数量级换算。',
        level: 'warning' as const,
      },
    ]
  }, [chartTab])

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <ChemistryPanel
        title={`反应原理大题图谱：${system.name}`}
        quantities={quantities}
        formulas={formulas}
        gaokaoPoints={gaokaoPoints}
        warnings={warnings}
      />
    </div>
  )
}

