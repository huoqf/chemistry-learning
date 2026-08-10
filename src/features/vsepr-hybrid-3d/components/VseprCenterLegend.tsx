import React from 'react'
import type { DisplayMode } from '../types'
import { CHEMISTRY_COLORS } from '@/theme'

interface VseprCenterLegendProps {
  displayMode: DisplayMode
  showAngleAnnotation: boolean
  hasLonePairs: boolean
}

/**
 * 中屏右下角 3D 图例说明组件 (高清晰线条与形状对照版)
 */
export const VseprCenterLegend: React.FC<VseprCenterLegendProps> = ({
  displayMode,
  showAngleAnnotation,
  hasLonePairs,
}) => {
  return (
    <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-md border border-slate-300 shadow-lg rounded-xl p-3 text-[11px] text-slate-800 space-y-2 pointer-events-none select-none min-w-[210px]">
      {/* 头部标题与模式标识 */}
      <div className="font-bold text-slate-900 text-xs pb-1.5 border-b border-slate-200 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <span>📌</span>
          <span>3D 图例与线条说明</span>
        </span>
        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-semibold border border-indigo-200">
          {displayMode === 'ball_stick' && '分子构型模式'}
          {displayMode === 'vsepr_cloud' && 'VSEPR模型模式'}
          {displayMode === 'hybrid_orbital' && '杂化 Lobes 模式'}
          {displayMode === 'repulsion_demo' && '静电排斥演示'}
        </span>
      </div>

      <div className="space-y-1.5 font-medium">
        {/* 1. 原子与共价键 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700 shadow-xs" />
            <span className="w-3 h-0.5 bg-slate-400" />
          </div>
          <span className="text-slate-700">原子核 & 共价键 (球棍)</span>
        </div>

        {/* 2. VSEPR 理想多面体外框线 (仅 vsepr_cloud 模式显示) */}
        {displayMode === 'vsepr_cloud' && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-0.5 border-t-2 border-dashed shrink-0" style={{ borderColor: CHEMISTRY_COLORS.concentration }} />
            <span className="text-indigo-900 font-semibold">蓝色虚线: VSEPR 理想外框</span>
          </div>
        )}

        {/* 3. 孤电子对包络体 */}
        {hasLonePairs && (displayMode === 'vsepr_cloud' || displayMode === 'repulsion_demo') && (
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-xs border border-amber-300"
              style={{ backgroundColor: CHEMISTRY_COLORS.pressure }}
            />
            <span className="text-amber-900 font-semibold">琥珀球体: 孤电子对包络</span>
          </div>
        )}

        {/* 4. 杂化 Lobes */}
        {displayMode === 'hybrid_orbital' && (
          <>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-xs border border-blue-300"
                style={{ backgroundColor: CHEMISTRY_COLORS.electron }}
              />
              <span className="text-blue-900 font-semibold">蓝色水滴: 成键杂化 Lobe</span>
            </div>
            {hasLonePairs && (
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-xs border border-amber-300"
                  style={{ backgroundColor: CHEMISTRY_COLORS.pressure }}
                />
                <span className="text-amber-900 font-semibold">黄色水滴: 孤对杂化 Lobe</span>
              </div>
            )}
          </>
        )}

        {/* 5. 静电排斥作用矢线 (仅 repulsion_demo 模式显示) */}
        {displayMode === 'repulsion_demo' && hasLonePairs && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-0.5 border-t-2 border-dashed shrink-0" style={{ borderColor: CHEMISTRY_COLORS.temperature }} />
            <span className="text-rose-700 font-semibold">红色虚弧线: 孤对挤压作用力</span>
          </div>
        )}

        {/* 6. 成键电子对夹角 (弧线与 label) */}
        {showAngleAnnotation && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-0.5 shrink-0" style={{ backgroundColor: CHEMISTRY_COLORS.volume }} />
            <span className="text-purple-900 font-semibold">紫色弧线: 成键夹角 (∠)</span>
          </div>
        )}
      </div>
    </div>
  )
}
