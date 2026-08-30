import { TestTubeApparatus } from '@/components/Chemistry/TestTubeApparatus'
import type { IonItem, CoexistenceConflict } from '../types'
import { SCENE_COLORS, FONT, withAlpha } from '@/theme'

interface IonMatrixSceneProps {
  mode: 'single-test' | 'coexistence-check'
  selectedIon?: IonItem
  isReactionActive: boolean
  coexistenceIons: IonItem[]
  conflicts: CoexistenceConflict[]
  font: (size: number) => number
}

export const IonMatrixScene: React.FC<IonMatrixSceneProps> = ({
  mode,
  selectedIon,
  isReactionActive,
  coexistenceIons,
  conflicts,
  font,
}) => {
  if (mode === 'single-test') {
    if (!selectedIon) return null

    return (
      <g className="ion-single-scene">
        {/* 左侧试管：待测原溶液 */}
        <g transform="translate(180, 100)">
          <TestTubeApparatus
            x={0}
            y={0}
            fillColor={selectedIon.colorRgb}
            fillLevel={0.45}
            font={font}
          />
          <text
            x={35}
            y={240}
            textAnchor="middle"
            fill="#1e293b"
            fontSize={font(FONT.label)}
            fontWeight="bold"
          >
            待测液: {selectedIon.id}
          </text>
          <text
            x={35}
            y={260}
            textAnchor="middle"
            fill="#64748b"
            fontSize={font(FONT.small)}
          >
            {selectedIon.colorInSolution}
          </text>
        </g>

        {/* 中间反应箭头与试剂说明 */}
        <g transform="translate(300, 210)">
          <path
            d="M 10 0 L 110 0"
            stroke="#2563eb"
            strokeWidth={3}
            strokeDasharray={isReactionActive ? '4 2' : 'none'}
            markerEnd="url(#arrow-head)"
          />
          <text
            x={60}
            y={-15}
            textAnchor="middle"
            fill="#2563eb"
            fontSize={font(FONT.small)}
            fontWeight="bold"
          >
            + {selectedIon.testReagent.split(' ')[0]}
          </text>
          <text
            x={60}
            y={25}
            textAnchor="middle"
            fill="#64748b"
            fontSize={font(FONT.annotation)}
          >
            滴加特效试剂
          </text>
        </g>

        {/* 右侧试管：反应后特征现象 */}
        <g transform="translate(450, 100)">
          <TestTubeApparatus
            x={0}
            y={0}
            fillColor={
              isReactionActive
                ? selectedIon.id === 'Fe3+'
                  ? 'rgba(185, 28, 28, 0.85)' // 血红色
                  : selectedIon.id === 'Cu2+'
                  ? 'rgba(30, 58, 138, 0.9)' // 配合物深蓝
                  : selectedIon.id === 'I-'
                  ? 'rgba(30, 27, 75, 0.9)' // 碘淀粉深蓝
                  : selectedIon.colorRgb
                : selectedIon.colorRgb
            }
            fillLevel={isReactionActive ? 0.6 : 0.45}
            precipitateLevel={
              isReactionActive &&
              (selectedIon.id === 'Al3+' ||
                selectedIon.id === 'Ba2+' ||
                selectedIon.id === 'Ag+' ||
                selectedIon.id === 'Mg2+' ||
                selectedIon.id === 'SO42-' ||
                selectedIon.id === 'Cl-' ||
                selectedIon.id === 'Br-' ||
                selectedIon.id === 'S2-' ||
                selectedIon.id === 'CO32-')
                ? 0.25
                : 0
            }
            precipitateColor={
              selectedIon.id === 'S2-'
                ? '#1e293b' // 黑色 CuS
                : selectedIon.id === 'Br-'
                ? '#fef08a' // 淡黄 AgBr
                : selectedIon.id === 'Cu2+'
                ? '#38bdf8' // 蓝色 Cu(OH)2
                : '#ffffff'
            }
            font={font}
          />
          <text
            x={35}
            y={240}
            textAnchor="middle"
            fill="#2563eb"
            fontSize={font(FONT.label)}
            fontWeight="bold"
          >
            {isReactionActive ? '特征检验现象' : '点击左侧“滴加试剂”'}
          </text>
        </g>

        {/* 底部化学方程式标注 */}
        {isReactionActive && (
          <g transform="translate(420, 390)">
            <rect
              x={-280}
              y={0}
              width={560}
              height={60}
              rx={8}
              fill={withAlpha(SCENE_COLORS.materials.glass, 0.8)}
              stroke={SCENE_COLORS.materials.glassBorder}
              strokeWidth={1}
            />
            <text
              x={0}
              y={25}
              textAnchor="middle"
              fill="#1e293b"
              fontSize={font(FONT.small)}
              fontWeight="bold"
            >
              特征反应方程式：
            </text>
            <text
              x={0}
              y={45}
              textAnchor="middle"
              fill="#2563eb"
              fontSize={font(FONT.label)}
              fontFamily="monospace"
            >
              {selectedIon.testEquation.split(';')[0]}
            </text>
          </g>
        )}
      </g>
    )
  }

  // 模式：共存排斥多微粒透视
  return (
    <g className="ion-coexistence-scene">
      {/* 烧杯大容器：混合离子体系 */}
      <g transform="translate(260, 80)">
        {/* 烧杯外形 */}
        <rect
          x={0}
          y={0}
          width={320}
          height={300}
          rx={16}
          fill={withAlpha(SCENE_COLORS.materials.glass, 0.4)}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={2}
        />
        {/* 溶液液面 */}
        <rect
          x={4}
          y={100}
          width={312}
          height={192}
          rx={12}
          fill={
            conflicts.length > 0
              ? 'rgba(254, 242, 242, 0.7)' // 发生反应/浑浊/浅红
              : 'rgba(240, 249, 255, 0.7)' // 澄清透明稳定共存
          }
        />

        {/* 体系内漂浮离子粒子标签 */}
        {coexistenceIons.map((ion, idx) => {
          const posX = 50 + (idx % 3) * 90
          const posY = 150 + Math.floor(idx / 3) * 50
          return (
            <g key={ion.id} transform={`translate(${posX}, ${posY})`}>
              <circle
                r={24}
                fill={ion.type === 'cation' ? '#dbeafe' : '#fef3c7'}
                stroke={ion.type === 'cation' ? '#3b82f6' : '#f59e0b'}
                strokeWidth={1.5}
              />
              <text
                x={0}
                y={6}
                textAnchor="middle"
                fontSize={font(FONT.label)}
                fontWeight="bold"
                fill="#1e293b"
              >
                {ion.id}
              </text>
            </g>
          )
        })}

        {/* 沉淀或气体冲突特效 */}
        {conflicts.some((c) => c.type === 'precipitate' || c.type === 'double-hydrolysis') && (
          <g transform="translate(10, 270)">
            <ellipse cx={150} cy={15} rx={120} ry={8} fill="#94a3b8" opacity={0.6} />
            <text
              x={150}
              y={18}
              textAnchor="middle"
              fontSize={font(FONT.annotation)}
              fill="#ffffff"
              fontWeight="bold"
            >
              沉淀析出 ↓
            </text>
          </g>
        )}
      </g>

      {/* 底部冲突诊断徽章 */}
      <g transform="translate(420, 420)">
        <rect
          x={-300}
          y={0}
          width={600}
          height={110}
          rx={10}
          fill={conflicts.length === 0 ? '#f0fdf4' : '#fef2f2'}
          stroke={conflicts.length === 0 ? '#86efac' : '#fca5a5'}
          strokeWidth={1.5}
        />
        <text
          x={0}
          y={30}
          textAnchor="middle"
          fontSize={font(FONT.formula)}
          fontWeight="bold"
          fill={conflicts.length === 0 ? '#166534' : '#991b1b'}
        >
          {conflicts.length === 0
            ? '✓ 体系内各离子无反应，可大量稳定共存'
            : `⚠ 检测到 ${conflicts.length} 处反应互斥，无法大量共存！`}
        </text>

        {conflicts.length > 0 && (
          <text
            x={0}
            y={60}
            textAnchor="middle"
            fontSize={font(FONT.small)}
            fill="#b91c1c"
          >
            【{conflicts[0].typeLabel}】: {conflicts[0].equation}
          </text>
        )}
        {conflicts.length > 0 && (
          <text
            x={0}
            y={85}
            textAnchor="middle"
            fontSize={font(FONT.annotation)}
            fill="#7f1d1d"
          >
            原因：{conflicts[0].reason}
          </text>
        )}
      </g>
    </g>
  )
}
