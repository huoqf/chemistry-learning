import { useMemo } from 'react'

export interface ReactionModelInfo {
  id: number
  name: string
  equationTex: string
  equationPlain: string
  oxidant: string          // 氧化剂
  reductant: string        // 还原剂
  oxProduct: string       // 氧化产物
  redProduct: string      // 还原产物
  transferredElectrons: number // 基准转移电子数 n(e-)
  elements: {
    oxidized: {
      symbol: string
      fromValence: number
      toValence: number
      delta: number
      count: number
    }
    reduced: {
      symbol: string
      fromValence: number
      toValence: number
      delta: number
      count: number
    }
    spectator?: {
      symbol: string
      valence: number
      role: string
      count: number
    }
  }
  microShells?: {
    reductant: { symbol: string; shells: number[]; finalShells: number[]; charge: string }
    oxidant: { symbol: string; shells: number[]; finalShells: number[]; charge: string }
  }
  examTips: string
}

export const REACTION_MODELS: ReactionModelInfo[] = [
  {
    id: 0,
    name: 'Na与Cl₂生成NaCl (离子键与电子层)',
    equationTex: '2\\text{Na} + \\text{Cl}_2 \\xlongequal{\\text{点燃}} 2\\text{NaCl}',
    equationPlain: '2Na + Cl₂ = 2NaCl',
    oxidant: 'Cl₂',
    reductant: 'Na',
    oxProduct: 'NaCl (Na⁺)',
    redProduct: 'NaCl (Cl⁻)',
    transferredElectrons: 2,
    elements: {
      oxidized: { symbol: 'Na', fromValence: 0, toValence: 1, delta: 1, count: 2 },
      reduced: { symbol: 'Cl', fromValence: 0, toValence: -1, delta: -1, count: 2 },
    },
    microShells: {
      reductant: { symbol: 'Na', shells: [2, 8, 1], finalShells: [2, 8], charge: '+' },
      oxidant: { symbol: 'Cl', shells: [2, 8, 7], finalShells: [2, 8, 8], charge: '-' },
    },
    examTips: 'Na失去最外层1个电子，Cl得到1个电子形成8电子稳定结构，依靠静电作用形成离子键。',
  },
  {
    id: 1,
    name: 'Zn与CuSO₄置换反应',
    equationTex: '\\text{Zn} + \\text{CuSO}_4 = \\text{ZnSO}_4 + \\text{Cu}',
    equationPlain: 'Zn + CuSO₄ = ZnSO₄ + Cu',
    oxidant: 'CuSO₄ (Cu²⁺)',
    reductant: 'Zn',
    oxProduct: 'ZnSO₄ (Zn²⁺)',
    redProduct: 'Cu',
    transferredElectrons: 2,
    elements: {
      oxidized: { symbol: 'Zn', fromValence: 0, toValence: 2, delta: 2, count: 1 },
      reduced: { symbol: 'Cu', fromValence: 2, toValence: 0, delta: -2, count: 1 },
      spectator: { symbol: 'S(SO₄²⁻)', valence: 6, role: '酸根离子(化合价不变)', count: 1 },
    },
    examTips: '锌单质金属活泼性高于铜，Zn失电子被氧化为Zn²⁺，Cu²⁺得电子被还原为Cu单质。',
  },
  {
    id: 2,
    name: 'MnO₂与浓盐酸制Cl₂ (部分氧化还原)',
    equationTex: '\\text{MnO}_2 + 4\\text{HCl}(\\text{浓}) \\xlongequal{\\Delta} \\text{MnCl}_2 + \\text{Cl}_2\\uparrow + 2\\text{H}_2\\O',
    equationPlain: 'MnO₂ + 4HCl(浓) = MnCl₂ + Cl₂↑ + 2H₂O',
    oxidant: 'MnO₂',
    reductant: 'HCl (部分)',
    oxProduct: 'Cl₂',
    redProduct: 'MnCl₂',
    transferredElectrons: 2,
    elements: {
      oxidized: { symbol: 'Cl (被氧化)', fromValence: -1, toValence: 0, delta: 1, count: 2 },
      reduced: { symbol: 'Mn', fromValence: 4, toValence: 2, delta: -2, count: 1 },
      spectator: { symbol: 'Cl (酸性表现)', valence: -1, role: '显酸性(化合价不变)', count: 2 },
    },
    examTips: '【高考陷阱】4 mol HCl 反应中，仅有 2 mol Cl⁻ 被氧化生成 1 mol Cl₂，转移 2 mol 电子！',
  },
  {
    id: 3,
    name: 'KMnO₄酸性溶液与H₂O₂反应 (复杂守恒)',
    equationTex: '2\\text{KMnO}_4 + 5\\text{H}_2\\text{O}_2 + 3\\text{H}_2\\text{SO}_4 = 2\\text{MnSO}_4 + 5\\text{O}_2\\uparrow + \\text{K}_2\\text{SO}_4 + 8\\text{H}_2\\text{O}',
    equationPlain: '2KMnO₄ + 5H₂O₂ + 3H₂SO₄ = 2MnSO₄ + 5O₂↑ + K₂SO₄ + 8H₂O',
    oxidant: 'KMnO₄',
    reductant: 'H₂O₂',
    oxProduct: 'O₂',
    redProduct: 'MnSO₄',
    transferredElectrons: 10,
    elements: {
      oxidized: { symbol: 'O (H₂O₂)', fromValence: -1, toValence: 0, delta: 1, count: 10 },
      reduced: { symbol: 'Mn', fromValence: 7, toValence: 2, delta: -5, count: 2 },
    },
    examTips: 'KMnO₄中Mn为+7价下降5，H₂O₂中O为-1价升高1，依据电子得失守恒: 2×5 = 5×2 = 10 e⁻。',
  },
]

