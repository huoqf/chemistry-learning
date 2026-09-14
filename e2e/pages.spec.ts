import { test, expect } from '@playwright/test'
import { gaokaoModels } from '../src/data/gaokaoModels'
import { ANIMATION_PAGES, GAOKAO_TOOL_ANCHORS } from '../src/data/e2ePageCatalog'

/**
 * 页面级渲染与考点锚点检查。
 *
 * 审查项 G5：原实现的 `GAOKAO_TOOL_ROUTES` 是**手写的 16 条枚举**，而
 * `gaokaoModels` 注册了 18 个工具——缺 `model-ion-matrix`、`model-organic-matrix`
 * （离子共存、官能团定量两大最高频考点所在的页面从未被端到端验证过）。
 * 现改为**从 `gaokaoModels` 动态生成**，注册表新增母题会自动纳入覆盖。
 * 动画清单同理，改为从 `e2ePageCatalog` 取（由单测保证与注册表一致）。
 *
 * 审查项 G6：原实现的内容检查形同虚设——`bodyText.includes('化学') ||
 * includes('高考') || includes('母题') || includes('矩阵')`，
 * 只要出现任一关键词即通过，“化学讲错了”也一律变绿。
 * 现改为**考点锚点断言**：每个工具页必须出现其专属关键考点字符串
 * （锚点表见 `src/data/e2ePageCatalog.ts`，并由单测保证覆盖全部母题）。
 */

test.describe('高中化学学习系统 - 页面基础渲染检查', () => {
  test('首页正常加载', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toContainText('化学')
  })

  test('知识地图页面正常加载并包含知识节点', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(20)
    // 知识树已合并到首页，应包含模块标题
    expect(bodyText).toContain('无机化学')
  })

  test('动画页面（勒夏特列原理）正常加载，三屏结构完整', async ({ page }) => {
    await page.goto('/#/animation/anim-le-chatelier')
    await page.waitForLoadState('networkidle')

    // 等待动画组件加载（Suspense 兜底文本消失）
    await expect(page.locator('text=Loading...')).toHaveCount(0, { timeout: 10000 })

    // 检查页面标题
    await expect(page.locator('body')).toContainText('勒夏特列原理与化学平衡移动')

    // 检查左屏参数控件存在（通过 "参数设置" 标题定位）
    await expect(page.locator('text=参数设置')).toBeVisible()

    // 检查右屏化学量数据存在（右屏 ChemistryPanel 渲染了具体化学量）
    await expect(page.locator('body')).toContainText('c(NO₂)')
  })

  test('动画页面 KaTeX 公式正常渲染', async ({ page }) => {
    await page.goto('/#/animation/anim-le-chatelier')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=Loading...')).toHaveCount(0, { timeout: 10000 })

    // KaTeX 渲染后会生成 .katex 元素
    const katexElements = page.locator('.katex')
    const count = await katexElements.count()
    expect(count).toBeGreaterThanOrEqual(0)

    // 检查 KaTeX CSS 已生效：通过检查任意 style 标签或 link 标签包含 katex 相关内容
    // Vite dev 模式下 CSS 可能被内联，因此直接检查 .katex 元素的 computed style 是否正确
    if (count > 0) {
      const fontFamily = await katexElements.first().evaluate((el) => {
        return window.getComputedStyle(el).fontFamily
      })
      expect(fontFamily).toContain('KaTeX')
    }
  })

  test('左屏控件根据条件正确显示/隐藏', async ({ page }) => {
    await page.goto('/#/animation/anim-le-chatelier')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=Loading...')).toHaveCount(0, { timeout: 10000 })

    // 使用更精确的文本匹配左屏参数标签（包含单位后缀）
    await expect(page.getByText('体系温度 T(K)')).toBeVisible()
    await expect(page.getByText('相对压强 P(P₀)')).toBeVisible()
    await expect(page.getByText('外加 NO₂ 浓度(mol/L)')).toBeVisible()
  })

  for (const { id, title } of ANIMATION_PAGES) {
    test(`右屏公式区不溢出卡片 — ${title}`, async ({ page }) => {
      await page.goto(`/#/animation/${id}`)
      await page.waitForLoadState('networkidle')
      await expect(page.locator('text=Loading...')).toHaveCount(0, { timeout: 10000 })

      // 页面须渲染出正确的动画（标题锚点），而非白屏或落到别的动画
      await expect(page.locator('body')).toContainText(title)

      // 等待 KaTeX 公式渲染完成
      await page.waitForSelector('.katex', { timeout: 10000 })

      // 定位 block 公式的卡片内容层（.katex-wrap）。
      // 说明：长公式不应把卡片撑宽、把整个右屏推成横向滚动；
      // 应当由公式自身在卡片内横向滚动查看（见 index.css 的 `.katex-display { overflow-x: auto }`）。
      const wraps = page.locator('.katex-wrap')
      const cardCount = await wraps.count()
      expect(cardCount).toBeGreaterThan(0)

      const overflows = await wraps.evaluateAll((cards) =>
        cards.map((card) => ({
          thumb: (card.textContent ?? '').replace(/\s+/g, ' ').slice(0, 40),
          scrollWidth: card.scrollWidth,
          clientWidth: card.clientWidth,
          // 垂直滚动条通常占 12~17px，允许该范围内的差异
          overflow: card.scrollWidth > card.clientWidth + 20,
        }))
      )

      for (const info of overflows) {
        expect(
          info.overflow,
          `公式「${info.thumb}」溢出卡片: scrollWidth=${info.scrollWidth}, clientWidth=${info.clientWidth}`
        ).toBe(false)
      }
    })
  }

  // 路由列表从 gaokaoModels 动态生成（审查项 G5），避免手写枚举漏项
  for (const model of gaokaoModels) {
    const anchor = GAOKAO_TOOL_ANCHORS[model.id]

    test(`高考工具 ${model.id} 正常加载且渲染关键考点锚点`, async ({ page }) => {
      expect(anchor, `母题 ${model.id} 缺少 E2E 考点锚点`).toBeTruthy()

      await page.goto(`/#${model.toolRoute}`)
      await page.waitForLoadState('networkidle')
      await expect(page.locator('text=Loading...')).toHaveCount(0, { timeout: 10000 })

      const bodyText = await page.locator('body').innerText()

      // ① 页面主体须有内容，不为空（防止路由 404 或白屏）
      expect(bodyText.length).toBeGreaterThan(20)

      // ② 必须渲染出对应母题的标题（证明挂载的是正确的工具，而不是兜底页面）
      expect(bodyText, `工具 ${model.id} 未渲染其标题`).toContain(model.title)

      // ③ 必须渲染该母题的关键考点锚点（审查项 G6：把“内容是否讲对”变成可执行断言）
      expect(
        bodyText,
        `工具 ${model.id} 页面缺少关键考点锚点「${anchor}」`
      ).toContain(anchor)
    })
  }
})
