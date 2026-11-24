import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { GaokaoDiagram } from '../GaokaoDiagram'

describe('GaokaoDiagram 默认看图防剧透守卫测试', () => {
  it('catalytic-cycle 默认模式不泄露 RDS 决速步答案，展开解析后显示', () => {
    const { container: normal } = render(
      <GaokaoDiagram
        diagramType="organic-mechanism-diagram"
        config={{ title: '催化循环图', mechanismType: 'catalytic-cycle' }}
        isAnalysisMode={false}
      />
    )
    expect(normal.textContent).not.toContain('RDS')

    const { container: analysis } = render(
      <GaokaoDiagram
        diagramType="organic-mechanism-diagram"
        config={{ title: '催化循环图', mechanismType: 'catalytic-cycle' }}
        isAnalysisMode={true}
      />
    )
    expect(analysis.textContent).toContain('RDS')
  })

  it('cod-back-titration 默认模式不泄露“红褐色”终点颜色', () => {
    const { container: normal } = render(
      <GaokaoDiagram
        diagramType="titration-error-diagram"
        config={{ title: 'COD 返滴定', errorDiagramType: 'cod-back-titration' }}
        isAnalysisMode={false}
      />
    )
    expect(normal.textContent).not.toContain('红褐色')

    const { container: analysis } = render(
      <GaokaoDiagram
        diagramType="titration-error-diagram"
        config={{ title: 'COD 返滴定', errorDiagramType: 'cod-back-titration' }}
        isAnalysisMode={true}
      />
    )
    expect(analysis.textContent).toContain('红褐色')
  })

  it('iodometry-purity 默认模式不泄露“蓝色恰好褪去”终点现象', () => {
    const { container: normal } = render(
      <GaokaoDiagram
        diagramType="titration-error-diagram"
        config={{ title: '间接碘量法纯度测定', errorDiagramType: 'iodometry-purity' }}
        isAnalysisMode={false}
      />
    )
    expect(normal.textContent).not.toContain('蓝色恰好褪去')

    const { container: analysis } = render(
      <GaokaoDiagram
        diagramType="titration-error-diagram"
        config={{ title: '间接碘量法纯度测定', errorDiagramType: 'iodometry-purity' }}
        isAnalysisMode={true}
      />
    )
    expect(analysis.textContent).toContain('蓝色恰好褪去')
  })

  it('precipitation-curve 先后顺序题默认模式不泄露离子名称，且解析模式动态匹配工艺区间', () => {
    const { container: orderNormal } = render(
      <GaokaoDiagram
        diagramType="precipitation-curve"
        config={{ title: 'Fe³⁺、Al³⁺、Mg²⁺ 混合液滴加强碱分步沉淀 lg c - pH 竞争曲线图' }}
        isAnalysisMode={false}
      />
    )
    const svgText = orderNormal.querySelector('svg')?.textContent ?? ''
    expect(svgText).not.toContain('Fe³⁺')
    expect(svgText).toContain('曲线 ①')

    const { container: orderAnalysis } = render(
      <GaokaoDiagram
        diagramType="precipitation-curve"
        config={{ title: 'Fe³⁺、Al³⁺、Mg²⁺ 混合液滴加强碱分步沉淀 lg c - pH 竞争曲线图' }}
        isAnalysisMode={true}
      />
    )
    const analysisSvgText = orderAnalysis.querySelector('svg')?.textContent ?? ''
    expect(analysisSvgText).toContain('Fe³⁺')
    expect(analysisSvgText).toContain('Al³⁺')
    expect(analysisSvgText).toContain('Mg²⁺')

    const { container: znAnalysis } = render(
      <GaokaoDiagram
        diagramType="precipitation-curve"
        config={{ title: '黄铜废渣中 Cu²⁺/Zn²⁺ 调 pH 除杂 lg c - pH 分布图' }}
        isAnalysisMode={true}
      />
    )
    expect(znAnalysis.textContent).toContain('[4.7 ~ 6.2)')
    expect(znAnalysis.textContent).not.toContain('[4.7 ~ 8.1)')
  })

  it('precipitation-curve Zn/Ti/三元锂电池体系在先后顺序题默认模式下同样隐藏金属离子名称，解析后展示', () => {
    for (const [title, hiddenLabels] of [
      ['Cu²⁺、Zn²⁺ 混合溶液沉淀先后顺序图', ['Cu²⁺', 'Zn²⁺']],
      ['钛铁矿 TiO²⁺、Fe²⁺ 分步沉淀先后顺序图', ['TiO²⁺', 'Fe²⁺']],
      ['三元锂电池 Co²⁺、Ni²⁺ 沉淀先后顺序图', ['Co²⁺', 'Ni²⁺']],
    ] as const) {
      const { container: normal } = render(
        <GaokaoDiagram diagramType="precipitation-curve" config={{ title }} isAnalysisMode={false} />
      )
      const normalSvg = normal.querySelector('svg')?.textContent ?? ''
      for (const lbl of hiddenLabels) {
        expect(normalSvg).not.toContain(lbl)
      }
      expect(normalSvg).toContain('曲线 ③')

      const { container: analysis } = render(
        <GaokaoDiagram diagramType="precipitation-curve" config={{ title }} isAnalysisMode={true} />
      )
      const analysisSvg = analysis.querySelector('svg')?.textContent ?? ''
      for (const lbl of hiddenLabels) {
        expect(analysisSvg).toContain(lbl)
      }
    }
  })
})
