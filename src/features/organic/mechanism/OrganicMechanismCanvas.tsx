import { useState, useMemo } from 'react'
import { Sparkles, BookOpen, ArrowLeft, Eye, FileCheck, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ThreePanel, AnimationSvgCanvas } from '@/components/Layout'
import { LeftPanel, ControlPanel, ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { useAnimationViewport } from '@/hooks/useAnimationViewport'
import { CANVAS_PRESETS } from '@/theme'
import type { ControlMeta } from '@/data/types'
import { getModelQuizData } from '@/data/gaokaoQuizData'
import { getKnowledgeNode } from '@/data/knowledgeTree'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { MECHANISM_DETAILS } from './constants'
import type { OrganicMechanismCanvasProps } from './types'
import { scenes } from './scenes'

const ORGANIC_MECHANISM_CONTROLS: ControlMeta[] = [
  {
    type: 'segmented',
    key: 'viewMode',
    label: '中屏视角模式切换',
    group: '高考视角导航',
    options: [
      { label: '动画场景', value: 0 },
      { label: '规范踩分', value: 1 },
      { label: '真题变式', value: 2 },
    ],
  },
  {
    type: 'modeGrid',
    key: 'mechanism',
    label: '高考 6 大反应机制选择',
    group: '高考核心机制',
    cols: 1,
    showIf: 'viewMode',
    showIfValue: 0,
    modes: [
      { value: 0, label: '酯化与水解', description: '酸脱羟基 -OH 醇脱氢 -H (18O 示踪)' },
      { value: 1, label: '烯烃加成与马氏规则', description: 'π 键打开，H 加在 H 多的碳上' },
      { value: 2, label: '醇催化氧化', description: 'α-C 上需有 H，叔醇无法氧化' },
      { value: 3, label: '消去与取代', description: '扎伊采夫规则，脱 HX/H2O 生成双键' },
      { value: 4, label: '肽键生成与水解', description: '脱水形成 -CO-NH-，水解切断 C-N 键' },
      { value: 5, label: '酚醛缩聚与取代', description: '酚羟基活化邻对位 C-H 键' },
    ],
  },
  {
    type: 'segmented',
    key: 'stage',
    label: '反应历程演练',
    group: '反应历程控制',
    showIf: 'viewMode',
    showIfValue: 0,
    options: [
      { label: '1.反应物', value: 0 },
      { label: '2.断键过渡', value: 1 },
      { label: '3.生成产物', value: 2 },
    ],
  },
  {
    type: 'toggle',
    key: 'show18O',
    label: '¹⁸O 同位素示踪高亮',
    group: '示踪与反例',
    trueValue: 1,
    falseValue: 0,
    showIf: 'mechanism',
    showIfValue: 0,
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
]

export function OrganicMechanismCanvas({}: OrganicMechanismCanvasProps) {
  const navigate = useNavigate()

  const [params, setParamsState] = useState<Record<string, number>>({
    viewMode: 0,
    mechanism: 0,
    stage: 1,
    show18O: 1,
    useTertiary: 0,
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
  const model = getGaokaoModel('model-organic-mechanism')
  const quizData = getModelQuizData('model-organic-mechanism')

  const visibleControls = useMemo(() => {
    return ORGANIC_MECHANISM_CONTROLS.filter((ctrl) => {
      if ('key' in ctrl && ctrl.key === 'viewMode') return true
      if (params.viewMode !== 0) return false
      return true
    })
  }, [params.viewMode])

  const renderMechanismSvgScene = () => {
    const SceneComponent = scenes[params.mechanism]
    if (!SceneComponent) return null

    return (
      <SceneComponent
        reactionStage={params.stage}
        font={font}
        show18OTracing={params.show18O === 1}
        useTertiaryAlcohol={params.useTertiary === 1}
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
    </LeftPanel>
  )

  const centerContent = (
    <div ref={containerRef} className="w-full h-full flex flex-col p-4 overflow-y-auto">
      {params.viewMode === 0 && (
        <div key="view-scene" className="w-full flex-1 flex flex-col min-h-[520px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-600" />
              微观官能团断键与成键场景 (2D SVG)
            </span>
            <span className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md font-mono font-bold border border-indigo-100">
              {currentMeta.cleavageFormula}
            </span>
          </div>

          <div className="w-full flex-1 min-h-[440px]">
            <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
              {renderMechanismSvgScene()}
            </AnimationSvgCanvas>
          </div>
        </div>
      )}

      {params.viewMode === 1 && quizData && (
        <div key="view-scoring" className="w-full min-h-[500px] flex flex-col gap-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              高考规范答题踩分点与方程式手算推导
            </h3>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-medium border border-emerald-200">
              全套 6 大反应机制规范踩分
            </span>
          </div>
          <ScoringCardSection steps={quizData.scoringSteps} />
        </div>
      )}

      {params.viewMode === 2 && quizData && (
        <div key="view-quiz" className="w-full min-h-[500px] flex flex-col gap-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              高考真题变式选择题 & 详细解析 (近几年高考权威试题)
            </h3>
            <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md font-medium border border-amber-200">
              包含 6 大机制对应的近几年高考真题
            </span>
          </div>
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        </div>
      )}
    </div>
  )

  const rightContent = (
    <div className="flex flex-col gap-3 p-4 min-h-full overflow-y-auto">
      <div className="p-3 bg-white rounded-xl border border-neutral-200 flex flex-col gap-2 shadow-2xs">
        <h4 className="font-bold text-neutral-800 text-xs flex items-center gap-1.5 pb-1 border-b border-neutral-100">
          <Sparkles className="w-4 h-4 text-amber-500" />
          断键口诀与高考考点提炼
        </h4>
        <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed font-medium">
          {currentMeta.ruleTip}
        </div>
      </div>

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
    <div className="w-full h-screen flex flex-col font-sans text-neutral-900 bg-neutral-100 overflow-hidden">
      <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-3 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            返回高考母题索引
          </button>
          <div className="h-4 w-px bg-neutral-700 mx-1" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{model?.title}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${model?.badgeColor}`}>
                {model?.badgeText}
              </span>
            </div>
            <span className="text-[11px] text-neutral-400">{model?.subtitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            标准 ThreePanel + ControlPanel + AnimationSvgCanvas
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ThreePanel left={leftContent} center={centerContent} right={rightContent} />
      </div>
    </div>
  )
}
