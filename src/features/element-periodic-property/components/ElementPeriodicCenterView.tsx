import React, { useMemo } from 'react'
import { AnimationSvgCanvas } from '@/components/Layout'
import { useAnimationViewport } from '@/hooks/useAnimationViewport'
import { CANVAS_PRESETS, CHART_COLORS, CHEMISTRY_COLORS, CANVAS_COLORS, colors } from '@/theme'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { BaseChart, ChartLine, ChartCursor } from '@/components/Chart'
import type { ElementPeriodicParams } from '../types'
import { useElementPeriodicChemistry } from '../hooks/useElementPeriodicChemistry'
import { AtomShellScene } from './AtomShellScene'
import type { ModelQuizData } from '@/data/quiz/types'

interface ElementPeriodicCenterViewProps {
  viewMode: number
  params: ElementPeriodicParams
  chemistry: ReturnType<typeof useElementPeriodicChemistry>
  quizData?: ModelQuizData | null
}

export const ElementPeriodicCenterView: React.FC<ElementPeriodicCenterViewProps> = ({
  viewMode,
  params,
  chemistry,
  quizData,
}) => {
  const {
    currentElement,
    orbitalBoxes,
    periodIonizationData,
    stepIonizationAnalysis,
    isoParticles,
    activeInferenceCase,
  } = chemistry

  // 1. 严格使用 CANVAS_PRESETS.splitH (420x650 + 420x650 左右 1:1 均分布局)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitH,
  })
  const font = canvasSize.font

  // 将电离能数据转化为 BaseChart 所需的点阵
  const chartPoints = useMemo(() => {
    return periodIonizationData.map((d, i) => ({
      x: i + 1,
      y: d.value,
      label: `${d.symbol} (${d.value})`,
      isAnomaly: d.isAnomaly,
    }))
  }, [periodIonizationData])

  // 视角 1: 规范踩分卡
  if (viewMode === 1) {
    return (
      <div className="w-full h-full flex flex-col overflow-y-auto p-4 bg-slate-50 select-none">
        {quizData && quizData.scoringSteps.length > 0 ? (
          <ScoringCardSection steps={quizData.scoringSteps} />
        ) : (
          <div className="text-center text-slate-500 py-12 text-sm bg-white rounded-xl border border-slate-200">
            暂无规范踩分卡数据
          </div>
        )}
      </div>
    )
  }

  // 视角 2: 高考真题变式研析
  if (viewMode === 2) {
    return (
      <div className="w-full h-full flex flex-col overflow-y-auto p-4 bg-slate-50 select-none">
        {quizData && quizData.variantQuizzes.length > 0 ? (
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        ) : (
          <div className="text-center text-slate-500 py-12 text-sm bg-white rounded-xl border border-slate-200">
            暂无高考真题数据
          </div>
        )}
      </div>
    )
  }

  // 视角 0: 交互图谱探究 (Light Theme 亮色风格 420x650 + 420x650 左右 1:1 分区)
  return (
    <div className="w-full h-full flex flex-row overflow-hidden select-none bg-slate-100 p-2 gap-2">
      {/* ── 左侧 420px 视口区 (CANVAS_PRESETS.splitH 420x650) ── */}
      <div
        ref={containerRef}
        className="w-1/2 h-full shrink-0 border border-slate-200/90 relative bg-white rounded-xl shadow-2xs overflow-hidden"
      >
        <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
          <defs>
            <pattern id="atom-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={CANVAS_COLORS.grid} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="420" height="650" fill="url(#atom-grid)" opacity="0.6" />

          {/* 渲染独立的微观原子结构场景 */}
          <AtomShellScene element={currentElement} stateType={params.stateType} font={font} />
        </AnimationSvgCanvas>
      </div>

      {/* ── 右侧 420px/flex-1 宽幅图谱与分析区 (Light Theme 亮色风格) ── */}
      <div className="w-1/2 h-full overflow-y-auto p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-4">
        {/* 模式 1: 电子排布与轨道表示图 (orbital-config) */}
        {params.exploreMode === 'orbital-config' && (
          <div className="flex flex-col gap-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                核外电子轨道表示图 (Orbital Box Diagram)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {params.stateType === 'excited'
                  ? '⚡ 激发态 (Excited State) - 存在高能跃迁电子'
                  : '✨ 基态 (Ground State) - 遵循构造原理与洪特规则'}
              </p>
            </div>

            {/* 轨道方框表示图 (SVG 矢量阵列) */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <svg viewBox="0 0 380 200" className="w-full h-auto">
                {orbitalBoxes.map((box, bIdx) => {
                  const row = Math.floor(bIdx / 4)
                  const col = bIdx % 4
                  const bx = 10 + col * 90
                  const by = 20 + row * 80

                  return (
                    <g key={box.label} transform={`translate(${bx}, ${by})`}>
                      {/* 轨道方框 */}
                      <rect
                        width={70}
                        height={50}
                        rx={6}
                        fill={box.isFull ? colors.primary[50] : box.isHalf ? colors.warning[50] : colors.neutral.white}
                        stroke={
                          box.isHalf ? colors.warning[500] : box.isFull ? colors.primary[500] : colors.neutral[400]
                        }
                        strokeWidth={1.5}
                      />
                      {/* 轨道名称 */}
                      <text
                        x={35}
                        y={-6}
                        textAnchor="middle"
                        fill={colors.neutral[700]}
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {box.label}
                      </text>

                      {/* 电子箭头 */}
                      {box.electrons.includes('up') && (
                        <g transform="translate(22, 10)">
                          <line
                            x1={0}
                            y1={28}
                            x2={0}
                            y2={4}
                            stroke={CHART_COLORS.primary}
                            strokeWidth={3}
                            strokeLinecap="round"
                          />
                          <polygon points="0,0 -4,7 4,7" fill={CHART_COLORS.primary} />
                        </g>
                      )}
                      {box.electrons.includes('down') && (
                        <g transform="translate(48, 10)">
                          <line
                            x1={0}
                            y1={2}
                            x2={0}
                            y2={26}
                            stroke={CHEMISTRY_COLORS.temperature}
                            strokeWidth={3}
                            strokeLinecap="round"
                          />
                          <polygon points="0,30 -4,23 4,23" fill={CHEMISTRY_COLORS.temperature} />
                        </g>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* 规范表达矩阵 */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-2 text-xs">
              <div className="font-bold text-slate-800 border-b pb-1">
                规范表达矩阵 (Standard Expressions)
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">完整电子排布式：</span>
                <span className="font-mono font-bold text-indigo-600">
                  {currentElement.fullConfig}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">简化电子排布式：</span>
                <span className="font-mono font-bold text-rose-600">
                  {currentElement.shortConfig}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">价层电子排布式：</span>
                <span className="font-mono font-bold text-amber-600">
                  {currentElement.outerConfig}
                </span>
              </div>
              <div className="flex items-center justify-between border-t pt-1">
                <span className="text-slate-500">未成对电子数 / 稳定型：</span>
                <span className="font-bold text-emerald-600">
                  {currentElement.unpairedElectrons} 个电子{' '}
                  {currentElement.isHundSpecial ? '⭐ [洪特特例半/全充满]' : ''}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 模式 2: 第一电离能反常折线图 (ion-energy) */}
        {params.exploreMode === 'ion-energy' && (
          <div className="flex flex-col gap-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">
                第 {params.periodFilter} 周期第一电离能 (I₁) 趋势与反常
              </h3>
              <p className="text-xs text-amber-600 font-semibold mt-0.5">
                ⚠️ 高考高频：IIA &gt; IIIA (Be&gt;B, Mg&gt;Al) 与 VA &gt; VIA (N&gt;O, P&gt;S)
              </p>
            </div>

            {/* 复用 BaseChart 标准图表组件 */}
            <div className="h-[260px] w-full p-2 bg-slate-50 rounded-lg border border-slate-200">
              <BaseChart
                xDomain={[0.5, 8.5]}
                yDomain={[400, 2400]}
                xLabel="元素序数"
                yLabel="I₁ (kJ/mol)"
              >
                <ChartLine
                  points={chartPoints}
                  series="primary"
                  color={CHART_COLORS.primary}
                />
                <ChartCursor
                  x={1}
                  dataPoints={chartPoints.map((p) => ({
                    y: p.y,
                    label: p.label,
                    series: p.isAnomaly ? 'warm' : 'primary',
                  }))}
                />
              </BaseChart>
            </div>

            {/* 规则剖析卡 */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
              <div className="font-bold mb-1 text-amber-800">
                💡 高考第一电离能反常原理剖析：
              </div>
              <p className="mb-1">
                1. IIA 族 (Be/Mg) 外层为 ns² 全充满极稳状态，失电子比 IIIA 族 (B/Al ns²np¹) 需克服更大阻力。
              </p>
              <p>
                2. VA 族 (N/P) 外层为 np³ 轨道半充满极稳状态，I₁ 反常高于 VIA 族 (O/S np⁴)。
              </p>
            </div>
          </div>
        )}

        {/* 模式 3: 逐级电离能突跃 (step-ion-energy) */}
        {params.exploreMode === 'step-ion-energy' && (
          <div className="flex flex-col gap-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">
                {currentElement.symbol} ({currentElement.name}) 逐级电离能 (I₁ ~ I₄) 突跃分析
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                突跃倍率揭示主族元素最外层价电子数
              </p>
            </div>

            {/* 逐级柱状图 */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <svg viewBox="0 0 360 180" className="w-full h-auto">
                <line x1={30} y1={150} x2={340} y2={150} stroke={CANVAS_COLORS.axis} strokeWidth={1.5} />
                {stepIonizationAnalysis.steps.map((val, idx) => {
                  const x = 50 + idx * 75
                  const h = Math.min(110, Math.log10(val) * 28)
                  const y = 150 - h
                  const ratio = stepIonizationAnalysis.ratios[idx]

                  return (
                    <g key={idx}>
                      <rect
                        x={x}
                        y={y}
                        width={36}
                        height={h}
                        rx={4}
                        fill={CHEMISTRY_COLORS.concentration}
                      />
                      <text
                        x={x + 18}
                        y={y - 6}
                        textAnchor="middle"
                        fill={colors.neutral[800]}
                        fontSize="10"
                        fontWeight="bold"
                      >
                        I{idx + 1}
                      </text>
                      <text
                        x={x + 18}
                        y={165}
                        textAnchor="middle"
                        fill={colors.neutral[500]}
                        fontSize="9"
                      >
                        {val}
                      </text>

                      {ratio && (
                        <text
                          x={x + 55}
                          y={100}
                          textAnchor="middle"
                          fill={colors.danger[600]}
                          fontSize="10"
                          fontWeight="bold"
                        >
                          ×{ratio}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* 结论卡 */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 leading-relaxed">
              <div className="font-bold mb-1 text-emerald-800">
                🎯 最外层价电子数判定结论：
              </div>
              <p>{stepIonizationAnalysis.jumpDescription}</p>
            </div>
          </div>
        )}

        {/* 模式 4: 微粒半径与等电子体 (radius-matrix) */}
        {params.exploreMode === 'radius-matrix' && (
          <div className="flex flex-col gap-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">
                {params.isoGroupFilter.toUpperCase()} 电子体微粒半径对比矩阵
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                电子层结构相同：核电荷数 (Z) 越大，原子核引力越强 ➔ 半径越小！
              </p>
            </div>

            {/* 球形与数值可视化 */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-around">
              {isoParticles.map((p) => {
                const rDisplay = p.radius * 0.28
                return (
                  <div key={p.symbol} className="flex flex-col items-center gap-1">
                    <div
                      style={{ width: rDisplay * 2, height: rDisplay * 2 }}
                      className="rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center shadow-2xs"
                    >
                      <span className="text-[11px] font-bold text-blue-900">
                        {p.symbol}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">
                      {p.radius} pm
                    </span>
                    <span className="text-[9px] text-slate-400">Z={p.z}</span>
                  </div>
                )
              })}
            </div>

            {/* 口诀卡 */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
              <div className="font-bold mb-1 text-blue-800">
                📐 阴阳离子半径三看口诀：
              </div>
              <p>1. 一看电子层数：层数越多，半径越大；</p>
              <p>2. 二看核电荷数：层数相同时，Z 越大，半径越小；</p>
              <p>3. 三看电子数：核电荷数相同时，电子数越多，半径越大。</p>
            </div>
          </div>
        )}

        {/* 模式 5: 高考位-构-性推算链 (inference-nexus) */}
        {params.exploreMode === 'inference-nexus' && (
          <div className="flex flex-col gap-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">
                {activeInferenceCase.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                来源：{activeInferenceCase.source}
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {activeInferenceCase.elements.map((item) => (
                <div
                  key={item.elementCode}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between border-b pb-1 font-bold">
                    <span className="text-indigo-600">
                      代号 {item.elementCode} ➔ 真实元素：{item.realSymbol}
                    </span>
                  </div>
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-500">题干突破口：</span>
                    {item.clues.join(' · ')}
                  </p>
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-500">推演过程：</span>
                    {item.derivation}
                  </p>
                  <p className="text-emerald-700 font-semibold">
                    <span>考点要害：</span>
                    {item.keyPoint}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
