import React from 'react'
import type { VseprMoleculeData, DisplayMode } from '../types'
import { VseprScene } from './3d/VseprScene'
import { VseprCenterLegend } from './VseprCenterLegend'
import { isWebGLAvailable } from '@/components/Chemistry3D'

interface VseprCenterViewProps {
  molecule: VseprMoleculeData
  displayMode: DisplayMode
  showAngleAnnotation: boolean
  showSpaceFilling: boolean
}

function WebGLFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-8 text-center select-none">
      <div className="text-6xl mb-4">🔬</div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">WebGL 3D 环境不可用</h2>
      <p className="text-sm text-slate-500 max-w-md">
        当前浏览器或环境暂不支持 WebGL 硬件加速，无法直接渲染 3D 杂化轨道与分子构型。
        请尝试开启浏览器 WebGL 支持或更换现代浏览器。
      </p>
    </div>
  )
}

/**
 * VSEPR 3D 几何工具中屏容器 (含 3D Canvas 与右下角浮动图例)
 */
export const VseprCenterView: React.FC<VseprCenterViewProps> = ({
  molecule,
  displayMode,
  showAngleAnnotation,
  showSpaceFilling,
}) => {
  if (!isWebGLAvailable()) {
    return <WebGLFallback />
  }

  return (
    <div className="w-full h-full relative bg-slate-50 overflow-hidden">
      {/* 1. 3D WebGL 画布 (主屏纯矢量 3D，无文字表情干扰) */}
      <VseprScene
        molecule={molecule}
        displayMode={displayMode}
        showAngleAnnotation={showAngleAnnotation}
        showSpaceFilling={showSpaceFilling}
      />

      {/* 2. 中屏右下角图例说明 */}
      <VseprCenterLegend
        displayMode={displayMode}
        showAngleAnnotation={showAngleAnnotation}
        hasLonePairs={molecule.lonePairNodes.length > 0}
      />
    </div>
  )
}
