import { useAnimationViewport, useSceneScale } from '@/hooks'
import { CANVAS_PRESETS } from '@/theme'
import { AnimationSvgCanvas } from '@/components/Layout'
import { BaseChart, ChartLine } from '@/components/Chart'
import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { useExtractionDistillationChemistry } from './hooks/useExtractionDistillationChemistry'
import { ExtractionDistillationScene } from './components/ExtractionDistillationScene'

export default function ExtractionDistillationAnimation() {
  // 1. Store 精确订阅
  const { params, time } = useAnimationStore(
    useShallow((s) => ({ params: s.params, time: s.time }))
  )

  // 2. Viewport 响应式视口配置 (splitH 左右各 50%，每个 420x650)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitH,
  })

  // 3. 参数解构与默认值
  const {
    experimentMode = 0,
    solvent = 0,
    misoperation = 0,
    power = 500,
    vSolvent = 20,
  } = params

  // 4. 纯化学与场景计算 Hook
  const chemistry = useExtractionDistillationChemistry({
    experimentMode,
    solvent,
    misoperation,
    power,
    vSolvent,
    time,
  })

  // 5. SceneScale 缩放比例尺 (splitH 左区 width=420, height=650)
  const sceneScale = useSceneScale({
    vp,
    preset: CANVAS_PRESETS.splitH,
    anchor: 'viewport',
    worldWidth: 420,
    worldHeight: 650,
  })

  // 6. 提取图表数据 (Reveal filter 保持全量轴稳定)
  const history = chemistry.chartHistory.filter((p) => p.time <= time)
  const isExtraction = experimentMode === 0

  const line1Points = history.map((p) => ({ x: p.time, y: p.val1 }))
  const line2Points = history.map((p) => ({ x: p.time, y: p.val2 }))

  return (
    <div className="w-full h-full flex flex-row overflow-hidden">
      {/* 左屏：SVG 装置视口区 (50% 宽度 = 420px，CANVAS_PRESETS.splitH) */}
      <div className="flex-1 h-full min-w-0 relative border-r border-slate-200/60">
        <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
          <ExtractionDistillationScene chemistry={chemistry} canvasSize={canvasSize} sceneScale={sceneScale} />
        </AnimationSvgCanvas>
      </div>

      {/* 右屏：DOM 层 BaseChart 图表与高考诊断区 (50% 宽度 = 420px) */}
      <div className="flex-1 h-full min-w-0 flex flex-col overflow-hidden p-3 gap-3">
        {/* 1. 动态图表卡片 */}
        <div className="flex-1 min-h-0 w-full flex flex-col bg-white/50 rounded-lg p-2 border border-slate-200/80">
          <div className="text-xs font-bold text-slate-700 mb-1 shrink-0 flex justify-between items-center px-1">
            <span>{isExtraction ? '萃取分配平衡 (c - t 浓度)' : '蒸馏温度与馏出量 (T-t 平台)'}</span>
            <span className="text-[11px] text-slate-500 font-normal">
              {isExtraction ? '紫: c_org / 蓝: c_aq' : '红: T (°C) / 绿: V (mL)'}
            </span>
          </div>
          <div className="flex-1 min-h-0 w-full relative">
            <BaseChart
              xDomain={[0, 12]}
              yDomain={isExtraction ? [0, 0.25] : [0, 100]}
              xLabel="时间 t (s)"
              yLabel={isExtraction ? '浓度 (mol/L)' : '温度 (°C) / 体积 (mL)'}
            >
              <ChartLine points={line1Points} color={isExtraction ? '#3B82F6' : '#EF4444'} strokeWidth={2.5} />
              <ChartLine points={line2Points} color={isExtraction ? '#A855F7' : '#10B981'} strokeWidth={2.5} />
            </BaseChart>
          </div>
        </div>

        {/* 2. 高考核心避坑提示卡片 */}
        <div className="h-[210px] shrink-0 w-full bg-slate-50/80 rounded-lg p-3 border border-slate-200/80 flex flex-col justify-between">
          <div className="text-xs font-bold text-indigo-900 border-b border-indigo-100 pb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            高考考点要点诊断卡
          </div>
          {isExtraction ? (
            <div className="text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
              <p><strong className="text-slate-800">1. 倒转检漏放气：</strong>双手握持倒转分液漏斗（下口朝斜上方），旋开活塞放气。</p>
              <p><strong className="text-slate-800">2. 拔塞开小孔：</strong>放液前须拿开磨砂玻璃塞（或凹槽对准小孔），连通大气。</p>
              <p><strong className="text-indigo-700 font-bold">3. 下放上倒铁律：</strong>下层液体由下口放出至烧杯A；关活塞，上层液体由上口倒入烧杯B。</p>
            </div>
          ) : (
            <div className="text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
              <p><strong className="text-slate-800">1. 温度计位置：</strong>水银球严格对准蒸馏烧瓶支管口中央（测蒸气沸点）。</p>
              <p><strong className="text-slate-800">2. 冷凝水方向：</strong>直形冷凝管必须"下进上出"（逆流高效冷却并充满水）。</p>
              <p><strong className="text-amber-700 font-bold">3. 补沸石规则：</strong>碎瓷片防暴沸！若加热后发现未加，须冷却后再补加！</p>
            </div>
          )}
          <div className="text-[10px] text-slate-400 text-right pt-1 border-t border-slate-200/40">
            高中化学高考通用实验规范
          </div>
        </div>
      </div>
    </div>
  )
}
