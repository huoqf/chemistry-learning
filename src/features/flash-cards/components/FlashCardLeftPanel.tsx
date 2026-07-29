import { LeftPanel, LeftPanelSection, ControlPanel, Button } from '@/components/UI'
import { FLASH_CARD_CATEGORIES } from '../constants'
import type { FlashCardCategory } from '../types'
import type { ControlMeta } from '@/data/types'
import { Sparkles, Shuffle, ChevronLeft, ChevronRight, Eye, Flame, Gauge } from 'lucide-react'

interface FlashCardLeftPanelProps {
  viewMode: number
  category: FlashCardCategory
  currentIndex: number
  totalCards: number
  isRevealed: boolean
  isHeating: boolean
  isCompressing: boolean
  sceneType: string
  onUpdateParam: (key: string, value: any) => void
  onChangeCategory: (cat: FlashCardCategory) => void
  onNextCard: () => void
  onPrevCard: () => void
  onRandomCard: () => void
  onToggleReveal: () => void
  onToggleHeating: () => void
  onToggleCompressing: () => void
}

export function FlashCardLeftPanel({
  viewMode,
  category,
  currentIndex,
  totalCards,
  isRevealed,
  isHeating,
  isCompressing,
  sceneType,
  onUpdateParam,
  onChangeCategory,
  onNextCard,
  onPrevCard,
  onRandomCard,
  onToggleReveal,
  onToggleHeating,
  onToggleCompressing,
}: FlashCardLeftPanelProps) {
  const controls: ControlMeta[] = [
    {
      type: 'segmented',
      key: 'viewMode',
      label: '中屏视角模式切换',
      group: '高考视角导航',
      options: [
        { label: '动画/盲盒探究', value: 0 },
        { label: '规范踩分', value: 1 },
        { label: '真题变式', value: 2 },
      ],
    },
  ]

  return (
    <LeftPanel>
      <ControlPanel
        controls={controls}
        params={{ viewMode }}
        updateParam={(k, v) => onUpdateParam(k, v)}
        setParams={(p) => {
          Object.entries(p).forEach(([k, v]) => onUpdateParam(k, v))
        }}
        resetAnimation={() => {}}
        restartAnimation={() => {}}
      />

      {viewMode === 0 && (
        <>
          <LeftPanelSection title="易错事实盲盒分类筛选">
            <div className="flex flex-col gap-1.5">
              {FLASH_CARD_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => onChangeCategory(cat.value as FlashCardCategory)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all flex items-center justify-between ${
                    category === cat.value
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  {category === cat.value && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                </button>
              ))}
            </div>
          </LeftPanelSection>

          <LeftPanelSection title="盲盒抽卡与探究控制">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-600 font-mono font-semibold pb-1">
                <span>当前盲盒进度：</span>
                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {currentIndex + 1} / {totalCards}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" onClick={onPrevCard}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  上一张
                </Button>
                <Button variant="secondary" size="sm" onClick={onNextCard}>
                  下一张
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <Button variant="primary" size="sm" onClick={onRandomCard} className="w-full">
                <Shuffle className="w-4 h-4 mr-1" />
                随机抽取盲盒对比卡片
              </Button>

              <Button
                variant={isRevealed ? 'secondary' : 'primary'}
                size="sm"
                onClick={onToggleReveal}
                className="w-full mt-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                {isRevealed ? '隐藏盲盒事实解析' : '揭晓盲盒真相 (答案解析)'}
              </Button>
            </div>
          </LeftPanelSection>

          {(sceneType === 'bleach-heating' || sceneType === 'passivation-heat') && (
            <LeftPanelSection title="实验场景交互控制">
              <Button
                variant={isHeating ? 'danger' : 'secondary'}
                size="sm"
                onClick={onToggleHeating}
                className="w-full"
              >
                <Flame className="w-4 h-4 mr-1" />
                {isHeating ? '停止加热 (恢复常温)' : '开启酒精灯加热 试验现象'}
              </Button>
            </LeftPanelSection>
          )}

          {sceneType === 'gas-compress' && (
            <LeftPanelSection title="实验场景交互控制">
              <Button
                variant={isCompressing ? 'primary' : 'secondary'}
                size="sm"
                onClick={onToggleCompressing}
                className="w-full"
              >
                <Gauge className="w-4 h-4 mr-1" />
                {isCompressing ? '释放活塞 (恢复常压)' : '快速推动活塞 (压缩加压)'}
              </Button>
            </LeftPanelSection>
          )}
        </>
      )}
    </LeftPanel>
  )
}
