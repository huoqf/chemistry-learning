export type FlashCardCategory =
  | 'all'
  | 'bleaching-redox'
  | 'passivation-acid'
  | 'equilibrium-color'
  | 'inorganic-facts'
  | 'organic-experiment'

export interface FlashCard {
  id: string
  category: FlashCardCategory
  categoryLabel: string
  title: string
  question: string
  optionA: string
  optionB: string
  correctOption: 'A' | 'B'
  explanation: string
  chemicalEquations: string[]
  warningTip: string
  examPoint: string
  relatedKnowledgeIds: string[]
  sceneType:
    | 'bleach-heating'
    | 'passivation-heat'
    | 'gas-compress'
    | 'na-water-cuso4'
    | 'haloalkane-test'
    | 'fe-kscn-equilibrium'
    | 'colloid-tyndall'
    | 'ethanol-reaction'
}

export interface FlashCardParams {
  viewMode: number // 0: 盲盒动画/现象场景, 1: 规范踩分, 2: 高考真题变式
  category: FlashCardCategory // 分类筛选
  cardIndex: number // 当前卡片索引
  isRevealed: boolean // 是否显示解析揭晓/翻面
  selectedOption: 'A' | 'B' | null // 用户选择的选项
  isHeating: boolean // 实验交互：加热开关
  isCompressing: boolean // 实验交互：加压开关
}
