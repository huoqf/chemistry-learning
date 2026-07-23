import { useAnimationViewport } from '@/hooks'
import { CANVAS_PRESETS } from '@/theme'
import { AnimationSvgCanvas } from '@/components/Layout'
import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { useRedoxElectronTransferChemistry } from './hooks/useRedoxElectronTransferChemistry'
import { RedoxElectronTransferScene } from './components/RedoxElectronTransferScene'
import { ValenceStaircaseChart } from './components/ValenceStaircaseChart'

/**
 * 电子转移与化合价动画
 * 布局：splitH — 左侧 SVG 动画(50%) + 右侧 DOM 图表(50%)
 * 禁止使用 foreignObject 内嵌图表，图表在 SVG 外独立 DOM 层渲染
 */
export default function RedoxElectronTransferAnimation() {
  // 1. 精确订阅 store 高频字段
  const { params, time } = useAnimationStore(
    useShallow((s) => ({ params: s.params, time: s.time }))
  )

  // 2. splitH Viewport：左侧 SVG 画布 (420×650)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitH,
  })

  // 3. 参数提取
  const { reaction = 0, moleAmount = 1.0, bridgeStyle = 0 } = params

  // 4. 纯化学计算 hook
  const chemistry = useRedoxElectronTransferChemistry({
    reactionIndex: reaction,
    moleAmount,
    time,
  })

  // 5. splitH 布局：左侧 SVG 动画 + 右侧图表 (DOM 层，无 foreignObject)
  return (
    <div className="w-full h-full flex flex-row overflow-hidden">
      {/* 左侧：SVG 动画区 (splitH 左区，flex-1 = 50%) */}
      <div className="flex-1 h-full min-w-0">
        <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
          <RedoxElectronTransferScene
            chemistry={chemistry}
            bridgeStyle={bridgeStyle}
            canvasSize={canvasSize}
          />
        </AnimationSvgCanvas>
      </div>

      {/* 右侧：图表区 (DOM 层，与 SVG 平级，无 foreignObject) */}
      <div className="flex-1 h-full min-w-0 flex flex-col overflow-hidden border-l border-slate-200/60">
        <ValenceStaircaseChart chemistry={chemistry} />
      </div>
    </div>
  )
}
