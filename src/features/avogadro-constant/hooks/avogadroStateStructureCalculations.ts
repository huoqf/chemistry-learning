import type { AvogadroResult } from '../types'

/**
 * 1. 标况状态与气体摩尔体积陷阱计算逻辑
 */
export function calculateStateVolumeTrap(
  item: 'SO3' | 'CCl4' | 'H2O' | 'CH3OH' | 'HF' | 'Cl2' | 'O2',
  val: number,
  unit: 'mol' | 'L' | 'g',
  cond: 'standard' | 'ambient',
  vm: number
): AvogadroResult {
  const isStd = cond === 'standard'

  switch (item) {
    case 'SO3': {
      const isGas = false
      // 标况 0℃ 下 SO3 熔点 16.8℃，为固态晶体；常温 25℃ 下（沸点 44.8℃）为无色液态
      const physState = isStd ? '固态' : '液态'
      const molesGiven = unit === 'L' ? val / vm : unit === 'mol' ? val : val / 80
      // 密度约 1.92 g/cm³ = 1920 g/L，val 单位为 L，必须 ×1000 换算
      const actualMoles = unit === 'L' ? (val * 1920) / 80 : molesGiven

      return {
        title: `SO₃ (三氧化硫) ${isStd ? '标况' : '常温'}非气态陷阱`,
        subtitle: isStd
          ? '标准状况 (0℃, 101 kPa) 下 SO₃ 为固态晶体 (熔点 16.8℃)'
          : '常温 (25℃, 101 kPa) 下 SO₃ 为液态 (沸点 44.8℃)，同样不可用气体摩尔体积',
        isStateGas: isGas,
        physicalState: physState,
        vmValue: vm,
        particleStats: [
          {
            label: 'SO₃ 分子数',
            theoreticalMoles: unit === 'L' ? val / vm : molesGiven,
            actualMoles: unit === 'L' ? actualMoles : molesGiven,
            unit: '$N_{\\text{A}}$',
            isTrap: unit === 'L',
            trapExplanation: unit === 'L'
              ? `错按气体摩尔体积 V_m = ${vm} L/mol 计算！${isStd ? '0℃ 固态' : '25℃ 液态'} SO₃ 的 ${val} L 体积下物质的量约 ${actualMoles.toFixed(0)} N_A，远大于 ${(val / vm).toFixed(2)} N_A`
              : undefined,
          },
        ],
        trapType: '非气态物质状态陷阱',
        trapBadge: isStd ? '标况固态晶体' : '常温液态非气体',
        trapLevel: 'high',
        keyPointAnalysis: [
          '标况下 (0℃, 101 kPa) SO₃ 熔点 16.8℃，完全为固态晶体；常温 25℃ 时沸点 44.8℃，仍呈液态。',
          `若题目给出“${isStd ? '标况' : '常温'}下 22.4 L SO₃”，分子数远大于 1 N_A，不可套用 ${vm} L/mol！`,
        ],
        formulaLatex: isStd
          ? '\\text{标况 (0}^\\circ\\text{C)} \\implies \\text{SO}_3 \\text{ 为固态晶体，} V_m = 22.4 \\text{ L/mol 不适用}'
          : '\\text{常温 (25}^\\circ\\text{C)} \\implies \\text{SO}_3 \\text{ 为液态 (沸点 44.8}^\\circ\\text{C)，} V_m \\text{ 不适用}',
        correctAnswerSummary: unit === 'L'
          ? `${isStd ? '标况' : '常温'}下 ${val} L SO₃ 为${physState}非气体，分子数远大于 ${(val / vm).toFixed(2)} N_A`
          : `${val} ${unit} SO₃ 含有 ${molesGiven.toFixed(2)} N_A 个分子`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '温度与压强', pass: true, finding: isStd ? '标准状况 (0℃, 101 kPa)' : '常温常压 (25℃)' },
          { stepName: '二审状态', checkTarget: 'SO₃ 状态判定', pass: false, finding: isStd ? '0℃ 时为固态！非气体！' : '25℃ 时为液态！非气体！' },
          { stepName: '三审结构', checkTarget: '分子构成', pass: true, finding: '1 个 SO₃ 含有 4 个原子' },
          { stepName: '四审过程', checkTarget: '物理/化学过程', pass: true, finding: '纯净物' },
          { stepName: '五审电子', checkTarget: '氧化还原', pass: true, finding: '最高价 +6' },
        ],
      }
    }

    case 'H2O': {
      // 水在 0℃ 标况及 25℃ 常温下均为液态/固态，绝对不能套用 V_m
      const molesGiven = unit === 'L' ? val / 22.4 : unit === 'mol' ? val : val / 18
      const actualMoles = unit === 'L' ? (val * 1000) / 18 : molesGiven
      return {
        title: 'H₂O (水) 标况物理状态致命陷阱',
        subtitle: '标况 (0℃) 下 H₂O 为冰水混合物 (液态/固态)，常温 (25℃) 下为液态',
        isStateGas: false,
        physicalState: isStd ? '固/液态' : '液态',
        vmValue: vm,
        particleStats: [
          {
            label: 'H₂O 分子数',
            theoreticalMoles: unit === 'L' ? val / 22.4 : molesGiven,
            actualMoles: unit === 'L' ? actualMoles : molesGiven,
            unit: '$N_{\\text{A}}$',
            isTrap: unit === 'L',
            trapExplanation: 'H₂O 标况下为冰水混合物，常温下为液体！绝对禁止套用 V_m = 22.4 L/mol！',
          },
        ],
        trapType: '标况水物理状态致命陷阱',
        trapBadge: '水标况非气体',
        trapLevel: 'high',
        keyPointAnalysis: [
          '标况下 (0℃, 101 kPa) 水为冰水混合物 (固态/液态)，密度 ≈ 1 g/cm³。',
          '常温下 (25℃) 水为液态，1 mol 水的体积仅约 18 mL，远小于 22.4 L。',
          '“标况下 22.4 L H₂O 含有 1 N_A 个分子”是致命错误！22.4 L 水重 22.4 kg，含 1244 N_A 分子！',
        ],
        formulaLatex: '\\text{H}_2\\text{O (0}^\\circ\\text{C 及 25}^\\circ\\text{C)} \\implies \\text{非气体，} V_m = 22.4 \\text{ L/mol 彻底禁用}',
        correctAnswerSummary: 'H₂O 标况/常温下均为非气体，绝对不能使用 22.4 L/mol 计算！',
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '0℃ / 25℃ 环境', pass: true, finding: isStd ? '0℃ 101kPa' : '25℃ 101kPa' },
          { stepName: '二审状态', checkTarget: 'H₂O 状态判定', pass: false, finding: '0℃ 下为冰水混合物，非气体！' },
          { stepName: '三审结构', checkTarget: '分子构成', pass: true, finding: '1 个 H₂O 含 2 个 H-O 键' },
          { stepName: '四审过程', checkTarget: '物理形态', pass: false, finding: '液态/固态！' },
          { stepName: '五审电子', checkTarget: '电子', pass: true, finding: '1 mol H₂O 含 10 mol 电子' },
        ],
      }
    }

    case 'CH3OH': {
      // 甲醇沸点 64.7℃，标况下为液体
      const molesGiven = unit === 'L' ? val / 22.4 : unit === 'mol' ? val : val / 32
      const actualMoles = unit === 'L' ? (val * 792) / 32 : molesGiven
      return {
        title: 'CH₃OH (甲醇) 标况状态陷阱',
        subtitle: '甲醇沸点为 64.7℃，在标况 (0℃) 及常温 (25℃) 下均为无色液体',
        isStateGas: false,
        physicalState: '液态',
        vmValue: vm,
        particleStats: [
          {
            label: 'CH₃OH 分子数',
            theoreticalMoles: unit === 'L' ? val / 22.4 : molesGiven,
            actualMoles: unit === 'L' ? actualMoles : molesGiven,
            unit: '$N_{\\text{A}}$',
            isTrap: unit === 'L',
            trapExplanation: '甲醇标况下为液体，绝对不能套用 22.4 L/mol！',
          },
        ],
        trapType: '标况液体陷阱',
        trapBadge: '甲醇标况液态',
        trapLevel: 'high',
        keyPointAnalysis: [
          'CH₃OH 沸点 64.7℃，标况 (0℃) 下为无色液体。',
          '“标况下 22.4 L 甲醇”中分子数远大于 1 N_A，不可套用 V_m！',
        ],
        formulaLatex: '\\text{CH}_3\\text{OH (沸点 64.7}^\\circ\\text{C)} \\implies \\text{标况下为液体}',
        correctAnswerSummary: '甲醇在标况下为液体，不可套用 22.4 L/mol 计算',
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '标况', pass: true, finding: '0℃ 101kPa' },
          { stepName: '二审状态', checkTarget: 'CH₃OH 状态', pass: false, finding: '无色液体！' },
          { stepName: '三审结构', checkTarget: '共价键', pass: true, finding: '1 mol CH₃OH 含 5 mol 共价键' },
          { stepName: '四审过程', checkTarget: '物理', pass: true, finding: '纯净物' },
          { stepName: '五审电子', checkTarget: '电子', pass: true, finding: '18 mol 电子' },
        ],
      }
    }

    case 'HF': {
      // 氟化氢沸点 19.5℃：0℃ 标况下为液态（ρ ≈ 1.00 g/cm³ = 1000 g/L）；25℃ 常温下为气态但分子间存在 F-H…F 强氢键缔合 (HF)n
      const molesGiven = unit === 'L' ? val / vm : unit === 'mol' ? val : val / 20
      const isUnitVolume = unit === 'L'
      const theoreticalMoles = isUnitVolume ? val / vm : molesGiven
      const actualMoles = isStd
        ? isUnitVolume
          ? (val * 1000) / 20
          : molesGiven * 0.65
        : isUnitVolume
        ? (val / vm) * 1.35
        : molesGiven * 0.65

      const statLabel = isStd
        ? isUnitVolume
          ? 'HF 化学式单元数 (标况液态)'
          : '独立缔合分子数 (示意)'
        : isUnitVolume
        ? 'HF 化学式单元数 (示意)'
        : '独立缔合分子数 (示意)'

      const trapExplanation = isStd
        ? isUnitVolume
          ? `HF 沸点 19.5℃，标况 (0℃) 下为无色发烟液体（ρ≈1.0 g/cm³，${val} L 约含 ${actualMoles.toFixed(0)} mol HF，远大于 ${(val / vm).toFixed(2)} mol）；且分子间形成 (HF)ₙ 缔合！`
          : `HF 分子间存在 F-H…F 强氢键缔合为 (HF)ₙ，${molesGiven.toFixed(2)} mol HF 化学式单元聚合后的实际独立分子数显著小于 ${molesGiven.toFixed(2)} N_A（按缔合度作数量级示意）！`
        : isUnitVolume
        ? `25℃ 常温下 HF 呈气态，由阿伏加德罗定律 ${val} L 中独立气态微粒总数约为 ${(val / vm).toFixed(2)} N_A；但因存在 (HF)ₙ 氢键缔合，其中含有的 HF 化学式单元（及 H/F 原子数）显著大于 ${(val / vm).toFixed(2)} N_A（按缔合度作数量级示意）！`
        : `25℃ 常温下 HF 仍存在强氢键缔合 (HF)ₙ，${molesGiven.toFixed(2)} mol HF 分子聚集后，实际独立分子总数显著小于 ${molesGiven.toFixed(2)} N_A（按缔合度作数量级示意）！`

      return {
        title: `HF (氟化氢) ${isStd ? '标况液态' : '常温气态'}与分子缔合陷阱`,
        subtitle: isStd
          ? 'HF 在标况 (0℃) 下为液体 (沸点 19.5℃)，且分子间形成 (HF)ₙ 氢键缔合'
          : 'HF 在常温 (25℃) 下为气态，因存在 (HF)ₙ 缔合：定体积气态含 HF 单元 > V/Vₘ；定质量/mol 独立分子 < n',
        isStateGas: !isStd,
        physicalState: isStd ? '液态' : '气态',
        vmValue: vm,
        particleStats: [
          {
            label: statLabel,
            theoreticalMoles,
            actualMoles,
            unit: '$N_{\\text{A}}$',
            isTrap: true,
            isIndicative: !isStd || !isUnitVolume,
            trapExplanation,
          },
        ],
        trapType: isStd ? '标况液体与氢键缔合陷阱' : '气态氢键缔合双向陷阱',
        trapBadge: isStd ? 'HF 标况液态' : 'HF 氢键缔合',
        trapLevel: 'high',
        keyPointAnalysis: [
          'HF 沸点 19.5℃：标况 (0℃) 下呈无色发烟液体，不可用 V_m = 22.4 L/mol 计算。',
          '常温 (25℃) 下 HF 虽为气态但强氢键缔合为 (HF)ₙ：给定体积 V 时独立分子数 ≈ V/V_m，但所含 HF 化学式单元数大于 V/V_m；给定质量或物质的量时，独立分子数小于理论摩尔数。',
        ],
        formulaLatex: isStd
          ? '\\text{HF (沸点 19.5}^\\circ\\text{C)} \\implies \\text{标况下为液体及 (HF)}_n \\text{ 缔合分子}'
          : isUnitVolume
          ? '\\text{常温定体积 HF(g)} \\implies n_{\\text{独立微粒}} \\approx \\frac{V}{V_m},\\ n(\\text{HF}) > \\frac{V}{V_m}'
          : '\\text{常温定量 HF(g)} \\implies n_{\\text{独立分子}} < n(\\text{HF})',
        correctAnswerSummary: isUnitVolume
          ? isStd
            ? `标况下 ${val} L HF 为液体（约含 ${actualMoles.toFixed(0)} mol HF 单元），远大于按气体算出的 ${(val / vm).toFixed(2)} N_A，不可套用 22.4 L/mol`
            : `常温下 ${val} L 缔合 HF(g) 的独立微粒数约 ${(val / vm).toFixed(2)} N_A，因形成 (HF)ₙ 缔合，所含 HF 单元数显著大于 ${(val / vm).toFixed(2)} N_A`
          : `由于 (HF)ₙ 强氢键缔合，${molesGiven.toFixed(2)} mol HF 对应的实际独立分子数显著小于 ${molesGiven.toFixed(2)} N_A`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '温度与压强', pass: isStd, finding: isStd ? '标况 0℃, 101 kPa' : '常温 25℃, 101 kPa' },
          { stepName: '二审状态', checkTarget: 'HF 状态判定', pass: !isStd, finding: isStd ? '沸点 19.5℃ ➔ 标况下为液体！' : '沸点 19.5℃ ➔ 25℃ 呈气态，但发生缔合！' },
          { stepName: '三审结构', checkTarget: '氢键缔合', pass: false, finding: '分子间形成 F-H…F 强氢键缔合！' },
          { stepName: '四审过程', checkTarget: '变化', pass: true, finding: '缔合可逆过程' },
          { stepName: '五审电子', checkTarget: '电子', pass: true, finding: '1 mol HF 含 10 mol 电子' },
        ],
      }
    }

    case 'CCl4': {
      const molesGiven = unit === 'L' ? val / 22.4 : unit === 'mol' ? val : val / 154
      const actualMoles = unit === 'L' ? (val * 1590) / 154 : molesGiven
      return {
        title: 'CCl₄ (四氯化碳) 标况状态陷阱',
        subtitle: 'CCl₄ 在常温和标况下均属于无色液体 (沸点 76.8℃)',
        isStateGas: false,
        physicalState: '液态',
        vmValue: vm,
        particleStats: [
          {
            label: 'CCl₄ 分子数',
            theoreticalMoles: unit === 'L' ? val / 22.4 : molesGiven,
            actualMoles: unit === 'L' ? actualMoles : molesGiven,
            unit: '$N_{\\text{A}}$',
            isTrap: unit === 'L',
            trapExplanation: unit === 'L' ? '错把液体 CCl₄ 当作气体使用 22.4 L/mol，实际 22.4 L CCl₄ 约为 231 mol！' : undefined,
          },
        ],
        trapType: '标况非气体陷阱',
        trapBadge: '常识液体陷阱',
        trapLevel: 'high',
        keyPointAnalysis: [
          'CCl₄ 沸点 76.8℃，标况 (0℃) 及常温 (25℃) 下均为液体。',
          '高考常设陷阱：“标况下 22.4 L CCl₄ 中含 C-Cl 键数为 4 N_A”（错误！）。',
        ],
        formulaLatex: '\\text{CCl}_4 \\text{ 为液体 } \\implies n \\neq \\frac{V}{22.4}',
        correctAnswerSummary: unit === 'L' ? `标况下 CCl₄ 为液体，${val} L 远大于 ${(val/22.4).toFixed(2)} N_A` : `含 ${(molesGiven*4).toFixed(2)} N_A 个 C-Cl 键`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '环境', pass: true, finding: '0℃ 101kPa' },
          { stepName: '二审状态', checkTarget: 'CCl₄ 物理状态', pass: false, finding: '无色液体！不能使用 22.4 L/mol！' },
          { stepName: '三审结构', checkTarget: '正四面体', pass: true, finding: '1 个 CCl₄ 含有 4 个 C-Cl 单键' },
          { stepName: '四审过程', checkTarget: '物料', pass: true, finding: '纯净物' },
          { stepName: '五审电子', checkTarget: '电子', pass: true, finding: '非氧化还原' },
        ],
      }
    }

    default: {
      const molarMass = item === 'O2' ? 32 : 71
      const moles = unit === 'L' ? val / vm : unit === 'mol' ? val : val / molarMass
      return {
        title: `${item} 标况气体计算`,
        subtitle: `${item} 在标况 (0℃, 101 kPa) 下为气体，满足 V_m = 22.4 L/mol`,
        isStateGas: true,
        physicalState: '气态',
        vmValue: vm,
        particleStats: [
          {
            label: `${item} 分子数`,
            theoreticalMoles: moles,
            actualMoles: moles,
            unit: '$N_{\\text{A}}$',
            isTrap: false, // 气体本身不是陷阱，不显示误导性错预估
          },
        ],
        trapType: isStd ? '正常气体 (无状态陷阱)' : '非标况温度联动',
        trapBadge: isStd ? '合规气体' : '温度联动',
        trapLevel: isStd ? 'low' : 'medium',
        keyPointAnalysis: [
          `${item} 在标况下为气体，可以直接套用 n = V / 22.4 L/mol。`,
          !isStd ? '常温常压 (25℃) 下 V_m ≈ 24.5 L/mol，22.4 L 气体的物质的量约为 0.91 mol。' : '标况 22.4 L 气体即为 1 mol。',
        ],
        formulaLatex: isStd
          ? `n = \\frac{V}{22.4 \\text{ L/mol}} = ${moles.toFixed(2)} \\text{ mol}`
          : `\\text{常温 (25}^\\circ\\text{C}) \\implies V_m = 24.5 \\text{ L/mol}, n = \\frac{V}{24.5} = ${moles.toFixed(2)} \\text{ mol}`,
        correctAnswerSummary: `${val} ${unit} ${item} 含有 ${moles.toFixed(2)} N_A 个分子`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '温度压强', pass: isStd, finding: isStd ? '标况 0℃ 101kPa (Vm=22.4)' : '常温 25℃ (Vm=24.5)' },
          { stepName: '二审状态', checkTarget: '气体判定', pass: true, finding: `${item} 为正常气体` },
          { stepName: '三审结构', checkTarget: '双原子分子', pass: true, finding: `1 mol ${item} 含 2 mol 原子` },
          { stepName: '四审过程', checkTarget: '物理变动', pass: true, finding: '无' },
          { stepName: '五审电子', checkTarget: '电子', pass: true, finding: '无' },
        ],
      }
    }
  }
}

