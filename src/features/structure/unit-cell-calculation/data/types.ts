/**
 * 晶胞计算类型定义
 */

import type { CellParams } from '@/components/Chemistry3D'

export interface AtomSpec {
  id: string
  element: string
  fracPos: [number, number, number]
  radius: number
  color: string
  label: string
  sharingRatio: number
  locationType: 'corner' | 'face' | 'edge' | 'body' | 'tetrahedral'
}

export interface BondSpec {
  fromIndex: number
  toIndex: number
  color?: string
}

export interface CrystalTypeData {
  id: string
  name: string
  formula: string
  cellParams: CellParams
  defaultA: number // pm
  molarMass: number // g/mol
  zValue: number // 晶胞均占分子数 N
  coordNumber: number // 配位数
  packingEfficiency: number // 空间利用率 (%)
  atoms: AtomSpec[]
  bonds: BondSpec[]
  description: string
}
