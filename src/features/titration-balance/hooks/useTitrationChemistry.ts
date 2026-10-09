/**
 * src/features/titration-balance/hooks/useTitrationChemistry.ts
 * 滴定突跃与离子浓度排序解题工具 - 纯化学计算 Hook
 *
 * 设计要点（整体性求解，非分段经验公式）：
 *   1. 对任意滴加体积 V_add，用「电荷守恒 + 物料守恒 + 弱酸/弱碱电离平衡」联立方程，
 *      以二分法精确求解 c(H⁺)（几何中点迭代，跨 14 个数量级稳定收敛）。
 *      强酸强碱体系存在闭式解 c(H⁺) = [-(cNa-cCl) + √((cNa-cCl)² + 4Kw)] / 2。
 *   2. 微粒浓度由该解按平衡关系式导出，因此**任何区间**都自动满足电荷守恒与物料守恒，
 *      不存在「某一段公式写反」的可能性。
 *   3. 离子浓度大小排序、c-V 演变曲线、三大守恒卡片全部由同一批解生成，同屏数值自洽。
 */

import { useMemo } from 'react'
import type {
  TitrationParams,
  TitrationChemistryResult,
  IonConcentration,
  TitrationCurvePoint,
  TitrationSpeciesCurve,
} from '../types'
import { CHART_COLORS, INDICATOR_COLORS } from '@/theme'

const KW = 1e-14
const V0 = 20.0 // 初始锥形瓶液体体积 20 mL

/** 参与滴定平衡的微粒代号 */
type SpeciesKey = 'Na' | 'A' | 'HA' | 'Cl' | 'BH' | 'B' | 'H' | 'OH'

const SPECIES_META: Record<SpeciesKey, { name: string; labelLatex: string; color: string }> = {
  Na: { name: 'Na⁺', labelLatex: 'c(\\text{Na}^+)', color: CHART_COLORS.primary },
  A: { name: 'A⁻', labelLatex: 'c(\\text{A}^-)', color: CHART_COLORS.compareA },
  HA: { name: 'HA', labelLatex: 'c(\\text{HA})', color: CHART_COLORS.compareB },
  Cl: { name: 'Cl⁻', labelLatex: 'c(\\text{Cl}^-)', color: CHART_COLORS.compareA },
  BH: { name: 'BH⁺', labelLatex: 'c(\\text{BH}^+)', color: CHART_COLORS.primary },
  B: { name: 'B', labelLatex: 'c(\\text{B})', color: CHART_COLORS.compareB },
  H: { name: 'H⁺', labelLatex: 'c(\\text{H}^+)', color: CHART_COLORS.criticalPt },
  OH: { name: 'OH⁻', labelLatex: 'c(\\text{OH}^-)', color: CHART_COLORS.highlight },
}

/** 各体系参与「离子浓度大小排序」的微粒与其展示顺序依据（按浓度降序动态排序） */
const ORDERING_SPECIES: Record<string, SpeciesKey[]> = {
  strongBaseWeakAcid: ['Na', 'A', 'HA', 'OH', 'H'],
  strongAcidWeakBase: ['Cl', 'BH', 'B', 'H', 'OH'],
  strongBaseStrongAcid: ['Na', 'Cl', 'H', 'OH'],
}

/** 各体系在 c-V 演变图中绘制的物种曲线（与右屏数值同源） */
const CURVE_SPECIES: Record<string, SpeciesKey[]> = {
  strongBaseWeakAcid: ['HA', 'A', 'Na'],
  strongAcidWeakBase: ['B', 'BH', 'Cl'],
  strongBaseStrongAcid: ['Na', 'Cl', 'OH'],
}

/**
 * 二分法求解 c(H⁺)。
 * f 在 c(H⁺) ∈ (0, 1] 上单调递增（各项均为 c(H⁺) 的增函数），故可在对数轴上二分。
 * @param f 关于 c(H⁺) 的单调递增残差函数 (mol/L)
 * @returns c(H⁺) (mol/L)
 */
function solveH(f: (h: number) => number): number {
  let lo = 1e-16
  let hi = 1.0
  if (f(lo) > 0) return lo
  if (f(hi) < 0) return hi
  for (let i = 0; i < 120; i++) {
    const mid = Math.sqrt(lo * hi) // 几何中点：对 14 个数量级更稳定
    if (f(mid) > 0) {
      hi = mid
    } else {
      lo = mid
    }
  }
  return Math.sqrt(lo * hi)
}

