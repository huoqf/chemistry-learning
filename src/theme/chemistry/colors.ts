/**
 * src/theme/chemistry/colors.ts
 * 化学量颜色语义映射 - Canvas / SVG 内唯一颜色来源
 *
 * 设计原则
 * 1. 每个化学量有且仅有一个颜色 token，禁止组件内硬编码
 * 2. 同一画面同时显示的化学量颜色 <= 5 种（参考 Nielsen 色觉限制）
 * 3. 颜色间最小感知距离 DeltaE >= 15（CIE76），防止同屏混淆
 * 4. 所有颜色在白色背景上对比度 >= 3.0（WCAG AA Large）
 * 5. 新增化学量颜色必须先更新本文件，再进入组件实现
 */

/** 将 hex 颜色与 alpha 组合为 rgba 字符串 */
export function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }
  return hex;
}

export const CHEMISTRY_COLORS = {
  // 基本化学量
  concentration: '#3B82F6',       // 浓度（蓝）
  temperature: '#EF4444',         // 温度（红）
  pressure: '#F59E0B',            // 压强（琥珀）
  volume: '#8B5CF6',              // 体积（紫）
  mass: '#6B7280',                // 质量（灰）
  amount: '#10B981',              // 物质的量（绿）

  // 反应动力学
  reactionRate: '#3B82F6',        // 反应速率（蓝）
  rateForward: '#22C55E',         // 正反应速率（绿）
  rateReverse: '#EF4444',         // 逆反应速率（红）
  equilibrium: '#F59E0B',         // 平衡态（琥珀）
  activation: '#8B5CF6',          // 活化能（紫）
  activationEnergy: '#8B5CF6',    // 活化能（紫）

  // 电化学
  electrode: '#6B7280',           // 电极（灰）
  anode: '#EF4444',               // 阳极（红）
  cathode: '#3B82F6',             // 阴极（蓝）
  positivePole: '#EF4444',        // 正极（红）
  negativePole: '#3B82F6',        // 负极（蓝）
  saltBridge: '#10B981',          // 盐桥（绿）
  cation: '#8B5CF6',              // 阳离子（紫）
  anion: '#F59E0B',               // 阴离子（琥珀）
  electron: '#06B6D4',            // 电子（青）
  ion: '#A78BFA',                 // 离子（浅紫）
  electrodePotential: '#F59E0B',  // 电极电势（琥珀）
  current: '#22C55E',             // 电流（绿）

  // 溶液与酸碱
  pH: '#22C55E',                  // pH（绿）
  acid: '#EF4444',                // 酸（红）
  base: '#3B82F6',                // 碱（蓝）
  salt: '#F59E0B',                // 盐（琥珀）
  indicator: '#A78BFA',           // 指示剂（紫）
  hydroxide: '#06B6D4',           // 氢氧根（青）

  // 热化学
  enthalpy: '#EF4444',            // 焓变（红）
  entropy: '#8B5CF6',             // 熵变（紫）
  gibbs: '#F59E0B',               // 吉布斯自由能（琥珀）
  exothermic: '#EF4444',          // 放热（红）
  endothermic: '#3B82F6',         // 吸热（蓝）
  heatRelease: '#F97316',         // 释放热量（橙）
  heatAbsorb: '#06B6D4',          // 吸收热量（青）

  // 有机化学
  carbonChain: '#6B7280',         // 碳链（灰）
  functionalGroup: '#3B82F6',     // 官能团（蓝）
  doubleBond: '#EF4444',          // 双键（红）
  tripleBond: '#8B5CF6',          // 三键（紫）

  // 氧化还原
  oxidation: '#EF4444',           // 氧化（红）
  reduction: '#3B82F6',           // 还原（蓝）
  oxidant: '#F97316',             // 氧化剂（橙）
  reductant: '#06B6D4',           // 还原剂（青）
  electronTransfer: '#A78BFA',    // 电子转移（紫）

  // 平衡与速率
  forwardDirection: '#22C55E',    // 正方向（绿）
  reverseDirection: '#EF4444',    // 逆方向（红）
  equilibriumShift: '#F59E0B',    // 平衡移动（琥珀）

  // 通用标注
  displacement: '#8B5CF6',        // 位移（紫，RelationChart 作为通用标色）
  deltaHighlight: '#F97316',      // Δ高亮色（橙，割线/斜率三角形用）
} as const

