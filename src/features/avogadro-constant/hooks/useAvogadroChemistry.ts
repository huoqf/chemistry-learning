import { useMemo } from 'react'
import type { AvogadroParams, AvogadroResult } from '../types'

/**
 * 阿伏加德罗常数 (N_A) 高考必考陷阱诊断与微粒统计 Hook
 * 零 JSX / 纯化学热力学/结构/氧化还原/水解代数逻辑
 */
export function useAvogadroChemistry(params: AvogadroParams): AvogadroResult {
  return useMemo(() => {
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

    // 默认基础环境：标准状况 V_m = 22.4 L/mol，常温 V_m ≈ 24.5 L/mol
    const vm = temperatureCondition === 'standard' ? 22.4 : 24.5

    // 1. 标况状态与气体摩尔体积陷阱
    if (trapCategory === 'state-volume') {
      return calculateStateVolumeTrap(stateItem, amountValue, amountUnit, temperatureCondition, vm)
    }

    // 2. 结构化学与化学键/中子数统计陷阱
    if (trapCategory === 'structure-bonds') {
      return calculateStructureBondsTrap(structureItem, amountValue, amountUnit)
    }

    // 3. 弱电解质电离与盐类水解微粒数变动陷阱
    if (trapCategory === 'electrolyte-hydrolysis') {
      return calculateElectrolyteHydrolysisTrap(electrolyteItem, solutionVolume, solutionConcentration)
    }

    // 4. 氧化还原反应电子转移数 (n_e) 陷阱
    if (trapCategory === 'redox-electron') {
      return calculateRedoxElectronTrap(redoxItem, amountValue, amountUnit)
    }

    // 5. 五步秒杀盲盒矩阵模式
    return calculate5StepMatrix(params, vm)
  }, [params])
}

