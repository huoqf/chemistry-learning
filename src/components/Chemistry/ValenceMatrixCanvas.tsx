import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layers,
  ArrowRight,
  Edit3,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  RotateCw,
  Beaker,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import {
  VALENCE_MATRIX_DATA,
  type ValenceCategory,
  type ValenceSubstanceNode,
} from '@/data/valence-matrix'
import { ThreePanel } from '@/components/Layout'
import { LeftPanel, LeftPanelSection } from '@/components/UI/LeftPanel'
import { ScoringCardSection, GaokaoVariantQuiz, ChemicalFormula, GaokaoToolHeader } from '@/components/UI'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { getKnowledgeNode } from '@/data/knowledgeTree'
import { getModelQuizData } from '@/data/gaokaoQuizData'
import { colors } from '@/theme'

export interface MatrixItem {
  valence: number
  category: string
  substance: string
  colorText: string
  colorStyle: string
  testReaction?: string
  equation?: string
  rgbColor?: string
}

interface ValenceMatrixCanvasProps {
  elementName?: string
  valences?: number[]
  categories?: string[]
  items?: MatrixItem[]
  defaultElementSymbol?: string
}

export type MainViewMode = 'matrix' | 'scoring' | 'quiz'
export type MatrixInquiryMode = 'overview' | 'redox-path'

/**
 * ValenceMatrixCanvas — 无机元素“价类二维矩阵”探究工具 (标准的 ThreePanel 三屏联动架构)
 *
 * 核心设计原则：
 * 1. 彻底消除中屏与弹窗的嵌套滚动条，全界面采用单层自适应视口；
 * 2. 彻底理顺三屏权责：右屏常驻为“物质高考全景档案与性质拆解”，消除弹出窗口内容与右屏重复的冗余；
 * 3. 左屏 40 元素全周期切换 + 中屏价类矩阵交互 + 右屏高考全景档案实时联动。
 */
