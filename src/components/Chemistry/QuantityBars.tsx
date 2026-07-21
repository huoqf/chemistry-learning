import type { FC } from 'react'
import { CANVAS_COLORS, SCENE_COLORS } from '@/theme'

export interface QuantityBarItem {
  key: string
  label: string
  value: number
  /** 填充颜色，须引用 CHEMISTRY_COLORS 等 Token */
  color: string
  /** 文字高亮颜色 */
  textColor?: string
  /** 柱顶自定义文本 */
  displayValue?: string
}

export interface QuantityBarsProps {
  /** 动态量柱列表 */
  items: QuantityBarItem[]
  /** 初始总量参考值 */
  initialTotal?: number
  /** 面板标题，默认"系统量实时分配" */
  title?: string
  /** 响应式字体缩放函数 */
  font?: (size: number) => number
  /** 是否触发变化发光闪烁 */
  hasCollision?: boolean
  /** 触发闪烁高亮的量柱 key */
  collisionKey?: string
  /** 紧凑模式 */
  compact?: boolean
  /** 总量单位标签 */
  unit?: string
}

export const QuantityBars: FC<QuantityBarsProps> = ({
  items,
  initialTotal,
  title = '系统量实时分配',
  font,
  hasCollision = false,
  collisionKey,
  compact = false,
  unit = '',
}) => {
  const values = items.map((item) => item.value)
  const maxVal = Math.max(initialTotal ?? 1.0, ...values, 1e-3)

  const getPercent = (val: number) => {
    return Math.min(100, Math.max(0, (val / maxVal) * 100))
  }

  const fSize = (s: number) => (font ? font(s) : s)
  const titleFs = compact ? 9 : 10.5
  const valueFs = compact ? 7 : 8
  const labelFs = compact ? 7 : 8
  const gapClass = compact ? 'gap-1' : 'gap-2'

  const truncateLabel = (label: string) => {
    if (!compact || label.length <= 5) return label
    return label.slice(0, 4) + '…'
  }

  const unitDisplay = unit ? ` ${unit}` : ''

  return (
    <div className="flex flex-col p-2 bg-white rounded-lg border border-neutral-200/50 select-none w-full h-full min-h-[110px]">
      <div
        className="font-bold text-neutral-700 mb-1.5 flex justify-between items-center px-0.5 shrink-0"
        style={{ fontSize: fSize(titleFs) }}
      >
        <span className="tracking-wide">{title}</span>
        {initialTotal !== undefined && (
          <span className="text-neutral-400 font-medium font-mono" style={{ fontSize: fSize(9) }}>
            初始: {compact ? initialTotal.toFixed(1) : initialTotal.toFixed(2)}{unitDisplay}
          </span>
        )}
      </div>

      <div className={`relative flex-1 min-h-[55px] flex items-end justify-between pt-5 px-1.5 border-b border-neutral-200/80 ${gapClass}`}>
        {initialTotal !== undefined && (
          <div
            className="absolute left-0 right-0 border-t border-dashed border-neutral-300 pointer-events-none transition-opacity duration-300"
            style={{ bottom: `${getPercent(initialTotal)}%`, height: '1px' }}
          />
        )}

        {items.map((item) => {
          const isColliding = hasCollision && collisionKey === item.key
          const itemColor = isColliding ? CANVAS_COLORS.alertRed : item.color

          return (
            <div key={item.key} className="flex flex-col items-center flex-1 z-10 min-w-0 h-full justify-end">
              <div
                className={`relative w-4.5 bg-transparent rounded-t-[3px] h-full min-h-[35px] max-h-[80px] flex items-end transition-colors duration-200 ${
                  isColliding ? 'border border-red-300 bg-red-50/5' : ''
                }`}
              >
                <div
                  className="w-full rounded-t-[2px] transition-colors duration-200"
                  style={{
                    height: `${getPercent(item.value)}%`,
                    backgroundColor: itemColor,
                  }}
                />

                {isColliding && (
                  <span
                    className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-50 text-red-600 font-semibold px-1 py-0.5 rounded border border-red-200 shadow-sm"
                    style={{ fontSize: fSize(6.5) }}
                  >
                    变化
                  </span>
                )}

                <span
                  className="absolute -top-4 font-semibold font-mono whitespace-nowrap left-1/2 -translate-x-1/2 text-center px-0.5 transition-colors duration-300"
                  style={{
                    fontSize: fSize(valueFs),
                    color: isColliding ? CANVAS_COLORS.alertRed : (item.textColor || SCENE_COLORS.labels.stateSymbol)
                  }}
                  title={item.displayValue !== undefined ? item.displayValue : item.value.toFixed(2)}
                >
                  {item.displayValue !== undefined ? item.displayValue : (compact ? item.value.toFixed(1) : item.value.toFixed(2))}
                </span>
              </div>

              <span
                className={`mt-1 font-bold text-center transition-colors duration-300 ${
                  isColliding ? 'text-red-500 font-extrabold' : 'text-neutral-500'
                } shrink-0 w-full whitespace-pre-line leading-tight`}
                style={{
                  fontSize: fSize(labelFs),
                  color: isColliding ? CANVAS_COLORS.alertRed : (item.textColor || undefined)
                }}
                title={item.label.replace('\n', ' ')}
              >
                {truncateLabel(item.label)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
