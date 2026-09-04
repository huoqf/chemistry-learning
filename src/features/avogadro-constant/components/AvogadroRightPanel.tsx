import React, { useMemo } from 'react'
import { ChemistryPanel } from '@/components/UI'
import { renderNaText } from '@/utils'
import type { AvogadroParams, AvogadroResult } from '../types'

interface AvogadroRightPanelProps {
  params: AvogadroParams
  chemistry: AvogadroResult
}

export const AvogadroRightPanel: React.FC<AvogadroRightPanelProps> = ({
  params,
  chemistry,
}) => {
  const {
    trapCategory,
    stateItem,
    structureItem,
    electrolyteItem,
    redoxItem,
    amountValue,
    amountUnit,
    temperatureCondition,
    solutionVolume,
    solutionConcentration,
  } = params

  // 1. 输入条件物理量与输出微粒统计量双向联动
  const quantities = useMemo(() => {
    const list: any[] = []

    // A. 题设输入参数
    if (trapCategory === 'electrolyte-hydrolysis' && electrolyteItem !== 'NaHSO4-molten') {
      list.push({
        label: '输入溶液体积 V',
        value: `${solutionVolume.toFixed(1)}`,
        unit: 'L',
        color: '#0284C7',
      })
      list.push({
        label: '输入溶液浓度 c',
        value: `${solutionConcentration.toFixed(2)}`,
        unit: 'mol/L',
        color: '#0284C7',
      })
      list.push({
        label: '溶质总物质的量 n',
        value: `${(solutionVolume * solutionConcentration).toFixed(2)}`,
        unit: 'mol',
        color: '#10B981',
      })
    } else {
      list.push({
        label: '题设条件用量',
        value: `${amountValue}`,
        unit: amountUnit,
        color: '#0284C7',
      })
      list.push({
        label: '温度与压强环境',
        value: temperatureCondition === 'standard' ? '标况 (0℃)' : '常温 (25℃)',
        unit: chemistry.isStateGas ? `Vm=${chemistry.vmValue}L/mol` : '非气体',
        color: chemistry.isStateGas ? '#10B981' : '#EF4444',
      })
    }

    // B. 输出微粒统计量（真实值 vs 错预估陷阱值）
    chemistry.particleStats.forEach((stat) => {
      list.push({
        label: renderNaText(stat.label) as any,
        value: stat.actualMoles >= 100 ? `${stat.actualMoles.toFixed(0)}+` : stat.actualMoles.toFixed(2),
        unit: (
          <span className="inline-flex items-baseline gap-1">
            {renderNaText(stat.unit)}
            {stat.isTrap && (
              <span className="text-[11px] font-normal text-rose-600 ml-1">
                (错预估 {stat.theoreticalMoles.toFixed(2)} NA)
              </span>
            )}
          </span>
        ) as any,
        color: stat.isTrap ? '#EF4444' : '#10B981',
        highlight: stat.isTrap ? 'negative' : 'positive',
      })
    })

    return list
  }, [
    trapCategory,
    electrolyteItem,
    solutionVolume,
    solutionConcentration,
    amountValue,
    amountUnit,
    temperatureCondition,
    chemistry,
  ])

  // 2. 动态公式与反应方程式（100% 随物料与反应动态切换，拒绝静态残留）
  const dynamicFormulas = useMemo(() => {
    const list = [
      {
        name: '当前考点核心状态/成键/守恒式',
        latex: chemistry.formulaLatex,
        note: chemistry.correctAnswerSummary,
      },
    ]

    // 针对不同考点维度匹配第二基础定理公式
    if (trapCategory === 'state-volume') {
      list.push({
        name: '气体摩尔体积定义式',
        latex: 'n = \\frac{V}{V_m} \\quad (V_m = 22.4 \\text{ L/mol 仅适用于标况气体})',
        note: '注意非标况或标况下为固/液态的物质不能直接套用 22.4 L/mol！',
      })
    } else if (trapCategory === 'structure-bonds') {
      list.push({
        name: '阿伏加德罗微粒数换算式',
        latex: 'N = n \\cdot N_{\\text{A}} = \\frac{m}{M} \\cdot N_{\\text{A}}',
        note: '注意区分微粒为分子、离子、原子还是共价键/中子',
      })
    } else if (trapCategory === 'electrolyte-hydrolysis') {
      list.push({
        name: '物质的量浓度定义式与守恒',
        latex: 'n = c \\cdot V \\implies \\text{元素/物料守恒在电离与水解中恒成立}',
        note: '弱电解质部分电离，盐类微弱水解，离子数不等于溶质分子总数',
      })
    } else if (trapCategory === 'redox-electron') {
      list.push({
        name: '氧化还原电子转移数求和式',
        latex: 'n_e = n(\\text{变价元素}) \\cdot |\\Delta \\text{化合价}|',
        note: '歧化反应中同种元素升价与降价电子数相等，切勿重复累加',
      })
    } else {
      list.push({
        name: '五步秒杀解题思维链',
        latex: '\\text{审环境} \\to \\text{审状态} \\to \\text{审结构} \\to \\text{审过程} \\to \\text{审电子}',
        note: '遵循排查链，100% 避开高考 NA 选择题各类常见设陷',
      })
    }

    return list
  }, [chemistry.formulaLatex, chemistry.correctAnswerSummary, trapCategory])

  // 3. 针对性高危避坑警示卡（覆盖全部 20+ 个考点物料，100% 动态精准匹配）
  const dynamicWarnings = useMemo(() => {
    if (chemistry.substanceWarnings && chemistry.substanceWarnings.length > 0) {
      return chemistry.substanceWarnings
    }

    if (trapCategory === 'state-volume') {
      if (['SO3', 'HF', 'CCl4', 'H2O', 'CH3OH'].includes(stateItem)) {
        return [
          {
            text: `【致命状态陷阱】${stateItem} 标况/常温下属于非气体（固态/液态），绝对禁止使用 22.4 L/mol 盲目除算！`,
            level: 'danger' as const,
          },
          {
            text: `1 mol 真实 ${stateItem} 液体/固体体积仅约 18~90 mL（不到 22.4 L 的 0.5%）。`,
            level: 'warning' as const,
          },
        ]
      }
      return [
        {
          text: `${stateItem} 属于正常气体，在标况 (0℃, 101 kPa) 下可正常套用 Vm = 22.4 L/mol；常温 (25℃) 下 Vm ≈ 24.5 L/mol。`,
          level: 'info' as const,
        },
      ]
    }

    if (trapCategory === 'structure-bonds') {
      if (structureItem === 'SiO2') {
        return [
          {
            text: '【立体网状共价晶体】SiO₂ 中无独立分子！每个 Si 与 4 个 O 形成 4 个 Si-O 单键 ➔ 1 mol SiO₂ (60 g) 含 4 mol Si-O 共价键（非 2 mol！）。',
            level: 'danger' as const,
          },
          {
            text: '高考高频题设：60 g SiO₂ 晶体中含有的 Si-O 键数为 4 NA（1 mol Si 原子对应 4 mol Si-O 键）。',
            level: 'warning' as const,
          },
        ]
      }
      if (structureItem === 'graphite') {
        return [
          {
            text: '【石墨平面六元环均摊】石墨每个 C 与 3 个 C 成键，每个 C-C 键由 2 个碳共享 ➔ 1 mol C 对应 1.5 mol C-C 键 (12 g 石墨含 1.5 NA 键)。',
            level: 'danger' as const,
          },
          {
            text: '每个六元环实际占有碳原子数：6 × 1/3 = 2 个 C 原子。',
            level: 'warning' as const,
          },
        ]
      }
      if (structureItem === 'Na2O2') {
        return [
          {
            text: '【离子晶体陷阱】Na₂O₂ 由 Na⁺ 和 O₂²⁻ 构成，阴阳离子个数比为 1:2（非 2:2！）。',
            level: 'danger' as const,
          },
          {
            text: '1 mol Na₂O₂ 含有 2 mol Na⁺、1 mol O₂²⁻ 阴离子及 1 mol O-O 非极性共价键。',
            level: 'warning' as const,
          },
        ]
      }
      if (structureItem === 'P4') {
        return [
          {
            text: '【正四面体键数】白磷 (P₄) 为正四面体构型，4 个 P 顶点，6 条 P-P 棱键。',
            level: 'danger' as const,
          },
          {
            text: '1 mol P₄ 含有 6 mol P-P 共价键（31 g 白磷为 0.25 mol，含 1.5 NA 键）。',
            level: 'warning' as const,
          },
        ]
      }
      if (structureItem === 'S8') {
        return [
          {
            text: '【单质硫 8 元环】单质硫为 S₈ 皇冠状环，1 mol S₈ 分子含有 8 mol S-S 键；32 g 单质硫 (1 mol S) 含 1 NA 键。',
            level: 'warning' as const,
          },
        ]
      }
      if (structureItem === 'ice') {
        return [
          {
            text: '【冰氢键均摊】冰晶体中每个水分子形成 4 个氢键方向，由于 2 水共享 ➔ 均摊后 1 mol 冰 (18 g) 含 2 mol 氢键。',
            level: 'danger' as const,
          },
        ]
      }
      if (structureItem === 'T2O') {
        return [
          {
            text: '【氚水同位素】T₂O 摩尔质量为 22 g/mol（非 18 g/mol）；1 个 T₂O 含有 10 质子和 12 中子。',
            level: 'danger' as const,
          },
        ]
      }
      if (structureItem === 'D2O') {
        return [
          {
            text: '【重水同位素】D₂O 摩尔质量为 20 g/mol；1 个 D₂O 含有 10 个中子和 10 个质子。',
            level: 'danger' as const,
          },
        ]
      }
    }

    if (trapCategory === 'electrolyte-hydrolysis') {
      if (electrolyteItem === 'FeCl3') {
        return [
          {
            text: '【胶粒多分子聚集陷阱】Fe(OH)₃ 胶体微粒是成百上千个 Fe(OH)₃ 分子的聚集体，因此胶粒数远小于 0.1 NA！',
            level: 'danger' as const,
          },
          {
            text: '水解是可逆反应，Fe³⁺ 不能完全水解转化为 Fe(OH)₃。',
            level: 'warning' as const,
          },
        ]
      }
      if (electrolyteItem === 'NaHSO4-molten') {
        return [
          {
            text: '【熔融态离解陷阱】NaHSO₄ 熔融状态下仅电离为 Na⁺ 和 HSO₄⁻（生成 2 mol 离子，非 3 mol！）。',
            level: 'danger' as const,
          },
        ]
      }
      if (electrolyteItem === 'CH3COOH') {
        return [
          {
            text: '【弱电解质微弱电离】醋酸在水溶液中微弱电离，H⁺ 数目远小于 c·V·NA；但物料守恒 n(CH₃COOH) + n(CH₃COO⁻) = c·V 恒成立！',
            level: 'danger' as const,
          },
        ]
      }
      if (electrolyteItem === 'Na2CO3') {
        return [
          {
            text: '【分步水解阴离子增多】CO₃²⁻ + H₂O ⇌ HCO₃⁻ + OH⁻，1 个阴离子水解产生 2 个阴离子，使溶液中阴离子总数大于原溶质物质的量！',
            level: 'warning' as const,
          },
        ]
      }
    }

    if (trapCategory === 'redox-electron') {
      if (redoxItem === 'Cl2-NaOH') {
        return [
          {
            text: '【歧化反应陷阱】Cl₂ + 2NaOH = NaCl + NaClO + H₂O 为歧化反应，1 mol Cl₂ 完全反应仅转移 1 NA 电子（非 2 NA！）。',
            level: 'danger' as const,
          },
        ]
      }
      if (redoxItem === 'Cu-S') {
        return [
          {
            text: '【弱氧化剂变价】单质 S 氧化性弱，与 Cu 反应仅生成 Cu₂S（Cu 为 +1 价），1 mol Cu 反应转移 1 NA 电子（非 2 NA！）。',
            level: 'danger' as const,
          },
        ]
      }
      if (redoxItem === 'Na2O2-H2O') {
        return [
          {
            text: '【过氧化物歧化】2Na₂O₂ + 2H₂O = 4NaOH + O₂↑ 中 -1 价氧歧化，1 mol Na₂O₂ 转移 1 NA 电子，生成 0.5 NA 个 O₂。',
            level: 'danger' as const,
          },
        ]
      }
      if (redoxItem === 'NO2-N2O4-reversible') {
        return [
          {
            text: '【气体二聚平衡】2NO₂ ⇌ N₂O₄ 反应使气体分子总数减少，1 mol NO₂ 体系中分子总数小于 1 NA；但 N 原子总数恒为 1 NA。',
            level: 'danger' as const,
          },
        ]
      }
      if (redoxItem === 'SO2-O2-reversible') {
        return [
          {
            text: '【可逆反应限度】2SO₂ + O₂ ⇌ 2SO₃ 无法进行到底，生成 SO₃ 分子数与转移电子数均小于理论计算上限！',
            level: 'danger' as const,
          },
        ]
      }
      if (redoxItem === 'Fe-HNO3') {
        return [
          {
            text: '【变价金属完全氧化】足量稀硝酸具有强氧化性，将 Fe 完全氧化为 +3 价 Fe³⁺，1 mol Fe 转移 3 NA 电子。',
            level: 'warning' as const,
          },
        ]
      }
    }

    return [
      {
        text: '仔细核对环境、状态、结构与过程四要素，切忌直觉误判！',
        level: 'info' as const,
      },
    ]
  }, [chemistry.substanceWarnings, trapCategory, stateItem, structureItem, electrolyteItem, redoxItem])

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <ChemistryPanel
        title={renderNaText('阿伏加德罗常数 (N_A) 解题秘籍与粒子统计面板') as any}
        quantities={quantities}
        formulas={dynamicFormulas}
        gaokaoPoints={chemistry.keyPointAnalysis.map((text) => ({
          text: renderNaText(text) as any,
          importance: 'gaokao' as const,
        }))}
        warnings={dynamicWarnings.map((w) => ({
          ...w,
          text: renderNaText(w.text) as any,
        }))}
      />
    </div>
  )
}
