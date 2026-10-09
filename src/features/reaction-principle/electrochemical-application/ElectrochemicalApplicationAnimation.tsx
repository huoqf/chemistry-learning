import { useMemo } from 'react'
import { useAnimationViewport } from '@/hooks'
import { CANVAS_PRESETS, CHART_COLORS, CHEMISTRY_COLORS } from '@/theme'
import { AnimationSvgCanvas } from '@/components/Layout'
import { BaseChart, ChartLine } from '@/components/Chart'
import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import {
  pHFromHydrogenMoles,
  pHFromHydroxideMoles,
  transferredElectronMoles,
} from '@/chemistry'
import { useElectrochemicalApplicationChemistry } from './hooks/useElectrochemicalApplicationChemistry'
import { ElectrochemicalApplicationScene } from './components/ElectrochemicalApplicationScene'

const MAX_TIME = 10

export default function ElectrochemicalApplicationAnimation() {
  // 1. Store（精确订阅）
  const { params, time } = useAnimationStore(
    useShallow((s) => ({ params: s.params, time: s.time }))
  )

  // 参数提取
  const current = Number(params.current ?? 1.5)
  const mode = Number(params.mode ?? 0)
  const membraneType = Number(params.membraneType ?? 0)

  // 2. Viewport 配置 (采用 CANVAS_PRESETS.splitH 左右 420px)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitH,
  })

  // 3. 当前时间步化学计算
  const chemistry = useElectrochemicalApplicationChemistry({
    current,
    mode,
    membraneType,
    time,
  })

  // 4. 时序图全量预计算 (铁律8: 基于固定全量时间轴预计算 + filter 揭示)
  const fullHistoryData = useMemo(() => {
    const steps = 100
    const points: Array<{ time: number; ne: number; cathodeMass: number; pH: number }> = []

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * MAX_TIME
      // 与 hook / 量面板共用同一来源，禁止就地重写（见 @/chemistry/electrochemical）
      const neVal = transferredElectronMoles(current, t)
      let mVal = 0
      let phVal = 7.0

      if (mode === 0) {
        mVal = neVal * 0.5 * 63.55 // Cu 增重
      } else if (mode === 1) {
        mVal = neVal * 0.5 * 2.016 // H2 逸出
        if (membraneType === 0) {
          // 阳膜：阴极室 OH⁻ 积累，pH 7 → ~12
          phVal = pHFromHydroxideMoles(neVal)
        } else if (membraneType === 1) {
          // 阴膜：阳极室 H⁺ 积累，pH 7 → ~2
          phVal = pHFromHydrogenMoles(neVal)
        } else {
          phVal = 7.0
        }
      } else {
        mVal = neVal * 0.5 * 63.55 // 镀铜增重
      }

      points.push({
        time: parseFloat(t.toFixed(2)),
        ne: parseFloat(neVal.toFixed(4)),
        cathodeMass: parseFloat(mVal.toFixed(3)),
        pH: parseFloat(phVal.toFixed(2)),
      })
    }
    return points
    // 注：pH 与电极产物量只由转移电子数与固定电解液体积决定
  }, [current, mode, membraneType])

  // 根据当前时间 filter 动态揭示
  const historyData = useMemo(() => {
    return fullHistoryData.filter((p) => p.time <= time)
  }, [fullHistoryData, time])

  const nePoints = useMemo(() => historyData.map(p => ({ x: p.time, y: p.ne })), [historyData])
  const secondPoints = useMemo(
    () => historyData.map(p => ({ x: p.time, y: mode === 1 ? p.pH : p.cathodeMass })),
    [historyData, mode]
  )

  return (
    <div className="w-full h-full flex flex-row">
      {/* 左区 (420px): 电化学实验装置 SVG 画布 */}
      <div className="w-[420px] h-full shrink-0 relative border-r border-slate-700/20">
        <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
          <ElectrochemicalApplicationScene
            chemistry={chemistry}
            canvasSize={canvasSize}
            mode={mode}
            membraneType={membraneType}
            current={current}
          />
        </AnimationSvgCanvas>
      </div>

      {/* 右区: 实时电化学参数与转移电子量/产物演化图表，无间隙、无滚动条，上下各占 50% */}
      <div className="flex-1 h-full min-w-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 w-full p-2 border-b border-slate-200/60">
          <BaseChart
            title="转移电子量 n(e⁻) - 时间关系"
            xDomain={[0, MAX_TIME]}
            yDomain={[0, 0.002]}
            xLabel="t (s)"
            yLabel="n(e⁻) (mol)"
          >
            <ChartLine
              points={nePoints}
              color={CHEMISTRY_COLORS.electron}
              strokeWidth={2.5}
            />
          </BaseChart>
        </div>

        <div className="flex-1 min-h-0 w-full p-2">
          <BaseChart
            title={mode === 1 ? '溶液 pH 动态演化' : '阴(正)极产物质量 Δm - 时间'}
            xDomain={[0, MAX_TIME]}
            yDomain={mode === 1 ? (membraneType === 1 ? [0, 14] : [7, 14]) : [0, 0.1]}
            xLabel="t (s)"
            yLabel={mode === 1 ? 'pH' : 'Δm (g)'}
          >
            <ChartLine
              points={secondPoints}
              color={mode === 1 ? CHART_COLORS.primary : CHEMISTRY_COLORS.reactionRate}
              strokeWidth={2.5}
            />
          </BaseChart>
        </div>
      </div>
    </div>
  )

}
