/**
 * 晶胞分数坐标生成辅助函数
 */

/** 生成 8 个顶点的分数坐标 */
export function getCornerFracs(): Array<[number, number, number]> {
  return [
    [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
    [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
  ]
}

/** 生成 6 个面心的分数坐标 */
export function getFaceFracs(): Array<[number, number, number]> {
  return [
    [0.5, 0.5, 0], [0.5, 0.5, 1],
    [0.5, 0, 0.5], [0.5, 1, 0.5],
    [0, 0.5, 0.5], [1, 0.5, 0.5],
  ]
}

/** 生成 12 个棱心的分数坐标 */
export function getEdgeFracs(): Array<[number, number, number]> {
  return [
    [0.5, 0, 0], [0.5, 1, 0], [0.5, 0, 1], [0.5, 1, 1],
    [0, 0.5, 0], [1, 0.5, 0], [0, 0.5, 1], [1, 0.5, 1],
    [0, 0, 0.5], [1, 0, 0.5], [0, 1, 0.5], [1, 1, 0.5],
  ]
}
