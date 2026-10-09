import type { ReactElement } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as chemistry3d from '@/components/Chemistry3D'

import { Crystal3DScene } from '@/features/crystal-3d-split/components/Crystal3DScene'
import { UnitCellScene } from '@/features/structure/unit-cell-calculation/components/UnitCellScene'
import { Isomer3DScene } from '@/features/structure/isomerism/components/Isomer3DScene'
import { OrganicMolecule3DModal } from '@/features/organic-functional-matrix/components/OrganicMolecule3DModal'
import { ORGANIC_3D_MOLECULES } from '@/features/organic-functional-matrix/data/organic3dData'
import { VseprCenterView } from '@/features/vsepr-hybrid-3d/components/VseprCenterView'
import VseprAnimation from '@/features/structure/vsepr-model/VseprAnimation'
import HybridOrbitalAnimation from '@/features/structure/hybrid-orbital/HybridOrbitalAnimation'
import ChiralMoleculeAnimation from '@/features/structure/chiral-molecule/ChiralMoleculeAnimation'
import { CRYSTAL_DATA_MAP } from '@/features/crystal-3d-split/data/crystalData'
import { CRYSTAL_DATABASE } from '@/features/structure/unit-cell-calculation/data/unitCellData'
import { VSEPR_MOLECULE_LIST } from '@/features/vsepr-hybrid-3d/data/vseprData'
import { PENTANE_ISOMERS } from '@/data/isomerData'

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const originalResizeObserver = globalThis.ResizeObserver

/** 统一标题（共享组件默认值，8 处调用点均未覆盖） */
const FALLBACK_TITLE = 'WebGL 3D 环境不可用'

/** 收集容器内所有元素上的全部 class token */
function collectClassTokens(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('*')).flatMap((el) =>
    Array.from(el.classList),
  )
}

interface SceneCase {
  name: string
  /** 该场景是否应带边框（与调用点是否传 framed 一致） */
  framed: boolean
  /** 降级文案中的特征片段，用于确认确实落到了该场景的 fallback */
  textHint: string | RegExp
  mount: () => ReactElement
}

const SCENES: SceneCase[] = [
  {
    name: 'VseprAnimation',
    framed: true,
    textHint: FALLBACK_TITLE,
    mount: () => <VseprAnimation />,
  },
  {
    name: 'HybridOrbitalAnimation',
    framed: true,
    textHint: FALLBACK_TITLE,
    mount: () => <HybridOrbitalAnimation />,
  },
  {
    name: 'Crystal3DScene',
    framed: true,
    textHint: /未开启 WebGL 硬件加速/,
    mount: () => (
      <Crystal3DScene crystalData={CRYSTAL_DATA_MAP.nacl} displayMode="default" edgeLengthPm={564} />
    ),
  },
  {
    name: 'UnitCellScene',
    framed: true,
    textHint: /未启用 WebGL 硬件加速/,
    mount: () => <UnitCellScene crystalData={CRYSTAL_DATABASE.nacl} edgeLengthPm={564} />,
  },
  {
    name: 'Isomer3DScene',
    framed: true,
    textHint: /未开启 WebGL 硬件加速/,
    mount: () => <Isomer3DScene isomer={PENTANE_ISOMERS[0]} />,
  },
  {
    name: 'OrganicMolecule3DModal',
    framed: true,
    textHint: /未启用 WebGL 硬件加速/,
    mount: () => (
      <OrganicMolecule3DModal
        molecule={Object.values(ORGANIC_3D_MOLECULES)[0]}
        onClose={() => {}}
      />
    ),
  },
  {
    name: 'VseprCenterView',
    framed: false,
    textHint: /暂不支持 WebGL 硬件加速/,
    mount: () => (
      <VseprCenterView
        molecule={VSEPR_MOLECULE_LIST[0]}
        displayMode="ball_stick"
        showAngleAnnotation
        showSpaceFilling={false}
      />
    ),
  },
  {
    name: 'ChiralMoleculeAnimation',
    framed: false,
    textHint: FALLBACK_TITLE,
    mount: () => <ChiralMoleculeAnimation />,
  },
]

describe('全库 WebGL 降级守卫与边框规范覆盖测试 (8/8 场景守门)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver
  })

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver
  })

  describe('WebGL 不可用：必须降级、不挂载画布、边框符合规范', () => {
    beforeEach(() => {
      vi.spyOn(chemistry3d, 'isWebGLAvailable').mockReturnValue(false)
    })

    for (const scene of SCENES) {
      it(`${scene.name}：降级到 fallback（framed=${scene.framed}），且无手写背景类`, () => {
        const { container } = render(scene.mount())

        // 1. 确实落到了该场景的 fallback 文案
        const anchor = screen.getByText(scene.textHint)
        expect(anchor).toBeDefined()

        // 2. 降级后不得挂载 R3F 画布
        expect(container.querySelector('canvas')).toBeNull()

        // 3. 定位 fallback 自身容器：文案节点的最近 div 祖先即降级组件根元素。
        //    不能直接用 render 容器做后续断言 —— 弹窗场景里宿主的遮罩 / 按钮面板
        //    本来就有自己的背景色，铁律 1 约束的是「降级容器自身」，不含宿主 UI。
        const fallbackRoot = anchor.closest('div') as HTMLElement
        expect(fallbackRoot).not.toBeNull()

        // 4. 边框规范：framed 场景根元素必须带边框，整屏场景必须不带
        expect(fallbackRoot.classList.contains('border')).toBe(scene.framed)
        expect(fallbackRoot.classList.contains('rounded-xl')).toBe(scene.framed)

        // 5. 铁律 1：降级容器子树不得出现任何手写背景类
        expect(collectClassTokens(fallbackRoot).filter((c) => c.startsWith('bg-'))).toEqual([])
      })
    }
  })

  describe('WebGL 可用：必须走正常路径，不得误显示降级提示', () => {
    beforeEach(() => {
      vi.spyOn(chemistry3d, 'isWebGLAvailable').mockReturnValue(true)
    })

    for (const scene of SCENES) {
      it(`${scene.name}：不显示降级提示`, () => {
        render(scene.mount())
        expect(screen.queryByText(FALLBACK_TITLE)).toBeNull()
      })
    }

    it('VseprAnimation：正向对照 —— 确实挂载了 3D 画布', () => {
      const { container } = render(<VseprAnimation />)
      expect(container.querySelectorAll('canvas').length).toBeGreaterThan(0)
    })
  })
})
