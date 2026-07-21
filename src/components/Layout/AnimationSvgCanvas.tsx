import React, { type RefObject } from 'react'

// ─── 类型 ──────────────────────────────────────────────────────────────────

interface AnimationSvgCanvasProps {
  /**
   * useAnimationViewport / useCanvasSize 返回的容器 ref，
   * 挂载到外层 div，ResizeObserver 通过它监听容器尺寸变化。
   */
  containerRef: RefObject<HTMLDivElement | null>

  /**
   * useViewport 返回的 vp.transform 字符串。
   * 格式：`translate(tx ty) scale(s)`，将设计坐标映射到可视区域。
   */
  transform: string

  /**
   * SVG 场景内容，将被包裹在 `<g transform={transform}>` 内。
   * 内容使用设计坐标（0..designWidth / 0..designHeight）。
   *
   * 若需要 <defs>（gradient / filter / marker），请将其作为 children 的第一个元素放入，
   * defs 在 g transform 内完全合法：id 引用在同一 SVG 文档内仍有效。
   */
  children: React.ReactNode

  /**
   * 可选：将 SVGSVGElement ref 暴露给外层，供 useViewportPointer 使用。
   * 若页面需要指针交互（拖拽/点击），请传入此 ref。
   */
  svgRef?: RefObject<SVGSVGElement | null>

  /**
   * 可选：Canvas ref。传入时在 SVG 前渲染一个 `<canvas>` 元素，
   * 用于 Canvas+SVG 混合渲染场景（如波场）。
   * canvas 与 SVG 同为 `absolute inset-0`，canvas 在 SVG 下层。
   */
  canvasRef?: RefObject<HTMLCanvasElement | null>

  /**
   * 附加到外层 div 的 CSS 类名。
   * 外层 div 默认类为 `w-full h-full`，此处追加不覆盖。
   */
  className?: string

  // ── 指针事件（挂载到 <svg> 元素）───────────────────────────────────────────
  onMouseMove?: React.MouseEventHandler<SVGSVGElement>
  onMouseUp?: React.MouseEventHandler<SVGSVGElement>
  onMouseLeave?: React.MouseEventHandler<SVGSVGElement>
  onMouseDown?: React.MouseEventHandler<SVGSVGElement>
  onClick?: React.MouseEventHandler<SVGSVGElement>
  onTouchStart?: React.TouchEventHandler<SVGSVGElement>
  onTouchMove?: React.TouchEventHandler<SVGSVGElement>
  onTouchEnd?: React.TouchEventHandler<SVGSVGElement>
  onPointerMove?: React.PointerEventHandler<SVGSVGElement>
  onPointerUp?: React.PointerEventHandler<SVGSVGElement>
}

// ─── 组件 ──────────────────────────────────────────────────────────────────

/**
 * AnimationSvgCanvas — 标准动画 SVG 画布容器
 *
 * 封装 "containerRef + w-full h-full SVG + g transform" 的重复样板，
 * 新动画页面必须使用此组件，禁止手写等效逻辑。
 */
export const AnimationSvgCanvas = React.memo<AnimationSvgCanvasProps>(
  function AnimationSvgCanvas({
    containerRef,
    transform,
    children,
    svgRef,
    canvasRef,
    className = '',
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onMouseDown,
    onClick,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onPointerMove,
    onPointerUp,
  }) {
    const hasCanvas = !!canvasRef
    return (
      <div
        ref={containerRef}
        className={`w-full h-full overflow-hidden${hasCanvas ? ' relative' : ''}${className ? ` ${className}` : ''}`}
      >
        {hasCanvas && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden
          />
        )}
        <svg
          ref={svgRef}
          className={`block select-none w-full h-full${hasCanvas ? ' absolute inset-0 pointer-events-none' : ''}`}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onClick={onClick}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <g transform={transform}>
            {children}
          </g>
        </svg>
      </div>
    )
  }
)
