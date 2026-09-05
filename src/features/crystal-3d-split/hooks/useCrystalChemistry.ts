import { useMemo } from 'react'
import type {
  CrystalTypeData,
  ElementCountDetail,
  CrystalCalculationResult,
  CalculationMode,
} from '../types'

const NA = 6.022e23 // 阿伏加德罗常数

export function useCrystalChemistry(
  crystalData: CrystalTypeData,
  calculationMode: CalculationMode = 'algebraic'
): CrystalCalculationResult {
  return useMemo(() => {
    const M = crystalData.molarMass
    const aPm = crystalData.defaultEdgeLengthPm
    const aCm = aPm * 1e-10

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
          detail.netCount += atom.sharingRatio
          break
        case 'edge':
          detail.edgeCount += 1
          detail.netCount += atom.sharingRatio
          break
        case 'face':
          detail.faceCount += 1
          detail.netCount += atom.sharingRatio
          break
        case 'body':
          detail.bodyCount += 1
          detail.netCount += atom.sharingRatio
          break
        case 'internal':
          detail.internalCount += 1
          detail.netCount += atom.sharingRatio
          break
      }
    }

    const isHexagonal = crystalData.cellParams.gamma === 120

    const elementDetails = Array.from(elementMap.values()).map((detail) => {
      const normalizedNet = Math.round(detail.netCount * 1000) / 1000
      let cornerFormula: string | undefined
      if (detail.cornerCount > 0) {
        cornerFormula = isHexagonal
          ? '4×1/12 + 4×1/6'
          : `${detail.cornerCount}×1/8`
      }
      return {
        ...detail,
        netCount: normalizedNet,
        cornerDetailFormula: cornerFormula,
      }
    })

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
    } else if (crystalData.id === 'zns') {
      totalZ = 4
      formulaRatioStr = 'Zn₄S₄ ➔ 4 ZnS'
    } else if (crystalData.id === 'catio3') {
      totalZ = 1
      formulaRatioStr = 'Ca₁Ti₁O₃ ➔ CaTiO₃'
    } else if (crystalData.id === 'hcp-mg') {
      totalZ = 2
      formulaRatioStr = 'Mg₂ (N = 2)'
    }

    // 3. 单个晶胞质量 (g)
    const cellMassGram = (totalZ * M) / NA
    const cellMassLatex = `m_{\\text{cell}} = \\frac{Z \\cdot M}{N_{\\text{A}}} = \\frac{${totalZ} \\cdot ${M}}{N_{\\text{A}}} \\text{ g}`

    // 4. 晶胞体积 (cm³) 与高考双模导出式
    let cellVolumeCm3 = 0
    let cellVolumeLatex = ''
    let densityAlgebraicLatex = ''
    let densityNumericalLatex = ''
    let naReverseFormulaLatex = ''

    if (crystalData.id === 'hcp-mg') {
      const cPm = crystalData.defaultHeightPm || Math.round(Math.sqrt(8 / 3) * aPm)
      const cCm = cPm * 1e-10
      cellVolumeCm3 = aCm * aCm * Math.sin(Math.PI / 3) * cCm
      cellVolumeLatex = `V = a^2 c \\sin 60^\\circ = \\frac{\\sqrt{3}}{2} a^2 c \\times 10^{-30} \\text{ cm}^3`
      densityAlgebraicLatex = `\\rho = \\frac{${totalZ * 2}M}{\\sqrt{3} a^2 c \\cdot 10^{-30} \\cdot N_{\\text{A}}} \\text{ g/cm}^3`
      densityNumericalLatex = `\\begin{aligned} \\rho &= \\frac{${totalZ} \\times ${M}}{\\frac{\\sqrt{3}}{2} \\times (${aPm} \\times 10^{-10})^2 \\times (${cPm} \\times 10^{-10}) \\times N_{\\text{A}}} \\\\[3pt] &= \\frac{${(totalZ * M).toFixed(1)}}{\\frac{\\sqrt{3}}{2} \\times ${aPm}^2 \\times ${cPm} \\times 10^{-30} \\times 6.02 \\times 10^{23}} \\text{ g/cm}^3 \\end{aligned}`
      naReverseFormulaLatex = `N_{\\text{A}} = \\frac{${totalZ * 2}M}{\\sqrt{3} a^2 c \\rho \\cdot 10^{-30}}`
    } else {
      cellVolumeCm3 = Math.pow(aCm, 3)
      cellVolumeLatex = `V = a^3 = (${aPm} \\times 10^{-10})^3 = ${aPm}^3 \\times 10^{-30} \\text{ cm}^3`
      densityAlgebraicLatex = `\\rho = \\frac{${totalZ} \\cdot M}{a^3 \\cdot 10^{-30} \\cdot N_{\\text{A}}} \\text{ g/cm}^3`
      densityNumericalLatex = `\\begin{aligned} \\rho &= \\frac{${totalZ} \\times ${M}}{(${aPm} \\times 10^{-10})^3 \\times N_{\\text{A}}} \\\\[3pt] &= \\frac{${(totalZ * M).toFixed(1)}}{${aPm}^3 \\times 10^{-30} \\times 6.02 \\times 10^{23}} \\text{ g/cm}^3 \\end{aligned}`
      naReverseFormulaLatex = `N_{\\text{A}} = \\frac{${totalZ}M}{\\rho \\cdot a^3 \\cdot 10^{-30}}`
    }

    // 5. 密度数值计算
    const densityValue = cellMassGram / cellVolumeCm3
    const densityLatex = calculationMode === 'algebraic' ? densityAlgebraicLatex : densityNumericalLatex

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
      calculationMode,
      elementDetails,
      formulaRatioStr,
      totalZ,
      cellMassGram,
      cellMassLatex,
      cellVolumeCm3,
      cellVolumeLatex,
      densityValue,
      densityLatex,
      densityAlgebraicLatex,
      densityNumericalLatex,
      naReverseFormulaLatex,
      spaceOccupancyPercent,
      spaceOccupancyLatex,
    }
  }, [crystalData, calculationMode])
}
