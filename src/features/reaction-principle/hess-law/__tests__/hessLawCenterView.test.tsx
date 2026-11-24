import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HessLawCenterView } from '../components/HessLawCenterView'
import { useHessLawChemistry } from '../hooks/useHessLawChemistry'
import { getModelQuizData } from '@/data/quiz'
import type { HessLawParams } from '../types'

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

const Harness = ({
  params,
  viewMode,
}: {
  params: HessLawParams
  viewMode: number
}) => {
  const chemistry = useHessLawChemistry(params)
  const quizData = getModelQuizData('model-hess-law')
  return (
    <MemoryRouter>
      <HessLawCenterView
        params={params}
        chemistry={chemistry}
        quizData={quizData}
        viewMode={viewMode}
      />
    </MemoryRouter>
  )
}

const baseParams: HessLawParams = {
  mode: 'hess-overlay',
  hessGroupIndex: 0,
  k1: 1,
  k2: -0.5,
  bondMoleculeIndex: 0,
  hasCatalyst: 1,
}

describe('HessLawCenterView 渲染与三视角冒烟测试', () => {
  it('在 hess-overlay 模式下能渲染盖斯定律叠加与消去物种信息', () => {
    render(<Harness params={baseParams} viewMode={0} />)
    expect(screen.getByText('盖斯定律代数叠加与中间微粒消去分析')).toBeDefined()
    expect(screen.getByText(/已对齐目标反应/)).toBeDefined()
    expect(screen.getByText(/已代数消去中间物种/)).toBeDefined()
  })

  it('在 bond-energy 模式下能渲染微观断键吸热与成键放热图谱', () => {
    render(
      <Harness
        params={{ ...baseParams, mode: 'bond-energy', bondMoleculeIndex: 2 }}
        viewMode={0}
      />
    )
    expect(screen.getByText(/微观断键与成键能量高程图/)).toBeDefined()
    expect(screen.getByText(/断键吸收总能量/)).toBeDefined()
    expect(screen.getByText(/成键释放总能量/)).toBeDefined()
  })

  it('在 energy-profile 模式下能渲染无催化与催化双峰能垒历程', () => {
    render(
      <Harness
        params={{ ...baseParams, mode: 'energy-profile', hasCatalyst: 1 }}
        viewMode={0}
      />
    )
    expect(screen.getByText(/反应历程与活化能高程图/)).toBeDefined()
    expect(screen.getAllByText(/决速步/).length).toBeGreaterThanOrEqual(1)
  })

  it('在 viewMode=1（规范踩分）与 viewMode=2（变式演练）下正常渲染，且切回 viewMode=0 时保留主场景容器防 ResizeObserver 失灵', () => {
    const { container, rerender } = render(<Harness params={baseParams} viewMode={0} />)
    const initialSvg = container.querySelector('svg')
    expect(initialSvg).not.toBeNull()

    rerender(<Harness params={baseParams} viewMode={1} />)
    expect(screen.getByText(/高考规范答题踩分点与盖斯定律计算步骤/)).toBeDefined()
    expect(container.querySelector('.hidden svg')).toBe(initialSvg)

    rerender(<Harness params={baseParams} viewMode={2} />)
    expect(screen.getByText(/考点变式选择题 & 详细解析/)).toBeDefined()

    rerender(<Harness params={baseParams} viewMode={0} />)
    expect(container.querySelector('.hidden')).toBeNull()
    expect(container.querySelector('svg')).toBe(initialSvg)
  })
})
