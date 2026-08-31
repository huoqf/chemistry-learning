import React from 'react'
import { LeftPanel, LeftPanelSection, Button, SegmentedControl } from '@/components/UI'
import { ION_DATA } from '../constants'
import { RotateCcw, Droplets, FlaskConical, CheckCircle2, Circle } from 'lucide-react'

interface IonLeftPanelProps {
  inquiryMode: 'single-test' | 'coexistence-check'
  selectedIonId: string
  selectedReagentId?: string
  coexistenceSelectedIons: string[]
  dropCount: number
  onSelectMode: (mode: 'single-test' | 'coexistence-check') => void
  onSelectIon: (id: string) => void
  onSelectReagent?: (reagentId: string) => void
  onToggleCoexistenceIon: (id: string) => void
  onDropReagent: () => void
  onResetReaction: () => void
  onResetCoexistence: () => void
}

export const IonLeftPanel: React.FC<IonLeftPanelProps> = ({
  inquiryMode,
  selectedIonId,
  selectedReagentId,
  coexistenceSelectedIons,
  dropCount,
  onSelectMode,
  onSelectIon,
  onSelectReagent,
  onToggleCoexistenceIon,
  onDropReagent,
  onResetReaction,
  onResetCoexistence,
}) => {
  const cations = ION_DATA.filter((i) => i.type === 'cation')
  const anions = ION_DATA.filter((i) => i.type === 'anion')
  const currentIon = ION_DATA.find((i) => i.id === selectedIonId)

  return (
    <LeftPanel>
      {/* 顶部模式切换 */}
      <LeftPanelSection title="探究模式">
        <SegmentedControl
          value={inquiryMode}
          onChange={(val) => onSelectMode(val as 'single-test' | 'coexistence-check')}
          options={[
            { label: '特征离子检验', value: 'single-test' },
            { label: '离子共存排斥', value: 'coexistence-check' },
          ]}
        />
      </LeftPanelSection>

      {inquiryMode === 'single-test' ? (
        <>
          {/* ① 待测溶液样品选择 (4×2 紧凑芯片图谱，冷暖严格分区) */}
          <LeftPanelSection
            title="① 选择待测样品"
          >
            <div className="space-y-1.5">
              {/* 阳离子待测区 (冷蓝微阶) */}
              <div className="p-1.5 rounded-xl bg-blue-50/60 border border-blue-200/80">
                <div className="flex items-center justify-between mb-1 px-0.5">
                  <span className="text-[10px] font-bold text-blue-900 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    阳离子待测区
                  </span>
                  <span className="text-[9px] text-blue-600/80 font-medium">8 种核心</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {cations.map((ion) => {
                    const isSelected = selectedIonId === ion.id
                    return (
                      <button
                        key={ion.id}
                        type="button"
                        onClick={() => onSelectIon(ion.id)}
                        className={`h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center relative border cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-300'
                            : 'bg-white hover:bg-blue-100/70 text-slate-800 border-slate-200/80'
                        }`}
                        title={`${ion.name} (${ion.colorInSolution})`}
                      >
                        <span>{ion.id}</span>
                        {/* 离子原液颜色微标 */}
                        <span
                          className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: ion.colorRgb }}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 阴离子待测区 (暖橙微阶) */}
              <div className="p-1.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                <div className="flex items-center justify-between mb-1 px-0.5">
                  <span className="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    阴离子待测区
                  </span>
                  <span className="text-[9px] text-amber-700/80 font-medium">8 种核心</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {anions.map((ion) => {
                    const isSelected = selectedIonId === ion.id
                    return (
                      <button
                        key={ion.id}
                        type="button"
                        onClick={() => onSelectIon(ion.id)}
                        className={`h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center relative border cursor-pointer ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-700 shadow-sm ring-2 ring-amber-300'
                            : 'bg-white hover:bg-amber-100/70 text-slate-800 border-slate-200/80'
                        }`}
                        title={`${ion.name} (${ion.colorInSolution})`}
                      >
                        <span>{ion.id}</span>
                        {/* 离子原液颜色微标 */}
                        <span
                          className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: ion.colorRgb }}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </LeftPanelSection>

          {/* ② 滴管试剂选择 (横向单选胶囊条形态，与上方芯片严格区分) */}
          {currentIon && currentIon.reagentOptions && (
            <LeftPanelSection
              title="② 选择滴管试剂"
            >
              <div className="space-y-1">
                {currentIon.reagentOptions.map((reagent) => {
                  const effectiveReagentId =
                    currentIon.reagentOptions.find((r) => r.id === selectedReagentId)?.id ||
                    currentIon.reagentOptions[0]?.id
                  const isSelected = effectiveReagentId === reagent.id
                  return (
                    <button
                      key={reagent.id}
                      type="button"
                      onClick={() => onSelectReagent && onSelectReagent(reagent.id)}
                      className={`w-full px-2 py-1.5 rounded-lg text-xs text-left flex items-center justify-between border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {isSelected ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-slate-300" />
                        )}
                        <FlaskConical className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                        <span>{reagent.name}</span>
                      </div>
                      {isSelected && (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-blue-500 text-white font-medium">
                          装入
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </LeftPanelSection>
          )}

          {/* ③ 实验触发主动作 (支持连续滴加/分步探究) */}
          <LeftPanelSection title="③ 实验操作 (连续滴加)">
            <div className="space-y-2">
              <Button
                variant={dropCount === 2 ? 'secondary' : 'primary'}
                size="sm"
                onClick={onDropReagent}
                className="w-full shadow-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Droplets className="w-4 h-4 text-blue-400" />
                {dropCount === 0
                  ? '💧 滴加少量试剂 (第1滴)'
                  : dropCount === 1
                  ? '💧 继续滴加至过量 (第2滴)'
                  : '✓ 反应已达过量终点'}
              </Button>

              {dropCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetReaction}
                  className="w-full text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  清空试管重置
                </Button>
              )}
            </div>
          </LeftPanelSection>
        </>
      ) : (
        <>
          {/* 共存排斥模式：4列紧凑网格多选 */}
          <LeftPanelSection
            title="阳离子多选"
            subtitle="勾选混入烧杯的阳离子"
          >
            <div className="grid grid-cols-4 gap-1">
              {cations.map((ion) => {
                const isChecked = coexistenceSelectedIons.includes(ion.id)
                return (
                  <button
                    key={ion.id}
                    type="button"
                    onClick={() => onToggleCoexistenceIon(ion.id)}
                    className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-blue-600 text-white border-blue-700 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{ion.id}</span>
                  </button>
                )
              })}
            </div>
          </LeftPanelSection>

          <LeftPanelSection
            title="阴离子多选"
            subtitle="勾选混入烧杯的阴离子"
          >
            <div className="grid grid-cols-4 gap-1">
              {anions.map((ion) => {
                const isChecked = coexistenceSelectedIons.includes(ion.id)
                return (
                  <button
                    key={ion.id}
                    type="button"
                    onClick={() => onToggleCoexistenceIon(ion.id)}
                    className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-amber-600 text-white border-amber-700 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{ion.id}</span>
                  </button>
                )
              })}
            </div>
          </LeftPanelSection>

          <LeftPanelSection title="体系重置">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetCoexistence}
              className="w-full cursor-pointer"
            >
              清空烧杯离子
            </Button>
          </LeftPanelSection>
        </>
      )}
    </LeftPanel>
  )
}
