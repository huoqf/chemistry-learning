import { CHEMISTRY_COLORS, CANVAS_COLORS, CHART_COLORS, withAlpha } from '@/theme'
import type { RedoxChemistryResult } from '../hooks/useRedoxElectronTransferChemistry'

interface RedoxElectronTransferSceneProps {
  chemistry: RedoxChemistryResult
  bridgeStyle: number // 0: 双线桥, 1: 单线桥, 2: 微观电子层
  canvasSize: { font: (size: number) => number }
}

export function RedoxElectronTransferScene({
  chemistry,
  bridgeStyle = 0,
  canvasSize,
}: RedoxElectronTransferSceneProps) {
  const { font } = canvasSize
  const { model, progress, actualTransferredElectrons } = chemistry

  // 左区画布中心 (0 ~ 420px 范围内, cx = 210, cy 垂直居中偏上)
  const cx = 210
  const cy = 280

  // 失电子 (氧化/升失氧) 配色，得电子 (还原/降得还) 配色
  const oxidizedColor = CHEMISTRY_COLORS.reactionRate
  const reducedColor = CHEMISTRY_COLORS.concentration

  // 动画电子流动坐标 (单次流动，progress 0→1/3 期间电子从还原剂流向氧化剂)
  const electronFlowProgress = Math.min(1, progress * 3)

  return (
    <g className="user-select-none">
      {/* 左区背景边框 (15 ~ 405px) */}
      <rect
        x={15}
        y={15}
        width={390}
        height={620}
        rx={12}
        fill="none"
        stroke={CANVAS_COLORS.grid}
        strokeDasharray="4,4"
        strokeWidth={1}
      />
      <text
        x={cx}
        y={42}
        fontSize={font(14)}
        fontWeight="bold"
        fill={CANVAS_COLORS.labelText}
        textAnchor="middle"
      >
        {model.name}
      </text>

      {/* 方式 0 / 方式 1: 方程式与线桥标注 */}
      {bridgeStyle !== 2 && (
        <g transform={`translate(${cx}, ${cy})`}>
          {/* 方程式显示框 (宽 350px) */}
          <rect
            x={-175}
            y={-25}
            width={350}
            height={50}
            rx={8}
            fill="none"
            stroke={CANVAS_COLORS.axis}
            strokeWidth={1.5}
          />
          <text
            x={0}
            y={6}
            fontSize={font(15)}
            fontWeight="bold"
            fill={CANVAS_COLORS.labelText}
            textAnchor="middle"
          >
            {model.equationPlain}
          </text>

          {/* 模式 0: 双线桥法 */}
          {bridgeStyle === 0 && (
            <g>
              {/* 上线桥: 氧化/失电子 (从还原剂元素 -> 氧化产物元素) */}
              <path
                d="M -110 -25 Q 0 -85 110 -25"
                fill="none"
                stroke={oxidizedColor}
                strokeWidth={2.5}
                strokeDasharray="6,3"
              />
              <path
                d="M 105 -33 L 110 -25 L 100 -23"
                fill="none"
                stroke={oxidizedColor}
                strokeWidth={2.5}
              />
              <text
                x={0}
                y={-92}
                fontSize={font(12)}
                fontWeight="bold"
                fill={oxidizedColor}
                textAnchor="middle"
              >
                {`失 ${model.elements.oxidized.count}×${Math.abs(model.elements.oxidized.delta)}e⁻, 化合价升高 (${model.elements.oxidized.fromValence} → +${model.elements.oxidized.toValence}), 被氧化`}
              </text>

              {/* 下线桥: 还原/得电子 (从氧化剂元素 -> 还原产物元素) */}
              <path
                d="M -55 25 Q 0 85 55 25"
                fill="none"
                stroke={reducedColor}
                strokeWidth={2.5}
                strokeDasharray="6,3"
              />
              <path
                d="M 50 33 L 55 25 L 45 23"
                fill="none"
                stroke={reducedColor}
                strokeWidth={2.5}
              />
              <text
                x={0}
                y={100}
                fontSize={font(12)}
                fontWeight="bold"
                fill={reducedColor}
                textAnchor="middle"
              >
                {`得 ${model.elements.reduced.count}×${Math.abs(model.elements.reduced.delta)}e⁻, 化合价降低 (${model.elements.reduced.fromValence} → ${model.elements.reduced.toValence}), 被还原`}
              </text>

              {/* 动态沿线桥流动的电子粒子 */}
              <g transform={`translate(${-110 + 220 * electronFlowProgress}, ${-25 - Math.sin(electronFlowProgress * Math.PI) * 60})`}>
                <circle r={6} fill={oxidizedColor} />
                <text x={0} y={3} fontSize={font(8)} fill="#ffffff" fontWeight="bold" textAnchor="middle">e⁻</text>
              </g>
              <g transform={`translate(${-55 + 110 * electronFlowProgress}, ${25 + Math.sin(electronFlowProgress * Math.PI) * 60})`}>
                <circle r={6} fill={reducedColor} />
                <text x={0} y={3} fontSize={font(8)} fill="#ffffff" fontWeight="bold" textAnchor="middle">e⁻</text>
              </g>
            </g>
          )}

          {/* 模式 1: 单线桥法 */}
          {bridgeStyle === 1 && (
            <g>
              {/* 从还原剂失电子原子连弧线指向氧化剂得电子原子 */}
              <path
                d="M -110 -25 Q -80 -90 -45 -25"
                fill="none"
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
              />
              <path
                d="M -49 -35 L -45 -25 L -57 -27"
                fill={CHART_COLORS.primary}
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
              />
              <rect
                x={-130}
                y={-110}
                width={100}
                height={26}
                rx={4}
                fill={withAlpha(CHART_COLORS.primary, 0.15)}
                stroke={CHART_COLORS.primary}
              />
              <text
                x={-80}
                y={-93}
                fontSize={font(12)}
                fontWeight="bold"
                fill={CHART_COLORS.primary}
                textAnchor="middle"
              >
                {`转移 ${actualTransferredElectrons.toFixed(1)} mol e⁻`}
              </text>
            </g>
          )}
        </g>
      )}

      {/* 模式 2: 微观原子/电子壳层结构 */}
      {bridgeStyle === 2 && model.microShells && (
        <g transform={`translate(${cx}, ${cy + 30})`}>
          {/* 左侧还原剂原子 (如 Na) */}
          <g transform="translate(-90, 0)">
            <circle r={20} fill={withAlpha(oxidizedColor, 0.2)} stroke={oxidizedColor} strokeWidth={2} />
            <text x={0} y={5} fontSize={font(13)} fontWeight="bold" fill={oxidizedColor} textAnchor="middle">
              {model.microShells.reductant.symbol}
            </text>
            {/* 电子层环 */}
            {model.microShells.reductant.shells.map((count, layerIdx) => {
              const radius = 32 + layerIdx * 16
              return (
                <g key={`red-shell-${layerIdx}`}>
                  <circle r={radius} fill="none" stroke={CANVAS_COLORS.grid} strokeWidth={1} strokeDasharray="3,3" />
                  {Array.from({ length: count }).map((_, eIdx) => {
                    const angle = (eIdx / count) * 2 * Math.PI
                    const ex = Math.cos(angle) * radius
                    const ey = Math.sin(angle) * radius
                    const isOuter = layerIdx === model.microShells!.reductant.shells.length - 1
                    if (isOuter && electronFlowProgress >= 1) return null
                    return (
                      <circle key={`e-${layerIdx}-${eIdx}`} cx={ex} cy={ey} r={3.5} fill={oxidizedColor} />
                    )
                  })}
                </g>
              );
            })}
            <text x={0} y={90} fontSize={font(11)} fill={CANVAS_COLORS.labelText} textAnchor="middle">
              {`电子排布: ${model.microShells.reductant.shells.join('-')}`}
            </text>
          </g>

          {/* 右侧氧化剂原子 (如 Cl) */}
          <g transform="translate(90, 0)">
            <circle r={20} fill={withAlpha(reducedColor, 0.2)} stroke={reducedColor} strokeWidth={2} />
            <text x={0} y={5} fontSize={font(13)} fontWeight="bold" fill={reducedColor} textAnchor="middle">
              {model.microShells.oxidant.symbol}
            </text>
            {/* 电子层环 */}
            {model.microShells.oxidant.shells.map((count, layerIdx) => {
              const radius = 32 + layerIdx * 16
              const isOuter = layerIdx === model.microShells!.oxidant.shells.length - 1
              const currentCount = (isOuter && electronFlowProgress >= 1) ? count + 1 : count
              return (
                <g key={`ox-shell-${layerIdx}`}>
                  <circle r={radius} fill="none" stroke={CANVAS_COLORS.grid} strokeWidth={1} strokeDasharray="3,3" />
                  {Array.from({ length: currentCount }).map((_, eIdx) => {
                    const angle = (eIdx / currentCount) * 2 * Math.PI
                    const ex = Math.cos(angle) * radius
                    const ey = Math.sin(angle) * radius
                    return (
                      <circle key={`e-${layerIdx}-${eIdx}`} cx={ex} cy={ey} r={3.5} fill={reducedColor} />
                    )
                  })}
                </g>
              );
            })}
            <text x={0} y={90} fontSize={font(11)} fill={CANVAS_COLORS.labelText} textAnchor="middle">
              {`电子排布: ${model.microShells.oxidant.shells.join('-')}`}
            </text>
          </g>

          {/* 转移中的电子 (与桥模式一致：progress 0→1/3 期间流动) */}
          {electronFlowProgress < 1 && (
            <g transform={`translate(${-90 + 180 * electronFlowProgress}, ${-60 * Math.sin(electronFlowProgress * Math.PI)})`}>
              <circle r={5} fill={oxidizedColor} />
              <text x={0} y={3} fontSize={font(7)} fill="#fff" fontWeight="bold" textAnchor="middle">e⁻</text>
            </g>
          )}

          {/* 转移完成后的电荷标注 */}
          {electronFlowProgress >= 1 && (
            <g>
              <text x={-90} y={-75} fontSize={font(15)} fontWeight="bold" fill={oxidizedColor} textAnchor="middle">
                {`Na${model.microShells.reductant.charge}`}
              </text>
              <text x={90} y={-75} fontSize={font(15)} fontWeight="bold" fill={reducedColor} textAnchor="middle">
                {`Cl${model.microShells.oxidant.charge}`}
              </text>
            </g>
          )}
        </g>
      )}
    </g>
  )
}
