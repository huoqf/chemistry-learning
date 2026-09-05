import { useState } from 'react'
import { Eye, FileCheck, HelpCircle, GitCompare, Compass, BookOpen } from 'lucide-react'
import { ThreePanel, AnimationSvgCanvas } from '@/components/Layout'
import {
  LeftPanel,
  LeftPanelSection,
  ControlPanel,
  ChemistryPanel,
  ScoringCardSection,
  GaokaoVariantQuiz,
  GaokaoToolHeader,
} from '@/components/UI'
import { useAnimationViewport } from '@/hooks/useAnimationViewport'
import { CANVAS_PRESETS } from '@/theme'
import type { ControlMeta } from '@/data/types'
import { getModelQuizData } from '@/data/gaokaoQuizData'
import { getKnowledgeNode } from '@/data/knowledgeTree'
import { getGaokaoModel } from '@/data/gaokaoModels'
import {
  MECHANISM_DETAILS,
  CONTRAST_MATRICES,
  GAOKAO_ADVANCED_TIPS,
  MECHANISM_TEACHING_GUIDES,
  getMechanismQuantities,
  getMechanismFormulas,
  getMechanismWarnings,
  getMechanismGaokaoPoints,
  getMechanismMnemonic,
} from './constants'
import { scenes } from './scenes'

const ORGANIC_MECHANISM_CONTROLS: ControlMeta[] = [
  {
    type: 'modeGrid',
    key: 'mechanism',
    label: '高考 6 大反应机制选择',
    group: '高考核心机制',
    cols: 1,
    modes: [
      { value: 0, label: '烯烃加成与马氏规则', description: '' },
      { value: 1, label: '卤代烃消去与取代', description: '' },
      { value: 2, label: '醇的催化氧化机制', description: '' },
      { value: 3, label: '酯化与酯的水解机制', description: '' },
      { value: 4, label: '酚羟基邻对位活化机制', description: '' },
      { value: 5, label: '肽键生成与水解机制', description: '' },
    ],
  },
  {
    type: 'segmented',
    key: 'stage',
    label: '反应历程演练',
    group: '反应历程控制',
    options: [
      { label: '反应物始态', value: 0 },
      { label: '断键过渡态', value: 1 },
      { label: '生成物稳态', value: 2 },
    ],
  },
  {
    type: 'segmented',
    key: 'solventMode',
    label: '溶剂条件与反应竞争',
    group: '反应条件与竞争',
    options: [
      { label: '醇溶液 (消去成烯)', value: 0 },
      { label: '水溶液 (取代成醇)', value: 1 },
    ],
    showIf: 'mechanism',
    showIfValue: 1,
  },
  {
    type: 'toggle',
    key: 'useTertiary',
    label: '叔丁醇 (无 α-H 反例)',
    group: '示踪与反例',
    trueValue: 1,
    falseValue: 0,
    showIf: 'mechanism',
    showIfValue: 2,
  },
  {
    type: 'toggle',
    key: 'show18O',
    label: '¹⁸O 同位素示踪高亮',
    group: '示踪与反例',
    trueValue: 1,
    falseValue: 0,
    showIf: 'mechanism',
    showIfValue: 3,
  },
]

