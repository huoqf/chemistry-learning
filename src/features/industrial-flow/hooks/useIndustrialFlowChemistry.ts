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
  ElementFate,
  MassBalanceFlow,
} from '../types'

/**
 * 25℃ 各金属氢氧化物溶度积常数统一采用高中化学（人教版选择性必修1附录/高考真题标准题设）：
 * - Fe(OH)₃: 4.0e-38 (对应完全沉淀 pH=3.20)
 * - Fe(OH)₂: 8.0e-16 (对应完全沉淀 pH=8.95)
 * - Al(OH)₃: 1.0e-33 (对应完全沉淀 pH=4.70)
 * - Mn(OH)₂: 1.9e-13 (对应开始沉淀 pH=8.40)
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
        },
        {
          symbol: 'Fe²⁺',
          name: '亚铁离子',
          charge: 2,
          ksp: 8.0e-16,
          baseC0: 0.08,
          color: CHART_COLORS.compareA,
          precipitateFormula: 'Fe(OH)₂',
        },
        {
          symbol: 'Mg²⁺',
          name: '镁离子',
          charge: 2,
          ksp: 1.8e-11,
          baseC0: 0.03,
          color: CHART_COLORS.compareC,
          precipitateFormula: 'Mg(OH)₂',
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
    } else {
      // mg-ca 盐湖卤水/白云石系统
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
    const impurityItems = ions.filter((i) => {
      const raw = rawIons.find((r) => r.symbol === i.symbol)
      return !raw?.isTarget && raw?.isPhRemoval !== false
    })
    const targetItems = ions.filter((i) => rawIons.find((r) => r.symbol === i.symbol)?.isTarget)

    const minSafePh = impurityItems.length > 0 ? Math.max(...impurityItems.map((i) => i.pHEnd)) : 3.5
    const maxSafePh = targetItems.length > 0 ? Math.min(...targetItems.map((i) => i.pHStart)) : 9.0

    const roundedMin = Math.round(minSafePh * 10) / 10
    const roundedMax = Math.round(maxSafePh * 10) / 10
    const hasSafeRange = roundedMin <= roundedMax

    const safePhRange: [number, number] = [roundedMin, roundedMax]
    const isPhInSafeRange = hasSafeRange && pH >= safePhRange[0] && pH <= safePhRange[1]

    let safeRangeDescription = ''
    if (!hasSafeRange) {
      safeRangeDescription = `无安全分离区间！杂质离子完全沉淀所需 pH (≥${roundedMin}) 高于目标离子析出 pH (≤${roundedMax})，发生严重共沉淀！必须先加氧化剂。`
    } else if (isPhInSafeRange) {
      safeRangeDescription = `处于理论最佳区间 [${roundedMin} ~ ${roundedMax}]：杂质已降至 10⁻⁵ mol/L 以下，主产物无损失！`
    } else if (pH < roundedMin) {
      safeRangeDescription = `当前 pH=${pH.toFixed(1)} 偏低：杂质未完全沉淀 (c > 10⁻⁵ mol/L)，产品纯度受影响。`
    } else {
      safeRangeDescription = `当前 pH=${pH.toFixed(1)} 偏高：已超过目标离子析出阈值 (${roundedMax})，造成产品沉淀损失！`
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
    let elementFates: ElementFate[] = []
    if (systemId === 'fe-al-mn') {
      elementFates = [
        {
          element: 'Mn (主产物)',
          rawState: 'MnO₂ (软锰矿)',
          leachState: 'Mn²⁺ (经还原浸出)',
          separationStep: '调 pH=4.7~8.1 保留在滤液',
          finalState: 'MnSO₄·H₂O 晶体',
          isTarget: true,
        },
        {
          element: 'Fe (主要杂质)',
          rawState: 'Fe₂O₃ / FeSO₄ 还原剂',
          leachState: isOxidized ? 'Fe³⁺ (已充分氧化)' : 'Fe²⁺ (氧化不足)',
          separationStep: isOxidized ? '调 pH≥3.2 完全沉淀' : '需 pH≥9.0 才沉淀(无法分离)',
          finalState: isOxidized ? 'Fe(OH)₃ 沉淀 (中和渣)' : '残留溶液污染 MnSO₄',
          isTarget: false,
        },
        {
          element: 'Al (伴生杂质)',
          rawState: 'Al₂O₃ (泥质脉石)',
          leachState: 'Al³⁺ 铝离子',
          separationStep: '调 pH≥4.7 完全沉淀 (防强碱再溶解)',
          finalState: 'Al(OH)₃ 沉淀 (中和渣)',
          isTarget: false,
        },
        {
          element: 'Si (不溶脉石)',
          rawState: 'SiO₂ 石英砂',
          leachState: '不溶于稀硫酸',
          separationStep: '酸浸后过滤直接分离',
          finalState: '滤渣 I (浸出渣)',
          isTarget: false,
        },
      ]
    } else if (systemId === 'fe-cu-zn') {
      elementFates = [
        {
          element: 'Zn (主产物)',
          rawState: 'ZnO / ZnS 烟道灰',
          leachState: 'Zn²⁺ 锌离子',
          separationStep: '调 pH=5.2 保留在滤液',
          finalState: 'ZnSO₄·7H₂O 晶体',
          isTarget: true,
        },
        {
          element: 'Cu (重金属杂质)',
          rawState: 'CuO 铜杂质',
          leachState: 'Cu²⁺ 铜离子',
          separationStep: '后续加过量锌粉置换深度除铜',
          finalState: 'Cu 单质沉淀渣 (回收铜)',
          isTarget: false,
        },
        {
          element: 'Fe (主要杂质)',
          rawState: 'Fe₂O₃ / FeO',
          leachState: isOxidized ? 'Fe³⁺' : 'Fe²⁺',
          separationStep: '调 pH≥3.2 水解沉淀',
          finalState: 'Fe(OH)₃ 沉淀 (中和渣)',
          isTarget: false,
        },
        {
          element: 'Al (伴生杂质)',
          rawState: 'Al₂O₃',
          leachState: 'Al³⁺',
          separationStep: '调 pH≥4.7 水解沉淀',
          finalState: 'Al(OH)₃ 沉淀 (中和渣)',
          isTarget: false,
        },
      ]
    } else if (systemId === 'ti-fe') {
      elementFates = [
        {
          element: 'Ti (主产物)',
          rawState: 'FeTiO₃ (钛铁矿)',
          leachState: 'TiOSO₄ (钛酰硫酸盐)',
          separationStep: '加热稀释水解析出 H₂TiO₃',
          finalState: '煅烧生成高纯 TiO₂ (钛白粉)',
          isTarget: true,
        },
        {
          element: 'Fe (伴生回收)',
          rawState: 'Fe²⁺ / Fe³⁺ 氧化物',
          leachState: '加铁屑还原为 Fe²⁺ (防水解)',
          separationStep: '降温结晶析出绿矾',
          finalState: 'FeSO₄·7H₂O 副产晶体',
          isTarget: false,
        },
        {
          element: 'Mg (伴生杂质)',
          rawState: 'MgO 脉石',
          leachState: 'Mg²⁺ (水解弱，留在母液)',
          separationStep: '多次结晶后母液外排处理',
          finalState: '母液废渣',
          isTarget: false,
        },
      ]
    } else if (systemId === 'ni-co-li') {
      elementFates = [
        {
          element: 'Co/Ni/Li (主产品)',
          rawState: 'LiCoO₂ / LiNiO₂ 正极废料',
          leachState: 'Co²⁺ / Ni²⁺ / Li⁺ (H₂O₂还原浸出)',
          separationStep: '除杂后萃取分离或分步沉淀',
          finalState: 'CoSO₄ / NiSO₄ 电池级盐',
          isTarget: true,
        },
        {
          element: 'Fe/Al (集流体杂质)',
          rawState: '铝箔 / 铁外壳杂质',
          leachState: 'Fe³⁺ / Al³⁺',
          separationStep: '调 pH=4.7~5.0 沉淀去除',
          finalState: 'Fe(OH)₃ / Al(OH)₃ 混合滤渣',
          isTarget: false,
        },
        {
          element: 'Ca/Mg (水质杂质)',
          rawState: '工艺水引入杂质',
          leachState: 'Ca²⁺ / Mg²⁺',
          separationStep: '加入 NaF 深度沉淀',
          finalState: 'CaF₂ / MgF₂ 难溶氟化物渣',
          isTarget: false,
        },
      ]
    } else {
      elementFates = [
        {
          element: 'Mg (主产物)',
          rawState: 'Mg²⁺ 盐湖卤水 / 白云石',
          leachState: 'Mg²⁺ 镁离子',
          separationStep: '调 pH 去铁铝后加碱沉淀',
          finalState: 'Mg(OH)₂ 煅烧得高纯 MgO',
          isTarget: true,
        },
        {
          element: 'Fe/Al (微量杂质)',
          rawState: '黏土伴生泥',
          leachState: 'Fe³⁺ / Al³⁺',
          separationStep: '用 MgO 调 pH=5.0 沉淀',
          finalState: 'Fe(OH)₃ / Al(OH)₃ 滤渣',
          isTarget: false,
        },
        {
          element: 'Ca (主要共生离子)',
          rawState: 'Ca²⁺ 卤水伴生',
          leachState: 'Ca²⁺ 钙离子',
          separationStep: '加入草酸铵或硫酸根沉淀',
          finalState: 'CaC₂O₄ 沉淀分离',
          isTarget: false,
        },
      ]
    }

    // 8. 调 pH 试剂不增杂智能评估
    const reagentEvaluations = [
      {
        reagent: 'MnO',
        isRecommended: systemId === 'fe-al-mn',
        label: 'MnO (氧化锰)',
        tag: systemId === 'fe-al-mn' ? '首选推荐' : '异相增杂',
        warning: systemId !== 'fe-al-mn' ? '引入 Mn²⁺ 杂质离子' : undefined,
      },
      {
        reagent: 'ZnO',
        isRecommended: systemId === 'fe-cu-zn',
        label: 'ZnO (氧化锌)',
        tag: systemId === 'fe-cu-zn' ? '首选推荐' : '异相增杂',
        warning: systemId !== 'fe-cu-zn' ? '引入 Zn²⁺ 杂质离子' : undefined,
      },
      {
        reagent: 'MgO',
        isRecommended: systemId === 'mg-ca',
        label: 'MgO (氧化镁)',
        tag: systemId === 'mg-ca' ? '首选推荐' : '异相增杂',
        warning: systemId !== 'mg-ca' ? '引入 Mg²⁺ 杂质离子' : undefined,
      },
      {
        reagent: 'CuO',
        isRecommended: false,
        label: 'CuO (氧化铜)',
        tag: '特定铜工艺推荐',
        warning: '非铜主产物工艺将引入 Cu²⁺ 重金属杂质',
      },
      {
        reagent: 'Na2CO3',
        isRecommended: false,
        label: 'Na₂CO₃ (碳酸钠)',
        tag: '慎用',
        warning: '引入 Na⁺ 杂质且剧烈放气，难以从硫酸盐中分离',
      },
      {
        reagent: 'CaCO3',
        isRecommended: false,
        label: 'CaCO₃ (石灰石)',
        tag: '副产 CaSO₄',
        warning: '生成微溶 CaSO₄ 结垢包裹，增加过滤阻力',
      },
      {
        reagent: 'NaOH',
        isRecommended: false,
        label: 'NaOH (烧碱)',
        tag: '易局部过碱',
        warning: '强碱极易造成局部 pH 过高，导致 Al(OH)₃ 两性反溶且引入 Na⁺',
      },
    ]

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

    // 11. 生成结晶溶解度分离曲线数据
    const solubilityCurveData: Array<{ temp: number; main: number; impurity: number }> = []
    for (let t = 0; t <= 100; t += 10) {
      const mainSol = Math.round((22 + 0.75 * t + 0.006 * t * t) * 10) / 10
      const impSol = Math.round((34 + 0.08 * t) * 10) / 10
      solubilityCurveData.push({ temp: t, main: mainSol, impurity: impSol })
    }

    // 12. 生成当前工序专属高考考点与设问信息 (与 activeStep 强联动)
    const currentStep = params.activeStep || 3
    let activeStepInfo = {
      title: '工序三：调 pH 水解沉淀槽 (核心探究)',
      focusSubject: '沉淀溶解平衡 Ksp 计算与不增杂原则',
      coreReaction: 'MnO + 2H⁺ = Mn²⁺ + H₂O',
      coreQuestion: '调节溶液 pH 时选择试剂的原则是什么？安全 pH 区间如何确定？',
      scoringAnswer:
        '① 消耗 H⁺ 提高 pH，使杂质完全转化为沉淀；② 引入阳离子恰好为主产品阳离子，不增难除杂质；③ 下限保证杂质 c≤10⁻⁵ mol/L，上限防止目标离子沉淀损失。',
    }

    if (currentStep === 1) {
      activeStepInfo = {
        title: '工序一：矿石粉碎与酸浸动力学',
        focusSubject: '固液非均相反应速率与浸出率影响因素',
        coreReaction:
          systemId === 'fe-al-mn'
            ? 'MnO₂ + 2Fe²⁺ + 4H⁺ = Mn²⁺ + 2Fe³⁺ + 2H₂O'
            : systemId === 'ni-co-li'
            ? '2LiCoO₂ + H₂O₂ + 3H₂SO₄ = 2CoSO₄ + Li₂SO₄ + O₂↑ + 4H₂O'
            : 'MO + 2H⁺ = M²⁺ + H₂O',
        coreQuestion: '【高考必考】：工业上为了提高矿石中金属的浸出率，可采取哪些措施？',
        scoringAnswer:
          '① 矿石预先粉碎研磨（增大固液反应接触面积）；② 适当提高酸浸反应温度；③ 充分搅拌反应液；④ 适当提高浸出酸的浓度。',
      }
    } else if (currentStep === 2) {
      activeStepInfo = {
        title:
          systemId === 'ti-fe'
            ? '工序二：铁屑还原防钛水解'
            : systemId === 'ni-co-li'
            ? '工序二：H₂O₂ 还原浸出调控'
            : '工序二：氧化反应预处理',
        focusSubject:
          systemId === 'ti-fe'
            ? '逆向还原防止 Fe³⁺ 混杂发黄'
            : systemId === 'ni-co-li'
            ? 'H₂O₂ 作还原剂还原高价钴'
            : '氧化还原价态调控',
        coreReaction:
          systemId === 'ti-fe'
            ? '2Fe³⁺ + Fe = 3Fe²⁺'
            : systemId === 'ni-co-li'
            ? '2LiCoO₂ + H₂O₂ + 3H₂SO₄ = 2CoSO₄ + Li₂SO₄ + O₂↑ + 4H₂O'
            : '2Fe²⁺ + H₂O₂ + 2H⁺ = 2Fe³⁺ + 2H₂O',
        coreQuestion:
          systemId === 'ti-fe'
            ? '【逆向思维考点】：为什么加入铁屑将 Fe³⁺ 还原为 Fe²⁺？'
            : systemId === 'ni-co-li'
            ? '【高考高频】：H₂O₂ 在此反应中表现什么性质？'
            : '【高考必考】：为什么沉淀除铁前必须加入 H₂O₂ 将 Fe²⁺ 氧化为 Fe³⁺？',
        scoringAnswer:
          systemId === 'ti-fe'
            ? 'Fe³⁺ 极易水解生成 Fe(OH)₃ 沉淀混入钛酸中降低钛白粉白度，加 Fe 还原为 Fe²⁺ 便于留在母液结晶绿矾。'
            : systemId === 'ni-co-li'
            ? 'H₂O₂ 在此反应中作还原剂，将难溶的 +3 价钴还原为可溶的 +2 价 Co²⁺ 溶出。'
            : 'Fe³⁺ 在低 pH (约3.2) 即可完全沉淀，而 Fe²⁺ 需在 pH 9.0 沉淀，与目标离子共沉淀导致严重损失。',
      }
    } else if (currentStep === 4) {
      activeStepInfo = {
        title:
          systemId === 'fe-cu-zn'
            ? '工序四：锌粉置换除铜与结晶提纯'
            : systemId === 'ti-fe'
            ? '工序四：加热稀释水解制备钛酸'
            : '工序四：产品结晶分离与晶体洗涤',
        focusSubject: '结晶方法判定、趁热过滤与洗涤答题规范',
        coreReaction:
          systemId === 'fe-cu-zn'
            ? 'Zn + Cu²⁺ = Zn²⁺ + Cu↓'
            : systemId === 'ti-fe'
            ? 'TiOSO₄ + 2H₂O =(加热)= H₂TiO₃↓ + H₂SO₄'
            : 'MnSO₄ + H₂O = MnSO₄·H₂O↓',
        coreQuestion:
          '【高考答题规范】：在结晶操作中为什么采用趁热过滤？采用无水乙醇洗涤晶体的目的是什么？',
        scoringAnswer:
          '① 趁热过滤：防止目标产物随温度降低结晶析出损失，或防止杂质结晶析出；② 无水乙醇洗涤：洗去表面杂质；降低晶体溶解损失；无水乙醇易挥发便于快速干燥。',
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
