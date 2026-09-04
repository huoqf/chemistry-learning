import React from 'react'
import { LeftPanel, LeftPanelSection, Button, SegmentedControl } from '@/components/UI'
import { ION_DATA } from '../constants'
import type { InquiryMode } from '../types'
import {
  RotateCcw,
  Droplets,
  Sparkles,
} from 'lucide-react'

interface IonLeftPanelProps {
  inquiryMode: InquiryMode
  selectedIonId: string
  selectedReagentId?: string
  coexistenceSelectedIons: string[]
  dropCount: number
  selectedMatrixPair?: { cationId: string; anionId: string }
  onSelectMode: (mode: InquiryMode) => void
  onSelectIon: (id: string) => void
  onSelectReagent?: (reagentId: string) => void
  onToggleCoexistenceIon: (id: string) => void
  onDropReagent: () => void
  onResetReaction: () => void
  onResetCoexistence: () => void
  onLoadPresetPair?: (cationId: string, anionId: string) => void
}

export const IonLeftPanel: React.FC<IonLeftPanelProps> = ({
  inquiryMode,
  selectedIonId,
  selectedReagentId,
  coexistenceSelectedIons,
  dropCount,
  selectedMatrixPair,
  onSelectMode,
  onSelectIon,
  onSelectReagent,
  onToggleCoexistenceIon,
  onDropReagent,
  onResetReaction,
  onResetCoexistence,
  onLoadPresetPair,
}) => {
  const cations = ION_DATA.filter((i) => i.type === 'cation')
  const anions = ION_DATA.filter((i) => i.type === 'anion')
  const currentIon = ION_DATA.find((i) => i.id === selectedIonId)

  return (
    <LeftPanel>
      {/* 顶部模式切换：3 档 */}
      <LeftPanelSection title="探究模式">
        <SegmentedControl
          value={inquiryMode}
          onChange={(val) => onSelectMode(val as InquiryMode)}
          options={[
            { label: '特征检验', value: 'single-test' },
            { label: '烧杯模拟', value: 'coexistence-check' },
            { label: '全景大表', value: 'coexistence-matrix' },
          ]}
        />
      </LeftPanelSection>

      {inquiryMode === 'single-test' && (
        <>
          {/* ① 待测溶液样品选择 (冷暖严格分区，14 阳 + 18 阴全集芯片图谱) */}
          <LeftPanelSection title="① 选择待测样品">
            <div className="space-y-2">
              {/* 阳离子待测区 (冷蓝微阶) */}
              <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-200/80">
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <span className="text-[11px] font-bold text-blue-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    阳离子待测区
                  </span>
                  <span className="text-[10px] text-blue-700 font-semibold px-1.5 py-0.2 bg-blue-100/80 rounded-full">
                    {cations.length} 种全集
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {cations.map((ion) => {
                    const isSelected = selectedIonId === ion.id
                    return (
                      <button
                        key={ion.id}
                        type="button"
                        onClick={() => onSelectIon(ion.id)}
                        className={`h-7 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center relative border cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-300'
                            : 'bg-white hover:bg-blue-100/70 text-slate-800 border-slate-200/80'
                        }`}
                        title={`${ion.name} (${ion.colorInSolution})`}
                      >
                        <span>{ion.id}</span>
                        {/* 离子原液颜色微标 */}
                        <span
                          className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full border border-slate-300 shadow-2xs"
                          style={{ backgroundColor: ion.colorRgb }}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 阴离子待测区 (暖橙微阶) */}
              <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-200/80">
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    阴离子待测区
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold px-1.5 py-0.2 bg-amber-100/80 rounded-full">
                    {anions.length} 种全集
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {anions.map((ion) => {
                    const isSelected = selectedIonId === ion.id
                    return (
                      <button
                        key={ion.id}
                        type="button"
                        onClick={() => onSelectIon(ion.id)}
                        className={`h-7 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center relative border cursor-pointer ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-700 shadow-sm ring-2 ring-amber-300'
                            : 'bg-white hover:bg-amber-100/70 text-slate-800 border-slate-200/80'
                        }`}
                        title={`${ion.name} (${ion.colorInSolution})`}
                      >
                        <span className="truncate px-0.5">{ion.id}</span>
                        <span
                          className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full border border-slate-300 shadow-2xs"
                          style={{ backgroundColor: ion.colorRgb }}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </LeftPanelSection>

          {/* ② 检验试剂选择 */}
          {currentIon && currentIon.reagentOptions.length > 0 && (
            <LeftPanelSection title="② 选择鉴别试剂">
              <div className="space-y-1.5">
                {currentIon.reagentOptions.map((reagent) => {
                  const isSelected = selectedReagentId === reagent.id
                  return (
                    <button
                      key={reagent.id}
                      type="button"
                      onClick={() => onSelectReagent?.(reagent.id)}
                      className={`w-full p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{reagent.name}</span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            reagent.tag === 'optimal'
                              ? 'bg-emerald-100 text-emerald-800'
                              : reagent.tag === 'trap'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {reagent.tag === 'optimal'
                            ? '标准试剂'
                            : reagent.tag === 'trap'
                            ? '陷阱试剂'
                            : '干扰试剂'}
                        </span>
                      </div>
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
                  ? '滴加少量试剂 (第1阶段)'
                  : dropCount === 1
                  ? '继续滴加至过量 (第2阶段)'
                  : '✓ 反应已达终点'}
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
      )}

      {inquiryMode === 'coexistence-check' && (
        <>
          {/* 共存排斥模式：4列紧凑网格多选 */}
          <LeftPanelSection title="阳离子多选" subtitle={`勾选混入烧杯的阳离子 (共 ${cations.length} 种)`}>
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

          <LeftPanelSection title="阴离子多选" subtitle={`勾选混入烧杯的阴离子 (共 ${anions.length} 种)`}>
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

      {inquiryMode === 'coexistence-matrix' && (
        <>
          {/* 高考高频互斥母题矩阵（按高考四大本质反应结构化分组） */}
          <LeftPanelSection title="高考高频互斥母题">
            <div className="space-y-2.5">
              {[
                {
                  categoryName: '彻底双水解专题 (沉淀+气体)',
                  items: [
                    {
                      title: '泡沫灭火器彻底双水解',
                      pair: ['Al3+', 'HCO3-'],
                      tag: 'Al³⁺+HCO₃⁻',
                      tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
                    },
                    {
                      title: '铝离子与硫离子完全双水解',
                      pair: ['Al3+', 'S2-'],
                      tag: 'Al³⁺+S²⁻',
                      tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
                    },
                    {
                      title: '铁离子与碳酸根剧烈双水解',
                      pair: ['Fe3+', 'CO32-'],
                      tag: 'Fe³⁺+CO₃²⁻',
                      tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
                    },
                  ],
                },
                {
                  categoryName: '氧化还原与酸化陷阱专题',
                  items: [
                    {
                      title: '酸性硝酸根氧化亚铁 (隐蔽陷阱)',
                      pair: ['Fe2+', 'NO3-'],
                      tag: 'Fe²⁺+NO₃⁻(H⁺)',
                      tagColor: 'bg-orange-100 text-orange-800 border-orange-200',
                    },
                    {
                      title: '三价铁氧化还原碘离子',
                      pair: ['Fe3+', 'I-'],
                      tag: 'Fe³⁺+I⁻',
                      tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
                    },
                    {
                      title: '高锰酸根强氧化亚铁褪色',
                      pair: ['Fe2+', 'MnO4-'],
                      tag: 'Fe²⁺+MnO₄⁻',
                      tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
                    },
                  ],
                },
                {
                  categoryName: '沉淀转化与工业前驱体专题',
                  items: [
                    {
                      title: '新高考电池前驱体沉淀(工业)',
                      pair: ['Fe2+', 'HCO3-'],
                      tag: 'Fe²⁺+HCO₃⁻',
                      tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
                    },
                    {
                      title: '硫酸钡特征沉淀检测试验',
                      pair: ['Ba2+', 'SO42-'],
                      tag: 'Ba²⁺+SO₄²⁻',
                      tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
                    },
                    {
                      title: '银离子遇卤素沉淀转化',
                      pair: ['Ag+', 'Cl-'],
                      tag: 'Ag⁺+Cl⁻',
                      tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
                    },
                    {
                      title: '钙离子与硫酸根微溶陷阱',
                      pair: ['Ca2+', 'SO42-'],
                      tag: 'Ca²⁺+SO₄²⁻',
                      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
                    },
                  ],
                },
                {
                  categoryName: '气体逸出与弱电解质专题',
                  items: [
                    {
                      title: '硫代硫酸根酸性歧化产气',
                      pair: ['H+', 'S2O32-'],
                      tag: 'H⁺+S₂O₃²⁻',
                      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
                    },
                    {
                      title: '铵盐与强碱共热逸出氨气',
                      pair: ['NH4+', 'OH-'],
                      tag: 'NH₄⁺+OH⁻',
                      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
                    },
                  ],
                },
              ].map((group) => (
                <div key={group.categoryName} className="space-y-1">
                  <div className="text-[10.5px] font-extrabold text-slate-500 px-0.5">
                    {group.categoryName}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isSelected =
                        selectedMatrixPair?.cationId === item.pair[0] &&
                        selectedMatrixPair?.anionId === item.pair[1]

                      return (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => onLoadPresetPair?.(item.pair[0], item.pair[1])}
                          className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-300 shadow-xs'
                              : 'bg-white border-slate-200/90 hover:bg-blue-50/50 hover:border-blue-300'
                          }`}
                        >
                          <div className="min-w-0 pr-1">
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-[11px] font-bold truncate ${
                                  isSelected ? 'text-blue-950' : 'text-slate-900'
                                }`}
                              >
                                {item.title}
                              </span>
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 animate-pulse" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {item.pair[0]} × {item.pair[1]}
                            </div>
                          </div>
                          <span
                            className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded border shrink-0 font-mono ${item.tagColor}`}
                          >
                            {item.tag}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </LeftPanelSection>

          {/* 3. 全景大表研读指南 (同步方案 A 零滚动自适应) */}
          <LeftPanelSection title="全景检索指南">
            <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-200/70 space-y-1 text-[11px] text-blue-950 leading-relaxed">
              <div className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                全景大表研读指南：
              </div>
              <p>• 14 阳 × 18 阴全集自适应 100% 满屏呈现，绝对零滚动条。</p>
              <p>• 点击中屏顶部全景高亮快筛，可一触点亮整张试卷的对应机理分布。</p>
              <p>• 点击上方任意母题，全景大表自动十字轴准星锁定并展开机理。</p>
            </div>
          </LeftPanelSection>
        </>
      )}
    </LeftPanel>
  )
}
