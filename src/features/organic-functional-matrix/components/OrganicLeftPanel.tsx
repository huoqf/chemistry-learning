import React, { useMemo } from 'react'
import { LeftPanel, LeftPanelSection, SegmentedControl } from '@/components/UI'
import { FUNCTIONAL_GROUPS, PRESET_MOLECULES } from '../constants'
import { Plus, Minus, RotateCcw, Check } from 'lucide-react'

interface OrganicLeftPanelProps {
  panelMode: 'preset' | 'custom' | 'matrix'
  onPanelModeChange: (mode: 'preset' | 'custom' | 'matrix') => void
  selectedGroupId: string
  groupCounts: Record<string, number>
  onSelectGroup: (id: string) => void
  onChangeCount: (id: string, delta: number) => void
  onApplyPreset: (presetCounts: Record<string, number>, focusGroupId?: string) => void
  onResetCounts: () => void
}

export const OrganicLeftPanel: React.FC<OrganicLeftPanelProps> = ({
  panelMode,
  onPanelModeChange,
  selectedGroupId,
  groupCounts,
  onSelectGroup,
  onChangeCount,
  onApplyPreset,
  onResetCounts,
}) => {
  const totalAddedGroups = Object.values(groupCounts).reduce((acc, v) => acc + v, 0)

  // 识别当前匹配的预设母题
  const activePresetId = useMemo(() => {
    for (const preset of PRESET_MOLECULES) {
      const presetEntries = Object.entries(preset.counts)
      const currentNonZero = Object.entries(groupCounts).filter(([, count]) => count > 0)
      if (presetEntries.length !== currentNonZero.length) continue

      const isMatch = presetEntries.every(
        ([id, count]) => (groupCounts[id] || 0) === count
      )
      if (isMatch) return preset.id
    }
    return null
  }, [groupCounts])

  const activePreset = useMemo(() => {
    return PRESET_MOLECULES.find((p) => p.id === activePresetId)
  }, [activePresetId])

  // 当前分子中实际存在的官能团
  const presentGroups = useMemo(() => {
    return Object.entries(groupCounts)
      .filter(([, count]) => count > 0)
      .map(([id, count]) => {
        const group = FUNCTIONAL_GROUPS.find((g) => g.id === id)
        return { group, count }
      })
      .filter((item): item is { group: (typeof FUNCTIONAL_GROUPS)[0]; count: number } => Boolean(item.group))
  }, [groupCounts])

  // 按分类对官能团归类（自由组装模式用）
  const oxygenGroups = FUNCTIONAL_GROUPS.filter((g) => g.category === 'oxygen-containing')
  const hydrocarbonGroups = FUNCTIONAL_GROUPS.filter((g) => g.category === 'hydrocarbon-derivative')
  const nitrogenGroups = FUNCTIONAL_GROUPS.filter((g) => g.category === 'nitrogen-containing')

  // 渲染单行官能团（采用垂直双行排版，彻底避免文字挤压与截断）
  const renderGroupItem = (group: (typeof FUNCTIONAL_GROUPS)[0]) => {
    const count = groupCounts[group.id] || 0
    const isSelected = selectedGroupId === group.id
    return (
      <div
        key={group.id}
        onClick={() => onSelectGroup(group.id)}
        className={`p-2.5 rounded-lg border text-xs transition-all cursor-pointer select-none space-y-1.5 ${
          isSelected
            ? 'border-indigo-500 bg-indigo-50/80 shadow-xs ring-1 ring-indigo-400/50'
            : count > 0
              ? 'border-indigo-200 bg-indigo-50/30 hover:border-indigo-300'
              : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
      >
        {/* 第一行：名字与结构式 */}
        <div className="flex items-center justify-between gap-1">
          <span className="font-bold text-slate-800 text-[11.5px]">{group.name}</span>
          <span className="font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded text-[10px] shrink-0 font-bold">
            {group.structureSvg}
          </span>
        </div>

        {/* 第二行：数量调节器 */}
        <div
          className="flex items-center justify-between pt-1 border-t border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[10px] text-slate-400">
            {isSelected ? '右屏已聚焦' : '点击查看考点'}
          </span>
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-0.5 rounded-md">
            <button
              onClick={() => onChangeCount(group.id, -1)}
              disabled={count <= 0}
              title="减少"
              className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-2xs"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span
              className={`font-bold text-xs w-5 text-center font-mono ${
                count > 0 ? 'text-indigo-700 font-extrabold' : 'text-slate-400'
              }`}
            >
              {count}
            </span>
            <button
              onClick={() => onChangeCount(group.id, 1)}
              title="增加"
              className="w-5 h-5 flex items-center justify-center rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-2xs"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <LeftPanel>
      {/* 顶部模式切换 */}
      <LeftPanelSection title="探究模式选择">
        <SegmentedControl
          value={panelMode}
          onChange={(val) => onPanelModeChange(val as 'preset' | 'custom' | 'matrix')}
          options={[
            { label: '经典母题', value: 'preset' },
            { label: '自由组装', value: 'custom' },
            { label: '全景大表', value: 'matrix' },
          ]}
        />
      </LeftPanelSection>

      {/* ===================== 模式 1：经典母题研析 ===================== */}
      {panelMode === 'preset' && (
        <>
          {/* 母题分子选择列表 */}
          <LeftPanelSection title="选择高考经典母题">
            <div className="space-y-1.5">
              {PRESET_MOLECULES.map((preset) => {
                const isActive = activePresetId === preset.id
                return (
                  <button
                    key={preset.id}
                    onClick={() => onApplyPreset(preset.counts, preset.focusGroupId)}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-50/90 shadow-xs ring-1 ring-indigo-400'
                        : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900">
                      {preset.title}
                    </div>
                    {isActive ? (
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    ) : (
                      <span className="text-[10px] text-indigo-600 font-medium shrink-0">载入</span>
                    )}
                  </button>
                )
              })}
            </div>
          </LeftPanelSection>

          {/* 当前母题包含的官能团组成与微调 */}
          <LeftPanelSection title="当前母题官能团构成与微调">
            <div className="space-y-2">
              <div className="text-[11px] text-slate-500">
                {activePreset
                  ? `【${activePreset.title}】包含基团：`
                  : '当前分子包含的官能团：'}
              </div>

              {presentGroups.length > 0 ? (
                <div className="space-y-1.5">
                  {presentGroups.map(({ group }) => renderGroupItem(group))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  暂无基团，请点击上方母题载入
                </div>
              )}
            </div>
          </LeftPanelSection>

          {/* 底部教学提示：说清楚反应条件、核心设问与观察指引 */}
          {activePreset && (
            <LeftPanelSection title="教学思考与探究提示">
              <div className="space-y-2.5 text-xs">
                {/* 反应条件 */}
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-800 text-[11px]">
                    实验与反应条件：
                  </div>
                  <div className="text-[10.5px] text-slate-600 leading-relaxed">
                    常温下中和酸性基团；在 <strong className="text-indigo-700">NaOH 溶液 + 加热</strong> 条件下发生完全水解；与 NaHCO₃ 反应常温即可进行。
                  </div>
                </div>

                {/* 核心问题 */}
                <div className="p-2 bg-indigo-50/60 rounded-lg border border-indigo-200/70 space-y-1">
                  <div className="font-bold text-indigo-950 text-[11px]">
                    核心设问与思考：
                  </div>
                  <div className="text-[10.5px] text-indigo-900 leading-relaxed">
                    1. 1 mol 该分子水解时断开哪些化学键？生成物是否具有酸性？<br />
                    2. 为什么最终消耗的 NaOH 摩尔数与 NaHCO₃ 摩尔数不同？
                  </div>
                </div>

                {/* 观察指引 */}
                <div className="text-[10.5px] text-slate-500 leading-relaxed">
                  观察中屏各试剂消耗柱的加法拆解，并在右屏核对高考标准方程式与避坑踩分点。
                </div>
              </div>
            </LeftPanelSection>
          )}
        </>
      )}

      {/* ===================== 模式 2：自由组装探究 ===================== */}
      {panelMode === 'custom' && (
        <LeftPanelSection title="全量官能团调控工作台">
          <div className="space-y-3">
            {/* 清空栏 */}
            <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-600 text-[11px]">
                已选基团总数：
                <strong className="text-indigo-700 font-mono font-extrabold ml-1">
                  {totalAddedGroups}
                </strong>
              </span>
              <button
                onClick={onResetCounts}
                disabled={totalAddedGroups === 0}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                清空全部
              </button>
            </div>

            {/* 含氧官能团 */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-500">含氧官能团 (酸/醇/酚/醛/酯)</div>
              <div className="space-y-1.5">{oxygenGroups.map(renderGroupItem)}</div>
            </div>

            {/* 烃与卤代烃 */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-500">烃与卤代烃 (双键/三键/卤素)</div>
              <div className="space-y-1.5">{hydrocarbonGroups.map(renderGroupItem)}</div>
            </div>

            {/* 含氮衍生物 */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-500">含氮衍生物 (肽键/酰胺键)</div>
              <div className="space-y-1.5">{nitrogenGroups.map(renderGroupItem)}</div>
            </div>
          </div>
        </LeftPanelSection>
      )}

      {/* ===================== 模式 3：全景大表导航 ===================== */}
      {panelMode === 'matrix' && (
        <LeftPanelSection title="全景大表快速定位">
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="p-2.5 bg-indigo-50/70 rounded-lg border border-indigo-200/80 space-y-1">
              <span className="font-bold text-indigo-950 text-[11.5px]">中屏已展开全景大表</span>
              <p className="text-[10.5px] leading-relaxed text-indigo-900">
                中屏已全屏呈现 10 大官能团与核心试剂定量反应矩阵及三大秒杀口诀。点击下方任一基团，可在中屏大表与右屏同步高亮锁定。
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-slate-700 text-[11px]">快速高亮对应官能团：</div>
              <div className="grid grid-cols-2 gap-1.5">
                {FUNCTIONAL_GROUPS.map((g) => {
                  const isSelected = selectedGroupId === g.id
                  return (
                    <button
                      key={g.id}
                      onClick={() => onSelectGroup(g.id)}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer truncate flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900 ring-1 ring-indigo-400'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="truncate text-[11px]">{g.name.split(' ')[0]}</span>
                      <span className="text-[9.5px] font-mono text-indigo-600 bg-slate-100 px-1 py-0.2 rounded shrink-0">
                        {g.structureSvg}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </LeftPanelSection>
      )}
    </LeftPanel>
  )
}





