import { useEffect, useRef } from 'react'
import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { useUnitCellChemistry } from './hooks/useUnitCellChemistry'
import { UnitCellScene } from './components/UnitCellScene'
import { CRYSTAL_DATABASE } from './data/unitCellData'

const CRYSTAL_TYPE_KEYS = [
  'nacl',
  'cscl',
  'fcc-cu',
  'bcc-fe',
  'diamond',
  'caf2',
  'hcp-mg',
  'co2',
]

export default function UnitCellCalculationAnimation() {
  // 精确订阅 Store 参数
  const { params } = useAnimationStore(
    useShallow((s) => ({ params: s.params })),
  )

  const crystalTypeIdx = Math.min(
    Math.max(0, Math.floor(params.crystalType ?? 0)),
    CRYSTAL_TYPE_KEYS.length - 1,
  )
  const crystalType = CRYSTAL_TYPE_KEYS[crystalTypeIdx] || 'nacl'

  // 当切换晶体类型时，自动将边长 a 与摩尔质量 M 调整为该晶体的默认化学预设值
  const prevCrystalTypeRef = useRef<string>(crystalType)
  useEffect(() => {
    if (prevCrystalTypeRef.current !== crystalType) {
      prevCrystalTypeRef.current = crystalType
      const targetData = CRYSTAL_DATABASE[crystalType]
      if (targetData) {
        const store = useAnimationStore.getState()
        store.updateParam('edgeLength', targetData.defaultA)
        store.updateParam('molarMass', targetData.molarMass)
      }
    }
  }, [crystalType])

  const targetDefault = CRYSTAL_DATABASE[crystalType]
  const edgeLength = (params.edgeLength as number) ?? targetDefault?.defaultA ?? 564
  const molarMass = (params.molarMass as number) ?? targetDefault?.molarMass ?? 58.44
  const explodeMode = Boolean(params.explodeMode ?? 0)
  const showBonds = Boolean(params.showBonds ?? 1)

  // 纯化学计算
  const chemistry = useUnitCellChemistry({
    crystalTypeId: crystalType,
    edgeLength,
    molarMass,
  })

  return (
    <div className="w-full h-full relative flex flex-col">
      {/* 顶部标题与晶体速查微型 Card */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col gap-1">
        <div className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <span>🧊 {chemistry.crystalData.name}</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-mono">
              {chemistry.crystalData.formula}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {chemistry.crystalData.description}
          </div>
        </div>
      </div>

      {/* 3D Canvas 场景 */}
      <div className="flex-1 min-h-0 relative">
        <UnitCellScene
          crystalData={chemistry.crystalData}
          isExploded={explodeMode}
          showBonds={showBonds}
          edgeLengthPm={chemistry.a}
        />
      </div>
    </div>
  )
}
