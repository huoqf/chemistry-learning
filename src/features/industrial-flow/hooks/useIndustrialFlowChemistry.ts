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
            }
          : {
              symbol: 'Fe²⁺',
              name: '亚铁离子',
              charge: 2,
              ksp: 8.0e-16,
              baseC0: 0.05,
              color: CHART_COLORS.compareA,
              precipitateFormula: 'Fe(OH)₂',
            },
        {
          symbol: 'Al³⁺',
          name: '铝离子',
          charge: 3,
          ksp: 1.0e-33,
          baseC0: 0.04,
          color: CHART_COLORS.compareB, // 对比色 B
          precipitateFormula: 'Al(OH)₃',
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
            }
          : {
              symbol: 'Fe²⁺',
              name: '亚铁离子',
              charge: 2,
              ksp: 8.0e-16,
              baseC0: 0.06,
              color: CHART_COLORS.compareA,
              precipitateFormula: 'Fe(OH)₂',
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
          symbol: 'Cu²⁺',
          name: '铜离子 (后续锌置换)',
          charge: 2,
          ksp: 2.2e-20,
          baseC0: 0.05,
          color: CHART_COLORS.compareC,
          precipitateFormula: 'Cu(OH)₂',
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

    // 5. 安全 pH 区间计算
    const impurityItems = ions.filter((i) => !rawIons.find((r) => r.symbol === i.symbol)?.isTarget)
    const targetItems = ions.filter((i) => rawIons.find((r) => r.symbol === i.symbol)?.isTarget)

    const minSafePh = impurityItems.length > 0 ? Math.max(...impurityItems.map((i) => i.pHEnd)) : 3.5
    const maxSafePh = targetItems.length > 0 ? Math.min(...targetItems.map((i) => i.pHStart)) : 9.0

    const safePhRange: [number, number] = [
      Math.round(minSafePh * 10) / 10,
      Math.round(maxSafePh * 10) / 10,
    ]
    const isPhInSafeRange = pH >= safePhRange[0] && pH <= safePhRange[1]

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

    // 7. 生成滤渣与滤液成分描述
    const precipitates = ions
      .filter((i) => i.precipitateRatio > 10)
      .map((i) => i.precipitateFormula)
    const filtrateIons = ions
      .filter((i) => i.precipitateRatio < 95)
      .map((i) => i.symbol)

    const precipitateSummary = precipitates.length > 0 ? precipitates.join('、') : '无沉淀'
    const filtrateSummary = filtrateIons.length > 0 ? filtrateIons.join('、') : '无游离离子'

    return {
      systemName,
      targetIon,
      impurityIons,
      ions,
      safePhRange,
      isPhInSafeRange,
      leachRate,
      isOxidized,
      precipitateSummary,
      filtrateSummary,
      curveData,
    }
  }, [systemId, pH, leachTemp, crushSize, oxidantAmount])
}

function kspCalculated(ksp: number, charge: number, cOH: number, c0: number): number {
  if (cOH <= 0) return c0
  const cMaxSoluble = ksp / Math.pow(cOH, charge)
  return Math.min(c0, cMaxSoluble)
}
