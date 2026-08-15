import { useMemo } from 'react'
import type {
  HessLawParams,
  HessGroupPreset,
  MoleculeBondPreset,
  EnergyProfileState,
} from '../types'

/** 预设盖斯定律反应组 */
export const HESS_PRESETS: HessGroupPreset[] = [
  {
    id: 'co-formation',
    title: '一氧化碳生成热推导 (C 不完全燃烧)',
    targetFormula: 'C(s) + ½O₂(g) = CO(g)',
    targetDeltaH: -110.5,
    explanation: 'C(s) 燃烧极易混入 CO₂，极难直接测定 CO 生成热。通过已知 C 完全燃烧与 CO 燃烧热代数消去 CO₂(g) 得到。',
    equations: [
      {
        id: 'eq-1',
        label: '① C(s) + O₂(g) = CO₂(g)',
        reactantsText: 'C(s) + O₂(g)',
        productsText: 'CO₂(g)',
        deltaH: -393.5,
        defaultK: 1,
      },
      {
        id: 'eq-2',
        label: '② 2CO(g) + O₂(g) = 2CO₂(g)',
        reactantsText: '2CO(g) + O₂(g)',
        productsText: '2CO₂(g)',
        deltaH: -566.0,
        defaultK: -0.5,
      },
    ],
  },
  {
    id: 'carbon-elimination',
    title: '高炉消碳反应与 CO₂ 资源化重整',
    targetFormula: 'CO₂(g) + C(s) = 2CO(g)',
    targetDeltaH: 172.5,
    explanation: '利用水煤气变换分步消去中间产物 H₂O(g) 与 H₂(g)，推导碳与 CO₂ 高温自发重整吸热。',
    equations: [
      {
        id: 'eq-1',
        label: '① C(s) + H₂O(g) = CO(g) + H₂(g)',
        reactantsText: 'C(s) + H₂O(g)',
        productsText: 'CO(g) + H₂(g)',
        deltaH: 131.3,
        defaultK: 1,
      },
      {
        id: 'eq-2',
        label: '② CO₂(g) + H₂(g) = CO(g) + H₂O(g)',
        reactantsText: 'CO₂(g) + H₂(g)',
        productsText: 'CO(g) + H₂O(g)',
        deltaH: 41.2,
        defaultK: 1,
      },
    ],
  },
  {
    id: 'water-phase-change',
    title: '水蒸气凝结与液态水生成热',
    targetFormula: 'H₂(g) + ½O₂(g) = H₂O(l)',
    targetDeltaH: -285.8,
    explanation: '结合气态水生成热与水蒸气液化潜热，推导燃烧热中生成 stable 状态 H₂O(l) 的焓变。',
    equations: [
      {
        id: 'eq-1',
        label: '① H₂(g) + ½O₂(g) = H₂O(g)',
        reactantsText: 'H₂(g) + ½O₂(g)',
        productsText: 'H₂O(g)',
        deltaH: -241.8,
        defaultK: 1,
      },
      {
        id: 'eq-2',
        label: '② H₂O(g) = H₂O(l)',
        reactantsText: 'H₂O(g)',
        productsText: 'H₂O(l)',
        deltaH: -44.0,
        defaultK: 1,
      },
    ],
  },
]

/** 预设分子键能统计数据 */
export const BOND_PRESETS: MoleculeBondPreset[] = [
  {
    id: 'h2-cl2-hcl',
    name: 'HCl 的形成反应',
    formula: 'H₂(g) + Cl₂(g) = 2HCl(g)',
    reactantBonds: [
      { name: 'H-H 键', bondEnergy: 436, count: 1 },
      { name: 'Cl-Cl 键', bondEnergy: 243, count: 1 },
    ],
    productBonds: [{ name: 'H-Cl 键', bondEnergy: 431, count: 2 }],
    calculatedDeltaH: -183,
    trapWarning: '基础分子：1 mol H₂ 含 1 mol H-H 键，2 mol HCl 含 2 mol H-Cl 键。',
  },
  {
    id: 'n2-h2-nh3',
    name: '合成氨反应',
    formula: 'N₂(g) + 3H₂(g) = 2NH₃(g)',
    reactantBonds: [
      { name: 'N≡N 氮氮三键', bondEnergy: 946, count: 1 },
      { name: 'H-H 键', bondEnergy: 436, count: 3 },
    ],
    productBonds: [{ name: 'N-H 键', bondEnergy: 391, count: 6 }],
    calculatedDeltaH: -92,
    trapWarning: '注意 N₂ 含有强化学键 N≡N 三键 (946 kJ/mol)；1 mol NH₃ 分子中含有 3 mol N-H 键，故 2 mol NH₃ 含有 6 mol N-H 键。',
  },
  {
    id: 'silicon-combustion',
    name: '晶体硅完全燃烧 (高频立体晶体陷阱)',
    formula: 'Si(s) + O₂(g) = SiO₂(s)',
    reactantBonds: [
      { name: 'Si-Si 键 (1mol 硅晶体)', bondEnergy: 222, count: 2 },
      { name: 'O=O 双键', bondEnergy: 498, count: 1 },
    ],
    productBonds: [{ name: 'Si-O 键 (1mol SiO₂)', bondEnergy: 460, count: 4 }],
    calculatedDeltaH: -898,
    trapWarning: '【高考陷阱！】1 mol 晶体硅（金刚石型正四面体）中仅含 2 mol Si-Si 键；1 mol SiO₂ 立体网状结构中 1 个 Si 原子与 4 个 O 原子成键，含 4 mol Si-O 键！',
  },
  {
    id: 'p4-combustion',
    name: '白磷完全燃烧生成 P₄O₁₀ (正四面体陷阱)',
    formula: 'P₄(s) + 5O₂(g) = P₄O₁₀(s)',
    reactantBonds: [
      { name: 'P-P 键 (1mol P₄)', bondEnergy: 198, count: 6 },
      { name: 'O=O 键', bondEnergy: 498, count: 5 },
    ],
    productBonds: [
      { name: 'P-O 桥键 (1mol P₄O₁₀)', bondEnergy: 360, count: 12 },
      { name: 'P=O 顶键 (1mol P₄O₁₀)', bondEnergy: 585, count: 4 },
    ],
    calculatedDeltaH: -2982,
    trapWarning: '【高考顶级陷阱！】1 mol P₄ (正四面体) 中含有 6 mol P-P 键！1 mol P₄O₁₀ 中含有 12 mol P-O 单键和 4 mol P=O 双键！',
  },
]

