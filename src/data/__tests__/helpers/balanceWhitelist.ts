/**
 * src/data/__tests__/helpers/balanceWhitelist.ts
 *
 * 方程式守恒扫描的**显式豁免名单**。
 *
 * 背景（审查项 G8）：原 `equationsBalanceScan.test.ts` 内置了一串
 * `if (eq.includes('品红') || eq.includes('ΔH') || ...) continue` 的静默跳过条件——
 * 无原因记录、无到期日，比项目自身对 marker 白名单的要求
 * （`scripts/check-no-marker.mjs` 要求 `reason` + `targetDate`）更宽松。
 *
 * 本文件把豁免改为**显式、可审计、带复核期限**的条目：
 *   - `pattern`  —— 命中即豁免（作用于归一化后的单条方程式文本）；
 *   - `reason`   —— 为什么这条不适用原子/电荷守恒（必须写清化学或数学上的理由）；
 *   - `targetDate` —— 复核到期日，到期后应重新确认该条是否仍然必要。
 *
 * 注意：豁免只应用于**确实不是化学方程式**的内容（定性现象描述、指示剂变色、
 * 物理量关系式、有机通式、多物种序列示意）。**禁止**用豁免掩盖真实配平错误，
 * 也禁止为了消除误报而豁免一条真方程式。
 */

export interface BalanceWhitelistEntry {
  /** 命中即豁免（作用于归一化后的单条方程式文本） */
  pattern: RegExp
  /** 化学/数学上的豁免理由 */
  reason: string
  /** 复核到期日（ISO 8601 日期） */
  targetDate: string
}

export const BALANCE_WHITELIST: BalanceWhitelistEntry[] = [
  // ── 一、定性检验 / 指示剂现象（只有“变色”结论，没有计量关系）────────────────
  {
    pattern: /品红|酚酞|石蕊|褪色|复红/,
    reason: '定性检验或指示剂变色描述（漂白、复红、褪色），不含化学计量关系，无法也不应做原子守恒判定。',
    targetDate: '2027-01-31',
  },
  {
    pattern: /DMG|丁二酮肟/,
    reason: '丁二酮肟（DMG）镍的定性检出，产物为配合物通式而非计量方程式。',
    targetDate: '2027-01-31',
  },

  // ── 二、热化学：焓变标注 / 盖斯定律代数式 ───────────────────────────────────
  {
    pattern: /Δ\s*H/,
    reason: '热化学焓变标注（ΔH < 0 等）与盖斯定律代数式，判定对象是焓变的加减而非原子守恒。',
    targetDate: '2027-01-31',
  },

  // ── 三、有机通式 / 示性式：含变量基团 R 或变量 x ─────────────────────────────
  {
    pattern: /R[\s\-⁻]*(?:C|H|NH|O)/,
    reason: '有机示性式或结构通式（R 代表变量烃基），各 R 未必同且不参与计量比对。',
    targetDate: '2027-01-31',
  },
  {
    pattern: /\(x\s*\+\s*2\)|C_[xₓ]/,
    reason: '有机物燃烧通式（含变量 x），非具体计量方程式。',
    targetDate: '2027-01-31',
  },

  // ── 四、物理量数学关系式（高中化学的“公式”，不是反应式）──────────────────────
  {
    pattern: /c\([A-Za-z⁺⁻₀-₉][^)]{0,8}\)\s*[=+-]|=\s*\d*c\(/,
    reason: '浓度/物质的量守恒表达式（电荷守恒、物料守恒式），属代数关系而非化学方程式。',
    targetDate: '2027-01-31',
  },
  {
    pattern: /K_?(?:p|c|sp|ₚ|ₛₚ|sp)\b|Kₚ|Kₛₚ/,
    reason: '平衡常数数学定义式（Ksp / Kc / Kp），是数学表达式而非反应式。',
    targetDate: '2027-01-31',
  },
  {
    pattern: /E_?a[₀-₉₁-₉]|E_?a\s*\(|活化能|决速步/,
    reason: '活化能（决速步）等物理量的数学取式，Ea 不是元素符号。',
    targetDate: '2027-01-31',
  },
  {
    pattern: /\\frac|\\max|\\dots/,
    reason: '含 LaTeX 分式/取最大值等纯数学排版，属公式而非方程式。',
    targetDate: '2027-01-31',
  },

  // ── 五、多物种序列示意（“离子逐个沉淀/转化顺序”，不是一步反应）──────────────
  {
    pattern: /^[^+=⇌]*→[^+=⇌]*→[^+=⇌]*$/,
    reason: '多段纯物种序列（如 H⁺→Fe³⁺→Al³⁺→NH₄⁺ 的沉淀顺序示意），表达先后顺序而非一步反应，无守恒可言。',
    targetDate: '2027-01-31',
  },

  // ── 六、以中文概括名称书写的“示意式”（产物/反应物未给化学式，无法计量配平）────
  {
    pattern: /[=⇌→]\s*[\u4e00-\u9fa5]{2,}/,
    reason:
      '示意式：产物（或反应物）以中文概括名称书写而非化学式（如「= 难溶铝硅酸盐↓」），本身不承载计量关系，无法做原子/电荷配平判定，属教学上的示意表达。',
    targetDate: '2027-01-31',
  },
]

/** 归一化后的方程式文本是否命中显式豁免名单 */
export function isBalanceWhitelisted(equation: string): boolean {
  return BALANCE_WHITELIST.some(entry => entry.pattern.test(equation))
}

/** 已过复核期限的豁免条目（供测试提醒，而非直接失败） */
export function expiredWhitelistEntries(now: Date = new Date()): BalanceWhitelistEntry[] {
  return BALANCE_WHITELIST.filter(e => new Date(`${e.targetDate}T00:00:00Z`).getTime() < now.getTime())
}
