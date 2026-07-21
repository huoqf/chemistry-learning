import type { ReactNode } from 'react'

/**
 * BaseChart 基础物理图表组件 Props 接口。
 * 所有物理图表的基础设施，提供坐标系、网格、刻度等通用功能。
 */
export interface BaseChartProps {
  /**
   * X 轴物理坐标范围 [min, max]。
   */
  xDomain: [number, number]
  /**
   * Y 轴物理坐标范围 [min, max]。
   */
  yDomain: [number, number]
  /**
   * X 轴标签文本。
   */
  xLabel: string
  /**
   * Y 轴标签文本。
   */
  yLabel: string
  /**
   * 图表标题（显示在图表上方）。
   */
  title?: string
  /**
   * 图表变体。
   * - 'standard': 标准尺寸图表
   * - 'mini': 迷你尺寸图表，适用于嵌入式展示
   * @default 'standard'
   */
  variant?: 'standard' | 'mini'
  /**
   * 初始尺寸（用于响应式图表）。
   * 不传则使用主题中的默认尺寸。
   */
  initialSize?: { width: number; height: number }
  /**
   * 固定尺寸模式：直接指定图表像素宽高，跳过 useCanvasSize DOM 测量。
   * 用于嵌入主 SVG（无需 foreignObject）等场景。传入后返回纯 <g> 而非 <div>+<svg>。
   */
  fixedSize?: { width: number; height: number }
  /**
   * 网格线数量配置。
   * 不传则使用主题中的默认值。
   */
  gridCount?: { x?: number; y?: number }
  /**
   * X 轴刻度格式化函数。
   * 不传则使用智能格式化（自动选择科学计数法或小数位）。
   */
  formatX?: (v: number) => string
  /**
   * Y 轴刻度格式化函数。
   * 不传则使用智能格式化（自动选择科学计数法或小数位）。
   */
  formatY?: (v: number) => string
  /**
   * y 轴基准线位置（物理坐标），默认为 yDomain[0]。
   * 设为 0 可实现双向 Y 轴（正负值都有显示）。
   */
  yBaseline?: number
  /**
   * 是否显示网格线。
   * @default true
   */
  showGrid?: boolean
  /**
   * 第二 Y 轴物理坐标范围 [min, max]（双 Y 轴支持）。
   */
  yDomain2?: [number, number]
  /**
   * 第二 Y 轴标签文本。
   */
  yLabel2?: string
  /**
   * 第二 Y 轴刻度格式化函数。
   */
  formatY2?: (v: number) => string
  /**
   * 第二 y 轴基准线位置（物理坐标），默认为 yDomain2[0]。
   */
  yBaseline2?: number
  /**
   * 子元素（图表插件内容，如曲线、面积、游标等）。
   */
  children?: ReactNode
  /**
   * 额外的 CSS 类名。
   */
  className?: string
}
