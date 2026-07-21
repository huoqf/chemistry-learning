import type { KnowledgeNode } from './types'
import {
  inorganicKnowledge,
  reactionPrincipleKnowledge,
  organicKnowledge,
  structureKnowledge,
  experimentKnowledge,
} from './knowledge'
import { getAnimationConfig } from './animationRegistry'

export const knowledgeTree: KnowledgeNode[] = [
  ...inorganicKnowledge,
  ...reactionPrincipleKnowledge,
  ...organicKnowledge,
  ...structureKnowledge,
  ...experimentKnowledge,
]

/**
 * 根据 AnimationConfig.knowledgeId 反向自动注入 animationIds。
 * 新增动画只需在 registries/ 中定义 config 并设置 knowledgeId，
 * 无需手动维护 knowledge 节点的 animationIds。
 */
export function resolveAnimationIds(nodes: KnowledgeNode[]): void {
  const nodeById = new Map<string, KnowledgeNode>()
  nodes.forEach(n => nodeById.set(n.id, n))

  // 遍历已注册动画，按 knowledgeId 注入
  const knownAnimIds = new Set<string>()
  nodes.forEach(n => n.animationIds.forEach(id => knownAnimIds.add(id)))

  // 从 registry 动态发现（AppInitializer 已预加载）
  const registryIds = [
    'anim-le-chatelier',
    'anim-unit-cell-calculation',
  ]

  for (const animId of registryIds) {
    const config = getAnimationConfig(animId)
    if (!config) continue
    const kid = typeof config.knowledgeId === 'string' ? config.knowledgeId : config.knowledgeId[0]
    const node = nodeById.get(kid)
    if (node && !node.animationIds.includes(animId)) {
      node.animationIds.push(animId)
    }
  }
}

// 启动时自动解析
resolveAnimationIds(knowledgeTree)

export const knowledgeIndex: Record<string, KnowledgeNode> = {}

knowledgeTree.forEach(node => {
  knowledgeIndex[node.id] = node
})

export function getKnowledgeNode(id: string): KnowledgeNode | undefined {
  return knowledgeIndex[id]
}
