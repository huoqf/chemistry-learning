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
      centerValenceElectrons: a, // 中心原子价电子数 a
      terminalAtomCount: x, // 配位原子数 x (σ键数)
      terminalAtomElectronNeed: b, // 配位原子结合电子需求数 b
      charge,
      vseprPairs,
      lonePairs,
      hybridization,
      vseprGeometryName,
      molecularGeometryName,
      actualAngle,
    } = molecule

    // 格式化阴阳离子电荷符号：阳离子减去电荷，阴离子加上电荷
    const chargeLatex = charge === 0 ? '' : charge < 0 ? ` + ${Math.abs(charge)}` : ` - ${charge}`
    const chargeDesc = charge === 0 ? '' : charge < 0 ? ` (阴离子加 ${Math.abs(charge)} 个电子)` : ` (阳离子减 ${charge} 个电子)`

    // 1. 标准 KaTeX 公式字符串 (严格遵循高中选必2课标: 价层电子对数 = x + (a ± q - xb) / 2)
    const vseprFormulaText = `\\text{价层对数} = x + \\frac{a - xb ${chargeLatex}}{2} = ${x} + \\frac{${a} - ${x} \\times ${b}${chargeLatex}}{2} = ${vseprPairs}`

    // 2. 构造高考阅卷分步踩分推导步骤
    const vseprCalculationSteps = `
1. 确定中心原子 (${centerAtomSymbol}) 价电子数 a = ${a}${chargeDesc}；
2. 确定配位原子数 x = ${x} (每个配位原子需求电子数 b = ${b})；
3. 代入公式计算中心原子孤电子对数 n = (${a}${chargeLatex} - ${x}×${b}) / 2 = ${lonePairs}；
4. 计算价层电子对总数 = x + n = ${x} + ${lonePairs} = ${vseprPairs}；
5. 判断杂化类型与构型：${vseprPairs} 对 ➔ ${hybridization} 杂化；
   • VSEPR 理想模型：${vseprGeometryName}
   • 分子/离子实际空间构型：${molecularGeometryName}。
`.trim()

    // 3. 孤电子对排斥力与键角变化描述
    let lonePairRepulsionDescription = ''
    if (lonePairs === 0) {
      lonePairRepulsionDescription = `中心原子无孤电子对，${x} 对成键电子对在空间完全对称排布，实际键角等于理想夹角 (${actualAngle}°)。`
    } else if (lonePairs === 1) {
      lonePairRepulsionDescription = `中心原子含 1 对孤电子对。孤电子对对成键电子对的静电排斥力大于成键电子对之间的排斥力，将键角挤压至 ${actualAngle}°。`
    } else {
      lonePairRepulsionDescription = `中心原子含 ${lonePairs} 对孤电子对。孤电子对-孤电子对及孤电子对-成键电子对的排斥效应显著叠加，将键角大幅压缩至 ${actualAngle}°。`
    }

    return {
      currentMolecule: molecule,
      vseprFormulaText,
      vseprCalculationSteps,
      lonePairRepulsionDescription,
    }
  }, [molecule])
}
