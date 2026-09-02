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
    const seenConflictIds = new Set<string>()

    // 1. 检查所有二元离子对组合
    for (let i = 0; i < selectedIonIds.length; i++) {
      for (let j = i + 1; j < selectedIonIds.length; j++) {
        const idA = selectedIonIds[i]
        const idB = selectedIonIds[j]

        const matched = COEXISTENCE_CONFLICTS.filter(
          (c) =>
            (c.ionA === idA && c.ionB === idB) ||
            (c.ionA === idB && c.ionB === idA)
        )
        matched.forEach((c) => {
          if (!seenConflictIds.has(c.id)) {
            seenConflictIds.add(c.id)
            activeConflicts.push(c)
          }
        })
      }
    }

    // 2. 检查多离子隐蔽酸性催化氧化还原三元陷阱
    const hasH = selectedIonIds.includes('H+')
    const hasNO3 = selectedIonIds.includes('NO3-')
    const hasClO = selectedIonIds.includes('ClO-')
    const hasCl = selectedIonIds.includes('Cl-')

    // 三元陷阱 A: H+ + NO3- + 还原剂 (如 Fe2+, I-, SO32-)
    if (hasH && hasNO3) {
      const redoxReducers = ['Fe2+', 'I-', 'SO32-', 'S2-', 'S2O32-']
      redoxReducers.forEach((redId) => {
        if (selectedIonIds.includes(redId)) {
          const trapId = `trap-h-no3-${redId}`
          if (!seenConflictIds.has(trapId)) {
            seenConflictIds.add(trapId)
            activeConflicts.push({
              id: trapId,
              ionA: 'NO3-',
              ionB: redId,
              type: 'redox',
              typeLabel: '酸性介质诱发氧化还原',
              reason: `在 H⁺ 酸化介质中，NO₃⁻ 具备相当于稀硝酸/浓硝酸的强氧化性，迅速氧化 ${redId}。`,
              equation: `3${redId} + NO_3^- + 4H^+ \\rightarrow 氧化产物 + NO\\uparrow + 2H_2O`,
            })
          }
        }
      })
    }

    // 三元陷阱 B: H+ + ClO- + Cl- 归中生成 Cl2
    if (hasH && hasClO && hasCl) {
      const trapId = 'trap-h-clo-cl'
      if (!seenConflictIds.has(trapId)) {
        seenConflictIds.add(trapId)
        activeConflicts.push({
          id: trapId,
          ionA: 'ClO-',
          ionB: 'Cl-',
          type: 'redox',
          typeLabel: '酸性归中反应',
          reason: '在酸性条件下，ClO⁻ 与 Cl⁻ 发生剧烈归中反应生成有毒黄绿色 Cl₂ 气体 (84消毒液与洁厕灵混用原理)。',
          equation: 'ClO^- + Cl^- + 2H^+ = Cl_2\\uparrow + H_2O',
        })
      }
    }

    // 3. 强氧化性阴离子与还原性阴离子二元氧化还原排斥 (MnO4-, ClO- 与 I-, S2-, SO32-, S2O32-)
    const strongOxidantAnions = ['MnO4-', 'ClO-']
    const reducingAnions = ['I-', 'S2-', 'SO32-', 'S2O32-']
    strongOxidantAnions.forEach((oxId) => {
      if (selectedIonIds.includes(oxId)) {
        reducingAnions.forEach((redId) => {
          if (selectedIonIds.includes(redId)) {
            const redoxId = `redox-${oxId}-${redId}`
            if (!seenConflictIds.has(redoxId)) {
              seenConflictIds.add(redoxId)
              activeConflicts.push({
                id: redoxId,
                ionA: oxId,
                ionB: redId,
                type: 'redox',
                typeLabel: '氧化还原互斥',
                reason: `${oxId} 具有强氧化性，与强还原性阴离子 ${redId} 发生自发氧化还原反应，不能大量共存。`,
                equation: `${oxId} + ${redId} \\rightarrow 氧化产物 + 还原产物`,
              })
            }
          }
        })
      }
    })

    return {
      conflicts: activeConflicts,
      canCoexist: activeConflicts.length === 0,
      selectedIonObjects,
      conflictCount: activeConflicts.length,
    }
  }, [selectedIonIds])
}
