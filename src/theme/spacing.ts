/**
 * src/theme/spacing.ts
 * 间距比例尺 — 4px 基准，与 Tailwind 默认 spacing 对齐
 */
export const spacing = {
  px:  '1px',
  0:   '0px',
  0.5: '2px',
  1:   '4px',   // 图标与文字间距，公式内间距
  2:   '8px',   // 同组元素间距
  3:   '12px',  // 卡片内边距（紧凑）
  4:   '16px',  // 卡片内边距（标准）
  5:   '20px',
  6:   '24px',  // 区块间距
  8:   '32px',  // 章节间距
  10:  '40px',
  12:  '48px',  // 页面级大间距、底部控制栏高度
  14:  '56px',  // 顶部栏高度
  16:  '64px',
  20:  '80px',
  24:  '96px',
} as const

// ─── 响应式断点 ──────────────────────────────────────────────────────────
export const BREAKPOINT = {
  mobile:   1024,  // < 1024: 移动端（右侧下移，左侧抽屉）
  tablet:   1280,  // 1024–1279: 平板（左侧抽屉）
  desktop:  1440,  // ≥ 1440: 标准桌面
} as const

// ─── 面板宽度配置（按断点分级）────────────────────────────────────────────
export const PANEL = {
  left: {
    standard: 280,  // ≥1440px
    compact:   240,  // 1280–1439px
    min:       200,
    max:       320,
  },
  right: {
    standard: 320,  // ≥1440px
    compact:   280,  // 1280–1439px / 1024–1279px
    min:       240,
    max:       360,
  },
} as const

// ─── 固定布局尺寸（三屏联动）────────────────────────────────────────────
export const LAYOUT = {
  topBarHeight:     56,  // px
  bottomBarHeight:  48,  // px
  leftPanelWidth:   PANEL.left.standard,  // 向后兼容，标准宽度
  rightPanelWidth:  PANEL.right.standard,  // 向后兼容，标准宽度
  canvasMinWidth:   400, // px 中间 Canvas 最小宽度
  responsiveBreak:  BREAKPOINT.mobile,     // 向后兼容，折叠侧边栏的断点
} as const

// ─── 动画画布预设尺寸（useCanvasSize 回退值）────────────────────────────────
// 按动画在中屏的布局区域选型，非内容形状。
// 基准：1440px 标准桌面下中屏宽≈840px、可用高≈650px（扣除顶栏/控制条）
export const CANVAS_PRESETS = {
  /**
   * full — 动画独占中屏全区域
   * 840×650，AR≈1.29:1，对齐 1440px 桌面中屏实际尺寸
   * 适用：单一场景，无图表分区
   * 化学高频：有机路径/电化学池/氧化还原/无需图表的反应
   */
  full:   { width: 840, height: 650 },
  /**
   * splitV — 上下分区时动画/图表各占半高
   * 840×325，AR≈2.58:1（full 高度的一半，宽度对齐中屏实际宽度）
   * 适用：中屏上下各放一个区块（如上方图表 + 下方场景）
   * 化学低频：仅反应速率对比/能量图
   */
  splitV: { width: 840, height: 325 },
  /**
   * splitH — 左右均分：动画占左侧半宽
   * 420×650，AR≈0.65:1（full 宽度的一半，高度不变）
   * 适用：中屏左右均分（如左侧场景 + 右侧图表面板）
   * 化学场景：容器+简单图表（离子反应/溶液配制）
   */
  splitH: { width: 420, height: 650 },
  /**
   * splitHw — 左窄右宽：场景区窄 + 图表区宽（化学主力布局）
   * 280×650，AR≈0.43:1，右侧释放 560px 给图表
   * 化学高频：化学平衡/滴定分析/速率+图表/气体定律/沉淀平衡
   * 设计逻辑：化学容器（烧杯/试管/滴定管）天然竖向，280px 足够展示；
   * 右侧 560px 对 pH 滴定曲线、多曲线 c-t 图+图例非常理想
   */
  splitHw: { width: 280, height: 650 },
  /**
   * square — 旋转对称/分子模型场景
   * 650×650，1:1，适合圆形/对称演示
   * 化学高频：分子模型/晶体结构/粒子扩散/原子结构
   */
  square: { width: 650, height: 650 },
} as const

// ─── 内容密度上限 ────────────────────────────────────────────────────────
export const DENSITY = {
  canvasMaxElements: 7,  // Canvas 同时可见元素上限
  canvasMaxLabels:   5,  // Canvas 内文字标注上限
  leftPanelMaxParams:5,  // 左侧面板最多参数数量
  rightPanelMaxRows: 8,  // 右侧看板最多物理量行数
  gaokaoMaxTips:     3,  // 高考要点卡片最多条数
  gaokaoTipMaxChars: 30, // 每条要点最多字符数
  stepMaxOpen:       2,  // AnalysisPage 同时展开步骤数
  wrongCardSummary:  60, // 错题卡片摘要最多字符数
  knowledgeNodeTitle:12, // 知识点链路节点标题最多字符数
} as const
