import { ReactNode } from 'react'
import { ArrowLeftRight } from 'lucide-react'

interface ContrastCanvasProps {
  titleLeft: string
  titleRight: string
  subtitleLeft?: string
  subtitleRight?: string
  childrenLeft: ReactNode
  childrenRight: ReactNode
  badgeLeft?: string
  badgeRight?: string
}

/**
 * 左右双对比画布组件 (ContrastCanvas)
 * 用于原电池 vs 电解池、强酸 vs 弱酸等易混淆高考考点的直观镜像对比
 */
export function ContrastCanvas({
  titleLeft,
  titleRight,
  subtitleLeft,
  subtitleRight,
  childrenLeft,
  childrenRight,
  badgeLeft = '自发反应 (ΔG < 0)',
  badgeRight = '受迫反应 (外接电源)',
}: ContrastCanvasProps) {
  return (
    <div className="w-full h-full p-3 bg-slate-100/60 rounded-xl border border-slate-200 flex flex-col gap-3">
      {/* 顶部中央对比 Banner */}
      <div className="flex items-center justify-between px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 text-sm">{titleLeft}</span>
          {subtitleLeft && <span className="text-xs text-slate-500">({subtitleLeft})</span>}
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-700 font-semibold text-xs shadow-inner">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          高考核心易混考点双对比
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 text-sm">{titleRight}</span>
          {subtitleRight && <span className="text-xs text-slate-500">({subtitleRight})</span>}
        </div>
      </div>

      {/* 左右双对比场景区域 */}
      <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
        {/* 左侧场景 */}
        <div className="relative bg-white rounded-lg border border-slate-200 p-2 flex flex-col shadow-sm overflow-hidden">
          <div className="absolute top-2 left-2 z-10">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {badgeLeft}
            </span>
          </div>
          <div className="flex-1 w-full h-full pt-6">{childrenLeft}</div>
        </div>

        {/* 右侧场景 */}
        <div className="relative bg-white rounded-lg border border-slate-200 p-2 flex flex-col shadow-sm overflow-hidden">
          <div className="absolute top-2 left-2 z-10">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {badgeRight}
            </span>
          </div>
          <div className="flex-1 w-full h-full pt-6">{childrenRight}</div>
        </div>
      </div>
    </div>
  )
}
