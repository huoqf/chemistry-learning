/**
 * src/features/industrial-flow/hooks/useIndustrialFlowChemistry.ts
 * 母题七：无机工艺流程与沉淀调 pH 工具 - 纯化学计算 Hook (增强动态响应)
 */

import { useMemo } from 'react'
import { CHART_COLORS } from '@/theme'
import type {
  IndustrialFlowParams,
  IndustrialFlowChemistry,
  IonConcentrationPoint,
  MassBalanceFlow,
} from '../types'
import { getElementFates, getReagentEvaluations } from './industrialFlowData'

/**
 * 25℃ 各金属氢氧化物溶度积常数统一采用高中化学（人教版选择性必修1附录/高考真题标准题设）：
 * - Fe(OH)₃: 4.0e-38 (对应完全沉淀 pH=3.20)
 * - Fe(OH)₂: 8.0e-16 (对应完全沉淀 pH=8.95)
 * - Al(OH)₃: 1.0e-33 (对应完全沉淀 pH=4.70)
 * - Mn(OH)₂: 1.9e-13 (对应开始沉淀 pH ≈ 8.1~8.3，与浸出率及 c₀ 动态关联)
 * - Cu(OH)₂: 2.2e-20
 * - Zn(OH)₂: 1.2e-17
 * - Mg(OH)₂: 1.8e-11
 * - Co(OH)₂: 1.0e-15
 * - Ni(OH)₂: 2.0e-15
 */
