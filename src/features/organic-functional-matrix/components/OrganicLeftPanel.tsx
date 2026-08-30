import React from 'react'
import { LeftPanel, LeftPanelSection, Button } from '@/components/UI'
import { FUNCTIONAL_GROUPS } from '../constants'
import { Plus, Minus, RotateCcw } from 'lucide-react'

interface OrganicLeftPanelProps {
  selectedGroupId: string
  groupCounts: Record<string, number>
  onSelectGroup: (id: string) => void
  onChangeCount: (id: string, delta: number) => void
  onApplyPreset: (presetCounts: Record<string, number>) => void
  onResetCounts: () => void
}

export const OrganicLeftPanel: React.FC<OrganicLeftPanelProps> = ({
  selectedGroupId,
  groupCounts,
  onSelectGroup,
  onChangeCount,
  onApplyPreset,
  onResetCounts,
}) => {
  return (
    <LeftPanel>
      <LeftPanelSection title="高考经典分子快速载入">
        <div className="grid grid-cols-2 gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              onApplyPreset({
                'phenol-ester': 1,
                'carboxyl-cooh': 1,
              })
            }
          >
            阿司匹林结构
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              onApplyPreset({
                'phenol-oh': 1,
                'ester-coor': 1,
              })
            }
          >
            水杨酸甲酯
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              onApplyPreset({
                'alkene-c=c': 1,
                'carboxyl-cooh': 1,
                'alcohol-oh': 1,
              })
            }
          >
            多官能团综合
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              onApplyPreset({
                'aldehyde-cho': 1,
                'phenol-oh': 1,
              })
            }
          >
            水杨醛结构
          </Button>
        </div>
      </LeftPanelSection>

      <LeftPanelSection title="10 大高频官能团数量调控与组合">
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
          {FUNCTIONAL_GROUPS.map((group) => {
            const count = groupCounts[group.id] || 0
            const isSelected = selectedGroupId === group.id
            return (
              <div
                key={group.id}
                onClick={() => onSelectGroup(group.id)}
                className={`p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800">{group.name}</span>
                  <span className="font-mono text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded text-[11px]">
                    {group.structureSvg}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500">分子内个数：</span>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onChangeCount(group.id, -1)}
                      disabled={count <= 0}
                      className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-xs text-slate-900 w-4 text-center font-mono">
                      {count}
                    </span>
                    <button
                      onClick={() => onChangeCount(group.id, 1)}
                      className="w-5 h-5 flex items-center justify-center rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </LeftPanelSection>

      <LeftPanelSection title="重置操作">
        <Button variant="secondary" size="sm" onClick={onResetCounts} className="w-full">
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          清空所有官能团
        </Button>
      </LeftPanelSection>
    </LeftPanel>
  )
}
