import { describe, it, expect } from 'vitest'
import { modelQuizMap } from '../quiz'
import type { GaokaoVariantItem } from '../quiz'

type DiagramType = NonNullable<GaokaoVariantItem['diagramType']>
type Variant = GaokaoVariantItem

/**
 * 题面图形绑定守门测试（防「图文错配」复发）
 *
 * 背景：2026-10-09 符合性复审发现，多道变式题在题干上挂载了与题名语义完全无关的图形
 * （最典型的是"盖斯定律/热化学"题挂 `titration-curve`、"元素周期律"题挂 `precipitation-curve`
 * 与 `distribution-fraction`）。学生会读到一张与本题化学过程无关的曲线图，属于教学误导。
 * 当时的处置是移除全部错配绑定（保留题面 / 选项 / 答案 / 解析不变）。
 *
 * 本测试把当时的人工判断固化为可执行规则，构成三层防线：
 *   ① 白名单（默认禁止）：每个母题必须显式登记"允许出现的图形类型"，未登记即视为 0 种；
 *   ② 语义一致：图形类型必须能从题名 / 图形标题的化学语汇中得到印证，且不得自相矛盾；
 *   ③ 配置完备：图形所需的绘图参数必须齐全，禁止靠渲染器兜底默认值蒙混过关。
 *
 * 如确需为某母题新增图形，请先把题名改成"能自证图形含义"的表述（如写明"滴定曲线""价类二维图"
 * "沉淀 lg c - pH 分布曲线"），再在本文件登记对应类型与关键词，经化学复核后方可提交。
 */

/** ① 白名单：母题 → 允许挂载的图形类型。未列出的母题一律不允许出现任何图形绑定。 */
const MODEL_ALLOWED_DIAGRAM_TYPES: Record<string, DiagramType[]> = {
  // 记忆矩阵工具
  'model-valence-matrix': ['valence-matrix-chart'],
  'model-ion-matrix': [],
  'model-organic-matrix': [],
  'model-reagent-step': ['precipitation-curve'],
  'model-flash-cards': [],
  // 解题母题
  'model-titration-balance': ['titration-curve', 'distribution-fraction'],
  'model-electrochemical-twin': [],
  'model-crystal-3d-split': [],
  'model-reaction-principle-nexus': [],
  'model-vsepr-hybrid-3d': [],
  'model-organic-mechanism': ['organic-mechanism-diagram'],
  'model-hess-law': [],
  'model-element-periodic-property': [],
  'model-avogadro-constant': [],
  'model-organic-retrosynthesis': [],
  // 实验流程链
  'model-gas-chain': [],
  'model-industrial-flow': ['precipitation-curve'],
  'model-titration-error-purity': ['titration-error-diagram'],
}

/**
 * ② 语义规则：每种图形的题名/图形标题必须命中 required 之一，且不得命中 forbidden 之一。
 * `image` 为外部插图，无题名语汇要求，仅在配置完备性中要求 imageUrl。
 */
const DIAGRAM_TITLE_RULES: Record<
  Exclude<DiagramType, 'image'>,
  { label: string; required: RegExp[]; forbidden: RegExp[] }
> = {
  'titration-curve': {
    label: '滴定曲线',
    required: [/滴定/],
    // 分布分数图同样出现在滴定题里，必须靠否定项把两类图区分开
    forbidden: [/分布分数/, /δ/, /微粒分布/],
  },
  'distribution-fraction': {
    label: '微粒分布分数图',
    required: [/分布分数/, /分布图/, /δ/, /微粒分布/, /竞争分布/],
    forbidden: [/滴定曲线/, /突跃/],
  },
  'precipitation-curve': {
    label: '沉淀 / lg c - pH 分布曲线',
    required: [/沉淀/, /lg\s*c/i, /分布曲线/, /分布图/, /m\(沉淀\)/],
    forbidden: [/滴定曲线/, /分布分数/],
  },
  'valence-matrix-chart': {
    label: '价类二维图',
    required: [/价类/, /二维/, /价态/],
    forbidden: [/滴定曲线/, /分布分数/, /机理/],
  },
  'organic-mechanism-diagram': {
    label: '有机断键机理图',
    required: [/机理/, /机制/, /断键/, /加成/, /消去/, /氧化/, /水解/, /缩聚/, /催化/, /环加成/],
    forbidden: [/价类/, /滴定曲线/, /分布分数/],
  },
  'titration-error-diagram': {
    label: '滴定误差 / 纯度分析图',
    required: [/误差/, /纯度/, /返滴定/, /碘量/, /读数/, /视角/, /COD/i],
    forbidden: [/价类/, /分布曲线/],
  },
}

