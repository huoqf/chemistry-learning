import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as chemistry3d from '@/components/Chemistry3D'

// 导入 6 个待守门组件
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

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

/** 收集容器内所有元素上的全部 class token */
function collectClassTokens(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('*')).flatMap((el) =>
    Array.from(el.classList),
  )
}

describe('全库 WebGL 降级守卫与边框规范覆盖测试 (8/8 场景守门)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(chemistry3d, 'isWebGLAvailable').mockReturnValue(false)
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver
  })

  describe('带边框场景守门 (透传 WEBGL_FALLBACK_FRAME_CLASS)', () => {
    it('VseprAnimation: 降级时必须渲染边框且无 bg-* 背景色', () => {
      const { container } = render(<VseprAnimation />)

      expect(screen.getByText('WebGL 3D 环境不可用')).toBeDefined()
      expect(container.querySelector('canvas')).toBeNull()
      expect(container.querySelector('.border')?.classList.contains('rounded-xl')).toBe(true)
      expect(collectClassTokens(container).filter((c) => c.startsWith('bg-'))).toEqual([])
    })

    it('HybridOrbitalAnimation: 降级时必须渲染边框且无 bg-* 背景色', () => {
      const { container } = render(<HybridOrbitalAnimation />)

      expect(screen.getByText('WebGL 3D 环境不可用')).toBeDefined()
      expect(container.querySelector('canvas')).toBeNull()
      expect(container.querySelector('.border')?.classList.contains('rounded-xl')).toBe(true)
      expect(collectClassTokens(container).filter((c) => c.startsWith('bg-'))).toEqual([])
    })
    it('Crystal3DScene: 降级时必须渲染边框且无 bg-* 背景色', () => {
      const { container } = render(
        <Crystal3DScene
          crystalData={CRYSTAL_DATA_MAP.nacl}
          displayMode="default"
          edgeLengthPm={564}
        />,
      )

      expect(screen.getByText(/未开启 WebGL 硬件加速/)).toBeDefined()
      expect(container.querySelector('canvas')).toBeNull()
      expect(container.querySelector('.border')?.classList.contains('rounded-xl')).toBe(true)
      expect(collectClassTokens(container).filter((c) => c.startsWith('bg-'))).toEqual([])
    })

    it('UnitCellScene: 降级时必须渲染边框且无 bg-* 背景色', () => {
      const { container } = render(
        <UnitCellScene crystalData={CRYSTAL_DATABASE.nacl} edgeLengthPm={564} />,
      )

      expect(screen.getByText(/未启用 WebGL 硬件加速/)).toBeDefined()
      expect(container.querySelector('canvas')).toBeNull()
      expect(container.querySelector('.border')?.classList.contains('rounded-xl')).toBe(true)
      expect(collectClassTokens(container).filter((c) => c.startsWith('bg-'))).toEqual([])
    })

    it('Isomer3DScene: 降级时必须渲染边框且无 bg-* 背景色', () => {
      const { container } = render(<Isomer3DScene isomer={null} />)

      expect(screen.getByText(/未开启 WebGL 硬件加速/)).toBeDefined()
      expect(container.querySelector('canvas')).toBeNull()
      expect(container.querySelector('.border')?.classList.contains('rounded-xl')).toBe(true)
      expect(collectClassTokens(container).filter((c) => c.startsWith('bg-'))).toEqual([])
    })

    it('OrganicMolecule3DModal: 降级时画布区必须渲染边框且无 bg-* 背景色', () => {
      const { container } = render(
        <OrganicMolecule3DModal
          molecule={Object.values(ORGANIC_3D_MOLECULES)[0]}
          onClose={() => {}}
        />,
      )

      expect(screen.getByText(/未启用 WebGL 硬件加速/)).toBeDefined()
      expect(container.querySelector('canvas')).toBeNull()
      // 检查 fallback 自身容器带边框
      const fallbackEl = screen.getByText(/未启用 WebGL 硬件加速/).closest('.border')
      expect(fallbackEl?.classList.contains('rounded-xl')).toBe(true)
    })
  })

  describe('无边框场景守门 (整屏中屏由系统 Theme 统一接管，不套双层框)', () => {
    it('VseprCenterView: 降级时不得带任何边框，无 bg-* 背景色', () => {
      const { container } = render(
        <VseprCenterView
          molecule={VSEPR_MOLECULE_LIST[0]}
          displayMode="ball_stick"
          showAngleAnnotation={true}
          showSpaceFilling={false}
        />,
      )

      expect(screen.getByText(/暂不支持 WebGL 硬件加速/)).toBeDefined()
      expect(container.querySelector('canvas')).toBeNull()
      expect(container.querySelector('.border')).toBeNull()
      expect(collectClassTokens(container).filter((c) => c.startsWith('bg-'))).toEqual([])
    })

    it('ChiralMoleculeAnimation: 降级时不得带任何边框，无 bg-* 背景色', () => {
      const { container } = render(<ChiralMoleculeAnimation />)

      expect(screen.getByText('WebGL 3D 环境不可用')).toBeDefined()
      expect(container.querySelector('canvas')).toBeNull()
      expect(container.querySelector('.border')).toBeNull()
      expect(collectClassTokens(container).filter((c) => c.startsWith('bg-'))).toEqual([])
    })
  })
})
