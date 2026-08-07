import { SCENE_COLORS, withAlpha, STROKE } from '@/theme'
import type { FontScaler } from '@/theme'
import { AlcoholLampApparatus } from './AlcoholLampApparatus'

export interface SolidHeatingGeneratorPorts {
  /** 单孔橡皮塞出的出气导管端点 (Design Space) */
  outletPort: { x: number; y: number }
  /** 铁夹夹持中心 (Design Space) */
  clampPort: { x: number; y: number }
}

/**
 * 静态计算固固加热发生装置组件的关键连接端点 (Design Space)
 */
export function getSolidHeatingGeneratorPorts(
  x: number,
  y: number
): SolidHeatingGeneratorPorts {
  return {
    outletPort: { x: x + 155, y: y - 162 },
    clampPort: { x: x + 105, y: y - 150 },
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
 * - 试管中上部 (距管口 1/3 处) 精准夹持，管口稍向下倾斜 6° 防冷凝水倒流炸裂
 * - 试管底平铺固体药品贴合酒精灯外焰顶端
 * - 药粉受重力自然平铺于下壁内，导管塞心精准对接导出端口
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

  return (
    <g transform={`translate(${x}, ${y})`} id="solid-heating-generator">
      {/* ── 1. 铁架台 (立杆在 X=28，完全位于酒精灯 X=38~103 的左侧，绝对无穿透) ── */}
      <g id="iron-support">
        {/* 底座 */}
        <rect
          x={0}
          y={-14}
          width={56}
          height={14}
          rx={2}
          fill={SCENE_COLORS.heatingAndSupport.ironSupport}
          stroke={SCENE_COLORS.materials.iron}
          strokeWidth={STROKE.objectLine}
        />
        {/* 竖直铁杆 */}
        <rect
          x={25}
          y={-250}
          width={6}
          height={236}
          rx={1}
          fill={SCENE_COLORS.heatingAndSupport.ironSupport}
          stroke={SCENE_COLORS.materials.iron}
          strokeWidth={STROKE.reference}
        />
      </g>

      {/* ── 2. 酒精灯 (中心 X=70.5，外焰顶端 100% 紧贴相切试管底部下壁) ── */}
      <g id="alcohol-lamp">
        <AlcoholLampApparatus
          x={38}
          y={-132}
          width={65}
          height={110}
          lit={lit}
        />
      </g>

      {/* ── 3. 铁架台延伸横杆与紧固螺丝 (从立杆 X=28 水平伸至夹持点 X=105) ── */}
      <g id="iron-clamp-arm">
        {/* 螺丝固定扣 */}
        <rect x={22} y={-156} width={12} height={12} rx={2} fill="#334155" />
        {/* 横向延伸金属杆 (在试管后方延伸，止于试管外壁) */}
        <line x1={28} y1={-150} x2={95} y2={-150} stroke="#475569" strokeWidth={3.5} />
      </g>

      {/* ── 4. 倾斜 6° 试管组合 (旋转轴心为铁夹夹持点 (105, -150)) ── */}
      <g id="test-tube-assembly" transform="rotate(6, 105, -150)">
        {/* 4.1 试管玻璃主体 (管底在左 X=30，管口在右 X=140，管径 24) */}
        <path
          d="M 140,-162 L 42,-162 A 12 12 0 0 0 42,-138 L 140,-138 Z"
          fill={withAlpha(SCENE_COLORS.container.testTube, 0.4)}
          stroke={SCENE_COLORS.container.testTubeBorder}
          strokeWidth={STROKE.objectLine}
        />
        {/* 试管口翻边 Lip */}
        <rect
          x={139}
          y={-164}
          width={4}
          height={28}
          rx={1}
          fill={SCENE_COLORS.container.testTube}
          stroke={SCENE_COLORS.container.testTubeBorder}
          strokeWidth={STROKE.reference}
        />

        {/* 4.2 重力自然横向平铺药粉 (平铺于试管下壁 32~80 区域) */}
        <path
          d="M 32,-144 C 36,-139 42,-139 75,-139 L 75,-139 C 65,-142 45,-144 32,-144 Z"
          fill={powderColor}
          opacity={0.9}
        />

        {/* 4.3 单孔橡皮塞与出气玻璃导管 */}
        <g id="stopper-and-tube">
          <rect x={140} y={-161} width={12} height={22} rx={2} fill={SCENE_COLORS.stopper.rubberStopper} stroke={SCENE_COLORS.stopper.rubberStopperBorder} strokeWidth={1} />
          {/* L 型出气玻璃管 */}
          <path d="M 144,-150 L 155,-150 L 155,-162" fill="none" stroke={SCENE_COLORS.tube.glass} strokeWidth={4} strokeLinecap="round" />
          {/* 出口端红褐色胶管套接扣 */}
          <rect x={150} y={-166} width={10} height={7} rx={1.5} fill="#B45309" stroke="#78350F" strokeWidth={1} />
        </g>
      </g>

      {/* ── 5. 铁夹前爪卡扣 (跟随试管倾斜 6° 紧贴卡住试管 1/3 处外壁) ── */}
      <g transform="translate(105, -150)">
        <g transform="rotate(6)">
          <path
            d="M -9,-14 C -4,-16 4,-16 9,-14 M -9,14 C -4,16 4,16 9,14"
            fill="none"
            stroke="#334155"
            strokeWidth={3.5}
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* ── 6. 警告与提示标语 (放置在天空放晴区域) ── */}
      {isWrongGenerator ? (
        <g transform="translate(30, -210)">
          <rect x={-15} y={-14} width={140} height={22} rx={4} fill="#FEE2E2" stroke="#EF4444" strokeWidth={1.5} />
          <text x={55} y={2} textAnchor="middle" fill="#991B1B" fontSize={font(10)} fontWeight="extrabold">
            ⚠️ 错选装置: 液体流出暴沸!
          </text>
        </g>
      ) : (
        <g transform="translate(35, -200)">
          <rect x={-10} y={-12} width={130} height={18} rx={3} fill="#FEF3C7" stroke="#D97706" strokeWidth={1} />
          <text x={55} y={1} textAnchor="middle" fill="#B45309" fontSize={font(10)} fontWeight="bold">
            管口略向下倾斜 6° 防炸裂
          </text>
        </g>
      )}
    </g>
  )
}
