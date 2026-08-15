import type { AvogadroParams, AvogadroResult } from '../types'

/**
 * 3. 弱电解质与盐类水解陷阱计算逻辑
 */
export function calculateElectrolyteHydrolysisTrap(
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

    case 'FeCl3': {
      const feMoles = totalMoles
      return {
        title: 'FeCl₃ 水解与 Fe(OH)₃ 胶体粒子数陷阱',
        subtitle: `${vol} L ${conc} mol/L FeCl₃ 溶液中 Fe³⁺ 水解制得胶体微粒数远小于 ${feMoles.toFixed(2)} N_A`,
        isStateGas: false,
        physicalState: '溶液',
        vmValue: 22.4,
        particleStats: [
          { label: 'Fe(OH)₃ 胶体粒子数', theoreticalMoles: feMoles, actualMoles: feMoles * 0.001, unit: 'N_A', isTrap: true, trapExplanation: `胶粒是上百至上千个 Fe(OH)₃ 分子的聚集体，胶体粒子数远小于 ${feMoles.toFixed(2)} N_A！` },
          { label: '溶液中 Fe³⁺ 离子数', theoreticalMoles: feMoles, actualMoles: feMoles * 0.95, unit: 'N_A', isTrap: true, trapExplanation: `Fe³⁺ 发生水解 Fe³⁺ + 3H₂O ⇌ Fe(OH)₃ + 3H⁺，Fe³⁺ 数目小于 ${feMoles.toFixed(2)} N_A。` },
        ],
        trapType: '胶体粒子聚集与水解可逆陷阱',
        trapBadge: '胶粒数 ≪ n(Fe³⁺)',
        trapLevel: 'high',
        keyPointAnalysis: [
          '向沸水中滴加饱和 FeCl₃ 溶液制备 Fe(OH)₃ 胶体：Fe³⁺ + 3H₂O ≜ Fe(OH)₃(胶体) + 3H⁺。',
          '胶体微粒是很多个（成百上千个）Fe(OH)₃ 分子的聚集体，因此胶粒数远小于投料的 Fe³⁺ 离子数。',
          '同时水解是可逆反应，Fe³⁺ 不能完全水解转化为 Fe(OH)₃。',
        ],
        formulaLatex: '\\text{Fe}^{3+} + 3\\text{H}_2\\text{O} \\rightleftharpoons \\text{Fe(OH)}_3\\text{(胶体)} + 3\\text{H}^+ \\implies N(\\text{胶粒}) \\ll n(\\text{Fe}^{3+}) \\cdot N_A',
        correctAnswerSummary: `制得的 Fe(OH)₃ 胶体粒子数远小于 ${feMoles.toFixed(2)} N_A`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '溶液体积/浓度', pass: true, finding: `V = ${vol} L, c = ${conc} mol/L` },
          { stepName: '二审状态', checkTarget: '胶体分散系', pass: true, finding: '胶体分散系' },
          { stepName: '三审结构', checkTarget: '胶粒聚集态', pass: false, finding: '胶粒为高分子/多分子聚集体！' },
          { stepName: '四审过程', checkTarget: '水解可逆限度', pass: false, finding: '水解不可进行彻底' },
          { stepName: '五审守恒', checkTarget: 'Fe 元素守恒', pass: true, finding: 'Fe 元素总数恒为 c·V' },
        ],
      }
    }

    case 'pureH2O': {
      const waterMoles = vol * (1000 / 18)
      const hMoles = vol * 1e-7
      return {
        title: '纯水电离微粒数陷阱',
        subtitle: `${vol} L 纯水中 H₂O 分子发生微弱电离，水电离出的 H⁺ 仅为 ${hMoles.toExponential(2)} N_A`,
        isStateGas: false,
        physicalState: '溶液',
        vmValue: 22.4,
        particleStats: [
          { label: 'H₂O 分子数', theoreticalMoles: waterMoles, actualMoles: waterMoles, unit: 'N_A', isTrap: false },
          { label: '水电离产生的 H⁺ 数', theoreticalMoles: vol * 1, actualMoles: hMoles, unit: 'N_A', isTrap: true, trapExplanation: `常温下水极微弱电离 (c(H⁺) = 10⁻⁷ mol/L)，${vol} L 水电离出的 H⁺ 仅为 ${hMoles.toExponential(1)} N_A！` },
        ],
        trapType: '水的微弱电离陷阱',
        trapBadge: '水电离极微弱',
        trapLevel: 'high',
        keyPointAnalysis: [
          '水是极弱电解质：H₂O ⇌ H⁺ + OH⁻。',
          '常温 (25℃) 下，纯水中 c(H⁺) = c(OH⁻) = 1.0 × 10⁻⁷ mol/L。',
          '1 L 纯水中含约 55.6 mol H₂O 分子，但电离出的 H⁺ 和 OH⁻ 各仅有 10⁻⁷ mol (10⁻⁷ N_A)。',
        ],
        formulaLatex: 'K_w = c(\\text{H}^+) \\cdot c(\\text{OH}^-) = 10^{-14} \\implies c(\\text{H}^+) = 10^{-7} \\text{ mol/L (25}^\\circ\\text{C)}',
        correctAnswerSummary: `${vol} L 纯水电离出的 H⁺ 仅为 ${hMoles.toExponential(2)} N_A`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '常温纯水', pass: true, finding: '25℃ 纯水' },
          { stepName: '二审状态', checkTarget: '液态水', pass: true, finding: '液态' },
          { stepName: '三审结构', checkTarget: '水分子', pass: true, finding: '极性共价键' },
          { stepName: '四审过程', checkTarget: '弱电离平衡', pass: false, finding: '水分子极微弱电离！' },
          { stepName: '五审守恒', checkTarget: '电荷守恒', pass: true, finding: 'c(H⁺) = c(OH⁻)' },
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

/**
 * 4. 氧化还原电子转移数 (n_e) 陷阱计算逻辑
 */
export function calculateRedoxElectronTrap(
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

    case 'NO2-H2O': {
      // 3NO2 + H2O = 2HNO3 + NO
      // 3 mol NO2 发生歧化反应转移 2 mol 电子，1 mol NO2 转移 2/3 mol 电子
      const molesNO2 = moles
      const ne = molesNO2 * (2 / 3)
      return {
        title: 'NO₂ + H₂O 歧化反应电子转移陷阱',
        subtitle: '3 mol NO₂ 与水反应生成 2 mol HNO₃ 和 1 mol NO，转移 2 mol 电子 (1 mol NO₂ 转移 2/3 mol 电子)',
        isStateGas: true,
        physicalState: '气态',
        vmValue: 22.4,
        particleStats: [
          { label: '转移电子数 n_e', theoreticalMoles: molesNO2 * 1, actualMoles: ne, unit: 'N_A', isTrap: true, trapExplanation: '3 mol NO₂ 反应中 2 个 N 升到 +5，1 个 N 降到 +2 ➔ 3 mol NO₂ 转移 2 mol 电子 (即 1 mol 转移 2/3 e⁻)！' },
          { label: '生成 NO 分子数', theoreticalMoles: molesNO2, actualMoles: molesNO2 / 3, unit: 'N_A', isTrap: true, trapExplanation: '3 mol NO₂ 生成 1 mol NO 气体！' },
        ],
        trapType: '非对称歧化反应电子转移陷阱',
        trapBadge: '3NO₂ 转移 2e⁻',
        trapLevel: 'high',
        keyPointAnalysis: [
          '3NO₂ + H₂O = 2HNO₃ + NO 为歧化反应。',
          '3 个 +4 价 N 原子中：2 个升高到 +5 价 (HNO₃)，1 个降低到 +2 价 (NO)。',
          '总计消耗 3 mol NO₂ 转移 2 mol 电子，因此 1 mol NO₂ 反应转移 2/3 N_A 电子。',
        ],
        formulaLatex: '3\\overset{+4}{\\text{NO}}_2 + \\text{H}_2\\text{O} = 2\\text{H}\\overset{+5}{\\text{NO}}_3 + \\overset{+2}{\\text{NO}} \\implies 1 \\text{ mol NO}_2 \\text{ 转移 } \\frac{2}{3} \\text{ mol } e^-',
        correctAnswerSummary: `${val} ${unit} NO₂ 与水完全反应转移 ${ne.toFixed(2)} N_A 电子`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '标况/气体', pass: true, finding: '标况气体反应' },
          { stepName: '二审状态', checkTarget: 'NO₂ 气体', pass: true, finding: '红棕色气体' },
          { stepName: '三审结构', checkTarget: 'N 化合价', pass: true, finding: '+4 价氮' },
          { stepName: '四审过程', checkTarget: '歧化化学计量', pass: false, finding: '3 分子 NO₂ 转移 2 个电子！' },
          { stepName: '五审电子', checkTarget: '电子计算', pass: true, finding: 'n_e = (2/3) × n(NO₂)' },
        ],
      }
    }

    case 'SO2-O2-reversible': {
      // 2SO2 + O2 <=> 2SO3
      const molesSO2 = moles
      const theoreticalNe = molesSO2 * 2
      return {
        title: '2SO₂ + O₂ ⇌ 2SO₃ 可逆反应电子转移与限度陷阱',
        subtitle: '2 mol SO₂ 与 1 mol O₂ 反应为可逆反应，生成 SO₃ < 2 N_A，转移电子数 < 4 N_A',
        isStateGas: true,
        physicalState: '气态',
        vmValue: 22.4,
        particleStats: [
          { label: '实际转移电子数 n_e', theoreticalMoles: theoreticalNe, actualMoles: theoreticalNe * 0.85, unit: 'N_A', isTrap: true, trapExplanation: '可逆反应不能进行彻底！实际转化率小于 100%，转移电子数小于理论上限！' },
          { label: 'SO₃ 生成分子数', theoreticalMoles: molesSO2, actualMoles: molesSO2 * 0.85, unit: 'N_A', isTrap: true, trapExplanation: '可逆反应有反应限度，生成 SO₃ 分子数小于理论完全转化量！' },
        ],
        trapType: '可逆反应限度电子与微粒数陷阱',
        trapBadge: '可逆反应不可到底',
        trapLevel: 'high',
        keyPointAnalysis: [
          '2SO₂ + O₂ ⇌ 2SO₃ (催化剂、加热) 为工业制硫酸接触氧化反应，属于典型可逆反应。',
          '无论反应时间多长，反应物都不能 100% 转化为产物。',
          '因此 2 mol SO₂ 与 1 mol O₂ 充分反应，转移电子数必然小于 4 N_A，生成 SO₃ 分子数小于 2 N_A。',
        ],
        formulaLatex: '2\\text{SO}_2 + \\text{O}_2 \\rightleftharpoons 2\\text{SO}_3 \\implies n_e < 2 \\cdot n(\\text{SO}_2) \\text{ mol}',
        correctAnswerSummary: `可逆反应无法完全进行到底，生成 SO₃ 分子数及转移电子数均小于理论值`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '密闭容器催化反应', pass: true, finding: '密闭容器' },
          { stepName: '二审状态', checkTarget: '气体混合物', pass: true, finding: '反应体系' },
          { stepName: '三审结构', checkTarget: 'SO₂ 分子', pass: true, finding: '极性分子' },
          { stepName: '四审过程', checkTarget: '可逆反应符号 ⇌', pass: false, finding: '可逆反应不可进行到底！' },
          { stepName: '五审电子', checkTarget: '转化率限度', pass: false, finding: '转移电子数必然小于理论极值' },
        ],
      }
    }

    case 'Fe-HNO3': {
      // 1 mol Fe 与足量稀硝酸：Fe + 4HNO3(稀) = Fe(NO3)3 + NO + 2H2O -> 转移 3 mol e-
      const molesFe = unit === 'g' ? val / 56 : val
      const ne = molesFe * 3
      return {
        title: 'Fe 与稀硝酸氧化还原电子转移陷阱',
        subtitle: '1 mol Fe 与足量稀硝酸充分反应生成 Fe(NO₃)₃ 和 NO，转移 3 mol 电子',
        isStateGas: false,
        physicalState: '固态',
        vmValue: 22.4,
        particleStats: [
          { label: '转移电子数 n_e (足量硝酸)', theoreticalMoles: molesFe * 2, actualMoles: ne, unit: 'N_A', isTrap: true, trapExplanation: '稀硝酸具有强氧化性，足量时将 Fe 氧化为 +3 价 Fe³⁺ (转移 3 N_A 电子)，非 +2 价！' },
          { label: '生成 NO 气体分子数', theoreticalMoles: molesFe, actualMoles: molesFe * 1, unit: 'N_A', isTrap: false },
        ],
        trapType: '强氧化性酸变价电子数陷阱',
        trapBadge: 'Fe + 足量HNO₃ 转移 3e⁻',
        trapLevel: 'high',
        keyPointAnalysis: [
          '稀硝酸具有强氧化性：Fe + 4HNO₃(稀) = Fe(NO₃)₃ + NO↑ + 2H₂O。',
          '当硝酸足量时，Fe 被完全氧化为 +3 价，1 mol Fe 转移 3 N_A 电子。',
          '对比：若 Fe 过量，产物为 Fe(NO₃)₂，1 mol Fe 则转移 2 N_A 电子。',
        ],
        formulaLatex: '\\overset{0}{\\text{Fe}} + 4\\text{H}\\overset{+5}{\\text{NO}}_3(\\text{稀}) = \\overset{+3}{\\text{Fe}}(\\text{NO}_3)_3 + \\overset{+2}{\\text{NO}}\\uparrow + 2\\text{H}_2\\text{O} \\implies 1 \\text{ mol Fe } \\text{转移 3 mol } e^-',
        correctAnswerSummary: `1 mol Fe 与足量稀硝酸反应转移 3 N_A 电子 (生成 Fe³⁺)`,
        stepByStepMatrix: [
          { stepName: '一审环境', checkTarget: '足量稀硝酸', pass: true, finding: '稀硝酸强氧化剂' },
          { stepName: '二审状态', checkTarget: '固液反应', pass: true, finding: '固体溶解' },
          { stepName: '三审结构', checkTarget: 'Fe 原料', pass: true, finding: '金属晶体' },
          { stepName: '四审过程', checkTarget: '完全氧化产物', pass: false, finding: '硝酸足量生成 Fe³⁺ 转移 3 个电子！' },
          { stepName: '五审电子', checkTarget: '电子转移数', pass: true, finding: 'n_e = n(Fe) × 3' },
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

/**
 * 5. 五步秒杀盲盒矩阵模式计算
 */
export function calculate5StepMatrix(_params: AvogadroParams, vm: number): AvogadroResult {
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