interface PointSolution {
  vAdd: number
  vRatio: number
  pH: number
  values: Record<SpeciesKey, number>
}

/**
 * 求解滴定过程中某一滴加体积处的全部微粒浓度与 pH。
 * @param systemType 滴定体系
 * @param vAdd 已滴加体积 (mL)
 * @param c0 被滴定液初始浓度 (mol/L)
 * @param cTitrant 滴定剂浓度 (mol/L)
 * @param vEq 化学计量点体积 (mL)
 * @param Ka 弱酸 Ka 或 共轭酸 Ka = Kw/Kb (mol/L)
 */
function solveAt(
  systemType: TitrationParams['systemType'],
  vAdd: number,
  c0: number,
  cTitrant: number,
  vEq: number,
  Ka: number
): PointSolution {
  const vTotal = V0 + vAdd
  const vRatio = vAdd / vEq
  const values = { Na: 0, A: 0, HA: 0, Cl: 0, BH: 0, B: 0, H: 1e-7, OH: 1e-7 } as Record<
    SpeciesKey,
    number
  >

  let cH = 1e-7

  if (systemType === 'strongBaseWeakAcid') {
    // NaOH 滴定一元弱酸 HA：c(Na⁺) = cTitrant·V/(V0+V), c(A⁻)+c(HA) = c0·V0/(V0+V)
    const cNa = (cTitrant * vAdd) / vTotal
    const cATotal = (c0 * V0) / vTotal
    // 电荷守恒：c(Na⁺) + c(H⁺) = c(A⁻) + c(OH⁻)，其中 c(A⁻) = cATotal·Ka/(c(H⁺)+Ka)
    cH = solveH((h) => cNa + h - (cATotal * Ka) / (h + Ka) - KW / h)
    const cOH = KW / cH
    const cA = (cATotal * Ka) / (cH + Ka)
    values.Na = cNa
    values.A = cA
    values.HA = cATotal - cA
    values.H = cH
    values.OH = cOH
  } else if (systemType === 'strongAcidWeakBase') {
    // HCl 滴定一元弱碱 B：KaBH 为其共轭酸 BH⁺ 的酸式电离常数 = Kw/Kb
    const cCl = (cTitrant * vAdd) / vTotal
    const cBTotal = (c0 * V0) / vTotal
    // 电荷守恒：c(BH⁺) + c(H⁺) = c(Cl⁻) + c(OH⁻)，其中 c(BH⁺) = cBTotal·c(H⁺)/(c(H⁺)+KaBH)
    cH = solveH((h) => (cBTotal * h) / (h + Ka) + h - cCl - KW / h)
    const cOH = KW / cH
    const cBH = (cBTotal * cH) / (cH + Ka)
    values.Cl = cCl
    values.BH = cBH
    values.B = cBTotal - cBH
    values.H = cH
    values.OH = cOH
  } else {
    // 强碱滴定强酸（NaOH 滴定 HCl）：电荷守恒给出闭式解
    const cNa = (cTitrant * vAdd) / vTotal
    const cCl = (c0 * V0) / vTotal
    const d = cNa - cCl
    cH = (-d + Math.sqrt(d * d + 4 * KW)) / 2
    values.Na = cNa
    values.Cl = cCl
    values.H = cH
    values.OH = KW / cH
  }

  return {
    vAdd,
    vRatio,
    pH: -Math.log10(Math.max(1e-15, Math.min(1, cH))),
    values,
  }
}

/**
 * 由同源浓度值生成离子浓度大小排序式（自动保证与数值一致）。
 * 浓度相对差 < 1e-6 时判为「相等」，用于恰好中和的等量关系。
 */
function buildOrdering(values: Record<SpeciesKey, number>, keys: SpeciesKey[]): string {
  const sorted = keys
    .map((k) => ({ k, conc: values[k] }))
    .sort((a, b) => b.conc - a.conc)
  let out = SPECIES_META[sorted[0].k].labelLatex
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].conc
    const cur = sorted[i].conc
    const same = Math.abs(prev - cur) <= Math.max(prev, cur) * 1e-6
    out += `${same ? ' = ' : ' > '}${SPECIES_META[sorted[i].k].labelLatex}`
  }
  return out
}

