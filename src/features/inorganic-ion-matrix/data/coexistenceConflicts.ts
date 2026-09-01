import type { CoexistenceConflict, ConflictType } from '../types'
import { CONFLICT_MAP } from './coexistenceConflictMap'

/** 将矩阵冲突分类映射到共存冲突大类 */
function mapCategoryToConflictType(category: string): ConflictType {
  if (category === 'precipitate') return 'precipitate'
  if (category === 'redox' || category === 'acid-medium-trap') return 'redox'
  if (category === 'double-hydrolysis') return 'double-hydrolysis'
  if (category === 'gas-weak-acid') return 'gas'
  return 'weak-electrolyte'
}

/** 由 CONFLICT_MAP 动态生成全量高考共存互斥规则条目 */
export const COEXISTENCE_CONFLICTS: CoexistenceConflict[] = Object.entries(CONFLICT_MAP).map(
  ([key, item]) => {
    return {
      id: `conflict-${key.replace(':', '-')}`,
      ionA: item.cationId,
      ionB: item.anionId,
      type: mapCategoryToConflictType(item.category),
      typeLabel: item.badgeLabel,
      reason: item.reason,
      equation: item.equation || '',
    }
  }
)
