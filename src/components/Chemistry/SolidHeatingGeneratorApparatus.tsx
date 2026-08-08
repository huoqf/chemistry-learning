import { SCENE_COLORS, withAlpha, STROKE } from '@/theme'
import type { FontScaler } from '@/theme'
import { AlcoholLampApparatus } from './AlcoholLampApparatus'
import { IronSupportApparatus } from './IronSupportApparatus'
import { applyRotate } from '@/utils/svgTransform'

export interface SolidHeatingGeneratorPorts {
  /** 单孔橡皮塞出的出气导管端点 (Design Space) — 经 rotate(6°, pivot) 数学精确计算 */
  outletPort: { x: number; y: number; direction?: 'right' | 'up' }
  /** 铁夹夹持中心 (Design Space) */
  clampPort: { x: number; y: number }
}

/**
 * 静态计算固固加热发生装置组件的关键连接端点 (Design Space)
 *
 * 【端口计算原则】
 * 管口坐标使用 applyRotate() 数学精确计算 SVG rotate(6, 105, -114) 变换后位置，
 * 而非手工估算。这样端口坐标与渲染位置保证 100% 一致，连接导管不会产生额外拐弯。
 */
export function getSolidHeatingGeneratorPorts(
  x: number,
  y: number
): SolidHeatingGeneratorPorts {
  // 试管导管塞：水平向右穿过塞子 (144, -114) -> (165, -114)
  // 水平红褐色胶管套接扣在 x=156~166, y=-117.5~-110.5
  // 取套接扣右端中心 (166, -114)，旋转轴 (105, -114)，角度 6°
  // dx = 166 - 105 = 61, dy = 0 → new_x = 61*cos(6°)+105 = 165.66, new_y = 61*sin(6°)-114 = -107.63
  const tip = applyRotate({ x: 166, y: -114 }, 6, 105, -114)
  return {
    outletPort: { x: x + tip.x, y: y + tip.y, direction: 'right' },
    clampPort: { x: x + 105, y: y - 114 },
  }
}

