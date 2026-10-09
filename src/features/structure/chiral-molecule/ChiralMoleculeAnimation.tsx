import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { useChiralChemistry } from './hooks/useChiralChemistry'
import { ChiralMoleculeScene } from './components/ChiralMoleculeScene'
import { isWebGLAvailable, WebGLFallback } from '@/components/Chemistry3D'

export default function ChiralMoleculeAnimation() {
  const { params, setParams } = useAnimationStore(
    useShallow((s) => ({ params: s.params, setParams: s.setParams })),
  )

  const presetIdx = typeof params.presetIdx === 'number' ? params.presetIdx : 0
  const showMirror = Boolean(params.showMirror ?? 1)
  const showChiralLabels = Boolean(params.showChiralLabels ?? 1)
  const showCisTransCompare = Boolean(params.showCisTransCompare ?? 0)
  const rawOverlapRatio = typeof params.mirrorOverlapRatio === 'number' ? params.mirrorOverlapRatio : 0
  const mirrorOverlapRatio = rawOverlapRatio > 1 ? rawOverlapRatio / 100 : rawOverlapRatio

  const { molecule, mirroredMolecule } = useChiralChemistry({
    presetIdx,
    showMirror,
    mirrorOverlapRatio,
  })

  if (!isWebGLAvailable()) {
    // 中屏 fallback 背景由系统 Light Theme 统一提供（铁律 1：禁止手写任何深浅色背景）
    return <WebGLFallback />
  }

  return (
    <div className="w-full h-full relative">
      <ChiralMoleculeScene
        molecule={molecule}
        mirroredMolecule={mirroredMolecule}
        showMirror={showMirror && !showCisTransCompare}
        showChiralLabels={showChiralLabels}
        showCisTransCompare={showCisTransCompare && molecule.type === 'cis-trans'}
        mirrorOverlapRatio={mirrorOverlapRatio}
        onRatioChange={(r) => setParams({ mirrorOverlapRatio: Math.round(r * 100) })}
      />
    </div>
  )
}