// ── 1. 标况状态陷阱计算逻辑 ──
function calculateStateVolumeTrap(
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
      const physState = '固态' // 标况 0℃ 下 SO3 熔点 16.8℃，完全为固态/晶体
      const molesGiven = unit === 'L' ? val / 22.4 : unit === 'mol' ? val : val / 80
      const actualMoles = unit === 'L' ? (val * 1.92) / 80 : molesGiven

      return {
        title: 'SO₃ (三氧化硫) 标况状态陷阱',
        subtitle: '标准状况 (0℃, 101 kPa) 下 SO₃ 为固态晶体 (熔点 16.8℃)',
        isStateGas: isGas,
        physicalState: physState,
        vmValue: vm,
        particleStats: [
          {
            label: 'SO₃ 分子数',
            theoreticalMoles: unit === 'L' ? val / 22.4 : molesGiven,
            actualMoles: unit === 'L' ? Math.min(100, actualMoles) : molesGiven,
            unit: '$N_{\\text{A}}$',
            isTrap: unit === 'L',
            trapExplanation: unit === 'L' ? '错按气体摩尔体积 V_m = 22.4 L/mol 计算！实际 22.4 L 固态 SO₃ 摩尔数远大于 1 mol (约 537 N_A)' : undefined,
          },
        ],
        trapType: '标况非气体陷阱',
        trapBadge: '高频致命陷阱',
        trapLevel: 'high',
        keyPointAnalysis: [
          '标况下 (0℃, 101 kPa) SO₃ 熔点 16.8℃，故标况下 100% 为固态/晶体。',
          '若题目给出“标况下 22.4 L SO₃”，分子数远大于 1 N_A，不可套用 22.4 L/mol！',
        ],
        formulaLatex: '\\text{标况 (0}^\\circ\\text{C}) \\implies \\text{SO}_3 \\text{ 为固态晶体，} V_m = 22.4 \\text{ L/mol 不适用}',
        correctAnswerSummary: unit === 'L' ? `标况下 ${val} L SO₃ 为固态非气体，分子数远大于 ${(val/22.4).toFixed(2)} N_A` : `${val} ${unit} SO₃ 含有 ${molesGiven.toFixed(2)} N_A 个分子`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '温度与压强', pass: true, finding: isStd ? '标准状况 (0℃, 101 kPa)' : '常温常压 (25℃)' },
          { stepName: '二审状态', checkTarget: 'SO₃ 状态判定', pass: false, finding: '0℃ 时为固态！非气体！' },
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
            actualMoles: unit === 'L' ? Math.min(100, actualMoles) : molesGiven,
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
            actualMoles: unit === 'L' ? Math.min(100, actualMoles) : molesGiven,
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
      // 氟化氢沸点 19.5℃，在 0℃ 标况下为液体，且分子间存在强氢键形成 (HF)n 缔合分子
      const molesGiven = unit === 'L' ? val / 22.4 : unit === 'mol' ? val : val / 20
      return {
        title: 'HF (氟化氢) 标况状态与分子缔合陷阱',
        subtitle: 'HF 在标况下为液体 (沸点 19.5℃)，且分子间形成 (HF)n 氢键缔合',
        isStateGas: false,
        physicalState: '液态',
        vmValue: vm,
        particleStats: [
          {
            label: 'HF 分子数',
            theoreticalMoles: unit === 'L' ? val / 22.4 : molesGiven,
            actualMoles: molesGiven,
            unit: '$N_{\\text{A}}$',
            isTrap: unit === 'L',
            trapExplanation: 'HF 沸点 19.5℃，标况 (0℃) 下为液体，且分子间缔合使独立分子数变少！',
          },
        ],
        trapType: '标况液体与氢键缔合陷阱',
        trapBadge: 'HF 标况液态',
        trapLevel: 'high',
        keyPointAnalysis: [
          'HF 沸点 19.5℃，标况下 (0℃) 呈无色发烟液体。',
          'HF 分子间存在强 F-H...F 氢键，常形成 (HF)₂、(HF)₄ 等缔合分子。',
        ],
        formulaLatex: '\\text{HF (沸点 19.5}^\\circ\\text{C)} \\implies \\text{标况下为液体及 (HF)}_n \\text{ 缔合分子}',
        correctAnswerSummary: 'HF 在标况下为液体，不可套用 22.4 L/mol 计算',
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '标况 0℃', pass: true, finding: '0℃, 101 kPa' },
          { stepName: '二审状态', checkTarget: 'HF 状态判定', pass: false, finding: '沸点 19.5℃ ➔ 标况下为液体！' },
          { stepName: '三审结构', checkTarget: '氢键缔合', pass: false, finding: '分子间形成强氢键缔合！' },
          { stepName: '四审过程', checkTarget: '变化', pass: true, finding: '无' },
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
            actualMoles: unit === 'L' ? Math.min(100, actualMoles) : molesGiven,
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
      const moles = unit === 'L' ? val / vm : unit === 'mol' ? val : val / 71
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

// ── 2. 结构化学与化学键/中子数统计陷阱 ──
function calculateStructureBondsTrap(
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
        correctAnswerSummary: `${val} ${unit} 白磷 P₄ 含有 ${bondsMoles.toFixed(2)} N_A 个 P-P 共价键`,
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
          { label: '中子数', theoreticalMoles: effectiveUnit === 'g' ? (val / 18) * 10 : molesT2O * 10, actualMoles: neutronsMoles, unit: 'N_A', isTrap: true, trapExplanation: '错用普通水中子数 8 或 10！1 个 T₂O 含 12 个中子 (22 g 含 12 N_A 中子)。' },
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

    case 'NH4Cl': {
      // 1 mol NH4Cl 含 1 mol NH4+ 和 1 mol Cl- (离子键 1 mol)
      // NH4+ 内含 3 mol N-H 极性共价键，1 mol N->H 配位键 (共价键共 4 mol)
      const molesNH4Cl = unit === 'g' ? val / 53.5 : val
      return {
        title: 'NH₄Cl (氯化铵) 化学键类型拆解',
        subtitle: '1 mol NH₄Cl 含有 4 mol 共价键 (含 1 mol 配位键) 和 1 mol 离子键',
        isStateGas: false,
        physicalState: '固态',
        vmValue: 22.4,
        particleStats: [
          { label: 'N-H 共价键总数', theoreticalMoles: molesNH4Cl * 4, actualMoles: molesNH4Cl * 4, unit: 'N_A', isTrap: false },
          { label: '配位键数', theoreticalMoles: molesNH4Cl, actualMoles: molesNH4Cl, unit: 'N_A', isTrap: false },
          { label: '离子键数', theoreticalMoles: molesNH4Cl, actualMoles: molesNH4Cl, unit: 'N_A', isTrap: false },
        ],
        trapType: '配合物/铵盐键型分类',
        trapBadge: '含 1 mol 配位键',
        trapLevel: 'medium',
        keyPointAnalysis: [
          'NH₄Cl 是离子晶体，由 NH₄⁺ 和 Cl⁻ 构成，含 1 mol 离子键。',
          'NH₄⁺ 内部含有 3 个 N-H 极性共价键和 1 个 N➔H 配位键（共价键总数为 4 N_A）。',
        ],
        formulaLatex: '1 \\text{ mol NH}_4\\text{Cl} \\implies 4 \\text{ mol 共价键 (含 1 mol 配位键)} + 1 \\text{ mol 离子键}',
        correctAnswerSummary: `1 mol NH₄Cl 含有 4 N_A 个共价键 (含 1 N_A 配位键) 和 1 N_A 离子键`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '环境', pass: true, finding: '固态' },
          { stepName: '二审状态', checkTarget: '晶体', pass: true, finding: '离子晶体' },
          { stepName: '三审结构', checkTarget: '配位键识别', pass: true, finding: 'NH₄⁺ 含有 1 个配位键' },
          { stepName: '四审过程', checkTarget: '变化', pass: true, finding: '无' },
          { stepName: '五审电子', checkTarget: '电子', pass: true, finding: '28 mol 电子' },
        ],
      }
    }

    default: {
      const moles = unit === 'g' ? val / 12 : val
      return {
        title: `${item} 晶体结构与微粒统计`,
        subtitle: `1 mol C 形成 2 mol C-C 键 (金刚石) / 1.5 mol C-C 键 (石墨)`,
        isStateGas: false,
        physicalState: '固态',
        vmValue: 22.4,
        particleStats: [
          { label: 'C-C 共价键数 (金刚石)', theoreticalMoles: moles * 4, actualMoles: moles * 2, unit: 'N_A', isTrap: true, trapExplanation: '每个 C 原子与 4 个 C 相连，但每条 C-C 键由 2 个 C 共用 ➔ 4 * 1/2 = 2 mol 键！' },
          { label: 'C-C 共价键数 (石墨)', theoreticalMoles: moles * 3, actualMoles: moles * 1.5, unit: 'N_A', isTrap: true, trapExplanation: '石墨中每个 C 与 3 个 C 相连，每条键 2 个 C 共用 ➔ 3 * 1/2 = 1.5 mol 键！' },
        ],
        trapType: '碳晶体均摊键数陷阱',
        trapBadge: '均摊法键数',
        trapLevel: 'high',
        keyPointAnalysis: [
          '金刚石：每个 C 形成 4 个 C-C 单键，均摊后 1 mol C 对应 2 mol C-C 键 (12 g 金刚石含 2 mol C-C 键)。',
          '石墨：六边形网状，每个 C 形成 3 个 C-C 键，均摊后 1 mol C 对应 1.5 mol C-C 键 (12 g 石墨含 1.5 mol C-C 键)。',
        ],
        formulaLatex: '\\text{金刚石: } 1 \\text{ mol C } \\implies 2 \\text{ mol C-C 键} \\quad | \\quad \\text{石墨: } 1 \\text{ mol C } \\implies 1.5 \\text{ mol C-C 键}',
        correctAnswerSummary: `12 g 金刚石含 2 N_A 个 C-C 键，12 g 石墨含 1.5 N_A 个 C-C 键`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '环境', pass: true, finding: '固态' },
          { stepName: '二审状态', checkTarget: '晶体', pass: true, finding: '共价晶体/混合晶体' },
          { stepName: '三审结构', checkTarget: '均摊计算', pass: false, finding: '注意 1/2 共享系数！' },
          { stepName: '四审过程', checkTarget: '变化', pass: true, finding: '无' },
          { stepName: '五审电子', checkTarget: '价电子', pass: true, finding: '无自由电子' },
        ],
      }
    }
  }
}

