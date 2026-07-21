import type { Vector2 } from '../../chemistry/Vector2';
import { magnitude, normalize } from '../../chemistry/Vector2';
import type { SceneScale } from '../../scene/SceneScale';
import type { VectorType } from '../../theme/chemistry/vectorStyle';
import { VECTOR_COLORS } from '../../theme/chemistry/vectorStyle';
import { FONT } from '../../theme/chemistry/canvasStyle';
import { calculateVectorPixelLength } from '../../utils/vectorLength';

/**
 * 矢量箭头组件 Props
 *
 * 仅接受设计坐标 originDesign，用于视觉标注、几何图形等场景。
 * 需要物理坐标起点的化学矢量请使用 ChemistryVectorArrow。
 */
interface VectorArrowProps {
  /** 矢量起点（设计坐标，y↓正方向），在 `<g transform={vp.transform}>` 内直接使用 */
  originDesign: { x: number; y: number }
  /** 矢量值（物理坐标，y↑正方向） */
  vector: Vector2
  /** 矢量类型（决定默认颜色和参考量级） */
  type: VectorType
  /** 场景缩放参数 */
  sceneScale: SceneScale
  /** 自定义颜色 */
  color?: string
  /** 自定义线宽 */
  strokeWidth?: number
  /** 自定义像素长度（覆盖自动计算） */
  pixelLength?: number
  /** 自定义参考量级 */
  refMagnitude?: number
  /** 矢量符号名称标签 */
  label?: string
  /** 是否使用虚线箭头 */
  dashed?: boolean
  /** 是否增加发光阴影 */
  glow?: boolean
  /** 字体缩放函数 */
  font?: (base: number) => number
}

function perpendicular(v: Vector2): Vector2 {
  return { x: -v.y, y: v.x };
}

/**
 * 矢量箭头渲染组件
 */
export function VectorArrow({
  originDesign,
  vector,
  type,
  sceneScale,
  color,
  strokeWidth,
  pixelLength: overrideLength,
  refMagnitude: overrideRefMag,
  label,
  dashed,
  glow,
  font = (n: number) => n,
}: VectorArrowProps) {
  if (magnitude(vector) === 0) return null;

  if (process.env.NODE_ENV !== 'production' && sceneScale.scaleX !== sceneScale.scaleY && !sceneScale.intentionalNonUniformScale) {
    console.warn(
      `[VectorArrow] sceneScale 非等比缩放 (scaleX=${sceneScale.scaleX}, scaleY=${sceneScale.scaleY})，` +
      '矢量方向可能失真。'
    );
  }

  const dir = normalize(vector);
  const refMag = overrideRefMag ?? sceneScale.refMagnitudes?.[type] ?? 0;
  const totalLength =
    overrideLength ??
    calculateVectorPixelLength(magnitude(vector), type, sceneScale.maxVectorLength, refMag);

  const headLen = Math.max(7, Math.min(16, totalLength * 0.28));
  const lineLen = Math.max(0, totalLength - headLen);
  const headWidth = headLen * 0.6;

  const x1 = originDesign.x;
  const y1 = originDesign.y;

  const lineEndX = x1 + dir.x * lineLen;
  const lineEndY = y1 - dir.y * lineLen;

  const tipX = x1 + dir.x * totalLength;
  const tipY = y1 - dir.y * totalLength;

  const perp = perpendicular(dir);
  const baseLeftX = lineEndX + perp.x * (headWidth / 2);
  const baseLeftY = lineEndY - perp.y * (headWidth / 2);
  const baseRightX = lineEndX - perp.x * (headWidth / 2);
  const baseRightY = lineEndY + perp.y * (headWidth / 2);

  const fillColor = color ?? VECTOR_COLORS[type];
  const stroke = strokeWidth ?? Math.max(3, totalLength * 0.04);

  const pxDirX = dir.x;
  const pxDirY = -dir.y;

  let textAnchor: 'start' | 'end' | 'middle' = 'middle';
  if (pxDirX > 0.3) {
    textAnchor = 'start';
  } else if (pxDirX < -0.3) {
    textAnchor = 'end';
  }

  let dy = '0.35em';
  if (pxDirY > 0.5) {
    dy = '1em';
  } else if (pxDirY < -0.5) {
    dy = '-0.3em';
  }

  const textX = tipX + pxDirX * 10;
  const textY = tipY + pxDirY * 10;

  const filterStyle = glow ? { filter: `drop-shadow(0px 0px 3.5px ${fillColor})` } : undefined;

  return (
    <g style={filterStyle}>
      {lineLen > 0 && (
        <line
          x1={x1}
          y1={y1}
          x2={lineEndX}
          y2={lineEndY}
          stroke={fillColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          {...(dashed ? { strokeDasharray: '4 4' } : {})}
        />
      )}
      {dashed ? (
        <polygon
          points={`${baseLeftX},${baseLeftY} ${tipX},${tipY} ${baseRightX},${baseRightY}`}
          fill="none"
          stroke={fillColor}
          strokeWidth={Math.max(1.2, stroke * 0.7)}
          strokeLinejoin="round"
        />
      ) : (
        <polygon
          points={`${baseLeftX},${baseLeftY} ${tipX},${tipY} ${baseRightX},${baseRightY}`}
          fill={fillColor}
        />
      )}
      {label && (
        <text
          x={textX}
          y={textY}
          fill={fillColor}
          fontSize={font(FONT.small)}
          fontWeight="bold"
          textAnchor={textAnchor}
          dy={dy}
        >
          {label}
        </text>
      )}
    </g>
  );
}
