import { useState, useMemo } from 'react'
import {
  Sparkles,
  FlaskConical,
  Zap,
  TestTube,
  Layers,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Atom,
  HelpCircle,
  Edit3,
} from 'lucide-react'
import {
  VALENCE_MATRIX_DATA,
  type ValenceCategory,
  type ValenceSubstanceNode,
} from '@/data/valence-matrix'
import { ThreePanel } from '@/components/Layout'
import { LeftPanel, LeftPanelSection } from '@/components/UI/LeftPanel'
import { ScoringCardSection, GaokaoVariantQuiz, ChemicalFormula } from '@/components/UI'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { getKnowledgeNode } from '@/data/knowledgeTree'
import { getModelQuizData } from '@/data/gaokaoQuizData'
import { TestTubeApparatus } from './TestTubeApparatus'
import { CHEMISTRY_COLORS, colors } from '@/theme'

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
export type MatrixInquiryMode = 'overview' | 'redox-path' | 'color-test'

/**
 * ValenceMatrixCanvas — 无机元素“价类二维矩阵”探究工具 (标准的 ThreePanel 三屏架构 & 中屏平行视角)
 *
 * 覆盖高中化学高考 9 大核心无机元素 (Fe, Cu, Al, Na, S, N, Cl, Si, C)
 * 与 2 大高考工业流程延伸元素 (Mn, Cr)。
 * 三屏分级与平行视角架构：
 * - 左屏 (LeftPanel): 主视角切换 Tabs (矩阵 / 手算 / 刷题) + 11大元素切换 + 探究模式控制 + 显色演练触发
 * - 中屏舞台 (Center Panel):
 *     1) 视角 A: 【2D 价类二维矩阵 & 试管显色演练 SVG 场景】
 *     2) 视角 B: 【踩分点规范手算演练 (宽屏舒适排版)】
 *     3) 视角 C: 【近 3 年高考真实情境变式盲盒 (宽屏舒适刷题)】
 * - 右屏 (RightPanel): 常驻焦点物质性质拆解 + 离子方程式 + 高考要点提炼 + 关联教材知识节点
 */
