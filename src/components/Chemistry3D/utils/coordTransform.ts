/**
 * 3D 坐标转换工具 — 分数坐标 ↔ 笛卡尔坐标 ↔ 居中世界坐标
 *
 * 世界坐标系约定（铁律）：
 * - 单位：Å（埃）或 nm，由页面级 context 决定
 * - 原点：晶胞/分子中心
 * - Y 轴方向：向上（three.js 默认 Y-up 右手系）
 * - 缩放：1 unit = 1 Å（晶胞）或 1 nm（分子）
 */

export interface CellParams {
  a: number
  b: number
  c: number
  alpha: number
  beta: number
  gamma: number
}

/** 分数坐标 → 笛卡尔坐标（Å） */
export function fracToCartesian(
  frac: readonly [number, number, number],
  cell: CellParams,
): [number, number, number] {
  const [x, y, z] = frac
  const { a, b, c, alpha, beta, gamma } = cell

  const alphaR = (alpha * Math.PI) / 180
  const betaR = (beta * Math.PI) / 180
  const gammaR = (gamma * Math.PI) / 180

  const ax = a
  const bx = b * Math.cos(gammaR)
  const by = b * Math.sin(gammaR)
  const cx = c * Math.cos(betaR)
  const cy = (c * (Math.cos(alphaR) - Math.cos(betaR) * Math.cos(gammaR))) / Math.sin(gammaR)
  const cz = Math.sqrt(Math.max(0, c * c - cx * cx - cy * cy))

  return [
    x * ax + y * bx + z * cx,
    y * by + z * cy,
    z * cz,
  ]
}

/** 笛卡尔坐标 → 居中世界坐标（原点在晶胞中心） */
export function cartesianToWorld(
  cart: readonly [number, number, number],
  cell: CellParams,
): [number, number, number] {
  const center = fracToCartesian([0.5, 0.5, 0.5], cell)
  return [
    cart[0] - center[0],
    cart[1] - center[1],
    cart[2] - center[2],
  ]
}

/** 分数坐标 → 居中世界坐标（一步到位） */
export function fracToWorld(
  frac: readonly [number, number, number],
  cell: CellParams,
): [number, number, number] {
  return cartesianToWorld(fracToCartesian(frac, cell), cell)
}

/** 分数坐标 → 笛卡尔坐标数组（批量转换） */
export function batchFracToWorld(
  fracs: ReadonlyArray<readonly [number, number, number]>,
  cell: CellParams,
): Array<[number, number, number]> {
  return fracs.map((f) => fracToWorld(f, cell))
}
