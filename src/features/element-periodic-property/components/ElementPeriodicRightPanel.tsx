import React, { useMemo } from 'react'
import { ChemistryPanel } from '@/components/UI'
import type { ElementPeriodicParams } from '../types'
import { useElementPeriodicChemistry } from '../hooks/useElementPeriodicChemistry'

interface ElementPeriodicRightPanelProps {
  params: ElementPeriodicParams
  chemistry: ReturnType<typeof useElementPeriodicChemistry>
}

export const ElementPeriodicRightPanel: React.FC<ElementPeriodicRightPanelProps> = ({
  params,
  chemistry,
}) => {
  const { currentElement, stepIonizationAnalysis } = chemistry

  // 根据当前探究维度 (exploreMode) 100% 动态生成精准匹配的公式区
  const dynamicFormulas = useMemo(() => {
    switch (params.exploreMode) {
      case 'orbital-config':
        return [
          {
            name: '核外电子能级分布与容量',
            latex: 'N(\\text{max}) = 2n^2, \\quad l \\text{ 轨容量}: s(2), p(6), d(10)',
            condition: '泡利原理：单轨道最多 2 电子且自旋相反',
          },
          {
            name: '洪特规则半/全充满能量最低',
            latex: 'E(\\text{d}^5, \\text{d}^{10}) < E(\\text{d}^4, \\text{d}^9)',
            condition: '全充满或半充满状态能量最低，如 Cr: 3d⁵ 4s¹, Cu: 3d¹⁰ 4s¹',
          },
        ]
      case 'ion-energy':
        return [
          {
            name: '第一电离能反常排序 (IIA/IIIA, VA/VIA)',
            latex: 'I_1(\\text{Be}) > I_1(\\text{B}), \\quad I_1(\\text{N}) > I_1(\\text{O}); \\quad I_1(\\text{Mg}) > I_1(\\text{Al}), \\quad I_1(\\text{P}) > I_1(\\text{S})',
            condition: '同周期第一电离能总体增大，但全充满/半充满状态能量稳定出现反常折角',
          },
        ]
      case 'step-ion-energy':
        return [
          {
            name: '逐级电离能突跃与价电子数关系',
            latex: 'I_1 < I_2 < \\dots < I_n \\ll I_{n+1}',
            condition: '剥离第 n+1 个电子时跨越内层，需克服强大有效核电荷，突跃倍率 reveal 价电子数为 n',
          },
        ]
      case 'radius-matrix':
        return [
          {
            name: '等电子体微粒半径比较律',
            latex: 'r(\\text{O}^{2-}) > r(\\text{F}^-) > r(\\text{Na}^+) > r(\\text{Mg}^{2+}) > r(\\text{Al}^{3+})',
            condition: '电子层结构相同时，核电荷数 Z 越大，有效核电荷吸引越强，半径越小',
          },
        ]
      case 'inference-nexus':
        return [
          {
            name: '位-构-性三角演绎关系',
            latex: '\\text{位置 (周期/族)} \\iff \\text{结构 (价电子排布)} \\iff \\text{性质 (电离能/电负性/半径)}',
            condition: '高考压轴大题逻辑核心：由特征条件推出结构与元素身份，进而演绎性质',
          },
        ]
      default:
        return []
    }
  }, [params.exploreMode])

  // 根据当前探究维度动态生成高考要点
  const dynamicGaokaoPoints = useMemo(() => {
    switch (params.exploreMode) {
      case 'orbital-config':
        return [
          {
            text: '高考压轴点 1：构造原理与能量交错（4s 优先填充，失电子时也优先失去 4s 电子）。',
            importance: 'gaokao' as const,
          },
          {
            text: '高考压轴点 2：洪特规则特例 (Cr: 3d⁵4s¹, Cu: 3d¹⁰4s¹) 在排布式填空中极高频考查。',
            importance: 'core' as const,
          },
        ]
      case 'ion-energy':
        return [
          {
            text: '高考压轴点 1：同周期第一电离能呈增大趋势，但 Be>B, Mg>Al, N>O, P>S 两处反常必考！',
            importance: 'gaokao' as const,
          },
          {
            text: '高考压轴点 2：第一电离能最小的非金属元素与电负性最大的元素 (F, 4.0) 区别。',
            importance: 'hard' as const,
          },
        ]
      case 'step-ion-energy':
        return [
          {
            text: '高考压轴点：通过 I_n 突跃倍数（如 I₂/I₁ ≈ 9.2）判定元素最高正价与最外层电子数。',
            importance: 'gaokao' as const,
          },
        ]
      case 'radius-matrix':
        return [
          {
            text: '高考压轴点：10e/18e 离子半径三看口诀——一看电子层数、二看核电荷数、三看电子数。',
            importance: 'core' as const,
          },
        ]
      case 'inference-nexus':
      default:
        return [
          {
            text: '高考压轴点：短周期元素 p 轨电子数等于 s 轨电子数 (O: 4=4; Mg: 6=6; Ar: 12=6 不适用短周期)。',
            importance: 'gaokao' as const,
          },
        ]
    }
  }, [params.exploreMode])

  // 根据当前探究维度动态生成避坑警告
  const dynamicWarnings = useMemo(() => {
    switch (params.exploreMode) {
      case 'orbital-config':
        return [
          {
            text: '⚠️ 易错坑点：写价电子排布式时，过渡元素须包含 3d 与 4s 轨道（如 Fe 为 3d⁶4s²，不能漏掉 3d）。',
            level: 'danger' as const,
          },
          {
            text: '⚠️ 易错坑点：核外电子排布式、价电子排布式与轨道表示图（方框图）概念严禁混淆。',
            level: 'warning' as const,
          },
        ]
      case 'ion-energy':
        return [
          {
            text: '⚠️ 易错坑点：第二电离能 I₂ 反常位置会发生平移（如 I₂(Li) > I₂(Be)），不可僵化套用 I₁ 规律。',
            level: 'danger' as const,
          },
        ]
      case 'step-ion-energy':
        return [
          {
            text: '⚠️ 易错坑点：计算逐级电离能差值时，须关注“突跃发生在哪一步”，倍数 > 4~5 倍即为跨层标志。',
            level: 'info' as const,
          },
        ]
      case 'radius-matrix':
        return [
          {
            text: '⚠️ 易错坑点：比较微粒半径时，切记阳离子半径远小于其对应原子半径 (如 r(Na⁺) < r(Na))。',
            level: 'warning' as const,
          },
        ]
      case 'inference-nexus':
      default:
        return [
          {
            text: '⚠️ 易错坑点：推断题注意审清是“短周期元素”还是“前四周期元素”，避免遗漏过渡元素。',
            level: 'danger' as const,
          },
        ]
    }
  }, [params.exploreMode])

  // 动态化学量与数据统计（精准响应所选元素与维度）
  const quantities = useMemo(() => {
    return [
      {
        label: '当前选中元素',
        value: `${currentElement.symbol} (${currentElement.name})`,
        unit: `Z = ${currentElement.z}`,
      },
      {
        label: '价电子排布式',
        value: currentElement.outerConfig,
        unit: `${currentElement.block.toUpperCase()} 区`,
      },
      {
        label: '基态未成对电子数',
        value: currentElement.unpairedElectrons,
        unit: '个',
      },
      {
        label: '第一电离能 I₁',
        value: currentElement.firstIonization,
        unit: 'kJ/mol',
      },
      {
        label: '最高突跃倍率',
        value: stepIonizationAnalysis.ratios[stepIonizationAnalysis.valanceCountPredicted - 1]
          ? `×${stepIonizationAnalysis.ratios[stepIonizationAnalysis.valanceCountPredicted - 1]}`
          : '基态无突跃',
        unit: `(价电子数: ${stepIonizationAnalysis.valanceCountPredicted})`,
      },
    ]
  }, [currentElement, stepIonizationAnalysis])

  return (
    <ChemistryPanel
      title="位-构-性与电子排布剖析"
      formulas={dynamicFormulas}
      gaokaoPoints={dynamicGaokaoPoints}
      warnings={dynamicWarnings}
      quantities={quantities}
    />
  )
}
