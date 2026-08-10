import React from 'react'
import { LeftPanel, LeftPanelSection, ParamControl, SegmentedControl } from '@/components/UI'
import type { CrystalTypeId, DisplayMode } from '../types'
import { CRYSTAL_DATA_MAP } from '../data/crystalData'

interface Crystal3DLeftPanelProps {
  selectedTypeId: CrystalTypeId
  onSelectType: (typeId: CrystalTypeId) => void
  displayMode: DisplayMode
  onChangeDisplayMode: (mode: DisplayMode) => void
  edgeLengthPm: number
  onChangeEdgeLength: (val: number) => void
  molarMass: number
  onChangeMolarMass: (val: number) => void
  highlightElement: string | null
  onSelectHighlightElement: (element: string | null) => void
}

export const Crystal3DLeftPanel: React.FC<Crystal3DLeftPanelProps> = ({
  selectedTypeId,
  onSelectType,
  displayMode,
  onChangeDisplayMode,
  edgeLengthPm,
  onChangeEdgeLength,
  molarMass,
  onChangeMolarMass,
  highlightElement,
  onSelectHighlightElement,
}) => {
  const currentCrystal = CRYSTAL_DATA_MAP[selectedTypeId]

  // 查出晶胞中包含的所有唯一元素名称
  const availableElements = Array.from(
    new Set(currentCrystal.atoms.map((a) => a.element))
  )

  const crystalList = Object.values(CRYSTAL_DATA_MAP)

  const displayModeOptions = [
    { label: '🧊 完整晶胞', value: 'default' },
    { label: '💥 爆炸外扩', value: 'exploded' },
    { label: '✂️ 均摊切割', value: 'cutting' },
    { label: '📐 相切几何', value: 'geometry' },
  ]

  return (
    <LeftPanel>
      {/* 高考晶胞选择（卡片按钮组件，只显示标题） */}
      <LeftPanelSection title="1. 选择高考晶胞模型">
        <div className="grid grid-cols-2 gap-1.5">
          {crystalList.map((c) => {
            const isSelected = c.id === selectedTypeId
            return (
              <button
                key={c.id}
                onClick={() => onSelectType(c.id)}
                title={c.name}
                className={`px-2.5 py-2 rounded-lg border text-left text-xs font-semibold truncate transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {c.name}
              </button>
            )
          })}
        </div>

        {/* 当前选中晶胞要点说明卡片 */}
        <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
          <div className="font-bold text-blue-700 mb-0.5 flex items-center gap-1">
            <span>🔬</span> {currentCrystal.name}
          </div>
          <div className="text-[11px] text-slate-600">
            {currentCrystal.description}
          </div>
        </div>
      </LeftPanelSection>

      {/* 均摊与切割剖面模式 */}
      <LeftPanelSection title="2. 均摊与切割剖面模式">
        <SegmentedControl
          options={displayModeOptions}
          value={displayMode}
          onChange={(val) => onChangeDisplayMode(val as DisplayMode)}
        />
      </LeftPanelSection>

      {/* 参数调控 */}
      <LeftPanelSection title="3. 参数调控 (大题求解)">
        <ParamControl
          params={[
            {
              key: 'edgeLengthPm',
              label: '晶胞边长 a',
              value: edgeLengthPm,
              min: 200,
              max: 800,
              step: 1,
              unit: 'pm',
            },
            {
              key: 'molarMass',
              label: '摩尔质量 M',
              value: molarMass,
              min: 10,
              max: 300,
              step: 0.5,
              unit: 'g/mol',
            },
          ]}
          onParamChange={(key, val) => {
            if (key === 'edgeLengthPm') onChangeEdgeLength(val)
            if (key === 'molarMass') onChangeMolarMass(val)
          }}
        />
      </LeftPanelSection>

      {/* 元素独立分析 */}
      <LeftPanelSection title="4. 元素独立分析">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectHighlightElement(null)}
            className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
              highlightElement === null
                ? 'bg-slate-800 text-white border-slate-800 font-medium shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            全部显示
          </button>
          {availableElements.map((el) => (
            <button
              key={el}
              onClick={() => onSelectHighlightElement(el)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                highlightElement === el
                  ? 'bg-blue-600 text-white border-blue-600 font-medium shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              仅高亮 {el}
            </button>
          ))}
        </div>
      </LeftPanelSection>
    </LeftPanel>
  )
}
