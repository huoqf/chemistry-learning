import { CHEMISTRY_COLORS, SCENE_COLORS, CANVAS_COLORS, withAlpha } from '@/theme'
import {
  DcPowerSupplyApparatus,
  ElectronFlowPath,
  ElectrodePlateApparatus,
} from '@/components/Chemistry'
import type { ElectrolyticCellChemistryResult } from '../hooks/useElectrolyticCellChemistry'

interface ElectrolyticCellSceneProps {
  chemistry: ElectrolyticCellChemistryResult
  canvasSize: { font: (size: number) => number }
  cellType: number
  anodeMaterial: number
  membraneType?: number
  current: number
  time: number
}

/**
 * ElectrolyticCellScene — 电解池原理 2D 演示动画场景
 *
 * 坐标设计（在 280 x 650 画布内居中呈现）：
 * - 直流电源: y = 35 ~ 100
 * - 槽体容器: y = 195 ~ 575
 */
export function ElectrolyticCellScene({
  chemistry,
  canvasSize,
  cellType,
  anodeMaterial,
  membraneType = 0,
  time,
}: ElectrolyticCellSceneProps) {
  const { font } = canvasSize

  // 1. 根据模型确定电解质溶液外观与颜色
  let solutionColor = withAlpha('#0284c7', 0.45)
  let solutionLabel = 'CuCl₂ 溶液'

  if (cellType === 0) {
    solutionColor = withAlpha('#0ea5e9', 0.55)
    solutionLabel = 'CuCl₂ 溶液'
  } else if (cellType === 1) {
    solutionColor = withAlpha('#0284c7', 0.6)
    solutionLabel = 'CuSO₄ 溶液'
  } else if (cellType === 2) {
    solutionColor = withAlpha(SCENE_COLORS.reagent.solution, 0.4)
    solutionLabel = '饱和 NaCl 溶液'
  } else if (cellType === 3) {
    solutionColor = withAlpha('#0284c7', 0.6)
    solutionLabel = 'CuSO₄ 酸性溶液'
  } else if (cellType === 4) {
    solutionColor = withAlpha('#ea580c', 0.75) // 熔融氧化铝红热液体
    solutionLabel = '熔融 Al₂O₃ + 冰晶石'
  }

  // 2. 气泡生成与粒子参数
  const isAnodeGas = chemistry.vAnodeGas > 0
  const isCathodeGas = chemistry.vCathodeGas > 0

  // 3. 电极板显示特征
  const anodeMat = anodeMaterial === 1 && cellType === 1 ? 'Cu' : cellType === 3 ? 'ImpureCu' : 'Carbon'
  const cathodeMat = cellType === 3 ? 'Cu' : 'Carbon'
  const anodeLabel = anodeMaterial === 1 && cellType === 1 ? 'Cu(阳极)' : cellType === 3 ? '粗铜(阳极)' : 'C/Pt(阳极)'
  const cathodeLabel = cellType === 3 ? '精铜(阴极)' : cellType === 4 ? 'C(阴极)' : 'C/Cu(阴极)'

  // 阴极镀层/沉淀厚度动画 (0~10px)
  const depositThickness = Math.min(10, chemistry.cathodeDeltaM * 1.5)
  // 阳极溶解减薄 (0~6px)
  const anodeThinning = Math.min(6, Math.abs(chemistry.anodeDeltaM) * 0.5)

  // 4. 阴极区酚酞变色（氯碱工业生成的 OH- 呈红色）
  const showPhenolphthaleinRed = cellType === 2 && chemistry.pH > 8.0

  return (
    <g transform="translate(0, 0)" className="electrolytic-cell-scene">
      {/* 画布网格参考线 */}
      <line x1={0} y1={325} x2={280} y2={325} stroke={CANVAS_COLORS.grid} strokeDasharray="3 3" />

      {/* ── 1. 通用直流电源组件 (DC Power Supply) ── */}
      <DcPowerSupplyApparatus
        x={70}
        y={35}
        width={140}
        height={65}
        voltage={2.0}
        current={chemistry.ne > 0 ? 1.5 : 0}
        isWorking={chemistry.ne > 0}
        font={font}
      />

      {/* ── 2. 外电路导线与电子定向流动 ── */}
      {/* 阳极导线：阳极 -> 电源正极 (电子流动) */}
      <ElectronFlowPath
        pathD="M 75 215 L 75 80 L 95 80"
        current={chemistry.ne > 0 ? 1.5 : 0}
        electronCount={3}
      />
      {/* 阴极导线：电源负极 -> 阴极 (电子流动) */}
      <ElectronFlowPath
        pathD="M 185 80 L 205 80 L 205 215"
        current={chemistry.ne > 0 ? 1.5 : 0}
        electronCount={3}
      />

      {/* ── 3. 电解槽容器 ── */}
      <g transform="translate(25, 195)">
        {/* 外槽玻璃壁 */}
        <rect
          x={0}
          y={0}
          width={230}
          height={380}
          rx={10}
          fill={withAlpha(SCENE_COLORS.container.beaker, 0.25)}
          stroke={SCENE_COLORS.container.beakerBorder}
          strokeWidth={2}
        />

        {/* 溶液体 */}
        <rect
          x={4}
          y={40}
          width={222}
          height={334}
          rx={6}
          fill={solutionColor}
        />

        {/* 氯碱工业阴极区滴加酚酞变红动画 */}
        {showPhenolphthaleinRed && (
          <rect
            x={120}
            y={40}
            width={106}
            height={334}
            rx={4}
            fill={withAlpha('#ec4899', 0.45)}
          />
        )}

        {/* 溶液标注 */}
        <text
          x={115}
          y={360}
          textAnchor="middle"
          fontSize={font(11)}
          fill={SCENE_COLORS.labels.chemicalFormula}
          fontWeight="bold"
        >
          {solutionLabel}
        </text>

        {/* ── 4. 离子交换膜 (Ion Exchange Membrane) ── */}
        {cellType === 2 && membraneType === 0 && (
          <g>
            <line
              x1={115}
              y1={40}
              x2={115}
              y2={374}
              stroke="#8b5cf6"
              strokeWidth={3}
              strokeDasharray="6 4"
            />
            <rect x={75} y={190} width={80} height={20} rx={4} fill="#8b5cf6" opacity={0.9} />
            <text x={115} y={204} textAnchor="middle" fontSize={font(10)} fill="#ffffff" fontWeight="bold">
              阳离子交换膜
            </text>

            {/* Na+ 穿膜动画箭头 */}
            {time > 0 && (
              <g>
                <path d="M 95 240 L 135 240" stroke="#3b82f6" strokeWidth={2} strokeDasharray="3 3" />
                <circle cx={100 + ((time * 20) % 30)} cy={240} r={6} fill="#3b82f6" />
                <text x={100 + ((time * 20) % 30)} y={243} textAnchor="middle" fontSize={font(8)} fill="#ffffff">
                  Na⁺
                </text>
              </g>
            )}
          </g>
        )}

        {/* ── 5. 阳极板 (Anode, +) ── */}
        <g transform="translate(30, 20)">
          <ElectrodePlateApparatus
            x={19}
            y={0}
            width={18}
            height={260}
            material={anodeMat}
            label={anodeLabel}
            polarity="anode"
            thinningAmount={anodeThinning}
            attachmentType={cellType === 3 ? 'AnodeMud' : 'none'}
            font={font}
          />

          {/* 阳极产生气泡动画 (Cl₂ / O₂) */}
          {isAnodeGas && time > 0 && (
            <g>
              <circle cx={5} cy={200 - ((time * 40) % 120)} r={4} fill={cellType === 0 || cellType === 2 ? '#84cc16' : '#ffffff'} opacity={0.8} />
              <circle cx={25} cy={170 - ((time * 35) % 120)} r={5} fill={cellType === 0 || cellType === 2 ? '#84cc16' : '#ffffff'} opacity={0.8} />
              <circle cx={10} cy={120 - ((time * 45) % 120)} r={3.5} fill={cellType === 0 || cellType === 2 ? '#84cc16' : '#ffffff'} opacity={0.8} />
              <text x={19} y={80} textAnchor="middle" fontSize={font(10)} fill={CHEMISTRY_COLORS.anode} fontWeight="bold">
                {cellType === 0 || cellType === 2 ? 'Cl₂↑' : 'O₂↑'}
              </text>
            </g>
          )}
        </g>

        {/* ── 6. 阴极板 (Cathode, -) ── */}
        <g transform="translate(165, 20)">
          <ElectrodePlateApparatus
            x={19}
            y={0}
            width={18}
            height={260}
            material={cathodeMat}
            label={cathodeLabel}
            polarity="cathode"
            depositThickness={depositThickness}
            font={font}
          />

          {/* 阴极产生氢气泡动画 (H₂) */}
          {isCathodeGas && time > 0 && (
            <g>
              <circle cx={2} cy={190 - ((time * 40) % 120)} r={4} fill="#ffffff" opacity={0.9} stroke="#94a3b8" />
              <circle cx={28} cy={150 - ((time * 38) % 120)} r={5} fill="#ffffff" opacity={0.9} stroke="#94a3b8" />
              <circle cx={12} cy={110 - ((time * 42) % 120)} r={3.5} fill="#ffffff" opacity={0.9} stroke="#94a3b8" />
              <text x={19} y={80} textAnchor="middle" fontSize={font(10)} fill={CHEMISTRY_COLORS.cathode} fontWeight="bold">
                H₂↑
              </text>
            </g>
          )}
        </g>

        {/* ── 7. 内电路离子定向迁移 (阴朝阳，阳朝阴) ── */}
        {time > 0 && (
          <g>
            {/* 阴离子 (Cl⁻ / SO₄²⁻ / OH⁻) 向阳极 (左) 移动 */}
            <g transform={`translate(${140 - ((time * 25) % 60)}, 160)`}>
              <circle cx={0} cy={0} r={10} fill={withAlpha(CHEMISTRY_COLORS.anode, 0.2)} stroke={CHEMISTRY_COLORS.anode} strokeWidth={1.5} />
              <text x={0} y={3} textAnchor="middle" fontSize={font(9)} fill={CHEMISTRY_COLORS.anode} fontWeight="bold">
                {cellType === 0 || cellType === 2 ? 'Cl⁻' : 'OH⁻'}
              </text>
              <path d="M -12 0 L -18 0 L -14 -3 M -18 0 L -14 3" stroke={CHEMISTRY_COLORS.anode} strokeWidth={1.5} fill="none" />
            </g>

            {/* 阳离子 (Cu²⁺ / Na⁺ / H⁺) 向阴极 (右) 移动 */}
            <g transform={`translate(${90 + ((time * 25) % 60)}, 220)`}>
              <circle cx={0} cy={0} r={10} fill={withAlpha(CHEMISTRY_COLORS.cathode, 0.2)} stroke={CHEMISTRY_COLORS.cathode} strokeWidth={1.5} />
              <text x={0} y={3} textAnchor="middle" fontSize={font(9)} fill={CHEMISTRY_COLORS.cathode} fontWeight="bold">
                {cellType === 2 ? 'Na⁺' : 'Cu²⁺'}
              </text>
              <path d="M 12 0 L 18 0 L 14 -3 M 18 0 L 14 3" stroke={CHEMISTRY_COLORS.cathode} strokeWidth={1.5} fill="none" />
            </g>
          </g>
        )}
      </g>
    </g>
  )
}