/** 默认反应高程数据 */
export const DEFAULT_ENERGY_PROFILE: EnergyProfileState = {
  reactantEnergy: 150, // kJ/mol
  productEnergy: 60, // kJ/mol
  uncatalyzedEa: 240, // 正反应活化能 = 240 - 150 = 90
  catalyzedEaStep1: 190, // 第一步能垒 Peak1
  intermediateEnergy: 120, // 中间体能谷
  catalyzedEaStep2: 175, // 第二步能垒 Peak2
}

export function useHessLawChemistry(params: HessLawParams) {
  // 1. 盖斯定律叠加计算
  const currentHessGroup = useMemo(() => {
    const idx = Math.max(0, Math.min(params.hessGroupIndex, HESS_PRESETS.length - 1))
    return HESS_PRESETS[idx] || HESS_PRESETS[0]
  }, [params.hessGroupIndex])

  const hessCalculated = useMemo(() => {
    let totalDeltaH = 0
    const coeffs = [params.k1, params.k2]
    const stepsInfo = currentHessGroup.equations.map((eq, idx) => {
      const k = coeffs[idx] ?? eq.defaultK
      const stepH = k * eq.deltaH
      totalDeltaH += stepH
      return {
        equation: eq,
        k,
        stepH,
      }
    })

    const isMatchTarget = Math.abs(totalDeltaH - currentHessGroup.targetDeltaH) < 0.1

    return {
      totalDeltaH,
      stepsInfo,
      isMatchTarget,
    }
  }, [currentHessGroup, params.k1, params.k2])

  // 2. 键能计算
  const currentBondPreset = useMemo(() => {
    const idx = Math.max(0, Math.min(params.bondMoleculeIndex, BOND_PRESETS.length - 1))
    return BOND_PRESETS[idx] || BOND_PRESETS[0]
  }, [params.bondMoleculeIndex])

  const bondCalculated = useMemo(() => {
    let reactantEnergySum = 0
    currentBondPreset.reactantBonds.forEach((b) => {
      reactantEnergySum += b.bondEnergy * b.count
    })

    let productEnergySum = 0
    currentBondPreset.productBonds.forEach((b) => {
      productEnergySum += b.bondEnergy * b.count
    })

    const deltaH = reactantEnergySum - productEnergySum

    return {
      reactantEnergySum,
      productEnergySum,
      deltaH,
    }
  }, [currentBondPreset])

  // 3. 反应历程与活化能高程计算
  const energyProfile = useMemo(() => {
    const { reactantEnergy, productEnergy, uncatalyzedEa, catalyzedEaStep1, catalyzedEaStep2, intermediateEnergy } =
      DEFAULT_ENERGY_PROFILE

    const deltaH = productEnergy - reactantEnergy // 放热反应 < 0
    const eaForwardUncat = uncatalyzedEa - reactantEnergy // 正反应活化能
    const eaReverseUncat = uncatalyzedEa - productEnergy // 逆反应活化能

    // 催化下两步活化能
    const eaForwardCatStep1 = catalyzedEaStep1 - reactantEnergy
    const eaForwardCatStep2 = catalyzedEaStep2 - intermediateEnergy
    const maxCatEa = Math.max(eaForwardCatStep1, eaForwardCatStep2) // 决速步活化能

    return {
      reactantEnergy,
      productEnergy,
      deltaH,
      eaForwardUncat,
      eaReverseUncat,
      uncatalyzedPeak: uncatalyzedEa,
      catalyzedPeak1: catalyzedEaStep1,
      catalyzedPeak2: catalyzedEaStep2,
      intermediateEnergy,
      eaForwardCatStep1,
      eaForwardCatStep2,
      maxCatEa,
    }
  }, [])

  return {
    currentHessGroup,
    hessCalculated,
    currentBondPreset,
    bondCalculated,
    energyProfile,
  }
}

export type UseHessLawChemistryReturn = ReturnType<typeof useHessLawChemistry>
