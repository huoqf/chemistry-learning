import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { IonMatrixScene } from '../components/IonMatrixScene'
import { ION_DATA } from '../constants'

describe('IonMatrixScene 中屏场景渲染测试', () => {
  const font = (n: number) => n
  const fe3 = ION_DATA.find((i) => i.id === 'Fe3+')!
  const al3 = ION_DATA.find((i) => i.id === 'Al3+')!

  it('单离子特征检验模式下应渲染标准 DropperApparatus 与 TestTubeApparatus', () => {
    const onDrop = vi.fn()
    const { container } = render(
      <svg>
        <IonMatrixScene
          mode="single-test"
          selectedIon={fe3}
          selectedReagent={fe3.reagentOptions[0]}
          dropCount={0}
          coexistenceIons={[]}
          conflicts={[]}
          font={font}
          onDropReagent={onDrop}
        />
      </svg>
    )

    // 必须包含标准化学器材组件 DropperApparatus
    const dropper = container.querySelector('.chem-dropper-apparatus')
    expect(dropper).toBeTruthy()

    // 必须包含试管容器及 TestTubeApparatus 玻璃主体
    const testTube = container.querySelector('.chem-test-tube-container')
    expect(testTube).toBeTruthy()

    // 必须包含垂直悬空实验规范提示
    expect(container.textContent).toContain('胶头滴管垂直悬空于管口上方')
  })

  it('滴加进行时应更新滴管挤压状态与液滴显示', () => {
    const { container } = render(
      <svg>
        <IonMatrixScene
          mode="single-test"
          selectedIon={al3}
          selectedReagent={al3.reagentOptions[0]}
          dropCount={1}
          coexistenceIons={[]}
          conflicts={[]}
          font={font}
        />
      </svg>
    )

    const dropper = container.querySelector('.chem-dropper-apparatus')
    expect(dropper).toBeTruthy()
    // 滴加状态下按钮文字更新
    expect(container.textContent).toContain('点击继续滴加')
  })

  it('共存排斥大容器模式下应渲染标准 BeakerApparatus 烧杯组件', () => {
    const { container } = render(
      <svg>
        <IonMatrixScene
          mode="coexistence-check"
          coexistenceIons={[fe3, al3]}
          conflicts={[]}
          dropCount={0}
          font={font}
        />
      </svg>
    )

    // 必须包含烧杯容器及 BeakerApparatus 刻度组件
    const beaker = container.querySelector('.chem-beaker-container')
    expect(beaker).toBeTruthy()
    expect(container.textContent).toContain('500mL')

    // 必须显示所选离子标签
    expect(container.textContent).toContain('Fe3+')
    expect(container.textContent).toContain('Al3+')
  })
})
