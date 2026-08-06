import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { useAnimationViewport, useSceneScale } from '@/hooks'
import { AnimationSvgCanvas } from '@/components/Layout'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { CANVAS_PRESETS } from '@/theme'
import type { ModelQuizData } from '@/data/quiz/types'
import type { RetrosynthesisModelData, RetrosynthesisStep } from '../types'

interface OrganicRetrosynthesisCenterViewProps {
  viewMode: number
  currentModel: RetrosynthesisModelData
  currentStep: RetrosynthesisStep
  currentStepIndex: number
  totalSteps: number
  quizData: ModelQuizData | null
  isPlaying: boolean
  onTogglePlay: () => void
  onResetStep: () => void
  onStepChange: (stepIndex: number) => void
}

export function OrganicRetrosynthesisCenterView({
  viewMode,
  currentModel,
  currentStep,
  currentStepIndex,
  totalSteps,
  quizData,
  isPlaying,
  onTogglePlay,
  onResetStep,
  onStepChange,
}: OrganicRetrosynthesisCenterViewProps) {
  const [speed, setSpeed] = useState<number>(1)
  const [animProgress, setAnimProgress] = useState<number>(0)

  // 1. 标准动画 Viewport 与 SceneScale 绑定 (CANVAS_PRESETS.full 840x650)
  const { containerRef, canvasSize, vp } = useAnimationViewport({ preset: CANVAS_PRESETS.full })
  useSceneScale({ vp, preset: CANVAS_PRESETS.full, anchor: 'center' })
  const font = canvasSize.font

  const designWidth = CANVAS_PRESETS.full.width
  const designHeight = CANVAS_PRESETS.full.height

  // 动态粒子/光效 Timer (切断/ Protection 动画)
  useEffect(() => {
    let animFrame: number
    const animate = () => {
      setAnimProgress((prev) => (prev + 0.02 * speed) % 1)
      animFrame = requestAnimationFrame(animate)
    }
    animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [speed])

  // 矢量苯环结构绘制
  const renderBenzeneRing = (cx: number, cy: number, r: number = 22) => (
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
        strokeWidth="2"
      />
      <circle cx="0" cy="0" r={r * 0.55} fill="none" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 2" />
    </g>
  )

  // 视角 1: 规范踩分卡视角 (DOM 条件渲染)
  if (viewMode === 1) {
    return (
      <div className="w-full h-full flex flex-col p-4 bg-slate-50 overflow-y-auto">
        {quizData && quizData.scoringSteps.length > 0 ? (
          <ScoringCardSection steps={quizData.scoringSteps} />
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">暂无规范踩分卡数据</div>
        )}
      </div>
    )
  }

  // 视角 2: 高考真题变式视角 (DOM 条件渲染)
  if (viewMode === 2) {
    return (
      <div className="w-full h-full flex flex-col p-4 bg-slate-50 overflow-y-auto">
        {quizData && quizData.variantQuizzes.length > 0 ? (
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">暂无高考真题变式数据</div>
        )}
      </div>
    )
  }

  // 视角 0: 有机逆合成历程演练 (AnimationSvgCanvas 840x650 全屏逆合成树布局 + 动态切断/护盾)
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-slate-900/5 select-none">
      {/* 画布核心区域 */}
      <div ref={containerRef} className="flex-1 w-full relative overflow-hidden">
        <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
          {/* 背景轻网格装饰 */}
          <defs>
            <pattern id="retroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="1" />
            </pattern>

            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="cutLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#EF4444" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <rect width={designWidth} height={designHeight} fill="url(#retroGrid)" />

          {/* 顶部场景标题与路线指示 */}
          <g transform={`translate(${designWidth / 2}, 42)`}>
            <text
              textAnchor="middle"
              fill="#0F172A"
              fontSize={font(18)}
              fontWeight="bold"
            >
              {currentModel.title}
            </text>
            <text
              textAnchor="middle"
              y={24}
              fill="#475569"
              fontSize={font(12)}
              fontWeight="medium"
            >
              {currentStep.title}
            </text>
          </g>

          {/* 逆合成连接线 / 动态 ✂ 切断 / 🛡 护盾 Protection 特效 */}
          {currentStep.connections.map((conn, idx) => {
            const fromNode = currentStep.nodes.find((n) => n.id === conn.from)
            const toNode = currentStep.nodes.find((n) => n.id === conn.to)
            if (!fromNode || !toNode) return null

            const midX = (fromNode.x + toNode.x) / 2
            const midY = (fromNode.y + toNode.y) / 2

            return (
              <g key={`conn-${idx}`}>
                {/* 正常连接线 */}
                {!conn.isDisconnection && !conn.isProtectionShield && (
                  <path
                    d={`M ${fromNode.x} ${fromNode.y + 40} Q ${midX} ${midY} ${toNode.x} ${toNode.y - 45}`}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />
                )}

                {/* 逆合成动态切断 ✂ 脉冲动画 */}
                {conn.isDisconnection && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    {/* 切断线红色流动脉冲 */}
                    <line
                      x1="-60"
                      y1="-30"
                      x2="60"
                      y2="30"
                      stroke="url(#cutLineGrad)"
                      strokeWidth="5"
                    />
                    <line
                      x1="-60"
                      y1="-30"
                      x2="60"
                      y2="30"
                      stroke="#EF4444"
                      strokeWidth="3.5"
                      strokeDasharray="6 4"
                    />
                    {/* 剪刀剪切动作与旋转粒子 */}
                    <g transform={`scale(${1 + Math.sin(animProgress * Math.PI * 2) * 0.15})`}>
                      <circle r="18" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={font(16)}
                        fill="#DC2626"
                      >
                        ✂
                      </text>
                    </g>
                    <rect
                      x="-65"
                      y="24"
                      width="130"
                      height="22"
                      rx="11"
                      fill="#FEF2F2"
                      stroke="#FCA5A5"
                      strokeWidth="1"
                    />
                    <text
                      y="35"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#B91C1C"
                      fontSize={font(11)}
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
                      d={`M ${fromNode.x - midX} ${fromNode.y - midY + 40} Q ${midX - 40} ${midY} ${toNode.x - midX} ${toNode.y - midY - 40}`}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3.5"
                      strokeDasharray="8 4"
                    />
                    <g transform={`scale(${1 + Math.cos(animProgress * Math.PI * 2) * 0.08})`}>
                      <rect
                        x="-70"
                        y="-16"
                        width="140"
                        height="32"
                        rx="16"
                        fill="#ECFDF5"
                        stroke="#10B981"
                        strokeWidth="2"
                        filter="drop-shadow(0 2px 8px rgba(16, 185, 129, 0.2))"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={font(12)}
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

          {/* 分子节点 (全屏 840x650 逆合成树布局 + 矢量苯环化学结构) */}
          {currentStep.nodes.map((node) => {
            const isProtected = node.isProtectedGroup
            const isTarget = node.isTarget

            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                {/* 动态 Protection 绿色光环 */}
                {isProtected && (
                  <rect
                    x="-105"
                    y="-60"
                    width="210"
                    height="120"
                    rx="20"
                    fill="url(#shieldGrad)"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeDasharray="6 3"
                    style={{
                      opacity: 0.8 + Math.sin(animProgress * Math.PI * 2) * 0.2,
                    }}
                  />
                )}

                {/* 主分子矢量卡片 */}
                <rect
                  x="-95"
                  y="-50"
                  width="190"
                  height="100"
                  rx="16"
                  fill={isTarget ? '#EFF6FF' : isProtected ? '#F0FDF4' : '#FFFFFF'}
                  stroke={isTarget ? '#2563EB' : isProtected ? '#059669' : '#94A3B8'}
                  strokeWidth={isTarget || isProtected ? '2.5' : '1.5'}
                  filter="drop-shadow(0 6px 12px rgba(15, 23, 42, 0.08))"
                />

                {/* 矢量化学苯环结构 */}
                {renderBenzeneRing(-60, 0, 22)}

                {/* 徽章 */}
                {node.badge && (
                  <g transform="translate(0, -50)">
                    <rect
                      x="-50"
                      y="-11"
                      width="100"
                      height="22"
                      rx="11"
                      fill={isProtected ? '#059669' : isTarget ? '#2563EB' : '#475569'}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#FFFFFF"
                      fontSize={font(11)}
                      fontWeight="bold"
                    >
                      {node.badge}
                    </text>
                  </g>
                )}

                {/* 分子名称与化学式 */}
                <text
                  x="18"
                  y="-10"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize={font(13)}
                  fontWeight="bold"
                >
                  {node.label}
                </text>
                <text
                  x="18"
                  y={16}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize={font(11)}
                  fontFamily="monospace"
                  fontWeight="semibold"
                >
                  {node.formula}
                </text>
              </g>
            )
          })}
        </AnimationSvgCanvas>
      </div>

      {/* 底部：专门为有机反应历程与逆合成设计的专属演播控制组件 (完全彻底去除滴定/mL/滴数) */}
      <div className="p-3.5 bg-white border-t border-slate-200 shrink-0 font-sans shadow-md flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              反应条件与试剂：
              <span className="text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 font-mono">
                {currentStep.reagents}
              </span>
            </span>
          </div>

          {/* 特征步骤快速跳转卡片 */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">历程快跳:</span>
            {currentModel.steps.map((st, idx) => (
              <button
                key={idx}
                onClick={() => onStepChange(idx)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  idx === currentStepIndex
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {idx + 1}. {st.fgiType.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 演播播放控制条 (无滴定元素) */}
        <div className="flex items-center justify-between gap-4 pt-0.5">
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-xs transition-all active:scale-95 ${
                isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? '暂停演播' : '自动演播'}
            </button>

            <button
              onClick={onResetStep}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="重置复位"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 ml-2 text-xs">
              <button
                disabled={currentStepIndex === 0}
                onClick={() => onStepChange(currentStepIndex - 1)}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-slate-700 text-xs px-2 font-mono">
                {currentStepIndex + 1} / {totalSteps} 步
              </span>
              <button
                disabled={currentStepIndex === totalSteps - 1}
                onClick={() => onStepChange(currentStepIndex + 1)}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 演播速度 Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">速度:</span>
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
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
