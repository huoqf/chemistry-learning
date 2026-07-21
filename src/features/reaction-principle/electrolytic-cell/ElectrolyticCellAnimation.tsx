import { useAnimationViewport, useSceneScale } from '@/hooks'
import { CANVAS_PRESETS, CHEMISTRY_COLORS } from '@/theme'
import { AnimationSvgCanvas } from '@/components/Layout'
import { BaseChart, ChartLine, ChartCursor } from '@/components/Chart'
import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { useElectrolyticCellChemistry } from './hooks/useElectrolyticCellChemistry'
import { ElectrolyticCellScene } from './components/ElectrolyticCellScene'

export default function ElectrolyticCellAnimation() {
  // 1. 准确订阅 Store 状态
  const { params, time } = useAnimationStore(
    useShallow((s) => ({ params: s.params, time: s.time }))
  )

  // 2. 布局 Viewport (splitHw 280px 装置区 + 560px 图表区)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitHw,
  })

  // 3. 参数提炼
  const cellType = Number(params.cellType ?? 0)
  const anodeMaterial = Number(params.anodeMaterial ?? 0)
  const membraneType = Number(params.membraneType ?? 0)
  const current = Number(params.current ?? 1.5)

  // 4. 化学计算
  const chemistry = useElectrolyticCellChemistry({
    cellType,
    anodeMaterial,
    membraneType,
    current,
    time,
  })

  // 5. 缩放与比例尺 (280x650 design)
  const sceneScale = useSceneScale({
    vp,
    preset: CANVAS_PRESETS.splitHw,
    anchor: 'center',
    scaleDesign: 1,
  })
  void sceneScale

  // 整理 BaseChart 数据点
  const anodeMassData = chemistry.massHistory.map((p) => ({
    x: p.time,
    y: p.anodeDeltaM,
  }))

  const cathodeMassData = chemistry.massHistory.map((p) => ({
    x: p.time,
    y: p.cathodeDeltaM,
  }))

  const anodeGasData = chemistry.massHistory.map((p) => ({
    x: p.time,
    y: p.vAnodeGas,
  }))

  const cathodeGasData = chemistry.massHistory.map((p) => ({
    x: p.time,
    y: p.vCathodeGas,
  }))

  const neLineData = chemistry.ionHistory.map((p) => ({
    x: p.time,
    y: p.ne,
  }))

  const pHLineData = chemistry.ionHistory.map((p) => ({
    x: p.time,
    y: p.pH,
  }))

  return (
    <div className="w-full h-full flex flex-row overflow-hidden">
      {/* 左屏 280px 装置动画区 */}
      <div className="w-[280px] h-full shrink-0 border-r border-slate-200/80">
        <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
          <ElectrolyticCellScene
            chemistry={chemistry}
            canvasSize={canvasSize}
            cellType={cellType}
            anodeMaterial={anodeMaterial}
            membraneType={membraneType}
            current={current}
            time={time}
          />
        </AnimationSvgCanvas>
      </div>

      {/* 右侧 560px 图表展现区（两图表弹性平分 flex-1 min-h-0，无滚动条） */}
      <div className="flex-1 h-full min-w-0 flex flex-col bg-white">
        {/* 上图表：电极质量变化 Δm 与气体体积 V */}
        <div className="flex-1 min-h-0 w-full p-2 border-b border-slate-200/60">
          <BaseChart
            title="两极质量变化 Δm & 气体生成体积 V - 时间"
            xDomain={[0, 10]}
            yDomain={[-20, 20]}
            xLabel="时间 t (s)"
            yLabel="质量 Δm (g) / 体积 V (L)"
          >
            <ChartLine
              points={anodeMassData}
              color={CHEMISTRY_COLORS.anode}
              strokeWidth={2}
            />
            <ChartLine
              points={cathodeMassData}
              color={CHEMISTRY_COLORS.cathode}
              strokeWidth={2}
            />
            <ChartLine
              points={anodeGasData}
              color={CHEMISTRY_COLORS.concentration}
              strokeWidth={1.5}
              dash={[4, 4]}
            />
            <ChartLine
              points={cathodeGasData}
              color={CHEMISTRY_COLORS.pH}
              strokeWidth={1.5}
              dash={[4, 4]}
            />
            <ChartCursor
              x={time}
              dataPoints={[
                { y: chemistry.anodeDeltaM, label: `阳极 Δm: ${chemistry.anodeDeltaM}g` },
                { y: chemistry.cathodeDeltaM, label: `阴极 Δm: ${chemistry.cathodeDeltaM}g` },
                { y: chemistry.vAnodeGas, label: `阳极气体 V: ${chemistry.vAnodeGas}L` },
                { y: chemistry.vCathodeGas, label: `阴极气体 V: ${chemistry.vCathodeGas}L` },
              ]}
            />
          </BaseChart>
        </div>

        {/* 下图表：转移电子数 n(e⁻) 与溶液 pH 动态变化 */}
        <div className="flex-1 min-h-0 w-full p-2">
          <BaseChart
            title="转移电子数 n(e⁻) & 溶液 pH - 时间"
            xDomain={[0, 10]}
            yDomain={[0, 14]}
            xLabel="时间 t (s)"
            yLabel="电子 n(e⁻) (mol) / 溶液 pH"
          >
            <ChartLine
              points={neLineData}
              color={CHEMISTRY_COLORS.electron}
              strokeWidth={2}
            />
            <ChartLine
              points={pHLineData}
              color={CHEMISTRY_COLORS.pH}
              strokeWidth={2}
            />
            <ChartCursor
              x={time}
              dataPoints={[
                { y: chemistry.ne, label: `转移电子: ${chemistry.ne} mol` },
                { y: chemistry.pH, label: `溶液 pH: ${chemistry.pH}` },
              ]}
            />
          </BaseChart>
        </div>
      </div>
    </div>
  )
}
