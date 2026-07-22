import React, { useCallback } from 'react'
import { Play, Pause, RotateCcw, RefreshCw } from 'lucide-react'
import { colors, duration } from '@/theme'
import { useRadioGroup } from '@/hooks/useRadioGroup'

interface AnimationControlsProps {
  isPlaying: boolean
  speed: number
  time: number
  maxTime: number
  onPlayPause: () => void
  onReset: () => void
  onSpeedChange: (speed: number) => void
  onTimeChange: (time: number) => void
  controlsMode?: 'timed' | 'loop' | 'param' | 'pause-only'
  equilibriumReached?: boolean
}

// 速度选择器：互斥单选，已接入 useRadioGroup（radiogroup + roving tabindex + 方向键导航）
const SPEED_OPTIONS = [0.25, 0.5, 1, 2]

const SpeedSelector: React.FC<{
  speed: number
  onSpeedChange: (s: number) => void
  labelMinWidth?: string
}> = ({ speed, onSpeedChange, labelMinWidth = '30px' }) => {
  const keys = SPEED_OPTIONS.map(String)
  const { getItemProps, registerRef } = useRadioGroup({
    value: String(speed),
    keys,
    onChange: (key) => onSpeedChange(Number(key)),
    direction: 'linear',
  })
  const setRef = useCallback(
    (key: string) => (el: HTMLButtonElement | null) => registerRef(key, el),
    [registerRef],
  )

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-neutral-600" style={{ minWidth: labelMinWidth }}>速度：</span>
      <div className="flex gap-1" role="radiogroup" aria-label="播放速度">
        {SPEED_OPTIONS.map((s) => {
          const isActive = s === speed
          const itemProps = getItemProps(String(s))
          return (
            <button
              key={s}
              ref={setRef(String(s))}
              {...itemProps}
              onClick={() => {
                if (!isActive) onSpeedChange(s)
              }}
              className={[
                'px-3 py-1 rounded text-sm font-medium active:scale-[0.97] transition-all',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
              ].join(' ')}
              style={{
                transitionProperty: 'all',
                transitionDuration: `${duration.fast}ms`,
                transitionTimingFunction: 'ease-out',
              }}
            >
              {s}x
            </button>
          )
        })}
      </div>
    </div>
  )
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  isPlaying,
  speed,
  time,
  maxTime,
  onPlayPause,
  onReset,
  onSpeedChange,
  onTimeChange,
  controlsMode = 'timed',
  equilibriumReached: _equilibriumReached = false,
}) => {
  const percentage = maxTime > 0 ? (time / maxTime) * 100 : 0

  const getSpeedColor = () => {
    if (speed < 1) return colors.secondary[400]
    if (speed > 1) return colors.accent[500]
    return colors.primary[500]
  }

  const speedColor = getSpeedColor()

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTimeChange(parseFloat(e.target.value))
  }

  if (controlsMode === 'param') {
    return null
  }

  if (controlsMode === 'pause-only') {
    const hasStarted = isPlaying || time > 0
    if (!hasStarted) return null

    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-neutral-200 px-4 py-3">
        <div className="flex items-center justify-center">
          <button
            onClick={onPlayPause}
            className="w-10 h-10 rounded-full bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 active:scale-[0.97] flex items-center justify-center transition-all"
            style={{
              transitionProperty: 'all',
              transitionDuration: `${duration.fast}ms`,
              transitionTimingFunction: 'ease-out',
            }}
            aria-label={isPlaying ? '暂停' : '继续播放'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
        </div>
      </div>
    )
  }

  if (controlsMode === 'loop') {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-neutral-200 px-4 py-3">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
            style={{ backgroundColor: `${colors.secondary[100]}`, color: colors.secondary[700] }}
          >
            <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '2s' }} />
            循环运行中
          </div>

          <SpeedSelector speed={speed} onSpeedChange={onSpeedChange} />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            className="w-10 h-10 rounded-full bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 active:scale-[0.97] flex items-center justify-center transition-all"
            style={{
              transitionProperty: 'all',
              transitionDuration: `${duration.fast}ms`,
              transitionTimingFunction: 'ease-out',
            }}
            aria-label={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={onReset}
            className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300 active:scale-[0.97] flex items-center justify-center transition-all"
            style={{
              transitionProperty: 'all',
              transitionDuration: `${duration.fast}ms`,
              transitionTimingFunction: 'ease-out',
            }}
            aria-label="重置"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>


        <SpeedSelector speed={speed} onSpeedChange={onSpeedChange} labelMinWidth="60px" />

        <div className="flex-1 flex items-center gap-3">
          <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{
            color: speedColor,
            backgroundColor: `${speedColor}22`
          }}>
            {speed}x
          </span>
          <span className="text-sm text-neutral-600 min-w-[40px]">
            {time.toFixed(1)}s
          </span>
          <div className="flex-1 relative h-2 bg-neutral-200 rounded-full flex items-center">
            <input
              type="range"
              min={0}
              max={maxTime}
              step={0.1}
              value={time}
              onChange={handleSliderChange}
              className="peer absolute -inset-y-2 left-0 w-full h-6 opacity-0 cursor-pointer z-10"
            />
            <div
              className="absolute left-0 top-0 h-full rounded-full pointer-events-none transition-all duration-150"
              style={{
                width: `${percentage}%`,
                backgroundColor: speedColor,
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-sm pointer-events-none transition-all duration-150 peer-hover:scale-115 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-300 peer-focus-visible:ring-offset-1 peer-active:scale-95"
              style={{
                left: `calc(${percentage}% - 8px)`,
                borderColor: speedColor,
                borderWidth: '2px',
                borderStyle: 'solid',
              }}
            />
          </div>
          <span className="text-sm text-neutral-600 min-w-[40px]">
            {maxTime.toFixed(1)}s
          </span>
        </div>
      </div>
    </div>
  )
}
