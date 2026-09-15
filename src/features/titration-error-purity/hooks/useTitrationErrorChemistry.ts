import { useMemo } from 'react'
import type {
  TitrationErrorParams,
  TitrationChemistryResult,
  ErrorEffectResult,
  PurityResult,
  YieldResult,
} from '../types'

export function useTitrationErrorChemistry(
  params: TitrationErrorParams
): TitrationChemistryResult {
  return useMemo(() => {
    // 1. 滴定误差分析计算
    const {
      errorOp,
      viewAngle,
      cStandardTrue,
      vSampleTrue,
      cSampleTrue,
      purityMethod,
      sampleMass,
      solutionTotalVol,
      pipetteVol,
      reagent1Conc,
      reagent1Vol,
      reagent2Conc,
      reagent2Vol,
      rawMaterialMass,
      rawMaterialMolarMass,
      molarMassProduct,
      actualProductMass,
    } = params

    // 理论所需标准体积 mL
    const vTrue = (cSampleTrue * vSampleTrue) / cStandardTrue

    let opFactor = 1.0
    let constantOffset = 0.0
    let effectDirection: 'high' | 'low' | 'none' = 'none'
    let description = '标准规范操作，无误差。'
    let equationExplanation = 'c_{\\text{待}} = \\frac{c_{\\text{标}} \\times V_{\\text{标}}}{V_{\\text{待}}} = \\text{准确真值}'

    switch (errorOp) {
      case 'unrinsed-burette':
        opFactor = 1.12
        effectDirection = 'high'
        description =
          '滴定管装液前未用标准液润洗，管内残余蒸馏水稀释了标准液，达到终点需要消耗更大体积标准液。'
        equationExplanation =
          'V_{\\text{标}}\\text{ 测量偏大} \\implies c_{\\text{待}} = \\frac{c_{\\text{标}} \\times V_{\\text{标}}\\uparrow}{V_{\\text{待}}} \\implies \\text{偏高}'
        break
      case 'unrinsed-flask':
        opFactor = 1.15
        effectDirection = 'high'
        description =
          '锥形瓶用待测液润洗，导致瓶内待测溶质 n(待) 增多，需消耗额外标准液。'
        equationExplanation =
          'n_{\\text{待}}\\text{ 实际增加} \\implies V_{\\text{标}}\\text{ 偏大} \\implies c_{\\text{待}}\\text{ 偏高}'
        break
      case 'wet-flask':
        opFactor = 1.0
        effectDirection = 'none'
        description =
          '锥形瓶用蒸馏水洗净后未干燥（有水滴），不改变瓶内待测溶质的总物质的量 n(待)。'
        equationExplanation =
          'n_{\\text{待}}\\text{ 保持不变} \\implies V_{\\text{标}}\\text{ 准确无误} \\implies c_{\\text{待}}\\text{ 无误差}'
        break
      case 'view-start-up-end-down':
        constantOffset = -0.6
        effectDirection = 'low'
        description =
          '始仰（起点读数偏大）终俯（终点读数偏小），导致读取体积 ΔV = V(终) - V(始) 严重小于实际耗液量。'
        equationExplanation =
          'V_{\\text{始}}\\uparrow,\\, V_{\\text{终}}\\downarrow \\implies \\Delta V_{\\text{标}}\\downarrow \\implies c_{\\text{待}}\\text{ 偏低}'
        break
      case 'view-start-down-end-up':
        constantOffset = +0.6
        effectDirection = 'high'
        description =
          '始俯（起点读数偏小）终仰（终点读数偏大），导致读取体积 ΔV = V(终) - V(始) 严重大于实际耗液量。'
        equationExplanation =
          'V_{\\text{始}}\\downarrow,\\, V_{\\text{终}}\\uparrow \\implies \\Delta V_{\\text{标}}\\uparrow \\implies c_{\\text{待}}\\text{ 偏高}'
        break
      case 'bubble-start':
        constantOffset = +0.4
        effectDirection = 'high'
        description =
          '滴定前滴定管尖嘴有气泡，滴定后气泡消失。排出气泡的液体体积被误计入标准液消耗量。'
        equationExplanation =
          'V_{\\text{标}}\\text{ 含气泡体积}\\uparrow \\implies c_{\\text{待}} = \\frac{c_{\\text{标}} \\times V_{\\text{标}}\\uparrow}{V_{\\text{待}}} \\implies \\text{偏高}'
        break
      case 'bubble-end':
        constantOffset = -0.3
        effectDirection = 'low'
        description =
          '滴定前无气泡，滴定后尖嘴产生气泡。终点读数偏小。'
        equationExplanation =
          'V_{\\text{终}}\\downarrow \\implies V_{\\text{标}}\\downarrow \\implies c_{\\text{待}}\\text{ 偏低}'
        break
      case 'hanging-drop':
        constantOffset = +0.05
        effectDirection = 'high'
        description =
          '滴定终点时滴定管尖嘴外悬挂一滴标准液未下落入瓶内。此滴液体已离开滴定管被计入读数，但未参与反应。'
        equationExplanation =
          'V_{\\text{标}}\\text{ 计入悬滴}\\uparrow \\implies c_{\\text{待}}\\text{ 偏高}'
        break
      case 'indicator-early':
        opFactor = 0.92
        effectDirection = 'low'
        description =
          '指示剂选择不当（如强碱滴定弱酸误选甲基橙），终点变色过早，反应未完全。'
        equationExplanation =
          '\\text{终点提前} \\implies V_{\\text{标}}\\downarrow \\implies c_{\\text{待}}\\text{ 偏低}'
        break
      case 'indicator-late':
        opFactor = 1.08
        effectDirection = 'high'
        description =
          '滴定过快或指示剂变色过迟，终点过量滴入标准液。'
        equationExplanation =
          '\\text{滴定过量} \\implies V_{\\text{标}}\\uparrow \\implies c_{\\text{待}}\\text{ 偏高}'
        break
      case 'volumetric-flask-down':
        opFactor = 0.90
        effectDirection = 'low'
        description =
          '配制标准溶液定容时俯视刻度线，水加少导致标准液实际浓度 c(标) 偏高。滴定时消耗体积 V(标) 偏小。'
        equationExplanation =
          'c_{\\text{标}}\\text{ 实际}\\uparrow \\implies V_{\\text{标}}\\downarrow \\implies c_{\\text{待}}\\text{ 偏低}'
        break
      default:
        break
    }

    // 叠加视线角度 viewAngle 的几何影响 (rad)
    // viewAngle > 0 (仰视): 读数比实际大 ; viewAngle < 0 (俯视): 读数比实际小
    const angleOffset = (viewAngle / 15.0) * 0.4

    const vRead = vTrue * opFactor + constantOffset + angleOffset
    const cCalculated = (cStandardTrue * vRead) / vSampleTrue
    const relativeErrorPct = ((cCalculated - cSampleTrue) / cSampleTrue) * 100

    if (errorOp === 'none' && Math.abs(viewAngle) > 1.0) {
      if (viewAngle > 0) {
        effectDirection = 'high'
        description = '读数仰视视线向下斜穿刻度，刻度读数偏大。'
        equationExplanation = 'V_{\\text{终}}\\text{ 仰视偏大} \\implies \\Delta V_{\\text{标}}\\uparrow \\implies c_{\\text{待}}\\text{ 偏高}'
      } else {
        effectDirection = 'low'
        description = '读数俯视视线向上斜穿刻度，刻度读数偏小。'
        equationExplanation = 'V_{\\text{终}}\\text{ 俯视偏小} \\implies \\Delta V_{\\text{标}}\\downarrow \\implies c_{\\text{待}}\\text{ 偏低}'
      }
    }

    const errorResult: ErrorEffectResult = {
      vRead: Number(vRead.toFixed(2)),
      vTrue: Number(vTrue.toFixed(2)),
      cCalculated: Number(cCalculated.toFixed(4)),
      cTrue: Number(cSampleTrue.toFixed(4)),
      relativeErrorPct: Number(relativeErrorPct.toFixed(2)),
      effectDirection,
      description,
      equationExplanation,
    }

    // 2. 纯度与返滴定计算
    let nAliquot = 0
    let nTotalSample = 0
    let mPureProduct = 0
    let purityPct = 0
    let stoichiometryRatio = '1 : 1'
    let calcStepsLatex = ''

    if (purityMethod === 'direct') {
      // 假设如 Na₂CO₃ + 2HCl 滴定，n(Sample) = 0.5 * n(HCl)
      const vStdL = reagent2Vol / 1000
      nAliquot = 0.5 * reagent2Conc * vStdL
      nTotalSample = nAliquot * (solutionTotalVol / pipetteVol)
      const M = 106.0 // g/mol Na2CO3
      mPureProduct = nTotalSample * M
      purityPct = (mPureProduct / sampleMass) * 100
      stoichiometryRatio = 'n(Na₂CO₃) = 0.5 × n(HCl)'
      calcStepsLatex = `w\\% = \\frac{0.5 \\times ${reagent2Conc.toFixed(2)} \\times ${(vStdL).toFixed(4)} \\times \\frac{${solutionTotalVol}}{${pipetteVol}} \\times 106}{${sampleMass.toFixed(2)}} \\times 100\\% = ${purityPct.toFixed(2)}\\%`
    } else if (purityMethod === 'back-titration') {
      // 返滴定法 CaCO₃ + 过量 2HCl ，剩余 HCl 用 NaOH 返滴定
      // n(HCl总) = c1 * V1
      // n(HCl残) = c2 * V2 (1:1 NaOH)
      // n(HCl反应) = n(HCl总) - n(HCl残)
      // n(CaCO₃) = 0.5 * n(HCl反应)
      const n1Total = reagent1Conc * (reagent1Vol / 1000)
      const n1Residual = reagent2Conc * (reagent2Vol / 1000)
      const n1Reacted = Math.max(0, n1Total - n1Residual)
      nAliquot = 0.5 * n1Reacted
      nTotalSample = nAliquot * (solutionTotalVol / pipetteVol)
      const M = 100.09 // g/mol CaCO3
      mPureProduct = nTotalSample * M
      purityPct = Math.min(100, (mPureProduct / sampleMass) * 100)
      stoichiometryRatio = 'n(样品) = 0.5 × [n(HCl总) - n(NaOH反滴)]'
      calcStepsLatex = `w\\% = \\frac{[${reagent1Conc.toFixed(2)} \\times ${(reagent1Vol/1000).toFixed(3)} - ${reagent2Conc.toFixed(2)} \\times ${(reagent2Vol/1000).toFixed(3)}] \\times 0.5 \\times 100.09}{${sampleMass.toFixed(2)}} \\times 100\\% = ${purityPct.toFixed(2)}\\%`
    } else {
      // 氧化还原多步关联：如 2Cu²⁺ ~ I₂ ~ 2S₂O₃²⁻ (1:1 关系)
      const vStdL = reagent2Vol / 1000
      nAliquot = reagent2Conc * vStdL
      nTotalSample = nAliquot * (solutionTotalVol / pipetteVol)
      // M(碱式碳酸铜 Cu₂(OH)₂CO₃) = 2×64 + 12 + 5×16 + 2×1 = 222 g/mol
      // 采用高中常用相对原子质量 (Cu = 64)，与 model-titration-error-purity 题库口径一致
      const M = 222 // g/mol 碱式碳酸铜 Cu₂(OH)₂CO₃ 含有2个 Cu²⁺，故 1mol 消耗 2mol S2O32-
      mPureProduct = (nTotalSample / 2) * M
      purityPct = Math.min(100, (mPureProduct / sampleMass) * 100)
      stoichiometryRatio = '1 Cu₂(OH)₂CO₃ ～ 2 Cu²⁺ ～ 2 S₂O₃²⁻'
      calcStepsLatex = `w\\% = \\frac{0.5 \\times ${reagent2Conc.toFixed(2)} \\times ${(vStdL).toFixed(4)} \\times \\frac{${solutionTotalVol}}{${pipetteVol}} \\times 222}{${sampleMass.toFixed(2)}} \\times 100\\% = ${purityPct.toFixed(2)}\\%`
    }

    const purityResult: PurityResult = {
      nAliquot: Number(nAliquot.toFixed(5)),
      nTotalSample: Number(nTotalSample.toFixed(5)),
      mPureProduct: Number(mPureProduct.toFixed(3)),
      purityPct: Number(purityPct.toFixed(2)),
      stoichiometryRatio,
      calcStepsLatex,
    }

    // 3. 产率计算 Yield
    // 原料摩尔质量使用参数 rawMaterialMolarMass，支持任意原料（Fe=55.85, Cu=63.5, Al=27...)
    const nTheoretical = rawMaterialMass / rawMaterialMolarMass
    const mTheoretical = nTheoretical * molarMassProduct
    const yieldPct = Math.min(100, (actualProductMass / mTheoretical) * 100)
    const calcFormulaLatex = `\\text{Yield}\\% = \\frac{m_{\\text{实际}}}{m_{\\text{理论}}} = \\frac{${actualProductMass.toFixed(2)}}{\\frac{${rawMaterialMass.toFixed(2)}}{${rawMaterialMolarMass}} \\times ${molarMassProduct}} \\times 100\\% = ${yieldPct.toFixed(2)}\\%`

    const yieldResult: YieldResult = {
      nTheoretical: Number(nTheoretical.toFixed(4)),
      mTheoretical: Number(mTheoretical.toFixed(2)),
      actualMass: Number(actualProductMass.toFixed(2)),
      yieldPct: Number(yieldPct.toFixed(2)),
      calcFormulaLatex,
    }

    return {
      errorResult,
      purityResult,
      yieldResult,
    }
  }, [params])
}
