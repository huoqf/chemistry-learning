/**
 * src/features/titration-balance/hooks/useTitrationChemistry.ts
 * 滴定突跃与离子浓度排序解题工具 - 纯化学计算 Hook
 */

import { useMemo } from 'react'
import type {
  TitrationParams,
  TitrationChemistryResult,
  IonConcentration,
  TitrationCurvePoint,
} from '../types'
import { CHART_COLORS } from '@/theme'

const KW = 1e-14
const V0 = 20.0 // 初始锥形瓶液体体积 20 mL

export function useTitrationChemistry(params: TitrationParams): TitrationChemistryResult {
  const { systemType, vRatio, pKa, c0, indicator } = params

  return useMemo(() => {
    const Ka = Math.pow(10, -pKa)
    const Kb = Math.pow(10, -pKa)
    const vEq = V0 // 假定滴定剂与被滴定剂浓度相等 c_titrant = c0 = 0.1 mol/L
    const cTitrant = c0
    const vAdd = Math.max(0.01, vRatio * vEq)
    const vTotal = V0 + vAdd

    // 1. 计算单点 pH 与微粒浓度
    let pH = 7.0
    let ionConcs: IonConcentration[] = []
    let concOrderingLatex = ''
    let orderingExplanation = ''
    let chargeEq = { title: '', equationLatex: '', explanation: '' }
    let massEq = { title: '', equationLatex: '', explanation: '' }
    let protonEq = { title: '', equationLatex: '', explanation: '' }

    if (systemType === 'strongBaseWeakAcid') {
      // NaOH 滴定 HA (弱酸)
      const cNa = (cTitrant * vAdd) / vTotal
      const cATotal = (c0 * V0) / vTotal

      let cH = 1e-7
      let cOH = 1e-7
      let cHA = 0
      let cA = 0

      if (vRatio < 0.01) {
        cH = Math.sqrt(Ka * c0)
        cOH = KW / cH
        cHA = c0 - cH
        cA = cH
      } else if (vRatio < 0.995) {
        const ratio = vRatio / (1 - vRatio)
        cH = Ka / ratio
        cOH = KW / cH
        cA = cNa
        cHA = Math.max(0.0001, cATotal - cA)
      } else if (vRatio <= 1.005) {
        const cNaA = cATotal
        const Kh = KW / Ka
        cOH = Math.sqrt(Kh * cNaA)
        cH = KW / cOH
        cA = cNaA - cOH
        cHA = cOH
      } else {
        const cExcessOH = (cTitrant * (vAdd - vEq)) / vTotal
        cOH = cExcessOH
        cH = KW / cOH
        cHA = (Ka * cATotal) / (cH + Ka)
        cA = cATotal - cHA
      }

      pH = -Math.log10(Math.max(1e-14, cH))

      ionConcs = [
        { name: 'Na⁺', labelLatex: 'c(\\text{Na}^+)', conc: cNa, formatted: cNa.toFixed(4), color: CHART_COLORS.primary },
        { name: 'A⁻', labelLatex: 'c(\\text{A}^-)', conc: cA, formatted: cA.toFixed(4), color: CHART_COLORS.compareA },
        { name: 'HA', labelLatex: 'c(\\text{HA})', conc: cHA, formatted: cHA.toFixed(4), color: CHART_COLORS.compareB },
        { name: 'OH⁻', labelLatex: 'c(\\text{OH}^-)', conc: cOH, formatted: cOH.toExponential(2), color: CHART_COLORS.highlight },
        { name: 'H⁺', labelLatex: 'c(\\text{H}^+)', conc: cH, formatted: cH.toExponential(2), color: CHART_COLORS.criticalPt },
      ]

      chargeEq = {
        title: '电荷守恒 (全过程恒成立)',
        equationLatex: 'c(\\text{Na}^+) + c(\\text{H}^+) = c(\\text{A}^-) + c(\\text{OH}^-)',
        explanation: '溶液呈电中性，所有阳极电荷浓度之和等于所有阴极电荷浓度之和。',
      }
      massEq = {
        title: '物料守恒 (以 A 元素与 Na 元素比例为依据)',
        equationLatex: `c(\\text{Na}^+) : [c(\\text{A}^-) + c(\\text{HA})] = ${vAdd.toFixed(1)} : 20.0`,
        explanation: 'A 元素总量来源为初始 HA，Na 元素来源于滴加的 NaOH。',
      }

      if (vRatio < 0.05) {
        concOrderingLatex = 'c(\\text{HA}) > c(\\text{H}^+) > c(\\text{A}^-) > c(\\text{OH}^-)'
        orderingExplanation = '纯弱酸 HA 主要以分子形式存在，小部分电离出 H⁺ 和 A⁻。'
        protonEq = {
          title: '质子守恒 (纯 HA 溶液)',
          equationLatex: 'c(\\text{H}^+) = c(\\text{A}^-) + c(\\text{OH}^-)',
          explanation: '水电离的 OH⁻ 等于 H⁺ 扣除 HA 电离贡献。',
        }
      } else if (vRatio >= 0.45 && vRatio <= 0.55) {
        concOrderingLatex = 'c(\\text{Na}^+) > c(\\text{A}^-) > c(\\text{HA}) > c(\\text{OH}^-) > c(\\text{H}^+)'
        orderingExplanation = '半中和点 HA 与 NaA 1:1 混合。通常弱酸 HA 的电离程度大于 A⁻ 的水解程度，故 c(A⁻) > c(HA)；溶液呈弱酸性。'
        protonEq = {
          title: '质子守恒代数化简 (半中和点 1:1 混合)',
          equationLatex: '2c(\\text{Na}^+) = c(\\text{A}^-) + c(\\text{HA})',
          explanation: '将物料守恒代入电荷守恒化简得出。',
        }
      } else if (vRatio >= 0.95 && vRatio <= 1.05) {
        concOrderingLatex = 'c(\\text{Na}^+) > c(\\text{A}^-) > c(\\text{OH}^-) > c(\\text{HA}) > c(\\text{H}^+)'
        orderingExplanation = '恰好中和生成纯 NaA 强碱弱酸盐。A⁻ 发生微弱水解产生 OH⁻ 显碱性，故 c(OH⁻) > c(HA) > c(H⁺)。'
        protonEq = {
          title: '质子守恒 (纯 NaA 盐溶液)',
          equationLatex: 'c(\\text{OH}^-) = c(\\text{HA}) + c(\\text{H}^+)',
          explanation: '水电离出的 OH⁻ 一部分存在于溶液中，一部分与 H⁺ 结合生成 HA。',
        }
      } else if (vRatio > 1.4) {
        concOrderingLatex = 'c(\\text{Na}^+) > c(\\text{OH}^-) > c(\\text{A}^-) > c(\\text{HA}) > c(\\text{H}^+)'
        orderingExplanation = '过量 NaOH 使得强碱 OH⁻ 浓度大幅增加，超过了 A⁻ 的浓度。'
        protonEq = {
          title: '过量强碱溶液物理平衡',
          equationLatex: 'c(\\text{OH}^-) \\approx c(\\text{Na}^+) - c(\\text{A}^-)',
          explanation: '游离强碱占绝对主导地位。',
        }
      } else {
        concOrderingLatex = 'c(\\text{Na}^+) > c(\\text{A}^-) > c(\\text{OH}^-) > c(\\text{H}^+)'
        orderingExplanation = '随滴加进行，溶液中 Na⁺ 与 A⁻ 占主导。'
        protonEq = {
          title: '代数守恒关系',
          equationLatex: 'c(\\text{Na}^+) + c(\\text{H}^+) = c(\\text{A}^-) + c(\\text{OH}^-)',
          explanation: '结合物料守恒可导出任意点离子浓度代数关系。',
        }
      }
    } else if (systemType === 'strongAcidWeakBase') {
      // HCl 滴定 NH₃·H₂O (弱碱)
      const cCl = (cTitrant * vAdd) / vTotal
      const cBTotal = (c0 * V0) / vTotal

      let cH = 1e-7
      let cOH = 1e-7
      let cBH = 0
      let cB = 0

      if (vRatio < 0.01) {
        cOH = Math.sqrt(Kb * c0)
        cH = KW / cOH
        cB = c0 - cOH
        cBH = cOH
      } else if (vRatio < 0.995) {
        const ratio = vRatio / (1 - vRatio)
        cOH = Kb / ratio
        cH = KW / cOH
        cBH = cCl
        cB = Math.max(0.0001, cBTotal - cBH)
      } else if (vRatio <= 1.005) {
        const cBHCl = cBTotal
        const Kh = KW / Kb
        cH = Math.sqrt(Kh * cBHCl)
        cOH = KW / cH
        cBH = cBHCl - cH
        cB = cH
      } else {
        const cExcessH = (cTitrant * (vAdd - vEq)) / vTotal
        cH = cExcessH
        cOH = KW / cH
        cBH = cBTotal
        cB = 0.0001
      }

      pH = -Math.log10(Math.max(1e-14, cH))

      ionConcs = [
        { name: 'Cl⁻', labelLatex: 'c(\\text{Cl}^-)', conc: cCl, formatted: cCl.toFixed(4), color: CHART_COLORS.compareA },
        { name: 'BH⁺', labelLatex: 'c(\\text{BH}^+)', conc: cBH, formatted: cBH.toFixed(4), color: CHART_COLORS.primary },
        { name: 'B', labelLatex: 'c(\\text{B})', conc: cB, formatted: cB.toFixed(4), color: CHART_COLORS.compareB },
        { name: 'H⁺', labelLatex: 'c(\\text{H}^+)', conc: cH, formatted: cH.toExponential(2), color: CHART_COLORS.criticalPt },
        { name: 'OH⁻', labelLatex: 'c(\\text{OH}^-)', conc: cOH, formatted: cOH.toExponential(2), color: CHART_COLORS.highlight },
      ]

      chargeEq = {
        title: '电荷守恒 (全过程恒成立)',
        equationLatex: 'c(\\text{BH}^+) + c(\\text{H}^+) = c(\\text{Cl}^-) + c(\\text{OH}^-)',
        explanation: '阳离子正电荷总浓度等于阴离子负电荷总浓度。',
      }
      massEq = {
        title: '物料守恒',
        equationLatex: `c(\\text{Cl}^-) : [c(\\text{BH}^+) + c(\\text{B})] = ${vAdd.toFixed(1)} : 20.0`,
        explanation: 'Cl 元素来源于滴加的 HCl，B 元素来源于初始弱碱。',
      }

      if (vRatio >= 0.45 && vRatio <= 0.55) {
        concOrderingLatex = 'c(\\text{BH}^+) > c(\\text{Cl}^-) > c(\\text{B}) > c(\\text{H}^+) > c(\\text{OH}^-)'
        orderingExplanation = '半中和点 B 与 BHCl 1:1 混合。弱碱电离大于阳离子水解，溶液显碱性或弱酸性。'
        protonEq = {
          title: '半中和点守恒',
          equationLatex: '2c(\\text{Cl}^-) = c(\\text{BH}^+) + c(\\text{B})',
          explanation: '由物料守恒代入电荷守恒导出。',
        }
      } else if (vRatio >= 0.95 && vRatio <= 1.05) {
        concOrderingLatex = 'c(\\text{Cl}^-) > c(\\text{BH}^+) > c(\\text{H}^+) > c(\\text{B}) > c(\\text{OH}^-)'
        orderingExplanation = '恰好中和生成纯 NH₄Cl/BHCl 强酸弱碱盐。BH⁺ 微弱水解产生 H⁺ 显酸性。'
        protonEq = {
          title: '质子守恒 (纯 BHCl 盐)',
          equationLatex: 'c(\\text{H}^+) = c(\\text{B}) + c(\\text{OH}^-)',
          explanation: '水电离的 H⁺ 一部分游离，一部分与 OH⁻ 结合。',
        }
      } else {
        concOrderingLatex = 'c(\\text{Cl}^-) > c(\\text{BH}^+) > c(\\text{H}^+) > c(\\text{OH}^-)'
        orderingExplanation = '强酸滴定弱碱过程离子浓度排序。'
        protonEq = {
          title: '代数守恒关系',
          equationLatex: 'c(\\text{BH}^+) + c(\\text{H}^+) = c(\\text{Cl}^-) + c(\\text{OH}^-)',
          explanation: '结合物料守恒可推导具体大小。',
        }
      }
    } else {
      // 强碱滴定强酸 (NaOH 滴定 HCl)
      const cNa = (cTitrant * vAdd) / vTotal
      const cCl = (c0 * V0) / vTotal

      let cH = 1e-7
      let cOH = 1e-7

      if (vRatio < 0.995) {
        cH = (c0 * V0 - cTitrant * vAdd) / vTotal
        cOH = KW / cH
      } else if (vRatio <= 1.005) {
        cH = 1e-7
        cOH = 1e-7
      } else {
        cOH = (cTitrant * vAdd - c0 * V0) / vTotal
        cH = KW / cOH
      }

      pH = -Math.log10(Math.max(1e-14, cH))

      ionConcs = [
        { name: 'Na⁺', labelLatex: 'c(\\text{Na}^+)', conc: cNa, formatted: cNa.toFixed(4), color: CHART_COLORS.primary },
        { name: 'Cl⁻', labelLatex: 'c(\\text{Cl}^-)', conc: cCl, formatted: cCl.toFixed(4), color: CHART_COLORS.compareA },
        { name: 'H⁺', labelLatex: 'c(\\text{H}^+)', conc: cH, formatted: cH.toExponential(2), color: CHART_COLORS.criticalPt },
        { name: 'OH⁻', labelLatex: 'c(\\text{OH}^-)', conc: cOH, formatted: cOH.toExponential(2), color: CHART_COLORS.highlight },
      ]

      chargeEq = {
        title: '电荷守恒',
        equationLatex: 'c(\\text{Na}^+) + c(\\text{H}^+) = c(\\text{Cl}^-) + c(\\text{OH}^-)',
        explanation: '强酸强碱体系电中性。',
      }
      massEq = {
        title: '物料守恒',
        equationLatex: `c(\\text{Na}^+) : c(\\text{Cl}^-) = ${vAdd.toFixed(1)} : 20.0`,
        explanation: '滴加 Na⁺ 与初始 Cl⁻ 的比例。',
      }
      protonEq = {
        title: '中性点守恒 (V = Veq)',
        equationLatex: 'c(\\text{Na}^+) = c(\\text{Cl}^-), \\quad c(\\text{H}^+) = c(\\text{OH}^-)',
        explanation: '恰好完全反应生成 NaCl 中性溶液。',
      }

      if (vRatio < 0.95) {
        concOrderingLatex = 'c(\\text{Cl}^-) > c(\\text{H}^+) > c(\\text{Na}^+) > c(\\text{OH}^-)'
        orderingExplanation = '未达中和点，酸过量，H⁺ 浓度高于 Na⁺。'
      } else if (vRatio <= 1.05) {
        concOrderingLatex = 'c(\\text{Na}^+) = c(\\text{Cl}^-) > c(\\text{H}^+) = c(\\text{OH}^-)'
        orderingExplanation = '恰好完全中和生成 NaCl 中性溶液。'
      } else {
        concOrderingLatex = 'c(\\text{Na}^+) > c(\\text{OH}^-) > c(\\text{Cl}^-) > c(\\text{H}^+)'
        orderingExplanation = '碱过量，OH⁻ 浓度显著增加。'
      }
    }

    // 2. 滴定突跃区间计算
    let jumpStartPH = 7.7
    let jumpEndPH = 9.7
    if (systemType === 'strongBaseWeakAcid') {
      jumpStartPH = 7.7
      jumpEndPH = 9.7
    } else if (systemType === 'strongAcidWeakBase') {
      jumpStartPH = 4.3
      jumpEndPH = 6.3
    } else {
      jumpStartPH = 4.3
      jumpEndPH = 9.7
    }
    const isInJumpZone = pH >= jumpStartPH && pH <= jumpEndPH

    // 3. 指示剂变色与状态
    let indicatorColor = '#3B82F6'
    let indicatorName = '无指示剂'
    let indicatorTip = '未加入指示剂，无法通过肉眼判定滴定终点。'

    if (indicator === 'phenolphthalein') {
      indicatorName = '酚酞 (变色范围 pH 8.2 - 10.0)'
      if (pH < 8.2) {
        indicatorColor = 'rgba(238, 242, 255, 0.4)'
        indicatorTip = '当前 pH < 8.2，酚酞呈无色。'
      } else if (pH <= 10.0) {
        indicatorColor = 'rgba(244, 114, 182, 0.7)'
        indicatorTip = '当前 pH 在 8.2 - 10.0 变色区间，溶液呈现浅红色。'
      } else {
        indicatorColor = 'rgba(225, 29, 72, 0.85)'
        indicatorTip = '当前 pH > 10.0，酚酞呈现深红色。'
      }
    } else if (indicator === 'methylOrange') {
      indicatorName = '甲基橙 (变色范围 pH 3.1 - 4.4)'
      if (pH < 3.1) {
        indicatorColor = 'rgba(239, 68, 68, 0.8)'
        indicatorTip = '当前 pH < 3.1，甲基橙呈红色。'
      } else if (pH <= 4.4) {
        indicatorColor = 'rgba(249, 115, 22, 0.8)'
        indicatorTip = '当前 pH 在 3.1 - 4.4 变色区间，溶液呈现橙色（终点到达）。'
      } else {
        indicatorColor = 'rgba(234, 179, 8, 0.85)'
        indicatorTip = '当前 pH > 4.4，甲基橙呈现黄色。'
      }
    }

    // 4. 全量 pH 滴定突跃曲线预计算 (r 从 0 到 2.0)
    const curvePoints: TitrationCurvePoint[] = []
    const stepCount = 100
    for (let i = 0; i <= stepCount; i++) {
      const r = (i / stepCount) * 2.0
      const vCurr = Math.max(0.01, r * vEq)
      const vTot = V0 + vCurr
      let ptPH = 7.0

      if (systemType === 'strongBaseWeakAcid') {
        if (r < 0.01) {
          ptPH = -Math.log10(Math.sqrt(Ka * c0))
        } else if (r < 0.995) {
          const ratio = r / (1 - r)
          ptPH = pKa + Math.log10(ratio)
        } else if (r <= 1.005) {
          const Kh = KW / Ka
          const cNaA = (c0 * V0) / vTot
          const cOHPt = Math.sqrt(Kh * cNaA)
          ptPH = 14 + Math.log10(cOHPt)
        } else {
          const cExcessOH = (cTitrant * (vCurr - vEq)) / vTot
          ptPH = 14 + Math.log10(cExcessOH)
        }
      } else if (systemType === 'strongAcidWeakBase') {
        if (r < 0.01) {
          const cOHPt = Math.sqrt(Kb * c0)
          ptPH = 14 + Math.log10(cOHPt)
        } else if (r < 0.995) {
          const ratio = r / (1 - r)
          const pKb = pKa
          ptPH = 14 - (pKb + Math.log10(ratio))
        } else if (r <= 1.005) {
          const Kh = KW / Kb
          const cBHCl = (c0 * V0) / vTot
          const cHPt = Math.sqrt(Kh * cBHCl)
          ptPH = -Math.log10(cHPt)
        } else {
          const cExcessH = (cTitrant * (vCurr - vEq)) / vTot
          ptPH = -Math.log10(cExcessH)
        }
      } else {
        if (r < 0.995) {
          const cHPt = (c0 * V0 - cTitrant * vCurr) / vTot
          ptPH = -Math.log10(cHPt)
        } else if (r <= 1.005) {
          ptPH = 7.0
        } else {
          const cExcessOH = (cTitrant * vCurr - c0 * V0) / vTot
          ptPH = 14 + Math.log10(cExcessOH)
        }
      }

      curvePoints.push({
        vRatio: r,
        vAdd: vCurr,
        pH: Math.max(0, Math.min(14, ptPH)),
      })
    }

    return {
      pH,
      cTitrant,
      vEq,
      vAdd,
      ionConcs,
      concOrderingLatex,
      orderingExplanation,
      chargeBalance: chargeEq,
      massBalance: massEq,
      protonBalance: protonEq,
      jumpStartPH,
      jumpEndPH,
      isInJumpZone,
      indicatorColor,
      indicatorName,
      indicatorTip,
      curvePoints,
    }
  }, [systemType, vRatio, pKa, c0, indicator])
}
