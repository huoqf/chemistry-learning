import { useMemo } from 'react'
import { COEXISTENCE_CONFLICTS, ION_DATA } from '../constants'
import type { CoexistenceConflict, IonItem } from '../types'

export interface IonCoexistenceResult {
  conflicts: CoexistenceConflict[]
  canCoexist: boolean
  selectedIonObjects: IonItem[]
  conflictCount: number
}

/**
 * useIonCoexistence — 离子共存智能冲突检测 Hook (纯逻辑无副作用)
 *
 * @param selectedIonIds 用户勾选的离子 ID 列表
 */
export function useIonCoexistence(selectedIonIds: string[]): IonCoexistenceResult {
  return useMemo(() => {
    const selectedIonObjects = selectedIonIds
      .map((id) => ION_DATA.find((ion) => ion.id === id))
      .filter((ion): ion is IonItem => Boolean(ion))

    const activeConflicts: CoexistenceConflict[] = []

    // 检查所有两两组合
    for (let i = 0; i < selectedIonIds.length; i++) {
      for (let j = i + 1; j < selectedIonIds.length; j++) {
        const idA = selectedIonIds[i]
        const idB = selectedIonIds[j]

        const matched = COEXISTENCE_CONFLICTS.filter(
          (c) =>
            (c.ionA === idA && c.ionB === idB) ||
            (c.ionA === idB && c.ionB === idA)
        )
        if (matched.length > 0) {
          activeConflicts.push(...matched)
        }
      }
    }

    return {
      conflicts: activeConflicts,
      canCoexist: activeConflicts.length === 0,
      selectedIonObjects,
      conflictCount: activeConflicts.length,
    }
  }, [selectedIonIds])
}
