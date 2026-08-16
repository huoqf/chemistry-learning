import { useState } from 'react'
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Zap, AlertTriangle, ShieldCheck, X } from 'lucide-react'
import { useAnimationViewport, useSceneScale } from '@/hooks'
import { useSimulationFrame } from '@/utils/animation'
import { AnimationSvgCanvas } from '@/components/Layout'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { CANVAS_PRESETS } from '@/theme'
import type { ModelQuizData } from '@/data/quiz/types'
import type { RetrosynthesisModelData, RetrosynthesisStep, SynthesisMode } from '../types'

interface OrganicRetrosynthesisCenterViewProps {
  viewMode: number
  synthesisMode: SynthesisMode
  currentModel: RetrosynthesisModelData
  currentStep: RetrosynthesisStep
  currentStepIndex: number
  totalSteps: number
  quizData: ModelQuizData | null
  isPlaying: boolean
  onTogglePlay: () => void
  onResetStep: () => void
  onStepChange: (stepIndex: number) => void
  showCrashContrast: boolean
  onToggleCrashContrast: () => void
}

export function OrganicRetrosynthesisCenterView({
  viewMode,
  synthesisMode,
  currentModel,
  currentStep,
  currentStepIndex,
  totalSteps,
  quizData,
  isPlaying,
  onTogglePlay,
  onResetStep,
  onStepChange,
  showCrashContrast,
  onToggleCrashContrast,
}: OrganicRetrosynthesisCenterViewProps) {
  const [speed, setSpeed] = useState<number>(1)
  const [animProgress, setAnimProgress] = useState<number>(0)

  // 1. 标准动画 Viewport 与 SceneScale 绑定 (CANVAS_PRESETS.full 840x650)
  const { containerRef, canvasSize, vp } = useAnimationViewport({ preset: CANVAS_PRESETS.full })
  useSceneScale({ vp, preset: CANVAS_PRESETS.full, anchor: 'center' })
  const font = canvasSize.font

  const designWidth = CANVAS_PRESETS.full.width
  const designHeight = CANVAS_PRESETS.full.height

  // 动态光效与流动 Timer
  useSimulationFrame((_deltaTime) => {
    setAnimProgress((prev) => (prev + 0.02 * speed) % 1)
  })

  // 矢量苯环结构绘制 (精美化学双键与圆环)
  const renderBenzeneRing = (cx: number, cy: number, r: number = 18) => (
    <g transform={`translate(${cx}, ${cy})`}>
      <polygon
        points={Array.from({ length: 6 })
          .map((_, i) => {
            const a = (i * 60 * Math.PI) / 180
            return `${r * Math.cos(a)},${r * Math.sin(a)}`
          })
          .join(' ')}
        fill="none"
        stroke="#334155"
        strokeWidth="1.8"
      />
      <circle cx="0" cy="0" r={r * 0.55} fill="none" stroke="#64748B" strokeWidth="1.2" strokeDasharray="3 2" />
    </g>
  )

  // 视角 1: 规范踩分卡视角
  if (viewMode === 1) {
    return (
      <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
        {quizData && quizData.scoringSteps.length > 0 ? (
          <ScoringCardSection steps={quizData.scoringSteps} />
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">暂无规范踩分卡数据</div>
        )}
      </div>
    )
  }

  // 视角 2: 高考真题变式视角
  if (viewMode === 2) {
    return (
      <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
        {quizData && quizData.variantQuizzes.length > 0 ? (
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">暂无高考真题变式数据</div>
        )}
      </div>
    )
  }

  // 视角 0: 有机逆合成与保护基历程演练 (AnimationSvgCanvas 840x650 全景)
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden select-none">
      {/* 画布核心区域 */}
      <div ref={containerRef} className="flex-1 w-full relative overflow-hidden">
        <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
          {/* 背景网格与滤镜定义 */}
          <defs>
            <pattern id="retroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.10)" strokeWidth="1" />
            </pattern>

            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="cutLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#EF4444" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          <rect width={designWidth} height={designHeight} fill="url(#retroGrid)" />

          {/* 顶部标题与历程指示 */}
          <g transform={`translate(${designWidth / 2}, 36)`}>
            <text
              textAnchor="middle"
              fill="#0F172A"
              fontSize={font(16.5)}
              fontWeight="bold"
            >
              {currentModel.title}
            </text>
            <text
              textAnchor="middle"
              y={20}
              fill="#475569"
              fontSize={font(11.5)}
              fontWeight="medium"
            >
              {currentStep.title} · [{synthesisMode === 'retrosynthetic' ? '✂ 逆合成切断' : synthesisMode === 'forward' ? '➔ 正向路线' : '🛡 官能团保护闭环'}]
            </text>
          </g>

          {/* 逆合成连接线 / 动态 ✂ 切断 / 🛡 护盾 Protection 特效 */}
          {currentStep.connections.map((conn, idx) => {
            const fromNode = currentStep.nodes.find((n) => n.id === conn.from)
            const toNode = currentStep.nodes.find((n) => n.id === conn.to)
            if (!fromNode || !toNode) return null

            // 精准计算连接起点与终点 (基于卡片半高 45px)
            const isGoingDown = toNode.y > fromNode.y
            const startY = isGoingDown ? fromNode.y + 45 : fromNode.y - 45
            const endY = isGoingDown ? toNode.y - 45 : toNode.y + 45

            const startX = fromNode.x
            const endX = toNode.x

            const midX = (startX + endX) / 2
            const midY = (startY + endY) / 2

            return (
              <g key={`conn-${idx}`}>
                {/* 正常连接线 / 动态粒子流动 */}
                {!conn.isDisconnection && !conn.isProtectionShield && (
                  <g>
                    <path
                      d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />
                    {/* 反应流动光点 */}
                    <circle
                      cx={startX + (endX - startX) * animProgress}
                      cy={startY + (endY - startY) * animProgress}
                      r="4"
                      fill="#2563EB"
                      opacity="0.85"
                    />
                    {/* 连线文字条件标签 */}
                    {conn.label && (
                      <g transform={`translate(${midX}, ${midY - 10})`}>
                        <rect
                          x="-55"
                          y="-10"
                          width="110"
                          height="20"
                          rx="10"
                          fill="#EFF6FF"
                          stroke="#BFDBFE"
                          strokeWidth="1"
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#1D4ED8"
                          fontSize={font(10)}
                          fontWeight="bold"
                        >
                          {conn.label}
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* 逆合成动态切断 ✂ 脉冲动画 */}
                {conn.isDisconnection && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    {/* 切断红色流动脉冲光带 */}
                    <line
                      x1="-60"
                      y1="-24"
                      x2="60"
                      y2="24"
                      stroke="url(#cutLineGrad)"
                      strokeWidth="6"
                    />
                    <line
                      x1="-60"
                      y1="-24"
                      x2="60"
                      y2="24"
                      stroke="#EF4444"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                    />
                    {/* 剪刀动作粒子 */}
                    <g transform={`scale(${1 + Math.sin(animProgress * Math.PI * 2) * 0.12})`}>
                      <circle r="16" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={font(15)}
                        fill="#DC2626"
                      >
                        ✂
                      </text>
                    </g>
                    {/* 剪切文字说明框 (下移防止遮挡剪刀) */}
                    <rect
                      x="-70"
                      y="20"
                      width="140"
                      height="20"
                      rx="10"
                      fill="#FEF2F2"
                      stroke="#FCA5A5"
                      strokeWidth="1"
                    />
                    <text
                      y="30"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#B91C1C"
                      fontSize={font(10.5)}
                      fontWeight="bold"
                    >
                      {conn.label}
                    </text>
                  </g>
                )}

                {/* 🛡 动态绿光 Protection 防护盾牌 */}
                {conn.isProtectionShield && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <path
                      d={`M ${startX - midX} ${startY - midY} Q 0 0 ${endX - midX} ${endY - midY}`}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeDasharray="8 4"
                    />
                    <g transform={`scale(${1 + Math.cos(animProgress * Math.PI * 2) * 0.06})`}>
                      <rect
                        x="-70"
                        y="-15"
                        width="140"
                        height="30"
                        rx="15"
                        fill="#ECFDF5"
                        stroke="#10B981"
                        strokeWidth="1.8"
                        filter="drop-shadow(0 2px 6px rgba(16, 185, 129, 0.2))"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={font(11)}
                        fontWeight="bold"
                        fill="#047857"
                      >
                        🛡 {conn.label}
                      </text>
                    </g>
                  </g>
                )}
              </g>
            )
          })}

          {/* 分子节点 (标准尺寸 180x90 px，紧凑专业排布) */}
          {currentStep.nodes.map((node) => {
            const isProtected = node.isProtectedGroup
            const isTarget = node.isTarget

            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                {/* 动态 Protection 绿色光环 */}
                {isProtected && (
                  <rect
                    x="-98"
                    y="-52"
                    width="196"
                    height="104"
                    rx="18"
                    fill="url(#shieldGrad)"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                    style={{
                      opacity: 0.8 + Math.sin(animProgress * Math.PI * 2) * 0.2,
                    }}
                  />
                )}

                {/* 主分子卡片 */}
                <rect
                  x="-90"
                  y="-45"
                  width="180"
                  height="90"
                  rx="14"
                  fill={isTarget ? '#EFF6FF' : isProtected ? '#F0FDF4' : '#FFFFFF'}
                  stroke={isTarget ? '#2563EB' : isProtected ? '#059669' : '#94A3B8'}
                  strokeWidth={isTarget || isProtected ? '2.2' : '1.3'}
                  filter="drop-shadow(0 4px 8px rgba(15, 23, 42, 0.06))"
                />

                {/* 矢量化学苯环结构 */}
                {renderBenzeneRing(-58, -4, 18)}

                {/* 合成子极性徽章 (δ+ / δ-) */}
                {node.synthonCharge && (
                  <g transform="translate(-72, -36)">
                    <circle r="10" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.2" />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#B91C1C"
                      fontSize={font(9)}
                      fontWeight="bold"
                    >
                      {node.synthonCharge.includes('+') ? 'δ⁺' : 'δ⁻'}
                    </text>
                  </g>
                )}

                {/* 顶部身份徽章 */}
                {node.badge && (
                  <g transform="translate(0, -45)">
                    <rect
                      x="-48"
                      y="-10"
                      width="96"
                      height="20"
                      rx="10"
                      fill={isProtected ? '#059669' : isTarget ? '#2563EB' : '#475569'}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#FFFFFF"
                      fontSize={font(9.5)}
                      fontWeight="bold"
                    >
                      {node.badge}
                    </text>
                  </g>
                )}

                {/* 分子名称与化学式 */}
                <text
                  x="16"
                  y="-14"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize={font(11.5)}
                  fontWeight="bold"
                >
                  {node.label}
                </text>
                <text
                  x="16"
                  y="4"
                  textAnchor="middle"
                  fill="#475569"
                  fontSize={font(10)}
                  fontFamily="monospace"
                  fontWeight="semibold"
                >
                  {node.formula}
                </text>

                {/* 关键官能团微标列表 (紧凑排在卡片下方) */}
                {node.functionalGroups && node.functionalGroups.length > 0 && (
                  <g transform="translate(0, 24)">
                    {node.functionalGroups.map((fg, fgIdx) => {
                      const total = node.functionalGroups!.length
                      const offset = (fgIdx - (total - 1) / 2) * 54
                      return (
                        <g key={fgIdx} transform={`translate(${offset}, 0)`}>
                          <rect
                            x="-24"
                            y="-7.5"
                            width="48"
                            height="15"
                            rx="7.5"
                            fill={
                              fg.isProtected
                                ? '#D1FAE5'
                                : fg.isReacting
                                ? '#FEE2E2'
                                : '#F1F5F9'
                            }
                            stroke={
                              fg.isProtected
                                ? '#10B981'
                                : fg.isReacting
                                ? '#EF4444'
                                : '#CBD5E1'
                            }
                            strokeWidth="0.8"
                          />
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={
                              fg.isProtected
                                ? '#065F46'
                                : fg.isReacting
                                ? '#991B1B'
                                : '#334155'
                            }
                            fontSize={font(8.5)}
                            fontWeight="bold"
                          >
                            {fg.name}
                          </text>
                        </g>
                      )
                    })}
                  </g>
                )}
              </g>
            )
          })}
        </AnimationSvgCanvas>

        {/* 🚨 未保护副反应风险 (Crash Path) 悬浮卡片 */}
        {showCrashContrast && currentModel.unprotectedCrashDemo && (
          <div className="absolute top-3 right-3 max-w-sm p-3 bg-red-50/95 backdrop-blur-xs border-2 border-red-300 rounded-xl shadow-lg z-20 text-xs text-red-950 flex flex-col gap-1.5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between font-bold text-red-900 border-b border-red-200 pb-1">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                {currentModel.unprotectedCrashDemo.warningTitle}
              </span>
              <button
                onClick={onToggleCrashContrast}
                className="text-red-500 hover:text-red-700 p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-red-800 leading-relaxed">
              <span className="font-semibold text-red-900">致命后果：</span>
              {currentModel.unprotectedCrashDemo.consequence}
            </p>
            <div className="p-2 bg-white/85 rounded-lg border border-red-200 text-[10.5px] text-emerald-900 mt-0.5 flex items-start gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <span className="font-semibold text-emerald-800">高考破局：</span>
                {currentModel.unprotectedCrashDemo.solution}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 底部：控制栏 (响应式分层排版，彻底杜绝按钮挤压) */}
      <div className="p-2.5 bg-white border-t border-slate-200 shrink-0 font-sans shadow-md flex flex-col gap-2">
        {/* 上行：试剂条件与副反应对比开关 + 历程快跳 */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-100 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              条件与试剂:
              <span className="text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 font-mono font-semibold">
                {currentStep.reagents}
              </span>
            </span>

            {/* 未保护副反应对比开关 */}
            <button
              onClick={onToggleCrashContrast}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                showCrashContrast
                  ? 'bg-red-600 text-white border-red-700 shadow-xs'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {showCrashContrast ? '隐藏副反应' : '🚨 未保护副反应对比'}
            </button>
          </div>

          {/* 特征步骤快速跳转 */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">快跳:</span>
            {currentModel.steps.map((st, idx) => (
              <button
                key={idx}
                onClick={() => onStepChange(idx)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {st.fgiType.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* 下行：播放控制器与速度选择器 */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer ${
                isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? '暂停演播' : '自动演播'}
            </button>

            <button
              onClick={onResetStep}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="重置复位"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 ml-1 text-xs">
              <button
                disabled={currentStepIndex === 0}
                onClick={() => onStepChange(currentStepIndex - 1)}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-slate-700 text-xs px-1.5 font-mono">
                {currentStepIndex + 1} / {totalSteps}
              </span>
              <button
                disabled={currentStepIndex === totalSteps - 1}
                onClick={() => onStepChange(currentStepIndex + 1)}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 演播速度选择器 */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-medium text-[11px]">倍速:</span>
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded text-[10.5px] font-bold cursor-pointer ${
                  speed === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
