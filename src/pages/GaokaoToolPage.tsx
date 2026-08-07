import { useParams, useNavigate } from 'react-router-dom'
import { getGaokaoModel } from '@/data/gaokaoModels'
import {
  ValenceMatrixCanvas,
  GaokaoToolPlaceholderCanvas,
} from '@/components/Chemistry'
import { OrganicMechanismCanvas } from '@/features/organic/mechanism'
import { TitrationBalanceCanvas } from '@/features/titration-balance'
import { ReagentStepCanvas } from '@/components/Chemistry/ReagentStepCanvas'
import { FlashCardCanvas } from '@/components/Chemistry/FlashCardCanvas'
import { IndustrialFlowCanvas } from '@/features/industrial-flow/IndustrialFlowCanvas'
import { ReactionPrincipleNexusCanvas } from '@/features/reaction-principle/nexus'
import { AvogadroConstantCanvas } from '@/features/avogadro-constant/AvogadroConstantCanvas'
import { HessLawCanvas } from '@/features/reaction-principle/hess-law/HessLawCanvas'
import { TitrationErrorPurityCanvas } from '@/features/titration-error-purity/TitrationErrorPurityCanvas'
import { OrganicRetrosynthesisCanvas } from '@/features/organic-retrosynthesis/OrganicRetrosynthesisCanvas'
import { ElementPeriodicPropertyCanvas } from '@/features/element-periodic-property/ElementPeriodicPropertyCanvas'
import { ElectrochemicalTwinCanvas } from '@/features/electrochemical-twin/ElectrochemicalTwinCanvas'
import { GasChainCanvas } from '@/features/gas-chain'

export default function GaokaoToolPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const model = id ? getGaokaoModel(id) : undefined

  if (!model) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">未找到该高考提分工具</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          返回首页
        </button>
      </div>
    )
  }

  // 13 个已完成专题分发
  switch (model.id) {
    case 'model-valence-matrix':
      return <ValenceMatrixCanvas defaultElementSymbol="Fe" />

    case 'model-reagent-step':
      return <ReagentStepCanvas />

    case 'model-flash-cards':
      return <FlashCardCanvas />

    case 'model-titration-balance':
      return <TitrationBalanceCanvas />

    case 'model-reaction-principle-nexus':
      return <ReactionPrincipleNexusCanvas />

    case 'model-industrial-flow':
      return <IndustrialFlowCanvas />

    case 'model-organic-mechanism':
      return <OrganicMechanismCanvas />

    case 'model-hess-law':
      return <HessLawCanvas />

    case 'model-element-periodic-property':
      return <ElementPeriodicPropertyCanvas />

    case 'model-avogadro-constant':
      return <AvogadroConstantCanvas />

    case 'model-titration-error-purity':
      return <TitrationErrorPurityCanvas />

    case 'model-organic-retrosynthesis':
      return <OrganicRetrosynthesisCanvas />

    case 'model-electrochemical-twin':
      return <ElectrochemicalTwinCanvas />

    case 'model-gas-chain':
      return <GasChainCanvas />

    // 2 个待升级/暂未开放的专题，使用统一的 GaokaoToolPlaceholderCanvas 占位与预告
    case 'model-crystal-3d-split':
    case 'model-vsepr-hybrid-3d':
    default:
      return <GaokaoToolPlaceholderCanvas modelId={model.id} />
  }
}
