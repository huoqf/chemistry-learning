import { AnimationConfig } from './types'

// ─── Chemistry animation registries (lazy loaded) ───

let fullRegistry: Record<string, AnimationConfig> = {}
let extendedLoaded = false
let extendedPromise: Promise<void> | null = null

export async function loadExtendedRegistry(): Promise<void> {
  if (extendedLoaded) return
  if (!extendedPromise) {
    extendedPromise = (async () => {
      const { reactionPrincipleAnimations } = await import('./registries/reaction-principle')
      const { structureAnimations } = await import('./registries/structure')
      const { inorganicAnimations } = await import('./registries/inorganic')
      Object.assign(fullRegistry, reactionPrincipleAnimations, structureAnimations, inorganicAnimations)

      extendedLoaded = true

      // 注册表装载完成后自动关联知识树（传入完整 registry，动态发现所有动画）
      const { resolveAnimationIds, knowledgeTree } = await import('./knowledgeTree')
      resolveAnimationIds(knowledgeTree, fullRegistry)
    })()
  }
  await extendedPromise
}

// ─── 公共 API ───

/** 动画总数（registry 加载后可用） */
export function getAnimationCount(): number {
  return Object.keys(fullRegistry).length
}

/** 同步获取 config */
export function getAnimationConfig(id: string): AnimationConfig | undefined {
  return fullRegistry[id]
}

/** 异步获取 config（自动触发懒加载） */
export async function getAnimationConfigAsync(id: string): Promise<AnimationConfig | undefined> {
  if (!fullRegistry[id]) {
    await loadExtendedRegistry()
  }
  return fullRegistry[id]
}

/** 预加载 registry */
export function preloadExtendedRegistry(): void {
  if (!extendedLoaded && !extendedPromise) {
    extendedPromise = loadExtendedRegistry()
  }
}

export { defineAnimations } from './defineAnimations'