export function useIndustrialFlowChemistry(
  params: IndustrialFlowParams
): IndustrialFlowChemistry {
  const { systemId, pH, leachTemp, crushSize, oxidantAmount } = params

  return useMemo(() => {
    // 1. 浸出率计算 (%)
    let baseLeach = 55 + (leachTemp - 20) * 0.35
    if (crushSize === 'fine') baseLeach += 15
    else if (crushSize === 'medium') baseLeach += 8
    const leachRate = Math.min(98.5, Math.max(30, Math.round(baseLeach * 10) / 10))

    // 浸出率对初始浓度的真实物理影响因子
    const leachFactor = leachRate / 80.0

    // 2. 判断氧化状态 (对含铁体系)
    const isOxidized = oxidantAmount === 'sufficient'

    // 3. 根据 systemId 确定离子的物理化学常数
    let systemName = ''
    let targetIon = ''
    let impurityIons: string[] = []
    let rawIons: Array<{
      symbol: string
      name: string
      charge: number
      ksp: number
      baseC0: number
      color: string
      precipitateFormula: string
      isTarget?: boolean
      isPhRemoval?: boolean // 是否为调 pH 水解沉淀去除的杂质 (如 Cu2+ 是后续锌置换去除，不参与调 pH 范围计算)
    }> = []

    if (systemId === 'fe-al-mn') {
      systemName = '软锰矿还原酸浸提纯高纯 MnSO₄ 工艺 (Fe-Al-Mn 系统)'
      targetIon = 'Mn²⁺'
      impurityIons = isOxidized ? ['Fe³⁺', 'Al³⁺'] : ['Fe²⁺', 'Al³⁺']

      rawIons = [
        isOxidized
          ? {
              symbol: 'Fe³⁺',
              name: '铁离子',
              charge: 3,
              ksp: 4.0e-38,
              baseC0: 0.05,
              color: CHART_COLORS.compareA, // 橘红色
              precipitateFormula: 'Fe(OH)₃',
              isPhRemoval: true,
            }
          : {
              symbol: 'Fe²⁺',
              name: '亚铁离子',
              charge: 2,
              ksp: 8.0e-16,
              baseC0: 0.05,
              color: CHART_COLORS.compareA,
              precipitateFormula: 'Fe(OH)₂',
              isPhRemoval: true,
            },
        {
          symbol: 'Al³⁺',
          name: '铝离子',
          charge: 3,
          ksp: 1.0e-33,
          baseC0: 0.04,
          color: CHART_COLORS.compareB, // 对比色 B
          precipitateFormula: 'Al(OH)₃',
          isPhRemoval: true,
        },
        {
          symbol: 'Mn²⁺',
          name: '锰离子',
          charge: 2,
          ksp: 1.9e-13,
          baseC0: 0.1,
          color: CHART_COLORS.primary, // 主色
          precipitateFormula: 'Mn(OH)₂',
          isTarget: true,
        },
      ]
    } else if (systemId === 'fe-cu-zn') {
      systemName = '铜锌废渣回收高纯 ZnSO₄ 工艺 (Fe-Cu-Zn 系统)'
      targetIon = 'Zn²⁺'
      impurityIons = isOxidized ? ['Fe³⁺', 'Al³⁺', 'Cu²⁺'] : ['Fe²⁺', 'Al³⁺', 'Cu²⁺']

      rawIons = [
        isOxidized
          ? {
              symbol: 'Fe³⁺',
              name: '铁离子',
              charge: 3,
              ksp: 4.0e-38,
              baseC0: 0.06,
              color: CHART_COLORS.compareA,
              precipitateFormula: 'Fe(OH)₃',
              isPhRemoval: true,
            }
          : {
              symbol: 'Fe²⁺',
              name: '亚铁离子',
              charge: 2,
              ksp: 8.0e-16,
              baseC0: 0.06,
              color: CHART_COLORS.compareA,
              precipitateFormula: 'Fe(OH)₂',
              isPhRemoval: true,
            },
        {
          symbol: 'Al³⁺',
          name: '铝离子',
          charge: 3,
          ksp: 1.0e-33,
          baseC0: 0.04,
          color: CHART_COLORS.compareB,
          precipitateFormula: 'Al(OH)₃',
          isPhRemoval: true,
        },
        {
          symbol: 'Cu²⁺',
          name: '铜离子 (后续锌置换)',
          charge: 2,
          ksp: 2.2e-20,
          baseC0: 0.05,
          color: CHART_COLORS.compareC,
          precipitateFormula: 'Cu(OH)₂',
          isPhRemoval: false, // 调 pH 阶段不要求沉淀 Cu2+，后续加 Zn 粉置换除铜
        },
        {
          symbol: 'Zn²⁺',
          name: '锌离子',
          charge: 2,
          ksp: 1.2e-17,
          baseC0: 0.08,
          color: CHART_COLORS.primary,
          precipitateFormula: 'Zn(OH)₂',
          isTarget: true,
        },
      ]
    } else if (systemId === 'ti-fe') {
      systemName = '钛铁矿加铁屑还原制备 TiO₂/绿矾 (Ti-Fe 系统)'
      targetIon = 'TiO²⁺'
      impurityIons = ['Fe²⁺', 'Mg²⁺']

      rawIons = [
        {
          symbol: 'TiO²⁺',
          name: '钛酰离子',
          charge: 2,
          ksp: 1.0e-29,
          baseC0: 0.1,
          color: CHART_COLORS.primary,
          precipitateFormula: 'H₂TiO₃',
          isTarget: true,
          isPhRemoval: false, // 钛酰离子主要通过加热稀释水解分离，不属于常规碱调控沉淀
        },
        {
          symbol: 'Fe²⁺',
          name: '亚铁离子',
          charge: 2,
          ksp: 8.0e-16,
          baseC0: 0.08,
          color: CHART_COLORS.compareA,
          precipitateFormula: 'Fe(OH)₂',
          isPhRemoval: true,
        },
        {
          symbol: 'Mg²⁺',
          name: '镁离子',
          charge: 2,
          ksp: 1.8e-11,
          baseC0: 0.03,
          color: CHART_COLORS.compareC,
          precipitateFormula: 'Mg(OH)₂',
          isPhRemoval: true,
        },
      ]
    } else if (systemId === 'ni-co-li') {
      systemName = '废旧三元锂电池回收高纯 Co/Ni 盐 (Ni-Co-Li 系统)'
      targetIon = 'Ni²⁺/Co²⁺/Li⁺'
      impurityIons = ['Fe³⁺', 'Al³⁺']

      rawIons = [
        {
          symbol: 'Fe³⁺',
          name: '铁离子',
          charge: 3,
          ksp: 4.0e-38,
          baseC0: 0.05,
          color: CHART_COLORS.compareA,
          precipitateFormula: 'Fe(OH)₃',
        },
        {
          symbol: 'Al³⁺',
          name: '铝离子',
          charge: 3,
          ksp: 1.0e-33,
          baseC0: 0.04,
          color: CHART_COLORS.compareB,
          precipitateFormula: 'Al(OH)₃',
        },
        {
          symbol: 'Co²⁺',
          name: '钴离子',
          charge: 2,
          ksp: 1.0e-15,
          baseC0: 0.06,
          color: CHART_COLORS.primary,
          precipitateFormula: 'Co(OH)₂',
          isTarget: true,
        },
        {
          symbol: 'Ni²⁺',
          name: '镍离子',
          charge: 2,
          ksp: 2.0e-15,
          baseC0: 0.06,
          color: CHART_COLORS.compareC,
          precipitateFormula: 'Ni(OH)₂',
          isTarget: true,
        },
      ]
    } else if (systemId === 'mg-ca') {
      systemName = '盐湖卤水/白云石提纯高纯 MgO 工艺 (Mg-Ca 系统)'
      targetIon = 'Mg²⁺'
      impurityIons = ['Fe³⁺', 'Al³⁺']

      rawIons = [
        {
          symbol: 'Fe³⁺',
          name: '铁离子',
          charge: 3,
          ksp: 4.0e-38,
          baseC0: 0.05,
          color: CHART_COLORS.compareA,
          precipitateFormula: 'Fe(OH)₃',
        },
        {
          symbol: 'Al³⁺',
          name: '铝离子',
          charge: 3,
          ksp: 1.0e-33,
          baseC0: 0.04,
          color: CHART_COLORS.compareB,
          precipitateFormula: 'Al(OH)₃',
        },
        {
          symbol: 'Mg²⁺',
          name: '镁离子',
          charge: 2,
          ksp: 1.8e-11,
          baseC0: 0.1,
          color: CHART_COLORS.primary,
          precipitateFormula: 'Mg(OH)₂',
          isTarget: true,
        },
      ]
    } else if (systemId === 'al-fe-si') {
      systemName = '铝土矿拜耳法碱浸制高纯 Al₂O₃ 工艺 (Al-Fe-Si 系统)'
      targetIon = '[Al(OH)₄]⁻ / Al³⁺'
      impurityIons = ['Fe³⁺', 'SiO₃²⁻']

      rawIons = [
        {
          symbol: 'Fe³⁺',
          name: '铁离子 (赤泥)',
          charge: 3,
          ksp: 4.0e-38,
          baseC0: 0.05,
          color: CHART_COLORS.compareA,
          precipitateFormula: 'Fe(OH)₃',
          isPhRemoval: false, // 强碱中不溶，直接在碱浸第一步过滤成赤泥渣
        },
        {
          symbol: 'Al³⁺',
          name: '铝水解形态',
          charge: 3,
          ksp: 1.0e-33,
          baseC0: 0.1,
          color: CHART_COLORS.primary,
          precipitateFormula: 'Al(OH)₃',
          isTarget: true,
        },
      ]
    } else if (systemId === 'li-fe-p') {
      systemName = '废旧磷酸铁锂电池回收电池级 Li₂CO₃ 与 FePO₄ (Li-Fe-P 系统)'
      targetIon = 'Li⁺'
      impurityIons = ['Fe³⁺', 'PO₄³⁻']

      rawIons = [
        {
          symbol: 'Fe³⁺',
          name: '铁离子',
          charge: 3,
          ksp: 1.3e-22,
          baseC0: 0.08,
          color: CHART_COLORS.compareA,
          precipitateFormula: 'FePO₄',
          isPhRemoval: true,
        },
        {
          symbol: 'Li⁺',
          name: '锂离子',
          charge: 1,
          ksp: 1.6e-3,
          baseC0: 0.1,
          color: CHART_COLORS.primary,
          precipitateFormula: 'Li₂CO₃',
          isTarget: true,
        },
      ]
    } else {
      // cu-fe 孔雀石/废铜制备高纯胆矾
      systemName = '孔雀石/废铜制备高纯胆矾 CuSO₄·5H₂O 工艺 (Cu-Fe 系统)'
      targetIon = 'Cu²⁺'
      impurityIons = isOxidized ? ['Fe³⁺'] : ['Fe²⁺']

      rawIons = [
        isOxidized
          ? {
              symbol: 'Fe³⁺',
              name: '铁离子',
              charge: 3,
              ksp: 4.0e-38,
              baseC0: 0.05,
              color: CHART_COLORS.compareA,
              precipitateFormula: 'Fe(OH)₃',
              isPhRemoval: true,
            }
          : {
              symbol: 'Fe²⁺',
              name: '亚铁离子',
              charge: 2,
              ksp: 8.0e-16,
              baseC0: 0.05,
              color: CHART_COLORS.compareA,
              precipitateFormula: 'Fe(OH)₂',
              isPhRemoval: true,
            },
        {
          symbol: 'Cu²⁺',
          name: '铜离子',
          charge: 2,
          ksp: 2.2e-20,
          baseC0: 0.1,
          color: CHART_COLORS.primary,
          precipitateFormula: 'Cu(OH)₂',
          isTarget: true,
        },
      ]
    }

    // 4. 计算各离子在当前 pH 下的余量浓度与沉淀百分比 (c0 受浸出率联动)
    const ions: IonConcentrationPoint[] = rawIons.map((item) => {
      const { charge, ksp, baseC0 } = item
      const c0 = Math.round(baseC0 * leachFactor * 1000) / 1000

      // pOH 与 [OH-]
      const pOH = 14 - pH
      const cOH = Math.pow(10, -pOH)

      // 开始沉淀 pH (c = c0)
      const cOH_start = Math.pow(ksp / c0, 1 / charge)
      const pOH_start = -Math.log10(cOH_start)
      const pHStart = Math.round((14 - pOH_start) * 100) / 100

      // 沉淀完全 pH (c = 1e-5)
      const cOH_end = Math.pow(ksp / 1e-5, 1 / charge)
      const pOH_end = -Math.log10(cOH_end)
      const pHEnd = Math.round((14 - pOH_end) * 100) / 100

      // 当前 pH 下理论余量浓度
      let cCurrent = c0
      if (cOH > 0) {
        const cMaxSoluble = ksp / Math.pow(cOH, charge)
        cCurrent = Math.min(c0, cMaxSoluble)
      }

      // Al(OH)3 两性溶解修正 (当 pH > 10.5 时，Al(OH)3 + OH- -> [Al(OH)4]-)
      if (item.symbol === 'Al³⁺' && pH > 10.5) {
        const amphotericFactor = Math.pow(10, (pH - 10.5) * 1.5)
        cCurrent = Math.min(c0, cCurrent + 1e-5 * amphotericFactor)
      }

      const precipitateRatio = Math.max(
        0,
        Math.min(100, Math.round(((c0 - cCurrent) / c0) * 1000) / 10)
      )

      return {
        symbol: item.symbol,
        name: item.name,
        charge,
        ksp,
        c0,
        cCurrent,
        pHStart,
        pHEnd,
        precipitateRatio,
        color: item.color,
        precipitateFormula: item.precipitateFormula,
      }
    })

    // 5. 安全 pH 区间计算 (仅考量调 pH 步骤需沉淀去除的杂质)
    let safePhRange: [number, number]
    let hasSafeRange: boolean
    let isPhInSafeRange: boolean
    let safeRangeDescription = ''

    if (systemId === 'ti-fe') {
      // 钛铁矿体系核心依靠加热稀释水解（pH 约 1.0~2.5）促使 TiO²⁺ 水解生成 H₂TiO₃
      safePhRange = [1.0, 2.5]
      hasSafeRange = true
      isPhInSafeRange = pH >= safePhRange[0] && pH <= safePhRange[1]
      if (isPhInSafeRange) {
        safeRangeDescription = `处于钛酰离子稀释水解最佳酸度区间 [1.0 ~ 2.5]：TiO²⁺ 彻底水解析出偏钛酸，Fe²⁺ 稳定保留在溶液中不水解。`
      } else if (pH < 1.0) {
        safeRangeDescription = `当前 pH=${pH.toFixed(1)} 酸度过高：酸度过大抑制 TiOSO₄ 水解平衡正向移动，TiO₂ 沉淀析出率下降。`
      } else {
        safeRangeDescription = `当前 pH=${pH.toFixed(1)} 偏高：酸度偏低易引起 Fe²⁺ 局部水解混入沉淀，降低钛白粉纯度与白度。`
      }
    } else if (systemId === 'al-fe-si') {
      // 铝土矿拜耳法：通入过量 CO2 将强碱性溶液酸化至 pH 9.5~11.0 析出 Al(OH)3
      safePhRange = [9.5, 11.0]
      hasSafeRange = true
      isPhInSafeRange = pH >= safePhRange[0] && pH <= safePhRange[1]
      if (isPhInSafeRange) {
        safeRangeDescription = `处于偏铝酸根酸化完全沉淀最佳区间 [9.5 ~ 11.0]：通入 CO₂ 转化为 Al(OH)₃ 沉淀和 HCO₃⁻，产率达峰！`
      } else if (pH > 11.0) {
        safeRangeDescription = `当前 pH=${pH.toFixed(1)} 碱度偏高：尚未充分通入 CO₂，强碱环境下 Al(OH)₃ 继续以 [Al(OH)₄]⁻ 溶解损失。`
      } else {
        safeRangeDescription = `当前 pH=${pH.toFixed(1)} 偏酸：CO₂ 通入过量导致沉淀物重新溶解，或造成酸性杂质共析出。`
      }
    } else if (systemId === 'li-fe-p') {
      // 磷酸铁锂回收：第一步调 pH 2.0~2.5 析出 FePO4 沉淀，Li+ 留在溶液中
      safePhRange = [2.0, 2.5]
      hasSafeRange = true
      isPhInSafeRange = pH >= safePhRange[0] && pH <= safePhRange[1]
      if (isPhInSafeRange) {
        safeRangeDescription = `处于 FePO₄ 沉淀最佳酸度区间 [2.0 ~ 2.5]：Fe³⁺ 与 PO₄³⁻ 彻底结合沉淀，Li⁺ 完全保留在溶液中！`
      } else if (pH < 2.0) {
        safeRangeDescription = `当前 pH=${pH.toFixed(1)} 偏低：酸度过高导致 FePO₄ 溶解度增加，铁去除不彻底。`
      } else {
        safeRangeDescription = `当前 pH=${pH.toFixed(1)} 偏高：易造成后续杂质微溶共沉，加大沉淀胶体吸附夹带锂损失。`
      }
    } else {
      const impurityItems = ions.filter((i) => {
        const raw = rawIons.find((r) => r.symbol === i.symbol)
        return !raw?.isTarget && raw?.isPhRemoval !== false
      })
      const targetItems = ions.filter((i) => {
        const raw = rawIons.find((r) => r.symbol === i.symbol)
        return raw?.isTarget && raw?.isPhRemoval !== false
      })

      const minSafePh = impurityItems.length > 0 ? Math.max(...impurityItems.map((i) => i.pHEnd)) : 3.5
      const maxSafePh = targetItems.length > 0 ? Math.min(...targetItems.map((i) => i.pHStart)) : 9.0

      const roundedMin = Math.round(minSafePh * 10) / 10
      const roundedMax = Math.round(maxSafePh * 10) / 10
      hasSafeRange = roundedMin <= roundedMax

      safePhRange = [roundedMin, roundedMax]
      isPhInSafeRange = hasSafeRange && pH >= safePhRange[0] && pH <= safePhRange[1]

      if (!hasSafeRange) {
        safeRangeDescription = `无安全分离区间！杂质离子完全沉淀所需 pH (≥${roundedMin}) 高于目标离子析出 pH (≤${roundedMax})，发生严重共沉淀！必须先加氧化剂。`
      } else if (isPhInSafeRange) {
        safeRangeDescription = `处于理论最佳区间 [${roundedMin} ~ ${roundedMax}]：杂质已降至 10⁻⁵ mol/L 以下，主产物无损失！`
      } else if (pH < roundedMin) {
        safeRangeDescription = `当前 pH=${pH.toFixed(1)} 偏低：杂质未完全沉淀 (c > 10⁻⁵ mol/L)，产品纯度受影响。`
      } else {
        safeRangeDescription = `当前 pH=${pH.toFixed(1)} 偏高：已超过目标离子析出阈值 (${roundedMax})，造成产品沉淀损失！`
      }
    }

    // 6. 生成 lg c - pH 沉淀分布拟合曲线数据 (pH 从 0.0 到 14.0，步长 0.2)
    const curveData: Array<{ pH: number; [key: string]: number }> = []
    for (let p = 0; p <= 14; p += 0.2) {
      const curPh = Math.round(p * 100) / 100
      const curPoh = 14 - curPh
      const curCoh = Math.pow(10, -curPoh)

      const point: { pH: number; [key: string]: number } = { pH: curPh }

      ions.forEach((ion) => {
        const cMaxSoluble = kspCalculated(ion.ksp, ion.charge, curCoh, ion.c0)
        let conc = cMaxSoluble
        if (ion.symbol === 'Al³⁺' && curPh > 10.5) {
          const amphotericFactor = Math.pow(10, (curPh - 10.5) * 1.5)
          conc = Math.min(ion.c0, conc + 1e-5 * amphotericFactor)
        }
        // lg c 限制在 [-12, 0] 区间
        const lgC = Math.max(-12, Math.min(0, Math.log10(conc)))
        point[ion.symbol] = Math.round(lgC * 100) / 100
      })

      curveData.push(point)
    }

    // 7. 生成元素走向追踪矩阵 (Element Fate Matrix)
    const elementFates = getElementFates(systemId, isOxidized)

    // 8. 调 pH 试剂不增杂智能评估 (动态按工业体系分层)
    const reagentEvaluations = getReagentEvaluations(systemId)

    // 9. 生成滤渣与滤液成分描述
    const precipitates = ions
      .filter((i) => i.precipitateRatio > 10)
      .map((i) => i.precipitateFormula)
    const filtrateIons = ions
      .filter((i) => i.precipitateRatio < 95)
      .map((i) => i.symbol)

    const precipitateSummary = precipitates.length > 0 ? precipitates.join('、') : '无沉淀'
    const filtrateSummary = filtrateIons.length > 0 ? filtrateIons.join('、') : '无游离离子'

    // 10. 生成浸出动力学曲线数据 (浸出率随温度变化)
    const leachCurveData: Array<{ temp: number; leachRate: number }> = []
    for (let t = 20; t <= 90; t += 5) {
      let lr = 55 + (t - 20) * 0.35
      if (crushSize === 'fine') lr += 15
      else if (crushSize === 'medium') lr += 8
      leachCurveData.push({
        temp: t,
        leachRate: Math.min(98.5, Math.max(30, Math.round(lr * 10) / 10)),
      })
    }

    // 11. 生成结晶溶解度分离曲线数据 (磷酸铁锂展现特有的反常溶解度：随温度升高溶解度反而降低)
    const solubilityCurveData: Array<{ temp: number; main: number; impurity: number }> = []
    for (let t = 0; t <= 100; t += 10) {
      if (systemId === 'li-fe-p') {
        // Li2CO3 反常溶解度：0℃ 1.54g, 20℃ 1.33g, 60℃ 1.01g, 100℃ 0.72g
        const mainSol = Math.round((1.54 - 0.0082 * t) * 100) / 10
        // Na2SO4 伴生杂质正常溶解度：高温极大
        const impSol = Math.round((4.5 + 0.42 * t) * 10) / 10
        solubilityCurveData.push({ temp: t, main: mainSol, impurity: impSol })
      } else {
        const mainSol = Math.round((22 + 0.75 * t + 0.006 * t * t) * 10) / 10
        const impSol = Math.round((34 + 0.08 * t) * 10) / 10
        solubilityCurveData.push({ temp: t, main: mainSol, impurity: impSol })
      }
    }

    // 12. 生成当前工序专属高考考点与设问信息 (与 activeStep 强联动)
    const currentStep = params.activeStep || 3
    let activeStepInfo = {
      title: '工序三：调 pH 水解沉淀槽 (核心探究)',
      focusSubject: '沉淀溶解平衡 Ksp 计算与不增杂原则',
      coreReaction:
        systemId === 'al-fe-si'
          ? '[Al(OH)₄]⁻ + CO₂ = Al(OH)₃↓ + HCO₃⁻'
          : systemId === 'li-fe-p'
          ? 'Fe³⁺ + PO₄³⁻ = FePO₄↓'
          : systemId === 'cu-fe'
          ? 'CuO + 2H⁺ = Cu²⁺ + H₂O'
          : 'MnO + 2H⁺ = Mn²⁺ + H₂O',
      coreQuestion:
        systemId === 'al-fe-si'
          ? '【高考必考】：为什么通入过量 CO₂ 产生沉淀而不是加盐酸？反应离子方程式是什么？'
          : systemId === 'li-fe-p'
          ? '【高考题眼】：调节 pH 至 2.0~2.5 的目的是什么？离子方程式是什么？'
          : '调节溶液 pH 时选择试剂的原则是什么？安全 pH 区间如何确定？',
      scoringAnswer:
        systemId === 'al-fe-si'
          ? '① 偏铝酸根与过量 CO₂ 反应只生成 Al(OH)₃ 沉淀而不会继续溶解，盐酸过量会导致 Al(OH)₃ 两性反溶；② [Al(OH)₄]⁻ + CO₂ = Al(OH)₃↓ + HCO₃⁻。'
          : systemId === 'li-fe-p'
          ? '使 Fe³⁺ 和 PO₄³⁻ 彻底形成难溶的 FePO₄ 沉淀除去，而 Li⁺ 留在滤液中实现铁与锂彻底分离；Fe³⁺ + PO₄³⁻ = FePO₄↓。'
          : '① 消耗 H⁺ 提高 pH，使杂质完全转化为沉淀；② 引入阳离子恰好为主产品阳离子，不增难除杂质；③ 下限保证杂质 c≤10⁻⁵ mol/L，上限防止目标离子沉淀损失。',
    }

    if (currentStep === 1) {
      activeStepInfo = {
        title:
          systemId === 'al-fe-si'
            ? '工序一：铝土矿强碱浸出槽'
            : systemId === 'li-fe-p'
            ? '工序一：正极废粉氧化浸出'
            : '工序一：矿石粉碎与酸浸动力学',
        focusSubject: '固液非均相反应速率与浸出率影响因素',
        coreReaction:
          systemId === 'fe-al-mn'
            ? 'MnO₂ + 2Fe²⁺ + 4H⁺ = Mn²⁺ + 2Fe³⁺ + 2H₂O'
            : systemId === 'al-fe-si'
            ? 'Al₂O₃ + 2OH⁻ + 3H₂O = 2[Al(OH)₄]⁻'
            : systemId === 'li-fe-p'
            ? '2LiFePO₄ + H₂O₂ + H₂SO₄ = 2FePO₄↓ + Li₂SO₄ + 2H₂O'
            : systemId === 'ni-co-li'
            ? '2LiCoO₂ + H₂O₂ + 3H₂SO₄ = 2CoSO₄ + Li₂SO₄ + O₂↑ + 4H₂O'
            : systemId === 'cu-fe'
            ? 'Cu₂(OH)₂CO₃ + 4H⁺ = 2Cu²⁺ + CO₂↑ + 3H₂O'
            : 'MO + 2H⁺ = M²⁺ + H₂O',
        coreQuestion:
          systemId === 'al-fe-si'
            ? '【拜耳法考点】：为什么采用 NaOH 碱浸而不是酸浸？滤渣（赤泥）的主要成分是什么？'
            : '【高考必考】：工业上为了提高矿石中金属的浸出率，可采取哪些措施？',
        scoringAnswer:
          systemId === 'al-fe-si'
            ? '① 利用 Al₂O₃ 的两性溶于强碱生成铝酸钠，而杂质 Fe₂O₃ 不溶于强碱，从而实现铝与铁的第一步分离；② 赤泥主要成分为 Fe₂O₃、水合铝硅酸钠等。'
            : '① 矿石预先粉碎研磨（增大固液反应接触面积）；② 适当提高反应温度；③ 充分搅拌反应液；④ 适当提高浸出液的浓度。',
      }
    } else if (currentStep === 2) {
      activeStepInfo = {
        title:
          systemId === 'ti-fe'
            ? '工序二：铁屑还原防钛水解'
            : systemId === 'al-fe-si'
            ? '工序二：赤泥分离与精细脱硅'
            : systemId === 'li-fe-p'
            ? '工序二：铁磷沉淀分离槽'
            : '工序二：氧化反应预处理',
        focusSubject:
          systemId === 'ti-fe'
            ? '逆向还原防止 Fe³⁺ 混杂发黄'
            : systemId === 'al-fe-si'
            ? '赤泥分离与水合铝硅酸钠析出'
            : systemId === 'li-fe-p'
            ? '生成电池级 FePO₄ 前驱体'
            : '氧化还原价态调控',
        coreReaction:
          systemId === 'ti-fe'
            ? '2Fe³⁺ + Fe = 3Fe²⁺'
            : systemId === 'al-fe-si'
            ? 'SiO₃²⁻ + 2[Al(OH)₄]⁻ = 难溶铝硅酸盐↓ + 2OH⁻'
            : systemId === 'li-fe-p'
            ? 'Fe³⁺ + PO₄³⁻ = FePO₄↓'
            : '2Fe²⁺ + H₂O₂ + 2H⁺ = 2Fe³⁺ + 2H₂O',
        coreQuestion:
          systemId === 'ti-fe'
            ? '【逆向思维考点】：为什么加入铁屑将 Fe³⁺ 还原为 Fe²⁺？'
            : systemId === 'li-fe-p'
            ? '【固液分离考点】：如何证明铁元素与锂元素在此工序实现彻底分离？'
            : '【高考必考】：为什么沉淀除铁前必须加入 H₂O₂ 将 Fe²⁺ 氧化为 Fe³⁺？',
        scoringAnswer:
          systemId === 'ti-fe'
            ? 'Fe³⁺ 极易水解生成 Fe(OH)₃ 沉淀混入钛酸中降低钛白粉白度，加 Fe 还原为 Fe²⁺ 便于留在母液结晶绿矾。'
            : systemId === 'ni-co-li'
            ? 'H₂O₂ 在此反应中作还原剂，将难溶的 +3 价钴还原为可溶的 +2 价 Co²⁺ 溶出。'
            : systemId === 'li-fe-p'
            ? 'FePO₄ 溶度积极小呈白色沉淀析出，滤液中取样滴加 KSCN 溶液不变红说明铁已除净，锂留在滤液中。'
            : 'Fe³⁺ 在低 pH (约3.2) 即可完全沉淀，而 Fe²⁺ 需在 pH 9.0 沉淀，与目标离子共沉淀导致严重损失。',
      }
    } else if (currentStep === 4) {
      activeStepInfo = {
        title:
          systemId === 'al-fe-si'
            ? '工序四：氢氧化铝煅烧制高纯氧化铝'
            : systemId === 'li-fe-p'
            ? '工序四：高温加热沉锂与趁热过滤'
            : systemId === 'cu-fe'
            ? '工序四：胆矾蒸发浓缩冷却结晶'
            : '工序四：产品结晶分离与晶体洗涤',
        focusSubject:
          systemId === 'li-fe-p'
            ? '反常溶解度、趁热过滤与热水洗涤'
            : '结晶方法判定、趁热过滤与洗涤答题规范',
        coreReaction:
          systemId === 'al-fe-si'
            ? '2Al(OH)₃ =(高温煅烧)= Al₂O₃ + 3H₂O'
            : systemId === 'li-fe-p'
            ? '2Li⁺ + CO₃²⁻ =(加热90℃)= Li₂CO₃↓'
            : 'CuSO₄ + 5H₂O = CuSO₄·5H₂O↓',
        coreQuestion:
          systemId === 'li-fe-p'
            ? '【绝杀考点】：为什么沉淀 Li₂CO₃ 必须加热至 90℃ 并采用“趁热过滤”和“热水洗涤”？'
            : '【高考答题规范】：在结晶操作中为什么采用趁热过滤？采用无水乙醇洗涤晶体的目的是什么？',
        scoringAnswer:
          systemId === 'li-fe-p'
            ? '① Li₂CO₃ 具有反常溶解度（温度越高溶解度越小），高温沉淀析出率最高；② 趁热过滤防止降温溶解损失；③ 热水洗涤既能洗去表面可溶性 Na₂SO₄，又最大程度减少 Li₂CO₃ 溶解损耗！'
            : '① 趁热过滤：防止目标产物随温度降低结晶析出损失，或防止杂质结晶析出；② 无水乙醇洗涤：洗去表面杂质；降低晶体溶解损失；无水乙醇易挥发便于快速干燥。',
      }
    }

    // 13. 计算全流程元素质量守恒流 (Mass Balance Flow，基准 100% 目标金属)
    const targetElement =
      systemId === 'fe-al-mn'
        ? 'Mn'
        : systemId === 'fe-cu-zn'
        ? 'Zn'
        : systemId === 'ti-fe'
        ? 'Ti'
        : systemId === 'ni-co-li'
        ? 'Co'
        : systemId === 'al-fe-si'
        ? 'Al'
        : systemId === 'li-fe-p'
        ? 'Li'
        : systemId === 'cu-fe'
        ? 'Cu'
        : 'Mg'

    const feedInRatio = 100.0
    const leachSolutionRatio = Math.round(leachRate * 10) / 10
    const leachLossRatio = Math.round((100.0 - leachSolutionRatio) * 10) / 10

    // 沉淀除杂夹带损失：正常为 1.8%；若 pH 超过安全上限则沉淀损失激增
    let precipitateLossRatio = 1.8
    if (hasSafeRange && pH > safePhRange[1]) {
      const overPh = pH - safePhRange[1]
      precipitateLossRatio = Math.min(
        leachSolutionRatio - 5.0,
        Math.round((1.8 + overPh * 16.0) * 10) / 10
      )
    }
    precipitateLossRatio = Math.round(precipitateLossRatio * 10) / 10

    const purifiedSolutionRatio = Math.max(
      0,
      Math.round((leachSolutionRatio - precipitateLossRatio) * 10) / 10
    )

    // 母液保留约 7.5% 循环回流至酸浸
    const motherLiquorRatio = Math.round((purifiedSolutionRatio * 0.08) * 10) / 10
    // 最终高纯晶体综合收率 (闭环守恒)
    let crystallizeYieldRatio = Math.round((purifiedSolutionRatio - motherLiquorRatio) * 10) / 10
    const diff =
      feedInRatio -
      (leachLossRatio + precipitateLossRatio + motherLiquorRatio + crystallizeYieldRatio)
    if (Math.abs(diff) > 0.01) {
      crystallizeYieldRatio = Math.round((crystallizeYieldRatio + diff) * 10) / 10
    }

    const massBalance: MassBalanceFlow = {
      targetElement,
      feedInRatio,
      leachLossRatio,
      leachSolutionRatio,
      precipitateLossRatio,
      purifiedSolutionRatio,
      crystallizeYieldRatio,
      motherLiquorRatio,
    }

    return {
      systemName,
      targetIon,
      impurityIons,
      ions,
      safePhRange,
      hasSafeRange,
      isPhInSafeRange,
      safeRangeDescription,
      leachRate,
      isOxidized,
      precipitateSummary,
      filtrateSummary,
      curveData,
      elementFates,
      reagentEvaluations,
      leachCurveData,
      solubilityCurveData,
      massBalance,
      activeStepInfo,
    }
  }, [systemId, pH, leachTemp, crushSize, oxidantAmount, params.activeStep, params.crystallizeMethod, params.washSolvent])
}

function kspCalculated(ksp: number, charge: number, cOH: number, c0: number): number {
  if (cOH <= 0) return c0
  const cMaxSoluble = ksp / Math.pow(cOH, charge)
  return Math.min(c0, cMaxSoluble)
}
