import { useCallback, useState } from 'react'
import { useSpring } from '@react-spring/web'

// 动画步骤类型定义
export interface AnimationStep {
  to: any
  config?: any
  delay?: number
  onStart?: () => void
  onRest?: () => void
}

// 动画序列控制器 Hook，用于手动控制动画序列
export const useAnimationSequence = (steps: AnimationStep[], from?: any) => {
  const [styles, api] = useSpring(() => ({
    from: from || { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 },
  }))

  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)

  const executeStep = useCallback(
    async (stepIndex: number): Promise<void> => {
      if (stepIndex >= steps.length) return

      const step = steps[stepIndex]
      setCurrentStepIndex(stepIndex)

      if (step.onStart) step.onStart()

      return new Promise<void>(resolve => {
        api.start({
          ...step.to,
          delay: step.delay || 0,
          config: step.config,
          onRest: () => {
            if (step.onRest) step.onRest()
            resolve()
          },
        })
      })
    },
    [steps, api]
  )

  const play = useCallback(
    async (startIndex = 0, endIndex = steps.length - 1) => {
      if (isPlaying) return
      setIsPlaying(true)

      for (let i = startIndex; i <= endIndex; i++) {
        await executeStep(i)
      }

      setIsPlaying(false)
    },
    [executeStep, steps.length, isPlaying]
  )

  const playFrom = useCallback(
    (index: number) => {
      return play(index)
    },
    [play]
  )

  const reset = useCallback(() => {
    setCurrentStepIndex(-1)
    api.set(from || { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 })
  }, [api, from])

  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= steps.length) return
      setCurrentStepIndex(index)
      
      // 计算到目标步骤的累积状态
      const targetState = { ...from } || { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 }
      
      for (let i = 0; i <= index; i++) {
        Object.assign(targetState, steps[i].to)
      }
      
      api.set(targetState)
    },
    [steps, api, from]
  )

  return {
    styles,
    currentStepIndex,
    isPlaying,
    play,
    playFrom,
    executeStep,
    reset,
    goToStep,
    api,
  }
}