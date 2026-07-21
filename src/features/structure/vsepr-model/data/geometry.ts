/**
 * VSEPR 几何坐标与多面体框架计算
 *
 * 纯数学/几何函数，无 DOM/React 依赖
 */

export const R_BOND = 1.6 // 键长 Scale

/** 向量归一化 */
export function normalize(v: [number, number, number], scale = 1): [number, number, number] {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
  if (len === 0) return [0, 0, 0]
  return [(v[0] / len) * scale, (v[1] / len) * scale, (v[2] / len) * scale]
}

// 常见理想几何多面体顶点向量
export const GEOMETRY_VERTICES = {
  // 直线形 (2对)
  linear: [
    [0, R_BOND, 0],
    [0, -R_BOND, 0],
  ] as [number, number, number][],

  // 平面三角形 (3对)
  trigonalPlanar: [
    [0, R_BOND, 0],
    [R_BOND * Math.cos(Math.PI / 6), -R_BOND * Math.sin(Math.PI / 6), 0],
    [-R_BOND * Math.cos(Math.PI / 6), -R_BOND * Math.sin(Math.PI / 6), 0],
  ] as [number, number, number][],

  // 正四面体 (4对)
  tetrahedral: [
    [0, R_BOND, 0],
    [R_BOND * (2 * Math.sqrt(2) / 3), -R_BOND / 3, 0],
    [-R_BOND * (Math.sqrt(2) / 3), -R_BOND / 3, R_BOND * (Math.sqrt(6) / 3)],
    [-R_BOND * (Math.sqrt(2) / 3), -R_BOND / 3, -R_BOND * (Math.sqrt(6) / 3)],
  ] as [number, number, number][],

  // 三角双锥 (5对): [轴向上, 轴向下, 赤道1, 赤道2, 赤道3]
  trigonalBipyramidal: [
    [0, R_BOND, 0],   // 轴向 1 (Top)
    [0, -R_BOND, 0],  // 轴向 2 (Bottom)
    [R_BOND, 0, 0],   // 赤道 1 (Eq1)
    [-R_BOND * 0.5, 0, R_BOND * Math.sin(Math.PI * 2 / 3)],  // 赤道 2 (Eq2)
    [-R_BOND * 0.5, 0, -R_BOND * Math.sin(Math.PI * 2 / 3)], // 赤道 3 (Eq3)
  ] as [number, number, number][],

  // 正八面体 (6对): [轴向上, 轴向下, X+, X-, Z+, Z-]
  octahedral: [
    [0, R_BOND, 0],   // 0: Y+ (Top)
    [0, -R_BOND, 0],  // 1: Y- (Bottom)
    [R_BOND, 0, 0],   // 2: X+
    [-R_BOND, 0, 0],  // 3: X-
    [0, 0, R_BOND],   // 4: Z+
    [0, 0, -R_BOND],  // 5: Z-
  ] as [number, number, number][],
}

/** 生成精准多面体虚线框架边（过滤穿透中心原子的对角线，呈现真实的几何外骨架） */
export function generatePolyEdgesByIndices(
  vertices: [number, number, number][],
  indexPairs: Array<[number, number]>
): Array<[[number, number, number], [number, number, number]]> {
  return indexPairs.map(([i, j]) => [vertices[i], vertices[j]])
}

export const POLY_EDGES = {
  linear: generatePolyEdgesByIndices(GEOMETRY_VERTICES.linear, [[0, 1]]),
  trigonalPlanar: generatePolyEdgesByIndices(GEOMETRY_VERTICES.trigonalPlanar, [[0, 1], [1, 2], [2, 0]]),
  tetrahedral: generatePolyEdgesByIndices(GEOMETRY_VERTICES.tetrahedral, [
    [0, 1], [0, 2], [0, 3],
    [1, 2], [2, 3], [3, 1],
  ]),
  // 9 条外骨架边（去除穿过中心的 0-1 轴向连线）
  trigonalBipyramidal: generatePolyEdgesByIndices(GEOMETRY_VERTICES.trigonalBipyramidal, [
    [0, 2], [0, 3], [0, 4], // 轴上到赤道
    [1, 2], [1, 3], [1, 4], // 轴下到赤道
    [2, 3], [3, 4], [4, 2], // 赤道三角形
  ]),
  // 12 条正八面体外骨架边（去除贯穿中心的 0-1 Y轴、2-3 X轴、4-5 Z轴 对角交叉线）
  octahedral: generatePolyEdgesByIndices(GEOMETRY_VERTICES.octahedral, [
    [0, 2], [0, 3], [0, 4], [0, 5], // 轴上顶点到赤道4顶点
    [1, 2], [1, 3], [1, 4], [1, 5], // 轴下顶点到赤道4顶点
    [2, 4], [4, 3], [3, 5], [5, 2], // 赤道正方形4条边
  ]),
}
