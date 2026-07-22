import type { RefObject } from 'react'
import { AnimationSvgCanvas } from '@/components/Layout'
import type { IsomerNode } from '@/components/Chemistry'
import { colors } from '@/theme'
import { Isomer2DScene } from './Isomer2DScene'
import { Isomer3DScene } from './Isomer3DScene'

export interface IsomerismSceneProps {
  containerRef: RefObject<HTMLDivElement | null>
  transform: string
  currentIsomer: IsomerNode
  showEquivalentH: boolean
  font: (n: number) => number
}

/**
 * IsomerismScene — 中屏 2D/3D 左右分屏联动场景
 *
 * 中屏规范布局：
 * - 左侧 50%：标准的 AnimationSvgCanvas + vp.transform (基于 CANVAS_PRESETS.splitH 420x650) 渲染纯 2D SVG 场景 (Isomer2DScene)
 * - 右侧 50%：标准的 R3F Canvas 渲染 3D 空间球棍场景 (Isomer3DScene)
 *
 * 异构体切换由左屏 controlMeta 声明式控件统一管理，中屏不再放置切换栏。
 * 分屏不叠加装饰底纹，沿用 AnimationPage 提供的白色卡片容器。
 */
export function IsomerismScene({
  containerRef,
  transform,
  currentIsomer,
  showEquivalentH,
  font,
}: IsomerismSceneProps) {
  return (
    <div className="w-full h-full flex flex-row">
      {/* 1. 左侧 50%：标准 2D SVG 场景 (AnimationSvgCanvas + vp.transform) */}
      <div className="w-1/2 h-full min-w-0 relative">
        <AnimationSvgCanvas containerRef={containerRef} transform={transform}>
          <Isomer2DScene
            isomer={currentIsomer}
            showEquivalentH={showEquivalentH}
            font={font}
          />
        </AnimationSvgCanvas>
      </div>

      {/* 2. 右侧 50%：标准 3D WebGL 场景 (R3F Canvas) */}
      <div
        className="w-1/2 h-full min-w-0"
        style={{ boxShadow: `inset 0 0 0 1.5px ${colors.neutral[300]}` }}
      >
        <Isomer3DScene isomer={currentIsomer} />
      </div>
    </div>
  )
}
