/**
 * 晶体数据库汇总
 */

import { createNaClData } from './nacl'
import { createCsClData } from './cscl'
import { createCuData } from './fccCu'
import { createFeData } from './bccFe'
import { createDiamondData } from './diamond'
import { createCaF2Data } from './caf2'
import { createHcpMgData } from './hcpMg'
import { createCO2Data } from './co2'
import type { CrystalTypeData } from '../types'

export const CRYSTAL_DATABASE: Record<string, CrystalTypeData> = {
  nacl: createNaClData(),
  cscl: createCsClData(),
  'fcc-cu': createCuData(),
  'bcc-fe': createFeData(),
  diamond: createDiamondData(),
  caf2: createCaF2Data(),
  'hcp-mg': createHcpMgData(),
  co2: createCO2Data(),
}

export {
  createNaClData,
  createCsClData,
  createCuData,
  createFeData,
  createDiamondData,
  createCaF2Data,
  createHcpMgData,
  createCO2Data,
}