export type ChemistryColorKey = keyof typeof CHEMISTRY_COLORS

/** Canvas 基础设施色 */
export const CANVAS_COLORS = {
  trackHistory:       '#94A3B8', // 历史轨迹
  trackHistoryAlt:    '#C4B5FD', // 对照轨迹/投影
  axis:               '#CBD5E1', // 坐标轴、参考线
  grid:               '#E2E8F0', // 网格线
  gridSubtle:         '#F1F5F9', // 浅网格/轻描边
  labelText:          '#1E293B', // Canvas 内文字标注
  labelTextLight:     '#475569', // Canvas 次要文字
  textMuted:          '#64748B', // 灰色辅助文字/元件填充
  objectFill:         '#EFF6FF', // 物体填充（浅蓝）
  objectStroke:       '#1E40AF', // 物体轮廓
  objectFillNeutral:  '#F8FAFC', // 中性物体填充
  objectFillWarm:     '#FFF7ED', // 暖色物体填充
  strokeDark:         '#334155', // 深色描边/外框
  referencePoint:     '#F59E0B', // 参考点标注
  annotation:         '#8B5CF6', // 标注文字框
  originMark:         '#1E293B', // 坐标原点标记
  vectorTip:          '#1E293B', // 箭头尖端描边
  white:              '#FFFFFF', // 纯白

  // 警示危险场景配色
  alertRed:           '#EF4444',
  dangerDark:         '#DC2626',
  dangerText:         '#B91C1C',
  dangerBg:           '#FEF2F2',
  dangerBorder:       '#FECACA',
  dangerBgFill:       '#fee2e2',
  dangerGradient:     '#7F1D1D',
} as const

export type CanvasColorKey = keyof typeof CANVAS_COLORS

/** CPK 标准元素原子颜色映射（用于分子构型、晶胞、杂化轨道与有机结构） */
export const ATOM_COLORS = {
  H:  '#FFFFFF', // 氢 (纯白/浅灰)
  Li: '#A855F7', // 锂 (亮紫)
  Be: '#94A3B8', // 铍 (浅银灰)
  B:  '#F97316', // 硼 (浅橙)
  C:  '#374151', // 碳 (石墨灰)
  N:  '#3B82F6', // 氮 (蓝)
  O:  '#EF4444', // 氧 (红)
  F:  '#22C55E', // 氟 (浅绿)
  Na: '#8B5CF6', // 钠 (紫)
  Mg: '#9CA3AF', // 镁 (银灰)
  Al: '#B0BEC5', // 铝 (浅银灰)
  Si: '#D97706', // 硅 (赭石)
  P:  '#F97316', // 磷 (橙)
  S:  '#EAB308', // 硫 (黄)
  Cl: '#10B981', // 氯 (绿)
  K:  '#7C3AED', // 钾 (深紫)
  Ca: '#64748B', // 钙 (灰)
  Cr: '#059669', // 铬 (铬绿)
  Mn: '#EC4899', // 锰 (粉紫)
  Fe: '#B45309', // 铁 (棕)
  Cu: '#C2410C', // 铜 (红铜)
  Zn: '#78716C', // 锌 (灰)
  Br: '#991B1B', // 溴 (深红棕)
  I:  '#581C87', // 碘 (紫黑)
  Ag: '#CBD5E1', // 银 (亮银)
  Ba: '#475569', // 钡 (深灰)
  Pb: '#475569', // 铅 (铅灰)
} as const

export type AtomColorKey = keyof typeof ATOM_COLORS

