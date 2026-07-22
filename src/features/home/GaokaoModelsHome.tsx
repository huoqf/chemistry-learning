import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Zap,
  FlaskConical,
  Atom,
  Grid,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react'
import { gaokaoModels, GaokaoModelNode, GaokaoModelCategory } from '@/data/gaokaoModels'

interface GaokaoModelsHomeProps {
  onSwitchToTextbookTree: () => void
}

export function GaokaoModelsHome({ onSwitchToTextbookTree }: GaokaoModelsHomeProps) {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<'all' | GaokaoModelCategory>('all')

  const filteredModels = gaokaoModels.filter(
    m => activeCategory === 'all' || m.category === activeCategory
  )

  const handleCardClick = (model: GaokaoModelNode) => {
    // 跳转至高考专属交互工具页面
    navigate(model.toolRoute)
  }

  const getIconComponent = (name: GaokaoModelNode['iconName']) => {
    switch (name) {
      case 'Zap':
        return Zap
      case 'Atom':
        return Atom
      case 'Grid':
        return Grid
      case 'FlaskConical':
      default:
        return FlaskConical
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50 pb-16">
      {/* 专题板块 Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-600 text-white py-8 px-6 mb-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              高考化学专题提分视界 (Gaokao Master Models)
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              高考高频解题母题与记忆强化矩阵
            </h1>
            <p className="mt-2 text-sm text-orange-100 max-w-2xl">
              打破单章教材束缚，归纳高考选择题压轴与四大主观大题解题规律，结合微观-宏观-图表三屏联动与价类二维矩阵，助力精准提分！
            </p>
          </div>

          <button
            onClick={onSwitchToTextbookTree}
            className="px-4 py-2 bg-white text-slate-800 hover:bg-orange-50 rounded-lg shadow font-medium text-xs flex items-center gap-1.5 transition-all self-start md:self-auto shrink-0"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            切换至 📖 按教材章节浏览
          </button>
        </div>
      </div>

      {/* 分类 Filter Tabs */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            全部母题专题 ({gaokaoModels.length})
          </button>
          <button
            onClick={() => setActiveCategory('master-model')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'master-model'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            🏆 高考解题母题 (突跃/双对比/3D晶胞)
          </button>
          <button
            onClick={() => setActiveCategory('memory-matrix')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'memory-matrix'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            🎨 记忆强化矩阵 (价类二维图/探究显色)
          </button>
        </div>
      </div>

      {/* 母题卡片网格 */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map(model => {
          const IconComponent = getIconComponent(model.iconName)
          return (
            <div
              key={model.id}
              onClick={() => handleCardClick(model)}
              className="bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all p-5 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* 头部 Badge 与 Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${model.badgeColor}`}
                  >
                    {model.badgeText}
                  </span>
                </div>

                {/* 标题与描述 */}
                <h3 className="font-bold text-slate-800 text-base group-hover:text-amber-600 transition-colors">
                  {model.title}
                </h3>
                <p className="text-xs text-amber-700 font-semibold mt-0.5">{model.subtitle}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {model.description}
                </p>

                {/* 考点要点列表 */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    高考必考要点：
                  </span>
                  {model.examPointSummary.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 关联教材考点及跳转按钮 */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>关联教材节点 ({model.relatedKnowledgeIds.length})</span>
                </div>

                <span className="text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  进入解题母题 <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
