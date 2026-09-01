import type {
  RetrosynthesisModelId,
  RetrosynthesisModelData,
} from '../types'
import { GAOKAO_PROTECTION_CHEAT_SHEET } from './retrosynthesisCheatSheet'
import {
  MODEL_ASPIRIN_BENORILATE,
  MODEL_DIELS_ALDER_ACETAL,
  MODEL_DOUBLE_BOND_PROTECTION,
} from './protectionStrategyModels'
import { MODEL_CARBON_CARBON_BUILDER } from './carbonChainBuilderModels'

export { GAOKAO_PROTECTION_CHEAT_SHEET }

export const RETRO_MODELS_DATA: Record<RetrosynthesisModelId, RetrosynthesisModelData> = {
  'aspirin-benorilate': MODEL_ASPIRIN_BENORILATE,
  'diels-alder-acetal': MODEL_DIELS_ALDER_ACETAL,
  'double-bond-protection': MODEL_DOUBLE_BOND_PROTECTION,
  'carbon-carbon-builder': MODEL_CARBON_CARBON_BUILDER,
}