/** ③ 机理图子类型必须与题名化学主题吻合 */
const MECHANISM_TITLE_RULES: Record<
  NonNullable<Variant['diagramConfig']>['mechanismType'] & string,
  RegExp
> = {
  'addition-markov': /马氏|亲电加成/,
  'haloalkane-elimination': /卤代烃|消去/,
  'alcohol-oxidation': /醇.{0,8}氧化|氧化.{0,8}醇|α-H/,
  'ester-cleavage': /酯|¹⁸O|18O/,
  'peptide-hydrolysis': /肽|酰胺键/,
  'phenol-condensation': /酚|缩聚/,
  'catalytic-cycle': /催化循环|催化/,
  'diels-alder': /Diels|环加成/i,
}

/** ③ 滴定误差图子类型必须与题名化学主题吻合 */
const ERROR_DIAGRAM_TITLE_RULES: Record<
  NonNullable<Variant['diagramConfig']>['errorDiagramType'] & string,
  RegExp
> = {
  'cod-back-titration': /COD|返滴定|重铬酸钾/i,
  'permanganate-view-angle': /高锰酸钾|KMnO₄|读数|视线|视角/,
  'iodometry-purity': /碘量|纯度|S₂O₃|Na₂S₂O₃/,
}

/**
 * 题名中"点名"某类图的固定说法 → 该题挂载的图形类型必须与其一致。
 * 双向作用：既防"题名写 A 图却挂 B 图"，也能查出"题名承诺了图、实际没挂图"的漏挂。
 */
const FIGURE_NAME_PATTERNS: { type: DiagramType; label: string; pattern: RegExp }[] = [
  { type: 'titration-curve', label: '滴定曲线', pattern: /滴定曲线/ },
  { type: 'distribution-fraction', label: '分布分数图', pattern: /分布分数/ },
  { type: 'precipitation-curve', label: 'lg c - pH 分布曲线', pattern: /lg\s*c\s*-\s*pH/i },
  { type: 'valence-matrix-chart', label: '价类二维图', pattern: /价类二维/ },
  { type: 'organic-mechanism-diagram', label: '断键机理图', pattern: /机理图|断键图/ },
  { type: 'titration-error-diagram', label: '误差分析图', pattern: /误差分析图/ },
]

interface Binding {
  modelId: string
  variant: Variant
  diagramType: DiagramType
  /** 题名 + 图形标题的合并文本，所有语义判断都在其上执行 */
  text: string
}

const bindings: Binding[] = []
Object.entries(modelQuizMap).forEach(([modelId, quiz]) => {
  quiz.variantQuizzes.forEach((variant) => {
    if (!variant.diagramType) return
    bindings.push({
      modelId,
      variant,
      diagramType: variant.diagramType,
      text: `${variant.title || ''} ${variant.diagramConfig?.title || ''}`,
    })
  })
})

const at = (b: Binding) => `[${b.modelId} / ${b.variant.id}]`

