import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { useChiralChemistry } from './hooks/useChiralChemistry'
import { ChiralMoleculeScene } from './components/ChiralMoleculeScene'
import { isWebGLAvailable } from '@/components/Chemistry3D'

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
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-slate-200 p-8 text-center">
        <div className="text-6xl mb-4">🔬</div>
        <h2 className="text-xl font-bold mb-2">WebGL 不可用</h2>
        <p className="text-sm text-slate-400 max-w-md">
          当前环境无法渲染 WebGL 3D 场景，请确保硬件加速开启或使用现代浏览器。
        </p>
      </div>
    )
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
