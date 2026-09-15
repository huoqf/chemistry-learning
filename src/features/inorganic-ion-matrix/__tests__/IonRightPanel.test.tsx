import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { IonRightPanel } from '../components/IonRightPanel'
import { IonChemEquation } from '../components/IonChemEquation'
import { ION_DATA } from '../constants'

describe('IonChemEquation 高中化学方程式自适应组件测试', () => {
  it('应正确拆分分号多步反应并渲染序号', () => {
    const multiStep =
      '2Fe^{2+} + Cl_2 = 2Fe^{3+} + 2Cl^- ; Fe^{3+} + 3SCN^- = Fe(SCN)_3'
    const { container } = render(<IonChemEquation equation={multiStep} />)
    expect(container.textContent).toContain('①')
    expect(container.textContent).toContain('②')
  })

  it('应提取末尾中文现象注释为独立 Badge', () => {
    const eqWithNote = 'Ag^+ + Cl^- = AgCl\\downarrow (不溶于稀硝酸的白色沉淀)'
    const { container } = render(<IonChemEquation equation={eqWithNote} />)
    expect(container.textContent).toContain('不溶于稀硝酸的白色沉淀')
  })

  it('单步方程式无分号时不显示①②', () => {
    const single = 'H^+ + OH^- = H_2O'
    const { container } = render(<IonChemEquation equation={single} />)
    expect(container.textContent).not.toContain('①')
  })
})

describe('IonRightPanel 右屏布局与模式联动测试', () => {
  const fe3 = ION_DATA.find((i) => i.id === 'Fe3+')!

  it('模式一 (single-test) 应正确显示实验阶段与特征反应', () => {
    const { container } = render(
      <IonRightPanel
        inquiryMode="single-test"
        selectedIon={fe3}
        selectedReagent={fe3.reagentOptions[0]}
        dropCount={1}
        conflicts={[]}
        coexistenceIons={[]}
      />
    )

    // 应包含滴加实验阶段指示
    expect(container.textContent).toContain('② 滴加少量试剂 (初探)')
    // 包含特征反应方程式和宏观现象
    expect(container.textContent).toContain('特征反应离子方程式 (必背)')
    // 包含高考避坑与标准答题模板
    expect(container.textContent).toContain('高考标准答题规范句式')
  })

  it('模式二 (coexistence-check) 应正确渲染冲突列表与互斥口诀', () => {
    const mockConflict = {
      id: 'fe3-i',
      type: 'redox' as const,
      typeLabel: '氧化还原反应',
      ionA: 'Fe3+',
      ionB: 'I-',
      equation: '2Fe^{3+} + 2I^- = 2Fe^{2+} + I_2',
      reason: 'Fe³⁺ 氧化性强于 I₂，自发氧化 I⁻ 为单质碘',
    }

    const { container } = render(
      <IonRightPanel
        inquiryMode="coexistence-check"
        dropCount={0}
        conflicts={[mockConflict]}
        coexistenceIons={[fe3]}
      />
    )

    expect(container.textContent).toContain('不能大量共存 (发现 1 处反应互斥)')
    expect(container.textContent).toContain('【氧化还原反应】')
    expect(container.textContent).toContain('高考离子共存四大互斥铁律口诀')
  })

  it('模式三 (mechanism-grid) 选中芯片时应展示母题深度机理', () => {
    const { container } = render(
      <IonRightPanel
        inquiryMode="mechanism-grid"
        dropCount={0}
        conflicts={[]}
        coexistenceIons={[]}
        selectedPair={{ cationId: 'Al3+', anionId: 'HCO3-' }}
      />
    )

    expect(container.textContent).toContain('Al³⁺ 遇 HCO₃⁻')
    expect(container.textContent).toContain('核心反应产物：')
    expect(container.textContent).toContain('高考命题陷阱与破题点拨')
  })

  it('模式四 (coexistence-matrix) 选定格子时应深度联动显示该格子化学机理', () => {
    const onBeaker = vi.fn()
    const { container } = render(
      <IonRightPanel
        inquiryMode="coexistence-matrix"
        dropCount={0}
        conflicts={[]}
        coexistenceIons={[]}
        selectedPair={{ cationId: 'Fe3+', anionId: 'S2-' }}
        onNavigateToBeaker={onBeaker}
      />
    )

    expect(container.textContent).toContain('Fe3+ + S2-')
    expect(container.textContent).toContain('✕ 互斥排斥')
    expect(container.textContent).toContain('导入烧杯微观模拟')
    expect(container.textContent).toContain('高考离子共存审题“四步秒杀法”')
  })
})
