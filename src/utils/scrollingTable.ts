/**
 * getVisibleRows - 频闪数据表取最后 N 行 + 高亮索引
 * 纯函数，无副作用。
 */
export function getVisibleRows<T>(data: T[], maxRows: number): {
  visibleRows: T[]
  highlightIndex: number
} {
  const visible = data.slice(-maxRows)
  return { visibleRows: visible, highlightIndex: visible.length - 1 }
}