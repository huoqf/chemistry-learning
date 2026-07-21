import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { useHybridChemistry } from './hooks/useHybridChemistry'
import { HybridOrbitalScene } from './components/HybridOrbitalScene'

export default function HybridOrbitalAnimation() {
  const { params } = useAnimationStore(
    useShallow((s) => ({ params: s.params })),
  )

  const presetIdx = typeof params.presetIdx === 'number' ? params.presetIdx : 4
  const viewMode = typeof params.viewMode === 'number' ? params.viewMode : 0
  const showUnhybridizedP = Boolean(params.showUnhybridizedP ?? 1)
  const showPhases = Boolean(params.showPhases ?? 1)

  const { model } = useHybridChemistry({ presetIdx })

  return (
    <div className="w-full h-full relative">
      <HybridOrbitalScene
        model={model}
        viewMode={viewMode}
        showUnhybridizedP={showUnhybridizedP}
        showPhases={showPhases}
      />
    </div>
  )
}