export function ValenceMatrixCanvas({
  defaultElementSymbol = 'Fe',
  elementName: customElementName,
  valences: customValences,
  categories: customCategories,
  items: customItems,
}: ValenceMatrixCanvasProps) {
  // 1. 中屏主视角平行切换：'matrix' 矩阵 & 显色 | 'scoring' 手算演练 | 'quiz' 高考真题变式
  const [mainView, setMainView] = useState<MainViewMode>('matrix')

  // 选中的元素符号 (如 'Fe', 'Cu', 'S', 'N', 'Mn', 'Cr')
  const [selectedSymbol, setSelectedSymbol] = useState<string>(defaultElementSymbol)

  // 矩阵内部探究模式：'overview' 全景矩阵 | 'redox-path' 转化路径 | 'color-test' 显色演练
  const [inquiryMode, setInquiryMode] = useState<MatrixInquiryMode>('overview')

  // 当前调用的元素全量数据
  const currentConfig = useMemo(() => {
    return VALENCE_MATRIX_DATA[selectedSymbol] || VALENCE_MATRIX_DATA['Fe']
  }, [selectedSymbol])

  // 矩阵维数（化合价与类别）
  const activeValences = customValences || currentConfig.valences
  const activeCategories: ValenceCategory[] =
    (customCategories as ValenceCategory[]) || currentConfig.categories

  // 选中的化学物质节点
  const [selectedSubstance, setSelectedSubstance] = useState<ValenceSubstanceNode | null>(
    currentConfig.items[0] || null
  )

  // 试剂检验显色动画状态
  const [isTesting, setIsTesting] = useState(false)

  // 获取模型元数据与试题
  const modelNode = getGaokaoModel('model-valence-matrix')
  const quizData = getModelQuizData('model-valence-matrix')

  // 获取交叉点的物质节点
  const getItem = (valence: number, cat: ValenceCategory): ValenceSubstanceNode | undefined => {
    if (customItems) {
      const found = customItems.find(i => i.valence === valence && i.category === cat)
      if (!found) return undefined
      return {
        substance: found.substance,
        valence: found.valence,
        category: found.category as ValenceCategory,
        colorText: found.colorText,
        colorStyle: found.colorStyle,
        rgbColor: found.rgbColor || colors.neutral[300],
        testReaction: found.testReaction,
        equation: found.equation,
      }
    }
    return currentConfig.items.find(i => i.valence === valence && i.category === cat)
  }

  // 点击元素 Tab 切换
  const handleSymbolChange = (symbol: string) => {
    setSelectedSymbol(symbol)
    const newCfg = VALENCE_MATRIX_DATA[symbol]
    if (newCfg && newCfg.items.length > 0) {
      setSelectedSubstance(newCfg.items[0])
    }
    setIsTesting(false)
  }

  // 触发表征检验显色动画
  const handleRunTest = () => {
    setInquiryMode('color-test')
    setIsTesting(true)
    setTimeout(() => setIsTesting(false), 2500)
  }

  // 选中的物质相关的转化路径
  const relatedTransformations = useMemo(() => {
    if (!selectedSubstance) return currentConfig.transformations
    return currentConfig.transformations.filter(
      t =>
        t.fromSubstance.includes(selectedSubstance.substance) ||
        t.toSubstance.includes(selectedSubstance.substance)
    )
  }, [selectedSubstance, currentConfig])

  // ───────────────────────────────────────────────────────────────────────────
  // 左屏 Panel 内容 (左侧控制器)
  // ───────────────────────────────────────────────────────────────────────────
  const leftContent = (
    <LeftPanel>
      {/* 1. 中屏主视角平行切换 */}
      <LeftPanelSection
        title={
          <span className="flex items-center gap-1.5 font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            中屏主视角切换
          </span>
        }
        subtitle="中屏舞台平行体验，视野更宽广"
      >
        <div className="flex flex-col gap-1.5 pt-1">
          <button
            onClick={() => setMainView('matrix')}
            className={`w-full py-2 px-2.5 text-xs font-bold rounded-lg border text-left flex items-center justify-between transition-all ${
              mainView === 'matrix'
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm scale-[1.02]'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              1. 价类二维矩阵 & 显色
            </span>
            {mainView === 'matrix' && <span className="text-xs">✓</span>}
          </button>

          <button
            onClick={() => setMainView('scoring')}
            className={`w-full py-2 px-2.5 text-xs font-bold rounded-lg border text-left flex items-center justify-between transition-all ${
              mainView === 'scoring'
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm scale-[1.02]'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Edit3 className="w-4 h-4" />
              2. 踩分点规范手算演练
            </span>
            {mainView === 'scoring' && <span className="text-xs">✓</span>}
          </button>

          <button
            onClick={() => setMainView('quiz')}
            className={`w-full py-2 px-2.5 text-xs font-bold rounded-lg border text-left flex items-center justify-between transition-all ${
              mainView === 'quiz'
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm scale-[1.02]'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              3. 高考真题变式盲盒
            </span>
            {mainView === 'quiz' && <span className="text-xs">✓</span>}
          </button>
        </div>
      </LeftPanelSection>

      {/* 2. 元素选择 Section */}
      <LeftPanelSection
        title={
          <span className="flex items-center gap-1.5 font-bold text-slate-800">
            <Atom className="w-4 h-4 text-indigo-600" />
            无机元素矩阵切换
          </span>
        }
        subtitle="高考必考 9 大元素 + 2 大工业延伸"
      >
        <div className="flex flex-col gap-2 pt-1">
          <div className="text-[11px] font-bold text-slate-600">高考核心 9 大元素:</div>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.values(VALENCE_MATRIX_DATA)
              .filter(e => e.isCoreGaokao)
              .map(cfg => {
                const isActive = selectedSymbol === cfg.id
                return (
                  <button
                    key={cfg.id}
                    onClick={() => handleSymbolChange(cfg.id)}
                    className={`py-1 rounded text-xs font-bold border transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm scale-105'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50'
                    }`}
                  >
                    {cfg.symbol}
                  </button>
                )
              })}
          </div>

          <div className="text-[11px] font-bold text-amber-700 pt-1">工业流程延伸元素:</div>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.values(VALENCE_MATRIX_DATA)
              .filter(e => !e.isCoreGaokao)
              .map(cfg => {
                const isActive = selectedSymbol === cfg.id
                return (
                  <button
                    key={cfg.id}
                    onClick={() => handleSymbolChange(cfg.id)}
                    className={`py-1 rounded text-xs font-bold border transition-all ${
                      isActive
                        ? 'bg-amber-600 text-white border-amber-700 shadow-sm scale-105'
                        : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    {cfg.symbol}
                  </button>
                )
              })}
          </div>
        </div>
      </LeftPanelSection>

      {/* 3. 探究模式 Section (仅在 matrix 模式下有效) */}
      {mainView === 'matrix' && (
        <LeftPanelSection
          title={
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Layers className="w-4 h-4 text-indigo-600" />
              矩阵探究模式
            </span>
          }
        >
          <div className="flex flex-col gap-1.5 pt-1">
            <button
              onClick={() => setInquiryMode('overview')}
              className={`w-full py-1.5 px-2.5 text-xs font-semibold rounded-lg border text-left flex items-center justify-between transition-all ${
                inquiryMode === 'overview'
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                全景二维矩阵
              </span>
              {inquiryMode === 'overview' && <span className="text-[10px] text-indigo-600 font-bold">✓</span>}
            </button>

            <button
              onClick={() => setInquiryMode('redox-path')}
              className={`w-full py-1.5 px-2.5 text-xs font-semibold rounded-lg border text-left flex items-center justify-between transition-all ${
                inquiryMode === 'redox-path'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                氧化还原路径网
              </span>
              {inquiryMode === 'redox-path' && <span className="text-[10px] text-amber-600 font-bold">✓</span>}
            </button>

            <button
              onClick={() => setInquiryMode('color-test')}
              className={`w-full py-1.5 px-2.5 text-xs font-semibold rounded-lg border text-left flex items-center justify-between transition-all ${
                inquiryMode === 'color-test'
                  ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <TestTube className="w-3.5 h-3.5 text-rose-600" />
                特征试管显色演练
              </span>
              {inquiryMode === 'color-test' && <span className="text-[10px] text-rose-600 font-bold">✓</span>}
            </button>
          </div>
        </LeftPanelSection>
      )}

      {/* 4. 显色试剂演练操作 */}
      {selectedSubstance && selectedSubstance.testReaction && mainView === 'matrix' && (
        <LeftPanelSection
          title={
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <TestTube className="w-4 h-4 text-rose-500" />
              试管显色演练触发
            </span>
          }
        >
          <div className="flex flex-col gap-2 pt-1">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              演练 <ChemicalFormula formula={selectedSubstance.substance} className="font-bold text-indigo-700" /> 的特征试剂显色与离子检验：
            </p>
            <button
              onClick={handleRunTest}
              className="w-full py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <TestTube className="w-4 h-4 text-rose-200" />
              触发表征/试管滴加演练
            </button>
          </div>
        </LeftPanelSection>
      )}
    </LeftPanel>
  )

  // ───────────────────────────────────────────────────────────────────────────
  // 中屏 Center Panel 内容 (根据 mainView 平行视角动态切换)
  // ───────────────────────────────────────────────────────────────────────────
  const centerContent = (
    <div className="w-full h-full flex flex-col p-4 bg-white overflow-y-auto gap-4 font-sans">
      {/* 1. 视角 A: 价类二维矩阵 & 特征试管显色演练 */}
      {mainView === 'matrix' && (
        <>
          {/* 标题说明栏 */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-base">
                {customElementName || currentConfig.name} — 二维价类矩阵与显色探究
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
              点击矩阵格切换焦点物质
            </span>
          </div>

          {/* 2D 矩阵 Grid Canvas */}
          <div className="flex-1 min-h-[340px] border border-slate-200 rounded-xl bg-slate-50/50 p-2 overflow-auto relative shadow-2xs">
            <table className="w-full h-full border-collapse select-none">
              <thead>
                <tr>
                  <th className="p-2 border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600 w-28">
                    类别 \ 化合价
                  </th>
                  {activeValences.map(v => (
                    <th
                      key={v}
                      className="p-2 border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 text-center"
                    >
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                          v > 0
                            ? 'bg-rose-50 text-rose-700'
                            : v < 0
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {v > 0 ? `+${v}` : v}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeCategories.map(cat => (
                  <tr key={cat}>
                    <td className="p-2 border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 text-center">
                      {cat}
                    </td>
                    {activeValences.map(v => {
                      const node = getItem(v, cat)
                      const isSelected = selectedSubstance?.substance === node?.substance
                      return (
                        <td
                          key={v}
                          onClick={() => node && setSelectedSubstance(node)}
                          className={`p-2 border border-slate-200 text-center transition-all cursor-pointer relative ${
                            node
                              ? isSelected
                                ? 'bg-indigo-100/80 border-indigo-400 shadow-inner ring-2 ring-indigo-400 ring-offset-1'
                                : 'bg-white hover:bg-indigo-50/60'
                              : 'bg-slate-100/30'
                          }`}
                        >
                          {node ? (
                            <div className="flex flex-col items-center gap-1 py-1">
                              <ChemicalFormula formula={node.substance} className="font-bold text-sm text-slate-900" />
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${node.colorStyle}`}>
                                {node.colorText}
                              </span>

                              <div className="flex items-center gap-1 mt-0.5">
                                {node.isOxidant && (
                                  <span className="text-[9px] px-1 bg-red-100 text-red-800 rounded font-bold">
                                    氧化性
                                  </span>
                                )}
                                {node.isReductant && (
                                  <span className="text-[9px] px-1 bg-blue-100 text-blue-800 rounded font-bold">
                                    还原性
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-300 text-xs font-mono">—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 氧化还原路径网模式 */}
            {inquiryMode === 'redox-path' && (
              <div className="mt-3 p-3 rounded-lg border border-amber-200 bg-amber-50/70 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    {currentConfig.symbol} 元素氧化还原核心转化路径网络 ({currentConfig.transformations.length} 条)
                  </span>
                  <span className="text-[11px] text-amber-700">
                    电子转移: 高价得电子作氧化剂，低价失电子作还原剂
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentConfig.transformations.map(trans => (
                    <div
                      key={trans.id}
                      className="p-2 rounded bg-white border border-amber-200 text-xs flex flex-col gap-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span className="flex items-center gap-1 text-indigo-700">
                          <ChemicalFormula formula={trans.fromSubstance} />
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <ChemicalFormula formula={trans.toSubstance} />
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded">
                          试剂: {trans.reagent}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 bg-slate-50 p-1 rounded">
                        <ChemicalFormula formula={trans.equation} />
                      </div>
                      <div className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
                        <span>✨ {trans.electronTransfer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 真实化学试管滴加与显色演练 SVG 实物场景 (当探究模式为 color-test 或处于演练中时) */}
          {(inquiryMode === 'color-test' || isTesting) && selectedSubstance && (
            <div className="p-4 bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col gap-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-rose-600" />
                  <span className="font-bold text-sm text-slate-800">
                    特征显色与试剂反应实物演练：
                    <ChemicalFormula formula={selectedSubstance.substance} className="text-indigo-700" />
                  </span>
                </div>
                {isTesting && (
                  <span className="text-xs font-bold text-rose-600 animate-pulse flex items-center gap-1">
                    ✨ 滴管滴入试剂，颜色平滑扩散中...
                  </span>
                )}
              </div>

              {/* SVG 实物试管与滴管演练区 */}
              <div className="flex items-center justify-center p-3 bg-white rounded-lg border border-slate-200">
                <svg width="320" height="150" viewBox="0 0 320 150" className="overflow-visible">
                  {/* 胶头滴管 */}
                  <g transform="translate(145, 5)">
                    <rect x="10" y="0" width="10" height="12" rx="3" fill="#ef4444" opacity="0.85" />
                    <rect x="12" y="12" width="6" height="25" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                    {/* 滴落的试剂液滴 */}
                    <circle
                      cx="15"
                      cy={isTesting ? 45 : 37}
                      r="3"
                      fill={selectedSubstance.rgbColor || CHEMISTRY_COLORS.indicator}
                      className={isTesting ? 'animate-bounce' : ''}
                    />
                  </g>

                  {/* 试管主场景 */}
                  <TestTubeApparatus
                    x={130}
                    y={40}
                    width={40}
                    height={100}
                    fillLevel={0.6}
                    fillColor={selectedSubstance.rgbColor || CHEMISTRY_COLORS.indicator}
                    precipitateLevel={selectedSubstance.substance.includes('OH') ? 0.25 : 0}
                    precipitateColor={selectedSubstance.rgbColor || CHEMISTRY_COLORS.indicator}
                    label={selectedSubstance.substance}
                  />

                  {/* 现象标注 Callout */}
                  <g transform="translate(190, 60)">
                    <rect x="0" y="0" width="120" height="50" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="8" y="20" fontSize="11" fontWeight="bold" fill="#1e293b">
                      外观/溶液显色:
                    </text>
                    <text x="8" y="38" fontSize="11" fontWeight="semibold" fill="#4338ca">
                      {selectedSubstance.colorText}
                    </text>
                  </g>
                </svg>
              </div>

              {/* 反应检验现象说明 */}
              {selectedSubstance.testReaction && (
                <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed font-sans">
                  <span className="font-bold text-slate-900">【特征检验现象】</span>
                  {selectedSubstance.testReaction}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* 2. 视角 B: 踩分点规范手算演练 (宽屏舒适呈现) */}
      {mainView === 'scoring' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-600" />
              无机元素高考踩分点规范手算演练
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              高考踩分要点 · 离子方程式与规范书写
            </span>
          </div>

          {quizData && quizData.scoringSteps.length > 0 ? (
            <ScoringCardSection steps={quizData.scoringSteps} />
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-lg border">
              当前暂无踩分点手算题目
            </div>
          )}
        </div>
      )}

      {/* 3. 视角 C: 近 3 年高考真实情境变式盲盒 (宽屏舒适刷题) */}
      {mainView === 'quiz' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              近 3 年高考真实情境变式盲盒 (母题拆解)
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              宽屏舒展排版 · 真题刷题与模型盲盒对齐
            </span>
          </div>

          {quizData && quizData.variantQuizzes.length > 0 ? (
            <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-lg border">
              当前暂无高考真题变式盲盒
            </div>
          )}
        </div>
      )}
    </div>
  )

  // ───────────────────────────────────────────────────────────────────────────
  // 右屏 Right Panel 内容 (常驻显示：焦点物质性质 + 离子方程式 + 高考要点 + 教材节点)
  // ───────────────────────────────────────────────────────────────────────────
  const rightContent = (
    <div className="w-full h-full flex flex-col gap-4 p-4 bg-white overflow-y-auto font-sans">
      {/* 焦点物质详情卡片 */}
      {selectedSubstance && (
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 flex flex-col gap-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              焦点物质：<ChemicalFormula formula={selectedSubstance.substance} className="text-indigo-700" />
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded border border-indigo-200">
              {selectedSubstance.valence > 0 ? `+${selectedSubstance.valence}` : selectedSubstance.valence} 价 | {selectedSubstance.category}
            </span>
          </div>

          {selectedSubstance.roleDescription && (
            <div className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">性质定位：</span>
              <span className="text-indigo-900 font-medium">{selectedSubstance.roleDescription}</span>
            </div>
          )}

          {selectedSubstance.testReaction && (
            <div className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200 flex flex-col gap-1">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                特征检验现象：
              </span>
              <span className="text-slate-600 leading-relaxed">{selectedSubstance.testReaction}</span>
            </div>
          )}

          {selectedSubstance.equation && (
            <div className="text-xs text-slate-800 bg-indigo-50/80 p-2 rounded border border-indigo-100 flex flex-col gap-1">
              <span className="font-sans font-bold text-indigo-900">核心化学/离子方程式：</span>
              <ChemicalFormula formula={selectedSubstance.equation} className="text-slate-900 font-semibold" />
            </div>
          )}

          {relatedTransformations.length > 0 && (
            <div className="text-xs text-slate-700 pt-1 border-t border-slate-200">
              <span className="font-bold text-slate-800">关联转化路径：</span>
              <div className="flex flex-col gap-1 mt-1">
                {relatedTransformations.slice(0, 3).map(t => (
                  <div
                    key={t.id}
                    className="p-1.5 bg-white border border-slate-200 rounded text-[11px] text-slate-800"
                  >
                    <ChemicalFormula formula={t.fromSubstance} /> ➔ <ChemicalFormula formula={t.toSubstance} /> ({t.reagent}): <ChemicalFormula formula={t.equation} className="font-bold text-indigo-700" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 高考必考要点提炼 (随着左屏选中元素 selectedSymbol 动态联动更新) */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
        <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 pb-1 border-b border-slate-100">
          <Sparkles className="w-4 h-4 text-amber-500" />
          {currentConfig.name} 高考必考要点提炼
        </h4>
        <div className="flex flex-col gap-1.5">
          {(currentConfig.examTips || (modelNode ? modelNode.examPointSummary : [])).map((pt, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{pt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 关联教材知识节点 */}
      {modelNode && (
        <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
          <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            关联教材知识节点 ({modelNode.relatedKnowledgeIds.length})
          </h4>
          <div className="flex flex-col gap-1">
            {modelNode.relatedKnowledgeIds.map(kid => {
              const knode = getKnowledgeNode(kid)
              return (
                <div
                  key={kid}
                  className="p-1.5 rounded bg-indigo-50/50 border border-indigo-100 text-xs flex items-center justify-between text-indigo-900"
                >
                  <span className="font-medium">{knode ? knode.title : kid}</span>
                  <span className="text-[10px] text-indigo-600 font-mono">
                    {knode ? knode.module : '教材考点'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  // 使用标准的 ThreePanel 组件组装
  return <ThreePanel left={leftContent} center={centerContent} right={rightContent} />
}