/** 特征化学显色、沉淀与气体颜色 */
export const PHENOMENON_COLORS = {
  // 溶液与离子特征色
  fe3Plus:          '#D97706', // Fe3+ 棕黄色
  fe2Plus:          '#86EFAC', // Fe2+ 浅绿色
  cu2Plus:          '#0284C7', // Cu2+ 蓝色
  feScn3:           '#991B1B', // Fe(SCN)3 血红色
  mno4Minus:        '#7E22CE', // MnO4- 紫红色
  cr2o72Minus:      '#EA580C', // Cr2O72- 橙红色
  cro42Minus:       '#EAB308', // CrO42- 黄色
  co2Plus:          '#F43F5E', // Co2+ 粉红色
  br2Water:         '#F97316', // 橙黄色溴水
  br2Ccl4:          '#C2410C', // 橙红色 Br2/CCl4 有机相
  i2Water:          '#B45309', // 棕黄色碘水
  i2Ccl4:           '#7E22CE', // 紫红色 I2/CCl4 有机相
  fuchsinRed:       '#F43F5E', // SO2 检验品红溶液红色

  // 常见沉淀颜色
  feOh2Precipitate: '#F8FAFC', // Fe(OH)2 白色沉淀
  feOh2Transition:  '#6EE7B7', // Fe(OH)2 灰绿色中间态
  feOh3Precipitate: '#78350F', // Fe(OH)3 红褐色沉淀
  cuOh2Precipitate: '#38BDF8', // Cu(OH)2 蓝色沉淀
  cu2oPrecipitate:  '#991B1B', // Cu2O 砖红色沉淀
  agiPrecipitate:   '#FACC15', // AgI 黄色沉淀
  agbrPrecipitate:  '#FEF08A', // AgBr 淡黄色沉淀
  agclPrecipitate:  '#F8FAFC', // AgCl 白色沉淀
  baso4Precipitate: '#F8FAFC', // BaSO4 白色沉淀
  caco3Precipitate: '#F8FAFC', // CaCO3 白色沉淀
  alOh3Precipitate: '#F8FAFC', // Al(OH)3 白色沉淀
  mgOh2Precipitate: '#F8FAFC', // Mg(OH)2 白色沉淀
  pbso4Precipitate: '#F8FAFC', // PbSO4 白色沉淀
  prussianBlue:     '#1E40AF', // 普鲁士蓝 / Turnbull 蓝沉淀 (Fe2+ 检出)
  sPrecipitate:     '#FDE047', // 硫单质淡黄色沉淀

  // 特征气体颜色
  no2Gas:           '#B45309', // NO2 红棕色气体
  cl2Gas:           '#A3E635', // Cl2 黄绿色气体
  br2Vapor:         '#7C2D12', // Br2 蒸气红棕色
  i2Vapor:          '#6B21A8', // I2 蒸气紫色
  o3Gas:            '#38BDF8', // O3 微蓝色气体
} as const

export type PhenomenonColorKey = keyof typeof PHENOMENON_COLORS

/** 焰色试验特征颜色（高考元素鉴别考点） */
export const FLAME_COLORS = {
  Na: '#FACC15', // 钠 (黄)
  K:  '#C084FC', // 钾 (透过蓝色钴玻璃浅紫)
  Ca: '#F97316', // 钙 (砖红)
  Cu: '#10B981', // 铜 (绿/青绿)
  Ba: '#A3E635', // 钡 (黄绿)
} as const

export type FlameColorKey = keyof typeof FLAME_COLORS

/** 滴定指示剂变色阶 */
export const INDICATOR_COLORS = {
  phenolphthalein: {
    acidic:   'rgba(255, 255, 255, 0)', // 酸性无色
    neutral:  'rgba(255, 255, 255, 0)', // 中性无色
    palePink: '#F472B6',               // 滴定终点浅粉红
    basic:    '#EC4899',               // 碱性粉红/红色
  },
  methylOrange: {
    acidic:   '#EF4444', // pH < 3.1 红色
    neutral:  '#F59E0B', // 3.1 - 4.4 橙色
    basic:    '#EAB308', // pH > 4.4 黄色
  },
  litmus: {
    acidic:   '#EF4444', // 酸性红
    neutral:  '#8B5CF6', // 中性紫
    basic:    '#3B82F6', // 碱性蓝
  },
  starchIodine: {
    iodinePresent: '#1E3A8A',           // 有碘存在蓝色
    iodineAbsence: 'rgba(255, 255, 255, 0)', // 终点蓝色褪去无色
  },
} as const

