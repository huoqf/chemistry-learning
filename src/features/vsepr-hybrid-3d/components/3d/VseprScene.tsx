import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { VseprMoleculeData, DisplayMode } from '../../types'
import { MoleculeMesh } from './MoleculeMesh'
import { HybridOrbitalMesh } from './HybridOrbitalMesh'
import { LonePairMesh } from './LonePairMesh'
import { BondAngleAnnotation } from './BondAngleAnnotation'
import { VseprPolyhedronFrame } from './VseprPolyhedronFrame'
import { RepulsionVectors } from './RepulsionVectors'

interface VseprSceneProps {
  molecule: VseprMoleculeData
  displayMode: DisplayMode
  showAngleAnnotation: boolean
  showSpaceFilling: boolean
  className?: string
}

/**
 * 3D VSEPR 场景组件 (4 种模式界限严谨分明，符合量子化学与选必二规范)
 */
export const VseprScene: React.FC<VseprSceneProps> = ({
  molecule,
  displayMode,
  showAngleAnnotation,
  showSpaceFilling,
  className = '',
}) => {
  const centerAtom = molecule.atoms.find(a => a.role === 'center') || molecule.atoms[0]

  return (
    <div className={`w-full h-full relative select-none ${className}`} style={{ touchAction: 'none' }}>
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        camera={{
          position: [2.8, 2.2, 3.2],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        style={{ background: '#f8fafc' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={0.9} castShadow />
        <pointLight position={[-5, -5, -5]} intensity={0.3} />

        {/* 1. 分子球棍与空间填充模型 (4 种模式基座) */}
        <MoleculeMesh
          atoms={molecule.atoms}
          bonds={molecule.bonds}
          showSpaceFilling={showSpaceFilling}
        />

        {/* 2. 模式 A: VSEPR 理想模型 (vsepr_cloud) ➔ 孤电子对包络体 + VSEPR 理想多面体虚线外框 */}
        {displayMode === 'vsepr_cloud' && (
          <>
            {molecule.lonePairNodes.length > 0 && (
              <LonePairMesh
                lonePairs={molecule.lonePairNodes}
                centerPosition={centerAtom.position}
                showRepulsionHalo={false}
              />
            )}
            <VseprPolyhedronFrame
              atoms={molecule.atoms}
              lonePairs={molecule.lonePairNodes}
            />
          </>
        )}

        {/* 3. 模式 B: 杂化 Lobes 模式 (hybrid_orbital) ➔ 纯杂化轨道电子云 (区分成键青蓝与孤对琥珀金，零穿模) */}
        {displayMode === 'hybrid_orbital' && (
          <HybridOrbitalMesh
            hybridization={molecule.hybridization}
            centerAtom={centerAtom}
            atoms={molecule.atoms}
            bonds={molecule.bonds}
            lonePairs={molecule.lonePairNodes}
          />
        )}

        {/* 4. 模式 C: 静电排斥演示 (repulsion_demo) ➔ 孤电子对高亮 + 孤对向成键电子对的红性排斥作用矢线 */}
        {displayMode === 'repulsion_demo' && (
          <>
            {molecule.lonePairNodes.length > 0 && (
              <LonePairMesh
                lonePairs={molecule.lonePairNodes}
                centerPosition={centerAtom.position}
                showRepulsionHalo={true}
              />
            )}
            <RepulsionVectors
              atoms={molecule.atoms}
              lonePairs={molecule.lonePairNodes}
            />
          </>
        )}

        {/* 5. 3D 空间成键电子对键角标注 */}
        {showAngleAnnotation && (
          <BondAngleAnnotation angles={molecule.angles} atoms={molecule.atoms} />
        )}

        {/* 6. 交互控制器 (关闭 damping 满足 demand 模式铁律) */}
        <OrbitControls enableDamping={false} makeDefault />
      </Canvas>
    </div>
  )
}
