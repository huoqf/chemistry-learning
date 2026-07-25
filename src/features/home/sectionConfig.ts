import {
  FlaskConical,
  Zap,
  Atom,
  Dna,
  TestTube,
} from 'lucide-react'
import { colors } from '@/theme'
import type { KnowledgeNode, InteractionType } from '@/data/types'

// ── 交互类型标签配置 ──────────────────────────────────────────────────────

export const INTERACTION_MAP: Record<
  InteractionType,
  { label: string; bg: string; text: string; border: string }
> = {
  '3d-rotate':       { label: '3D旋转',    bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200' },
  'bond-break':      { label: '断键推演',  bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200' },
  'particle-sandbox':{ label: '粒子沙盒',  bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'ion-flow':        { label: '离子流向',  bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200' },
  'valence-matrix':  { label: '价类矩阵',  bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  'crystal-cell':    { label: '晶胞结构',  bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200' },
  'macro-experiment':{ label: '宏观实验',  bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200' },
  'chart-analysis':  { label: '图表分析',  bg: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-200' },
}

/**
 * 高中化学 5 大高考学科板块配置
 * 严格遵循【铁律 4B 颜色语义层级隔离】：
 * 页面 UI 结构统一使用 @/theme/colors 中的系统级 UI Tokens (primary, warning, secondary, success, danger, neutral, accent)
 * 禁止混用 CHEMISTRY_COLORS / SCENE_COLORS / CHART_COLORS
 */
export const SECTIONS = [
  {
    key: '无机化学' as const,
    title: '无机化学与元素化合物',
    subtitle: '必修一 & 选必一无机部分',
    description: '阿伏加德罗常数、离子反应与胶体，Na/Al/Fe/Cu/Mn/Cr及Cl/S/N/Si等元素化合物',
    icon: FlaskConical,
    gradient: 'from-blue-600 to-indigo-600',
    bgLight: 'bg-blue-50/50',
    borderLight: 'border-blue-100',
    badgeClass: 'bg-blue-100 text-blue-800',
    themeColor: colors.primary[600],
  },
  {
    key: '反应原理' as const,
    title: '化学反应原理与电化学',
    subtitle: '选择性必修一核心',
    description: '反应热/盖斯定律、反应速率与化学平衡(Kp/Kc)、水溶液离子平衡与原电池/电解池',
    icon: Zap,
    gradient: 'from-amber-600 to-orange-600',
    bgLight: 'bg-amber-50/50',
    borderLight: 'border-amber-100',
    badgeClass: 'bg-amber-100 text-amber-800',
    themeColor: colors.warning[600],
  },
  {
    key: '物质结构' as const,
    title: '物质结构与晶体性质',
    subtitle: '选择性必修二核心',
    description: '构造原理/电子排布、杂化轨道/VSEPR、配合物与配位键、晶体类型与晶胞密度计算',
    icon: Atom,
    gradient: 'from-purple-600 to-pink-600',
    bgLight: 'bg-purple-50/50',
    borderLight: 'border-purple-100',
    badgeClass: 'bg-purple-100 text-purple-800',
    themeColor: colors.secondary[600],
  },
  {
    key: '有机化学' as const,
    title: '有机化学基础与合成',
    subtitle: '选择性必修三核心',
    description: '烃与官能团衍生物、同分异构体与手性分子、有机谱图(IR/NMR/MS)与加聚/缩聚高分子',
    icon: Dna,
    gradient: 'from-emerald-600 to-teal-600',
    bgLight: 'bg-emerald-50/50',
    borderLight: 'border-emerald-100',
    badgeClass: 'bg-emerald-100 text-emerald-800',
    themeColor: colors.success[600],
  },
  {
    key: '化学实验' as const,
    title: '化学实验与定量分析',
    subtitle: '必修与选必实验综合',
    description: '实验室安全与仪器、气体制备净化、萃取/蒸馏/重结晶提纯、中和滴定与定量分析',
    icon: TestTube,
    gradient: 'from-rose-600 to-red-600',
    bgLight: 'bg-rose-50/50',
    borderLight: 'border-rose-100',
    badgeClass: 'bg-rose-100 text-rose-800',
    themeColor: colors.danger[600],
  },
] as const

export type ModuleKey = typeof SECTIONS[number]['key']

// 重要性标签映射（全部引用 UI Token @/theme/colors）
export const IMPORTANCE_MAP: Record<
  KnowledgeNode['importance'],
  { label: string; className: string }
> = {
  basic: {
    label: '基础',
    className: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  },
  core: {
    label: '核心',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  gaokao: {
    label: '高考高频',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  hard: {
    label: '重难点',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  extend: {
    label: '拓展',
    className: 'bg-purple-50 text-purple-700 border-purple-200',
  },
}
