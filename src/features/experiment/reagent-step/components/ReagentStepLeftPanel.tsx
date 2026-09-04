import { LeftPanel, LeftPanelSection, OptionButton, SegmentedControl, ToggleSwitch } from '@/components/UI'
import { REAGENT_SCENES } from '../data/reagentData'
import type { ReagentSceneId, ReagentSceneConfig, AlTitrationMode } from '../types'

export interface ReagentStepLeftPanelProps {
  sceneId: ReagentSceneId
  currentScene: ReagentSceneConfig
  isAirIsolated: boolean
  alMode: AlTitrationMode
  handleSceneChange: (id: ReagentSceneId) => void
  handleToggleAirIsolated: () => void
  handleAlModeChange: (mode: AlTitrationMode) => void
}

/**
 * ReagentStepLeftPanel — 专题四左侧控制台
 *
 * 规范：
 * - 遵守铁律 3C：标题纯粹、严禁装饰性图标堆砌、保持学术沉稳
 * - 遵守铁律 4：完全复用系统 UI 组件 (LeftPanel, OptionButton, SegmentedControl, ToggleSwitch)
 * - 状态安全联动：模式切换自动联动重置进度，避免跳跃与物理不一致
 */
export function ReagentStepLeftPanel({
  sceneId,
  currentScene,
  isAirIsolated,
  alMode,
  handleSceneChange,
  handleToggleAirIsolated,
  handleAlModeChange,
}: ReagentStepLeftPanelProps) {
  return (
    <LeftPanel>
      {/* 1. 高考核心母题场景选择 */}
      <LeftPanelSection title="高考核心母题场景" subtitle="点击切换 5 大高频滴加演练专题">
        <div className="flex flex-col gap-2">
          {Object.values(REAGENT_SCENES).map((s) => (
            <OptionButton
              key={s.id}
              selected={sceneId === s.id}
              onClick={() => handleSceneChange(s.id as ReagentSceneId)}
              label={s.title}
              description={s.subtitle}
              variant="preset"
            />
          ))}
        </div>
      </LeftPanelSection>

      {/* 2. 实验条件对比探究 (仅在场景支持时展示，使用标准 SegmentedControl / ToggleSwitch) */}
      {(currentScene.supportsAirIsolation || currentScene.supportsAlMode) && (
        <LeftPanelSection title="实验条件对比探究" subtitle="切换滴加顺序与对比变量">
          <div className="flex flex-col gap-2.5">
            {/* 亚铁隔绝空气防氧化操作切换 */}
            {currentScene.supportsAirIsolation && (
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-800">隔绝空气防氧化操作</span>
                  <span className="text-[10px] text-slate-500">长滴管伸入液面下 / 植物油层封顶</span>
                </div>
                <ToggleSwitch
                  checked={isAirIsolated}
                  onChange={handleToggleAirIsolated}
                />
              </div>
            )}

            {/* 铝盐滴加三模式规范分段选择器 */}
            {currentScene.supportsAlMode && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-800">滴加方式与碱液选择</span>
                <SegmentedControl
                  value={alMode}
                  onChange={(val) => handleAlModeChange(val as AlTitrationMode)}
                  options={[
                    { value: 'forward-strong', label: '正滴强碱' },
                    { value: 'reverse-strong', label: '反滴强碱' },
                    { value: 'forward-weak', label: '换用弱碱' },
                  ]}
                />
              </div>
            )}
          </div>
        </LeftPanelSection>
      )}

      {/* 3. 铁律 3C 结构化实验引导与核心设问 */}
      {currentScene.guidance && (
        <LeftPanelSection title="实验观察与核心设问" subtitle="高考实验探究抓手">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-2.5 text-xs">
            <div>
              <div className="text-[11px] font-bold text-slate-500 mb-0.5">实验前提条件</div>
              <div className="text-slate-800 font-medium">{currentScene.guidance.condition}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-indigo-700 mb-0.5">高考核心设问</div>
              <div className="text-slate-800 font-medium">{currentScene.guidance.coreQuestion}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-800 mb-0.5">现象观察指引</div>
              <div className="text-slate-700">{currentScene.guidance.observation}</div>
            </div>
          </div>
        </LeftPanelSection>
      )}
    </LeftPanel>
  )
}
