import { useAnimationViewport, useSceneScale } from '@/hooks'
import { CANVAS_PRESETS, CHEMISTRY_COLORS } from '@/theme'
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

  // 2. Viewport 响应式视口配置 (splitH 左右各 420x650)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitH,
  })

  // 3. 参数解构与默认值
  const {
    experimentMode = 0,
    solvent = 0,
    extractionMisoperation = 0,
    misoperation = 0,
    power = 500,
    vSolvent = 20,
  } = params

  // 4. 纯化学与场景计算 Hook
  const chemistry = useExtractionDistillationChemistry({
    experimentMode,
    solvent,
    extractionMisoperation,
    misoperation,
    power,
    vSolvent,
    time,
  })

  // 5. SceneScale 缩放比例尺 (splitH 420x650)
  const sceneScale = useSceneScale({
    vp,
    preset: CANVAS_PRESETS.splitH,
    anchor: 'viewport',
    worldWidth: 420,
    worldHeight: 650,
  })

  // 6. 提取图表数据 (固定全量定标 + Reveal filter 动态揭示)
  const history = chemistry.chartHistory.filter((p) => p.time <= time)
  const isExtraction = experimentMode === 0

  const line1Points = history.map((p) => ({ x: p.time, y: p.val1 }))
  const line2Points = history.map((p) => ({ x: p.time, y: p.val2 }))

  return (
    <div className="w-full h-full flex flex-row overflow-hidden">
      {/* 左屏：SVG 装置视口区 (420px，CANVAS_PRESETS.splitH) */}
      <div className="flex-1 h-full min-w-0 relative border-r border-slate-200/60">
        <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
          <ExtractionDistillationScene
            chemistry={chemistry}
            canvasSize={canvasSize}
            sceneScale={sceneScale}
          />
        </AnimationSvgCanvas>
      </div>

      {/* 右屏：联动 BaseChart 图表区 (420px，展示时序浓度/温度平台) */}
      <div className="flex-1 h-full min-w-0 flex flex-col overflow-hidden p-3">
        <div className="flex-1 min-h-0 w-full flex flex-col p-2">
          <div className="text-xs font-bold text-slate-700 mb-2 shrink-0 flex justify-between items-center px-1">
            <span>{isExtraction ? '萃取分配平衡动态 (c - t 曲线)' : '蒸馏温度与馏出量 (T-t / V-t 曲线)'}</span>
            <span className="text-[11px] text-slate-500 font-normal">
              {isExtraction ? '紫: c(有机相) / 橙: c(水相)' : '红: T (°C) / 蓝: V (mL)'}
            </span>
          </div>
          <div className="flex-1 min-h-0 w-full relative">
            <BaseChart
              xDomain={[0, 12]}
              yDomain={isExtraction ? [0, 0.25] : [0, 100]}
              xLabel="时间 t (s)"
              yLabel={isExtraction ? '浓度 (mol/L)' : '温度 (°C) / 体积 (mL)'}
            >
              <ChartLine
                points={line1Points}
                color={isExtraction ? CHEMISTRY_COLORS.reactionRate : CHEMISTRY_COLORS.temperature}
                strokeWidth={2.5}
              />
              <ChartLine
                points={line2Points}
                color={isExtraction ? '#9333EA' : CHEMISTRY_COLORS.concentration}
                strokeWidth={2.5}
              />
            </BaseChart>
          </div>
        </div>
      </div>
    </div>
  )
}

