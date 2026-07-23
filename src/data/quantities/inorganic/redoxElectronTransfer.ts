import type { ChemistryQuantity } from '../../chemistryQuantities'

export function buildRedoxElectronTransferQuantities(params: Record<string, number>): ChemistryQuantity[] {
  const mole = params.moleAmount ?? 1.0
  const reaction = params.reaction ?? 0

  let eTransferred = 2 * mole
  if (reaction === 3) {
    eTransferred = 10 * mole
  }

  return [
    {
      key: 'moleAmount',
      label: '基准物质的量',
      value: mole,
      unit: 'mol',
      colorKey: 'concentration',
      precision: 1,
    },
    {
      key: 'transferredElectrons',
      label: '转移电子物质的量',
      value: eTransferred,
      unit: 'mol',
      colorKey: 'reactionRate',
      precision: 1,
    },
    {
      key: 'electronCount',
      label: '转移电子微粒数',
      value: parseFloat((eTransferred * 6.02).toFixed(2)),
      unit: '×10²³',
      colorKey: 'equilibriumConstant',
      precision: 2,
    },
  ]
}

/** 动态公式导出 */
export function getRedoxFormulas(params: Record<string, number>) {
  const reaction = params.reaction ?? 0

  if (reaction === 1) {
    return [
      {
        name: '金属置换离子方程式',
        latex: '\\text{Zn} + \\text{Cu}^{2+} = \\text{Zn}^{2+} + \\text{Cu}',
        level: 'core' as const,
        condition: '活泼金属 Zn 将较不活泼金属 Cu 从其盐溶液中置换出来',
      },
      {
        name: '氧化还原对',
        latex: '\\text{还原剂: Zn (失 } 2e^-) \\quad \\text{氧化剂: Cu}^{2+} (\\text{得 } 2e^-)',
        level: 'core' as const,
        condition: '氧化产物为 Zn²⁺，还原产物为 Cu 单质',
      },
    ]
  }

  if (reaction === 2) {
    return [
      {
        name: '实验室制氯气方程式',
        latex: '\\text{MnO}_2 + 4\\text{HCl}(\\text{浓}) \\xlongequal{\\Delta} \\text{MnCl}_2 + \\text{Cl}_2\\uparrow + 2\\text{H}_2\\O',
        level: 'core' as const,
        condition: '高考极高频：浓盐酸既表现还原性又表现酸性',
      },
      {
        name: '部分氧化还原关系式',
        latex: 'n(\\text{被氧化的 HCl}) = \\frac{1}{2} n(\\text{参加反应的 HCl}) = n(e^-)',
        level: 'core' as const,
        condition: '4 mol HCl 中仅有 2 mol Cl⁻ 被氧化生成 1 mol Cl₂',
      },
    ]
  }

  if (reaction === 3) {
    return [
      {
        name: '酸性高锰酸钾与双氧水反应',
        latex: '2\\text{KMnO}_4 + 5\\text{H}_2\\text{O}_2 + 3\\text{H}_2\\text{SO}_4 = 2\\text{MnSO}_4 + 5\\text{O}_2\\uparrow + \\text{K}_2\\text{SO}_4 + 8\\text{H}_2\\text{O}',
        level: 'core' as const,
        condition: '复杂氧化还原滴定基准反应',
      },
      {
        name: '高阶得失电子守恒式',
        latex: '2 \\times (7 - 2) = 5 \\times 2 \\times (0 - (-1)) = 10 e^-',
        level: 'core' as const,
        condition: 'Mn 化合价降 5 × 2 = O 化合价升 1 × 10 = 10 mol 电子',
      },
    ]
  }

  // 默认 reaction === 0: Na + Cl2
  return [
    {
      name: '钠与氯气反应方程式',
      latex: '2\\text{Na} + \\text{Cl}_2 \\xlongequal{\\text{点燃}} 2\\text{NaCl}',
      level: 'core' as const,
      condition: '典型活泼金属与非金属单质化合生成离子化合物',
    },
    {
      name: '微观电子层转移与离子键',
      latex: '\\text{Na}(2,8,1) \\to \\text{Na}^+(2,8) + e^- \\quad \\text{Cl}(2,8,7) + e^- \\to \\text{Cl}^-(2,8,8)',
      level: 'core' as const,
      condition: '电子发生完全转移，静电作用形成 Ionic Bond',
    },
    {
      name: '电子得失守恒定律',
      latex: 'n(\\text{失}) = n(\\text{得}) = n(e^-)',
      level: 'core' as const,
      condition: '氧化剂得电子总数恒等于还原剂失电子总数',
    },
  ]
}

/** 动态高考要点导出 */
export function getRedoxExamPoints(params: Record<string, number>) {
  const reaction = params.reaction ?? 0

  if (reaction === 1) {
    return [
      {
        text: '【高考核心口诀】升失氧，降得还；剂性相反。做还原剂的 Zn 化合价升高、失去电子、被氧化为 Zn²⁺。',
        importance: 'gaokao' as const,
      },
      {
        text: '【置换反应规律】活泼金属置换较不活泼金属，反应中氧化性：Cu²⁺ > Zn²⁺；还原性：Zn > Cu。',
        importance: 'gaokao' as const,
      },
    ]
  }

  if (reaction === 2) {
    return [
      {
        text: '【阿伏加德罗常数 NA 陷阱】在 MnO₂ + 4HCl(浓) 反应中，每消耗 4 mol HCl，被氧化的 HCl 仅为 2 mol，生成 1 mol Cl₂，转移 2 mol 电子！',
        importance: 'gaokao' as const,
      },
      {
        text: '【浓盐酸显性分析】4 mol HCl 中，2 mol 表现还原性生成 Cl₂，2 mol 表现酸性生成 MnCl₂ 盐，高考极其喜欢在此设坑！',
        importance: 'gaokao' as const,
      },
    ]
  }

  if (reaction === 3) {
    text: '【复杂氧化还原配平法则】先用化合价升降守恒配平氧化剂 (KMnO₄) 与还原剂 (H₂O₂)，再用电荷守恒/介质配平 H₂SO₄，最后原子守恒配平 H₂O。'
    return [
      {
        text: '【复杂电子守恒计算】KMnO₄ 作用为强氧化剂 (Mn⁺⁷ → Mn²⁺ 降 5)，H₂O₂ 为还原剂 (O⁻¹ → O⁰ 升 1)。2 mol KMnO₄ 与 5 mol H₂O₂ 刚好完全反应，转移 10 mol 电子。',
        importance: 'gaokao' as const,
      },
      {
        text: '【氧化还原滴定应用】利用酸性 KMnO₄ 滴定 H₂O₂ 时不需要额外指示剂，终点时溶液由无色变为浅紫色且 30s 内不褪色。',
        importance: 'hard' as const,
      },
    ]
  }

  return [
    {
      text: '【高考核心口诀】升失氧，降得还；剂性相反。做还原剂的 Na 化合价升高、失去电子、被氧化、得到氧化产物 NaCl。',
      importance: 'gaokao' as const,
    },
    {
      text: '【微观离子键机制】Na 失去最外层 1 个电子变为 8 电子稳定结构的 Na⁺，Cl 得到 1 个电子变为 8 电子稳定结构的 Cl⁻，依靠阴阳离子间静电作用形成离子键。',
      importance: 'gaokao' as const,
    },
  ]
}
