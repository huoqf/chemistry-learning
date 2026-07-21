import { useEffect, useRef, type ReactNode } from 'react'

export function FixedSizeRoot({ children }: { children: ReactNode }) {
  const gRef = useRef<SVGGElement | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && gRef.current) {
      const el = gRef.current
      const isSvgContext = el instanceof SVGGElement
      if (!isSvgContext) {
        console.error(
          '[BaseChart] fixedSize 模式返回纯 SVG 元素，但当前父容器是 HTML 而非 <svg>。' +
          '图表将不可见。请去掉 fixedSize 让组件返回 <div>+<svg> 自适应结构，' +
          '或将图表放入 <svg>/<g> 上下文中。',
        )
      }
    }
  }, [])

  return <g ref={gRef}>{children}</g>
}