interface UseRedoxElectronTransferChemistryParams {
  reactionIndex: number   // 0~3 反应索引
  moleAmount: number      // 反应物物质的量 mol (基准系数倍率)
  time: number            // 动画播放时间
}

export interface RedoxChemistryResult {
  model: ReactionModelInfo
  moleAmount: number
  progress: number         // 0 ~ 1 反应动画完成度
  actualTransferredElectrons: number // 实际转移电子数 (mol)
  actualOxidantMoles: number         // 消耗氧化剂物质的量 (mol)
  actualReductantMoles: number       // 消耗还原剂物质的量 (mol)
  actualOxProductMoles: number       // 生成氧化产物物质的量 (mol)
  actualRedProductMoles: number      // 生成还原产物物质的量 (mol)
}

/**
 * 氧化还原反应与电子转移化学计算 Hook
 */
export function useRedoxElectronTransferChemistry({
  reactionIndex = 0,
  moleAmount = 1.0,
  time = 0,
}: UseRedoxElectronTransferChemistryParams): RedoxChemistryResult {
  return useMemo(() => {
    const validIndex = Math.max(0, Math.min(REACTION_MODELS.length - 1, Math.floor(reactionIndex)))
    const model = REACTION_MODELS[validIndex]

    // 假设 3.0s 反应完成
    const progress = Math.min(1.0, Math.max(0.0, time / 3.0))

    // 实际化学量计算 (以 moleAmount 为基础倍率)
    const factor = moleAmount
    const actualTransferredElectrons = model.transferredElectrons * factor

    // 计算各物质实际消耗/生成 (以方程式标准系数换算)
    const actualOxidantMoles = factor * 1.0
    const actualReductantMoles = factor * 1.0
    const actualOxProductMoles = factor * (model.elements.oxidized.count / 2)
    const actualRedProductMoles = factor * (model.elements.reduced.count)

    return {
      model,
      moleAmount,
      progress,
      actualTransferredElectrons,
      actualOxidantMoles,
      actualReductantMoles,
      actualOxProductMoles,
      actualRedProductMoles,
    }
  }, [reactionIndex, moleAmount, time])
}
