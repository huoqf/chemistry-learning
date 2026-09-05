import React from 'react'
import { LeftPanel, LeftPanelSection, OptionButton, SegmentedControl } from '@/components/UI'
import type { CrystalTypeId, DisplayMode, CalculationMode, ModelStyle } from '../types'
import { CRYSTAL_DATA_MAP } from '../data/crystalData'

interface Crystal3DLeftPanelProps {
  selectedTypeId: CrystalTypeId
  onSelectType: (typeId: CrystalTypeId) => void
  modelStyle: ModelStyle
  onChangeModelStyle: (style: ModelStyle) => void
  displayMode: DisplayMode
  onChangeDisplayMode: (mode: DisplayMode) => void
  calculationMode: CalculationMode
  onChangeCalculationMode: (mode: CalculationMode) => void
  highlightElement: string | null
  onSelectHighlightElement: (element: string | null) => void
}

export const Crystal3DLeftPanel: React.FC<Crystal3DLeftPanelProps> = ({
  selectedTypeId,
  onSelectType,
  modelStyle,
  onChangeModelStyle,
  displayMode,
  onChangeDisplayMode,
  calculationMode,
  onChangeCalculationMode,
  highlightElement,
  onSelectHighlightElement,
}) => {
  const currentCrystal = CRYSTAL_DATA_MAP[selectedTypeId]

  // 查出晶胞中包含的所有唯一元素名称
  const availableElements = Array.from(
    new Set(currentCrystal.atoms.map((a) => a.element))
  )

  const crystalList = Object.values(CRYSTAL_DATA_MAP)

  const modelStyleOptions = [
    { label: '晶格骨架 (点阵)', value: 'ball-stick' },
    { label: '紧密堆积 (相切刚球)', value: 'space-filling' },
  ]

  const displayModeOptions = [
    { label: '完整晶胞', value: 'default' },
    { label: '爆炸外扩', value: 'exploded' },
    { label: '均摊切割', value: 'cutting' },
    { label: '相切几何', value: 'geometry' },
  ]

  const calculationModeOptions = [
    { label: '字母代数推导', value: 'algebraic' },
    { label: '实测数值代入', value: 'numerical' },
  ]

  return (
    <LeftPanel>
      {/* 晶胞模型选择 */}
      <LeftPanelSection title="晶胞模型">
        <div className="grid grid-cols-2 gap-1.5">
          {crystalList.map((c) => (
            <OptionButton
              key={c.id}
              label={c.name}
              selected={c.id === selectedTypeId}
              onClick={() => onSelectType(c.id)}
              variant="preset"
            />
          ))}
        </div>
      </LeftPanelSection>

      {/* 晶胞外观风格与均摊剖面模式 */}
      <LeftPanelSection title="外观与均摊剖面">
        <div className="space-y-2">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 mb-1">
              模型呈现风格 (教材对照):
            </div>
            <SegmentedControl
              options={modelStyleOptions}
              value={modelStyle}
              onChange={(val) => onChangeModelStyle(val as ModelStyle)}
            />
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-500 mb-1">
              微粒剖面与均摊动作:
            </div>
            <SegmentedControl
              options={displayModeOptions}
              value={displayMode}
              onChange={(val) => onChangeDisplayMode(val as DisplayMode)}
            />
          </div>
        </div>
      </LeftPanelSection>

      {/* 微粒透视筛选 */}
      <LeftPanelSection title="微粒透视筛选">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectHighlightElement(null)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
              highlightElement === null
                ? 'bg-slate-800 text-white border-slate-800 font-medium shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            全部微粒
          </button>
          {availableElements.map((el) => (
            <button
              key={el}
              onClick={() => onSelectHighlightElement(el)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                highlightElement === el
                  ? 'bg-blue-600 text-white border-blue-600 font-medium shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              仅看 {el}
            </button>
          ))}
        </div>
      </LeftPanelSection>

      {/* 高考大题推导模式 */}
      <LeftPanelSection title="大题推导模式">
        <SegmentedControl
          options={calculationModeOptions}
          value={calculationMode}
          onChange={(val) => onChangeCalculationMode(val as CalculationMode)}
        />
      </LeftPanelSection>
    </LeftPanel>
  )
}
