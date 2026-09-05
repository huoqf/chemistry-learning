import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrganicMechanismCanvas } from '../OrganicMechanismCanvas'
import { MemoryRouter } from 'react-router-dom'

// Mock 桌面端大屏断点
vi.mock('@/utils/useBreakpoint', () => ({
  useBreakpoint: () => 'standard',
}))

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('OrganicMechanismCanvas Component', () => {
  it('should render the organic mechanism canvas with default title', () => {
    render(
      <MemoryRouter>
        <OrganicMechanismCanvas />
      </MemoryRouter>
    )

    // 验证机制选择与渲染
    expect(screen.getByText('母题六：有机反应机理与键位断裂重组')).toBeDefined()
    expect(screen.getByText('图谱探究')).toBeDefined()
  })

  it('should switch reaction mechanism upon clicking mechanism buttons for all 6 mechanisms', () => {
    render(
      <MemoryRouter>
        <OrganicMechanismCanvas />
      </MemoryRouter>
    )

    // 默认即为机制 0：加成机制
    expect(screen.getByText('丙烯 (CH₃-CH=CH₂) + HCl 亲电加成 (马氏规则)')).toBeDefined()

    // 机制 1：消去与取代
    const eliminationBtn = screen.getByText('卤代烃消去与取代')
    fireEvent.click(eliminationBtn)
    expect(screen.getByText('2-溴丁烷消去反应与扎伊采夫规则 (脱 HBr 生成 C=C)')).toBeDefined()

    // 机制 2：醇催化氧化
    const oxidationBtn = screen.getByText('醇的催化氧化机制')
    fireEvent.click(oxidationBtn)
    expect(screen.getByText('乙醇 (含 α-H) 催化氧化生成乙醛')).toBeDefined()

    // 机制 3：酯化与水解
    const esterBtn = screen.getByText('酯化与酯的水解机制')
    fireEvent.click(esterBtn)
    expect(screen.getAllByText(/酸脱羟基/i)[0]).toBeDefined()

    // 机制 4：酚羟基邻对位活化机制
    const phenolBtn = screen.getByText('酚羟基邻对位活化机制')
    fireEvent.click(phenolBtn)
    expect(screen.getByText('苯酚邻对位 C-H 键极化活化 (2,4,6-三溴苯酚三取代反应与酚醛缩聚机理)')).toBeDefined()

    // 机制 5：肽键生成与水解机制
    const peptideBtn = screen.getByText('肽键生成与水解机制')
    fireEvent.click(peptideBtn)
    expect(screen.getByText('氨基酸脱水缩合形成肽键 (-CO-NH-) 与水解断键')).toBeDefined()
  })

  it('should toggle reaction stages (reactants / transition / products)', () => {
    render(
      <MemoryRouter>
        <OrganicMechanismCanvas />
      </MemoryRouter>
    )

    // 切换到生成物阶段 (阶段 2)
    const productStageBtn = screen.getAllByText('生成物稳态')[0]
    fireEvent.click(productStageBtn)

    expect(screen.getAllByText(/2-氯丙烷/i)[0]).toBeDefined()
  })

  it('should switch parallel view modes (canvas / scoring / quiz) and present all 6 mechanism items', () => {
    render(
      <MemoryRouter>
        <OrganicMechanismCanvas />
      </MemoryRouter>
    )

    // 切换到视图 B：规范踩分
    const scoringTab = screen.getAllByText('规范踩分')[0]
    fireEvent.click(scoringTab)
    expect(screen.getByText('高考规范答题踩分点与方程式手算推导')).toBeDefined()
    expect(screen.getByText(/机制 1 踩分/i)).toBeDefined()
    expect(screen.getByText(/机制 6 踩分/i)).toBeDefined()
    expect(screen.getByText(/新高考压轴踩分/i)).toBeDefined()

    // 切换到视图 C：真题变式
    const quizTab = screen.getAllByText(/真题/i)[0]
    fireEvent.click(quizTab)
    expect(screen.getByText(/高考真题变式选择题/i)).toBeDefined()
    expect(screen.getByText(/包含 8 大机制对应的近几年高考真题/i)).toBeDefined()
    expect(screen.getByText(/2024 全国新课标卷/i)).toBeDefined()
    expect(screen.getByText(/2024 全国甲卷/i)).toBeDefined()
    expect(screen.getByText(/2024 山东卷/i)).toBeDefined()
    expect(screen.getByText(/2024 广东卷/i)).toBeDefined()
  })

  it('should synchronize left panel teaching guide and right chemistry panel with stage and solvent controls', () => {
    render(
      <MemoryRouter>
        <OrganicMechanismCanvas />
      </MemoryRouter>
    )

    // 验证左屏教学指引 (默认加成)
    expect(screen.getByText('高考实验条件与设问指引')).toBeDefined()
    expect(screen.getByText(/HCl 中的 H⁺ 优先加在/i)).toBeDefined()

    // 验证右屏 ChemistryPanel 深度联动
    expect(screen.getAllByText(/马氏规则/)[0]).toBeDefined()

    // 切换到机制 1：卤代烃消去与取代
    const eliminationBtn = screen.getByText('卤代烃消去与取代')
    fireEvent.click(eliminationBtn)

    // 验证溶剂切换控件存在
    expect(screen.getByText('水溶液 (取代成醇)')).toBeDefined()
    const waterBtn = screen.getByText('水溶液 (取代成醇)')
    fireEvent.click(waterBtn)

    // 验证中屏场景与右屏公式同步切换为水解取代
    expect(screen.getByText(/2-溴丁烷水解取代反应/i)).toBeDefined()
  })

  it('should thoroughly verify all 6 mechanisms across all stages (0: reactants, 1: transition, 2: products) and variants', () => {
    render(
      <MemoryRouter>
        <OrganicMechanismCanvas />
      </MemoryRouter>
    )

    // ── 机制 0: 烯烃加成 ──
    fireEvent.click(screen.getAllByText('烯烃加成与马氏规则')[0])
    fireEvent.click(screen.getAllByText('反应物始态')[0])
    expect(screen.getByText('1号碳 (H多)')).toBeDefined()
    fireEvent.click(screen.getAllByText('断键过渡态')[0])
    expect(screen.getByText('✂ π 键打开')).toBeDefined()
    fireEvent.click(screen.getAllByText('生成物稳态')[0])
    expect(screen.getByText(/主产物：2-氯丙烷/i)).toBeDefined()
    expect(screen.getByText(/新生成 C-Cl σ键/i)).toBeDefined()

    // ── 机制 1: 消去与水解取代 ──
    fireEvent.click(screen.getAllByText('卤代烃消去与取代')[0])
    fireEvent.click(screen.getAllByText('反应物始态')[0])
    expect(screen.getByText('3号碳 (β₂-C, 2H)')).toBeDefined()
    fireEvent.click(screen.getAllByText('断键过渡态')[0])
    expect(screen.getByText(/✂ 脱 HBr/i)).toBeDefined()
    fireEvent.click(screen.getAllByText('生成物稳态')[0])
    expect(screen.getAllByText(/2-丁烯/i)[0]).toBeDefined()
    expect(screen.getByText(/新形成 C=C 双键/i)).toBeDefined()
    // 水解取代分支
    fireEvent.click(screen.getByText('水溶液 (取代成醇)'))
    expect(screen.getAllByText(/2-丁醇/i)[0]).toBeDefined()
    expect(screen.getByText(/新羟基取代生成/i)).toBeDefined()

    // ── 机制 2: 醇催化氧化 ──
    fireEvent.click(screen.getAllByText('醇的催化氧化机制')[0])
    fireEvent.click(screen.getAllByText('反应物始态')[0])
    expect(screen.getByText('α-C')).toBeDefined()
    fireEvent.click(screen.getAllByText('生成物稳态')[0])
    expect(screen.getAllByText(/生成物：乙醛/i)[0]).toBeDefined()
    expect(screen.getByText(/新生成 C=O 羰基/i)).toBeDefined()
    // 叔丁醇反例
    const toggleBtn = screen.getByRole('switch')
    fireEvent.click(toggleBtn)
    expect(screen.getAllByText(/叔丁醇无 α-H/i)[0]).toBeDefined()
    fireEvent.click(toggleBtn) // 复位

    // ── 机制 3: 酯化与水解 ──
    fireEvent.click(screen.getAllByText('酯化与酯的水解机制')[0])
    fireEvent.click(screen.getAllByText('反应物始态')[0])
    expect(screen.getAllByText(/乙酸 \(CH₃COOH\)/i)[0]).toBeDefined()
    fireEvent.click(screen.getAllByText('断键过渡态')[0])
    expect(screen.getByText('✂ 酸脱 -OH')).toBeDefined()
    expect(screen.getByText('✂ 醇脱 -H')).toBeDefined()
    fireEvent.click(screen.getAllByText('生成物稳态')[0])
    expect(screen.getAllByText(/✓ 成功形成乙酸乙酯/i)[0]).toBeDefined()
    expect(screen.getByText(/新酯键 \(来自醇\)/i)).toBeDefined()
    // 验证 18O 示踪开关联动 (默认开启，切换后为常规模式，再次点击复位)
    expect(screen.getAllByText(/示踪高亮开启/i)[0]).toBeDefined()
    const toggle18OBtn = screen.getByRole('switch')
    fireEvent.click(toggle18OBtn)
    expect(screen.getAllByText(/常规模式/i)[0]).toBeDefined()
    fireEvent.click(toggle18OBtn) // 复位
    expect(screen.getAllByText(/示踪高亮开启/i)[0]).toBeDefined()

    // ── 机制 4: 酚羟基活化 ──
    fireEvent.click(screen.getAllByText('酚羟基邻对位活化机制')[0])
    fireEvent.click(screen.getAllByText('反应物始态')[0])
    expect(screen.getAllByText(/苯酚邻对位 C-H 键极化活化/i)[0]).toBeDefined()
    fireEvent.click(screen.getAllByText('断键过渡态')[0])
    expect(screen.getAllByText('✂ 邻位断 C-H')[0]).toBeDefined()
    expect(screen.getByText('✂ 对位断 C-H')).toBeDefined()
    fireEvent.click(screen.getAllByText('生成物稳态')[0])
    expect(screen.getAllByText(/2,4,6-三溴苯酚白色沉淀/i)[0]).toBeDefined()

    // ── 机制 5: 肽键缩合与水解 ──
    fireEvent.click(screen.getAllByText('肽键生成与水解机制')[0])
    fireEvent.click(screen.getAllByText('反应物始态')[0])
    expect(screen.getAllByText(/甘氨酸 \(H₂N-CH₂-COOH\)/i)[0]).toBeDefined()
    fireEvent.click(screen.getAllByText('断键过渡态')[0])
    expect(screen.getByText('✂ 羧基脱 -OH')).toBeDefined()
    expect(screen.getByText('✂ 氨基脱 -H')).toBeDefined()
    fireEvent.click(screen.getAllByText('生成物稳态')[0])
    expect(screen.getAllByText(/生成甘丙二肽/i)[0]).toBeDefined()
    expect(screen.getByText(/新形成肽键 \(-CO-NH-\)/i)).toBeDefined()
  })

  it('should strictly align with Gaokao chemistry exam points, traps and formulas across mechanisms', () => {
    render(
      <MemoryRouter>
        <OrganicMechanismCanvas />
      </MemoryRouter>
    )

    // 1. 验证加成机制易错警示与化学量
    expect(screen.getAllByText(/马氏规则/i)[0]).toBeDefined()
    expect(screen.getAllByText(/仲碳正离子更稳定/i)[0]).toBeDefined()
    expect(screen.getAllByText(/反马氏加成/i)[0]).toBeDefined()

    // 2. 切换机制 1：验证卤素水层酸化检验与扎伊采夫规则
    fireEvent.click(screen.getAllByText('卤代烃消去与取代')[0])
    expect(screen.getAllByText(/醇出双键/i)[0]).toBeDefined()
    expect(screen.getAllByText(/取水解后的水层清液少许/i)[0]).toBeDefined()

    // 3. 切换机制 3：验证饱和碳酸钠三作用与防倒吸
    fireEvent.click(screen.getAllByText('酯化与酯的水解机制')[0])
    expect(screen.getAllByText(/饱和 Na₂CO₃ 溶液三作用/i)[0]).toBeDefined()
    expect(screen.getAllByText(/碳酸钠液三功效/i)[0]).toBeDefined()
    expect(screen.getAllByText(/液面之上防倒吸/i)[0]).toBeDefined()

    // 4. 切换机制 5：验证肽键结构简式规范术语
    fireEvent.click(screen.getAllByText('肽键生成与水解机制')[0])
    expect(screen.getAllByText(/肽键的结构简式为 -CO-NH-/i)[0]).toBeDefined()
  })
})
