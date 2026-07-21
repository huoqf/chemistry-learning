import { useAnimationViewport, useSceneScale } from '@/hooks'
import { CANVAS_PRESETS } from '@/theme'
import { AnimationSvgCanvas } from '@/components/Layout'
import { EquilibriumChart } from '@/components/Chart'
import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { useLeChatelierChemistry } from './hooks/useLeChatelierChemistry'
import { LeChatelierScene } from './components/LeChatelierScene'

export default function LeChatelierAnimation() {
  // 1. 订阅 Store (精确订阅 params, time)
  const { params, time } = useAnimationStore(
    useShallow((s) => ({ params: s.params, time: s.time }))
  )

  // 2. 初始化 Viewport与自适应视口 (布局Preset选用 splitHw: 280x650 装置区 + 560px 图表区)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitHw,
  })

  // 3. 提取参数 defaults
  const { temp = 298, pressure = 1.0, addedNO2 = 0 } = params

  // 4. 执行化学计算 hook
  const chemistry = useLeChatelierChemistry({
    temp,
    pressure,
    addedNO2,
    time,
  })

  // 5. SceneScale 建立物理-画布比例尺 (零手写魔法数字)
  const sceneScale = useSceneScale({
    vp,
    preset: CANVAS_PRESETS.splitHw,
    anchor: 'center',
    scaleDesign: 28,
  })

  // 6. 数据转换供 EquilibriumChart 消费 (根据 time 仅揭示 0 ~ time 演化出来的已生长轨迹点)
  const visibleHistory = chemistry.history.filter((p) => p.time <= Math.max(0.1, time))
  const forwardPoints = visibleHistory.map((p) => ({ x: p.time, y: p.vForward }))
  const reversePoints = visibleHistory.map((p) => ({ x: p.time, y: p.vReverse }))

  return (
    <div className="w-full h-full flex flex-row overflow-hidden bg-transparent rounded-lg border border-slate-200/80">
      {/* 左侧：装置动画 Canvas (280px 宽度 preset 约束) */}
      <div className="w-[280px] h-full relative shrink-0 border-r border-slate-200/80 bg-transparent">
        <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
          <LeChatelierScene
            chemistry={chemistry}
            temp={temp}
            time={time}
            canvasSize={canvasSize}
            sceneScale={sceneScale}
          />
        </AnimationSvgCanvas>
      </div>

      {/* 右侧：高考化学专有 EquilibriumChart (560px 宽度) */}
      <div className="flex-1 h-full p-3 flex flex-col justify-center bg-white min-w-0">
        <EquilibriumChart
          forwardPoints={forwardPoints}
          reversePoints={reversePoints}
          xDomain={[0, 10]}
          equilibriumTime={time >= 4.5 ? 4.5 : undefined}
          currentTime={time}
          title="2NO₂ ⇌ N₂O₄ 反应速率与平衡移动 (v - t)"
          xLabel="时间 t / s"
          yLabel="反应速率 v / (mol·L⁻¹·s⁻¹)"
        />
      </div>
    </div>
  )
}