export interface SolidHeatingGeneratorApparatusProps {
  /** 发生装置基准左侧坐标 x (设计坐标) */
  x: number
  /** 发生装置基准桌面底线 y (baseY) */
  y: number
  /** 目标气体名称 (用于药粉颜色与警告: O₂ / NH₃ / Cl₂ / C₂H₄) */
  targetGas?: string
  /** 是否开启酒精灯加热 */
  lit?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * SolidHeatingGeneratorApparatus — 固-固加热试管发生装置 (高保真复合器材)
 *
 * 适用高中化学经典场景：
 * - 实验室制 NH₃ (2NH₄Cl + Ca(OH)₂ 固固加热)
 * - 实验室制 O₂ (KMnO₄ 固固加热)
 *
 * 严密物理与化学规范封存：
 * - 铁架立杆在左侧后方，立杆与酒精灯 0 穿透
 * - 酒精灯底座 100% 稳稳盘于桌面（y = baseY），零悬空
 * - 试管中上部 (距管口 1/3 处) 精准夹持，管口稍向下倾斜 6° 防冷凝水倒流炸裂
 * - 试管底部下壁 100% 精准相切酒精灯外焰顶端
 * - 药粉受重力自然平铺于下壁内，导管塞心精准对接导出端口 (方向: right)
 */
export function SolidHeatingGeneratorApparatus({
  x,
  y,
  targetGas = 'NH₃',
  lit = true,
  font = (n) => n,
}: SolidHeatingGeneratorApparatusProps) {
  // 试管内平铺药粉颜色
  const powderColor =
    targetGas === 'O₂'
      ? '#701A75' // 紫黑色 KMnO₄ 固体
      : targetGas === 'NH₃'
      ? '#E2E8F0' // 灰白色 NH₄Cl + Ca(OH)₂ 固体
      : targetGas === 'Cl₂' || targetGas === 'C₂H₄'
      ? '#FACC15' // 错选液体黄
      : '#D97706' // 其他固体

  const isWrongGenerator = targetGas === 'Cl₂' || targetGas === 'C₂H₄'

  // 几何协同常量（基准桌面 y）
  const supportW = 100
  const supportH = 220
  // 铁架台右移至 x+62：底座范围 x+67 ~ x+157，立杆中心在 x+88（试管中上部下方）
  // 夹臂由 90px 大幅缩短为 17px 的短巧精致标准铁夹，横杆彻底离开火焰区
  const supportX = x + 62
  const supportY = y - supportH

  // 目标夹持锚点 (x + 105, y - 114) — 试管旋转轴心，夹臂向右延伸至此
  const targetClampPoint = { x: x + 105, y: y - 114 }

  return (
    <g id="solid-heating-generator">
      {/* ── 1. 铁架台组件 (底座在 x+67 ~ x+157，立杆在 x+88，夹持试管中上部) ── */}
      <IronSupportApparatus
        x={supportX}
        y={supportY}
        width={supportW}
        height={supportH}
        hasClamp={true}
        targetClampPoint={targetClampPoint}
        clampAngle={6} // 跟随试管倾斜 6°
      />

      {/* ── 2. 酒精灯 (独立立于 x+5 ~ x+65，与右侧铁架台底座 x+67 完美并立，灯焰中心 x+35 加热药粉) ── */}
      <g id="alcohol-lamp">
        <AlcoholLampApparatus
          x={x + 5}
          y={y - 85}
          width={60}
          height={85}
          lit={lit}
        />
      </g>

      {/* ── 3. 倾斜 6° 试管组合 (旋转轴心为铁夹夹持点 (x+105, y-114)) ── */}
      <g transform={`translate(${x}, ${y})`}>
        <g id="test-tube-assembly" transform="rotate(6, 105, -114)">
          {/* 3.1 试管玻璃主体 (管底在左 X=30，管口在右 X=140，管径 24) */}
          <path
            d="M 140,-126 L 42,-126 A 12 12 0 0 0 42,-102 L 140,-102 Z"
            fill={withAlpha(SCENE_COLORS.container.testTube, 0.4)}
            stroke={SCENE_COLORS.container.testTubeBorder}
            strokeWidth={STROKE.objectLine}
          />
          {/* 试管口翻边 Lip */}
          <rect
            x={139}
            y={-128}
            width={4}
            height={28}
            rx={1}
            fill={SCENE_COLORS.container.testTube}
            stroke={SCENE_COLORS.container.testTubeBorder}
            strokeWidth={STROKE.reference}
          />

          {/* 3.2 重力自然横向平铺药粉 (平铺于试管下壁 32~80 区域) */}
          <path
            d="M 32,-108 C 36,-103 42,-103 75,-103 L 75,-103 C 65,-106 45,-108 32,-108 Z"
            fill={powderColor}
            opacity={0.9}
          />

          {/* 3.3 单孔橡皮塞与水平出气玻璃导管 */}
          <g id="stopper-and-tube">
            <rect
              x={140}
              y={-125}
              width={12}
              height={22}
              rx={2}
              fill={SCENE_COLORS.stopper.rubberStopper}
              stroke={SCENE_COLORS.stopper.rubberStopperBorder}
              strokeWidth={1}
            />
            {/* 水平出气玻璃管：穿过塞子向右伸出 */}
            <line
              x1={144}
              y1={-114}
              x2={166}
              y2={-114}
              stroke={SCENE_COLORS.tube.glass}
              strokeWidth={4}
              strokeLinecap="round"
            />
          </g>
        </g>
      </g>

      {/* ── 4. 警告与提示标语 ── */}
      <g transform={`translate(${x}, ${y})`}>
        {isWrongGenerator ? (
          <g transform="translate(30, -180)">
            <rect
              x={-15}
              y={-14}
              width={140}
              height={22}
              rx={4}
              fill="#FEE2E2"
              stroke="#EF4444"
              strokeWidth={1.5}
            />
            <text
              x={55}
              y={2}
              textAnchor="middle"
              fill="#991B1B"
              fontSize={font(10)}
              fontWeight="extrabold"
            >
              ⚠️ 错选装置: 液体流出暴沸!
            </text>
          </g>
        ) : (
          <g transform="translate(35, -170)">
            <rect
              x={-10}
              y={-12}
              width={130}
              height={18}
              rx={3}
              fill="#FEF3C7"
              stroke="#D97706"
              strokeWidth={1}
            />
            <text
              x={55}
              y={1}
              textAnchor="middle"
              fill="#B45309"
              fontSize={font(10)}
              fontWeight="bold"
            >
              管口略向下倾斜 6° 防炸裂
            </text>
          </g>
        )}
      </g>
    </g>
  )
}

