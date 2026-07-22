import { useMemo } from 'react'
import { CRYSTAL_DATABASE, type CrystalTypeData } from '../data/unitCellData'

export interface UseUnitCellChemistryParams {
  crystalTypeId: string
  edgeLength?: number // pm
  molarMass?: number // g/mol
}

export interface UnitCellChemistryResult {
  crystalData: CrystalTypeData
  a: number // pm
  M: number // g/mol
  zValue: number // N
  mCellGrams: number // 晶胞质量 g
  vCellCm3: number // 晶胞体积 cm³
  densityGcm3: number // 密度 g/cm³
  packingEfficiency: number // 空间利用率 %
  coordNumber: number // 配位数
  cornerContribution: number // 顶点总贡献
  faceContribution: number // 面心总贡献
  edgeContribution: number // 棱心总贡献
  bodyContribution: number // 体心总贡献
  tetrahedralContribution: number // 四面体空隙总贡献
}

const NA = 6.02214076e23 // 阿伏伽德罗常数 mol^-1

/**
 * 晶胞纯化学与几何计算 Hook
 */
export function useUnitCellChemistry({
  crystalTypeId,
  edgeLength,
  molarMass,
}: UseUnitCellChemistryParams): UnitCellChemistryResult {
  return useMemo(() => {
    const crystalData = CRYSTAL_DATABASE[crystalTypeId] || CRYSTAL_DATABASE.nacl
    const a = edgeLength ?? crystalData.defaultA
    const M = molarMass ?? crystalData.molarMass
    const zValue = crystalData.zValue

    // 晶胞质量 m = N * M / NA (g)
    const mCellGrams = (zValue * M) / NA

    // 晶胞体积 V (cm³)
    // 六方晶系 (hcp-mg): V = (√3/2) * a² * c * 10^-30 cm³, 其中 c = √(8/3) * a
    // 立方晶系: V = (a * 10^-10)^3 = a^3 * 10^-30 cm³
    const isHexagonal = crystalTypeId === 'hcp-mg'
    const cHp = isHexagonal ? Math.sqrt(8 / 3) * a : a
    const vCellCm3 = isHexagonal
      ? (Math.sqrt(3) / 2) * Math.pow(a * 1e-10, 2) * (cHp * 1e-10)
      : Math.pow(a * 1e-10, 3)

    // 理论密度 ρ = m / V (g/cm³)
    const densityGcm3 = vCellCm3 > 0 ? mCellGrams / vCellCm3 : 0

    // 分位置汇总均摊贡献
    let cornerContribution = 0
    let faceContribution = 0
    let edgeContribution = 0
    let bodyContribution = 0
    let tetrahedralContribution = 0

    crystalData.atoms.forEach(atom => {
      switch (atom.locationType) {
        case 'corner':
          cornerContribution += atom.sharingRatio
          break
        case 'face':
          faceContribution += atom.sharingRatio
          break
        case 'edge':
          edgeContribution += atom.sharingRatio
          break
        case 'body':
          bodyContribution += atom.sharingRatio
          break
        case 'tetrahedral':
          tetrahedralContribution += atom.sharingRatio
          break
      }
    })

    return {
      crystalData,
      a,
      M,
      zValue,
      mCellGrams,
      vCellCm3,
      densityGcm3,
      packingEfficiency: crystalData.packingEfficiency,
      coordNumber: crystalData.coordNumber,
      cornerContribution,
      faceContribution,
      edgeContribution,
      bodyContribution,
      tetrahedralContribution,
    }
  }, [crystalTypeId, edgeLength, molarMass])
}
