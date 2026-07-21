import { useEffect, useState } from 'react'

/**
 * 应用启动初始化器 — 统一执行所有 store 的异步水合，
 * 避免在各页面分散调用 hydrate()。
 *
 * 就绪前渲染 loading 态，就绪后渲染 children。
 */
export function AppInitializer({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    // 预加载动画注册表，确保直接访问 /animation/:id 时同步 getAnimationConfig 可用
    ;(async () => {
      const { loadExtendedRegistry } = await import('@/data/animationRegistry')
      const { resolveAnimationIds, knowledgeTree } = await import('@/data/knowledgeTree')
      await loadExtendedRegistry()
      resolveAnimationIds(knowledgeTree)
      if (!cancelled) setReady(true)
    })()
    return () => { cancelled = true }
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-400 text-sm">{'加载中\u2026'}</div>
      </div>
    )
  }

  return <>{children}</>
}