export function useTitrationChemistry(params: TitrationParams): TitrationChemistryResult {
  const { systemType, vRatio, pKa, c0, indicator } = params

  return useMemo(() => {
    // strongBaseWeakAcid 用弱酸 Ka；strongAcidWeakBase 用弱碱 Kb = 10^-pKb，
    // 其共轭酸 BH⁺ 的酸式电离常数 KaBH = Kw/Kb。强强体系不使用该值。
    const Ka = systemType === 'strongAcidWeakBase' ? KW / Math.pow(10, -pKa) : Math.pow(10, -pKa)
    const vEq = V0 // 假定滴定剂与被滴定剂浓度相等 c_titrant = c0
    const cTitrant = c0
    const vAdd = Math.max(0.01, vRatio * vEq)

    const build = (v: number) => solveAt(systemType, v, c0, cTitrant, vEq, Ka)

    // 1. 当前点求解
    const current = build(vAdd)
    const pH = current.pH
    const cH = current.values.H
    const cOH = current.values.OH

    // 2. 各微粒浓度（由同源解导出）
    const orderingKeys = ORDERING_SPECIES[systemType]
    const ionConcs: IonConcentration[] = orderingKeys.map((k) => {
      const meta = SPECIES_META[k]
      const conc = current.values[k]
      return {
        name: meta.name,
        labelLatex: meta.labelLatex,
        conc,
        formatted: conc >= 1e-3 ? conc.toFixed(4) : conc.toExponential(2),
        color: meta.color,
      }
    })

    // 3. 离子浓度大小排序（由同源解动态生成，杜绝「文案与数值互斥」）
    const concOrderingLatex = buildOrdering(current.values, orderingKeys)

    // 4. 区域判定（决定解题推导文案与题干守恒卡片形态）
    const inHalf = vRatio >= 0.45 && vRatio <= 0.55
    const atEquiv = vRatio >= 0.95 && vRatio <= 1.05
    const over = vRatio > 1.05
    const k = vRatio

    let orderingExplanation = ''
    let chargeEq = { title: '', equationLatex: '', explanation: '' }
    let massEq = { title: '', equationLatex: '', explanation: '' }
    let protonEq = { title: '', equationLatex: '', explanation: '' }

    const kFixed = k.toFixed(2)
    const oneMinusK = (1 - k).toFixed(2)

    if (systemType === 'strongBaseWeakAcid') {
      chargeEq = {
        title: '电荷守恒 (全过程恒成立)',
        equationLatex: 'c(\\text{Na}^+) + c(\\text{H}^+) = c(\\text{A}^-) + c(\\text{OH}^-)',
        explanation: '溶液呈电中性：阳离子所带正电荷总浓度等于阴离子所带负电荷总浓度。',
      }
      massEq = {
        title: '物料守恒 (A 元素与 Na 元素来源比例)',
        equationLatex: `c(\\text{Na}^+) : [c(\\text{A}^-) + c(\\text{HA})] = ${vAdd.toFixed(1)} : ${V0.toFixed(1)}`,
        explanation: 'A 元素全部来源于初始弱酸 HA；Na 元素全部来源于滴加的 NaOH。',
      }

      if (vRatio < 0.005) {
        orderingExplanation =
          '滴定起点：溶液中只有弱酸 HA，仅少量电离出 H⁺ 与 A⁻，故分子浓度远大于离子浓度。'
        protonEq = {
          title: '质子守恒 (纯 HA 溶液)',
          equationLatex: 'c(\\text{H}^+) = c(\\text{A}^-) + c(\\text{OH}^-)',
          explanation: '以 HA 与 H₂O 为零水准：HA 失去的质子数等于 H₂O 得到的质子数。',
        }
      } else if (inHalf) {
        orderingExplanation =
          '半中和点：HA 与 NaA 按 1:1 混合成缓冲溶液。弱酸 HA 的电离程度大于 A⁻ 的水解程度，故 c(A⁻) 略大于 c(Na⁺)，且溶液显弱酸性（pH ≈ pKa）。'
        protonEq = {
          title: '质子守恒 (半中和点 1:1 混合液)',
          equationLatex:
            '2c(\\text{H}^+) + c(\\text{HA}) = c(\\text{A}^-) + 2c(\\text{OH}^-)',
          explanation:
            '由电荷守恒减去物料守恒（消去 c(Na⁺)）化简得到；这是半中和点的标志性守恒式。',
        }
      } else if (atEquiv) {
        orderingExplanation =
          '化学计量点：恰好完全中和生成强碱弱酸盐 NaA。A⁻ 水解产生 OH⁻ 显碱性，故 c(OH⁻) 大于 c(HA) 与 c(H⁺)。'
        protonEq = {
          title: '质子守恒 (计量点纯 NaA 溶液)',
          equationLatex: 'c(\\text{OH}^-) = c(\\text{HA}) + c(\\text{H}^+)',
          explanation:
            '以 A⁻ 与 H₂O 为零水准：水电离出的 OH⁻ 一部分游离，一部分结合 H⁺ 生成 HA。',
        }
      } else if (over) {
        orderingExplanation =
          '化学计量点之后：NaOH 过量，c(OH⁻) 由过量强碱主导，但主电解质 A⁻ 的浓度仍高于 OH⁻。'
        protonEq = {
          title: '质子守恒 (NaA + 过量 NaOH，已消去 c(Na⁺))',
          equationLatex: `c(\\text{OH}^-) = c(\\text{H}^+) + ${kFixed}c(\\text{HA}) + ${(k - 1).toFixed(2)}c(\\text{A}^-)`,
          explanation:
            '由电荷守恒减去物料守恒（消去 c(Na⁺)）化简得到，过量 NaOH 的贡献已并入 c(OH⁻)。',
        }
      } else {
        orderingExplanation =
          '缓冲过渡区：HA 与 NaA 共存，溶液由弱酸电离与酸根水解共同控制，仍显酸性。'
        protonEq = {
          title: '质子守恒 (HA–NaA 混合液，已消去 c(Na⁺))',
          equationLatex: `c(\\text{H}^+) + ${kFixed}c(\\text{HA}) = ${oneMinusK}c(\\text{A}^-) + c(\\text{OH}^-)`,
          explanation:
            '由电荷守恒减去物料守恒（消去 c(Na⁺)）化简得到；半中和点时即化为 2c(H⁺) + c(HA) = c(A⁻) + 2c(OH⁻)。',
        }
      }
    } else if (systemType === 'strongAcidWeakBase') {
      chargeEq = {
        title: '电荷守恒 (全过程恒成立)',
        equationLatex: 'c(\\text{BH}^+) + c(\\text{H}^+) = c(\\text{Cl}^-) + c(\\text{OH}^-)',
        explanation: '溶液呈电中性：阳离子所带正电荷总浓度等于阴离子所带负电荷总浓度。',
      }
      massEq = {
        title: '物料守恒 (B 元素与 Cl 元素来源比例)',
        equationLatex: `c(\\text{Cl}^-) : [c(\\text{BH}^+) + c(\\text{B})] = ${vAdd.toFixed(1)} : ${V0.toFixed(1)}`,
        explanation: 'Cl 元素全部来源于滴加的 HCl；B 元素全部来源于初始弱碱。',
      }

      if (inHalf) {
        orderingExplanation =
          '半中和点：B 与 BHCl 按 1:1 混合成缓冲溶液。弱碱 B 的电离程度大于 BH⁺ 的水解程度，故 c(BH⁺) 略大于 c(Cl⁻)，且溶液显弱碱性（pH ≈ 14 − pKb）。'
        protonEq = {
          title: '质子守恒 (半中和点 1:1 混合液)',
          equationLatex: 'c(\\text{BH}^+) + 2c(\\text{H}^+) = c(\\text{B}) + 2c(\\text{OH}^-)',
          explanation:
            '由电荷守恒减去物料守恒（消去 c(Cl⁻)）化简得到；这是半中和点的标志性守恒式。',
        }
      } else if (atEquiv) {
        orderingExplanation =
          '化学计量点：恰好完全中和生成强酸弱碱盐 BHCl。BH⁺ 水解产生 H⁺ 显酸性，故 c(H⁺) 大于 c(B) 与 c(OH⁻)。'
        protonEq = {
          title: '质子守恒 (计量点纯 BHCl 溶液)',
          equationLatex: 'c(\\text{H}^+) = c(\\text{B}) + c(\\text{OH}^-)',
          explanation:
            '以 BH⁺ 与 H₂O 为零水准：水电离出的 H⁺ 一部分游离，一部分结合 OH⁻ 生成弱碱 B。',
        }
      } else if (over) {
        orderingExplanation =
          '化学计量点之后：HCl 过量，c(H⁺) 由过量强酸主导，弱碱已全部转化为 BH⁺。'
        protonEq = {
          title: '质子守恒 (BHCl + 过量 HCl，已消去 c(Cl⁻))',
          equationLatex: `c(\\text{H}^+) = c(\\text{OH}^-) + ${kFixed}c(\\text{B}) + ${(k - 1).toFixed(2)}c(\\text{BH}^+)`,
          explanation:
            '由电荷守恒减去物料守恒（消去 c(Cl⁻)）化简得到，过量 HCl 的贡献已并入 c(H⁺)。',
        }
      } else {
        orderingExplanation =
          '缓冲过渡区：B 与 BHCl 共存，溶液由弱碱电离与阳离子水解共同控制，仍显碱性。'
        protonEq = {
          title: '质子守恒 (B–BHCl 混合液，已消去 c(Cl⁻))',
          equationLatex: `c(\\text{H}^+) + ${oneMinusK}c(\\text{BH}^+) = ${kFixed}c(\\text{B}) + c(\\text{OH}^-)`,
          explanation:
            '由电荷守恒减去物料守恒（消去 c(Cl⁻)）化简得到；半中和点时即化为 c(BH⁺) + 2c(H⁺) = c(B) + 2c(OH⁻)。',
        }
      }
    } else {
      chargeEq = {
        title: '电荷守恒',
        equationLatex: 'c(\\text{Na}^+) + c(\\text{H}^+) = c(\\text{Cl}^-) + c(\\text{OH}^-)',
        explanation: '强酸强碱体系溶液呈电中性。',
      }
      massEq = {
        title: '物料守恒',
        equationLatex: `c(\\text{Na}^+) : c(\\text{Cl}^-) = ${vAdd.toFixed(1)} : ${V0.toFixed(1)}`,
        explanation: 'Na⁺ 全部来自滴加的 NaOH，Cl⁻ 全部来自初始 HCl。',
      }
      protonEq = {
        title: '质子守恒 (水的电离平衡)',
        equationLatex: 'c(\\text{H}^+) = c(\\text{OH}^-)',
        explanation:
          '强酸强碱体系中只有水发生质子转移，恒有 c(H⁺) = c(OH⁻)，故 25 ℃ 下恰好中和点必为中性 (pH = 7)。',
      }

      if (vRatio < 0.95) {
        orderingExplanation =
          '未达中和点：HCl 过量，H⁺ 显著高于 OH⁻；Cl⁻ 全部来自初始溶液，故 c(Cl⁻) 大于 c(Na⁺)。'
      } else if (vRatio <= 1.05) {
        orderingExplanation =
          '恰好完全中和生成 NaCl 中性溶液：c(Na⁺) = c(Cl⁻)，且 c(H⁺) = c(OH⁻)。'
      } else {
        orderingExplanation = 'NaOH 过量：c(OH⁻) 显著升高，但生成的 Cl⁻ 浓度仍大于 c(H⁺)。'
      }
    }

    // 5. 滴定突跃区间（由 pKa/pKb 与浓度按教材判据计算，不再写死）
    //    下界：中和 99.9% 时（缓冲比 [A⁻]/[HA] = 999 → pH = pKa + 3）
    //    上界：滴定剂过量 0.1%（c(OH⁻) = cTitrant × 0.001·vEq / (V0 + 1.001·vEq)）
    const cExcess001 = (cTitrant * 0.001 * vEq) / (V0 + 1.001 * vEq)
    const pExcess001 = -Math.log10(cExcess001)
    let jumpStartPH = 4.3
    let jumpEndPH = 9.7
    if (systemType === 'strongBaseWeakAcid') {
      jumpStartPH = pKa + 3
      jumpEndPH = 14 - pExcess001
    } else if (systemType === 'strongAcidWeakBase') {
      jumpStartPH = pExcess001
      jumpEndPH = 14 - (pKa + 3)
    } else {
      jumpStartPH = pExcess001
      jumpEndPH = 14 - pExcess001
    }
    jumpStartPH = Math.max(0, Math.min(14, Math.round(jumpStartPH * 10) / 10))
    jumpEndPH = Math.max(0, Math.min(14, Math.round(jumpEndPH * 10) / 10))
    const isInJumpZone = pH >= jumpStartPH && pH <= jumpEndPH

    // 6. 指示剂变色与状态（颜色统一取自 INDICATOR_COLORS token）
    let indicatorColor: string = INDICATOR_COLORS.phenolphthalein.acidic
    let indicatorName = '无指示剂'
    let indicatorTip = '未加入指示剂，无法通过肉眼判定滴定终点。'
    // 指示剂变色范围
    let indicatorLow = 0
    let indicatorHigh = 0

    if (indicator === 'phenolphthalein') {
      indicatorName = '酚酞 (变色范围 pH 8.2 - 10.0)'
      indicatorLow = 8.2
      indicatorHigh = 10.0
      if (pH < 8.2) {
        indicatorColor = INDICATOR_COLORS.phenolphthalein.acidic
        indicatorTip = '当前 pH < 8.2，酚酞呈无色。'
      } else if (pH <= 10.0) {
        indicatorColor = INDICATOR_COLORS.phenolphthalein.palePink
        indicatorTip = '当前 pH 在 8.2 - 10.0 变色区间，溶液呈现浅粉红色。'
      } else {
        indicatorColor = INDICATOR_COLORS.phenolphthalein.basic
        indicatorTip = '当前 pH > 10.0，酚酞呈现深红色。'
      }
    } else if (indicator === 'methylOrange') {
      indicatorName = '甲基橙 (变色范围 pH 3.1 - 4.4)'
      indicatorLow = 3.1
      indicatorHigh = 4.4
      if (pH < 3.1) {
        indicatorColor = INDICATOR_COLORS.methylOrange.acidic
        indicatorTip = '当前 pH < 3.1，甲基橙呈红色。'
      } else if (pH <= 4.4) {
        indicatorColor = INDICATOR_COLORS.methylOrange.neutral
        indicatorTip = '当前 pH 在 3.1 - 4.4 变色区间，溶液呈现橙色（终点到达）。'
      } else {
        indicatorColor = INDICATOR_COLORS.methylOrange.basic
        indicatorTip = '当前 pH > 4.4，甲基橙呈现黄色。'
      }
    }

    // 指示剂选择逻辑：变色范围须落在突跃范围内，否则终点误差过大
    if (indicatorLow > 0) {
      const fits = indicatorLow >= jumpStartPH && indicatorHigh <= jumpEndPH
      indicatorTip += fits
        ? ` ✔ 该指示剂变色范围 (${indicatorLow} - ${indicatorHigh}) 完全落在突跃范围 (${jumpStartPH} - ${jumpEndPH}) 内，终点误差小，可选用。`
        : ` ⚠ 该指示剂变色范围 (${indicatorLow} - ${indicatorHigh}) 未完全落在突跃范围 (${jumpStartPH} - ${jumpEndPH}) 内，本体系应更换指示剂。`
    }

    // 7. 全量采样（0 → 2 V_eq，101 点）：pH 曲线与 c-V 曲线共用同一批精确解
    const SAMPLE_COUNT = 100
    const samples: PointSolution[] = []
    for (let i = 0; i <= SAMPLE_COUNT; i++) {
      const r = (i / SAMPLE_COUNT) * 2.0
      samples.push(build(Math.max(0.01, r * vEq)))
    }

    const curvePoints: TitrationCurvePoint[] = samples.map((s) => ({
      vRatio: s.vRatio,
      vAdd: s.vAdd,
      pH: Math.max(0, Math.min(14, s.pH)),
    }))

    const speciesCurves: TitrationSpeciesCurve[] = CURVE_SPECIES[systemType].map((key) => {
      const meta = SPECIES_META[key]
      return {
        key,
        name: meta.name,
        labelLatex: meta.labelLatex,
        color: meta.color,
        points: samples.map((s) => ({ x: s.vAdd, y: s.values[key] })),
      }
    })

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
      speciesCurves,
      cH,
      cOH,
    }
  }, [systemType, vRatio, pKa, c0, indicator])
}
