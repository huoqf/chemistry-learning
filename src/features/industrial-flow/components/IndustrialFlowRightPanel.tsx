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
    {
      name: '沉淀完全 pH 求解公式',
      latex: 'pOH = -\\lg c(OH^-) = \\frac{\\lg K_{sp} - \\lg(10^{-5})}{n}',
      note: '高考规定离子浓度 c ≤ 10⁻⁵ mol/L 即认为沉淀完全',
    },
    {
      name: '双氧水氧化 Fe²⁺ 反应式',
      latex: '2Fe^{2+} + H_2O_2 + 2H^+ = 2Fe^{3+} + 2H_2O',
      note: isOxidized
        ? '已充分氧化：Fe³⁺ 的 Ksp (4×10⁻³⁸) 远小于 Fe²⁺，可在低 pH 下优先沉淀分离'
        : '氧化不足：Fe²⁺ Ksp 较大，调 pH 时会造成主离子共沉淀损失！',
    },
    {
      name: '调 pH 试剂反应 (不增杂原则)',
      latex: reagent === 'MnO'
        ? 'MnO + 2H^+ = Mn^{2+} + H_2O'
        : reagent === 'CuO'
        ? 'CuO + 2H^+ = Cu^{2+} + H_2O'
        : reagent === 'CaCO3'
        ? 'CaCO_3 + 2H^+ = Ca^{2+} + H_2O + CO_2\\uparrow'
        : 'H^+ + OH^- = H_2O',
      note: `使用 ${reagent} 消耗 H⁺ 提高 pH，引入的阳离子恰好为主产物离子，不增难除杂质。`,
    },
  ]

  // 3. 高考要点总结 (符合 GaokaoPoint 接口: { text, importance })
  const gaokaoPoints = [
    {
      text: '【不增杂原则】：调 pH 除杂需加入目标金属的氧化物、氢氧化物或碳酸盐（如 CuO, MnO, Fe(OH)₃）。',
      importance: 'gaokao' as const,
    },
    {
      text: '【氧化优先】：Fe²⁺ 沉淀 pH 较高 (7.7~9.7)，加入 H₂O₂ 先氧化为 Fe³⁺，可在 pH 3.2 下完全沉淀与 Mn²⁺/Cu²⁺ 分离。',
      importance: 'core' as const,
    },
    {
      text: '【洗涤检验】：取最后一次洗涤滤液，滴加检验试剂（如 BaCl₂ 检验 SO₄²⁻，或 AgNO₃ 检验 Cl⁻），若无沉淀说明洗净。',
      importance: 'hard' as const,
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
