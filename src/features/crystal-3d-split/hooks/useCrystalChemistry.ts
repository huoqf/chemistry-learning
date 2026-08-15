import { useMemo } from 'react'
import type {
  CrystalTypeData,
  ElementCountDetail,
  CrystalCalculationResult,
} from '../types'

const NA = 6.022e23 // 阿伏加德罗常数

export function useCrystalChemistry(
  crystalData: CrystalTypeData,
  edgeLengthPm: number,
  molarMassInput?: number
): CrystalCalculationResult {
  return useMemo(() => {
    const M = molarMassInput && molarMassInput > 0 ? molarMassInput : crystalData.molarMass

    // 1. 按元素归类统计均摊数
    const elementMap = new Map<string, ElementCountDetail>()

    for (const atom of crystalData.atoms) {
      if (!elementMap.has(atom.element)) {
        elementMap.set(atom.element, {
          element: atom.element,
          color: atom.color,
          cornerCount: 0,
          edgeCount: 0,
          faceCount: 0,
          bodyCount: 0,
          internalCount: 0,
          netCount: 0,
        })
      }

      const detail = elementMap.get(atom.element)!
      switch (atom.locationType) {
        case 'corner':
          detail.cornerCount += 1
          detail.netCount += 1 / 8
          break
        case 'edge':
          detail.edgeCount += 1
          detail.netCount += 1 / 4
          break
        case 'face':
          detail.faceCount += 1
          detail.netCount += 1 / 2
          break
        case 'body':
          detail.bodyCount += 1
          detail.netCount += 1
          break
        case 'internal':
          detail.internalCount += 1
          detail.netCount += 1
          break
      }
    }

    const elementDetails = Array.from(elementMap.values())

    // 2. 几何与原子净个数计算
    let totalZ = 1
    let formulaRatioStr = ''

    if (crystalData.id === 'nacl') {
      totalZ = 4
      formulaRatioStr = 'Na₄Cl₄ ➔ 4 NaCl'
    } else if (crystalData.id === 'cscl') {
      totalZ = 1
      formulaRatioStr = 'Cs₁Cl₁ ➔ CsCl'
    } else if (crystalData.id === 'cu-fcc') {
      totalZ = 4
      formulaRatioStr = 'Cu₄ (N = 4)'
    } else if (crystalData.id === 'fe-bcc') {
      totalZ = 2
      formulaRatioStr = 'Fe₂ (N = 2)'
    } else if (crystalData.id === 'diamond') {
      totalZ = 8
      formulaRatioStr = 'C₈ (N = 8)'
    } else if (crystalData.id === 'caf2') {
      totalZ = 4
      formulaRatioStr = 'Ca₄F₈ ➔ 4 CaF₂'
    } else if (crystalData.id === 'catio3') {
      totalZ = 1
      formulaRatioStr = 'Ca₁Ti₁O₃ ➔ CaTiO₃'
    } else if (crystalData.id === 'hcp-mg') {
      totalZ = 2
      formulaRatioStr = 'Mg₂ (N = 2)'
    }

    // 3. 单个晶胞质量 (g)
    const cellMassGram = (totalZ * M) / NA
    const cellMassLatex = `m_{\\text{cell}} = \\frac{N \\cdot M}{N_{\\text{A}}} = \\frac{${totalZ} \\cdot ${M}}{N_{\\text{A}}} \\text{ g}`

    // 4. 晶胞体积 (cm³) 与公式导出
    const aCm = edgeLengthPm * 1e-10
    let cellVolumeCm3 = 0
    let cellVolumeLatex = ''
    let densityLatex = ''

    if (crystalData.id === 'hcp-mg') {
      // 六方晶胞 V = a² * sin(60°) * c
      const cPm = crystalData.defaultHeightPm || Math.sqrt(8 / 3) * edgeLengthPm
      const cCm = cPm * 1e-10
      cellVolumeCm3 = aCm * aCm * Math.sin(Math.PI / 3) * cCm
      cellVolumeLatex = `V = a^2 c \\sin(60^\\circ) = (${edgeLengthPm} \\times 10^{-10})^2 \\cdot (${Math.round(cPm)} \\times 10^{-10}) \\cdot \\frac{\\sqrt{3}}{2} = ${edgeLengthPm}^2 \\cdot ${Math.round(cPm)} \\cdot \\frac{\\sqrt{3}}{2} \\cdot 10^{-30} \\text{ cm}^3`
      densityLatex = `\\rho = \\frac{${totalZ} \\cdot M}{\\frac{\\sqrt{3}}{2} a^2 c \\cdot 10^{-30} \\cdot N_{\\text{A}}} \\text{ g/cm}^3`
    } else {
      // 立方晶胞 V = a³
      cellVolumeCm3 = Math.pow(aCm, 3)
      cellVolumeLatex = `V = a^3 = (${edgeLengthPm} \\times 10^{-10})^3 = ${edgeLengthPm}^3 \\cdot 10^{-30} \\text{ cm}^3`
      densityLatex = `\\rho = \\frac{${totalZ} \\cdot M}{a^3 \\cdot 10^{-30} \\cdot N_{\\text{A}}} = \\frac{${totalZ} \\cdot ${M}}{(${edgeLengthPm} \\times 10^{-10})^3 \\cdot N_{\\text{A}}} \\text{ g/cm}^3`
    }

    // 5. 密度数值计算
    const densityValue = cellMassGram / cellVolumeCm3

    // 6. 空间利用率 % (针对常见单质金属与金刚石)
    let spaceOccupancyPercent: number | undefined
    let spaceOccupancyLatex: string | undefined

    if (crystalData.id === 'cu-fcc' || crystalData.id === 'hcp-mg') {
      spaceOccupancyPercent = 74.05
      spaceOccupancyLatex = '\\eta = \\frac{V_{\\text{atoms}}}{V_{\\text{cell}}} = \\frac{\\pi}{\\sqrt{18}} \\approx 74\\%'
    } else if (crystalData.id === 'fe-bcc') {
      spaceOccupancyPercent = 68.02
      spaceOccupancyLatex = '\\eta = \\frac{\\sqrt{3}\\pi}{8} \\approx 68\\%'
    } else if (crystalData.id === 'diamond') {
      spaceOccupancyPercent = 34.01
      spaceOccupancyLatex = '\\eta = \\frac{\\sqrt{3}\\pi}{16} \\approx 34\\%'
    }

    return {
      elementDetails,
      formulaRatioStr,
      totalZ,
      cellMassGram,
      cellMassLatex,
      cellVolumeCm3,
      cellVolumeLatex,
      densityValue,
      densityLatex,
      spaceOccupancyPercent,
      spaceOccupancyLatex,
    }
  }, [crystalData, edgeLengthPm, molarMassInput])
}