export function OrganicMechanismCanvas() {
  const [params, setParamsState] = useState<Record<string, number>>({
    viewMode: 0,
    mechanism: 0,
    stage: 1,
    show18O: 1,
    useTertiary: 0,
    solventMode: 0,
  })

  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,
  })

  const font = canvasSize?.font || ((n: number) => n)

  const updateParam = (key: string, value: number) => {
    setParamsState((prev) => ({ ...prev, [key]: value }))
  }

  const setParams = (newParams: Record<string, number>) => {
    setParamsState(newParams)
  }

  const currentMeta = MECHANISM_DETAILS[params.mechanism] || MECHANISM_DETAILS[0]
  const currentGuide = MECHANISM_TEACHING_GUIDES[params.mechanism] || MECHANISM_TEACHING_GUIDES[0]
  const model = getGaokaoModel('model-organic-mechanism')
  const quizData = getModelQuizData('model-organic-mechanism')

  const visibleControls = ORGANIC_MECHANISM_CONTROLS

  // 右侧面板规范数据生成 (随 params 全生命周期实时动态同步)
  const quantities = getMechanismQuantities(
    params.mechanism,
    params.stage,
    params.show18O,
    params.useTertiary,
    params.solventMode ?? 0
  )
  const formulas = getMechanismFormulas(
    params.mechanism,
    params.stage,
    params.show18O,
    params.useTertiary,
    params.solventMode ?? 0
  )
  const warnings = getMechanismWarnings(
    params.mechanism,
    params.stage,
    params.show18O,
    params.useTertiary,
    params.solventMode ?? 0
  )
  const gaokaoPoints = getMechanismGaokaoPoints(params.mechanism)
  const mnemonic = getMechanismMnemonic(params.mechanism)

  const renderMechanismSvgScene = () => {
    const SceneComponent = scenes[params.mechanism]
    if (!SceneComponent) return null

    return (
      <SceneComponent
        reactionStage={params.stage}
        font={font}
        show18OTracing={params.show18O === 1}
        useTertiaryAlcohol={params.useTertiary === 1}
        solventMode={params.solventMode ?? 0}
      />
    )
  }

  const leftContent = (
    <LeftPanel>
      <ControlPanel
        controls={visibleControls}
        params={params}
        updateParam={updateParam}
        setParams={setParams}
        resetAnimation={() => {}}
        restartAnimation={() => {}}
      />
      <LeftPanelSection title="高考实验条件与设问指引">
        <div className="flex flex-col gap-2 text-xs">
          <div>
            <span className="font-bold text-slate-700">【实验条件】：</span>
            <span className="text-slate-600">{currentGuide.condition}</span>
          </div>
          <div>
            <span className="font-bold text-amber-700">【核心设问】：</span>
            <span className="text-amber-900 font-medium">{currentGuide.coreQuestion}</span>
          </div>
          <div>
            <span className="font-bold text-indigo-700">【观察指引】：</span>
            <span className="text-indigo-800">{currentGuide.observationGuide}</span>
          </div>
        </div>
      </LeftPanelSection>
    </LeftPanel>
  )

  const STAGE_STEPS = [
    { stage: 0, label: '反应物始态' },
    { stage: 1, label: '断键过渡态' },
    { stage: 2, label: '生成物稳态' },
  ]

  const currentFormulaBadge =
    params.mechanism === 1 && params.solventMode === 1
      ? 'CH₃CH₂CHBrCH₃ + NaOH → CH₃CH₂CH(OH)CH₃ + NaBr (水溶液, 取代)'
      : currentMeta.cleavageFormula

  const centerContent = (
    <div className="w-full h-full flex flex-col p-3.5 min-h-0 overflow-hidden">
      {params.viewMode === 0 && (
        <div key="view-scene" className="w-full h-full flex flex-col min-h-0">
          {/* 中屏优雅状态与历程指示栏 */}
          <div className="flex items-center justify-between pb-2.5 mb-1.5 border-b border-neutral-200/80 shrink-0 gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 whitespace-nowrap">
                <Eye className="w-4 h-4 text-indigo-600 shrink-0" />
                {currentMeta.name}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-200/80 text-neutral-700 font-medium whitespace-nowrap">
                {currentMeta.subtitle}
              </span>
            </div>

            {/* 历程阶段快捷胶囊指示 (防折行，学术纯粹) */}
            <div className="flex items-center gap-1 bg-neutral-200/60 p-0.5 rounded-lg shrink-0">
              {STAGE_STEPS.map((step) => {
                const isActive = params.stage === step.stage
                return (
                  <button
                    key={step.stage}
                    type="button"
                    onClick={() => updateParam('stage', step.stage)}
                    className={`px-3 py-1 text-xs rounded-md whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {step.label}
                  </button>
                )
              })}
            </div>

            {/* 右侧微观方程式与特征 */}
            <span className="text-xs text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded-md font-mono font-bold border border-indigo-100 shrink-0 truncate">
              {currentFormulaBadge}
            </span>
          </div>

          {/* SVG 纯净视口画布容器 */}
          <div ref={containerRef} className="relative w-full flex-1 min-h-[460px] overflow-hidden rounded-xl border border-neutral-200/60 shadow-2xs">
            <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
              {renderMechanismSvgScene()}
            </AnimationSvgCanvas>
          </div>
        </div>
      )}

      {params.viewMode === 1 && quizData && (
        <div key="view-scoring" className="w-full h-full flex flex-col gap-3 overflow-y-auto p-1">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              高考规范答题踩分点与方程式手算推导
            </h3>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-medium border border-emerald-200">
              全套 8 大反应机制规范踩分
            </span>
          </div>
          <ScoringCardSection steps={quizData.scoringSteps} />
        </div>
      )}

      {params.viewMode === 2 && quizData && (
        <div key="view-quiz" className="w-full h-full flex flex-col gap-3 overflow-y-auto p-1">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              高考真题变式选择题 & 详细解析 (近几年高考权威试题)
            </h3>
            <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md font-medium border border-amber-200">
              包含 8 大机制对应的近几年高考真题
            </span>
          </div>
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        </div>
      )}
    </div>
  )

  const rightContent = (
    <div className="flex flex-col gap-3 p-3 min-h-full overflow-y-auto">
      {/* 规范 ChemistryPanel：集成化学量看板、随 stage 联动的动态公式、考点与警示 */}
      <ChemistryPanel
        quantities={quantities}
        formulas={formulas}
        warnings={warnings}
        gaokaoPoints={gaokaoPoints}
        mnemonic={mnemonic}
        scrollable={false}
      />

      {/* 易混反应双向对比矩阵 */}
      <div className="p-3.5 bg-white rounded-xl border border-neutral-200/80 flex flex-col gap-2.5 shadow-2xs">
        <h4 className="font-bold text-neutral-800 text-sm flex items-center gap-1.5 pb-1.5 border-b border-neutral-100 whitespace-nowrap">
          <GitCompare className="w-4 h-4 text-emerald-600 shrink-0" />
          高考易混反应对比矩阵 (4组对照)
        </h4>
        <div className="flex flex-col gap-2.5">
          {CONTRAST_MATRICES.map((matrix, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/40 border border-emerald-100/90 flex flex-col gap-1.5">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                {matrix.title}
              </span>
              <div className="text-xs text-neutral-800 flex flex-col gap-1 font-mono">
                <div className="p-1.5 rounded bg-white/80 border border-emerald-100/60 text-emerald-900 leading-relaxed">
                  {matrix.reactionA}
                </div>
                <div className="p-1.5 rounded bg-white/80 border border-teal-100/60 text-teal-900 leading-relaxed">
                  {matrix.reactionB}
                </div>
              </div>
              <div className="text-xs text-emerald-900 font-medium bg-emerald-100/80 px-2 py-1 rounded-md leading-relaxed">
                💡 <span className="font-semibold text-emerald-950">速记口诀：</span>{matrix.memoryTip}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 新高考提分通法 */}
      <div className="p-3.5 bg-white rounded-xl border border-neutral-200/80 flex flex-col gap-2.5 shadow-2xs">
        <h4 className="font-bold text-neutral-800 text-sm flex items-center gap-1.5 pb-1.5 border-b border-neutral-100 whitespace-nowrap">
          <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
          新高考压轴题型破译通法
        </h4>
        <div className="flex flex-col gap-2.5">
          {GAOKAO_ADVANCED_TIPS.map((tip, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-indigo-50/40 border border-indigo-100 flex flex-col gap-2">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <span className="w-1.5 h-3.5 rounded-full bg-indigo-600 shrink-0" />
                {tip.title}
              </span>
              <div className="flex flex-col gap-1.5">
                {tip.points.map((pt, pIdx) => (
                  <div key={pIdx} className="text-xs text-indigo-950/90 leading-relaxed p-1.5 rounded bg-white/80 border border-indigo-100/50">
                    {pt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 关联教材 */}
      {model && (
        <div className="p-3 bg-white rounded-xl border border-neutral-200 flex flex-col gap-2 shadow-2xs">
          <h4 className="font-bold text-neutral-800 text-xs flex items-center gap-1.5 border-b border-neutral-100 pb-1">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            关联教材知识节点 ({model.relatedKnowledgeIds.length})
          </h4>
          <div className="flex flex-col gap-1.5">
            {model.relatedKnowledgeIds.map((kid) => {
              const knode = getKnowledgeNode(kid)
              return (
                <div
                  key={kid}
                  className="p-2 rounded bg-indigo-50/50 border border-indigo-100 text-xs flex items-center justify-between text-indigo-900"
                >
                  <span className="font-medium">{knode ? knode.title : kid}</span>
                  <span className="text-[10px] text-indigo-600 font-mono">
                    {knode ? knode.module : '教材节点'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="w-full h-full flex flex-col font-sans text-neutral-900 bg-neutral-100 overflow-hidden">
      {/* 统一 Header */}
      <GaokaoToolHeader
        modelId="model-organic-mechanism"
        viewMode={params.viewMode}
        onViewModeChange={(m) => setParamsState((prev) => ({ ...prev, viewMode: m }))}
      />

      <div className="flex-1 overflow-hidden">
        <ThreePanel left={leftContent} center={centerContent} right={rightContent} />
      </div>
    </div>
  )
}
