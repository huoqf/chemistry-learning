import React from 'react'
import { LeftPanel, LeftPanelSection, Button, SegmentedControl } from '@/components/UI'
import { ION_DATA } from '../constants'
import type { InquiryMode } from '../types'
import {
  RotateCcw,
  Droplets,
  Layers,
  Flame,
  Zap,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { MECHANISM_GROUPS } from '../data/mechanismGridData'

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
      {/* 顶部模式切换：4 档 2x2 网格，避免文字折行 */}
      <LeftPanelSection title="探究模式">
        <SegmentedControl
          value={inquiryMode}
          onChange={(val) => onSelectMode(val as InquiryMode)}
          cols={2}
          options={[
            { label: '特征检验', value: 'single-test' },
            { label: '烧杯模拟', value: 'coexistence-check' },
            { label: '四大机理', value: 'mechanism-grid' },
            { label: '全景大表', value: 'coexistence-matrix' },
          ]}
        />
      </LeftPanelSection>

      {/* 1. 特征检验模式 */}
      {inquiryMode === 'single-test' && (
        <>
          {/* 待测阳离子样品 */}
          <LeftPanelSection title="阳离子样品">
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
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs ring-2 ring-blue-300'
                        : 'bg-white hover:bg-blue-50 text-slate-800 border-slate-200'
                    }`}
                    title={`${ion.name} (${ion.colorInSolution})`}
                  >
                    <span>{ion.id}</span>
                    <span
                      className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: ion.colorRgb }}
                    />
                  </button>
                )
              })}
            </div>
          </LeftPanelSection>

          {/* 待测阴离子样品 */}
          <LeftPanelSection title="阴离子样品">
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
                        ? 'bg-amber-600 text-white border-amber-700 shadow-xs ring-2 ring-amber-300'
                        : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-200'
                    }`}
                    title={`${ion.name} (${ion.colorInSolution})`}
                  >
                    <span className="truncate px-0.5">{ion.id}</span>
                    <span
                      className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: ion.colorRgb }}
                    />
                  </button>
                )
              })}
            </div>
          </LeftPanelSection>

          {/* 鉴别试剂 */}
          {currentIon && currentIon.reagentOptions.length > 0 && (
            <LeftPanelSection title="鉴别试剂">
              <div className="space-y-1">
                {currentIon.reagentOptions.map((reagent) => {
                  const isSelected = selectedReagentId === reagent.id
                  return (
                    <button
                      key={reagent.id}
                      type="button"
                      onClick={() => onSelectReagent?.(reagent.id)}
                      className={`w-full p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-300 shadow-2xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{reagent.name}</span>
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded border ${
                            reagent.tag === 'optimal'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : reagent.tag === 'trap'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {reagent.tag === 'optimal'
                            ? '标配试剂'
                            : reagent.tag === 'trap'
                            ? '高考陷阱'
                            : '干扰试剂'}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </LeftPanelSection>
          )}

          {/* 滴加操作 */}
          <LeftPanelSection title="滴加操作">
            <div className="space-y-2">
              {/* 阶段进度条 */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg text-center text-[10px] font-bold text-slate-600">
                <div
                  className={`py-0.5 rounded ${
                    dropCount === 0 ? 'bg-white text-blue-700 shadow-2xs' : 'opacity-60'
                  }`}
                >
                  待测原样
                </div>
                <div
                  className={`py-0.5 rounded ${
                    dropCount === 1 ? 'bg-white text-blue-700 shadow-2xs' : 'opacity-60'
                  }`}
                >
                  少量滴加
                </div>
                <div
                  className={`py-0.5 rounded ${
                    dropCount === 2 ? 'bg-white text-emerald-700 shadow-2xs' : 'opacity-60'
                  }`}
                >
                  滴加过量
                </div>
              </div>

              <Button
                variant={dropCount === 2 ? 'secondary' : 'primary'}
                size="sm"
                onClick={onDropReagent}
                className="w-full shadow-2xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                {dropCount === 0
                  ? '滴加少量试剂'
                  : dropCount === 1
                  ? '继续滴加至过量'
                  : '反应已达终点'}
              </Button>

              {dropCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetReaction}
                  className="w-full text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  清空重置
                </Button>
              )}
            </div>
          </LeftPanelSection>

          {/* 教学提示 */}
          <LeftPanelSection title="实验规范">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <p>• <strong>实验条件</strong>：取 1~2 mL 待测液于洁净试管中。</p>
              <p>• <strong>观察指引</strong>：注意先生成沉淀后是否随过量试剂溶解。</p>
            </div>
          </LeftPanelSection>
        </>
      )}

      {/* 2. 烧杯模拟模式 */}
      {inquiryMode === 'coexistence-check' && (
        <>
          <LeftPanelSection title="待测阳离子">
            <div className="grid grid-cols-4 gap-1">
              {cations.map((ion) => {
                const isChecked = coexistenceSelectedIons.includes(ion.id)
                return (
                  <button
                    key={ion.id}
                    type="button"
                    onClick={() => onToggleCoexistenceIon(ion.id)}
                    className={`h-7 rounded-lg text-xs font-semibold flex items-center justify-center border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-blue-600 text-white border-blue-700 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{ion.id}</span>
                  </button>
                )
              })}
            </div>
          </LeftPanelSection>

          <LeftPanelSection title="待测阴离子">
            <div className="grid grid-cols-4 gap-1">
              {anions.map((ion) => {
                const isChecked = coexistenceSelectedIons.includes(ion.id)
                return (
                  <button
                    key={ion.id}
                    type="button"
                    onClick={() => onToggleCoexistenceIon(ion.id)}
                    className={`h-7 rounded-lg text-xs font-semibold flex items-center justify-center border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-amber-600 text-white border-amber-700 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate px-0.5">{ion.id}</span>
                  </button>
                )
              })}
            </div>
          </LeftPanelSection>

          <LeftPanelSection title="烧杯控制">
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-500 font-medium px-0.5">
                已混入：阳离子 {coexistenceSelectedIons.filter((id) => cations.some((c) => c.id === id)).length} 种 · 阴离子 {coexistenceSelectedIons.filter((id) => anions.some((a) => a.id === id)).length} 种
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onResetCoexistence}
                className="w-full cursor-pointer text-slate-600 hover:bg-slate-50"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                清空烧杯
              </Button>
            </div>
          </LeftPanelSection>

          <LeftPanelSection title="共存排查指引">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <p>• <strong>一票否决</strong>：生成难溶沉淀、气体或弱电解质即互斥。</p>
              <p>• <strong>隐蔽反应</strong>：排查强酸弱碱双水解及氧化还原。</p>
            </div>
          </LeftPanelSection>
        </>
      )}

      {/* 3. 四大机理九宫格模式 */}
      {inquiryMode === 'mechanism-grid' && (
        <>
          <LeftPanelSection title="四大互斥维度">
            <div className="space-y-1.5">
              {MECHANISM_GROUPS.map((group) => {
                const groupContainsSelected = group.items.some(
                  (item) =>
                    (item.cationId === selectedMatrixPair?.cationId &&
                      item.anionId === selectedMatrixPair?.anionId) ||
                    (item.cationId === selectedMatrixPair?.anionId &&
                      item.anionId === selectedMatrixPair?.cationId)
                )

                return (
                  <div
                    key={group.id}
                    className={`p-2 rounded-xl border transition-all ${
                      groupContainsSelected
                        ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        {group.id === 'double-hydrolysis' && (
                          <Flame className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        {group.id === 'redox-hidden' && (
                          <Zap className="w-3.5 h-3.5 text-purple-600" />
                        )}
                        {group.id === 'precipitate-trap' && (
                          <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        {group.id === 'gas-weak-acid' && (
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span>{group.title.split(' ')[1]}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {group.items.length} 芯片
                      </span>
                    </div>

                    {/* 代表性母题快捷预选 */}
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {group.items.slice(0, 2).map((item) => {
                        const isSelected =
                          selectedMatrixPair?.cationId === item.cationId &&
                          selectedMatrixPair?.anionId === item.anionId

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => onLoadPresetPair?.(item.cationId, item.anionId)}
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded border text-left truncate transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                            title={`${item.title} (${item.productSummary})`}
                          >
                            <span className="truncate">{item.title}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </LeftPanelSection>

          {/* 高考审题定势 */}
          <LeftPanelSection title="高考审题指引">
            <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-[11px] text-indigo-950 space-y-1.5 leading-relaxed">
              <div className="font-bold flex items-center gap-1 text-xs">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                命题机理归类法：
              </div>
              <p>• <strong>去表格化</strong>：抛弃 14×18 交叉繁表，单屏直击高频命题陷阱。</p>
              <p>• <strong>一票否决</strong>：按双水解、氧化还原、微溶沉淀、逸气分步排查。</p>
              <p>• <strong>芯片联动</strong>：点击任意芯片，右侧展开完整方程式与避坑指南。</p>
            </div>
          </LeftPanelSection>
        </>
      )}

      {/* 4. 全景大表模式 */}
      {inquiryMode === 'coexistence-matrix' && (
        <>
          <LeftPanelSection title="高频互斥母题">
            <div className="space-y-1.5">
              {[
                {
                  categoryName: '彻底双水解',
                  items: [
                    {
                      title: '泡沫灭火器',
                      pair: ['Al3+', 'HCO3-'],
                      tag: 'Al³⁺+HCO₃⁻',
                      tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
                    },
                    {
                      title: '铝离子与硫离子',
                      pair: ['Al3+', 'S2-'],
                      tag: 'Al³⁺+S²⁻',
                      tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
                    },
                    {
                      title: '铁离子与碳酸根',
                      pair: ['Fe3+', 'CO32-'],
                      tag: 'Fe³⁺+CO₃²⁻',
                      tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
                    },
                  ],
                },
                {
                  categoryName: '氧化还原与酸化',
                  items: [
                    {
                      title: '酸性硝酸根氧化亚铁',
                      pair: ['Fe2+', 'NO3-'],
                      tag: 'Fe²⁺+NO₃⁻(H⁺)',
                      tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
                    },
                    {
                      title: '铁离子氧化碘离子',
                      pair: ['Fe3+', 'I-'],
                      tag: 'Fe³⁺+I⁻',
                      tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
                    },
                  ],
                },
                {
                  categoryName: '沉淀与微溶',
                  items: [
                    {
                      title: '硫酸钡沉淀',
                      pair: ['Ba2+', 'SO42-'],
                      tag: 'Ba²⁺+SO₄²⁻',
                      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
                    },
                    {
                      title: '钙离子微溶陷阱',
                      pair: ['Ca2+', 'SO42-'],
                      tag: 'Ca²⁺+SO₄²⁻',
                      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
                    },
                  ],
                },
                {
                  categoryName: '气体与歧化',
                  items: [
                    {
                      title: '硫代硫酸根酸性歧化',
                      pair: ['H+', 'S2O32-'],
                      tag: 'H⁺+S₂O₃²⁻',
                      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
                    },
                    {
                      title: '铵盐与碱共热',
                      pair: ['NH4+', 'OH-'],
                      tag: 'NH₄⁺+OH⁻',
                      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
                    },
                  ],
                },
              ].map((group) => (
                <div key={group.categoryName} className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 px-0.5">
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
                          className={`w-full p-1.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-300 shadow-2xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className={`text-[11px] font-bold truncate ${
                              isSelected ? 'text-blue-950' : 'text-slate-800'
                            }`}
                          >
                            {item.title}
                          </span>
                          <span
                            className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded border shrink-0 font-mono ${item.tagColor}`}
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

          <LeftPanelSection title="全景检索指南">
            <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-200/70 space-y-1 text-[11px] text-blue-950 leading-relaxed">
              <p>• 14 阳 × 18 阴全集自适应单屏呈现，零滚动条。</p>
              <p>• 点击上方母题，全景大表自动十字准星锁定。</p>
            </div>
          </LeftPanelSection>
        </>
      )}
    </LeftPanel>
  )
}
