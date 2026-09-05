import React from 'react'
import {
  LeftPanel,
  LeftPanelSection,
  Slider,
  SegmentedControl,
  Button,
} from '@/components/UI'
import type { ChartTabMode, SystemReactionId, CatalystType, NexusParams } from '../types'

interface ReactionPrincipleLeftPanelProps {
  params: NexusParams
  onUpdateParams: (updated: Partial<NexusParams>) => void
  onReset: () => void
}

export const ReactionPrincipleLeftPanel: React.FC<ReactionPrincipleLeftPanelProps> = ({
  params,
  onUpdateParams,
  onReset,
}) => {
  const { chartTab } = params

  return (
    <LeftPanel>
      {/* 1. 明确研究对象：反应体系置首，符合由实物反应到图谱分析的认知规律 */}
      <LeftPanelSection title="反应体系">
        <SegmentedControl
          options={[
            { label: 'NO₂体系', value: 'no2-n2o4' },
            { label: '合成氨', value: 'nh3-synthesis' },
            { label: '甲醇合成', value: 'methanol-synthesis' },
          ]}
          value={params.reactionId}
          onChange={(val) => onUpdateParams({ reactionId: val as SystemReactionId })}
        />
      </LeftPanelSection>

      {/* 2. 探究视角：2x2 网格舒展布局，精炼文案杜绝折行 */}
      <LeftPanelSection title="探究图谱">
        <SegmentedControl
          cols={2}
          options={[
            { label: <span className="whitespace-nowrap">活化能历程</span>, value: 'energy-profile' },
            { label: <span className="whitespace-nowrap">平衡移动双图</span>, value: 'le-chatelier' },
            { label: <span className="whitespace-nowrap">lnK - 1/T 图</span>, value: 'lnk-invt' },
            { label: <span className="whitespace-nowrap">平衡转化率 α</span>, value: 'alpha-tp' },
          ]}
          value={params.chartTab}
          onChange={(val) => onUpdateParams({ chartTab: val as ChartTabMode })}
        />
      </LeftPanelSection>

      {/* 3. 催化历程路径 (仅在动力学相关模式下有效) */}
      {(chartTab === 'energy-profile' || chartTab === 'le-chatelier') && (
        <LeftPanelSection title="催化剂路径">
          <SegmentedControl
            options={[
              { label: '无催化剂', value: 'none' },
              { label: '催化剂 A', value: 'catalyst-a' },
              { label: '催化剂 B', value: 'catalyst-b' },
            ]}
            value={params.catalyst}
            onChange={(val) => onUpdateParams({ catalyst: val as CatalystType })}
          />
          <div className="text-[11px] text-slate-500 mt-1.5 flex justify-between px-1">
            <span>基准态</span>
            <span>A: 单步机理</span>
            <span>B: 两步·决速步</span>
          </div>
        </LeftPanelSection>
      )}

      {/* 3. 变量控制参数 (情境化自适应显示有效物理量) */}
      <LeftPanelSection title="控制变量参数">
        <div className="flex flex-col gap-3">
          {/* 温度 T：所有图谱均敏感生效 */}
          <Slider
            label="体系温度 T / K"
            value={params.temperature}
            min={250}
            max={600}
            step={5}
            unit="K"
            onChange={(val: number) => onUpdateParams({ temperature: val })}
          />

          {/* 压强 P：仅在勒夏特列平衡移动及 α-T-P 转化率图谱中生效 */}
          {(chartTab === 'le-chatelier' || chartTab === 'alpha-tp') && (
            <Slider
              label="体系总压 P / atm"
              value={params.pressure}
              min={0.5}
              max={5.0}
              step={0.1}
              unit="atm"
              onChange={(val: number) => onUpdateParams({ pressure: val })}
            />
          )}

          {/* 勒夏特列双图特有扰动变量 */}
          {chartTab === 'le-chatelier' && (
            <div className="pt-1 border-t border-slate-200/60 flex flex-col gap-3">
              <Slider
                label="反应物浓度阶跃突变"
                value={params.addedReactant}
                min={0}
                max={2.0}
                step={0.1}
                unit="mol/L"
                onChange={(val: number) => onUpdateParams({ addedReactant: val })}
              />

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  充入惰性气体 (He)
                </label>
                <SegmentedControl
                  options={[
                    { label: '不充入', value: 'none' },
                    { label: '恒温恒容', value: 'constant-v' },
                    { label: '恒温恒压', value: 'constant-p' },
                  ]}
                  value={params.inertGasMode}
                  onChange={(val) =>
                    onUpdateParams({
                      inertGasMode: val as 'none' | 'constant-v' | 'constant-p',
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* 控制变量化学原理解释标注 */}
          {chartTab === 'energy-profile' && (
            <div className="text-[11px] text-slate-500 leading-relaxed rounded border border-slate-200/60 p-2 bg-slate-50/50">
              <span className="font-semibold text-slate-700">控制变量提示：</span>
              分子动能分布与势能垒仅受温度及催化剂调控，与外界压强无关。
            </div>
          )}

          {chartTab === 'lnk-invt' && (
            <div className="text-[11px] text-slate-500 leading-relaxed rounded border border-slate-200/60 p-2 bg-slate-50/50">
              <span className="font-semibold text-slate-700">控制变量提示：</span>
              平衡常数 K 仅是温度 T 的函数，压强、浓度与催化剂均不能改变 K 值。
            </div>
          )}
        </div>
      </LeftPanelSection>

      {/* 4. 结构化教学提示卡片 (遵循铁律 3C) */}
      <LeftPanelSection title="教学提示">
        <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed border border-slate-200 rounded-lg p-3 bg-slate-50/80">
          {chartTab === 'energy-profile' && (
            <>
              <div>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 mr-1.5">
                  实验条件
                </span>
                密闭气态反应体系，基元反应分子碰撞模型。
              </div>
              <div>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 mr-1.5">
                  核心设问
                </span>
                升温与加催化剂，谁改变活化能门槛？谁改变能量分布？多步催化决速步由何决定？
              </div>
              <div>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 mr-1.5">
                  观察指引
                </span>
                对比玻尔兹曼图中的灰色基准态虚线；切换多步催化剂 B 观察 TS1 与 TS2 相对能垒 ΔEa 标注。
              </div>
            </>
          )}

          {chartTab === 'le-chatelier' && (
            <>
              <div>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 mr-1.5">
                  实验条件
                </span>
                恒温恒容 / 恒温恒压体系，在 t = 4 s 时施加单一条件突变扰动。
              </div>
              <div>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 mr-1.5">
                  核心设问
                </span>
                升温后吸热方向增大幅度为何更大？恒压充惰性气体平衡为何等效减压？
              </div>
              <div>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 mr-1.5">
                  观察指引
                </span>
                观察 v-t 图中 4s 处阶跃特征，区分“单速率跳跃（浓度）”与“双速率同时跳跃（温度/压强/催化剂）”。
              </div>
            </>
          )}

          {chartTab === 'lnk-invt' && (
            <>
              <div>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 mr-1.5">
                  实验条件
                </span>
                等压变温热力学平衡体系，测定不同温度下的化学平衡常数。
              </div>
              <div>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 mr-1.5">
                  核心设问
                </span>
                直线斜率大于 0 代表吸热还是放热？横坐标向右移动代表升温还是降温？
              </div>
              <div>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 mr-1.5">
                  观察指引
                </span>
                牢记横坐标为 1/T（向右为降温）；由斜率 k = -ΔH/R 直截判断反应热正负。
              </div>
            </>
          )}

          {chartTab === 'alpha-tp' && (
            <>
              <div>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 mr-1.5">
                  实验条件
                </span>
                气体体积缩小的可逆合成体系，考察温度与压强对平衡限度的双重影响。
              </div>
              <div>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 mr-1.5">
                  核心设问
                </span>
                如何通过“定一议二”在双曲线上判定压强大小？为什么工业选适宜温度而非低温？
              </div>
              <div>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 mr-1.5">
                  观察指引
                </span>
                观察垂直等温辅助线在两条压强曲线上的交点高度差异，体会高压提高平衡转化率。
              </div>
            </>
          )}
        </div>
      </LeftPanelSection>

      {/* 5. 操作与重置 */}
      <div className="pt-2 pb-1">
        <Button variant="secondary" className="w-full text-xs" onClick={onReset}>
          重置参数与时间轴
        </Button>
      </div>
    </LeftPanel>
  )
}