/**
 * 2. 结构化学与化学键/中子数统计陷阱
 */
export function calculateStructureBondsTrap(
  item: 'P4' | 'diamond' | 'graphite' | 'SiO2' | 'Na2O2' | 'D2O' | 'T2O' | 'S8' | 'ice' | 'NH4Cl',
  val: number,
  unit: 'mol' | 'L' | 'g'
): AvogadroResult {
  // 安全算理兜底：固态晶体/非气体若被误选 L 单位，绝对不能把 12 L 错误当作 12 mol 计算
  const effectiveUnit = unit === 'L' ? 'mol' : unit

  switch (item) {
    case 'P4': {
      const molesP4 = effectiveUnit === 'g' ? val / 124 : val
      const bondsMoles = molesP4 * 6
      const wrongMoles = molesP4 * 4
      return {
        title: 'P₄ (白磷正四面体) 共价键统计陷阱',
        subtitle: '1 mol P₄ 正四面体结构中含有 6 mol P-P 单键（非 4 mol！）',
        isStateGas: false,
        physicalState: '固态',
        vmValue: 22.4,
        particleStats: [
          { label: 'P₄ 分子数', theoreticalMoles: molesP4, actualMoles: molesP4, unit: 'N_A', isTrap: false },
          {
            label: 'P-P 共价键数',
            theoreticalMoles: wrongMoles,
            actualMoles: bondsMoles,
            unit: '$N_{\\text{A}}$',
            isTrap: true,
            trapExplanation: '错把 4 个顶点误按 4 条键计算！正四面体有 6 条棱，即 1 mol P₄ 含有 6 mol P-P 键。',
          },
        ],
        trapType: '晶体/分子结构键数陷阱',
        trapBadge: '正四面体 6 键',
        trapLevel: 'high',
        keyPointAnalysis: [
          '白磷 (P₄) 分子为正四面体构型，4 个 P 原子占据 4 个顶点，6 条棱对应 6 个 P-P 共价键。',
          '1 mol P₄ 含有 6 mol P-P 键。31 g 白磷为 0.25 mol P₄，含 1.5 mol P-P 键！',
        ],
        formulaLatex: '1 \\text{ mol P}_4 \\implies 6 \\text{ mol P-P 键 (正四面体 6 条棱)}',
        correctAnswerSummary: `${val} ${effectiveUnit} 白磷 P₄ 含有 ${bondsMoles.toFixed(2)} N_A 个 P-P 共价键`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '环境', pass: true, finding: '固态纯净物' },
          { stepName: '二审状态', checkTarget: '状态', pass: true, finding: '分子晶体' },
          { stepName: '三审结构', checkTarget: '正四面体棱数', pass: false, finding: '4 个顶点 6 条棱 ➔ 6 mol 共价键！' },
          { stepName: '四审过程', checkTarget: '变化', pass: true, finding: '无' },
          { stepName: '五审电子', checkTarget: '价电子', pass: true, finding: '保留 1 对孤电子对' },
        ],
      }
    }

    case 'S8': {
      // 1 mol S8 (单质硫) 皇冠状环状结构，含有 8 mol S-S 共价键
      const molesS8 = effectiveUnit === 'g' ? val / 256 : val
      const bondsMoles = molesS8 * 8
      return {
        title: 'S₈ (单质硫皇冠分子) 共价键数',
        subtitle: '1 mol S₈ 含有 8 mol S-S 单键；1 mol S 原子形成 1 mol S-S 键',
        isStateGas: false,
        physicalState: '固态',
        vmValue: 22.4,
        particleStats: [
          { label: 'S-S 共价键数', theoreticalMoles: molesS8 * 2, actualMoles: bondsMoles, unit: 'N_A', isTrap: true, trapExplanation: '错把 S₈ 八元环误按 S₂ 计算！1 mol S₈ 含有 8 mol S-S 键。' },
        ],
        trapType: '单质硫环状结构键数',
        trapBadge: 'S₈ 环状 8 键',
        trapLevel: 'medium',
        keyPointAnalysis: [
          '斜方硫/单质硫是由 S₈ 皇冠状八元环分子组成的分子晶体。',
          '1 mol S₈ 含有 8 mol S-S 共价键；32 g S 单质为 1 mol S 原子，形成 1 mol S-S 键。',
        ],
        formulaLatex: '1 \\text{ mol S}_8 \\implies 8 \\text{ mol S-S 键} \\quad | \\quad 32 \\text{ g S } (1 \\text{ mol S}) \\implies 1 \\text{ mol S-S 键}',
        correctAnswerSummary: `${val} ${effectiveUnit} S₈ 含有 ${bondsMoles.toFixed(2)} N_A 个 S-S 共价键`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '环境', pass: true, finding: '固态' },
          { stepName: '二审状态', checkTarget: '晶体', pass: true, finding: '分子晶体' },
          { stepName: '三审结构', checkTarget: '环状 S8', pass: true, finding: '8 元环含 8 条单键' },
          { stepName: '四审过程', checkTarget: '变化', pass: true, finding: '无' },
          { stepName: '五审电子', checkTarget: '电子', pass: true, finding: '8 电子稳定' },
        ],
      }
    }

    case 'ice': {
      // 1 mol 冰 (18 g) 晶体中，1 个水分子与 4 个相邻水分子形成氢键，每个氢键由 2 个水分子共用 ➔ 4 * 1/2 = 2 mol 氢键！
      const molesH2O = effectiveUnit === 'g' ? val / 18 : val
      const hBondsMoles = molesH2O * 2
      return {
        title: '冰/水 (H₂O) 分子间氢键统计',
        subtitle: '1 mol 冰 (18 g H₂O) 晶体中含有 2 mol 氢键 (均摊法 4 × 1/2)',
        isStateGas: false,
        physicalState: '固态',
        vmValue: 22.4,
        particleStats: [
          { label: 'O-H 极性共价键数', theoreticalMoles: molesH2O * 2, actualMoles: molesH2O * 2, unit: 'N_A', isTrap: false },
          { label: '分子间氢键数', theoreticalMoles: molesH2O * 4, actualMoles: hBondsMoles, unit: 'N_A', isTrap: true, trapExplanation: '错把 4 个氢键方向误认为 4 mol 独立键！每个氢键由 2 水共用 ➔ 均摊 2 mol 氢键。' },
        ],
        trapType: '冰晶体氢键均摊陷阱',
        trapBadge: '1 mol 冰 = 2 mol 氢键',
        trapLevel: 'high',
        keyPointAnalysis: [
          '在冰晶体中，每个 H₂O 分子与 4 个相邻 H₂O 形成四面体定向氢键。',
          '根据均摊法：每个氢键被 2 个 H₂O 分子共享，故 1 mol 冰中含 2 mol 氢键（18 g 冰含 2 N_A 个氢键）。',
        ],
        formulaLatex: '1 \\text{ mol 冰 } (18 \\text{ g}) \\implies 2 \\text{ mol 氢键 } (4 \\times \\frac{1}{2})',
        correctAnswerSummary: `18 g 冰中含有 2 N_A 个分子间氢键`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '环境', pass: true, finding: '固态冰' },
          { stepName: '二审状态', checkTarget: '晶体', pass: true, finding: '分子晶体' },
          { stepName: '三审结构', checkTarget: '氢键均摊', pass: false, finding: '4 个方向 × 1/2 共享 ➔ 2 mol 氢键！' },
          { stepName: '四审过程', checkTarget: '变化', pass: true, finding: '无' },
          { stepName: '五审电子', checkTarget: '电子', pass: true, finding: '10 mol 电子' },
        ],
      }
    }

    case 'T2O': {
      // T 是 3_1 H (氚)，M(T2O) = 3*2 + 16 = 22 g/mol。
      // 1 个 T 原子含 1 质子 2 中子。1 个 T2O 分子含 10 个质子、12 个中子！
      const molesT2O = effectiveUnit === 'g' ? val / 22 : val
      const neutronsMoles = molesT2O * 12
      return {
        title: 'T₂O (氚水) 摩尔质量与中子数陷阱',
        subtitle: 'T₂O 摩尔质量为 22 g/mol，1 mol T₂O (22 g) 含有 12 mol 中子',
        isStateGas: false,
        physicalState: '液态',
        vmValue: 22.4,
        particleStats: [
          { label: 'T₂O 摩尔数', theoreticalMoles: effectiveUnit === 'g' ? val / 18 : molesT2O, actualMoles: molesT2O, unit: 'N_A', isTrap: effectiveUnit === 'g', trapExplanation: effectiveUnit === 'g' ? '错用 H₂O 摩尔质量 18 g/mol！22 g T₂O 才为 1 mol！' : undefined },
          { label: '中子数', theoreticalMoles: effectiveUnit === 'g' ? (val / 18) * 8 : molesT2O * 8, actualMoles: neutronsMoles, unit: 'N_A', isTrap: true, trapExplanation: '错用普通水中子数 8！1 个 T₂O 含 12 个中子 (22 g 含 12 N_A 中子)。' },
        ],
        trapType: '氚水同位素中子数陷阱',
        trapBadge: 'M(T₂O) = 22g/mol',
        trapLevel: 'high',
        keyPointAnalysis: [
          'T 代表 ³H (氚)，含有 1 个质子和 2 个中子，摩尔质量为 3*2 + 16 = 22 g/mol。',
          '1 个 T₂O 分子含有 10 个质子和 12 个中子。',
          '22 g T₂O 为 1 mol，含有 12 mol 中子和 10 mol 质子。',
        ],
        formulaLatex: 'M(\\text{T}_2\\text{O}) = 22 \\text{ g/mol} \\implies 1 \\text{ mol T}_2\\text{O} (22 \\text{ g}) \\implies 12 \\text{ mol 中子}',
        correctAnswerSummary: `${val} ${effectiveUnit} T₂O 含有 ${neutronsMoles.toFixed(2)} N_A 个中子`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '环境', pass: true, finding: '液态' },
          { stepName: '二审状态', checkTarget: '状态', pass: true, finding: '液体' },
          { stepName: '三审结构', checkTarget: '氚原子核构成', pass: false, finding: '1 个 T 含 2 个中子 ➔ 1 个 T₂O 含 12 个中子！' },
          { stepName: '四审过程', checkTarget: '变化', pass: true, finding: '无' },
          { stepName: '五审电子', checkTarget: '电子', pass: true, finding: '10 mol 电子' },
        ],
      }
    }

    case 'D2O': {
      // D 为 2_1 H (氘)，M(D2O) = 2*2 + 16 = 20 g/mol。
      // 1 个 D 原子含 1 质子 1 中子。1 个 D2O 分子含 10 个质子、10 个中子！
      const molesD2O = effectiveUnit === 'g' ? val / 20 : val
      const neutronsMoles = molesD2O * 10
      return {
        title: 'D₂O (重水) 摩尔质量与中子数陷阱',
        subtitle: 'D₂O 摩尔质量为 20 g/mol，1 mol D₂O (20 g) 含有 10 mol 中子',
        isStateGas: false,
        physicalState: '液态',
        vmValue: 22.4,
        particleStats: [
          { label: 'D₂O 摩尔数', theoreticalMoles: effectiveUnit === 'g' ? val / 18 : molesD2O, actualMoles: molesD2O, unit: 'N_A', isTrap: effectiveUnit === 'g', trapExplanation: effectiveUnit === 'g' ? '错用普通水 H₂O 摩尔质量 18 g/mol！20 g D₂O 才为 1 mol！' : undefined },
          { label: '中子数', theoreticalMoles: effectiveUnit === 'g' ? (val / 18) * 8 : molesD2O * 8, actualMoles: neutronsMoles, unit: 'N_A', isTrap: true, trapExplanation: '错用普通水中子数 8 (忽略 D 中含 1 个中子)！1 个 D₂O 含 10 个中子 (20 g 含 10 N_A 中子)。' },
        ],
        trapType: '重水同位素中子数陷阱',
        trapBadge: 'M(D₂O) = 20g/mol',
        trapLevel: 'high',
        keyPointAnalysis: [
          'D 代表 ²H (氘)，含有 1 个质子和 1 个中子，摩尔质量为 2*2 + 16 = 20 g/mol。',
          '1 个 D₂O 分子含有 10 个质子和 10 个中子 (O 8 个中子 + 2 个 D 各 1 个中子)。',
          '20 g D₂O 为 1 mol，含有 10 mol 中子和 10 mol 质子。',
        ],
        formulaLatex: 'M(\\text{D}_2\\text{O}) = 20 \\text{ g/mol} \\implies 1 \\text{ mol D}_2\\text{O} (20 \\text{ g}) \\implies 10 \\text{ mol 中子}',
        correctAnswerSummary: `${val} ${effectiveUnit} D₂O 含有 ${neutronsMoles.toFixed(2)} N_A 个中子`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '环境', pass: true, finding: '液态' },
          { stepName: '二审状态', checkTarget: '状态', pass: true, finding: '液体' },
          { stepName: '三审结构', checkTarget: '氘原子核构成', pass: false, finding: '1 个 D 含 1 个中子 ➔ 1 个 D₂O 含 10 个中子！' },
          { stepName: '四审过程', checkTarget: '变化', pass: true, finding: '无' },
          { stepName: '五审电子', checkTarget: '电子', pass: true, finding: '10 mol 电子' },
        ],
      }
    }

    case 'SiO2': {
      // 1 mol SiO2 晶体中，Si 原子与 4 个 O 形成 4 个 Si-O 键 ➔ 1 mol SiO2 (60 g) 含有 4 mol Si-O 键
      const molesSiO2 = effectiveUnit === 'g' ? val / 60 : val
      const bondsMoles = molesSiO2 * 4
      return {
        title: 'SiO₂ (二氧化硅) 晶体共价键统计陷阱',
        subtitle: '1 mol SiO₂ (60 g) 晶体中含有 4 mol Si-O 共价键（非 2 mol！）',
        isStateGas: false,
        physicalState: '固态',
        vmValue: 22.4,
        particleStats: [
          { label: 'SiO₂ 摩尔数', theoreticalMoles: molesSiO2, actualMoles: molesSiO2, unit: 'N_A', isTrap: false },
          {
            label: 'Si-O 共价键数',
            theoreticalMoles: molesSiO2 * 2,
            actualMoles: bondsMoles,
            unit: '$N_{\\text{A}}$',
            isTrap: true,
            trapExplanation: '错按分子式中氧原子数 2 误以为只有 2 mol Si-O 键！SiO₂ 是立体网状共价晶体，每个 Si 连 4 个 O ➔ 4 mol Si-O 键。',
          },
        ],
        trapType: '共价晶体网状结构键数陷阱',
        trapBadge: '1 mol SiO₂ = 4 mol 键',
        trapLevel: 'high',
        keyPointAnalysis: [
          '二氧化硅 (SiO₂) 属于共价晶体，无独立 SiO₂ 分子。',
          '每个 Si 原子与 4 个 O 原子形成 4 个 Si-O 单键；每个 O 原子与 2 个 Si 原子相连。',
          '因此 1 mol SiO₂ (60 g) 含有 4 mol Si-O 共价键。',
        ],
        formulaLatex: '1 \\text{ mol SiO}_2 (60 \\text{ g}) \\implies 4 \\text{ mol Si-O 键}',
        correctAnswerSummary: `${val} ${effectiveUnit} SiO₂ 晶体中含有 ${bondsMoles.toFixed(2)} N_A 个 Si-O 共价键`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '环境', pass: true, finding: '固态晶体' },
          { stepName: '二审状态', checkTarget: '状态', pass: true, finding: '共价晶体' },
          { stepName: '三审结构', checkTarget: '网状结构', pass: false, finding: '每个 Si 形成 4 个 Si-O 键 ➔ 4 mol 共价键！' },
          { stepName: '四审过程', checkTarget: '变化', pass: true, finding: '无' },
          { stepName: '五审电子', checkTarget: '电子', pass: true, finding: '30 mol 电子/mol SiO₂' },
        ],
      }
    }

    case 'Na2O2': {
      // 1 mol Na2O2 (78 g) 含有 2 mol Na+ 和 1 mol O2^2- 阴离子（阴阳离子比 1:2）
      // O2^2- 内部存在 1 mol O-O 非极性共价键
      const molesNa2O2 = effectiveUnit === 'g' ? val / 78 : val
      return {
        title: 'Na₂O₂ (过氧化钠) 离子与共价键统计陷阱',
        subtitle: '1 mol Na₂O₂ (78 g) 含有 2 mol Na⁺、1 mol O₂²⁻ 阴离子及 1 mol O-O 共价键',
        isStateGas: false,
        physicalState: '固态',
        vmValue: 22.4,
        particleStats: [
          { label: '阴离子数 (O₂²⁻)', theoreticalMoles: molesNa2O2 * 2, actualMoles: molesNa2O2, unit: 'N_A', isTrap: true, trapExplanation: '错把 O₂²⁻ 拆成 2 个 O⁻ 阴离子！1 mol Na₂O₂ 仅含 1 mol O₂²⁻ 阴离子 (阳:阴 = 2:1，阴:阳 = 1:2)。' },
          { label: 'O-O 共价键数', theoreticalMoles: molesNa2O2 * 2, actualMoles: molesNa2O2, unit: 'N_A', isTrap: false },
          { label: '阳离子数 (Na⁺)', theoreticalMoles: molesNa2O2 * 2, actualMoles: molesNa2O2 * 2, unit: 'N_A', isTrap: false },
        ],
        trapType: '过氧化物阴阳离子配比与键数陷阱',
        trapBadge: '阳:阴 2:1 (阴:阳 1:2)',
        trapLevel: 'high',
        keyPointAnalysis: [
          'Na₂O₂ 是离子晶体，由 Na⁺ 和 O₂²⁻ 构成。',
          '1 mol Na₂O₂ 含有 2 mol Na⁺ 阳离子，1 mol O₂²⁻ 阴离子（阳离子与阴离子个数比为 2:1，阴离子与阳离子个数比为 1:2）。',
          'O₂²⁻ 过氧根离子内部存在 1 mol O-O 非极性共价键。',
        ],
        formulaLatex: '1 \\text{ mol Na}_2\\text{O}_2 \\implies 2 \\text{ mol Na}^+ + 1 \\text{ mol O}_2^{2-} \\text{ (含 1 mol O-O 键)}',
        correctAnswerSummary: `${val} ${effectiveUnit} Na₂O₂ 含有 ${molesNa2O2.toFixed(2)} N_A 个 O₂²⁻ 阴离子和 ${molesNa2O2.toFixed(2)} N_A 个 O-O 键`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '环境', pass: true, finding: '固态' },
          { stepName: '二审状态', checkTarget: '晶体', pass: true, finding: '离子晶体' },
          { stepName: '三审结构', checkTarget: '过氧根离子整体性', pass: false, finding: 'O₂²⁻ 为整体阴离子 ➔ 阳:阴=2:1（阴:阳=1:2）！' },
          { stepName: '四审过程', checkTarget: '变化', pass: true, finding: '无' },
          { stepName: '五审电子', checkTarget: '电子', pass: true, finding: '38 mol 电子/mol Na₂O₂' },
        ],
      }
    }

    case 'NH4Cl': {
      // 1 mol NH4Cl 由 1 mol NH4+ 和 1 mol Cl- 构成（离子晶体，含 2 mol 阴阳离子，以离子键结合，不称“1 mol 离子键条数”）
      // NH4+ 内部含 3 mol N-H 极性共价键和 1 mol N->H 配位键（共价键总计 4 mol）
      // 与其余 case 统一使用 effectiveUnit（unit === 'L' 时兜底按 mol 计），避免口径不一
      const molesNH4Cl = effectiveUnit === 'g' ? val / 53.5 : val
      return {
        title: 'NH₄Cl (氯化铵) 化学键类型与离子数拆解',
        subtitle: '1 mol NH₄Cl 含有 4 mol 共价键 (含 1 mol 配位键)，并由 1 mol NH₄⁺ 与 1 mol Cl⁻ 构成',
        isStateGas: false,
        physicalState: '固态',
        vmValue: 22.4,
        particleStats: [
          { label: 'N-H 共价键总数', theoreticalMoles: molesNH4Cl * 4, actualMoles: molesNH4Cl * 4, unit: 'N_A', isTrap: false },
          { label: '配位键数', theoreticalMoles: molesNH4Cl, actualMoles: molesNH4Cl, unit: 'N_A', isTrap: false },
          { label: 'NH₄⁺ 与 Cl⁻ 离子总数', theoreticalMoles: molesNH4Cl * 2, actualMoles: molesNH4Cl * 2, unit: 'N_A', isTrap: false },
        ],
        trapType: '配合物/铵盐键型分类',
        trapBadge: '含 1 mol 配位键',
        trapLevel: 'medium',
        keyPointAnalysis: [
          'NH₄Cl 是离子晶体，由 NH₄⁺ 和 Cl⁻ 通过离子键结合（共含 2 mol 阴阳离子），既有离子键又有共价键。',
          'NH₄⁺ 内部含有 3 个 N-H 普通极性共价键和 1 个 N➔H 配位键（4 个 N-H 键键长与性质完全等效，共价键总数为 4 N_A）。',
        ],
        formulaLatex: '1 \\text{ mol NH}_4\\text{Cl} \\implies 4 \\text{ mol 共价键 (含 1 mol 配位键)} + \\text{NH}_4^+/\\text{Cl}^- \\text{离子晶体}',
        correctAnswerSummary: `${val} ${effectiveUnit} NH₄Cl 含有 ${(molesNH4Cl * 4).toFixed(2)} N_A 个共价键 (含 ${molesNH4Cl.toFixed(2)} N_A 配位键)，共 ${(molesNH4Cl * 2).toFixed(2)} N_A 个阴阳离子`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '环境', pass: true, finding: '固态' },
          { stepName: '二审状态', checkTarget: '晶体', pass: true, finding: '离子晶体' },
          { stepName: '三审结构', checkTarget: '配位键识别', pass: true, finding: 'NH₄⁺ 含有 1 个配位键（四键完全等效）' },
          { stepName: '四审过程', checkTarget: '变化', pass: true, finding: '无' },
          { stepName: '五审电子', checkTarget: '电子', pass: true, finding: '28 mol 电子' },
        ],
      }
    }

    case 'diamond': {
      const moles = effectiveUnit === 'g' ? val / 12 : val
      return {
        title: '金刚石 (C) 晶体均摊键数统计',
        subtitle: '1 mol C (12 g 金刚石) 形成 2 mol C-C 单键（sp³ 正四面体网状）',
        isStateGas: false,
        physicalState: '固态',
        vmValue: 22.4,
        particleStats: [
          {
            label: 'C-C 共价键数 (金刚石)',
            theoreticalMoles: moles * 4,
            actualMoles: moles * 2,
            unit: 'N_A',
            isTrap: true,
            trapExplanation: '每个 C 原子与 4 个 C 相连，每条 C-C 键由 2 个 C 共用 ➔ 4 × 1/2 = 2 mol 键！',
          },
        ],
        trapType: '共价晶体均摊键数陷阱',
        trapBadge: '1 mol C = 2 mol 键',
        trapLevel: 'high',
        keyPointAnalysis: [
          '金刚石为三维正四面体共价晶体，碳原子采用 sp³ 杂化，每个 C 形成 4 个 C-C 单键。',
          '均摊法：1 mol C (12 g 金刚石) 含 4 × 1/2 = 2 mol C-C 键。',
        ],
        formulaLatex: '\\text{金刚石: } 1 \\text{ mol C } (12 \\text{ g}) \\implies 4 \\times \\frac{1}{2} = 2 \\text{ mol C-C 键}',
        correctAnswerSummary: `${val} ${effectiveUnit} 金刚石含有 ${(moles * 2).toFixed(2)} N_A 个 C-C 键`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '环境', pass: true, finding: '固态' },
          { stepName: '二审状态', checkTarget: '晶体', pass: true, finding: '共价晶体' },
          { stepName: '三审结构', checkTarget: '均摊计算', pass: false, finding: '每个 C 连 4 键，均摊系数 1/2 ➔ 2 mol 键！' },
          { stepName: '四审过程', checkTarget: '变化', pass: true, finding: '无' },
          { stepName: '五审电子', checkTarget: '价电子', pass: true, finding: 'sp³ 杂化无自由移动电子' },
        ],
      }
    }

    case 'graphite':
    default: {
      const moles = effectiveUnit === 'g' ? val / 12 : val
      return {
        title: '石墨 (C) 层状晶体均摊键数统计',
        subtitle: '1 mol C (12 g 石墨) 层内形成 1.5 mol C-C 键（sp² 层状混合晶体）',
        isStateGas: false,
        physicalState: '固态',
        vmValue: 22.4,
        particleStats: [
          {
            label: 'C-C 共价键数 (石墨)',
            theoreticalMoles: moles * 3,
            actualMoles: moles * 1.5,
            unit: 'N_A',
            isTrap: true,
            trapExplanation: '石墨层内每个 C 与 3 个 C 相连，每条键由 2 个 C 共用 ➔ 3 × 1/2 = 1.5 mol 键！',
          },
        ],
        trapType: '混合晶体均摊键数陷阱',
        trapBadge: '1 mol C = 1.5 mol 键',
        trapLevel: 'high',
        keyPointAnalysis: [
          '石墨呈平面六元环网状，碳原子采用 sp² 杂化，每个 C 与 3 个相邻 C 成键。',
          '均摊法：1 mol C (12 g 石墨) 含 3 × 1/2 = 1.5 mol C-C 键（同时每个六元环平均占 2 个 C 原子、3 条 C-C 键）。',
        ],
        formulaLatex: '\\text{石墨: } 1 \\text{ mol C } (12 \\text{ g}) \\implies 3 \\times \\frac{1}{2} = 1.5 \\text{ mol C-C 键}',
        correctAnswerSummary: `${val} ${effectiveUnit} 石墨含有 ${(moles * 1.5).toFixed(2)} N_A 个 C-C 键`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '环境', pass: true, finding: '固态' },
          { stepName: '二审状态', checkTarget: '晶体', pass: true, finding: '混合晶体（层状晶体）' },
          { stepName: '三审结构', checkTarget: '均摊计算', pass: false, finding: '每个 C 连 3 键，均摊系数 1/2 ➔ 1.5 mol 键！' },
          { stepName: '四审过程', checkTarget: '变化', pass: true, finding: '无' },
          { stepName: '五审电子', checkTarget: '价电子', pass: true, finding: 'sp² 杂化含层内离域大 π 键自由电子（可导电）' },
        ],
      }
    }
  }
}
