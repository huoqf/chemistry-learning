/**
 * src/data/__tests__/helpers/chemistryClaimGuard.ts
 *
 * 化学“错误表述”守卫（审查项 G2 / G9）。
 *
 * 背景：
 *   - G2：`gaokaoQuizDataCoverage.test.ts` 对变式题只断言“存在一项 isCorrect”，
 *     “标的是不是真的对”完全无人校验（C3 的 Al³⁺/Mg²⁺ 顺序错误即由此躲过）。
 *   - G9：`GAOKAO_CHEMISTRY_RULES.md` 禁止超纲/失真现象表述，但审计只覆盖 `ION_DATA`
 *     一张表，共存矩阵等文本不在范围内（C2 的“淡蓝色”因此漏网）。
 *
 * 本模块提供一张**可审计的“错误表述 → 化学事实”映射表**，每条含：
 *   - `all`      —— 全部命中才视为“出现了该错误表述”；
 *   - `unless`   —— 命中任一即说明是在“否定/澄清”该说法，不判定为违规；
 *   - `reason`   —— 正确的化学事实（写清为什么错）；
 *   - `targetDate` —— 复核到期日。
 *
 * 注意：守卫只对**被标为正确**的内容（答案键、标答、解析、现象描述）生效。
 * 错误选项本身天然包含错误表述，不参与判定。
 */

export interface ClaimGuardEntry {
  /** 全部命中才判定为“出现了该错误表述” */
  all: RegExp[]
  /** 命中任一即视为“否定/澄清该说法”，不判定违规 */
  unless?: RegExp
  /** 正确的化学事实 */
  reason: string
  /** 复核到期日（ISO 8601 日期） */
  targetDate: string
}

export const CLAIM_GUARD_ENTRIES: ClaimGuardEntry[] = [
  {
    all: [/亚硝酸|NO₂|NO2|NO_2/, /淡蓝色|浅蓝色|蓝色溶液/],
    unless: /无色|不显|并非|不是淡蓝|绝不/,
    reason: '亚硝酸及其盐（NaNO₂/HNO₂）的溶液无色（浓时微黄），绝无“淡蓝色”。酸化后逸出无色 NO，管口遇空气变红棕色 NO₂。',
    targetDate: '2027-01-31',
  },
  {
    all: [/过氧化物/, /HCl|氯丙烷/, /反马氏|1-氯丙烷|1‑氯丙烷/],
    unless: /只适用|仅适用|无此效应|不适用|不反应|不发生/,
    reason: '过氧化物效应（自由基反马氏加成）只适用于 HBr。HCl 在过氧化物存在下不发生该效应，CH₃-CH=CH₂ 与 HCl 加成产物仍为 2-氯丙烷（马氏产物）。',
    targetDate: '2027-01-31',
  },
  {
    all: [/乙炔/, /向上排空气/],
    unless: /不能|不宜|不可|不采用|禁止|应(用|选|采)?排水|难溶于水/,
    reason: '乙炔 M=26，密度与空气（29）接近，排空气法难以收纯；且乙炔难溶于水，标准做法为排水集气法。',
    targetDate: '2027-01-31',
  },
  {
    all: [/炔银/, /黄色|黄色沉淀/],
    unless: /白色|灰白|CuC|亚铜|铜/,
    reason: '炔银 AgC≡CR 为白色/灰白色沉淀；黄色沉淀是炔化亚铜 CuC≡CR。二者试剂（银氨溶液 / 亚铜氨溶液）不同，颜色不可混用。',
    targetDate: '2027-01-31',
  },
  {
    all: [
      /钝化/,
      /浓\s*硝酸|浓\s*硫酸|浓\s*HNO|浓\s*H₂SO₄|HNO₃|H₂SO₄|Fe、Al|Fe\/Al|铁铝/,
      /不反应|不发生化学|只是物理|物理变化/,
    ],
    unless: /不是|并非|而非|而(是|为)|绝不能|不属于/,
    reason: '钝化是化学变化：常温下 Fe/Al 表面被浓 HNO₃ / 浓 H₂SO₄ 迅速氧化生成致密氧化膜，反应随即停止。说成“不反应/物理变化”属概念性错误。',
    targetDate: '2027-01-31',
  },
  {
    all: [/Al³⁺|Al3\+/, /Mg²⁺|Mg2\+/, /同时(开始)?沉淀/],
    unless: /不是|并非|而非|绝不会/,
    reason: 'Ksp[Al(OH)₃]≈1×10⁻³³ 远小于 Ksp[Mg(OH)₂]≈5.6×10⁻¹²，Al³⁺ 在 pH≈3.3 即开始沉淀，Mg²⁺ 需 pH≈9.4，故 Al³⁺ 必定先沉淀，不存在“同时沉淀”。',
    targetDate: '2027-01-31',
  },
]

/** 返回 `text` 命中的全部违规条目（已应用 unless 豁免） */
export function findClaimViolations(text: string): ClaimGuardEntry[] {
  if (!text) return []
  return CLAIM_GUARD_ENTRIES.filter(entry => {
    if (!entry.all.every(re => re.test(text))) return false
    if (entry.unless && entry.unless.test(text)) return false
    return true
  })
}

/** 从任意嵌套结构中按字段名白名单收集全部字符串 */
export function collectStrings(
  node: unknown,
  path: string,
  fieldNames: ReadonlySet<string> | null = null,
  out: Array<{ source: string; text: string }> = [],
  seen = new Set<unknown>()
): Array<{ source: string; text: string }> {
  if (node === null || typeof node === 'undefined') return out
  if (typeof node === 'string') {
    out.push({ source: path, text: node })
    return out
  }
  if (typeof node !== 'object') return out
  if (seen.has(node)) return out
  seen.add(node)

  if (Array.isArray(node)) {
    node.forEach((v, i) => collectStrings(v, `${path}[${i}]`, fieldNames, out, seen))
    return out
  }

  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (fieldNames && !fieldNames.has(key)) continue
    collectStrings(value, `${path}.${key}`, fieldNames, out, seen)
  }
  return out
}