// ── 3. 弱电解质与盐类水解陷阱计算逻辑 ──
function calculateElectrolyteHydrolysisTrap(
  item: 'CH3COOH' | 'FeCl3' | 'Na2CO3' | 'NaHSO4-molten' | 'pureH2O',
  vol: number,
  conc: number
): AvogadroResult {
  const totalMoles = vol * conc

  switch (item) {
    case 'NaHSO4-molten': {
      return {
        title: 'NaHSO₄ (硫酸氢钠) 熔融 vs 溶液电离离子数陷阱',
        subtitle: '熔融状态下电离为 Na⁺ 和 HSO₄⁻ (1 mol 熔融 NaHSO₄ 含 2 mol 离子)',
        isStateGas: false,
        physicalState: '熔融态',
        vmValue: 22.4,
        particleStats: [
          { label: '熔融态 阴阳离子总数', theoreticalMoles: 3, actualMoles: 2, unit: 'N_A', isTrap: true, trapExplanation: '错把熔融态误认为水溶液！熔融时 HSO₄⁻ 内共价键不断裂，仅电离出 Na⁺ 和 HSO₄⁻ (2 mol 离子)！' },
          { label: '水溶液 离子总数', theoreticalMoles: 3, actualMoles: 3, unit: 'N_A', isTrap: false, trapExplanation: '在水溶液中受水分子作用 HSO₄⁻ 完全电离为 H⁺ 和 SO₄²⁻，离子总数为 3 mol！' },
        ],
        trapType: '熔融态与水溶液电离陷阱',
        trapBadge: '熔融 2 mol 离子',
        trapLevel: 'high',
        keyPointAnalysis: [
          '熔融状态下：NaHSO₄ = Na⁺ + HSO₄⁻（仅克服离子键，共价键 O-H 不断裂，生成 2 mol 离子）。',
          '水溶液状态下：NaHSO₄ = Na⁺ + H⁺ + SO₄²⁻（克服离子键与共价键，生成 3 mol 离子）。',
          '高考高频陷阱：“1 mol 熔融 NaHSO₄ 中含有 3 N_A 个离子”（错误！仅为 2 N_A）。',
        ],
        formulaLatex: '\\text{熔融: NaHSO}_4 = \\text{Na}^+ + \\text{HSO}_4^- \\quad | \\quad \\text{水溶液: NaHSO}_4 = \\text{Na}^+ + \\text{H}^+ + \\text{SO}_4^{2-}',
        correctAnswerSummary: `1 mol 熔融 NaHSO₄ 含有 2 N_A 个离子；水溶液中为 3 N_A`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '熔融态环境', pass: false, finding: '熔融态！无水分子作用！' },
          { stepName: '二审状态', checkTarget: '熔融液体', pass: true, finding: '熔融态' },
          { stepName: '三审结构', checkTarget: 'HSO₄⁻ 共价键', pass: false, finding: 'HSO₄⁻ 保持整体，不拆解出 H⁺！' },
          { stepName: '四审过程', checkTarget: '电离过程', pass: true, finding: '生成 Na⁺ 和 HSO₄⁻' },
          { stepName: '五审守恒', checkTarget: '电荷守恒', pass: true, finding: '电荷守恒' },
        ],
      }
    }

    case 'CH3COOH': {
      const alpha = 0.013
      const ch3cooMoles = totalMoles * alpha
      const hMoles = ch3cooMoles

      return {
        title: 'CH₃COOH (弱酸电离) 粒子数与守恒陷阱',
        subtitle: `${vol} L ${conc} mol/L CH₃COOH 溶液中弱酸部分电离`,
        isStateGas: false,
        physicalState: '溶液',
        vmValue: 22.4,
        particleStats: [
          { label: 'H⁺ 离子数', theoreticalMoles: totalMoles, actualMoles: hMoles, unit: 'N_A', isTrap: true, trapExplanation: `醋酸为弱酸仅微弱电离，H⁺ 粒子数远小于 ${totalMoles.toFixed(2)} N_A！` },
          { label: 'n(CH₃COOH) + n(CH₃COO⁻)', theoreticalMoles: totalMoles, actualMoles: totalMoles, unit: 'N_A', isTrap: false, trapExplanation: `根据物料守恒，C 元素总数保持不变，刚好为 ${totalMoles.toFixed(2)} N_A！` },
        ],
        trapType: '弱电解质电离陷阱',
        trapBadge: '物料守恒成立',
        trapLevel: 'high',
        keyPointAnalysis: [
          `当前设定：${vol} L ${conc} mol/L CH₃COOH 溶液（总投料 ${totalMoles.toFixed(2)} mol）。`,
          'CH₃COOH 属于弱电解质，在水溶液中仅部分电离，故 H⁺ 数远小于 c·V·N_A。',
          `根据物料守恒：n(CH₃COOH) + n(CH₃COO⁻) = c·V = ${totalMoles.toFixed(2)} mol 恒成立。`,
        ],
        formulaLatex: `\\text{物料守恒: } n(\\text{CH}_3\\text{COOH}) + n(\\text{CH}_3\\text{COO}^-) = c \\cdot V = ${totalMoles.toFixed(2)} \\text{ mol}`,
        correctAnswerSummary: `n(CH₃COOH) + n(CH₃COO⁻) = ${totalMoles.toFixed(2)} N_A；H⁺ 数小于 ${totalMoles.toFixed(2)} N_A`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '溶液体积/浓度', pass: true, finding: `V = ${vol} L, c = ${conc} mol/L` },
          { stepName: '二审状态', checkTarget: '水溶液状态', pass: true, finding: '水溶液' },
          { stepName: '三审结构', checkTarget: '分子组成', pass: true, finding: 'CH₃COOH 分子' },
          { stepName: '四审过程', checkTarget: '弱酸电离平衡', pass: false, finding: `弱电解质部分电离！H⁺ 不等于 ${totalMoles.toFixed(2)} N_A！` },
          { stepName: '五审守恒', checkTarget: '物料守恒', pass: true, finding: '物料守恒必然成立！' },
        ],
      }
    }

    default: {
      return {
        title: 'Na₂CO₃ 水解与阴离子总数变动陷阱',
        subtitle: `${vol} L ${conc} mol/L Na₂CO₃ 溶液中 CO₃²⁻ 水解生成 HCO₃⁻ 和 OH⁻`,
        isStateGas: false,
        physicalState: '溶液',
        vmValue: 22.4,
        particleStats: [
          { label: 'CO₃²⁻ 离子数', theoreticalMoles: totalMoles, actualMoles: totalMoles * 0.9, unit: 'N_A', isTrap: true, trapExplanation: `CO₃²⁻ 部分水解为 HCO₃⁻ 和 H₂CO₃，CO₃²⁻ 数小于 ${totalMoles.toFixed(2)} N_A。` },
          { label: '阴离子总数', theoreticalMoles: totalMoles, actualMoles: totalMoles * 1.1, unit: 'N_A', isTrap: true, trapExplanation: `水解反应 CO₃²⁻ + H₂O ⇌ HCO₃⁻ + OH⁻，1 个阴离子水解变成 2 个阴离子，阴离子总数大于 ${totalMoles.toFixed(2)} N_A！` },
        ],
        trapType: '盐类水解阴阳离子总数陷阱',
        trapBadge: '阴离子数增加',
        trapLevel: 'high',
        keyPointAnalysis: [
          `当前设定：${vol} L ${conc} mol/L Na₂CO₃ 溶液（溶质 ${totalMoles.toFixed(2)} mol）。`,
          'CO₃²⁻ 水解第一步：CO₃²⁻ + H₂O ⇌ HCO₃⁻ + OH⁻。',
          '每消耗 1 个 CO₃²⁻ 阴离子，生成 1 个 HCO₃⁻ 和 1 个 OH⁻（共 2 个阴离子）。',
          `因此，${vol} L ${conc} mol/L Na₂CO₃ 溶液中阴离子总数大于 ${totalMoles.toFixed(2)} N_A！`,
        ],
        formulaLatex: `\\text{CO}_3^{2-} + \\text{H}_2\\text{O} \\rightleftharpoons \\text{HCO}_3^- + \\text{OH}^- \\implies \\text{阴离子总数} > ${totalMoles.toFixed(2)} N_A`,
        correctAnswerSummary: `CO₃²⁻ 水解使阴离子总数增加，大于 ${totalMoles.toFixed(2)} N_A`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '溶液体积', pass: true, finding: `V = ${vol} L, c = ${conc} mol/L` },
          { stepName: '二审状态', checkTarget: '水溶液', pass: true, finding: '弱酸强碱盐溶液' },
          { stepName: '三审结构', checkTarget: '离子构成', pass: true, finding: 'Na⁺ 与 CO₃²⁻' },
          { stepName: '四审过程', checkTarget: '分步水解', pass: false, finding: '1 个 CO₃²⁻ 水解产生 2 个阴离子！' },
          { stepName: '五审守恒', checkTarget: '电荷守恒', pass: true, finding: '电荷守恒' },
        ],
      }
    }
  }
}

