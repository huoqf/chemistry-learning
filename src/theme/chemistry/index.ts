/**
 * src/theme/chemistry/index.ts
 * chemistry 子主题统一导出入口
 *
 * 推荐引用方式（组件内）：
 *
 *   import {
 *     CHEMISTRY_COLORS,
 *     SCENE_COLORS,
 *     CANVAS_STYLE,
 *     CHART_COLORS,
 *   } from '@/theme/chemistry'
 *
 * 分组引用（需要更细粒度 tree-shaking 时）：
 *
 *   import { CT_CHART_COLORS, RATE_CHART_COLORS }  from '@/theme/chemistry'
 *   import { STROKE, OPACITY, SVG_ATTR }           from '@/theme/chemistry'
 */

// ─── 化学量颜色与特征配色 ──────────────────────────────────────────────────────
export {
  CHEMISTRY_COLORS,
  CANVAS_COLORS,
  ATOM_COLORS,
  PHENOMENON_COLORS,
  INDICATOR_COLORS,
  withAlpha,
} from './colors'

export type {
  ChemistryColorKey,
  CanvasColorKey,
  AtomColorKey,
  PhenomenonColorKey,
} from './colors'

// ─── 场景结构性颜色 ───────────────────────────────────────────────────────────
export { SCENE_COLORS } from './sceneColors'
export type { SceneColorKey } from './sceneColors'

// ─── 化学图像配色 ─────────────────────────────────────────────────────────────
export {
  CHART_COLORS,
  CT_CHART_COLORS,
  RATE_CHART_COLORS,
  PV_CHART_COLORS,
  PH_CHART_COLORS,
  // 图表插件颜色变体
  REFERENCE_MAP,
  SERIES_MAP,
  AREA_FILL_MAP,
  AREA_INTENSITY_MAP,
} from './chartColors'

export type {
  ChartReferenceVariant,
  ChartSeriesVariant,
  ChartAreaVariant,
  ChartAreaIntensity,
} from './chartColors'

// ─── SVG / Canvas 绘制规范 ────────────────────────────────────────────────────
export {
  CANVAS_STYLE,
  STROKE,
  OPACITY,
  ARROW,
  OBJECT,
  PARTICLE,
  FONT,
  DASH,
  LAYER_Z,
  SVG_ATTR,
  SVG_MARKER,
  SVG_FILTER,
  SVG_ANIM,
  INSET_CHART,
  GRID_DISPLAY,
  CHART_LAYOUT,
} from './canvasStyle'

export type {
  StrokeKey,
  OpacityKey,
  ArrowKey,
  ObjectSizeKey,
  FontKey,
  DashKey,
} from './canvasStyle'

// ─── 矢量显示系统 ─────────────────────────────────────────────────────────
export {
  VECTOR_VISUAL_WEIGHT,
  VECTOR_COLORS,
  MARKER_TIERS,
  selectMarkerTier,
} from './vectorStyle'

export type {
  VectorType,
  MarkerTier,
} from './vectorStyle'

// ─── 箭头几何 ─────────────────────────────────────────────────────────
export {
  getArrowGeometry,
} from './arrowStyle'

export type {
  ArrowGeometry,
} from './arrowStyle'
