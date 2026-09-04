import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Zap,
  FlaskConical,
  Atom,
  TestTube,
  Dna,
  Grid,
  Split,
  Layers,
  GitCompare,
  Layers3,
  LucideIcon,
} from 'lucide-react'
import { GaokaoModelNode, getGaokaoModel } from '@/data/gaokaoModels'
import { renderNaText } from '@/utils'

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  FlaskConical,
  Atom,
  TestTube,
  Dna,
  Grid,
  Split,
  Layers,
  GitCompare,
  Layers3,
}

export interface GaokaoToolHeaderProps {
  /** 母题 ID 或完整模型数据 */
  modelId?: string
  model?: GaokaoModelNode
  /** 自定义标题（若不传则从 model 获取） */
  title?: string
  subtitle?: string
  badgeText?: string
  badgeColor?: string
  /** 视角模式 (0: 图谱探究 | 1: 规范踩分 | 2: 真题研析) */
  viewMode?: number
  onViewModeChange?: (mode: number) => void
  /** 是否开启视角 Tab（默认 true） */
  showViewTabs?: boolean
  /** 备用额外右侧元素 */
  extraRight?: React.ReactNode
}

export const GaokaoToolHeader: React.FC<GaokaoToolHeaderProps> = ({
  modelId,
  model: propModel,
  title: propTitle,
  subtitle: propSubtitle,
  badgeText: propBadgeText,
  badgeColor: propBadgeColor,
  viewMode = 0,
  onViewModeChange,
  showViewTabs = true,
  extraRight,
}) => {
  const navigate = useNavigate()

  const model = propModel || (modelId ? getGaokaoModel(modelId) : undefined)
  const title = propTitle || model?.title || '高考专属提分工具'
  const subtitle = propSubtitle || model?.subtitle || '高考高频解题母题与记忆强化矩阵'
  const badgeText = propBadgeText || model?.badgeText || '解题母题'
  const badgeColor =
    propBadgeColor || model?.badgeColor || 'bg-indigo-100 text-indigo-800 border-indigo-200'

  const IconComp = (model?.iconName && ICON_MAP[model.iconName]) || Sparkles

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between shadow-sm shrink-0 select-none">
      {/* 左侧返回与标题区 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/?view=gaokao')}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="返回高考母题索引"
        >
          <ArrowLeft className="w-4 h-4" />
          返回高考母题索引
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white flex items-center gap-1.5">
              <IconComp className="w-4 h-4 text-indigo-400 shrink-0" />
              {renderNaText(title)}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${badgeColor}`}>
              {renderNaText(badgeText)}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">{subtitle}</span>
        </div>
      </div>

      {/* 右侧 Tabs / 操作区 */}
      <div className="flex items-center gap-3">
        {extraRight}

        {showViewTabs && onViewModeChange && (
          <div className="flex bg-slate-800/90 p-1 rounded-lg border border-slate-700/80 shadow-inner">
            <button
              onClick={() => onViewModeChange(0)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 0
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              图谱探究
            </button>

            <button
              onClick={() => onViewModeChange(1)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 1
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              规范踩分
            </button>

            <button
              onClick={() => onViewModeChange(2)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 2
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              真题研析
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
