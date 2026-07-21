import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

vi.mock('@/data/knowledgeTree', () => ({
  knowledgeTree: [
    {
      id: 'amount-of-substance',
      title: '物质的量',
      chapter: '必修一',
      module: '无机化学',
      importance: 'core',
      animationIds: ['anim-titration'],
    },
    {
      id: 'reaction-rate',
      title: '化学反应速率',
      chapter: '选择性必修一',
      module: '反应原理',
      importance: 'gaokao',
      animationIds: [],
    },
    {
      id: 'atomic-structure',
      title: '原子结构',
      chapter: '选择性必修二',
      module: '物质结构',
      importance: 'core',
      animationIds: [],
    },
    {
      id: 'methane',
      title: '甲烷与烷烃',
      chapter: '必修二',
      module: '有机化学',
      importance: 'basic',
      animationIds: [],
    },
    {
      id: 'titration',
      title: '酸碱中和滴定',
      chapter: '通用',
      module: '化学实验',
      importance: 'gaokao',
      animationIds: [],
    },
  ],
}))

vi.mock('@/data/animationRegistry', () => ({
  getAnimationConfig: (id: string) => {
    if (id === 'anim-titration') {
      return { title: '酸碱中和滴定动画', knowledgeId: 'amount-of-substance' }
    }
    return undefined
  },
  getAnimationCount: () => 1,
}))

vi.mock('@/stores', () => ({
  useProgressStore: () => ({
    masteredKnowledge: [],
    setTotalCounts: vi.fn(),
  }),
}))

import { KnowledgeTreeHome } from '../KnowledgeTreeHome'

describe('KnowledgeTreeHome 高考化学主页知识地图组件测试', () => {
  const renderWithRouter = (component: React.ReactNode) =>
    render(<MemoryRouter>{component}</MemoryRouter>)

  it('成功渲染核心标题与统计看板', () => {
    renderWithRouter(<KnowledgeTreeHome />)
    expect(screen.getByText('高考知识地图实验室')).toBeInTheDocument()
    expect(screen.getByText('已开放实验')).toBeInTheDocument()
    expect(screen.getByText('高考总考点')).toBeInTheDocument()
    expect(screen.getByText('学科大板块')).toBeInTheDocument()
  })

  it('成功渲染高中化学 5 大核心板块', () => {
    renderWithRouter(<KnowledgeTreeHome />)
    expect(screen.getByText('无机化学与元素化合物')).toBeInTheDocument()
    expect(screen.getByText('化学反应原理与电化学')).toBeInTheDocument()
    expect(screen.getByText('物质结构与晶体性质')).toBeInTheDocument()
    expect(screen.getByText('有机化学基础与合成')).toBeInTheDocument()
    expect(screen.getByText('化学实验与定量分析')).toBeInTheDocument()
  })

  it('正常展示已激活节点与规划中节点', () => {
    renderWithRouter(<KnowledgeTreeHome />)
    expect(screen.getByText('实验室已开放')).toBeInTheDocument()
    const plannedLabels = screen.getAllByText('规划中')
    expect(plannedLabels.length).toBeGreaterThanOrEqual(1)
  })

  it('正常展示考点名称', () => {
    renderWithRouter(<KnowledgeTreeHome />)
    expect(screen.getByText('物质的量')).toBeInTheDocument()
    expect(screen.getByText('化学反应速率')).toBeInTheDocument()
    expect(screen.getByText('原子结构')).toBeInTheDocument()
    expect(screen.getByText('甲烷与烷烃')).toBeInTheDocument()
    expect(screen.getByText('酸碱中和滴定')).toBeInTheDocument()
  })
})
