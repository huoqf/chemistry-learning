import React from 'react'
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
  // 根据当前物料生成 100% 动态精准匹配的易错警示卡（解决静态残留 Bug）
  const dynamicWarnings = React.useMemo(() => {
    if (chemistry.substanceWarnings && chemistry.substanceWarnings.length > 0) {
      return chemistry.substanceWarnings
    }

    const { trapCategory, stateItem, structureItem, electrolyteItem, redoxItem } = params

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
          text: `${stateItem} 属于正常气体，在标况 (0℃, 101 kPa) 下可正常套用 V_m = 22.4 L/mol；常温 (25℃) 下 V_m ≈ 24.5 L/mol。`,
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
            text: '高考高频题设：60 g SiO₂ 晶体中含有的 Si-O 键数为 4 N_A（1 mol Si 原子对应 4 mol Si-O 键）。',
            level: 'warning' as const,
          },
        ]
      }
      if (structureItem === 'graphite') {
        return [
          {
            text: '【石墨平面六元环均摊】石墨每个 C 与 3 个 C 成键，每个 C-C 键由 2 个碳共享 ➔ 1 mol C 对应 1.5 mol C-C 键 (12 g 石墨含 1.5 N_A 键)。',
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
          {
            text: 'Na₂O₂ 与水/CO₂ 反应为歧化反应，1 mol Na₂O₂ 转移 1 N_A 电子，生成 0.5 N_A 个 O₂。',
            level: 'danger' as const,
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
            text: '1 mol P₄ 含有 6 mol P-P 共价键（31 g 白磷为 0.25 mol，含 1.5 N_A 键）。',
            level: 'warning' as const,
          },
        ]
      }
      if (structureItem === 'S8') {
        return [
          {
            text: '【单质硫 8 元环】单质硫为 S₈ 皇冠状环，1 mol S₈ 分子含有 8 mol S-S 键；32 g 单质硫含 1 N_A 键。',
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
    }

    if (trapCategory === 'electrolyte-hydrolysis') {
      if (electrolyteItem === 'FeCl3') {
        return [
          {
            text: '【胶粒多分子聚集陷阱】Fe(OH)₃ 胶体微粒是成百上千个 Fe(OH)₃ 分子的聚集体，因此胶粒数远小于 0.1 N_A！',
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
    }

    if (trapCategory === 'redox-electron') {
      if (redoxItem === 'Cu-S') {
        return [
          {
            text: '【弱氧化剂变价】S 弱氧化剂与 Cu 反应生成 Cu₂S（Cu 为 +1 价），1 mol Cu 反应转移 1 N_A 电子。',
            level: 'danger' as const,
          },
        ]
      }
    }

    return [
      {
        text: '仔细核对环境、状态、结构与过程四要素，切忌直觉误判！',
        level: 'warning' as const,
      },
    ]
  }, [chemistry.substanceWarnings, params])

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <ChemistryPanel
        title={renderNaText('阿伏加德罗常数 (N_A) 解题秘籍与粒子统计面板') as any}
        quantities={chemistry.particleStats.map((stat) => ({
          label: renderNaText(stat.label) as any,
          value: stat.actualMoles.toFixed(2),
          unit: (
            <span className="inline-flex items-baseline gap-1">
              {renderNaText(stat.unit)}
              {stat.isTrap && !chemistry.isStateGas && (
                <span className="text-[11px] font-normal text-rose-600 ml-1">
                  ({renderNaText(stat.trapExplanation || `错预估 ${stat.theoreticalMoles.toFixed(2)} N_A`)})
                </span>
              )}
            </span>
          ) as any,
          color: stat.isTrap && !chemistry.isStateGas ? '#EF4444' : '#10B981',
          highlight: stat.isTrap && !chemistry.isStateGas ? 'negative' : 'positive',
        }))}
        formulas={[
          {
            name: '气体摩尔体积定义式',
            latex: 'n = \\frac{V}{V_m} \\quad (V_m = 22.4 \\text{ L/mol 仅适用于标况气体})',
            note: '注意非标况或标况下为固/液态的物质不能直接套用 22.4 L/mol！',
          },
          {
            name: '阿伏加德罗常数微粒数',
            latex: 'N = n \\cdot N_{\\text{A}} \\quad (N_{\\text{A}} \\approx 6.02 \\times 10^{23} \\text{ mol}^{-1})',
            note: '注意区分微粒为分子、离子、原子还是共价键/中子',
          },
          {
            name: '氧化还原电子转移数',
            latex: 'n_e = n(\\text{变价元素}) \\cdot |\\Delta \\text{化合价}|',
            note: '歧化反应 (Cl₂, Na₂O₂) 1 mol 仅转移 1 mol 电子',
          },
        ]}
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
