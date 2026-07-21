import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { useVseprChemistry } from './hooks/useVseprChemistry'
import { VseprScene } from './components/VseprScene'

export default function VseprAnimation() {
  const { params } = useAnimationStore(
    useShallow((s) => ({ params: s.params })),
  )

  const presetIdx = typeof params.presetIdx === 'number' ? params.presetIdx : 0
  const showLonePairs = Boolean(params.showLonePairs ?? 1)
  const showPolyhedron = Boolean(params.showPolyhedron ?? 1)
  const showAngles = Boolean(params.showAngles ?? 1)

  const { molecule } = useVseprChemistry({ presetIdx })

  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas 场景 (保持中屏纯净，不放任何大段重复文字与面板) */}
      <VseprScene
        molecule={molecule}
        showLonePairs={showLonePairs}
        showPolyhedron={showPolyhedron}
        showAngles={showAngles}
      />
    </div>
  )
}
