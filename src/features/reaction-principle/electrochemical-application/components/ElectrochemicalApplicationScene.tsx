import {
  CHEMISTRY_COLORS,
  SCENE_COLORS,
  CANVAS_COLORS,
  withAlpha,
  STROKE,
  FONT,
} from '@/theme'
import type { FontScaler } from '@/theme'
import {
  ElectrochemCellApparatus,
  SaltBridgeApparatus,
  IonMembraneApparatus,
  BubbleEmitter,
  IonMigration,
  ExternalLoadApparatus,
  ElectronFlowPath,
  ElectrodePlateApparatus,
} from '@/components/Chemistry'
import type { ElectrochemicalApplicationChemistryResult } from '../hooks/useElectrochemicalApplicationChemistry'

interface ElectrochemicalApplicationSceneProps {
  chemistry: ElectrochemicalApplicationChemistryResult
  canvasSize: { font: FontScaler }
  mode: number
  membraneType: number
  current: number
}

/**
 * ElectrochemicalApplicationScene — 电化学综合应用 2D 演示场景
 *
 * 高考综合题型覆盖：
 * - Mode 0: 双池盐桥原电池 (Zn-Cu)
 * - Mode 1: 膜法电解池 (阳离子/阴离子/质子交换膜法烧碱/酸)
 * - Mode 2: 原电池驱动电解池串联装置
 */
