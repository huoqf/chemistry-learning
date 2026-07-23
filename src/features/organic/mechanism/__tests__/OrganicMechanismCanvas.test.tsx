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
    expect(screen.getByText('母题八：有机反应官能团断键机制工具')).toBeDefined()
    expect(screen.getByText('中屏视角模式切换')).toBeDefined()
    expect(screen.getByText('动画场景')).toBeDefined()
  })

  it('should switch reaction mechanism upon clicking mechanism buttons for all 6 mechanisms', () => {
    render(
      <MemoryRouter>
        <OrganicMechanismCanvas />
      </MemoryRouter>
    )

    // 机制 1：加成机制
    const additionBtn = screen.getByText('烯烃加成与马氏规则')
    fireEvent.click(additionBtn)
    expect(screen.getByText('丙烯 (CH₃-CH=CH₂) + HCl 亲电加成 (马氏规则)')).toBeDefined()

    // 机制 3：消去与扎伊采夫规则
    const eliminationBtn = screen.getByText('消去与取代')
    fireEvent.click(eliminationBtn)
    expect(screen.getByText('2-溴丁烷消去反应与扎伊采夫规则 (脱 HBr 生成 C=C)')).toBeDefined()

    // 机制 4：肽键生成与水解
    const peptideBtn = screen.getByText('肽键生成与水解')
    fireEvent.click(peptideBtn)
    expect(screen.getByText('氨基酸脱水缩合形成肽键 (-CO-NH-) 与水解断键')).toBeDefined()

    // 机制 5：酚醛缩聚与取代
    const phenolBtn = screen.getByText('酚醛缩聚与取代')
    fireEvent.click(phenolBtn)
    expect(screen.getByText('苯酚邻对位 C-H 键极化活化 (2,4,6-三溴苯酚取代与酚醛缩聚)')).toBeDefined()
  })

  it('should toggle reaction stages (reactants / transition / products)', () => {
    render(
      <MemoryRouter>
        <OrganicMechanismCanvas />
      </MemoryRouter>
    )

    // 切换到生成物阶段 (阶段 2)
    const productStageBtn = screen.getByText('3.生成产物')
    fireEvent.click(productStageBtn)

    expect(screen.getByText(/✓ 成功形成乙酸乙酯/i)).toBeDefined()
  })

  it('should switch parallel view modes (canvas / scoring / quiz) and present all 6 mechanism items', () => {
    render(
      <MemoryRouter>
        <OrganicMechanismCanvas />
      </MemoryRouter>
    )

    // 切换到视图 B：规范踩分
    const scoringTab = screen.getByText('规范踩分')
    fireEvent.click(scoringTab)
    expect(screen.getByText('高考规范答题踩分点与方程式手算推导')).toBeDefined()
    expect(screen.getByText(/机制 1 踩分/i)).toBeDefined()
    expect(screen.getByText(/机制 6 踩分/i)).toBeDefined()

    // 切换到视图 C：真题变式
    const quizTab = screen.getByText('真题变式')
    fireEvent.click(quizTab)
    expect(screen.getByText(/高考真题变式选择题/i)).toBeDefined()
    expect(screen.getByText(/包含 6 大机制对应的近几年高考真题/i)).toBeDefined()
    expect(screen.getByText(/2024 全国新课标卷/i)).toBeDefined()
    expect(screen.getByText(/2024 全国甲卷/i)).toBeDefined()
    expect(screen.getByText(/2024 山东卷/i)).toBeDefined()
    expect(screen.getByText(/2024 广东卷/i)).toBeDefined()
  })
})
