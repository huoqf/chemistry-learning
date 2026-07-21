import type { KnowledgeNode, AnimationConfig } from './types'
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
 * 无需手动维护 knowledge 节点的 animationIds，也无需修改本文件。
 *
 * @param nodes 知识树节点
 * @param registry 可选：完整注册表（懒加载后传入），用于动态发现所有动画 ID。
 *                 不传时回退到 getAnimationConfig 逐个查询。
 */
export function resolveAnimationIds(
  nodes: KnowledgeNode[],
  registry?: Record<string, AnimationConfig>,
): void {
  const nodeById = new Map<string, KnowledgeNode>()
  nodes.forEach(n => nodeById.set(n.id, n))

  // 动画 ID 来源：优先用传入的 registry（完整），否则回退到已知列表
  const animIds: string[] = registry
    ? Object.keys(registry)
    : [
        'anim-le-chatelier',
        'anim-unit-cell-calculation',
        'anim-vsepr',
      ]

  for (const animId of animIds) {
    const config = registry?.[animId] ?? getAnimationConfig(animId)
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
