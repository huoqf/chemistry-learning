/**
 * src/data/quiz/index.ts
 * 题库数据聚合入口 —— 只做 re-export 和 map 组装，无业务逻辑
 * 新增母题：在对应独立文件中添加数据，并在此处注册即可
 */
export type { ScoringStep, GaokaoVariantItem, ModelQuizData } from './types'

import { modelValenceMatrix } from './model-valence-matrix'
import { modelTitrationBalance } from './model-titration-balance'
import { modelCrystal3dSplit } from './model-crystal-3d-split'
import { modelHessLaw } from './model-hess-law'
import { modelElementPeriodicProperty } from './model-element-periodic-property'
import { modelAvogadroConstant } from './model-avogadro-constant'
import { modelTitrationErrorPurity } from './model-titration-error-purity'
import { modelOrganicMechanism } from './model-organic-mechanism'
import { modelOrganicRetrosynthesis } from './model-organic-retrosynthesis'
import { modelReagentStep } from './model-reagent-step'
import { modelFlashCards } from './model-flash-cards'
import { modelIndustrialFlow } from './model-industrial-flow'
import { modelReactionPrincipleNexus } from './model-reaction-principle-nexus'
import { modelElectrochemicalTwin } from './model-electrochemical-twin'
import { modelGasChainQuiz } from './model-gas-chain'
import { vseprHybridQuizData } from './model-vsepr-hybrid-3d'
import { modelIonMatrix } from './model-ion-matrix'
import { modelOrganicMatrix } from './model-organic-matrix'

import type { ModelQuizData } from './types'

export const modelQuizMap: Record<string, ModelQuizData> = {
  [modelValenceMatrix.modelId]: modelValenceMatrix,
  [modelTitrationBalance.modelId]: modelTitrationBalance,
  [modelCrystal3dSplit.modelId]: modelCrystal3dSplit,
  [modelHessLaw.modelId]: modelHessLaw,
  [modelElementPeriodicProperty.modelId]: modelElementPeriodicProperty,
  [modelAvogadroConstant.modelId]: modelAvogadroConstant,
  [modelTitrationErrorPurity.modelId]: modelTitrationErrorPurity,
  [modelOrganicMechanism.modelId]: modelOrganicMechanism,
  [modelOrganicRetrosynthesis.modelId]: modelOrganicRetrosynthesis,
  [modelReagentStep.modelId]: modelReagentStep,
  [modelFlashCards.modelId]: modelFlashCards,
  [modelIndustrialFlow.modelId]: modelIndustrialFlow,
  [modelReactionPrincipleNexus.modelId]: modelReactionPrincipleNexus,
  [modelElectrochemicalTwin.modelId]: modelElectrochemicalTwin,
  [modelGasChainQuiz.modelId]: modelGasChainQuiz,
  [vseprHybridQuizData.modelId]: vseprHybridQuizData,
  [modelIonMatrix.modelId]: modelIonMatrix,
  [modelOrganicMatrix.modelId]: modelOrganicMatrix,
}

export function getModelQuizData(modelId: string): ModelQuizData | undefined {
  return modelQuizMap[modelId]
}
