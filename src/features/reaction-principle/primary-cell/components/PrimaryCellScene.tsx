import {
  CHEMISTRY_COLORS,
  SCENE_COLORS,
  CANVAS_COLORS,
  withAlpha,
} from '@/theme'
import type { FontScaler } from '@/theme'
import {
  ElectrochemCellApparatus,
  SaltBridgeApparatus,
  IonMembraneApparatus,
  BubbleEmitter,
  ExternalLoadApparatus,
  ElectronFlowPath,
  ElectrodePlateApparatus,
  ElectrodeReactionBadge,
} from '@/components/Chemistry'
import type { PrimaryCellChemistryResult } from '../hooks/usePrimaryCellChemistry'
import type { LoadType } from '@/components/Chemistry'

interface PrimaryCellSceneProps {
  chemistry: PrimaryCellChemistryResult
  canvasSize: { font: FontScaler }
  cellType: number // 0: 单槽, 1: 盐桥双槽, 2: 氢氧燃料, 3: 铅蓄电池
  electrolyteType: number // 0: 碱性, 1: 酸性
  loadType: LoadType // 0: 灯泡, 1: 电流计, 2: 电动机
  current: number
  time: number
}

/**
 * PrimaryCellScene — 原电池原理 2D 演示动画场景
 *
 * 坐标设计（在 280 x 650 画布内精准垂直居中）：
 * - 顶部电动势: y = 90
 * - 外电路与负载: cy = 145
 * - 主器皿/槽体: y = 200 ~ 400
 * - 底部反应面板: y = 440
 */
