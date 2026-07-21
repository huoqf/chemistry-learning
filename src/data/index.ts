export { getAnimationConfig, getAnimationConfigAsync, preloadExtendedRegistry, getAnimationCount, defineAnimations } from './animationRegistry'
export type { AnimationConfig, KnowledgeNode, ParamMeta, ControlMeta, AnimationActions } from './types'
export { preloadQuantityBuilder, getChemistryQuantities, registerQuantityBuilder } from './chemistryQuantities'
export type { ChemistryQuantity, QuantityBuilder } from './chemistryQuantities'
export { knowledgeTree, knowledgeIndex, getKnowledgeNode } from './knowledgeTree'

export { buildKnowledgeTree, countDescendants } from './buildKnowledgeTree'
export type { TreeNode, ChapterGroup } from './buildKnowledgeTree'

// 知识数据子目录
export * from './knowledge'