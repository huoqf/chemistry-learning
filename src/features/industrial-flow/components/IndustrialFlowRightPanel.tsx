/**
 * src/features/industrial-flow/components/IndustrialFlowRightPanel.tsx
 * 母题七：无机工艺流程与沉淀调 pH 工具 - 右屏展示面板
 */

import React from 'react'
import { ChemistryPanel } from '@/components/UI'
import type { IndustrialFlowChemistry, IndustrialFlowParams } from '../types'
import type { GaokaoModelNode } from '@/data/gaokaoModels'

interface IndustrialFlowRightPanelProps {
  chemistry: IndustrialFlowChemistry
  params: IndustrialFlowParams
  model?: GaokaoModelNode
}

export const IndustrialFlowRightPanel: React.FC<IndustrialFlowRightPanelProps> = ({
  chemistry,
  params,
}) => {
  const { pH, reagent } = params
  const {
    ions,
    safePhRange,
    isPhInSafeRange,
    isOxidized,
  } = chemistry

  // 1. 动态生成化学量列表
  const quantities = [
    {
      label: '溶液当前 pH',
      value: `${pH.toFixed(1)}`,
      unit: '',
      color: isPhInSafeRange ? 'emerald' : 'amber',
      description: isPhInSafeRange
        ? `处于最佳沉淀区间 [${safePhRange[0]} ~ ${safePhRange[1]}]`
        : `安全区间为 [${safePhRange[0]} ~ ${safePhRange[1]}]`,
    },
    ...ions.map((ion) => ({
      label: `${ion.name} (${ion.symbol})`,
      value: ion.cCurrent < 1e-4 ? ion.cCurrent.toExponential(2) : `${ion.cCurrent.toFixed(3)}`,
      unit: 'mol/L',
      color: ion.precipitateRatio > 95 ? 'amber' : 'blue',
      description: `沉淀率: ${ion.precipitateRatio}% (完全沉淀 pH=${ion.pHEnd})`,
    })),
  ]

  // 2. 动态生成 Katex 公式列表 (符合 Formula 接口: { name, latex, note })
  const formulas = [
    ...(params.systemId === 'fe-al-mn'
      ? [
          {
            name: '软锰矿还原酸浸反应式 (加入 Fe²⁺ 还原剂)',
            latex: 'MnO_2 + 2Fe^{2+} + 4H^+ = Mn^{2+} + 2Fe^{3+} + 2H_2O',
            note: '高考必考：MnO₂ 不溶于稀 H₂SO₄，必须加入 Fe²⁺/草酸/H₂O₂ 将 +4 价 Mn 还原为 Mn²⁺ 浸出',
          },
        ]
      : params.systemId === 'fe-cu-zn'
      ? [
          {
            name: '锌粉置换深度除铜反应式',
            latex: 'Zn + Cu^{2+} = Zn^{2+} + Cu\\downarrow',
            note: '调 pH 沉淀铁铝后，加入过量锌粉置换除去溶液中残余的 Cu²⁺ 重金属杂质',
          },
        ]
      : params.systemId === 'ti-fe'
      ? [
          {
            name: '铁屑还原反应式 (逆向思维必考)',
            latex: '2Fe^{3+} + Fe = 3Fe^{2+}',
            note: '加入铁屑将 Fe³⁺ 还原为 Fe²⁺，防止 Fe³⁺ 水解混入后续 H₂TiO₃ 沉淀降低纯度',
          },
          {
            name: '加热稀释水解制钛酸反应式',
            latex: 'TiOSO_4 + 2H_2O \\stackrel{\\Delta}{=} H_2TiO_3\\downarrow + H_2SO_4',
            note: '钛酰离子 TiO²⁺ 强烈水解生成 H₂TiO₃ (钛酸) 沉淀，煅烧即得 TiO₂ 钛白粉',
          },
        ]
      : params.systemId === 'ni-co-li'
      ? [
          {
            name: '三元锂电池 H₂O₂ 还原酸浸反应式',
            latex: '2LiCoO_2 + H_2O_2 + 3H_2SO_4 = 2CoSO_4 + Li_2SO_4 + O_2\\uparrow + 4H_2O',
            note: 'H₂O₂ 作为还原剂将高价 Co(III)/Ni(III) 还原为 +2 价可溶性硫酸盐',
          },
          {
            name: '加 NaF 沉淀除 Ca²⁺/Mg²⁺ 反应式',
            latex: 'Mg^{2+} + 2F^- = MgF_2\\downarrow \\quad (K_{sp} = 1.8\\times 10^{-11})',
            note: '加入 NaF 生成 MgF₂/CaF₂ 难溶氟化物沉淀除去钙镁杂质',
          },
        ]
      : [
          {
            name: '草酸铵沉淀分离 Ca²⁺/Mg²⁺ 反应式',
            latex: 'Ca^{2+} + C_2O_4^{2-} = CaC_2O_4\\downarrow',
            note: '利用 Ksp(CaC₂O₄) 远小于草酸镁的性质，优先沉淀 Ca²⁺ 实现 Ca/Mg 经典分离',
          },
        ]),
    {
      name: '沉淀完全 pH 求解公式',
      latex: 'pOH = -\\lg c(OH^-) = \\frac{\\lg K_{sp} - \\lg(10^{-5})}{n}',
      note: '高考规定离子浓度 c ≤ 10⁻⁵ mol/L 即认为沉淀完全',
    },
    {
      name: '调 pH 试剂反应 (不增杂原则)',
      latex:
        reagent === 'MnO'
          ? 'MnO + 2H^+ = Mn^{2+} + H_2O'
          : reagent === 'CuO'
          ? 'CuO + 2H^+ = Cu^{2+} + H_2O'
          : reagent === 'ZnO'
          ? 'ZnO + 2H^+ = Zn^{2+} + H_2O'
          : reagent === 'MgO'
          ? 'MgO + 2H^+ = Mg^{2+} + H_2O'
          : reagent === 'Na2CO3'
          ? 'CO_3^{2-} + 2H^+ = H_2O + CO_2\\uparrow'
          : reagent === 'CaCO3'
          ? 'CaCO_3 + 2H^+ = Ca^{2+} + H_2O + CO_2\\uparrow'
          : 'H^+ + OH^- = H_2O',
      note: `使用 ${reagent} 消耗 H⁺ 提高 pH，引入的阳离子恰好为主产物离子，不增难除杂质。`,
    },
  ]

  // 3. 高考要点总结 (符合 GaokaoPoint 接口: { text, importance })
  const gaokaoPoints = [
    ...(params.systemId === 'ti-fe'
      ? [
          {
            text: '【钛铁矿还原】：为什么加入铁屑？因为 Fe³⁺ 极易水解混入 H₂TiO₃ 沉淀降低钛白粉纯度，加 Fe 还原为 Fe²⁺ 可留在滤液中结晶绿矾。',
            importance: 'gaokao' as const,
          },
        ]
      : params.systemId === 'ni-co-li'
      ? [
          {
            text: '【锂电池酸浸】：H₂O₂ 在此反应中作“还原剂”（非氧化剂），将高价 Co/Ni 还原为溶于水的 +2 价离子。',
            importance: 'gaokao' as const,
          },
        ]
      : [
          {
            text: '【还原酸浸机理】：MnO₂ 不溶于稀硫酸，必须在酸性条件加入还原剂（如 FeSO₄、草酸、H₂O₂）将 MnO₂ 还原为 Mn²⁺。',
            importance: 'gaokao' as const,
          },
        ]),
    {
      text: '【不增杂原则】：调 pH 除杂需加入目标金属的氧化物、氢氧化物或碳酸盐（如 ZnO, CuO, MnO, MgO）。',
      importance: 'gaokao' as const,
    },
    {
      text: '【深度除杂】：调 pH 无法除去 Ca²⁺/Mg²⁺ 及同价态重金属，加入 NaF 可使 Ca²⁺/Mg²⁺ 转化为 MgF₂/CaF₂ 沉淀；加 Zn 粉置换 Cu²⁺。',
      importance: 'hard' as const,
    },
    {
      text: '【无水乙醇洗涤】：洗去晶体表面杂质；减少晶体在水中的溶解损耗；无水乙醇易挥发便于快速干燥。',
      importance: 'hard' as const,
    },
    {
      text: '【洗涤检验】：取最后一次洗涤滤液，滴加检验试剂（如 BaCl₂ 检验 SO₄²⁻，或 AgNO₃ 检验 Cl⁻），若无沉淀说明洗净。',
      importance: 'basic' as const,
    },
    {
      text: '【趁热过滤】：防止目标难溶物（如 KNO₃ 或 CaSO₄）随温度降低在滤纸上结晶析出造成损失或降低纯度。',
      importance: 'basic' as const,
    },
  ]

  // 4. 易错警示 (符合 WarningItem 接口: { text, level })
  const warnings = [
    ...(!isOxidized
      ? [
          {
            text: '警示：未加充分 H₂O₂，Fe²⁺ 无法在 low pH 下沉淀，调高 pH 会导致目标离子共沉淀损失！',
            level: 'danger' as const,
          },
        ]
      : []),
    ...(!isPhInSafeRange
      ? [
          {
            text:
              pH < safePhRange[0]
                ? '警示：当前 pH 偏低，杂质 Fe³⁺/Al³⁺ 未达到 10⁻⁵ mol/L 完全沉淀标准！'
                : '警示：当前 pH 偏高，主目标离子已开始沉淀析出，或 Al(OH)₃ 发生两性溶解！',
            level: 'warning' as const,
          },
        ]
      : []),
  ]

  return (
    <div className="w-full h-full p-4 overflow-y-auto bg-white border-l border-slate-200">
      <ChemistryPanel
        quantities={quantities}
        formulas={formulas}
        gaokaoPoints={gaokaoPoints}
        warnings={warnings}
      />
    </div>
  )
}
