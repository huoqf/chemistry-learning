import type { ChemistryQuantity } from '../../chemistryQuantities'
import { CHIRAL_PRESETS } from '../../../features/structure/chiral-molecule/data/chiralData'

export function buildChiralityQuantities(params: Record<string, number>): ChemistryQuantity[] {
  const rawIdx = params.presetIdx ?? 0
  const safeIdx = Math.min(Math.max(0, Math.floor(rawIdx)), CHIRAL_PRESETS.length - 1)
  const mol = CHIRAL_PRESETS[safeIdx] || CHIRAL_PRESETS[0]

  return [
    {
      key: 'chiralCount',
      label: '手性碳原子个数 (*C)',
      value: mol.chiralCount,
      unit: '个',
      colorKey: 'concentration',
      precision: 0,
    },
    {
      key: 'stereoisomerCount',
      label: '最大立体异构体数 N',
      value: mol.stereoisomerCount,
      unit: '种',
      colorKey: 'temperature',
      precision: 0,
    },
    {
      key: 'isChiral',
      label: '手性分子判定',
      value: mol.isChiral ? 1 : 0,
      unit: mol.isChiral ? '具有手性' : '无手性',
      colorKey: 'reactionRate',
      precision: 0,
    },
    {
      key: 'substituentCount',
      label: '手性碳取代基种类',
      value: mol.isChiral ? 4 : 3,
      unit: '种',
      colorKey: 'equilibriumConstant',
      precision: 0,
    },
  ]
}

export const chiralityFormulas = [
  {
    name: '立体异构体总数公式',
    latex: 'N = 2^n',
    level: 'core' as const,
    condition: 'n 为不含对称面/对称中心的手性碳原子个数',
  },
  {
    name: '手性碳原子判断准则',
    latex: '*C \\implies sp^3\\text{杂化且连 4 个不同基团}',
    level: 'core' as const,
    condition: '若包含 2 个相同基团(如 -CH₃)，则存在镜像对称面，无手性',
  },
  {
    name: '顺反异构（几何异构）生成条件',
    latex: 'R_1R_2C = CR_3R_4 \\quad (R_1 \\neq R_2, R_3 \\neq R_4)',
    level: 'core' as const,
    condition: 'C=C双键旋转受阻，每个双键碳连2个不同基团',
  },
]

export const chiralityExamPoints = [
  {
    text: '【手性碳原子 (*C) 识别与标记】高考常在有机推断题中要求找出或标出手性碳原子。识别要点：必须是 sp³ 杂化的饱和碳原子，且该碳原子必须连接 4 个互不相同的原子或原子团。',
    importance: 'gaokao' as const,
  },
  {
    text: '【对映异构与旋光性】手性分子的实物与镜像就像左手和右手，不能完全重合（对映异构体）。手性分子具有旋光性。天然氨基酸（除甘氨酸外）均含手性碳。',
    importance: 'gaokao' as const,
  },
  {
    text: '【顺反异构（几何异构）性质差异】顺式异构体（相同基团在双键同侧）与反式异构体（在异侧）属于立体异构。顺式极性通常强于反式，导致熔沸点与溶解度有显著区别。',
    importance: 'core' as const,
  },
]
