/**
 * 控件/参数的条件可见性判断 — 统一逻辑，避免 AnimationPage 和 ControlPanel 重复实现
 */
interface ConditionFields {
  showIf?: string
  showIfValue?: number
  hideIf?: string
  hideIfValue?: number
}

export function isConditionVisible(condition: ConditionFields, params: Record<string, number>): boolean {
  if (condition.showIf) {
    if (condition.showIfValue != null) {
      if (params[condition.showIf] !== condition.showIfValue) return false
    } else if (!params[condition.showIf]) {
      return false
    }
  }
  if (condition.hideIf && condition.hideIfValue != null) {
    if (params[condition.hideIf] === condition.hideIfValue) return false
  }
  return true
}
