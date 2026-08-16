import type {
  RetrosynthesisModelId,
  RetrosynthesisModelData,
} from '../types'
import {
  GAOKAO_PROTECTION_CHEAT_SHEET,
  MODEL_ASPIRIN_BENORILATE,
  MODEL_DIELS_ALDER_ACETAL,
} from './modelsDataA'
import {
  MODEL_DOUBLE_BOND_PROTECTION,
  MODEL_CARBON_CARBON_BUILDER,
} from './modelsDataB'

export { GAOKAO_PROTECTION_CHEAT_SHEET }

export const RETRO_MODELS_DATA: Record<RetrosynthesisModelId, RetrosynthesisModelData> = {
  'aspirin-benorilate': MODEL_ASPIRIN_BENORILATE,
  'diels-alder-acetal': MODEL_DIELS_ALDER_ACETAL,
  'double-bond-protection': MODEL_DOUBLE_BOND_PROTECTION,
  'carbon-carbon-builder': MODEL_CARBON_CARBON_BUILDER,
}
