import React, { useEffect, useState } from 'react'
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react'
import { PANEL, duration, easing } from '@/theme'
import { useBreakpoint } from '@/utils'

// ─── ThreePanel ──────────────────────────────────────────────────────────

/**
 * ThreePanel 三栏布局组件 Props 接口。
 * 提供响应式三栏布局，支持桌面端固定侧边栏和移动端抽屉/堆叠模式。
 */
interface ThreePanelProps {
  left?: React.ReactNode
  center: React.ReactNode
  right?: React.ReactNode
  className?: string
}

/**
 * ThreePanel 三栏布局组件
 *
 * 桌面端：左侧面板固定，中间自适应，右侧面板固定。
 * 平板端：左侧面板变为抽屉式。
 * 移动端：左侧面板抽屉式，右侧面板下移到主内容下方。
 */
export const ThreePanel: React.FC<ThreePanelProps> = ({
  left,
  center,
  right,
  className = '',
}) => {
  const tier = useBreakpoint()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (tier === 'standard' || tier === 'compact') setDrawerOpen(false)
  }, [tier])

  const leftDrawer = tier === 'tablet' || tier === 'mobile'
  const rightBelow = tier === 'mobile'
  const leftW = tier === 'standard' ? PANEL.left.standard : PANEL.left.compact
  const rightW = tier === 'standard' ? PANEL.right.standard : PANEL.right.compact

  return (
    <div className={`relative flex h-full ${rightBelow ? 'flex-col' : ''} ${className}`}>
      {left && (
        leftDrawer ? (
          <>
            <button
              onClick={() => setDrawerOpen(v => !v)}
              className="absolute top-3 left-3 z-30 p-1.5 rounded-lg bg-white shadow-md border border-neutral-200 hover:bg-neutral-50 active:scale-[0.97]"
              style={{ transition: `all ${duration.fast}ms ${easing.standard}` }}
              aria-label={drawerOpen ? '关闭参数面板' : '打开参数面板'}
            >
              {drawerOpen
                ? <PanelLeftClose className="w-4 h-4 text-neutral-600" />
                : <PanelLeftOpen className="w-4 h-4 text-neutral-600" />}
            </button>

            {drawerOpen && (
              <div
                className="absolute inset-0 z-20 bg-black/20"
                onClick={() => setDrawerOpen(false)}
              />
            )}

            <div
              className="absolute top-0 left-0 z-30 h-full bg-neutral-50 border-r border-neutral-200 overflow-y-auto shadow-xl"
              style={{
                width: leftW,
                transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: `transform ${duration.normal}ms ${easing.standard}`,
              }}
            >
              {left}
            </div>
          </>
        ) : (
          <div
            className="flex-shrink-0 bg-neutral-50 border-r border-neutral-200 overflow-y-auto"
            style={{ width: leftW }}
          >
            {left}
          </div>
        )
      )}

      <div
        className="flex-1 bg-white overflow-hidden"
        style={{ minWidth: rightBelow ? 0 : 400 }}
      >
        {center}
      </div>

      {right && (
        rightBelow ? (
          <div
            className="flex-shrink-0 bg-neutral-50 border-t border-neutral-200 overflow-y-auto"
            style={{ maxHeight: '40vh' }}
          >
            {right}
          </div>
        ) : (
          <div
            className="flex-shrink-0 bg-neutral-50 border-l border-neutral-200 overflow-y-auto"
            style={{ width: rightW }}
          >
            {right}
          </div>
        )
      )}
    </div>
  )
}
