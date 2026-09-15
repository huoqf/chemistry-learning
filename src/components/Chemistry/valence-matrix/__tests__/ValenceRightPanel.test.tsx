import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ValenceRightPanel } from '../ValenceRightPanel'
import { VALENCE_MATRIX_DATA } from '@/data/valence-matrix'

describe('ValenceRightPanel', () => {
  it('应当完整显示长机理文本而不被截断，且反应物与产物完整共存', () => {
    const asConfig = VALENCE_MATRIX_DATA['As']
    expect(asConfig).toBeDefined()

    // 选中 H₃AsO₃
    const h3aso3Node = asConfig.items.find(i => i.substance.includes('H₃AsO₃'))
    expect(h3aso3Node).toBeDefined()

    const { container } = render(
      <MemoryRouter>
        <ValenceRightPanel currentConfig={asConfig} selectedSubstance={h3aso3Node!} />
      </MemoryRouter>
    )

    // 1. 验证长机理文本完整存在
    expect(container.textContent).toContain('As(III) 失去 2e⁻ 升高为 As(V)')
    expect(container.textContent).toContain('协同 Fe³⁺ 析出沉淀')

    // 2. 验证反应物与产物完整共存
    expect(container.textContent).toContain('H₃AsO₃')
    expect(container.textContent).toContain('FeAsO₄')

    // 3. 验证所需试剂完整存在
    expect(container.textContent).toContain('双氧水氧化为 As(V) 后加 Fe³⁺ 沉淀')

    // 4. 验证不存在导致文字截断的 truncate 样式
    const truncateElements = container.querySelectorAll('.truncate')
    expect(truncateElements.length).toBe(0)
  })

  it('双选推演模式下置顶展示推演深度剖析且长机理完整', () => {
    const asConfig = VALENCE_MATRIX_DATA['As']
    const fromNode = asConfig.items.find(i => i.substance.includes('H₃AsO₃'))!
    const toNode = asConfig.items.find(i => i.substance.includes('FeAsO₄'))!
    const trans = asConfig.transformations.find(t => t.id === 'as-2')!

    const { container } = render(
      <MemoryRouter>
        <ValenceRightPanel
          currentConfig={asConfig}
          selectedSubstance={fromNode}
          targetSubstance={toNode}
          activePairTransformation={trans}
        />
      </MemoryRouter>
    )

    expect(container.textContent).toContain('推演路径深度剖析')
    expect(container.textContent).toContain('转移机理:')
    expect(container.textContent).toContain('As(III) 失去 2e⁻ 升高为 As(V)，协同 Fe³⁺ 析出沉淀')
  })
})
