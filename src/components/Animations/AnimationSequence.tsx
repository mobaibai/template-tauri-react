import type { ReactNode } from 'react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { animated, useSpring } from '@react-spring/web'

export interface AnimationStep {
  /** 步骤名称 */
  name?: string
  /** 动画属性 */
  to: {
    opacity?: number
    x?: number
    y?: number
    scale?: number
    rotate?: number
    [key: string]: any
  }
  /** 动画配置 */
  config?: {
    duration?: number
    tension?: number
    friction?: number
    mass?: number
    easing?: (t: number) => number
  }
  /** 延迟时间（毫秒） */
  delay?: number
  /** 步骤完成回调 */
  onStepComplete?: (stepIndex: number, stepName?: string) => void
}

export interface AnimationSequenceProps {
  /** 动画步骤数组 */
  steps: AnimationStep[]
  /** 初始状态 */
  from?: {
    opacity?: number
    x?: number
    y?: number
    scale?: number
    rotate?: number
    [key: string]: any
  }
  /** 子元素 */
  children: ReactNode
  /** 序列完成回调 */
  onSequenceComplete?: () => void
  /** 自定义类名 */
  className?: string
  /** 是否自动开始动画 */
  autoStart?: boolean
  /** 全局延迟时间 */
  globalDelay?: number
  /** 是否循环播放 */
  loop?: boolean | number
  /** 循环间隔时间（毫秒） */
  loopDelay?: number
  /** 变换原点 */
  transformOrigin?: string
  /** 旋转轴 */
  rotateAxis?: 'x' | 'y' | 'z'
}

/**
 * @description 动画序列组件，支持复杂的动画序列编排
 * @param steps 动画步骤数组
 * @param from 初始状态
 * @param children 子元素
 * @param onSequenceComplete 序列完成回调
 * @param className 自定义类名
 * @param autoStart 是否自动开始动画
 * @param globalDelay 全局延迟时间
 * @param loop 是否循环播放
 * @param loopDelay 循环间隔时间（毫秒）
 * @param transformOrigin 变换原点
 * @param rotateAxis 旋转轴
 * @example
 * <AnimationSequence
 *  steps={[
 *    {
 *      name: 'step1',
 *      to: { opacity: 1, x: 100, y: 100, scale: 1, rotate: 360 },
 *      config: { duration: 500, tension: 300, friction: 10, mass: 1 },
 *      delay: 0,
 *      onStepComplete: (stepIndex, stepName) => console.log(`${stepName} 完成`)
 *    },
 *    {
 *      name: 'step2',
 *      to: { opacity: 0, x: 0, y: 0, scale: 0.8, rotate: 0 },
 *      config: { duration: 500, tension: 300, friction: 10, mass: 1 },
 *      delay: 500,
 *      onStepComplete: (stepIndex, stepName) => console.log(`${stepName} 完成`)
 *    }
 *  ]}
 *  children={<div>Hello World</div>}
 *  onSequenceComplete={() => console.log('序列完成')}
 *  className='animation-sequence'
 *  autoStart={true}
 *  globalDelay={0}
 *  loop={false}
 *  loopDelay={1000}
 *  transformOrigin='center'
 *  rotateAxis='z'
 *  />
 */
export const AnimationSequence: React.FC<AnimationSequenceProps> = ({
  steps,
  from = { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 },
  children,
  onSequenceComplete,
  className = '',
  autoStart = true,
  globalDelay = 0,
  loop = false,
  loopDelay = 1000,
  transformOrigin = 'center',
  rotateAxis = 'z',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [loopCount, setLoopCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const [styles, api] = useSpring(
    () => ({
      from,
      config: { tension: 300, friction: 10, mass: 1 },
    }),
    [from]
  )

  // 执行单个动画步骤
  const executeStep = useCallback(
    async (stepIndex: number): Promise<void> => {
      if (stepIndex >= steps.length) return

      const step = steps[stepIndex]
      setCurrentStepIndex(stepIndex)

      return new Promise(resolve => {
        const stepDelay = step.delay || 0

        setTimeout(() => {
          api.start({
            to: step.to,
            config: step.config || { tension: 300, friction: 10, mass: 1 },
            onRest: () => {
              step.onStepComplete?.(stepIndex, step.name)
              resolve()
            },
          })
        }, stepDelay)
      })
    },
    [steps, api]
  )

  // 执行完整的动画序列
  const executeSequence = useCallback(async () => {
    setIsPlaying(true)

    for (let i = 0; i < steps.length; i++) {
      await executeStep(i)
    }

    setCurrentStepIndex(-1)
    setIsPlaying(false)
    onSequenceComplete?.()

    // 处理循环
    if (loop) {
      const shouldContinue = typeof loop === 'number' ? loopCount < loop - 1 : true

      if (shouldContinue) {
        setLoopCount(prev => prev + 1)

        setTimeout(() => {
          // 重置到初始状态
          api.set(from)
          executeSequence()
        }, loopDelay)
      } else {
        setLoopCount(0)
      }
    }
  }, [steps, executeStep, onSequenceComplete, loop, loopCount, loopDelay, api, from])

  // 手动控制方法
  const playSequence = useCallback(() => {
    if (!isPlaying) {
      executeSequence()
    }
  }, [executeSequence, isPlaying])

  const pauseSequence = useCallback(() => {
    api.stop()
    setIsPlaying(false)
  }, [api])

  const resetSequence = useCallback(() => {
    api.stop()
    api.set(from)
    setCurrentStepIndex(-1)
    setIsPlaying(false)
    setLoopCount(0)
  }, [api, from])

  const jumpToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        api.stop()
        executeStep(stepIndex)
      }
    },
    [executeStep, steps.length, api]
  )

  useEffect(() => {
    if (!autoStart) return

    const timer = setTimeout(() => {
      executeSequence()
    }, globalDelay)

    return () => clearTimeout(timer)
  }, [executeSequence, globalDelay, autoStart])

  // 计算变换样式
  const animatedStyle = useMemo(() => {
    const style: any = {}

    if (styles.opacity !== undefined) {
      style.opacity = styles.opacity
    }

    const transforms: string[] = []

    if (styles.x !== undefined || styles.y !== undefined) {
      const x = styles.x || 0
      const y = styles.y || 0
      transforms.push(`translate3d(${x}px, ${y}px, 0)`)
    }

    if (styles.scale !== undefined) {
      transforms.push(`scale(${styles.scale})`)
    }

    if (styles.rotate !== undefined) {
      transforms.push(`rotate${rotateAxis.toUpperCase()}(${styles.rotate}deg)`)
    }

    if (transforms.length > 0) {
      style.transform = transforms
    }

    return style
  }, [styles, rotateAxis])

  const containerClass = useMemo(
    () => `animation-sequence [will-change:transform,opacity] ${className}`.trim(),
    [className]
  )

  // 暴露控制方法给父组件
  React.useImperativeHandle(
    null,
    () => ({
      play: playSequence,
      pause: pauseSequence,
      reset: resetSequence,
      jumpToStep,
      currentStep: currentStepIndex,
      isPlaying,
      loopCount,
    }),
    [playSequence, pauseSequence, resetSequence, jumpToStep, currentStepIndex, isPlaying, loopCount]
  )

  return (
    <div className={containerClass} style={{ transformOrigin }}>
      <animated.div style={animatedStyle}>{children}</animated.div>
    </div>
  )
}

export { useAnimationSequence } from '@/hooks/animation/useAnimationSequence'

// 控制器 Hook 已移至 src/hooks/animation/useAnimationSequence.ts
// 请从那里导入 useAnimationSequence
