import React, { useMemo } from 'react'
import { AnimationSvgCanvas } from '@/components/Layout'
import { useAnimationViewport } from '@/hooks/useAnimationViewport'
import { useSceneScale } from '@/hooks/useSceneScale'
import { CANVAS_PRESETS, SCENE_COLORS, CHART_COLORS } from '@/theme'
import { BaseChart } from '@/components/Chart/BaseChart'
import { ChartLine } from '@/components/Chart/ChartLine'
import { ChartCursor } from '@/components/Chart/ChartCursor'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import {
  BeakerApparatus,
  OxidationBridgeArrow,
  QuantityBars,
} from '@/components/Chemistry'
import type { AvogadroParams, AvogadroResult } from '../types'
import type { ModelQuizData } from '@/data/quiz/types'

interface AvogadroCenterViewProps {
  params: AvogadroParams
  chemistry: AvogadroResult
  quizData?: ModelQuizData
  viewMode: number
}

export const AvogadroCenterView: React.FC<AvogadroCenterViewProps> = ({
  params,
  chemistry,
  quizData,
  viewMode,
}) => {
  // 1. Viewport 绑定：选择 CANVAS_PRESETS.splitH (420px + 420px 左右等宽)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitH,
  })
  useSceneScale({ vp, preset: CANVAS_PRESETS.splitH, anchor: 'center' })

  // 右侧图表动态点集：生成微粒数 / 电子转移量演变曲线
  const curvePoints = useMemo(() => {
    const points: { x: number; y: number }[] = []
    const total = 50
    for (let i = 0; i <= total; i++) {
      const x = (i / total) * 100 // 用量
      let y = x
      if (params.trapCategory === 'structure-bonds' && params.structureItem === 'P4') {
        y = (x / 124) * 6 * 31 // P4 键数
      } else if (params.trapCategory === 'redox-electron' && params.redoxItem === 'NO2-N2O4-reversible') {
        y = x * 0.75 // 二聚平衡分子数减少
      } else if (params.trapCategory === 'electrolyte-hydrolysis') {
        y = Math.log10(x + 1) * 20
      }
      points.push({ x, y })
    }
    return points
  }, [params.trapCategory, params.structureItem, params.redoxItem])

  // 复用 QuantityBars 组件的量分配对比点
  const barItems = useMemo(() => {
    return chemistry.particleStats.map((st, idx) => ({
      key: `bar-${idx}`,
      label: st.label,
      value: st.actualMoles,
      color: st.isTrap ? '#EF4444' : '#10B981',
      unit: st.unit,
    }))
  }, [chemistry.particleStats])

  // 视角 1: 规范踩分卡
  if (viewMode === 1) {
    return (
      <div className="w-full h-full flex flex-col p-4 bg-slate-50 overflow-y-auto">
        {quizData?.scoringSteps && quizData.scoringSteps.length > 0 ? (
          <ScoringCardSection steps={quizData.scoringSteps} />
        ) : (
          <div className="p-8 text-center text-slate-400">暂无踩分步骤</div>
        )}
      </div>
    )
  }

  // 视角 2: 高考真题研析
  if (viewMode === 2) {
    return (
      <div className="w-full h-full flex flex-col p-4 bg-slate-50 overflow-y-auto">
        {quizData?.variantQuizzes && quizData.variantQuizzes.length > 0 ? (
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        ) : (
          <div className="p-8 text-center text-slate-400">暂无真题研析</div>
        )}
      </div>
    )
  }

  // 视角 0: 纯净 splitH 双视野 (左 420px 22.4L 空间/晶体化学场景 + 右 420px 动态游标图表)
  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white select-none">
      {/* 左右均分 Container */}
      <div className="flex-1 min-h-0 w-full flex flex-row overflow-hidden border-b border-slate-200">
        
        {/* ── 左侧 420px 化学器材与 22.4L 空间/晶体 SVG 视口区 ── */}
        <div className="w-[420px] h-full shrink-0 border-r border-slate-200/80 relative bg-slate-50/30">
          <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
            <defs>
              <pattern id="avogadro-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="420" height="650" fill="url(#avogadro-grid)" opacity={0.5} />

            {/* 1. 标况状态与 22.4 L 空间体积标尺 */}
            {params.trapCategory === 'state-volume' && (
              <g transform="translate(60, 80)">
                <rect x="0" y="0" width="300" height="300" rx="16" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" strokeDasharray="6 4" />
                <text x="150" y="30" fill="#334155" fontSize={canvasSize.font(14)} textAnchor="middle" fontWeight="bold">
                  22.4 L 标准状况密闭空间 (0℃, 101 kPa)
                </text>
                <line x1="15" y1="50" x2="285" y2="50" stroke="#cbd5e1" strokeWidth="1" />

                {chemistry.isStateGas ? (
                  <g transform="translate(0, 40)">
                    <circle cx="50" cy="50" r="14" fill="#38bdf8" opacity="0.8" stroke="#0284c7" strokeWidth="1.5" />
                    <circle cx="150" cy="80" r="14" fill="#38bdf8" opacity="0.8" stroke="#0284c7" strokeWidth="1.5" />
                    <circle cx="240" cy="40" r="14" fill="#38bdf8" opacity="0.8" stroke="#0284c7" strokeWidth="1.5" />
                    <circle cx="90" cy="160" r="14" fill="#38bdf8" opacity="0.8" stroke="#0284c7" strokeWidth="1.5" />
                    <circle cx="210" cy="190" r="14" fill="#38bdf8" opacity="0.8" stroke="#0284c7" strokeWidth="1.5" />
                    <circle cx="160" cy="220" r="14" fill="#38bdf8" opacity="0.8" stroke="#0284c7" strokeWidth="1.5" />
                    <text x="150" y="140" fill="#0284c7" fontSize={canvasSize.font(13)} textAnchor="middle" fontWeight="bold">
                      气体分子热运动，均匀充满 22.4 L 空间
                    </text>
                    <text x="150" y="165" fill="#0369a1" fontSize={canvasSize.font(12)} textAnchor="middle">
                      1 mol 任何气体在标况下体积均约为 22.4 L (1 <tspan fontStyle="italic">N</tspan><tspan fontSize="0.75em" dy="3">A</tspan><tspan dy="-3" fontSize="1em"></tspan>)
                    </text>
                  </g>
                ) : (
                  <g transform="translate(0, 40)">
                    <rect x="10" y="220" width="280" height="30" rx="4" fill="#e11d48" opacity="0.8" />
                    <text x="150" y="240" fill="#ffffff" fontSize={canvasSize.font(11)} textAnchor="middle" fontWeight="bold">
                      1 mol 真实物质液/固态体积 (仅 18~90 mL ≪ 22.4 L)
                    </text>
                    <text x="150" y="100" fill="#e11d48" fontSize={canvasSize.font(14)} textAnchor="middle" fontWeight="bold">
                      🛑 标况下为固态/液态！非气体！
                    </text>
                    <text x="150" y="130" fill="#be123c" fontSize={canvasSize.font(12)} textAnchor="middle">
                      若硬填满 22.4 L 液态物质，其分子数高达数秒摩尔 (500+ <tspan fontStyle="italic">N</tspan><tspan fontSize="0.75em" dy="3">A</tspan><tspan dy="-3" fontSize="1em"></tspan>)
                    </text>
                    <text x="150" y="155" fill="#9f1239" fontSize={canvasSize.font(13)} textAnchor="middle" fontWeight="bold">
                      严禁套用 Vm = 22.4 L/mol 计算！
                    </text>
                    <line x1="20" y1="20" x2="280" y2="210" stroke="#ef4444" strokeWidth="3" opacity="0.4" />
                    <line x1="20" y1="210" x2="280" y2="20" stroke="#ef4444" strokeWidth="3" opacity="0.4" />
                  </g>
                )}
              </g>
            )}

            {/* 2. 结构化学与化学键高保真拓扑 */}
            {params.trapCategory === 'structure-bonds' && (
              <g transform="translate(210, 240)">
                {params.structureItem === 'P4' ? (
                  <g>
                    <polygon points="0,-110 -100,60 100,60" fill="none" stroke="#a855f7" strokeWidth="3.5" />
                    <line x1="0" y1="-110" x2="0" y2="0" stroke="#a855f7" strokeWidth="3.5" />
                    <line x1="-100" y1="60" x2="0" y2="0" stroke="#a855f7" strokeWidth="3.5" strokeDasharray="4 4" />
                    <line x1="100" y1="60" x2="0" y2="0" stroke="#a855f7" strokeWidth="3.5" strokeDasharray="4 4" />
                    <circle cx="0" cy="-110" r="20" fill="#f3e8ff" stroke="#7e22ce" strokeWidth="2.5" />
                    <circle cx="-100" cy="60" r="20" fill="#f3e8ff" stroke="#7e22ce" strokeWidth="2.5" />
                    <circle cx="100" cy="60" r="20" fill="#f3e8ff" stroke="#7e22ce" strokeWidth="2.5" />
                    <circle cx="0" cy="0" r="20" fill="#f3e8ff" stroke="#7e22ce" strokeWidth="2.5" />
                    <text x="0" y="-103" fill="#6b21a8" fontSize={canvasSize.font(14)} textAnchor="middle" fontWeight="bold">P</text>
                    <text x="-100" y="66" fill="#6b21a8" fontSize={canvasSize.font(14)} textAnchor="middle" fontWeight="bold">P</text>
                    <text x="100" y="66" fill="#6b21a8" fontSize={canvasSize.font(14)} textAnchor="middle" fontWeight="bold">P</text>
                    <text x="0" y="6" fill="#6b21a8" fontSize={canvasSize.font(14)} textAnchor="middle" fontWeight="bold">P</text>
                    <text x="0" y="115" fill="#6b21a8" fontSize={canvasSize.font(14)} textAnchor="middle" fontWeight="bold">
                      正四面体：4 个 P 顶点，6 条 P-P 棱键 (60°)
                    </text>
                  </g>
                ) : params.structureItem === 'S8' ? (
                  <g>
                    <polygon points="-80,-40 -30,-80 30,-80 80,-40 60,30 20,60 -20,60 -60,30" fill="none" stroke="#eab308" strokeWidth="3.5" />
                    {[-80, -30, 30, 80, 60, 20, -20, -60].map((x, i) => {
                      const ys = [-40, -80, -80, -40, 30, 60, 60, 30]
                      return (
                        <circle key={i} cx={x} cy={ys[i]} r="14" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2" />
                      )
                    })}
                    <text x="0" y="105" fill="#854d0e" fontSize={canvasSize.font(13)} textAnchor="middle" fontWeight="bold">
                      S₈ 皇冠状环：1 mol S₈ 含有 8 mol S-S 键
                    </text>
                  </g>
                ) : params.structureItem === 'ice' ? (
                  <g>
                    <circle cx="0" cy="0" r="28" fill="#38bdf8" opacity="0.8" />
                    <text x="0" y="5" fill="#ffffff" fontSize={canvasSize.font(13)} textAnchor="middle" fontWeight="bold">H₂O</text>
                    <line x1="0" y1="0" x2="-60" y2="-60" stroke="#0284c7" strokeWidth="3" strokeDasharray="4 3" />
                    <line x1="0" y1="0" x2="60" y2="-60" stroke="#0284c7" strokeWidth="3" strokeDasharray="4 3" />
                    <line x1="0" y1="0" x2="-60" y2="60" stroke="#0284c7" strokeWidth="3" strokeDasharray="4 3" />
                    <line x1="0" y1="0" x2="60" y2="60" stroke="#0284c7" strokeWidth="3" strokeDasharray="4 3" />
                    <circle cx="-60" cy="-60" r="16" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
                    <circle cx="60" cy="-60" r="16" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
                    <circle cx="-60" cy="60" r="16" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
                    <circle cx="60" cy="60" r="16" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
                    <text x="0" y="105" fill="#0369a1" fontSize={canvasSize.font(13)} textAnchor="middle" fontWeight="bold">
                      均摊法：1 mol 冰 (18 g) 含有 2 mol 氢键 (4 × 1/2)
                    </text>
                  </g>
                ) : params.structureItem === 'T2O' ? (
                  <g>
                    <circle cx="0" cy="0" r="30" fill="#0284c7" />
                    <text x="0" y="5" fill="#ffffff" fontSize={canvasSize.font(14)} textAnchor="middle" fontWeight="bold">¹⁸O</text>
                    <circle cx="-50" cy="40" r="22" fill="#7c3aed" />
                    <text x="-50" y="45" fill="#ffffff" fontSize={canvasSize.font(13)} textAnchor="middle" fontWeight="bold">³H (T)</text>
                    <circle cx="50" cy="40" r="22" fill="#7c3aed" />
                    <text x="50" y="45" fill="#ffffff" fontSize={canvasSize.font(13)} textAnchor="middle" fontWeight="bold">³H (T)</text>
                    <line x1="-20" y1="15" x2="-35" y2="28" stroke="#334155" strokeWidth="3" />
                    <line x1="20" y1="15" x2="35" y2="28" stroke="#334155" strokeWidth="3" />
                    <text x="0" y="105" fill="#6d28d9" fontSize={canvasSize.font(13)} textAnchor="middle" fontWeight="bold">
                      T₂O 分子：含有 12 mol 中子 (M = 22 g/mol)
                    </text>
                  </g>
                ) : (
                  <g>
                    <circle cx="-55" cy="0" r="34" fill="#0284c7" />
                    <circle cx="55" cy="0" r="34" fill="#e11d48" />
                    <line x1="-20" y1="0" x2="20" y2="0" stroke="#0f172a" strokeWidth="4" />
                    <text x="-55" y="6" fill="#ffffff" fontSize={canvasSize.font(14)} textAnchor="middle" fontWeight="bold">Na⁺</text>
                    <text x="55" y="6" fill="#ffffff" fontSize={canvasSize.font(14)} textAnchor="middle" fontWeight="bold">O₂²⁻</text>
                    <text x="0" y="85" fill="#334155" fontSize={canvasSize.font(13)} textAnchor="middle" fontWeight="bold">
                      阴离子整体为 O₂²⁻ (阴阳离子比 1:2)
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* 3. 弱电解质与水解/熔融对比 (精准消灭张冠李戴残留) */}
            {params.trapCategory === 'electrolyte-hydrolysis' && (
              <g transform="translate(110, 150)">
                {params.electrolyteItem === 'NaHSO4-molten' ? (
                  <g transform="translate(100, 100)">
                    <rect x="-90" y="-70" width="180" height="150" rx="12" fill="#fff7ed" stroke="#f97316" strokeWidth="2.5" />
                    <text x="0" y="-45" fill="#c2410c" fontSize={canvasSize.font(14)} textAnchor="middle" fontWeight="bold">
                      熔融态 NaHSO₄ 离解
                    </text>
                    <circle cx="-40" cy="20" r="22" fill="#3b82f6" />
                    <text x="-40" y="26" fill="#ffffff" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">Na⁺</text>
                    <circle cx="40" cy="20" r="26" fill="#ea580c" />
                    <text x="40" y="26" fill="#ffffff" fontSize={canvasSize.font(11)} textAnchor="middle" fontWeight="bold">HSO₄⁻</text>
                    <text x="0" y="60" fill="#9a3412" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
                      仅断裂离子键 ➔ 生成 2 mol 离子！
                    </text>
                  </g>
                ) : params.electrolyteItem === 'Na2CO3' ? (
                  /* Na2CO3 水解阴离子增加场景 */
                  <g>
                    <BeakerApparatus
                      x={40}
                      y={40}
                      width={140}
                      height={160}
                      fillLevel={0.7}
                      fillColor={SCENE_COLORS.reagent.solution}
                      label="Na₂CO₃ 水解溶液"
                      font={canvasSize.font}
                    />
                    <circle cx="70" cy="110" r="13" fill="#0284c7" />
                    <text x="70" y="114" fill="#ffffff" fontSize={canvasSize.font(8)} textAnchor="middle" fontWeight="bold">HCO₃⁻</text>
                    <circle cx="130" cy="120" r="11" fill="#ef4444" />
                    <text x="130" y="123" fill="#ffffff" fontSize={canvasSize.font(8)} textAnchor="middle" fontWeight="bold">OH⁻</text>
                    <circle cx="100" cy="150" r="15" fill="#0369a1" />
                    <text x="100" y="154" fill="#ffffff" fontSize={canvasSize.font(8)} textAnchor="middle" fontWeight="bold">CO₃²⁻</text>
                  </g>
                ) : (
                  /* CH3COOH 弱酸电离场景 */
                  <g>
                    <BeakerApparatus
                      x={40}
                      y={40}
                      width={140}
                      height={160}
                      fillLevel={0.7}
                      fillColor={SCENE_COLORS.reagent.solution}
                      label="CH₃COOH 弱酸电离"
                      font={canvasSize.font}
                    />
                    <circle cx="80" cy="110" r="14" fill="#0284c7" />
                    <text x="80" y="114" fill="#ffffff" fontSize={canvasSize.font(9)} textAnchor="middle" fontWeight="bold">CH₃COO⁻</text>
                    <circle cx="130" cy="130" r="10" fill="#ef4444" />
                    <text x="130" y="133" fill="#ffffff" fontSize={canvasSize.font(8)} textAnchor="middle" fontWeight="bold">H⁺</text>
                  </g>
                )}
              </g>
            )}

            {/* 4. 氧化还原与 NO2 二聚平衡 (精准消除 NO2 二聚出现双线桥的残存 Bug) */}
            {params.trapCategory === 'redox-electron' && (
              <g transform="translate(210, 240)">
                {params.redoxItem === 'NO2-N2O4-reversible' ? (
                  /* 2NO2 <-> N2O4 二聚碰撞分子变少矢量图 (绝对不放双线桥) */
                  <g>
                    <rect x="-100" y="-80" width="200" height="160" rx="16" fill="#fef2f2" stroke="#ef4444" strokeWidth="2.5" />
                    <text x="0" y="-55" fill="#991b1b" fontSize={canvasSize.font(14)} textAnchor="middle" fontWeight="bold">
                      2NO₂ ⇌ N₂O₄ 二聚平衡
                    </text>
                    
                    {/* 红棕色 NO2 单体 */}
                    <circle cx="-50" cy="0" r="18" fill="#b91c1c" />
                    <text x="-50" y="5" fill="#ffffff" fontSize={canvasSize.font(11)} textAnchor="middle" fontWeight="bold">NO₂</text>
                    <circle cx="-10" cy="20" r="18" fill="#b91c1c" />
                    <text x="-10" y="25" fill="#ffffff" fontSize={canvasSize.font(11)} textAnchor="middle" fontWeight="bold">NO₂</text>
                    
                    {/* 动态可逆箭头 */}
                    <text x="20" y="5" fill="#dc2626" fontSize={canvasSize.font(16)} textAnchor="middle" fontWeight="bold">⇌</text>
                    
                    {/* 无色 N2O4 二聚分子 */}
                    <ellipse cx="60" cy="10" rx="28" ry="20" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
                    <text x="60" y="15" fill="#991b1b" fontSize={canvasSize.font(11)} textAnchor="middle" fontWeight="bold">N₂O₄</text>

                    <text x="0" y="60" fill="#b91c1c" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
                      2 个 NO₂ 分子二聚为 1 个 N₂O₄ ➔ 分子总数 &lt; 1 NA
                    </text>
                  </g>
                ) : (
                  /* 歧化反应 / Cu+S 双线桥 */
                  <g>
                    <text x="0" y="-90" fill="#d97706" fontSize={canvasSize.font(14)} textAnchor="middle" fontWeight="bold">
                      {params.redoxItem === 'Cu-S' ? 'Cu + S ≜ Cu₂S (弱氧化剂变价)' : 'Cl₂ + NaOH 歧化反应电子转移'}
                    </text>
                    <OxidationBridgeArrow
                      startPos={[-80, 0]}
                      endPos={[80, 0]}
                      label={params.redoxItem === 'Cu-S' ? '失 1e⁻ (生成 +1 价 Cu)' : '失 1e⁻ (氧化为 NaClO)'}
                      arcHeight={35}
                      font={canvasSize.font}
                    />
                    <circle cx="-80" cy="0" r="24" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                    <text x="-80" y="5" fill="#b45309" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">0</text>
                    <circle cx="80" cy="0" r="24" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
                    <text x="80" y="5" fill="#15803d" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">+1</text>
                  </g>
                )}
              </g>
            )}

            {/* 复用 QuantityBars 直接在 SVG 场景下半部绘制对比柱 */}
            <g transform="translate(40, 420)">
              <QuantityBars
                items={barItems}
                initialTotal={2}
                font={canvasSize.font}
                compact={true}
              />
            </g>
          </AnimationSvgCanvas>

          {/* 浮动场景卡 */}
          <div className="absolute top-3 left-3 right-3 bg-white/90 border border-slate-200 p-2.5 rounded-lg text-xs backdrop-blur shadow-xs flex items-center justify-between">
            <span className="font-bold text-slate-800">
              物理状态：{chemistry.physicalState}
            </span>
            <span className={`px-2 py-0.5 rounded font-bold ${
              chemistry.trapLevel === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {chemistry.trapBadge}
            </span>
          </div>
        </div>

        {/* ── 右侧 420px SVG 动态图表与游标实时追踪区 ── */}
        <div className="flex-1 h-full min-w-0 flex flex-col p-3 bg-white relative">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <span className="text-xs font-bold text-slate-800">
              微粒数 / 电子转移量演变曲线 (ChartCursor 游标实时联动)
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold">
              {chemistry.isStateGas ? `V_m = ${chemistry.vmValue} L/mol` : 'V_m: 不适用 (非气体)'}
            </span>
          </div>

          <div className="flex-1 min-h-0 relative">
            <BaseChart
              title=""
              xDomain={[0, 100]}
              yDomain={[0, 100]}
              xLabel="给定条件用量 (L / mol / g)"
              yLabel="统计微粒数 / 转移电子数 (N_A)"
            >
              <ChartLine
                points={curvePoints}
                color={CHART_COLORS.primary}
                strokeWidth={2.5}
              />

              {/* 游标线与左屏控制台参数绝对 100% 实时同步 (去除了强拼等号漏洞) */}
              <ChartCursor
                x={
                  params.trapCategory === 'electrolyte-hydrolysis' && params.electrolyteItem !== 'NaHSO4-molten'
                    ? (params.solutionVolume / 5) * 100
                    : params.amountValue
                }
                dataPoints={[
                  {
                    y: Math.min(90, (chemistry.particleStats[0]?.actualMoles || 1) * 10),
                    label: `实测值: ${(chemistry.particleStats[0]?.actualMoles || 1).toFixed(2)} NA`,
                    series: 'primary',
                  },
                ]}
                font={canvasSize.font}
              />
            </BaseChart>
          </div>
        </div>

      </div>
    </div>
  )
}
