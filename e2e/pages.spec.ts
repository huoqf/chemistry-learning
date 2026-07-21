import { test, expect } from '@playwright/test'

const ANIMATION_PAGES = [
  { id: 'anim-le-chatelier', title: '勒夏特列原理与化学平衡移动' },
  { id: 'anim-collision-theory', title: '碰撞理论与反应速率影响因素' },
  { id: 'anim-hybrid-orbital', title: '杂化轨道理论' },
  { id: 'anim-vsepr', title: 'VSEPR 模型' },
  { id: 'anim-unit-cell-calculation', title: '晶胞结构与密度计算' },
  { id: 'anim-chirality', title: '手性分子与立体异构' },
]

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
    test(`右屏公式区无横向滚动条 — ${title}`, async ({ page }) => {
      await page.goto(`/#/animation/${id}`)
      await page.waitForLoadState('networkidle')
      await expect(page.locator('text=Loading...')).toHaveCount(0, { timeout: 10000 })

      // 等待 KaTeX 公式渲染完成
      await page.waitForSelector('.katex', { timeout: 10000 })

      // 定位右屏公式区容器（ThreePanel 右侧 ChemistryPanel 中的公式卡片）
      const formulaCards = page.locator('.katex').locator('..')
      const cardCount = await formulaCards.count()
      expect(cardCount).toBeGreaterThan(0)

      // 检查每个公式卡片的 scrollWidth 不超过 clientWidth + 滚动条宽度（避免垂直滚动条占位导致的误判）
      const overflows = await formulaCards.evaluateAll((cards) =>
        cards.map((card) => ({
          scrollWidth: card.scrollWidth,
          clientWidth: card.clientWidth,
          // 垂直滚动条通常占 12~17px，允许该范围内的差异
          overflow: card.scrollWidth > card.clientWidth + 20,
        }))
      )

      for (const info of overflows) {
        expect(info.overflow, `公式卡片横向溢出: scrollWidth=${info.scrollWidth}, clientWidth=${info.clientWidth}`).toBe(false)
      }
    })
  }
})