describe('高考题面图形绑定守门测试（防图文错配）', () => {
  it('① 每个母题必须显式登记允许的图形类型（默认禁止），且登记项不得越权使用', () => {
    // 未登记 = 默认禁止：新增母题时若忘了登记，这里会失败，强制做出显式决定
    Object.keys(modelQuizMap).forEach((modelId) => {
      expect(
        MODEL_ALLOWED_DIAGRAM_TYPES,
        `母题 [${modelId}] 未在 MODEL_ALLOWED_DIAGRAM_TYPES 中登记图形白名单`
      ).toHaveProperty(modelId)
    })

    bindings.forEach((b) => {
      const allowed = MODEL_ALLOWED_DIAGRAM_TYPES[b.modelId]
      expect(allowed, `${at(b)} 所在母题未登记白名单`).toBeDefined()
      expect(
        allowed,
        `${at(b)} 挂了 ${b.diagramType}，但该母题白名单为 [${allowed.join(', ') || '空'}]`
      ).toContain(b.diagramType)
    })
  })

  it('② 图形类型必须与题名语义一致，且不得自相矛盾', () => {
    bindings.forEach((b) => {
      if (b.diagramType === 'image') return
      const rule = DIAGRAM_TITLE_RULES[b.diagramType]
      expect(rule, `图形类型 ${b.diagramType} 缺少语义规则`).toBeDefined()

      expect(
        rule.required.some((re) => re.test(b.text)),
        `${at(b)} 题名/图形标题 ${JSON.stringify(b.variant.title)} 命中不了「${rule.label}」的语义要求 ${rule.required}`
      ).toBe(true)

      const conflict = rule.forbidden.find((re) => re.test(b.text))
      expect(
        conflict,
        `${at(b)} 题名/图形标题与「${rule.label}」自相矛盾（命中禁忌 ${conflict}）：${JSON.stringify(b.text)}`
      ).toBeUndefined()
    })
  })

  it('③ 图形所需绘图参数必须完备，禁止依赖渲染器默认值', () => {
    bindings.forEach((b) => {
      const cfg = b.variant.diagramConfig
      expect(cfg, `${at(b)} 声明了 diagramType 却没有 diagramConfig`).toBeDefined()
      expect(
        cfg?.title,
        `${at(b)} 缺少 diagramConfig.title（图形表头会退化为默认文案）`
      ).toBeTruthy()

      if (b.diagramType === 'titration-curve') {
        // 渲染器的滴定曲线几何全部由 config 驱动；缺省会画成 20 mL 一元滴定，二元双突跃题必错
        expect(cfg?.vEq, `${at(b)} 滴定曲线缺少 vEq，将退回默认 20 mL`).toBeTypeOf('number')
        expect(cfg?.phJumpRange, `${at(b)} 滴定曲线缺少 phJumpRange，突跃区间无法标注`).toEqual(
          expect.arrayContaining([expect.any(Number)])
        )
        expect(cfg?.phJumpRange).toHaveLength(2)
      }

      if (b.diagramType === 'organic-mechanism-diagram') {
        expect(cfg?.mechanismType, `${at(b)} 有机机理图缺少 mechanismType`).toBeTruthy()
      }

      if (b.diagramType === 'titration-error-diagram') {
        expect(cfg?.errorDiagramType, `${at(b)} 滴定误差图缺少 errorDiagramType`).toBeTruthy()
      }

      if (b.diagramType === 'image') {
        expect(cfg?.imageUrl, `${at(b)} image 类型缺少 imageUrl`).toBeTruthy()
      }
    })
  })

  it('④ 有机机理图子类型必须与题名化学主题吻合', () => {
    bindings
      .filter((b) => b.diagramType === 'organic-mechanism-diagram')
      .forEach((b) => {
        const mech = b.variant.diagramConfig?.mechanismType
        const rule = mech ? MECHANISM_TITLE_RULES[mech] : undefined
        expect(rule, `${at(b)} 未登记的 mechanismType: ${mech}`).toBeDefined()
        expect(
          rule!.test(b.text),
          `${at(b)} mechanismType=${mech} 与题名主题不吻合：${JSON.stringify(b.variant.title)}`
        ).toBe(true)
      })
  })

  it('⑤ 滴定误差图子类型必须与题名化学主题吻合', () => {
    bindings
      .filter((b) => b.diagramType === 'titration-error-diagram')
      .forEach((b) => {
        const errType = b.variant.diagramConfig?.errorDiagramType
        const rule = errType ? ERROR_DIAGRAM_TITLE_RULES[errType] : undefined
        expect(rule, `${at(b)} 未登记的 errorDiagramType: ${errType}`).toBeDefined()
        expect(
          rule!.test(b.text),
          `${at(b)} errorDiagramType=${errType} 与题名主题不吻合：${JSON.stringify(b.variant.title)}`
        ).toBe(true)
      })
  })

  it('⑥ 不得存在「有 diagramConfig 却无 diagramType」的悬空配置', () => {
    Object.entries(modelQuizMap).forEach(([modelId, quiz]) => {
      quiz.variantQuizzes.forEach((variant) => {
        if (!variant.diagramConfig) return
        expect(
          variant.diagramType,
          `[${modelId} / ${variant.id}] 保留了 diagramConfig 但未声明 diagramType，图形不会被渲染`
        ).toBeTruthy()
      })
    })
  })

  it('⑦ 题名点名了某类图时，声明类型必须与其一致（且不得漏挂）', () => {
    Object.entries(modelQuizMap).forEach(([modelId, quiz]) => {
      quiz.variantQuizzes.forEach((variant) => {
        const title = variant.title || ''
        const named = FIGURE_NAME_PATTERNS.filter((f) => f.pattern.test(title))
        if (named.length === 0) return
        named.forEach((f) => {
          expect(
            variant.diagramType,
            `[${modelId} / ${variant.id}] 题名点名了「${f.label}」却未挂 ${f.type} 图形：${JSON.stringify(title)}`
          ).toBe(f.type)
        })
      })
    })
  })
})