export function ValenceMatrixCanvas({
  defaultElementSymbol = 'Fe',
  elementName: customElementName,
  valences: customValences,
  categories: customCategories,
  items: customItems,
}: ValenceMatrixCanvasProps) {
  const navigate = useNavigate()

  // 1. 中屏主视角平行切换：'matrix' 矩阵探究 | 'scoring' 手算演练 | 'quiz' 高考真题变式
  const [mainView, setMainView] = useState<MainViewMode>('matrix')

  // 选中的元素符号 (覆盖新高考 40 大元素)
  const [selectedSymbol, setSelectedSymbol] = useState<string>(defaultElementSymbol)

  // 矩阵内部探究模式：'overview' 全景矩阵 | 'redox-path' 转化路径
  const [inquiryMode, setInquiryMode] = useState<MatrixInquiryMode>('overview')

  // 当前调用的元素全量数据
  const currentConfig = useMemo(() => {
    return VALENCE_MATRIX_DATA[selectedSymbol] || VALENCE_MATRIX_DATA['Fe']
  }, [selectedSymbol])

  // 矩阵维数（化合价与类别）
  const activeValences = customValences || currentConfig.valences
  const activeCategories: ValenceCategory[] =
    (customCategories as ValenceCategory[]) || currentConfig.categories

  // 高中化学标准坐标系：纵坐标化合价从最高正价自上而下递减到最低负价
  const sortedValences = useMemo(() => {
    return [...activeValences].sort((a, b) => b - a)
  }, [activeValences])

  const maxValence = useMemo(() => Math.max(...activeValences), [activeValences])
  const minValence = useMemo(() => Math.min(...activeValences), [activeValences])

  // 选中的化学物质节点 (源物质)
  const [selectedSubstance, setSelectedSubstance] = useState<ValenceSubstanceNode | null>(
    currentConfig.items[0] || null
  )

  // 双选路径推演目标物质 (目标物质)
  const [targetSubstance, setTargetSubstance] = useState<ValenceSubstanceNode | null>(null)

  // 获取模型元数据与试题
  const modelNode = getGaokaoModel('model-valence-matrix')
  const quizData = getModelQuizData('model-valence-matrix')

  // 获取交叉点的所有物质节点 (支持同一价态类别多物质并存)
  const getItems = (valence: number, cat: ValenceCategory): ValenceSubstanceNode[] => {
    if (customItems) {
      const foundList = customItems.filter(i => i.valence === valence && i.category === cat)
      return foundList.map(found => ({
        substance: found.substance,
        valence: found.valence,
        category: found.category as ValenceCategory,
        colorText: found.colorText,
        colorStyle: found.colorStyle,
        rgbColor: found.rgbColor || colors.neutral[300],
        testReaction: found.testReaction,
        equation: found.equation,
      }))
    }
    return currentConfig.items.filter(i => i.valence === valence && i.category === cat)
  }

  // 点击元素 Tab 切换
  const handleSymbolChange = (symbol: string) => {
    setSelectedSymbol(symbol)
    setTargetSubstance(null)
    const newCfg = VALENCE_MATRIX_DATA[symbol]
    if (newCfg && newCfg.items.length > 0) {
      setSelectedSubstance(newCfg.items[0])
    }
  }

  // 节点点击处理 (支持双选推演)
  const handleNodeClick = (node: ValenceSubstanceNode) => {
    if (inquiryMode === 'redox-path' && selectedSubstance && selectedSubstance.substance !== node.substance) {
      setTargetSubstance(node)
    } else {
      setSelectedSubstance(node)
      setTargetSubstance(null)
    }
  }

  // 精确物质匹配函数（避免 'FeSO₄'.includes('Fe') 等子串错误匹配）
  const matchesSubstance = (field: string, targetSubstance: string): boolean => {
    if (!field || !targetSubstance) return false
    const targetClean = targetSubstance.trim()
    const parts = field.split(/[/,，、或|]/).map(p => p.trim())
    return parts.some(
      p =>
        p === targetClean ||
        p.startsWith(targetClean + '(') ||
        p.startsWith(targetClean + '（') ||
        targetClean.startsWith(p + '(') ||
        targetClean.startsWith(p + '（')
    )
  }

  // 计算选中的两者之间的直接转化关系
  const activePairTransformation = useMemo(() => {
    if (!selectedSubstance || !targetSubstance) return null
    return currentConfig.transformations.find(
      t =>
        (matchesSubstance(t.fromSubstance, selectedSubstance.substance) &&
          matchesSubstance(t.toSubstance, targetSubstance.substance)) ||
        (matchesSubstance(t.fromSubstance, targetSubstance.substance) &&
          matchesSubstance(t.toSubstance, selectedSubstance.substance))
    )
  }, [selectedSubstance, targetSubstance, currentConfig])

  // 计算与当前选中物质专属相关的价态升降转化路径
  const upwardOxidations = useMemo(() => {
    if (!selectedSubstance) return []
    return currentConfig.transformations.filter(
      t => matchesSubstance(t.fromSubstance, selectedSubstance.substance) && t.type === 'oxidation'
    )
  }, [selectedSubstance, currentConfig])

  const downwardReductions = useMemo(() => {
    if (!selectedSubstance) return []
    return currentConfig.transformations.filter(
      t => matchesSubstance(t.fromSubstance, selectedSubstance.substance) && t.type === 'reduction'
    )
  }, [selectedSubstance, currentConfig])

  const otherTransformations = useMemo(() => {
    if (!selectedSubstance) return []
    return currentConfig.transformations.filter(
      t =>
        matchesSubstance(t.fromSubstance, selectedSubstance.substance) &&
        t.type !== 'oxidation' &&
        t.type !== 'reduction'
    )
  }, [selectedSubstance, currentConfig])

  // 物质聚集形态与标签计算 (严格按照高中化学常温常压物理常识与精确实体比对判定，杜绝子串误判)
  const selectedPhysicalState = useMemo(() => {
    if (!selectedSubstance) return '澄清离子水溶液'

    // 1. 如果节点本身显式标注了 physicalState，直接映射
    if (selectedSubstance.physicalState === 'gas') return '气态分子 (气体)'
    if (selectedSubstance.physicalState === 'precipitate') return '难溶沉淀 / 胶体'
    if (selectedSubstance.physicalState === 'solid') return '固体粉末 / 晶体'
    if (selectedSubstance.physicalState === 'solution') return '澄清离子水溶液'

    // 2. 提取候选纯净化学式列表（去除中文注释括号）
    const formulas = selectedSubstance.substance
      .split(/[/,，、或|]/)
      .map(s => s.trim().replace(/\(.*?\)|（.*?）/g, '').trim())

    // 3. 常温液态常识清单 (精准实体匹配)
    const LIQUIDS = new Set([
      'Br2', 'Br₂', 'Hg', 'H2O', 'H₂O', 'CCl4', 'CCl₄', 'CS2', 'CS₂',
      '浓H2SO4', '浓H₂SO₄', '浓HNO3', '浓HNO₃'
    ])
    if (formulas.some(f => LIQUIDS.has(f))) {
      return '纯净液体 / 浓溶液'
    }

    // 4. 常温气态单质与化合物常识清单 (精准实体匹配)
    const GASES = new Set([
      'H2', 'H₂', 'O2', 'O₂', 'O3', 'O₃', 'N2', 'N₂', 'F2', 'F₂', 'Cl2', 'Cl₂',
      'CO', 'CO2', 'CO₂', 'NO', 'NO2', 'NO₂', 'N2O', 'N₂O', 'SO2', 'SO₂', 'ClO2', 'ClO₂',
      'NH3', 'NH₃', 'PH3', 'PH₃', 'AsH3', 'AsH₃', 'H2S', 'H₂S', 'CH4', 'CH₄',
      'HCl', 'HF', 'HBr', 'HI', 'SiH4', 'SiH₄', 'GeH4', 'GeH₄', 'B2H6', 'B₂H₆'
    ])
    if (formulas.some(f => GASES.has(f))) {
      return '气态分子 (气体)'
    }

    // 5. 难溶沉淀常识清单 (精确匹配或包含“沉淀”字样)
    if (
      selectedSubstance.colorText.includes('沉淀') ||
      selectedSubstance.precipitateType === 'transient-feoh2' ||
      selectedSubstance.precipitateType === 'red-brown'
    ) {
      return '难溶沉淀 / 胶体'
    }

    const PRECIPITATES = new Set([
      'Fe(OH)2', 'Fe(OH)₂', 'Fe(OH)3', 'Fe(OH)₃', 'Cu(OH)2', 'Cu(OH)₂',
      'Al(OH)3', 'Al(OH)₃', 'Mg(OH)2', 'Mg(OH)₂', 'Mn(OH)2', 'Mn(OH)₂',
      'Co(OH)2', 'Co(OH)₂', 'Co(OH)3', 'Co(OH)₃', 'Ni(OH)2', 'Ni(OH)₂',
      'Zn(OH)2', 'Zn(OH)₂', 'Pb(OH)2', 'Pb(OH)₂', 'Bi(OH)3', 'Bi(OH)₃',
      'BaSO4', 'BaSO₄', 'BaCO3', 'BaCO₃', 'BaSO3', 'BaSO₃',
      'CaCO3', 'CaCO₃', 'CaSO4', 'CaSO₄', 'CaSO3', 'CaSO₃',
      'AgCl', 'AgBr', 'AgI', 'Ag2O', 'Ag₂O', 'Ag2S', 'Ag₂S',
      'PbSO4', 'PbSO₄', 'PbI2', 'PbI₂', 'PbS',
      'CuS', 'Cu2S', 'Cu₂S', 'Cu2O', 'Cu₂O', 'CuO',
      'FeS', 'FeS2', 'FeS₂', 'FeAsO4', 'FeAsO₄',
      'H2SiO3', 'H₂SiO₃', 'H4SiO4', 'H₄SiO₄', 'H2MoO4', 'H₂MoO₄', 'H2WO4', 'H₂WO₄'
    ])
    if (formulas.some(f => PRECIPITATES.has(f))) {
      return '难溶沉淀 / 胶体'
    }

    // 6. 固体金属与非金属单质、固体氧化物 (固态晶体/粉末)
    if (selectedSubstance.category === '单质') {
      return '固体粉末 / 晶体'
    }

    if (selectedSubstance.category === '氧化物') {
      return '固体粉末 / 晶体'
    }

    // 7. 易溶强碱（如 NaOH, KOH, Ba(OH)₂）与可溶性盐/水溶液
    return '澄清离子水溶液'
  }, [selectedSubstance])

  // 元素分类列表
  const nonMetalElements = useMemo(
    () => Object.values(VALENCE_MATRIX_DATA).filter(e => e.elementCategory === 'non-metal'),
    []
  )
  const mainGroupMetalElements = useMemo(
    () => Object.values(VALENCE_MATRIX_DATA).filter(e => e.elementCategory === 'main-group-metal'),
    []
  )
  const transitionMetalElements = useMemo(
    () => Object.values(VALENCE_MATRIX_DATA).filter(e => e.elementCategory === 'transition-metal'),
    []
  )

  // ───────────────────────────────────────────────────────────────────────────
  // 左屏 Panel 内容 (左侧控制器)
  // ───────────────────────────────────────────────────────────────────────────
  const leftContent = (
    <LeftPanel>
      {/* 1. 元素选择 Section */}
      <LeftPanelSection
        title="高考 40 种核心元素"
        subtitle="非金属(14) · 主族金属(14) · 过渡金属(12)"
      >
        <div className="flex flex-col gap-2.5 pt-1">
          {/* A. 主族非金属 */}
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-bold text-indigo-700 flex items-center justify-between">
              <span>非金属 (14种):</span>
              <span className="text-[10px] text-slate-400 font-mono font-normal">H ~ I</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {nonMetalElements.map(cfg => {
                const isActive = selectedSymbol === cfg.id
                const shortName = cfg.name.replace(/元素|\s*\(.+\)/g, '').trim()
                return (
                  <button
                    key={cfg.id}
                    onClick={() => handleSymbolChange(cfg.id)}
                    className={`py-1 px-1.5 rounded-lg text-xs font-bold border transition-all text-center ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs scale-[1.02]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200'
                    }`}
                  >
                    {cfg.symbol} {shortName}
                  </button>
                )
              })}
            </div>
          </div>

          {/* B. 主族金属 */}
          <div className="flex flex-col gap-1 pt-1.5 border-t border-slate-100">
            <div className="text-[11px] font-bold text-emerald-700 flex items-center justify-between">
              <span>主族金属 (14种):</span>
              <span className="text-[10px] text-slate-400 font-mono font-normal">Li ~ Bi</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {mainGroupMetalElements.map(cfg => {
                const isActive = selectedSymbol === cfg.id
                const shortName = cfg.name.replace(/元素|\s*\(.+\)/g, '').trim()
                return (
                  <button
                    key={cfg.id}
                    onClick={() => handleSymbolChange(cfg.id)}
                    className={`py-1 px-1.5 rounded-lg text-xs font-bold border transition-all text-center ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs scale-[1.02]'
                        : 'bg-emerald-50/50 text-emerald-900 border-emerald-200 hover:bg-emerald-100/70'
                    }`}
                  >
                    {cfg.symbol} {shortName}
                  </button>
                )
              })}
            </div>
          </div>

          {/* C. 过渡金属 */}
          <div className="flex flex-col gap-1 pt-1.5 border-t border-slate-100">
            <div className="text-[11px] font-bold text-amber-800 flex items-center justify-between">
              <span>过渡金属 (12种):</span>
              <span className="text-[10px] text-slate-400 font-mono font-normal">Ti ~ W</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {transitionMetalElements.map(cfg => {
                const isActive = selectedSymbol === cfg.id
                const shortName = cfg.name.replace(/元素|\s*\(.+\)/g, '').trim()
                return (
                  <button
                    key={cfg.id}
                    onClick={() => handleSymbolChange(cfg.id)}
                    className={`py-1 px-1.5 rounded-lg text-xs font-bold border transition-all text-center ${
                      isActive
                        ? 'bg-amber-600 text-white border-amber-700 shadow-2xs scale-[1.02]'
                        : 'bg-amber-50/50 text-amber-900 border-amber-200 hover:bg-amber-100/70'
                    }`}
                  >
                    {cfg.symbol} {shortName}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </LeftPanelSection>

      {/* 2. 探究模式 Section (仅在 matrix 模式下有效) */}
      {mainView === 'matrix' && (
        <LeftPanelSection title="矩阵探究模式">
          <div className="flex flex-col gap-1.5 pt-1">
            <button
              onClick={() => {
                setInquiryMode('overview')
                setTargetSubstance(null)
              }}
              className={`w-full py-2 px-2.5 text-xs font-semibold rounded-lg border text-left flex items-center justify-between transition-all ${
                inquiryMode === 'overview'
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>全景二维矩阵</span>
              {inquiryMode === 'overview' && <span className="text-[10px] text-indigo-600 font-bold">✓</span>}
            </button>

            <button
              onClick={() => setInquiryMode('redox-path')}
              className={`w-full py-2 px-2.5 text-xs font-semibold rounded-lg border text-left flex items-center justify-between transition-all ${
                inquiryMode === 'redox-path'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>氧化还原路径推演</span>
              {inquiryMode === 'redox-path' && <span className="text-[10px] text-amber-600 font-bold">✓</span>}
            </button>
          </div>
        </LeftPanelSection>
      )}

      {/* 3. 快速切题指引 */}
      <LeftPanelSection title="探究指引">
        <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col gap-1">
          <span className="font-bold text-slate-800">💡 探究操作技巧：</span>
          <span>1. 点击中屏任意物质，右屏即时展开该物质的【高考全景档案与性质拆解】。</span>
          <span>2. 开启“氧化还原路径推演”后，连续点击两个物质，可精准推导演练升降价试剂与方程式。</span>
        </div>
      </LeftPanelSection>
    </LeftPanel>
  )

  // ───────────────────────────────────────────────────────────────────────────
  // 中屏 Center Panel 内容 (单层自适应视口，无嵌套滚动条)
  // ───────────────────────────────────────────────────────────────────────────
  const centerContent = (
    <div className="w-full h-full flex flex-col overflow-hidden font-sans">
      {/* 1. 视角 A: 价类二维矩阵 (纯净单层滚动自适应视口) */}
      {mainView === 'matrix' && (
        <div className="w-full h-full flex flex-col p-3 bg-slate-50/80 overflow-hidden gap-2.5">
          {/* 标题说明与顶部工具栏 */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-white border border-slate-200 rounded-xl shadow-2xs shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                {customElementName || currentConfig.name} — 价类二维矩阵
                <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {currentConfig.badgeText}
                </span>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setInquiryMode(inquiryMode === 'redox-path' ? 'overview' : 'redox-path')
                  if (inquiryMode === 'redox-path') setTargetSubstance(null)
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                  inquiryMode === 'redox-path'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-200'
                }`}
              >
                {inquiryMode === 'redox-path' ? '收起转化网络' : '开启路径推演'}
              </button>
            </div>
          </div>

          {/* 氧化还原路径网推演条 (紧凑单层呈现，绝无内部二级滚动条) */}
          {inquiryMode === 'redox-path' && (
            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/90 flex flex-col gap-2 shrink-0 animate-in fade-in duration-150 shadow-2xs">
              {activePairTransformation ? (
                /* 双选精准推演模式 */
                <div className="p-3 bg-white rounded-xl border border-amber-300 shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      高考转化推演：
                      <span className="text-indigo-700 font-bold ml-1">{selectedSubstance?.substance}</span>
                      <span className="text-slate-400 mx-1">➔</span>
                      <span className="text-amber-800 font-bold">{targetSubstance?.substance}</span>
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      所需试剂：{activePairTransformation.reagent}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs font-bold text-indigo-950">
                    <ChemicalFormula formula={activePairTransformation.equation} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="text-rose-600 font-bold">
                      电子转移：{activePairTransformation.electronTransfer}
                    </span>
                    <button
                      onClick={() => setTargetSubstance(null)}
                      className="text-2xs text-amber-700 hover:text-amber-900 underline font-medium"
                    >
                      重新选择目标物质
                    </button>
                  </div>
                </div>
              ) : (
                /* 路径推演指引 */
                <div className="flex items-center justify-between text-xs text-amber-900 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-700" />
                    已进入氧化还原推演模式：请在下方矩阵中点击任意第二个物质节点，即刻获得两者的转化试剂、配平方程式与电子转移！
                  </span>
                  <span className="text-2xs text-amber-700">
                    共收录 {currentConfig.transformations.length} 条转化路径
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 2D 矩阵 Grid Table (单层平滑滚动，表头 Sticky 吸顶吸左，消除嵌套滚动) */}
          <div className="flex-1 min-h-0 border border-slate-200 rounded-xl bg-white p-3 overflow-auto shadow-2xs">
            <table className="w-full h-full min-w-[700px] border-collapse select-none">
              <thead>
                <tr>
                  <th className="p-2.5 border border-slate-200 bg-slate-100/95 text-xs font-bold text-slate-700 w-36 sticky top-0 left-0 z-20 text-center shadow-2xs">
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] text-indigo-700 font-bold">化合价 (纵向升降)</span>
                      <span className="text-[10px] text-slate-500 font-normal">＼ 物质类别 (横向通性)</span>
                    </div>
                  </th>
                  {activeCategories.map(cat => (
                    <th
                      key={cat}
                      className="p-2.5 border border-slate-200 bg-slate-100/95 text-xs font-bold text-slate-800 text-center sticky top-0 z-10 shadow-2xs"
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span>{cat}</span>
                        <span className="text-[9px] text-slate-400 font-normal">
                          {cat === '单质'
                            ? '基准态'
                            : cat.includes('氢化物')
                            ? '负氢/气态氢'
                            : cat.includes('氧化物')
                            ? '成盐氧化物'
                            : cat.includes('氢氧化物')
                            ? '最高价水化物'
                            : '含氧酸盐/无氧酸盐'}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedValences.map(v => {
                  const isMax = v === maxValence && maxValence > 0
                  const isMin = v === minValence && minValence < 0
                  const isZero = v === 0

                  return (
                    <tr key={v}>
                      {/* Y 轴化合价行首表头 (Sticky 吸左) */}
                      <td className="p-2.5 border border-slate-200 bg-slate-50/95 text-center w-36 sticky left-0 z-10">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span
                            className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold border ${
                              v > 0
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : v < 0
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-200 text-slate-800 border-slate-300 ring-2 ring-slate-400/30'
                            }`}
                          >
                            {v > 0 ? `+${v}` : v} 价
                          </span>
                          <span className="text-[9px] font-medium text-slate-500">
                            {isMax
                              ? '最高价 · 仅氧化性'
                              : isMin
                              ? '最低价 · 仅还原性'
                              : isZero
                              ? '单质 · 基准价态'
                              : '中间价 · 具双重性'}
                          </span>
                        </div>
                      </td>

                      {/* X 轴各类别单元格 */}
                      {activeCategories.map(cat => {
                        const nodes = getItems(v, cat)
                        const hasNodes = nodes.length > 0
                        return (
                          <td
                            key={cat}
                            className={`p-2 border border-slate-200 text-center transition-all align-middle ${
                              hasNodes ? 'bg-white' : 'bg-slate-50/40'
                            }`}
                          >
                            {hasNodes ? (
                              <div className="flex flex-col items-center justify-center gap-2 py-1">
                                {nodes.map(node => {
                                  const isSelected = selectedSubstance?.substance === node.substance
                                  const isTarget = targetSubstance?.substance === node.substance

                                  // 判断与当前焦点物质的关系（升价氧化 / 降价还原 / 同价非氧化还原）
                                  let directionHint = ''
                                  if (selectedSubstance && !isSelected && !isTarget) {
                                    if (node.valence > selectedSubstance.valence) {
                                      directionHint = '↑ 氧化产物'
                                    } else if (node.valence < selectedSubstance.valence) {
                                      directionHint = '↓ 还原产物'
                                    } else {
                                      directionHint = '↔ 酸碱/水化'
                                    }
                                  }

                                  return (
                                    <div
                                      key={node.substance}
                                      onClick={() => handleNodeClick(node)}
                                      className={`w-full max-w-[160px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1.5 relative group ${
                                        isSelected
                                          ? 'bg-indigo-50/90 border-indigo-500 shadow-sm ring-2 ring-indigo-400/50 scale-[1.02]'
                                          : isTarget
                                          ? 'bg-amber-50/90 border-amber-500 shadow-sm ring-2 ring-amber-400/50 scale-[1.02]'
                                          : 'bg-slate-50/80 border-slate-200 hover:bg-indigo-50/40 hover:border-indigo-300'
                                      }`}
                                    >
                                      {/* 方向指引微标 */}
                                      {directionHint && (
                                        <span className="absolute -top-2 -right-1 text-[8px] px-1 py-0.2 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                          {directionHint}
                                        </span>
                                      )}

                                      <div className="flex items-center justify-between w-full">
                                        <ChemicalFormula formula={node.substance} className="font-bold text-xs text-slate-900" />
                                        <span
                                          className="w-2.5 h-2.5 rounded-full inline-block border border-slate-300 shrink-0"
                                          style={{ backgroundColor: node.rgbColor || '#CBD5E1' }}
                                          title={`外观色泽: ${node.colorText}`}
                                        />
                                      </div>

                                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium truncate max-w-[140px] ${node.colorStyle}`}>
                                        {node.colorText}
                                      </span>

                                      {(node.isOxidant || node.isReductant) && (
                                        <div className="flex items-center gap-1 mt-0.5">
                                          {node.isOxidant && (
                                            <span className="text-[9px] px-1 py-0.2 bg-rose-100 text-rose-800 rounded font-bold border border-rose-200">
                                              氧化性
                                            </span>
                                          )}
                                          {node.isReductant && (
                                            <span className="text-[9px] px-1 py-0.2 bg-blue-100 text-blue-800 rounded font-bold border border-blue-200">
                                              还原性
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            ) : (
                              <span className="text-slate-300 text-xs font-mono">—</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. 视角 B: 踩分点规范手算演练 (宽屏单层舒适呈现) */}
      {mainView === 'scoring' && (
        <div className="w-full h-full p-6 bg-slate-50 overflow-y-auto flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-600" />
              无机元素高考踩分点规范手算演练
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              高考踩分要点 · 离子方程式与规范书写
            </span>
          </div>

          {quizData && quizData.scoringSteps.length > 0 ? (
            <div className="max-w-4xl mx-auto w-full">
              <ScoringCardSection steps={quizData.scoringSteps} />
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
              当前暂无踩分点手算题目
            </div>
          )}
        </div>
      )}

      {/* 3. 视角 C: 近 3 年高考真实情境变式盲盒 (宽屏单层舒适刷题) */}
      {mainView === 'quiz' && (
        <div className="w-full h-full p-6 bg-slate-50 overflow-y-auto flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              近 3 年高考真实情境变式盲盒 (母题拆解)
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              变式强化 · 工业流程与选择题压轴
            </span>
          </div>

          {quizData && quizData.variantQuizzes && quizData.variantQuizzes.length > 0 ? (
            <div className="max-w-4xl mx-auto w-full">
              <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
              当前暂无变式试题数据
            </div>
          )}
        </div>
      )}
    </div>
  )

  // 计算当前选中元素专属关联的教材课标知识节点 (严格过滤无关内容，100% 与左屏选中元素同步)
  const currentElementKnowledgeNodes = useMemo(() => {
    const symbol = currentConfig.symbol

    const directNodeMap: Record<string, string[]> = {
      Fe: ['iron', 'redox-basic'],
      Cu: ['copper', 'redox-basic'],
      Al: ['aluminum', 'redox-basic'],
      Na: ['sodium', 'redox-basic'],
      K: ['sodium', 'redox-basic'],
      Li: ['sodium', 'redox-basic'],
      Mg: ['aluminum', 'redox-basic'],
      Ca: ['sodium', 'redox-basic'],
      Ba: ['aluminum', 'precipitation-equilibrium'],
      S: ['sulfur', 'redox-basic'],
      N: ['nitrogen', 'redox-basic'],
      P: ['nitrogen', 'redox-basic'],
      As: ['nitrogen', 'redox-basic'],
      Cl: ['chlorine', 'redox-basic'],
      Br: ['chlorine', 'redox-basic'],
      I: ['chlorine', 'redox-basic'],
      F: ['chlorine', 'redox-basic'],
      Si: ['silicon', 'chemical-bond'],
      C: ['silicon', 'redox-basic'],
      Mn: ['manganese-chromium', 'redox-basic'],
      Cr: ['manganese-chromium', 'redox-basic'],
      Ti: ['manganese-chromium', 'redox-basic'],
      V: ['manganese-chromium', 'redox-basic'],
      Co: ['iron', 'redox-basic'],
      Ni: ['iron', 'redox-basic'],
      Zn: ['aluminum', 'redox-basic'],
      Ag: ['copper', 'precipitation-equilibrium'],
      Mo: ['manganese-chromium', 'redox-basic'],
      W: ['manganese-chromium', 'redox-basic'],
      Pb: ['aluminum', 'redox-basic'],
      Bi: ['nitrogen', 'redox-basic'],
      Sn: ['silicon', 'redox-basic'],
      Sb: ['nitrogen', 'redox-basic'],
      Se: ['sulfur', 'redox-basic'],
      Te: ['sulfur', 'redox-basic'],
      B: ['silicon', 'chemical-bond'],
      Ga: ['aluminum', 'redox-basic'],
      In: ['aluminum', 'redox-basic'],
      Tl: ['aluminum', 'redox-basic'],
      H: ['redox-basic', 'chemical-bond'],
      O: ['redox-basic', 'chemical-bond'],
    }

    const nodeIds = directNodeMap[symbol] || ['redox-basic']
    return nodeIds
      .map(id => getKnowledgeNode(id))
      .filter((node): node is NonNullable<typeof node> => Boolean(node))
  }, [currentConfig.symbol])

  // ───────────────────────────────────────────────────────────────────────────
  // 右屏 Right Panel 内容 (常驻显示：焦点物质高考全景档案 + 性质拆解 + 升降规律 + 高考要点)
  // 严格与左屏所选元素 100% 动态同步，绝无无关内容干扰
  // ───────────────────────────────────────────────────────────────────────────
  const rightContent = (
    <div className="w-full h-full flex flex-col gap-3.5 p-3.5 bg-slate-50/60 overflow-y-auto font-sans">
      {/* 模块 1：焦点物质高考全景档案卡 */}
      {selectedSubstance && (
        <div className="p-3.5 rounded-2xl border border-indigo-200 bg-white shadow-2xs flex flex-col gap-2.5">
          {/* 顶栏：化学式与价态类别 */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-xs shadow-2xs shrink-0"
                style={{ backgroundColor: selectedSubstance.rgbColor || '#CBD5E1', color: '#0F172A' }}
              >
                {selectedSubstance.substance.slice(0, 2)}
              </div>
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-1">
                <ChemicalFormula formula={selectedSubstance.substance} />
                <span className="text-xs font-medium text-slate-400">全景档案</span>
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded-md border border-indigo-200">
                {selectedSubstance.valence > 0 ? `+${selectedSubstance.valence}` : selectedSubstance.valence} 价
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                {selectedSubstance.category}
              </span>
            </div>
          </div>

          {/* 物理形态与色泽 */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-medium">聚集形态</span>
              <span className="font-bold text-slate-800 truncate">{selectedPhysicalState}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-medium">外观与颜色</span>
              <span className="font-bold text-slate-800 truncate flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block border border-slate-300 shrink-0"
                  style={{ backgroundColor: selectedSubstance.rgbColor || '#CBD5E1' }}
                />
                {selectedSubstance.colorText}
              </span>
            </div>
          </div>

          {/* 性质定位与角色 */}
          {selectedSubstance.roleDescription && (
            <div className="text-xs text-slate-700 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100 flex items-center justify-between">
              <span className="font-bold text-indigo-900 shrink-0">性质定位：</span>
              <span className="text-indigo-950 font-medium text-right">{selectedSubstance.roleDescription}</span>
            </div>
          )}

          {/* 特征实验现象与判分点 */}
          {selectedSubstance.testReaction && (
            <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col gap-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1 text-rose-700">
                  <Beaker className="w-3.5 h-3.5" />
                  高考特征实验现象与判分点：
                </span>
              </div>
              <span className="text-slate-700 leading-relaxed font-medium">
                {selectedSubstance.testReaction}
              </span>
            </div>
          )}

          {/* 规范离子/化学方程式 (消除黑色底纹，采用统一学术浅色高亮) */}
          {selectedSubstance.equation && (
            <div className="text-xs bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl flex flex-col gap-1 font-mono shadow-2xs">
              <span className="text-[10px] text-indigo-700 font-sans font-bold">
                规范高考化学 / 离子方程式：
              </span>
              <div className="font-bold select-text text-xs leading-relaxed text-indigo-950">
                <ChemicalFormula formula={selectedSubstance.equation} />
              </div>
            </div>
          )}

          {/* 价态升降核心转化链 (结构化拆解) */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              价态升降核心转化链：
            </span>

            {/* 向上升高氧化 */}
            {upwardOxidations.length > 0 && (
              <div className="p-2.5 bg-rose-50/50 rounded-xl border border-rose-200/70 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-rose-800 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                    ↑ 升高氧化（失电子 · 表现还原性）
                  </span>
                  <span className="text-[9px] font-mono text-rose-600 bg-rose-100/80 px-1.5 py-0.2 rounded font-bold">
                    {upwardOxidations.length} 条转化
                  </span>
                </span>
                <div className="flex flex-col gap-1.5">
                  {upwardOxidations.map(t => (
                    <div
                      key={t.id}
                      className="p-2 bg-white rounded-lg border border-rose-200/80 shadow-2xs flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <ChemicalFormula formula={t.fromSubstance} />
                          <span className="text-rose-500 font-bold">➔</span>
                          <ChemicalFormula formula={t.toSubstance} />
                        </span>
                        {t.electronTransfer && (
                          <span className="text-[9px] font-mono text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded font-bold border border-rose-100">
                            {t.electronTransfer}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-start gap-1 bg-slate-50 p-1.5 rounded border border-slate-100">
                        <span className="text-rose-600 font-bold shrink-0">所需试剂:</span>
                        <span className="text-slate-700 leading-snug">{t.reagent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 向下降低还原 */}
            {downwardReductions.length > 0 && (
              <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-200/70 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-blue-800 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-blue-600" />
                    ↓ 降低还原（得电子 · 表现氧化性）
                  </span>
                  <span className="text-[9px] font-mono text-blue-600 bg-blue-100/80 px-1.5 py-0.2 rounded font-bold">
                    {downwardReductions.length} 条转化
                  </span>
                </span>
                <div className="flex flex-col gap-1.5">
                  {downwardReductions.map(t => (
                    <div
                      key={t.id}
                      className="p-2 bg-white rounded-lg border border-blue-200/80 shadow-2xs flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <ChemicalFormula formula={t.fromSubstance} />
                          <span className="text-blue-500 font-bold">➔</span>
                          <ChemicalFormula formula={t.toSubstance} />
                        </span>
                        {t.electronTransfer && (
                          <span className="text-[9px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-bold border border-blue-100">
                            {t.electronTransfer}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-start gap-1 bg-slate-50 p-1.5 rounded border border-slate-100">
                        <span className="text-blue-600 font-bold shrink-0">所需试剂:</span>
                        <span className="text-slate-700 leading-snug">{t.reagent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 类别转化 */}
            {otherTransformations.length > 0 && (
              <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-200/70 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-emerald-800 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 text-emerald-600" />
                    ↔ 类别转化（酸碱 / 沉淀 / 水化）
                  </span>
                  <span className="text-[9px] font-mono text-emerald-600 bg-emerald-100/80 px-1.5 py-0.2 rounded font-bold">
                    {otherTransformations.length} 条转化
                  </span>
                </span>
                <div className="flex flex-col gap-1.5">
                  {otherTransformations.map(t => (
                    <div
                      key={t.id}
                      className="p-2 bg-white rounded-lg border border-emerald-200/80 shadow-2xs flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <ChemicalFormula formula={t.fromSubstance} />
                          <span className="text-emerald-500 font-bold">➔</span>
                          <ChemicalFormula formula={t.toSubstance} />
                        </span>
                        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold border border-emerald-100">
                          非氧化还原
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-start gap-1 bg-slate-50 p-1.5 rounded border border-slate-100">
                        <span className="text-emerald-600 font-bold shrink-0">所需试剂:</span>
                        <span className="text-slate-700 leading-snug">{t.reagent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 模块 2：高考必考要点提炼 (随着当前选中元素 100% 联动更新) */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
        <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 pb-1 border-b border-slate-100">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          {currentConfig.name} 高考必考要点提炼
        </h4>
        <div className="flex flex-col gap-1.5">
          {(currentConfig.examTips || (modelNode ? modelNode.examPointSummary : [])).map((pt, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span className="leading-relaxed">{pt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 模块 3：当前元素关联教材知识体系 (100% 与左屏选中元素同步，绝无无关内容) */}
      {currentElementKnowledgeNodes.length > 0 && (
        <div className="p-3 bg-white rounded-2xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              {currentConfig.symbol} 关联课标教材章节
            </h4>
            <span className="text-[10px] text-indigo-600 font-medium">点击直达微观场景</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {currentElementKnowledgeNodes.map(knode => {
              const animId = knode.animationIds?.[0]
              return (
                <button
                  key={knode.id}
                  onClick={() => {
                    if (animId) {
                      navigate(`/animation/${animId}`)
                    } else {
                      navigate('/')
                    }
                  }}
                  className="p-2 rounded-xl border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100/70 text-xs flex items-center justify-between transition-all text-left group shadow-2xs"
                  title={animId ? `点击进入微观动画场景：${knode.title}` : `点击查看教材知识体系：${knode.title}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-950 group-hover:text-indigo-700 transition-colors">
                      {knode.title}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-indigo-600 text-white">
                      {currentConfig.symbol} 核心课标
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 group-hover:text-indigo-700">
                    <span>
                      {knode.chapter} · {knode.module}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  // 组装标准 ThreePanel
  return (
    <div className="w-full h-screen flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
      <GaokaoToolHeader
        modelId="model-valence-matrix"
        viewMode={mainView === 'matrix' ? 0 : mainView === 'scoring' ? 1 : 2}
        onViewModeChange={m => {
          setMainView(m === 0 ? 'matrix' : m === 1 ? 'scoring' : 'quiz')
        }}
      />
      <div className="flex-1 overflow-hidden">
        <ThreePanel left={leftContent} center={centerContent} right={rightContent} />
      </div>
    </div>
  )
}
