/**
 * DragHandle — SVG 拖拽手柄组件
 *
 * 提供统一的视觉样式（圆点 + 悬停放大）和鼠标指针反馈。
 * 调用方负责在 onPointerDown 中调用 e.preventDefault()，
 * 并配套处理 pointermove / pointerup / pointercancel。
 */

import React from 'react'

interface DragHandleProps {
  /** 圆心 X 坐标（SVG 设计坐标） */
  cx: number
  /** 圆心 Y 坐标（SVG 设计坐标） */
  cy: number
  /** 填充颜色 */
  color: string
  /** 鼠标指针样式，默认 'grab' */
  cursor?: 'grab' | 'ew-resize' | 'ns-resize' | 'move'
  /** 是否显示脉冲动画环 */
  showPulse?: boolean
  /** Pointer down 回调 */
  onPointerDown: (e: React.PointerEvent<SVGGElement>) => void
  /** 附加 className */
  className?: string
}

const CURSOR_CLASS: Record<string, string> = {
  grab: 'cursor-grab',
  'ew-resize': 'cursor-ew-resize',
  'ns-resize': 'cursor-ns-resize',
  move: 'cursor-move',
} as const

export const DragHandle = React.memo<DragHandleProps>(function DragHandle({
  cx,
  cy,
  color,
  cursor = 'grab',
  showPulse = false,
  onPointerDown,
  className = '',
}) {
  const cursorClass = CURSOR_CLASS[cursor] ?? CURSOR_CLASS.grab

  return (
    <g
      onPointerDown={onPointerDown}
      className={`group ${cursorClass} active:cursor-grabbing ${className}`}
    >
      <circle cx={cx} cy={cy} r={16} fill="transparent" opacity={0} />
      <circle
        cx={cx} cy={cy} r={6}
        fill={color} stroke="white" strokeWidth={1.5}
        className="group-hover:scale-125 transition-transform"
      />
      {showPulse && (
        <circle
          cx={cx} cy={cy} r={10}
          fill="none" stroke={color}
          strokeWidth={1} opacity={0.4}
          className="animate-pulse"
        />
      )}
    </g>
  )
})
