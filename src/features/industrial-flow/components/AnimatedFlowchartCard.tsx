import React from 'react'
import { IndustrialFlowSvgFlowchart } from './IndustrialFlowSvgFlowchart'
import { useFlowAnimationPhase } from '../hooks/useFlowAnimationPhase'
import type { IndustrialFlowChemistry, IndustrialFlowSystemId } from '../types'

interface AnimatedFlowchartCardProps {
  active: boolean
  systemId: IndustrialFlowSystemId
  activeStep: number
  focusTitle: string
  onSelectStep: (step: number) => void
  chemistry: IndustrialFlowChemistry
  pH: number
}

export const AnimatedFlowchartCard: React.FC<AnimatedFlowchartCardProps> = ({
  active,
  systemId,
  activeStep,
  focusTitle,
  onSelectStep,
  chemistry,
  pH,
}) => {
  const flowPhase = useFlowAnimationPhase(active)

  return (
    <div className="w-full h-[225px] bg-white rounded-xl border border-slate-200 shrink-0 shadow-xs overflow-hidden flex flex-col">
      <div className="px-3 py-1 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
        <span className="font-bold text-slate-700">
          工艺流程方框图（点击各工序槽体下钻微观机理）
        </span>
        <span className="text-[10px] text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100 font-medium">
          当前聚焦：{focusTitle}
        </span>
      </div>
      <div className="flex-1 w-full min-h-0">
        <IndustrialFlowSvgFlowchart
          systemId={systemId}
          activeStep={activeStep}
          onSelectStep={onSelectStep}
          chemistry={chemistry}
          pH={pH}
          flowPhase={flowPhase}
        />
      </div>
    </div>
  )
}