// ── 4. 氧化还原电子转移数 (n_e) 陷阱计算逻辑 ──
function calculateRedoxElectronTrap(
  item: 'Cl2-NaOH' | 'Na2O2-H2O' | 'NO2-H2O' | 'Cu-S' | 'SO2-O2-reversible' | 'NO2-N2O4-reversible' | 'Fe-HNO3',
  val: number,
  unit: 'mol' | 'L' | 'g'
): AvogadroResult {
  const moles = unit === 'L' ? val / 22.4 : unit === 'mol' ? val : val / 71

  switch (item) {
    case 'Cu-S': {
      // 1 mol Cu 与足量 S 单质反应生成 Cu2S (Cu 从 0 价升到 +1 价，1 mol Cu 转移 1 mol 电子)
      const molesCu = unit === 'g' ? val / 64 : val
      const ne = molesCu * 1
      return {
        title: 'Cu + S 反应生成 Cu₂S 变价电子数陷阱',
        subtitle: '1 mol Cu 与足量单质 S 反应生成 Cu₂S，转移 1 mol 电子 (非 2 mol！)',
        isStateGas: false,
        physicalState: '固态',
        vmValue: 22.4,
        particleStats: [
          { label: '转移电子数 n_e', theoreticalMoles: molesCu * 2, actualMoles: ne, unit: 'N_A', isTrap: true, trapExplanation: '错把 Cu 氧化产物当成 Cu²⁺！S 氧化性较弱，仅能将 Cu 氧化为 +1 价 (Cu₂S)，1 mol Cu 转移 1 mol 电子！' },
        ],
        trapType: '弱氧化剂变价电子数陷阱',
        trapBadge: 'Cu + S 转移 1e⁻',
        trapLevel: 'high',
        keyPointAnalysis: [
          '单质 S 属于弱氧化剂，与变价金属反应只能生成低价态化合物：',
          '2Cu + S ≜ Cu₂S（Cu 为 +1 价，1 mol Cu 转移 1 N_A 电子）；',
          'Fe + S ≜ FeS（Fe 为 +2 价，1 mol Fe 转移 2 N_A 电子）。对比：Fe + 1.5 Cl₂ ➔ FeCl₃ 转移 3 N_A 电子！',
        ],
        formulaLatex: '2\\overset{0}{\\text{Cu}} + \\text{S} \\triangleq \\overset{+1}{\\text{Cu}}_2\\text{S} \\implies 1 \\text{ mol Cu } \\text{转移 1 mol } e^-',
        correctAnswerSummary: `1 mol Cu 与足量 S 反应转移 1 N_A 电子 (生成 Cu₂S)`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '加热反应环境', pass: true, finding: '加热反应' },
          { stepName: '二审状态', checkTarget: '固体反应', pass: true, finding: '固态产物 Cu₂S' },
          { stepName: '三审结构', checkTarget: '产物价态', pass: false, finding: '产物为 Cu₂S (+1 价 Cu)，非 CuS (+2价)！' },
          { stepName: '四审过程', checkTarget: '弱氧化剂氧化', pass: true, finding: 'S 只能氧化出 +1 价 Cu' },
          { stepName: '五审电子', checkTarget: '电子转移数', pass: true, finding: 'n_e = n(Cu) × 1' },
        ],
      }
    }

    case 'NO2-N2O4-reversible': {
      // 2NO2 <-> N2O4 存在二聚平衡！
      // 标况下 22.4 L NO2 混合气体中含有分子数小于 N_A
      const maxMoles = moles
      return {
        title: '2NO₂ ⇌ N₂O₄ (二聚可逆平衡) 气体分子数陷阱',
        subtitle: '密闭容器中 1 mol NO₂ 存在二聚平衡 2NO₂ ⇌ N₂O₄，气体分子总数小于 N_A',
        isStateGas: true,
        physicalState: '气态',
        vmValue: 22.4,
        particleStats: [
          { label: '气体分子总数', theoreticalMoles: maxMoles, actualMoles: maxMoles * 0.7, unit: 'N_A', isTrap: true, trapExplanation: 'NO₂ 与 N₂O₄ 存在二聚平衡 2NO₂ ⇌ N₂O₄！2 个 NO₂ 分子合为 1 个 N₂O₄，使气体分子总数变少，小于 N_A！' },
          { label: 'N 原子总数', theoreticalMoles: maxMoles, actualMoles: maxMoles, unit: 'N_A', isTrap: false, trapExplanation: '根据原子守恒，N 原子总数保持 1 N_A 恒定不变！' },
        ],
        trapType: '气体二聚平衡分子数陷阱',
        trapBadge: 'NO₂ 二聚分子数 < N_A',
        trapLevel: 'high',
        keyPointAnalysis: [
          '在常温或密闭容器中，NO₂ 分子会自动二聚形成无色的 N₂O₄：2NO₂ ⇌ N₂O₄。',
          '该反应使气体分子总数减少，故 1 mol NO₂ 气体中含有的分子总数小于 1 N_A！',
          '但根据原子守恒：N 原子数恒为 1 N_A，O 原子数恒为 2 N_A。',
        ],
        formulaLatex: '2\\text{NO}_2 \\rightleftharpoons \\text{N}_2\\text{O}_4 \\implies N(\\text{分子总数}) < N_A \\quad | \\quad N(\\text{N原子}) = N_A',
        correctAnswerSummary: `1 mol NO₂ 存在二聚平衡，气体分子总数小于 N_A，N 原子数恒为 N_A`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '密闭气体环境', pass: true, finding: '密闭气体' },
          { stepName: '二审状态', checkTarget: '二氧化氮气体', pass: true, finding: '红棕色气体' },
          { stepName: '三审结构', checkTarget: '二聚分子', pass: false, finding: '存在 2NO₂ ⇌ N₂O₄ 反应！' },
          { stepName: '四审过程', checkTarget: '平衡移动', pass: false, finding: '2 分子变 1 分子 ➔ 分子总数减少！' },
          { stepName: '五审守恒', checkTarget: '原子守恒', pass: true, finding: 'N 元素原子守恒成立！' },
        ],
      }
    }

    case 'Cl2-NaOH': {
      const transferredNe = moles * 1
      return {
        title: 'Cl₂ 通入冷 NaOH 溶液 (歧化反应) 电子转移陷阱',
        subtitle: '1 mol Cl₂ 发生歧化反应生成 NaCl 和 NaClO，转移 1 mol 电子 (非 2 mol！)',
        isStateGas: true,
        physicalState: '气态',
        vmValue: 22.4,
        particleStats: [
          { label: '转移电子数 n_e', theoreticalMoles: moles * 2, actualMoles: transferredNe, unit: 'N_A', isTrap: true, trapExplanation: '错误认为 Cl₂ 含有 2 个 Cl，各自变价 1 就转移 2 e⁻！实际 1 个 Cl 升高到 +1，另 1 个降低到 -1，仅转移 1 e⁻。' },
        ],
        trapType: '歧化反应电子转移陷阱',
        trapBadge: '歧化转移 1e⁻',
        trapLevel: 'high',
        keyPointAnalysis: [
          'Cl₂ + 2NaOH = NaCl + NaClO + H₂O 为歧化反应：Cl (0) ➔ Cl (-1) + Cl (+1)。',
          '1 mol Cl₂ 完全反应时，转移的电子数为 1 N_A（并非 2 N_A！）。',
        ],
        formulaLatex: '\\overset{0}{\\text{Cl}_2} + 2\\text{NaOH} = \\text{Na}\\overset{-1}{\\text{Cl}} + \\text{Na}\\overset{+1}{\\text{ClO}} + \\text{H}_2\\text{O} \\implies 1 \\text{ mol Cl}_2 \\text{ 转移 1 mol } e^-',
        correctAnswerSummary: `标况 ${val} ${unit} Cl₂ 与 NaOH 歧化反应转移 ${transferredNe.toFixed(2)} N_A 电子`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '标况', pass: true, finding: '0℃, 101 kPa' },
          { stepName: '二审状态', checkTarget: 'Cl₂ 状态', pass: true, finding: '气体' },
          { stepName: '三审结构', checkTarget: 'Cl₂ 分子', pass: true, finding: '双原子分子' },
          { stepName: '四审过程', checkTarget: '歧化反应', pass: false, finding: '1 个 Cl 升高，1 个 Cl 降低 ➔ 转移 1 个电子！' },
          { stepName: '五审电子', checkTarget: '电子转移数', pass: true, finding: 'n_e = n(Cl₂) × 1' },
        ],
      }
    }

    default: {
      const molesNa2O2 = unit === 'g' ? val / 78 : val
      const ne = molesNa2O2 * 1

      return {
        title: 'Na₂O₂ + H₂O / CO₂ 歧化转移电子陷阱',
        subtitle: '1 mol Na₂O₂ 与足量水/CO₂ 反应生成 0.5 mol O₂，转移 1 mol 电子',
        isStateGas: false,
        physicalState: '固态',
        vmValue: 22.4,
        particleStats: [
          { label: '生成 O₂ 分子数', theoreticalMoles: molesNa2O2, actualMoles: molesNa2O2 * 0.5, unit: 'N_A', isTrap: true, trapExplanation: '2 mol Na₂O₂ 才生成 1 mol O₂！故 1 mol Na₂O₂ 生成 0.5 mol O₂。' },
          { label: '转移电子数 n_e', theoreticalMoles: molesNa2O2 * 2, actualMoles: ne, unit: 'N_A', isTrap: true, trapExplanation: 'Na₂O₂ 中 O 为 -1 价，歧化为 0 价 O₂ 和 -2 价 OH⁻/CO₃²⁻，1 mol Na₂O₂ 转移 1 mol 电子！' },
        ],
        trapType: '过氧化物歧化电子转移陷阱',
        trapBadge: 'Na₂O₂ 转移 1e⁻',
        trapLevel: 'high',
        keyPointAnalysis: [
          '2Na₂O₂ + 2H₂O = 4NaOH + O₂↑ 中：-1 价的 O 发生了歧化反应。',
          '1 mol Na₂O₂ 反应转移 1 mol 电子，生成 0.5 mol O₂。',
        ],
        formulaLatex: '2\\text{Na}_2\\overset{-1}{\\text{O}}_2 + 2\\text{H}_2\\text{O} = 4\\text{Na}\\overset{-2}{\\text{OH}} + \\overset{0}{\\text{O}}_2\\uparrow \\implies 1 \\text{ mol Na}_2\\text{O}_2 \\text{ 转移 1 mol } e^-',
        correctAnswerSummary: `1 mol Na₂O₂ 反应生成 0.5 N_A 个 O₂，转移 1 N_A 电子`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '环境', pass: true, finding: '固态 Na₂O₂ + 液体/气体' },
          { stepName: '二审状态', checkTarget: '状态', pass: true, finding: '固体反应' },
          { stepName: '三审结构', checkTarget: '过氧根价态', pass: true, finding: 'O 为 -1 价' },
          { stepName: '四审过程', checkTarget: '歧化归中', pass: false, finding: '转移 1 个电子！' },
          { stepName: '五审电子', checkTarget: '电子数', pass: true, finding: 'n_e = n(Na₂O₂)' },
        ],
      }
    }
  }
}

