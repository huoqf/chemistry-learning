import { useMemo } from 'react'
import type { VseprMoleculeData, VseprChemistryResult } from '../types'

/**
 * 纯化学 VSEPR 计算 Hook
 *
 * @param molecule 当前选中分子/离子数据
 * @returns 格式化后的计算步骤、推导公式与排斥原理说明
 */
export function useVseprChemistry(molecule: VseprMoleculeData): VseprChemistryResult {
  return useMemo(() => {
    const {
      centerAtomSymbol,
      centerValenceElectrons: b,
      terminalAtomCount: a,
      terminalAtomElectronNeed: c,
      charge,
      vseprPairs,
      lonePairs,
      hybridization,
      vseprGeometryName,
      molecularGeometryName,
      actualAngle,
    } = molecule

    // 格式化阴阳离子电荷符号
    const chargeStr = charge === 0 ? '' : charge < 0 ? ` + ${Math.abs(charge)}` : ` - ${charge}`

    // 1. 标准 KaTeX LaTeX 公式字符串 (避免转义陷阱)
    const vseprFormulaText = `\\text{VSEPR} = a + \\frac{b - cx ${chargeStr}}{2} = ${a} + \\frac{${b} - ${c} \\times ${a}${chargeStr}}{2} = ${vseprPairs}`

    // 2. 构造分步踩分推导步骤
    const vseprCalculationSteps = `
1. 中心原子 (${centerAtomSymbol}) 价电子数 b = ${b}；
2. 配位原子数 a = ${a} (每个配位原子需求 c = ${c})；
3. 价层电子对数计算：${a} + (${b} - ${c}×${a}${chargeStr})/2 = ${vseprPairs}；
4. 孤电子对数 = ${lonePairs}；杂化类型 = ${hybridization}；
5. VSEPR 模型 = ${vseprGeometryName}；分子实际空间构型 = ${molecularGeometryName}。
`.trim()

    // 3. 孤电子对排斥力描述 (修正赋值逻辑)
    let lonePairRepulsionDescription = ''
    if (lonePairs === 0) {
      lonePairRepulsionDescription = `中心原子无孤电子对，成键电子对在空间完全均匀分布，实际键角等于理论夹角 (${actualAngle}°)。`
    } else if (lonePairs === 1) {
      lonePairRepulsionDescription = `中心原子包含 1 对孤电子对。孤电子对对成键电子对产生较强的静电排斥，将键角从理论四面体/平面角度压缩至 ${actualAngle}°。`
    } else {
      lonePairRepulsionDescription = `中心原子包含 ${lonePairs} 对孤电子对。孤电子对-孤电子对及孤电子对-成键电子对的叠加排斥力显著增大，将实际键角压缩至 ${actualAngle}°。`
    }

    return {
      currentMolecule: molecule,
      vseprFormulaText,
      vseprCalculationSteps,
      lonePairRepulsionDescription,
    }
  }, [molecule])
}
