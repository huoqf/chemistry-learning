import { useState, useMemo } from 'react'
import { Sparkles, BookOpen, ArrowLeft, Eye, FileCheck, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ThreePanel, AnimationSvgCanvas } from '@/components/Layout'
import { LeftPanel, ControlPanel, ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { useAnimationViewport } from '@/hooks/useAnimationViewport'
import { CHEMISTRY_COLORS, FONT, colors, withAlpha, CANVAS_PRESETS } from '@/theme'
import type { ControlMeta } from '@/data/types'
import { getModelQuizData } from '@/data/gaokaoQuizData'
import { getKnowledgeNode } from '@/data/knowledgeTree'
import { getGaokaoModel } from '@/data/gaokaoModels'

export type ReactionMechanismType =
  | 'esterification'
  | 'addition'
  | 'oxidation'
  | 'elimination'
  | 'peptide'
  | 'phenol'

export interface OrganicMechanismCanvasProps {}

const ATOM_COLORS = {
  carbon: '#334155',
  hydrogen: '#E2E8F0',
  oxygen: '#EF4444',
  nitrogen: '#3B82F6',
  chlorine: '#10B981',
}

const BOND_COLORS = {
  single: '#94A3B8',
  double: '#64748B',
  cleaved: '#EF4444',
  formed: '#10B981',
}

const REACTION_COLORS = {
  cleavage: '#EF4444',
  formation: '#10B981',
}

const MECHANISM_DETAILS: Record<
  number,
  {
    id: ReactionMechanismType
    name: string
    subtitle: string
    cleavageFormula: string
    ruleTip: string
    is18OSSupported?: boolean
    hasSubstrateVariant?: boolean
  }
> = {
  0: {
    id: 'esterification',
    name: '1. 酯化与酯的水解机制',
    subtitle: '酸脱羟基 (-OH) 醇脱氢 (-H)',
    cleavageFormula: 'CH₃COOH + CH₃CH₂¹⁸OH ⇌ CH₃CO¹⁸OCH₂CH₃ + H₂O',
    ruleTip: '【18O 示踪法则】：乙酸提供 -OH，乙醇提供 -¹⁸OH；水中的 O 来自羧酸，酯中的 ¹⁸O 来自醇。水解时 C-O 单键断裂。',
    is18OSSupported: true,
  },
  1: {
    id: 'addition',
    name: '2. 烯烃加成与加聚机制',
    subtitle: 'π 键断裂与马氏规则',
    cleavageFormula: 'CH₃-CH=CH₂ + HCl → CH₃-CHCl-CH₃ (主产物)',
    ruleTip: '【马氏规则】：不对称烯烃加成时，H 优先加到含 H 较多的不饱和碳上 (1号碳)，Cl 加到 2号碳上。',
    hasSubstrateVariant: true,
  },
  2: {
    id: 'oxidation',
    name: '3. 醇的催化氧化机制',
    subtitle: 'α-H 条件与脱氢氧化',
    cleavageFormula: '2CH₃CH₂OH + O₂ → 2CH₃CHO + 2H₂O (Cu, Δ)',
    ruleTip: '【α-H 必需条件】：断裂 O-H 键与 α-C 上的 C-H 键。伯醇氧化为醛，仲醇氧化为酮，叔醇无 α-H 无法被催化氧化！',
    hasSubstrateVariant: true,
  },
  3: {
    id: 'elimination',
    name: '4. 卤代烃/醇的消去机制',
    subtitle: 'C-X/C-OH 键与 β-H 断裂',
    cleavageFormula: 'CH₃CH₂Br + NaOH → CH₂=CH₂↑ + NaBr + H₂O (醇溶液, Δ)',
    ruleTip: '【扎伊采夫规则】：消去反应断裂 C-Br 键及 β-C 上的 C-H 键，生成双键；氢优先从含氢较少的 β-C 上脱去。',
  },
  4: {
    id: 'peptide',
    name: '5. 肽键生成与水解机制',
    subtitle: 'C-N 键形成与切断水解',
    cleavageFormula: 'H₂N-CH₂-COOH + H₂N-CH(CH₃)-COOH ⇌ 二肽 + H₂O',
    ruleTip: '【肽键断裂】：羧基与氨基脱水生成 -CO-NH- (肽键)；水解时在 -CO-NH- 中的 C-N 单键处切断。',
  },
  5: {
    id: 'phenol',
    name: '6. 酚醛缩聚与邻对位取代',
    subtitle: '酚羟基邻对位活化断 C-H',
    cleavageFormula: 'n 苯酚 + n HCHO → 酚醛树脂 + n H₂O',
    ruleTip: '【酚羟基活化】：-OH 增强苯环邻、对位 C-H 键的活性，与 HCHO 加成缩聚，或与浓溴水发生三取代沉淀。',
  },
}

// 声明式 ControlMeta 配置 (驱动 LeftPanel 下的 ControlPanel)
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

  // 声明式参数 State
  const [params, setParamsState] = useState<Record<string, number>>({
    viewMode: 0, // 0: 动画场景, 1: 规范踩分, 2: 真题变式
    mechanism: 0, // 0~5
    stage: 1, // 0: 反应物, 1: 断键过渡, 2: 生成产物
    show18O: 1,
    useTertiary: 0,
  })

  // 铁律 2：新页面布局唯一路径与 Viewport 管理
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,
  })

  // 缩放函数 (所有 SVG 字体与矢量必须由 font() 包裹)
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

  // 动态计算在当前视角模式下显示的控制选项 (当 viewMode !== 0 时，隐去机制选择与历程演练)
  const visibleControls = useMemo(() => {
    return ORGANIC_MECHANISM_CONTROLS.filter((ctrl) => {
      if ('key' in ctrl && ctrl.key === 'viewMode') return true
      if (params.viewMode !== 0) return false
      return true
    })
  }, [params.viewMode])

  // 渲染 SVG 2D 断键机制 (严格遵循 840x650 Viewport)
  const renderMechanismSvgScene = () => {
    const reactionStage = params.stage
    const show18OTracing = params.show18O === 1
    const useTertiaryAlcohol = params.useTertiary === 1

    switch (params.mechanism) {
      case 0: // 1. 酯化与水解机制
        return (
          <g>
            {/* 反应物标题 */}
            <text
              x={220}
              y={55}
              textAnchor="middle"
              fill={colors.neutral[800]}
              fontSize={font(FONT.title)}
              fontWeight="bold"
            >
              乙酸 (CH₃COOH)
            </text>
            <text
              x={620}
              y={55}
              textAnchor="middle"
              fill={colors.neutral[800]}
              fontSize={font(FONT.title)}
              fontWeight="bold"
            >
              ¹⁸O-乙醇 (CH₃CH₂¹⁸OH)
            </text>

            {/* 反应物 1: 乙酸 (CH3-C(=O)-OH) */}
            <g transform="translate(110, 130)">
              {/* CH3 */}
              <circle cx={40} cy={60} r={24} fill={ATOM_COLORS.carbon} />
              <text
                x={40}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                CH₃
              </text>
              <line
                x1={64}
                y1={60}
                x2={106}
                y2={60}
                stroke={colors.neutral[400]}
                strokeWidth={3}
              />
              {/* 羰基 C */}
              <circle cx={130} cy={60} r={24} fill={ATOM_COLORS.carbon} />
              <text
                x={130}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                C
              </text>
              {/* C=O 双键 */}
              <line
                x1={130}
                y1={36}
                x2={130}
                y2={4}
                stroke={ATOM_COLORS.oxygen}
                strokeWidth={4}
              />
              <circle cx={130} cy={-8} r={20} fill={ATOM_COLORS.oxygen} />
              <text
                x={130}
                y={-3}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.axis)}
                fontWeight="bold"
              >
                O
              </text>
              {/* C-OH 键与羟基 OH */}
              <line
                x1={154}
                y1={60}
                x2={196}
                y2={60}
                stroke={
                  reactionStage >= 1
                    ? BOND_COLORS.cleaved
                    : colors.neutral[400]
                }
                strokeWidth={3}
                strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
              />
              <g transform={reactionStage === 2 ? 'translate(80, 150)' : ''}>
                <circle cx={220} cy={60} r={22} fill={ATOM_COLORS.oxygen} />
                <text
                  x={220}
                  y={65}
                  textAnchor="middle"
                  fill="#FFF"
                  fontSize={font(FONT.label)}
                  fontWeight="bold"
                >
                  OH
                </text>
              </g>

              {/* 断键高亮 (酸脱羟基 -OH) */}
              {reactionStage === 1 && (
                <g>
                  <rect
                    x={170}
                    y={28}
                    width={75}
                    height={64}
                    rx={8}
                    fill={withAlpha(REACTION_COLORS.cleavage, 0.15)}
                    stroke={REACTION_COLORS.cleavage}
                    strokeWidth={2}
                    strokeDasharray="4,3"
                  />
                  <text
                    x={207}
                    y={20}
                    textAnchor="middle"
                    fill={REACTION_COLORS.cleavage}
                    fontSize={font(FONT.annotation)}
                    fontWeight="bold"
                  >
                    ✂ 酸脱 -OH
                  </text>
                </g>
              )}
            </g>

            {/* 反应物 2: 乙醇 (H-¹⁸O-CH2CH3) */}
            <g transform="translate(500, 130)">
              {/* H */}
              <g transform={reactionStage === 2 ? 'translate(-200, 150)' : ''}>
                <circle cx={20} cy={60} r={18} fill={ATOM_COLORS.hydrogen} />
                <text
                  x={20}
                  y={65}
                  textAnchor="middle"
                  fill="#333"
                  fontSize={font(FONT.axis)}
                  fontWeight="bold"
                >
                  H
                </text>
              </g>

              {/* H-O 键 */}
              <line
                x1={38}
                y1={60}
                x2={68}
                y2={60}
                stroke={
                  reactionStage >= 1
                    ? BOND_COLORS.cleaved
                    : colors.neutral[400]
                }
                strokeWidth={3}
                strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
              />

              {/* ¹⁸O 原子 */}
              <circle
                cx={92}
                cy={60}
                r={24}
                fill={show18OTracing ? '#EC4899' : ATOM_COLORS.oxygen}
                stroke={show18OTracing ? '#BE185D' : undefined}
                strokeWidth={show18OTracing ? 2.5 : 0}
              />
              <text
                x={92}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.axis)}
                fontWeight="bold"
              >
                {show18OTracing ? '¹⁸O' : 'O'}
              </text>

              {/* O-CH2 键 */}
              <line
                x1={116}
                y1={60}
                x2={148}
                y2={60}
                stroke={colors.neutral[400]}
                strokeWidth={3}
              />
              {/* CH2CH3 */}
              <circle cx={172} cy={60} r={24} fill={ATOM_COLORS.carbon} />
              <text
                x={172}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.small)}
                fontWeight="bold"
              >
                CH₂CH₃
              </text>

              {/* 断键高亮 (醇脱氢 -H) */}
              {reactionStage === 1 && (
                <g>
                  <rect
                    x={8}
                    y={28}
                    width={50}
                    height={64}
                    rx={8}
                    fill={withAlpha(REACTION_COLORS.cleavage, 0.15)}
                    stroke={REACTION_COLORS.cleavage}
                    strokeWidth={2}
                    strokeDasharray="4,3"
                  />
                  <text
                    x={33}
                    y={20}
                    textAnchor="middle"
                    fill={REACTION_COLORS.cleavage}
                    fontSize={font(FONT.annotation)}
                    fontWeight="bold"
                  >
                    ✂ 醇脱 -H
                  </text>
                </g>
              )}
            </g>

            {/* 中央反应箭头 */}
            <g transform="translate(420, 290)">
              <line
                x1={-40}
                y1={0}
                x2={40}
                y2={0}
                stroke={CHEMISTRY_COLORS.concentration}
                strokeWidth={3}
              />
              <polygon
                points="40,-6 54,0 40,6"
                fill={CHEMISTRY_COLORS.concentration}
              />
              <text
                x={0}
                y={-14}
                textAnchor="middle"
                fill={colors.neutral[600]}
                fontSize={font(FONT.annotation)}
              >
                浓 H₂SO₄, Δ (可逆反应)
              </text>
            </g>

            {/* 阶段 2: 产物分子 (乙酸乙酯 + 水) */}
            {reactionStage === 2 && (
              <g transform="translate(200, 360)">
                <rect
                  x={0}
                  y={0}
                  width={440}
                  height={80}
                  rx={12}
                  fill={withAlpha(CHEMISTRY_COLORS.pH, 0.08)}
                  stroke={CHEMISTRY_COLORS.pH}
                  strokeWidth={1.5}
                />
                <text
                  x={220}
                  y={32}
                  textAnchor="middle"
                  fill={colors.neutral[900]}
                  fontSize={font(FONT.title)}
                  fontWeight="bold"
                >
                  生成物：CH₃CO
                  <tspan fill={show18OTracing ? '#BE185D' : undefined}>
                    {show18OTracing ? '¹⁸O' : 'O'}
                  </tspan>
                  CH₂CH₃ + H₂O
                </text>
                <text
                  x={220}
                  y={58}
                  textAnchor="middle"
                  fill={CHEMISTRY_COLORS.pH}
                  fontSize={font(FONT.axis)}
                >
                  ✓ 成功形成乙酸乙酯 (含 ¹⁸O) 与水分子 (酸脱 -OH + 醇脱 -H，水不含 ¹⁸O)
                </text>
              </g>
            )}
          </g>
        )

      case 1: // 2. 烯烃加成与马氏规则
        return (
          <g>
            <text
              x={420}
              y={55}
              textAnchor="middle"
              fill={colors.neutral[800]}
              fontSize={font(FONT.title)}
              fontWeight="bold"
            >
              丙烯 (CH₃-CH=CH₂) + HCl 亲电加成 (马氏规则)
            </text>

            <g transform="translate(170, 150)">
              {/* CH3 */}
              <circle cx={40} cy={60} r={24} fill={ATOM_COLORS.carbon} />
              <text
                x={40}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                CH₃
              </text>
              <line
                x1={64}
                y1={60}
                x2={106}
                y2={60}
                stroke={colors.neutral[400]}
                strokeWidth={3}
              />

              {/* 2号碳 (CH) */}
              <circle cx={130} cy={60} r={24} fill={ATOM_COLORS.carbon} />
              <text
                x={130}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                CH
              </text>
              <text
                x={130}
                y={25}
                textAnchor="middle"
                fill={colors.neutral[500]}
                fontSize={font(FONT.annotation)}
              >
                2号碳 (H少)
              </text>

              {/* C=C 双键 */}
              <line
                x1={154}
                y1={54}
                x2={216}
                y2={54}
                stroke={colors.neutral[500]}
                strokeWidth={3}
              />
              <line
                x1={154}
                y1={66}
                x2={216}
                y2={66}
                stroke={
                  reactionStage >= 1
                    ? BOND_COLORS.cleaved
                    : colors.neutral[500]
                }
                strokeWidth={3}
                strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
              />

              {/* 1号碳 (CH2) */}
              <circle cx={240} cy={60} r={24} fill={ATOM_COLORS.carbon} />
              <text
                x={240}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                CH₂
              </text>
              <text
                x={240}
                y={25}
                textAnchor="middle"
                fill={CHEMISTRY_COLORS.concentration}
                fontSize={font(FONT.annotation)}
                fontWeight="bold"
              >
                1号碳 (H多)
              </text>

              {reactionStage === 1 && (
                <g>
                  <line
                    x1={185}
                    y1={72}
                    x2={185}
                    y2={115}
                    stroke={REACTION_COLORS.cleavage}
                    strokeWidth={2}
                    strokeDasharray="3,3"
                  />
                  <text
                    x={185}
                    y={132}
                    textAnchor="middle"
                    fill={REACTION_COLORS.cleavage}
                    fontSize={font(FONT.annotation)}
                    fontWeight="bold"
                  >
                    ✂ π 键打开
                  </text>
                </g>
              )}
            </g>

            {/* HCl 分子 */}
            <g transform="translate(550, 150)">
              <circle cx={40} cy={60} r={20} fill={ATOM_COLORS.hydrogen} />
              <text
                x={40}
                y={65}
                textAnchor="middle"
                fill="#333"
                fontSize={font(FONT.axis)}
                fontWeight="bold"
              >
                H
              </text>
              <line
                x1={60}
                y1={60}
                x2={88}
                y2={60}
                stroke={
                  reactionStage >= 1
                    ? BOND_COLORS.cleaved
                    : colors.neutral[400]
                }
                strokeWidth={3}
                strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
              />
              <circle cx={112} cy={60} r={24} fill="#10B981" />
              <text
                x={112}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                Cl
              </text>
            </g>

            {/* 产物展示 */}
            {reactionStage === 2 && (
              <g transform="translate(200, 340)">
                <rect
                  x={0}
                  y={0}
                  width={440}
                  height={85}
                  rx={12}
                  fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.08)}
                  stroke={CHEMISTRY_COLORS.concentration}
                  strokeWidth={1.5}
                />
                <text
                  x={220}
                  y={32}
                  textAnchor="middle"
                  fill={colors.neutral[900]}
                  fontSize={font(FONT.title)}
                  fontWeight="bold"
                >
                  主产物：2-氯丙烷 (CH₃-CH
                  <tspan fill="#10B981">Cl</tspan>-CH₃)
                </text>
                <text
                  x={220}
                  y={60}
                  textAnchor="middle"
                  fill={CHEMISTRY_COLORS.concentration}
                  fontSize={font(FONT.axis)}
                >
                  ✓ 马氏规则：氢原子优先加到含氢较多的 1号碳 (-CH₃)，氯原子加到 2号碳
                </text>
              </g>
            )}
          </g>
        )

      case 2: // 3. 醇的催化氧化
        return (
          <g>
            <text
              x={420}
              y={50}
              textAnchor="middle"
              fill={colors.neutral[800]}
              fontSize={font(FONT.title)}
              fontWeight="bold"
            >
              {useTertiaryAlcohol
                ? '叔丁醇 (无 α-H) 无法发生催化氧化反例'
                : '乙醇 (含 α-H) 催化氧化生成乙醛'}
            </text>

            <g transform="translate(270, 130)">
              {/* α-C */}
              <circle
                cx={150}
                cy={80}
                r={26}
                fill={
                  useTertiaryAlcohol
                    ? colors.neutral[600]
                    : ATOM_COLORS.carbon
                }
              />
              <text
                x={150}
                y={85}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                α-C
              </text>

              {/* 上方 -OH */}
              <line
                x1={150}
                y1={54}
                x2={150}
                y2={22}
                stroke={
                  !useTertiaryAlcohol && reactionStage >= 1
                    ? BOND_COLORS.cleaved
                    : colors.neutral[400]
                }
                strokeWidth={3}
                strokeDasharray={
                  !useTertiaryAlcohol && reactionStage === 1 ? '4,4' : undefined
                }
              />
              <circle
                cx={150}
                cy={-4}
                r={22}
                fill={ATOM_COLORS.oxygen}
              />
              <text
                x={150}
                y={1}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.axis)}
                fontWeight="bold"
              >
                OH
              </text>

              {/* 左侧 -CH3 / R */}
              <line
                x1={124}
                y1={80}
                x2={86}
                y2={80}
                stroke={colors.neutral[400]}
                strokeWidth={3}
              />
              <circle cx={60} cy={80} r={24} fill={ATOM_COLORS.carbon} />
              <text
                x={60}
                y={85}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.axis)}
                fontWeight="bold"
              >
                CH₃
              </text>

              {/* 右侧 H / CH3 */}
              <line
                x1={176}
                y1={80}
                x2={214}
                y2={80}
                stroke={colors.neutral[400]}
                strokeWidth={3}
              />
              <circle
                cx={238}
                cy={80}
                r={22}
                fill={
                  useTertiaryAlcohol
                    ? ATOM_COLORS.carbon
                    : ATOM_COLORS.hydrogen
                }
              />
              <text
                x={238}
                y={85}
                textAnchor="middle"
                fill={useTertiaryAlcohol ? '#FFF' : '#333'}
                fontSize={font(FONT.axis)}
                fontWeight="bold"
              >
                {useTertiaryAlcohol ? 'CH₃' : 'H'}
              </text>

              {/* 下方 α-H / CH3 */}
              <line
                x1={150}
                y1={106}
                x2={150}
                y2={140}
                stroke={
                  !useTertiaryAlcohol && reactionStage >= 1
                    ? BOND_COLORS.cleaved
                    : colors.neutral[400]
                }
                strokeWidth={3}
                strokeDasharray={
                  !useTertiaryAlcohol && reactionStage === 1 ? '4,4' : undefined
                }
              />
              <circle
                cx={150}
                cy={162}
                r={20}
                fill={
                  useTertiaryAlcohol
                    ? ATOM_COLORS.carbon
                    : ATOM_COLORS.hydrogen
                }
              />
              <text
                x={150}
                y={167}
                textAnchor="middle"
                fill={useTertiaryAlcohol ? '#FFF' : '#333'}
                fontSize={font(FONT.axis)}
                fontWeight="bold"
              >
                {useTertiaryAlcohol ? 'CH₃' : 'H'}
              </text>
            </g>

            {useTertiaryAlcohol ? (
              <g transform="translate(210, 360)">
                <rect
                  x={0}
                  y={0}
                  width={420}
                  height={80}
                  rx={12}
                  fill={withAlpha('#EF4444', 0.1)}
                  stroke="#EF4444"
                  strokeWidth={1.5}
                />
                <text
                  x={210}
                  y={32}
                  textAnchor="middle"
                  fill="#991B1B"
                  fontSize={font(FONT.title)}
                  fontWeight="bold"
                >
                  ❌ 叔醇无 α-H：无法脱氢氧化！
                </text>
                <text
                  x={210}
                  y={58}
                  textAnchor="middle"
                  fill="#B91C1C"
                  fontSize={font(FONT.axis)}
                >
                  高考易错陷阱：与 -OH 相连的 α-C 上连接了 3 个甲基，无 C-H 键
                </text>
              </g>
            ) : (
              reactionStage === 2 && (
                <g transform="translate(210, 360)">
                  <rect
                    x={0}
                    y={0}
                    width={420}
                    height={80}
                    rx={12}
                    fill={withAlpha(CHEMISTRY_COLORS.pH, 0.08)}
                    stroke={CHEMISTRY_COLORS.pH}
                    strokeWidth={1.5}
                  />
                  <text
                    x={210}
                    y={32}
                    textAnchor="middle"
                    fill={colors.neutral[900]}
                    fontSize={font(FONT.title)}
                    fontWeight="bold"
                  >
                    生成物：乙醛 (CH₃CHO) + H₂O
                  </text>
                  <text
                    x={210}
                    y={58}
                    textAnchor="middle"
                    fill={CHEMISTRY_COLORS.pH}
                    fontSize={font(FONT.axis)}
                  >
                    ✓ 成功断裂 O-H 与 α-C 上的 C-H 键，形成 C=O 羰基
                  </text>
                </g>
              )
            )}
          </g>
        )

      case 3: // 4. 卤代烃/醇的消去机制与扎伊采夫规则
        return (
          <g>
            <text
              x={420}
              y={55}
              textAnchor="middle"
              fill={colors.neutral[800]}
              fontSize={font(FONT.title)}
              fontWeight="bold"
            >
              2-溴丁烷消去反应与扎伊采夫规则 (脱 HBr 生成 C=C)
            </text>

            <g transform="translate(120, 140)">
              {/* 1号碳 (β1-C, CH3, H较多: 3个) */}
              <circle cx={50} cy={60} r={24} fill={ATOM_COLORS.carbon} />
              <text
                x={50}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                CH₃
              </text>
              <text
                x={50}
                y={22}
                textAnchor="middle"
                fill={colors.neutral[500]}
                fontSize={font(FONT.annotation)}
              >
                1号碳 (β₁-C, 3H)
              </text>

              <line
                x1={74}
                y1={60}
                x2={126}
                y2={60}
                stroke={colors.neutral[400]}
                strokeWidth={3}
              />

              {/* 2号碳 (α-C, CH-Br) */}
              <circle cx={150} cy={60} r={26} fill={ATOM_COLORS.carbon} />
              <text
                x={150}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                CH
              </text>
              <text
                x={150}
                y={22}
                textAnchor="middle"
                fill={colors.neutral[700]}
                fontSize={font(FONT.annotation)}
                fontWeight="bold"
              >
                2号碳 (α-C)
              </text>
              {/* C-Br 键 */}
              <line
                x1={150}
                y1={86}
                x2={150}
                y2={130}
                stroke={
                  reactionStage >= 1
                    ? BOND_COLORS.cleaved
                    : colors.neutral[400]
                }
                strokeWidth={3}
                strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
              />
              <circle cx={150} cy={152} r={22} fill="#10B981" />
              <text
                x={150}
                y={157}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.axis)}
                fontWeight="bold"
              >
                Br
              </text>

              {/* 2-3位单/双键 */}
              <line
                x1={176}
                y1={60}
                x2={234}
                y2={60}
                stroke={
                  reactionStage === 2
                    ? CHEMISTRY_COLORS.concentration
                    : colors.neutral[400]
                }
                strokeWidth={reactionStage === 2 ? 4 : 3}
              />
              {reactionStage === 2 && (
                <line
                  x1={176}
                  y1={70}
                  x2={234}
                  y2={70}
                  stroke={CHEMISTRY_COLORS.concentration}
                  strokeWidth={4}
                />
              )}

              {/* 3号碳 (β2-C, CH2, H较少: 2个) */}
              <circle cx={260} cy={60} r={26} fill={ATOM_COLORS.carbon} />
              <text
                x={260}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                CH
              </text>
              <text
                x={260}
                y={22}
                textAnchor="middle"
                fill={CHEMISTRY_COLORS.concentration}
                fontSize={font(FONT.annotation)}
                fontWeight="bold"
              >
                3号碳 (β₂-C, 2H少)
              </text>

              {/* 3号碳上的 β-H */}
              <line
                x1={260}
                y1={86}
                x2={260}
                y2={130}
                stroke={
                  reactionStage >= 1
                    ? BOND_COLORS.cleaved
                    : colors.neutral[400]
                }
                strokeWidth={3}
                strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
              />
              <circle cx={260} cy={150} r={18} fill={ATOM_COLORS.hydrogen} />
              <text
                x={260}
                y={155}
                textAnchor="middle"
                fill="#333"
                fontSize={font(FONT.axis)}
                fontWeight="bold"
              >
                H
              </text>

              {/* 4号碳 (CH3) */}
              <line
                x1={286}
                y1={60}
                x2={334}
                y2={60}
                stroke={colors.neutral[400]}
                strokeWidth={3}
              />
              <circle cx={360} cy={60} r={24} fill={ATOM_COLORS.carbon} />
              <text
                x={360}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                CH₃
              </text>

              {/* 断键与脱去标记 */}
              {reactionStage === 1 && (
                <g transform="translate(120, 110)">
                  <rect
                    x={0}
                    y={0}
                    width={170}
                    height={70}
                    rx={8}
                    fill={withAlpha(REACTION_COLORS.cleavage, 0.15)}
                    stroke={REACTION_COLORS.cleavage}
                    strokeWidth={2}
                    strokeDasharray="4,3"
                  />
                  <text
                    x={85}
                    y={24}
                    textAnchor="middle"
                    fill={REACTION_COLORS.cleavage}
                    fontSize={font(FONT.annotation)}
                    fontWeight="bold"
                  >
                    ✂ 脱 HBr (脱含 H 少的 β-氢)
                  </text>
                  <text
                    x={85}
                    y={48}
                    textAnchor="middle"
                    fill={colors.neutral[700]}
                    fontSize={font(11)}
                  >
                    NaOH 醇溶液, Δ
                  </text>
                </g>
              )}
            </g>

            {/* 产物展示 */}
            {reactionStage === 2 && (
              <g transform="translate(180, 360)">
                <rect
                  x={0}
                  y={0}
                  width={480}
                  height={85}
                  rx={12}
                  fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.08)}
                  stroke={CHEMISTRY_COLORS.concentration}
                  strokeWidth={1.5}
                />
                <text
                  x={240}
                  y={32}
                  textAnchor="middle"
                  fill={colors.neutral[900]}
                  fontSize={font(FONT.title)}
                  fontWeight="bold"
                >
                  主产物 (80%)：2-丁烯 (CH₃-CH=CH-CH₃) + NaBr + H₂O
                </text>
                <text
                  x={240}
                  y={60}
                  textAnchor="middle"
                  fill={CHEMISTRY_COLORS.concentration}
                  fontSize={font(FONT.axis)}
                >
                  ✓ 扎伊采夫规则：H 优先从含氢较少的 3号 β-C 上脱去，形成多取代双键
                </text>
              </g>
            )}
          </g>
        )

      case 4: // 5. 肽键生成与水解机制
        return (
          <g>
            <text
              x={420}
              y={55}
              textAnchor="middle"
              fill={colors.neutral[800]}
              fontSize={font(FONT.title)}
              fontWeight="bold"
            >
              氨基酸脱水缩合形成肽键 (-CO-NH-) 与水解断键
            </text>

            {/* 甘氨酸 (Gly) */}
            <g transform="translate(120, 140)">
              <text
                x={120}
                y={20}
                textAnchor="middle"
                fill={colors.neutral[700]}
                fontSize={font(FONT.axis)}
                fontWeight="bold"
              >
                甘氨酸 (H₂N-CH₂-COOH)
              </text>
              <circle cx={40} cy={60} r={24} fill={ATOM_COLORS.nitrogen} />
              <text
                x={40}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                H₂N
              </text>

              <line
                x1={64}
                y1={60}
                x2={106}
                y2={60}
                stroke={colors.neutral[400]}
                strokeWidth={3}
              />
              <circle cx={130} cy={60} r={24} fill={ATOM_COLORS.carbon} />
              <text
                x={130}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                CH₂
              </text>

              <line
                x1={154}
                y1={60}
                x2={196}
                y2={60}
                stroke={colors.neutral[400]}
                strokeWidth={3}
              />
              {/* 羰基 C */}
              <circle cx={220} cy={60} r={24} fill={ATOM_COLORS.carbon} />
              <text
                x={220}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                C
              </text>

              {/* 脱去 -OH */}
              <line
                x1={244}
                y1={60}
                x2={286}
                y2={60}
                stroke={
                  reactionStage >= 1
                    ? BOND_COLORS.cleaved
                    : colors.neutral[400]
                }
                strokeWidth={3}
                strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
              />
              <g transform={reactionStage === 2 ? 'translate(80, 160)' : ''}>
                <circle cx={310} cy={60} r={22} fill={ATOM_COLORS.oxygen} />
                <text
                  x={310}
                  y={65}
                  textAnchor="middle"
                  fill="#FFF"
                  fontSize={font(FONT.axis)}
                  fontWeight="bold"
                >
                  OH
                </text>
              </g>

              {reactionStage === 1 && (
                <text
                  x={265}
                  y={35}
                  textAnchor="middle"
                  fill={REACTION_COLORS.cleavage}
                  fontSize={font(FONT.annotation)}
                  fontWeight="bold"
                >
                  ✂ 羧基脱 -OH
                </text>
              )}
            </g>

            {/* 丙氨酸 (Ala) */}
            <g transform="translate(500, 140)">
              <text
                x={140}
                y={20}
                textAnchor="middle"
                fill={colors.neutral[700]}
                fontSize={font(FONT.axis)}
                fontWeight="bold"
              >
                丙氨酸 (H₂N-CH(CH₃)-COOH)
              </text>

              {/* 氨基 H */}
              <g transform={reactionStage === 2 ? 'translate(-200, 160)' : ''}>
                <circle cx={10} cy={60} r={18} fill={ATOM_COLORS.hydrogen} />
                <text
                  x={10}
                  y={65}
                  textAnchor="middle"
                  fill="#333"
                  fontSize={font(FONT.axis)}
                  fontWeight="bold"
                >
                  H
                </text>
              </g>
              <line
                x1={28}
                y1={60}
                x2={56}
                y2={60}
                stroke={
                  reactionStage >= 1
                    ? BOND_COLORS.cleaved
                    : colors.neutral[400]
                }
                strokeWidth={3}
                strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
              />

              <circle cx={80} cy={60} r={24} fill={ATOM_COLORS.nitrogen} />
              <text
                x={80}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.label)}
                fontWeight="bold"
              >
                HN
              </text>

              <line
                x1={104}
                y1={60}
                x2={146}
                y2={60}
                stroke={colors.neutral[400]}
                strokeWidth={3}
              />
              <circle cx={170} cy={60} r={24} fill={ATOM_COLORS.carbon} />
              <text
                x={170}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.axis)}
                fontWeight="bold"
              >
                CH
              </text>

              <line
                x1={194}
                y1={60}
                x2={236}
                y2={60}
                stroke={colors.neutral[400]}
                strokeWidth={3}
              />
              <circle cx={260} cy={60} r={24} fill={ATOM_COLORS.carbon} />
              <text
                x={260}
                y={65}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.small)}
                fontWeight="bold"
              >
                COOH
              </text>

              {reactionStage === 1 && (
                <text
                  x={42}
                  y={35}
                  textAnchor="middle"
                  fill={REACTION_COLORS.cleavage}
                  fontSize={font(FONT.annotation)}
                  fontWeight="bold"
                >
                  ✂ 氨基脱 -H
                </text>
              )}
            </g>

            {/* 产物展示 */}
            {reactionStage === 2 && (
              <g transform="translate(180, 360)">
                <rect
                  x={0}
                  y={0}
                  width={480}
                  height={85}
                  rx={12}
                  fill={withAlpha(CHEMISTRY_COLORS.pH, 0.08)}
                  stroke={CHEMISTRY_COLORS.pH}
                  strokeWidth={1.5}
                />
                <text
                  x={240}
                  y={32}
                  textAnchor="middle"
                  fill={colors.neutral[900]}
                  fontSize={font(FONT.title)}
                  fontWeight="bold"
                >
                  生成甘丙二肽：H₂N-CH₂-
                  <tspan fill="#EF4444" fontWeight="bold">
                    CO-NH
                  </tspan>
                  -CH(CH₃)-COOH + H₂O
                </text>
                <text
                  x={240}
                  y={60}
                  textAnchor="middle"
                  fill={CHEMISTRY_COLORS.pH}
                  fontSize={font(FONT.axis)}
                >
                  ✓ 羧基脱 -OH、氨基脱 -H 形成 -CO-NH- (肽键)；水解时断裂 C-N 单键
                </text>
              </g>
            )}
          </g>
        )

      case 5: // 6. 苯酚邻对位取代与酚醛缩聚
        return (
          <g>
            <text
              x={420}
              y={55}
              textAnchor="middle"
              fill={colors.neutral[800]}
              fontSize={font(FONT.title)}
              fontWeight="bold"
            >
              苯酚邻对位 C-H 键极化活化 (2,4,6-三溴苯酚取代与酚醛缩聚)
            </text>

            <g transform="translate(250, 130)">
              {/* 苯环六边形 */}
              <polygon
                points="150,40 200,70 200,130 150,160 100,130 100,70"
                fill={withAlpha(colors.neutral[300], 0.3)}
                stroke={colors.neutral[700]}
                strokeWidth={3}
              />
              <circle
                cx={150}
                cy={100}
                r={30}
                fill="none"
                stroke={colors.neutral[400]}
                strokeWidth={2}
                strokeDasharray="4,4"
              />

              {/* 酚羟基 -OH (1号位) */}
              <line
                x1={150}
                y1={40}
                x2={150}
                y2={5}
                stroke={colors.neutral[600]}
                strokeWidth={3}
              />
              <circle cx={150} cy={-15} r={22} fill={ATOM_COLORS.oxygen} />
              <text
                x={150}
                y={-10}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(FONT.axis)}
                fontWeight="bold"
              >
                OH
              </text>

              {/* 2号邻位 C-H (左上) */}
              <circle
                cx={100}
                cy={70}
                r={16}
                fill={
                  reactionStage >= 1
                    ? REACTION_COLORS.cleavage
                    : CHEMISTRY_COLORS.concentration
                }
              />
              <text
                x={100}
                y={74}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(11)}
                fontWeight="bold"
              >
                2-H
              </text>

              {/* 6号邻位 C-H (右上) */}
              <circle
                cx={200}
                cy={70}
                r={16}
                fill={
                  reactionStage >= 1
                    ? REACTION_COLORS.cleavage
                    : CHEMISTRY_COLORS.concentration
                }
              />
              <text
                x={200}
                y={74}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(11)}
                fontWeight="bold"
              >
                6-H
              </text>

              {/* 4号对位 C-H (正下) */}
              <circle
                cx={150}
                cy={160}
                r={16}
                fill={
                  reactionStage >= 1
                    ? REACTION_COLORS.cleavage
                    : CHEMISTRY_COLORS.concentration
                }
              />
              <text
                x={150}
                y={164}
                textAnchor="middle"
                fill="#FFF"
                fontSize={font(11)}
                fontWeight="bold"
              >
                4-H
              </text>

              {/* 活化标注 */}
              <text
                x={150}
                y={105}
                textAnchor="middle"
                fill={colors.neutral[800]}
                fontSize={font(FONT.annotation)}
                fontWeight="bold"
              >
                p-π 共轭活化
              </text>

              {reactionStage === 1 && (
                <g>
                  <text
                    x={40}
                    y={70}
                    textAnchor="middle"
                    fill={REACTION_COLORS.cleavage}
                    fontSize={font(FONT.annotation)}
                    fontWeight="bold"
                  >
                    ✂ 邻位断 C-H
                  </text>
                  <text
                    x={260}
                    y={70}
                    textAnchor="middle"
                    fill={REACTION_COLORS.cleavage}
                    fontSize={font(FONT.annotation)}
                    fontWeight="bold"
                  >
                    ✂ 邻位断 C-H
                  </text>
                  <text
                    x={150}
                    y={195}
                    textAnchor="middle"
                    fill={REACTION_COLORS.cleavage}
                    fontSize={font(FONT.annotation)}
                    fontWeight="bold"
                  >
                    ✂ 对位断 C-H
                  </text>
                </g>
              )}
            </g>

            {/* 产物展示 */}
            {reactionStage === 2 && (
              <g transform="translate(180, 360)">
                <rect
                  x={0}
                  y={0}
                  width={480}
                  height={85}
                  rx={12}
                  fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.08)}
                  stroke={CHEMISTRY_COLORS.concentration}
                  strokeWidth={1.5}
                />
                <text
                  x={240}
                  y={32}
                  textAnchor="middle"
                  fill={colors.neutral[900]}
                  fontSize={font(FONT.title)}
                  fontWeight="bold"
                >
                  生成物：2,4,6-三溴苯酚白色沉淀 ↓ + 3 HBr (或缩聚生成酚醛树脂)
                </text>
                <text
                  x={240}
                  y={60}
                  textAnchor="middle"
                  fill={CHEMISTRY_COLORS.concentration}
                  fontSize={font(FONT.axis)}
                >
                  ✓ 酚羟基增大邻对位电子云密度，使 2,4,6 位 C-H 键极易断裂发生取代/缩聚
                </text>
              </g>
            )}
          </g>
        )

      default:
        return null
    }
  }

  // 1. 左侧面板：仅在动画场景下显示 6 大机制选择与反应历程演练，规范踩分与真题变式下隐去机制与历程控件
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

  // 2. 中间面板：遵循 AGENTS.md 铁律 2 布局唯一路径 (AnimationSvgCanvas)
  const centerContent = (
    <div ref={containerRef} className="w-full h-full flex flex-col p-4 overflow-y-auto">
      {/* 视图视角 0: 机制动画 Scene (使用规范 AnimationSvgCanvas) */}
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

          {/* 铁律 2 唯一布局：AnimationSvgCanvas 容器无背景 */}
          <div className="w-full flex-1 min-h-[440px]">
            <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
              {renderMechanismSvgScene()}
            </AnimationSvgCanvas>
          </div>
        </div>
      )}

      {/* 视图视角 1: 高考规范踩分 Cards */}
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

          {/* 踩分点卡片列表 */}
          <ScoringCardSection steps={quizData.scoringSteps} />
        </div>
      )}

      {/* 视图视角 2: 高考真题变式 Quiz */}
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

          {/* 试题与解析 */}
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        </div>
      )}
    </div>
  )

  // 3. 右侧面板：高考要点与知识节点
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

      {/* 关联教材知识节点 */}
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
      {/* 顶部 Navigation */}
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

      {/* 标准 ThreePanel 布局区域 */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel left={leftContent} center={centerContent} right={rightContent} />
      </div>
    </div>
  )
}
