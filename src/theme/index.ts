/**
 * src/theme/index.ts
 * 主题系统统一导出入口
 *
 * 使用方式（推荐）：
 *   import { colors, CHEMISTRY_COLORS, SCENE_COLORS,
 *            CANVAS_STYLE, SVG_ATTR, CHART_COLORS,
 *            LAYOUT, duration } from '@/theme'
 *
 * 所有颜色、间距、圆角、阴影、动效值必须从此处引用，禁止组件内硬编码
 *
 * ─── 模块职责速查 ────────────────────────────────────────────────────────────
 *  colors.ts             — UI 语义色（primary / secondary / accent / neutral / status）
 *  chemistry/colors.ts   — 化学量颜色（浓度/温度/压强/速率/酸碱/热化学/有机/氧化还原 共 ~50 token）
 *  chemistry/sceneColors — 场景器材外观色（容器/试剂/热源/导管/标签等）
 *  chemistry/chartColors — 化学图像配色（c-t / 速率 / P-V / pH 4 组专项）
 *  chemistry/canvasStyle — SVG/Canvas 绘制规范（线宽/虚线/箭头/SVG属性/Marker/Filter/动画）
 *  spacing.ts            — 间距与布局网格
 *  radius.ts             — 圆角
 *  shadow.ts             — 阴影与发光环
 *  motion.ts             — 动效时长与缓动
 */

// ─── UI 语义色 ────────────────────────────────────────────────────────────────
export { colors }                              from './colors'
export type { ColorScale, PrimaryColor }        from './colors'

// ─── 化学量颜色 ──────────────────────────────────────────────────────────────
export {
  CHEMISTRY_COLORS,
  CANVAS_COLORS,
  PHENOMENON_COLORS,
  ATOM_COLORS,
  FLAME_COLORS,
  withAlpha,
} from './chemistry/colors'
export type {
  ChemistryColorKey,
  CanvasColorKey,
  PhenomenonColorKey,
  FlameColorKey,
} from './chemistry/colors'

// ─── 场景结构性颜色 ───────────────────────────────────────────────────────────
export { SCENE_COLORS } from './chemistry/sceneColors'

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
} from './chemistry/chartColors'

export type {
  ChartReferenceVariant,
  ChartSeriesVariant,
  ChartAreaVariant,
  ChartAreaIntensity,
} from './chemistry/chartColors'

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
} from './chemistry/canvasStyle'
export type {
  StrokeKey,
  OpacityKey,
  ArrowKey,
  ObjectSizeKey,
  FontKey,
  DashKey,
} from './chemistry/canvasStyle'

// ─── 间距与布局网格 ──────────────────────────────────────────────────────────
export {
  spacing,
  BREAKPOINT,
  PANEL,
  LAYOUT,
  CANVAS_PRESETS,
  DENSITY,
} from './spacing'

// ─── 动画 UI token ───────────────────────────────────────────────────────
export {
  ANIM_FONT,
  ANIM_SHADOW,
  ANIM_PANEL,
  CHART_PAD,
  CHART_PAD_CT,
  CHART_PAD_RATE,
}                                   from './animationTokens'
export type { ChartPadding }        from './animationTokens'

// ─── 圆角 ─────────────────────────────────────────────────────────────────────
export { radius }                               from './radius'
export type { RadiusKey }                       from './radius'

// ─── 阴影 ─────────────────────────────────────────────────────────────────────
export { shadow, glowRing }                     from './shadow'
export type { ShadowKey }                       from './shadow'

// ─── 动效 ─────────────────────────────────────────────────────────────────────
export {
  duration,
  easing,
  transition,
  canvasAnimation,
}                                               from './motion'

// ─── 字体缩放 ───────────────────────────────────────────────────────────────
export { identityFontScaler }                    from './fontScaler'
export type { FontScaler }                       from './fontScaler'

// ─── 矢量显示系统 ─────────────────────────────────────────────────────────
export {
  VECTOR_VISUAL_WEIGHT,
  VECTOR_COLORS,
  MARKER_TIERS,
  selectMarkerTier,
}                                               from './chemistry/vectorStyle'
export type {
  VectorType,
  MarkerTier,
}                                               from './chemistry/vectorStyle'

// ─── 箭头几何 ─────────────────────────────────────────────────────────
export { getArrowGeometry }                     from './chemistry/arrowStyle'
export type { ArrowGeometry }                   from './chemistry/arrowStyle'
