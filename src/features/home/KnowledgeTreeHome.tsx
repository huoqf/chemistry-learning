import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Lock,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react'
import { GaokaoModelsHome } from './GaokaoModelsHome'
import { BookOpen, Target } from 'lucide-react'
import { knowledgeTree, resolveAnimationIds } from '@/data/knowledgeTree'
import { getAnimationConfig, getAnimationCount, loadExtendedRegistry } from '@/data/animationRegistry'
import { useProgressStore } from '@/stores'
import { colors } from '@/theme'
import { useRadioGroup } from '@/hooks/useRadioGroup'
import type { KnowledgeNode } from '@/data/types'
import { INTERACTION_MAP, SECTIONS, IMPORTANCE_MAP, type ModuleKey } from './sectionConfig'

// 动画路由：从 registry 动态判断节点是否已开放
const getNodeRoute = (node: KnowledgeNode): string | null => {
  for (const animId of node.animationIds) {
    const config = getAnimationConfig(animId)
    if (config) return `/animation/${animId}`
  }
  return null
}

export function KnowledgeTreeHome() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const viewMode = searchParams.get('view') === 'gaokao' ? 'gaokao' : 'tree'

  const setViewMode = useCallback((mode: 'tree' | 'gaokao') => {
    if (mode === 'gaokao') {
      setSearchParams({ view: 'gaokao' })
    } else {
      setSearchParams({})
    }
  }, [setSearchParams])

  const { masteredKnowledge, setTotalCounts } = useProgressStore()
  const [, setRegistryReady] = useState(false)

  // 视角切换：互斥单选，注入 radiogroup 语义（保留 Banner 视觉与不同选中色）
  const viewKeys = ['tree', 'gaokao'] as const
  const { getItemProps: getViewProps, registerRef: registerViewRef } = useRadioGroup({
    value: viewMode,
    keys: [...viewKeys],
    onChange: (key) => setViewMode(key as 'tree' | 'gaokao'),
    direction: 'linear',
  })
  const setViewRef = useCallback(
    (key: string) => (el: HTMLButtonElement | null) => registerViewRef(key, el),
    [registerViewRef],
  )

  useEffect(() => {
    let active = true
    loadExtendedRegistry().then(() => {
      resolveAnimationIds(knowledgeTree)
      if (active) {
        setTotalCounts(getAnimationCount(), knowledgeTree.length)
        setRegistryReady(true)
      }
    })
    return () => {
      active = false
    }
  }, [setTotalCounts])

  // 统计节点
  const stats = useMemo(() => {
    let activeCount = 0
    knowledgeTree.forEach((node) => {
      if (getNodeRoute(node)) {
        activeCount++
      }
    })
    return {
      total: knowledgeTree.length,
      active: activeCount,
      modules: 5,
    }
  }, [])

  // 按 5 大高考化学 module -> chapter 两级聚类
  const groupedData = useMemo(() => {
    const result: Record<ModuleKey, Record<string, KnowledgeNode[]>> = {
      无机化学: {},
      反应原理: {},
      物质结构: {},
      有机化学: {},
      化学实验: {},
    }

    knowledgeTree.forEach((node) => {
      const moduleKey = node.module as ModuleKey
      const chapterName = node.chapter

      if (result[moduleKey]) {
        if (!result[moduleKey][chapterName]) {
          result[moduleKey][chapterName] = []
        }
        result[moduleKey][chapterName].push(node)
      }
    })

    return result
  }, [])

  if (viewMode === 'gaokao') {
    return <GaokaoModelsHome onSwitchToTextbookTree={() => setViewMode('tree')} />
  }

  // 用 string 变量避免 TS 控制流收窄后比较报错（Banner 两个按钮均需按 viewMode 显示选中态）
  const currentView: string = viewMode

  return (
    <div className="w-full min-h-screen bg-neutral-50 relative pb-16">
      {/* 科技感背景氛围光晕 (使用与 UI Token 对应的淡透色系) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-200/20 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-200/15 rounded-full filter blur-3xl pointer-events-none" />

      {/* 双视角平行模式切换 Banner（radiogroup 语义，保留不同选中色） */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="bg-white border border-neutral-200 rounded-xl p-1.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2" role="radiogroup" aria-label="浏览视角">
            <button
              ref={setViewRef('tree')}
              {...getViewProps('tree')}
              onClick={() => setViewMode('tree')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'tree'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              📖 视角 A：按教材章节浏览 (传统树)
            </button>
            <button
              ref={setViewRef('gaokao')}
              {...getViewProps('gaokao')}
              onClick={() => setViewMode('gaokao')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'gaokao'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Target className="w-4 h-4" />
              🎯 视角 B：高考高频解题母题与记忆矩阵
            </button>
          </div>

          <span className="hidden sm:inline-block text-xs text-neutral-400 font-medium pr-3">
            保留全部 3D 模型与教材知识点
          </span>
        </div>
      </div>

      {/* 头部与系统概览看板 */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-6">
        <div className="relative overflow-hidden bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ backgroundColor: colors.primary[50], color: colors.primary[600] }}
              >
                <GraduationCap size={18} className="animate-bounce" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.primary[600] }}>
                高中化学一轮复习与高考攻坚系统
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-neutral-800 tracking-tight sm:text-4xl mb-3">
              高中化学{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                高考知识地图实验室
              </span>
            </h1>
            <p className="text-neutral-500 max-w-3xl text-sm sm:text-base leading-relaxed">
              全面覆盖必修一/二及选择性必修一/二/三高考全部考点。通过动态交互动画展示微观粒子结构、电化学原理、反应动力学与元素演化本质。
            </p>
          </div>

          {/* 统计看板卡片 */}
          <div className="flex gap-4 sm:gap-6 shrink-0">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-4 min-w-[110px] text-center">
              <div className="text-2xl font-bold" style={{ color: colors.primary[600] }}>
                {stats.active}
              </div>
              <div className="text-xs text-neutral-500 font-medium mt-1">
                已开放实验
              </div>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-4 min-w-[110px] text-center">
              <div className="text-2xl font-bold text-neutral-800">
                {stats.total}
              </div>
              <div className="text-xs text-neutral-500 font-medium mt-1">
                高考总考点
              </div>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-4 min-w-[110px] text-center">
              <div className="text-2xl font-bold text-neutral-800">
                {stats.modules}
              </div>
              <div className="text-xs text-neutral-500 font-medium mt-1">
                学科大板块
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 大化学学科板块网格 */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {SECTIONS.map((section) => {
            const chapters = groupedData[section.key]
            const chapterCount = Object.keys(chapters).length

            return (
              <div key={section.key} className="flex flex-col gap-6">
                {/* 板块头部 */}
                <div
                  className={`p-5 rounded-xl border ${section.borderLight} ${section.bgLight} shadow-sm`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${section.gradient} text-white shadow-sm`}
                      >
                        <section.icon size={20} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-neutral-800 leading-tight">
                          {section.title}
                        </h2>
                        <span className="text-[11px] text-neutral-500 font-medium">
                          {section.subtitle}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${section.badgeClass}`}>
                      {chapterCount} 章节
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed mt-2 pl-1">
                    {section.description}
                  </p>

                  {/* 模块进度条 */}
                  {(() => {
                    const allNodes = Object.values(chapters).flat()
                    const total = allNodes.length
                    const mastered = allNodes.filter(n => masteredKnowledge.includes(n.id)).length
                    const pct = total > 0 ? (mastered / total) * 100 : 0
                    return total > 0 ? (
                      <div className="mt-3 pl-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-neutral-400 font-medium">掌握进度</span>
                          <span className="text-[10px] font-semibold" style={{ color: section.themeColor }}>
                            {mastered}/{total}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: pct === 100 ? colors.success[500] : section.themeColor,
                            }}
                          />
                        </div>
                      </div>
                    ) : null
                  })()}
                </div>

                {/* 章节与知识节点列表 */}
                <div className="flex flex-col gap-5">
                  {Object.entries(chapters).map(([chapterName, nodes]) => (
                    <div
                      key={chapterName}
                      className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-sm font-bold text-neutral-800 border-b border-neutral-100 pb-2.5 mb-4 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-3.5 rounded-full bg-gradient-to-b ${section.gradient}`}
                          />
                          {chapterName}
                        </span>
                        <span className="flex items-center gap-2">
                          {(() => {
                            const mastered = nodes.filter(n => masteredKnowledge.includes(n.id)).length
                            return mastered > 0 ? (
                              <span className="flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: colors.success[600] }}>
                                <CheckCircle2 size={10} />
                                {mastered}/{nodes.length}
                              </span>
                            ) : (
                              <span className="text-[10px] font-normal text-neutral-400">
                                {nodes.length} 考点
                              </span>
                            )
                          })()}
                        </span>
                      </h3>

                      {/* 节点树枝连线流 */}
                      <div className="relative pl-4 flex flex-col gap-3.5 border-l border-neutral-100 ml-1">
                        {nodes.map((node) => {
                          const route = getNodeRoute(node)
                          const isActive = !!route
                          const imp = IMPORTANCE_MAP[node.importance]

                          return (
                            <div key={node.id} className="relative">
                              {/* 树干上的节点指示点 */}
                              <div className="absolute -left-[21px] top-3.5 flex items-center justify-center w-2.5 h-2.5">
                                {isActive ? (
                                  <span className="relative flex h-2.5 w-2.5">
                                    <span
                                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                      style={{ backgroundColor: colors.primary[400] }}
                                    />
                                    <span
                                      className="relative inline-flex rounded-full h-2.5 w-2.5"
                                      style={{ backgroundColor: colors.primary[600] }}
                                    />
                                  </span>
                                ) : (
                                  <span className="h-2 w-2 rounded-full bg-neutral-200" />
                                )}
                              </div>

                              {/* 节点卡片 */}
                              {isActive ? (
                                <div
                                  onClick={() => navigate(route)}
                                  className="group border border-neutral-200 hover:border-blue-500 bg-white p-3 rounded-lg cursor-pointer hover:shadow-[0_4px_16px_rgba(59,130,246,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex items-start justify-between gap-3"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                                      <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${imp.className}`}
                                      >
                                        {imp.label}
                                      </span>
                                      <span
                                        className="text-[10px] px-1.5 py-0.5 rounded font-bold border animate-pulse"
                                        style={{
                                          backgroundColor: colors.success[50],
                                          color: colors.success[700],
                                          borderColor: colors.success[200],
                                        }}
                                      >
                                        实验室已开放
                                      </span>
                                      {masteredKnowledge.includes(node.id) && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold border border-emerald-200 bg-emerald-50 text-emerald-700">
                                          已掌握
                                        </span>
                                      )}
                                      {node.relatedModelIds && node.relatedModelIds.length > 0 && (
                                        <span
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setViewMode('gaokao')
                                          }}
                                          className="text-[10px] px-1.5 py-0.5 rounded font-bold border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors flex items-center gap-0.5 cursor-pointer"
                                          title="点击前往高考提分母题专题"
                                        >
                                          <Target size={10} className="text-amber-600" />
                                          🎯 高考母题 ({node.relatedModelIds.length})
                                        </span>
                                      )}
                                      {node.interactionTags?.map((tag) => {
                                        const cfg = INTERACTION_MAP[tag]
                                        if (!cfg) return null
                                        return (
                                          <span
                                            key={tag}
                                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                                            title={cfg.label}
                                          >
                                            {cfg.label}
                                          </span>
                                        )
                                      })}
                                    </div>
                                    <h4 className="text-xs font-bold text-neutral-800 group-hover:text-blue-600 transition-colors leading-tight">
                                      {node.title}
                                    </h4>
                                  </div>
                                  <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 self-center"
                                    style={{
                                      backgroundColor: colors.primary[50],
                                      color: colors.primary[600],
                                    }}
                                  >
                                    <ArrowRight size={12} />
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="border border-dashed border-neutral-200 bg-neutral-50/60 p-3 rounded-lg opacity-75 hover:opacity-100 transition-opacity flex items-start justify-between gap-3"
                                  title="实验室加紧构建中，敬请期待！"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                                      <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold border opacity-70 ${imp.className}`}
                                      >
                                        {imp.label}
                                      </span>
                                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium border border-neutral-200 bg-neutral-100 text-neutral-500">
                                        规划中
                                      </span>
                                      {node.interactionTags?.map((tag) => {
                                        const cfg = INTERACTION_MAP[tag]
                                        if (!cfg) return null
                                        return (
                                          <span
                                            key={tag}
                                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium border opacity-60 ${cfg.bg} ${cfg.text} ${cfg.border}`}
                                            title={cfg.label}
                                          >
                                            {cfg.label}
                                          </span>
                                        )
                                      })}
                                    </div>
                                    <h4 className="text-xs font-bold text-neutral-600 leading-tight">
                                      {node.title}
                                    </h4>
                                  </div>
                                  <div className="w-5 h-5 rounded-full border border-neutral-200 text-neutral-400 flex items-center justify-center shrink-0 self-center bg-white">
                                    <Lock size={10} />
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default KnowledgeTreeHome