export function PrimaryCellScene({
  chemistry,
  canvasSize,
  cellType,
  electrolyteType,
  loadType,
  current,
  time,
}: PrimaryCellSceneProps) {
  const { font } = canvasSize
  const { anodeDeltaM, cathodeDeltaM, voltage } = chemistry

  return (
    <g className="primary-cell-scene">
      {/* 网格参考背景线 */}
      <line x1={0} y1={325} x2={280} y2={325} stroke={CANVAS_COLORS.grid} strokeDasharray="3 3" />

      {/* 1. 顶部标题与电动势/电压标示 */}
      <g transform="translate(140, 85)">
        <rect
          x={-75}
          y={-14}
          width={150}
          height={26}
          rx={13}
          fill={withAlpha(CHEMISTRY_COLORS.reactionRate, 0.12)}
          stroke={withAlpha(CHEMISTRY_COLORS.reactionRate, 0.4)}
          strokeWidth={1}
        />
        <text
          fontSize={font(12)}
          fill={CHEMISTRY_COLORS.reactionRate}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {`电动势 U = ${voltage.toFixed(2)} V`}
        </text>
      </g>

      {/* ────────────────── Mode 0: 经典单槽原电池 ────────────────── */}
      {cellType === 0 && (
        <g>
          {/* 单烧杯与电极容器 (关闭自带电路 showCircuit=false，防止并联重叠) */}
          <ElectrochemCellApparatus
            x={45}
            y={200}
            width={190}
            height={200}
            cellType="galvanic"
            leftElectrode="Zn (-)"
            rightElectrode="Cu (+)"
            fillColor={withAlpha(SCENE_COLORS.reagent.solution, 0.45)}
            showCircuit={false}
            font={font}
          />

          {/* 外电路唯一导线与电子流向 */}
          <ElectronFlowPath
            pathD="M 92.5 250 L 92.5 145 L 187.5 145 L 187.5 250"
            current={current}
            electronCount={6}
          />
          <text fontSize={font(10)} fill={CHEMISTRY_COLORS.electron} x={110} y={135} fontWeight="bold">
            e⁻ ➔
          </text>

          {/* 外电路唯一负载 (灯泡 / 电流表 / 电动机) */}
          <ExternalLoadApparatus cx={140} cy={145} loadType={loadType} current={current} time={time} font={font} />

          {/* 右电极 (Cu) 表面的 H₂ 气泡特效 */}
          <BubbleEmitter x={180} y={310} width={15} height={40} bubbleColor="#94A3B8" count={8} />

          {/* 内电路离子迁移指示 */}
          <g transform="translate(140, 320)">
            {/* H+ 移向正极 (右) */}
            <path
              d="M -20 -15 Q 0 -25 20 -15"
              fill="none"
              stroke={CHEMISTRY_COLORS.cation}
              strokeWidth={1.5}
              strokeDasharray="3 2"
            />
            <polygon points="20,-15 14,-19 14,-11" fill={CHEMISTRY_COLORS.cation} />
            <text fontSize={font(10)} fill={CHEMISTRY_COLORS.cation} x={0} y={-30} textAnchor="middle" fontWeight="bold">
              H⁺ ➔ (正极)
            </text>

            {/* SO42- 移向负极 (左) */}
            <path
              d="M 20 15 Q 0 25 -20 15"
              fill="none"
              stroke={CHEMISTRY_COLORS.anion}
              strokeWidth={1.5}
              strokeDasharray="3 2"
            />
            <polygon points="-20,15 -14,11 -14,19" fill={CHEMISTRY_COLORS.anion} />
            <text fontSize={font(10)} fill={CHEMISTRY_COLORS.anion} x={0} y={32} textAnchor="middle" fontWeight="bold">
              ⇦ SO₄²⁻ (负极)
            </text>
          </g>

          {/* 底部电极反应与变化面板 (垂直居中于 y=440) */}
          <ElectrodeReactionBadge
            x={140}
            y={440}
            anodeTitle="负极 (Zn 氧化)"
            anodeEquation="Zn - 2e⁻ = Zn²⁺"
            anodeDelta={`Δm = ${anodeDeltaM.toFixed(2)} g`}
            cathodeTitle="正极 (Cu 还原)"
            cathodeEquation="2H⁺ + 2e⁻ = H₂↑"
            cathodeDelta="气泡逸出 (质量无变)"
            font={font}
          />
        </g>
      )}

      {/* ────────────────── Mode 1: 盐桥双槽原电池 ────────────────── */}
      {cellType === 1 && (
        <g>
          {/* 左烧杯: Zn - ZnSO4 */}
          <g transform="translate(20, 220)">
            <rect
              x={0}
              y={40}
              width={100}
              height={120}
              fill={withAlpha('#93C5FD', 0.25)}
              stroke={SCENE_COLORS.container.beaker}
              strokeWidth={2}
              rx={4}
            />
            <ElectrodePlateApparatus
              x={43}
              y={10}
              width={16}
              height={110}
              material="Zn"
              label="Zn (-)"
              polarity="negative"
              font={font}
            />
            <text fontSize={font(9)} fill="#64748B" x={50} y={145} textAnchor="middle">
              ZnSO₄ 溶液
            </text>
          </g>

          {/* 右烧杯: Cu - CuSO4 */}
          <g transform="translate(160, 220)">
            <rect
              x={0}
              y={40}
              width={100}
              height={120}
              fill={withAlpha('#3B82F6', 0.35)}
              stroke={SCENE_COLORS.container.beaker}
              strokeWidth={2}
              rx={4}
            />
            <ElectrodePlateApparatus
              x={57}
              y={10}
              width={16}
              height={110}
              material="Cu"
              label="Cu (+)"
              polarity="positive"
              depositThickness={Math.min(8, cathodeDeltaM * 1.5)}
              font={font}
            />
            <text fontSize={font(9)} fill="#64748B" x={50} y={145} textAnchor="middle">
              CuSO₄ 溶液
            </text>
          </g>

          {/* 盐桥 */}
          <SaltBridgeApparatus x={90} y={215} width={100} height={75} label="KCl 盐桥" font={font} />

          {/* 盐桥内部离子定向移动指示 */}
          <g transform="translate(140, 230)">
            <text fontSize={font(9)} fill={CHEMISTRY_COLORS.anion} x={-25} y={10} textAnchor="middle" fontWeight="bold">
              ⇦ Cl⁻
            </text>
            <text fontSize={font(9)} fill={CHEMISTRY_COLORS.cation} x={25} y={10} textAnchor="middle" fontWeight="bold">
              K⁺ ➔
            </text>
          </g>

          {/* 外电路导线与电子流动 */}
          <ElectronFlowPath
            pathD="M 63 230 L 63 145 L 217 145 L 217 230"
            current={current}
            electronCount={6}
          />
          <ExternalLoadApparatus cx={140} cy={145} loadType={loadType} current={current} time={time} font={font} />

          {/* 底部反应说明 */}
          <ElectrodeReactionBadge
            x={140}
            y={440}
            anodeTitle="负极 (Zn 氧化)"
            anodeEquation="Zn - 2e⁻ = Zn²⁺"
            anodeDelta={`Δm = ${anodeDeltaM.toFixed(2)} g`}
            cathodeTitle="正极 (Cu 还原)"
            cathodeEquation="Cu²⁺ + 2e⁻ = Cu"
            cathodeDelta={`Δm = +${cathodeDeltaM.toFixed(2)} g`}
            font={font}
          />
        </g>
      )}

      {/* ────────────────── Mode 2: 氢氧燃料电池 ────────────────── */}
      {cellType === 2 && (
        <g>
          {/* 双腔体燃池外壳 */}
          <rect
            x={35}
            y={220}
            width={210}
            height={150}
            fill="#F1F5F9"
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={2}
            rx={6}
          />

          {/* 中间质子/离子交换膜 */}
          <IonMembraneApparatus
            x={135}
            y={220}
            height={150}
            membraneType={electrolyteType === 0 ? 'anion' : 'proton'}
            font={font}
          />

          {/* 左极 Pt/C 多孔电极 */}
          <ElectrodePlateApparatus x={87} y={230} width={14} height={130} material="Pt" label="负极(H₂)" polarity="negative" font={font} />
          {/* 右极 Pt/C 多孔电极 */}
          <ElectrodePlateApparatus x={193} y={230} width={14} height={130} material="Pt" label="正极(O₂)" polarity="positive" font={font} />

          {/* 进气标注 */}
          <text fontSize={font(10)} fill="#2563EB" x={55} y={290} textAnchor="middle" fontWeight="bold">
            H₂ 进气 ➔
          </text>
          <text fontSize={font(10)} fill="#DC2626" x={225} y={290} textAnchor="middle" fontWeight="bold">
            ⇦ O₂ 进气
          </text>

          {/* 膜穿透离子 */}
          <g transform="translate(140, 295)">
            {electrolyteType === 0 ? (
              <text fontSize={font(10)} fill={CHEMISTRY_COLORS.anion} textAnchor="middle" fontWeight="bold">
                ⇦ OH⁻ 迁移
              </text>
            ) : (
              <text fontSize={font(10)} fill={CHEMISTRY_COLORS.cation} textAnchor="middle" fontWeight="bold">
                H⁺ 迁移 ➔
              </text>
            )}
          </g>

          {/* 外电路导线与电子流向 */}
          <ElectronFlowPath pathD="M 87 230 L 87 145 L 193 145 L 193 230" current={current} electronCount={6} />
          <ExternalLoadApparatus cx={140} cy={145} loadType={loadType} current={current} time={time} font={font} />

          {/* 底部反应说明 */}
          <ElectrodeReactionBadge
            x={140}
            y={440}
            anodeTitle="负极 (通 H₂)"
            anodeEquation={electrolyteType === 0 ? '2H₂ + 4OH⁻ - 4e⁻ = 4H₂O' : '2H₂ - 4e⁻ = 4H⁺'}
            anodeDelta="燃料消耗 (氧化)"
            cathodeTitle="正极 (通 O₂)"
            cathodeEquation={electrolyteType === 0 ? 'O₂ + 2H₂O + 4e⁻ = 4OH⁻' : 'O₂ + 4H⁺ + 4e⁻ = 2H₂O'}
            cathodeDelta="氧化剂 (还原)"
            font={font}
          />
        </g>
      )}

      {/* ────────────────── Mode 3: 铅蓄电池放电过程 ────────────────── */}
      {cellType === 3 && (
        <g>
          {/* 铅蓄电池专用电解槽 */}
          <ElectrochemCellApparatus
            x={45}
            y={200}
            width={190}
            height={200}
            cellType="galvanic"
            leftElectrode="Pb (-)"
            rightElectrode="PbO₂ (+)"
            fillColor={withAlpha('#0284C7', 0.35)}
            showCircuit={false}
            font={font}
          />

          {/* 左极 Pb 及白色 PbSO4 沉淀 */}
          <ElectrodePlateApparatus x={94} y={250} width={12} height={100} material="Pb" attachmentType="PbSO4" font={font} />
          {/* 右极 PbO2 及白色 PbSO4 沉淀 */}
          <ElectrodePlateApparatus x={186} y={250} width={12} height={100} material="PbO2" attachmentType="PbSO4" font={font} />

          {/* 外电路导线与电子流向 */}
          <ElectronFlowPath pathD="M 94 250 L 94 145 L 186 145 L 186 250" current={current} electronCount={6} />
          <ExternalLoadApparatus cx={140} cy={145} loadType={loadType} current={current} time={time} font={font} />

          {/* 溶液中 H2SO4 消耗指示 */}
          <g transform="translate(140, 335)">
            <text fontSize={font(10)} fill="#0369A1" textAnchor="middle" fontWeight="bold">
              H₂SO₄ 消耗，溶液 pH 升高
            </text>
            <text fontSize={font(9)} fill="#64748B" y={15} textAnchor="middle">
              两极均生成白色 PbSO₄ 沉淀
            </text>
          </g>

          {/* 底部反应说明 */}
          <ElectrodeReactionBadge
            x={140}
            y={440}
            anodeTitle="负极 (Pb 氧化)"
            anodeEquation="Pb + SO₄²⁻ - 2e⁻ = PbSO₄"
            anodeDelta={`Δm = +${anodeDeltaM.toFixed(2)} g`}
            cathodeTitle="正极 (PbO₂ 还原)"
            cathodeEquation="PbO₂ + 4H⁺ + SO₄²⁻ + 2e⁻ = PbSO₄"
            cathodeDelta={`Δm = +${cathodeDeltaM.toFixed(2)} g`}
            font={font}
          />
        </g>
      )}
    </g>
  )
}