export function ElectrochemicalApplicationScene({
  chemistry,
  canvasSize,
  mode,
  membraneType,
  current,
}: ElectrochemicalApplicationSceneProps) {
  const { font } = canvasSize
  const { ne } = chemistry

  return (
    <g className="electrochemical-scene">
      {/* 背景参考网格线 */}
      <line x1={0} y1={325} x2={420} y2={325} stroke={CANVAS_COLORS.grid} strokeWidth={1} strokeDasharray="4 4" />

      {/* ── 模式 0: 双池盐桥原电池 (Zn-Cu 盐桥原电池) ── */}
      {mode === 0 && (
        <g>
          {/* 左烧杯: ZnSO4 溶液 + Zn 电极 */}
          <g transform="translate(40, 160)">
            <rect
              x={0}
              y={0}
              width={140}
              height={180}
              rx={6}
              fill={withAlpha(SCENE_COLORS.container.beaker, 0.3)}
              stroke={SCENE_COLORS.container.beakerBorder}
              strokeWidth={STROKE.objectLine}
            />
            {/* 溶液 */}
            <rect
              x={3}
              y={40}
              width={134}
              height={136}
              fill={withAlpha(SCENE_COLORS.reagent.solution, 0.4)}
              rx={3}
            />
            {/* Zn 负极棒 */}
            <ElectrodePlateApparatus x={50} y={-20} width={20} height={150} material="Zn" label="Zn 负极 (-)" polarity="negative" font={font} />
            {/* 标注 */}
            <text x={70} y={160} fontSize={font(FONT.small)} fill={CHEMISTRY_COLORS.concentration} textAnchor="middle">
              ZnSO₄ 溶液
            </text>
          </g>

          {/* 右烧杯: CuSO4 溶液 + Cu 电极 */}
          <g transform="translate(240, 160)">
            <rect
              x={0}
              y={0}
              width={140}
              height={180}
              rx={6}
              fill={withAlpha(SCENE_COLORS.container.beaker, 0.3)}
              stroke={SCENE_COLORS.container.beakerBorder}
              strokeWidth={STROKE.objectLine}
            />
            {/* 溶液 */}
            <rect
              x={3}
              y={40}
              width={134}
              height={136}
              fill={withAlpha(SCENE_COLORS.reagent.solution, 0.7)}
              rx={3}
            />
            {/* Cu 正极棒 */}
            <ElectrodePlateApparatus x={90} y={-20} width={20} height={150} material="Cu" label="Cu 正极 (+)" polarity="positive" font={font} />
            {/* 标注 */}
            <text x={70} y={160} fontSize={font(FONT.small)} fill={CHEMISTRY_COLORS.concentration} textAnchor="middle">
              CuSO₄ 溶液
            </text>
          </g>

          {/* U 型盐桥 (KNO3) */}
          <g transform="translate(150, 140)">
            <SaltBridgeApparatus
              x={0}
              y={0}
              width={120}
              height={100}
              label="KNO₃ 盐桥"
              font={font}
            />
          </g>

          {/* 外电路导线 + 电流表 */}
          <ElectronFlowPath pathD="M 90 140 L 90 60 L 330 60 L 330 140" current={current} electronCount={6} />
          <ExternalLoadApparatus cx={210} cy={60} loadType="ammeter" current={current} font={font} />

          {/* 电子定向流动示意 */}
          <text x={138} y={36} fontSize={font(10)} fill={CHEMISTRY_COLORS.electron} textAnchor="middle" fontWeight="bold">
            e⁻ 定向流动 ➔
          </text>

          {/* 盐桥离子定向迁移示意 */}
          <IonMigration
            x={170}
            y={200}
            direction={[-1, 0]}
            ionSymbol="NO₃⁻"
            ionType="anion"
            font={font}
          />
          <IonMigration
            x={250}
            y={200}
            direction={[1, 0]}
            ionSymbol="K⁺"
            ionType="cation"
            font={font}
          />
        </g>
      )}

      {/* ── 模式 1: 离子交换膜电解池 (如电解食盐水/膜法烧碱) ── */}
      {mode === 1 && (
        <g>
          {/* 电解槽主体 */}
          <g transform="translate(60, 160)">
            <ElectrochemCellApparatus
              x={0}
              y={0}
              width={300}
              height={220}
              cellType="electrolytic"
              leftElectrode="阳极 (Ti/C)"
              rightElectrode="阴极 (Fe/Pt)"
              fillLevel={0.75}
              fillColor={withAlpha(SCENE_COLORS.reagent.solution, 0.4)}
              font={font}
            />

            {/* 中央离子交换膜 */}
            <g transform="translate(145, 60)">
              <IonMembraneApparatus
                x={0}
                y={0}
                height={150}
                membraneType={
                  membraneType === 0
                    ? 'cation'
                    : membraneType === 1
                    ? 'anion'
                    : 'proton'
                }
                ionLabel={chemistry.membraneIonSymbol || (membraneType === 0 ? 'Na⁺' : membraneType === 1 ? 'Cl⁻' : 'H⁺')}
                font={font}
              />
            </g>

            {/* 阳极室气泡 (Cl2 / O2) */}
            <g transform="translate(70, 120)">
              <BubbleEmitter x={0} y={0} width={30} height={80} count={6} />
              <text x={-20} y={40} fontSize={font(FONT.small)} fill={CHEMISTRY_COLORS.volume} fontWeight="bold">
                {chemistry.anodeGasName || 'Cl₂ 气体↑'}
              </text>
            </g>

            {/* 阴极室气泡 (H2) */}
            <g transform="translate(220, 120)">
              <BubbleEmitter x={0} y={0} width={30} height={80} count={8} />
              <text x={40} y={40} fontSize={font(FONT.small)} fill={CHEMISTRY_COLORS.volume} fontWeight="bold">
                {chemistry.cathodeGasName || 'H₂ 气体↑'}
              </text>
            </g>

            {/* 膜穿透离子定向迁移 (阴离子膜向左，阳离子/质子膜向右) */}
            <IonMigration
              x={150}
              y={120}
              direction={membraneType === 1 ? [-1, 0] : [1, 0]}
              ionSymbol={chemistry.membraneIonSymbol || (membraneType === 0 ? 'Na⁺' : membraneType === 1 ? 'Cl⁻' : 'H⁺')}
              ionType={membraneType === 1 ? 'anion' : 'cation'}
              font={font}
            />
          </g>

          {/* 外电路闭合电子导线 (阳极顶端 ➔ 顶部外电源 ➔ 阴极顶端) */}
          <ElectronFlowPath pathD="M 130 215 L 130 115 L 290 115 L 290 215" current={current} electronCount={6} />
          <text x={210} y={105} fontSize={font(10)} fill={CHEMISTRY_COLORS.electron} textAnchor="middle" fontWeight="bold">
            e⁻ 定向流动 (阳极 ➔ 阴极)
          </text>
        </g>
      )}

      {/* ── 模式 2: 串联电化学池 (原电池 驱动 电解池) ── */}
      {mode === 2 && (
        <g>
          {/* 左侧：原电池槽 (Zn-Cu 电池) */}
          <g transform="translate(30, 180)">
            <rect
              x={0}
              y={0}
              width={160}
              height={170}
              rx={6}
              fill={withAlpha(SCENE_COLORS.container.beaker, 0.3)}
              stroke={SCENE_COLORS.container.beakerBorder}
              strokeWidth={STROKE.objectLine}
            />
            <rect x={3} y={35} width={154} height={130} fill={withAlpha(SCENE_COLORS.reagent.solution, 0.5)} rx={3} />
            {/* 负极 Zn */}
            <ElectrodePlateApparatus x={38} y={-10} width={16} height={120} material="Zn" label="负极 (-)" polarity="negative" font={font} />
            {/* 正极 Cu */}
            <ElectrodePlateApparatus x={118} y={-10} width={16} height={120} material="Cu" label="正极 (+)" polarity="positive" font={font} />
            <text x={80} y={150} fontSize={font(10)} fill={SCENE_COLORS.labels.chemicalFormula} textAnchor="middle" fontWeight="bold">
              池1：原电池 (Zn-Cu)
            </text>
          </g>

          {/* 串联中间导线：电解池阳极(268) ➔ 原电池正极(148) 释放电子 */}
          <ElectronFlowPath pathD="M 268 170 L 148 170" current={current} electronCount={4} />
          <text x={208} y={160} fontSize={font(9)} fill={CHEMISTRY_COLORS.electron} textAnchor="middle" fontWeight="bold">
            e⁻ (池2阳极 ➔ 池1正极)
          </text>

          {/* 右侧：电解池槽 (镀铜/电解精炼) */}
          <g transform="translate(230, 180)">
            <rect
              x={0}
              y={0}
              width={160}
              height={170}
              rx={6}
              fill={withAlpha(SCENE_COLORS.container.beaker, 0.3)}
              stroke={SCENE_COLORS.container.beakerBorder}
              strokeWidth={STROKE.objectLine}
            />
            <rect x={3} y={35} width={154} height={130} fill={withAlpha(SCENE_COLORS.reagent.solution, 0.6)} rx={3} />
            {/* 阳极 Cu */}
            <ElectrodePlateApparatus x={38} y={-10} width={16} height={120} material="Cu" label="阳极 (接正)" polarity="anode" font={font} />
            {/* 阴极 待镀件/Zn/Fe */}
            <ElectrodePlateApparatus x={118} y={-10} width={16} height={120} material="Zn" label="阴极 (接负)" polarity="cathode" font={font} />
            <text x={80} y={150} fontSize={font(10)} fill={SCENE_COLORS.labels.chemicalFormula} textAnchor="middle" fontWeight="bold">
              池2：电解池 (精炼/镀铜)
            </text>

            <g transform="translate(110, 80)">
              <BubbleEmitter x={0} y={0} width={20} height={50} count={3} />
            </g>
          </g>

          {/* 闭合外回路导线：原电池负极(68) ➔ 顶部 ➔ 电解池阴极(348) 流入电子 */}
          <ElectronFlowPath pathD="M 68 170 L 68 100 L 348 100 L 348 170" current={current} electronCount={6} />
          <text x={208} y={90} fontSize={font(9)} fill={CHEMISTRY_COLORS.electron} textAnchor="middle" fontWeight="bold">
            e⁻ (池1负极 ➔ 池2阴极)
          </text>
        </g>
      )}

      {/* ── 底部通用关键化学量数值标注 (只允许数值/符号，禁止大段段落) ── */}
      <g transform="translate(210, 480)">
        <rect
          x={-160}
          y={-18}
          width={320}
          height={36}
          rx={6}
          fill={withAlpha(SCENE_COLORS.materials.glass, 0.75)}
          stroke={SCENE_COLORS.container.beakerBorder}
          strokeWidth={1}
        />
        <text
          x={0}
          y={4}
          textAnchor="middle"
          fontSize={font(FONT.label)}
          fill={CHEMISTRY_COLORS.electron}
          fontWeight="bold"
        >
          {`I = ${current.toFixed(1)} A  |  n(e⁻) = ${ne.toFixed(4)} mol`}
        </text>
      </g>
    </g>
  )
}