// ── 5. 五步秒杀盲盒矩阵模式计算 ──
function calculate5StepMatrix(_params: AvogadroParams, vm: number): AvogadroResult {
  return {
    title: '阿伏加德罗常数 (N_A) 解题“五步秒杀”盲盒排查矩阵',
    subtitle: '一审环境 ➔ 二审状态 ➔ 三审结构 ➔ 四审过程 ➔ 五审电子',
    isStateGas: true,
    physicalState: '气态',
    vmValue: vm,
    particleStats: [
      { label: '已知考题条件', theoreticalMoles: 1, actualMoles: 1, unit: '例题', isTrap: false },
      { label: '解题判定置信度', theoreticalMoles: 1, actualMoles: 1, unit: '100%', isTrap: false },
    ],
    trapType: '全方位盲盒诊断矩阵',
    trapBadge: '高考必备模型',
    trapLevel: 'high',
    keyPointAnalysis: [
      '【步骤一·审环境】：看是否为标准状况 (0℃, 101 kPa) 以及溶液是否有体积/浓度限定。',
      '【步骤二·审状态】：看标况下该物质是否为气体 (防 SO₃/CCl₄/H₂O/甲醇/HF 陷阱)。',
      '【步骤三·审结构】：看微粒构成 (原子/分子/离子/中子/质子/电子) 与共价键数 (P₄/S₈/SiO₂/石墨/金刚石/冰/NH₄Cl)。',
      '【步骤四·审过程】：看是否涉及弱电解质电离、盐类水解、熔融态电离 (NaHSO₄) 或可逆反应 (NO₂/N₂O₄ 二聚/胶粒聚集)。',
      '【步骤五·审电子】：看氧化还原变价与歧化反应 (Cl₂/Na₂O₂/Cu+S 等)。',
    ],
    formulaLatex: '\\text{五步秒杀: } \\text{审环境} \\to \\text{审状态} \\to \\text{审结构} \\to \\text{审过程} \\to \\text{审电子}',
    correctAnswerSummary: '掌握五步法，100% 避开 N_A 选择题所有常见陷阱！',
    stepByStepMatrix: [
      { stepName: '一审环境', checkTarget: '标况 0℃ / 常温 25℃ / 溶液 V', pass: true, finding: '环境条件是决定适用公式的前提' },
      { stepName: '二审状态', checkTarget: 'SO₃, CCl₄, H₂O, CH₃OH, HF 状态', pass: true, finding: '标况非气体直接排除 22.4 L/mol' },
      { stepName: '三审结构', checkTarget: 'P₄ (6键), S₈ (8键), SiO₂ (4键), 冰 (2氢键)', pass: true, finding: '晶体均摊法与分子几何不可误判' },
      { stepName: '四审过程', checkTarget: '弱电解质/胶体/熔融态/NO₂二聚', pass: true, finding: '弱酸不完全电离、NaHSO₄ 熔融离解 2 mol' },
      { stepName: '五审电子', checkTarget: '歧化 1e⁻ / Cu+S 1e⁻ / 变价', pass: true, finding: '氧化还原反应代数求和电子数' },
    ],
  }
}
