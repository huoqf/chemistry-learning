/**
 * src/utils/svgTransform.ts
 * SVG 变换数学工具库 — 精确计算组件内部 SVG 变换后的真实坐标
 *
 * 解决的根本问题：
 * 化学器材组件内部常有 rotate / translate 等 SVG 变换，
 * 若端口坐标不经过数学变换直接手写估算值，
 * 将产生几像素到几十像素的误差，导致连接导管出现不必要的拐弯。
 *
 * 使用模式：
 *   import { applyRotate } from '@/utils/svgTransform'
 *   const tip = applyRotate({ x: 158, y: -126 }, 6, 105, -114)
 *   outletPort = { x: x + tip.x, y: y + tip.y, direction: 'right' }
 */

export interface Point {
  x: number
  y: number
}

/**
 * 对点 point 应用 SVG rotate(angleDeg, cx, cy) 变换（顺时针正方向）
 */
export function applyRotate(
  point: Point,
  angleDeg: number,
  cx = 0,
  cy = 0
): Point {
  const rad = (angleDeg * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  const dx = point.x - cx
  const dy = point.y - cy
  return {
    x: dx * cos - dy * sin + cx,
    y: dx * sin + dy * cos + cy,
  }
}

/** 对点 point 应用 SVG translate(tx, ty) 变换 */
export function applyTranslate(point: Point, tx: number, ty: number): Point {
  return { x: point.x + tx, y: point.y + ty }
}

/**
 * 链式应用多个变换（按数组顺序，从内到外，与 SVG 嵌套顺序一致）
 * @example
 * // <g transform="translate(x,y)"><g transform="rotate(6,105,-114)">
 * const abs = applyTransforms({ x: 158, y: -126 }, [
 *   { type: 'rotate', angleDeg: 6, cx: 105, cy: -114 },
 *   { type: 'translate', tx: x, ty: y },
 * ])
 */
export function applyTransforms(
  point: Point,
  transforms: Array<
    | { type: 'rotate'; angleDeg: number; cx?: number; cy?: number }
    | { type: 'translate'; tx: number; ty: number }
  >
): Point {
  return transforms.reduce((p, t) => {
    if (t.type === 'rotate') {
      return applyRotate(p, t.angleDeg, t.cx ?? 0, t.cy ?? 0)
    }
    return applyTranslate(p, t.tx, t.ty)
  }, point)
}
