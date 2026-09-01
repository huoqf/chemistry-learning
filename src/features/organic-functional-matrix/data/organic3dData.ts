/**
 * organic3dData — 3D 分子模型数据库统一入口
 */
import { FUNCTIONAL_GROUP_3D_MOLECULES } from './organic3dGroups'
import { ISOMER_3D_MOLECULES } from './organic3dIsomers'
import { GAOKAO_3D_MOLECULES } from './organic3dGaokao'
import type { Organic3DMolecule } from './organic3dTypes'

export * from './organic3dTypes'
export * from './organic3dGroups'
export * from './organic3dIsomers'
export * from './organic3dGaokao'

export const ORGANIC_3D_MOLECULES: Record<string, Organic3DMolecule> = {
  ...FUNCTIONAL_GROUP_3D_MOLECULES,
  ...ISOMER_3D_MOLECULES,
  ...GAOKAO_3D_MOLECULES,
}

// 别名双向兼容 (与 constants.ts 中的 FUNCTIONAL_GROUPS 完全对齐)
ORGANIC_3D_MOLECULES['halo-halogen'] = ORGANIC_3D_MOLECULES['halo-alkane-x']
ORGANIC_3D_MOLECULES['peptide-amide'] = ORGANIC_3D_MOLECULES['amide-conh']

/**
 * 获取官能团或母题对应的 3D 分子模型 (支持别名映射)
 */
export function get3DModelForGroup(groupId: string): Organic3DMolecule | undefined {
  if (ORGANIC_3D_MOLECULES[groupId]) {
    return ORGANIC_3D_MOLECULES[groupId]
  }
  const aliasMap: Record<string, string> = {
    'halo-halogen': 'halo-alkane-x',
    'halo-alkane-x': 'halo-halogen',
    'peptide-amide': 'amide-conh',
    'amide-conh': 'peptide-amide',
  }
  const targetId = aliasMap[groupId]
  return targetId ? ORGANIC_3D_MOLECULES[targetId] : undefined
}
