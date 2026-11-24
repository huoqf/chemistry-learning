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
    const hasOH = selectedIonIds.includes('OH-')
    const hasNO3 = selectedIonIds.includes('NO3-')
    const hasClO = selectedIonIds.includes('ClO-')
    const hasCl = selectedIonIds.includes('Cl-')
    const hasMnO4 = selectedIonIds.includes('MnO4-')

    // 三元陷阱 A: H+ + NO3- + 还原剂 (如 Fe2+, I-, SO32-, S2-, S2O32-)
    if (hasH && hasNO3) {
      const no3TrapEquations: Record<string, { label: string; equation: string }> = {
        'Fe2+': {
          label: 'Fe²⁺',
          equation: '3Fe^{2+} + NO_3^- + 4H^+ = 3Fe^{3+} + NO\\uparrow + 2H_2O',
        },
        'I-': {
          label: 'I⁻',
          equation: '6I^- + 2NO_3^- + 8H^+ = 3I_2 + 2NO\\uparrow + 4H_2O',
        },
        'SO32-': {
          label: 'SO₃²⁻',
          equation: '3SO_3^{2-} + 2NO_3^- + 2H^+ = 3SO_4^{2-} + 2NO\\uparrow + H_2O',
        },
        'S2-': {
          label: 'S²⁻',
          equation: '3S^{2-} + 2NO_3^- + 8H^+ = 3S\\downarrow + 2NO\\uparrow + 4H_2O',
        },
        'S2O32-': {
          label: 'S₂O₃²⁻',
          equation: 'S_2O_3^{2-} + 2H^+ = S\\downarrow + SO_2\\uparrow + H_2O',
        },
      }
      Object.entries(no3TrapEquations).forEach(([redId, info]) => {
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
              reason: `在 H⁺ 酸化介质中，NO₃⁻ 具备相当于稀硝酸的强氧化性，迅速氧化还原性离子 ${info.label}（S₂O₃²⁻ 酸性下先发生自身歧化，产物进一步被氧化）。`,
              equation: info.equation,
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

    // 三元陷阱 C: H+ + MnO4- + Cl- 酸性下氧化氯离子生成 Cl2
    if (hasH && hasMnO4 && hasCl) {
      const trapId = 'trap-h-mno4-cl'
      if (!seenConflictIds.has(trapId)) {
        seenConflictIds.add(trapId)
        activeConflicts.push({
          id: trapId,
          ionA: 'MnO4-',
          ionB: 'Cl-',
          type: 'redox',
          typeLabel: '酸性介质氧化氯化物',
          reason: '在酸性条件下，高锰酸根是极强的氧化剂，可将 Cl⁻（氯离子属弱还原性）氧化生成黄绿色——紫红色立即褪色并产生 Cl₂ 气体，不能大量共存。',
          equation: '2MnO_4^- + 16H^+ + 10Cl^- = 2Mn^{2+} + 5Cl_2\\uparrow + 8H_2O',
        })
      }
    }

    // 3. 强氧化性阴离子与还原性阴离子二元氧化还原排斥 (MnO4-, ClO- 与 I-, S2-, SO32-, S2O32-)
    const redoxPairEquations: Record<string, { oxLabel: string; redLabel: string; equation: string }> = {
      'MnO4-:I-': {
        oxLabel: 'MnO₄⁻',
        redLabel: 'I⁻',
        equation: hasH
          ? '2MnO_4^- + 10I^- + 16H^+ = 2Mn^{2+} + 5I_2 + 8H_2O'
          : '2MnO_4^- + 6I^- + 4H_2O = 2MnO_2\\downarrow + 3I_2 + 8OH^-',
      },
      'MnO4-:S2-': {
        oxLabel: 'MnO₄⁻',
        redLabel: 'S²⁻',
        equation: hasH
          ? '2MnO_4^- + 5S^{2-} + 16H^+ = 2Mn^{2+} + 5S\\downarrow + 8H_2O'
          : '2MnO_4^- + 3S^{2-} + 4H_2O = 2MnO_2\\downarrow + 3S\\downarrow + 8OH^-',
      },
      'MnO4-:SO32-': {
        oxLabel: 'MnO₄⁻',
        redLabel: 'SO₃²⁻',
        equation: hasH
          ? '2MnO_4^- + 5SO_3^{2-} + 6H^+ = 2Mn^{2+} + 5SO_4^{2-} + 3H_2O'
          : '2MnO_4^- + 3SO_3^{2-} + H_2O = 2MnO_2\\downarrow + 3SO_4^{2-} + 2OH^-',
      },
      'MnO4-:S2O32-': {
        oxLabel: 'MnO₄⁻',
        redLabel: 'S₂O₃²⁻',
        equation: hasH
          ? '8MnO_4^- + 5S_2O_3^{2-} + 14H^+ = 8Mn^{2+} + 10SO_4^{2-} + 7H_2O'
          : '8MnO_4^- + 3S_2O_3^{2-} + H_2O = 8MnO_2\\downarrow + 6SO_4^{2-} + 2OH^-',
      },
      'ClO-:I-': {
        oxLabel: 'ClO⁻',
        redLabel: 'I⁻',
        equation: hasH
          ? 'ClO^- + 2I^- + 2H^+ = Cl^- + I_2 + H_2O'
          : 'ClO^- + 2I^- + H_2O = Cl^- + I_2 + 2OH^-',
      },
      'ClO-:S2-': {
        oxLabel: 'ClO⁻',
        redLabel: 'S²⁻',
        equation: hasH
          ? 'ClO^- + S^{2-} + 2H^+ = Cl^- + S\\downarrow + H_2O'
          : 'ClO^- + S^{2-} + H_2O = Cl^- + S\\downarrow + 2OH^-',
      },
      'ClO-:SO32-': {
        oxLabel: 'ClO⁻',
        redLabel: 'SO₃²⁻',
        equation: 'ClO^- + SO_3^{2-} = Cl^- + SO_4^{2-}',
      },
      'ClO-:S2O32-': {
        oxLabel: 'ClO⁻',
        redLabel: 'S₂O₃²⁻',
        equation: hasOH
          ? '4ClO^- + S_2O_3^{2-} + 2OH^- = 4Cl^- + 2SO_4^{2-} + H_2O'
          : '4ClO^- + S_2O_3^{2-} + H_2O = 4Cl^- + 2SO_4^{2-} + 2H^+',
      },
    }
    const strongOxidantAnions = ['MnO4-', 'ClO-']
    const reducingAnions = ['I-', 'S2-', 'SO32-', 'S2O32-']
    strongOxidantAnions.forEach((oxId) => {
      if (selectedIonIds.includes(oxId)) {
        reducingAnions.forEach((redId) => {
          if (selectedIonIds.includes(redId)) {
            const redoxId = `redox-${oxId}-${redId}`
            const info = redoxPairEquations[`${oxId}:${redId}`]
            if (!seenConflictIds.has(redoxId) && info) {
              seenConflictIds.add(redoxId)
              activeConflicts.push({
                id: redoxId,
                ionA: oxId,
                ionB: redId,
                type: 'redox',
                typeLabel: '氧化还原互斥',
                reason: `${info.oxLabel} 具有强氧化性，与强还原性阴离子 ${info.redLabel} 发生自发氧化还原反应，不能大量共存。`,
                equation: info.equation,
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
