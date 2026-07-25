import { useMemo } from 'react'
import { useAnimationViewport } from '@/hooks'
import { CANVAS_PRESETS } from '@/theme'
import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { IsomerismScene } from './components/IsomerismScene'
import {
  PENTANE_ISOMERS,
  BUTANOL_ISOMERS,
  ESTERS_ISOMERS,
  AROMATIC_ISOMERS,
  BUTENE_ISOMERS,
} from '@/data/isomerData'

export default function IsomerismAnimation() {
  // Store 精确订阅
  const params = useAnimationStore(useShallow((s) => s.params))

  // 视口绑定：依据用户提点，左右分屏 preset 选用 CANVAS_PRESETS.splitH (420x650)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitH,
  })

  const isomerType = params.isomerType ?? 0
  const selectedIndex = params.selectedIndex ?? 0
  const showEquivalentH = (params.showEquivalentH ?? 1) === 1

  // 当前所选系的异构体列表 (映射 5 大高考探究体系)
  const currentList = useMemo(() => {
    switch (isomerType) {
      case 1:
        return BUTANOL_ISOMERS
      case 2:
        return ESTERS_ISOMERS
      case 3:
        return AROMATIC_ISOMERS
      case 4:
        return BUTENE_ISOMERS
      case 0:
      default:
        return PENTANE_ISOMERS
    }
  }, [isomerType])

  const safeIndex = Math.min(selectedIndex, currentList.length - 1)
  const currentIsomer = currentList[safeIndex] || currentList[0]

  return (
    <IsomerismScene
      containerRef={containerRef}
      transform={vp.transform}
      currentIsomer={currentIsomer}
      showEquivalentH={showEquivalentH}
      font={canvasSize.font}
    />
  )
}
