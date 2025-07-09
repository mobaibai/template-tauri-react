import type { ReactNode } from 'react'
import React, { useCallback, useEffect, useMemo } from 'react'

import { animated, useSpring } from '@react-spring/web'

import type { RotateType } from './AnimationRotate'
import type { ScaleType } from './AnimationScale'
import type { SlideDirection } from './AnimationSlide'
import type { SpringDirection } from './AnimationSpring'

export interface AnimationEffect {
  /** 动画类型 */
  type: 'opacity' | 'spring' | 'slide' | 'scale' | 'rotate'
  /** 动画配置 */
  config?: {
    // 通用配置
    duration?: number
    delay?: number
    tension?: number
    friction?: number
    mass?: number

    // 透明度动画配置
    fromOpacity?: number
    toOpacity?: number

    // 弹簧/滑动动画配置
    direction?: SpringDirection | SlideDirection
    distance?: number

    // 缩放动画配置
    type?: ScaleType | RotateType
    scaleType?: ScaleType
    fromScale?: number
    toScale?: number

    // 旋转动画配置
    rotateType?: RotateType
    fromRotate?: number
    toRotate?: number
    rotateAxis?: 'x' | 'y' | 'z'

    // 变换原点
    transformOrigin?: string
  }
}

export interface AnimationContainerProps {
  /** 动画效果数组 */
  effects: AnimationEffect[]
  /** 动画模式 */
  mode?: 'spring' | 'linear' | 'parallel' | 'sequence'
  /** 延迟时间 */
  delay?: number
  /** 子元素 */
  children: ReactNode
  /** 动画结束回调 */
  onRest?: () => void
  /** 自定义类名 */
  className?: string
  /** 是否自动开始动画 */
  autoStart?: boolean
  /** 全局延迟时间 */
  globalDelay?: number
  /** 动画执行顺序 */
  sequence?: 'parallel' | 'sequential'
}

/**
 * @description 综合动画容器组件，支持组合多种动画效果
 * @param effects 动画效果数组
 * @param mode 动画模式 spring | linear
 * @param children 子元素
 * @param onRest 动画结束回调
 * @param className 自定义类名
 * @param autoStart 是否自动开始动画
 * @param globalDelay 全局延迟时间
 * @param sequence 动画执行顺序 parallel | sequential
 * @example
 * <AnimationContainer
 *  effects={[
 *    { type: 'opacity', config: { fromOpacity: 0, toOpacity: 1, duration: 800 } },
 *    { type: 'spring', config: { direction: 'top', distance: 30, duration: 800 } }
 *  ]}
 *  mode='spring'
 *  delay={0}
 *  children={<div>Hello World</div>}
 *  onRest={() => console.log('动画结束')}
 *  className='animation-container'
 *  autoStart={true}
 *  globalDelay={0}
 *  sequence='parallel'
 *  />
 */
export const AnimationContainer: React.FC<AnimationContainerProps> = ({
  effects,
  mode = 'spring',
  delay = 0,
  children,
  onRest,
  className = '',
  autoStart = true,
  globalDelay = 0,
  sequence = 'parallel',
}) => {
  // 计算初始状态
  const getInitialState = useCallback(() => {
    const initialState: any = {}

    effects.forEach(effect => {
      const { type, config = {} } = effect

      switch (type) {
        case 'opacity':
          initialState.opacity = config.fromOpacity ?? 0
          break

        case 'spring':
        case 'slide':
          const direction = config.direction || 'top'
          const distance = config.distance || 30

          if (direction.includes('Left') || direction === 'left') {
            initialState.x = -distance
          } else if (direction.includes('Right') || direction === 'right') {
            initialState.x = distance
          } else {
            initialState.x = 0
          }

          if (direction.includes('Up') || direction === 'top') {
            initialState.y = -distance
          } else if (direction.includes('Down') || direction === 'bottom') {
            initialState.y = distance
          } else {
            initialState.y = 0
          }

          if (!initialState.hasOwnProperty('opacity')) {
            initialState.opacity = config.fromOpacity ?? 0
          }
          break

        case 'scale':
          initialState.scale = config.fromScale ?? 0
          if (!initialState.hasOwnProperty('opacity')) {
            initialState.opacity = config.fromOpacity ?? 0
          }
          break

        case 'rotate':
          initialState.rotate = config.fromRotate ?? 0
          if (!initialState.hasOwnProperty('opacity')) {
            initialState.opacity = config.fromOpacity ?? 0
          }
          break
      }
    })

    return initialState
  }, [effects])

  // 计算目标状态
  const getTargetState = useCallback(() => {
    const targetState: any = {}

    effects.forEach(effect => {
      const { type, config = {} } = effect

      switch (type) {
        case 'opacity':
          targetState.opacity = config.toOpacity ?? 1
          break

        case 'spring':
        case 'slide':
          targetState.x = 0
          targetState.y = 0
          if (!targetState.hasOwnProperty('opacity')) {
            targetState.opacity = config.toOpacity ?? 1
          }
          break

        case 'scale':
          targetState.scale = config.toScale ?? 1
          if (!targetState.hasOwnProperty('opacity')) {
            targetState.opacity = config.toOpacity ?? 1
          }
          break

        case 'rotate':
          targetState.rotate = config.toRotate ?? 0
          if (!targetState.hasOwnProperty('opacity')) {
            targetState.opacity = config.toOpacity ?? 1
          }
          break
      }
    })

    return targetState
  }, [effects])

  // 计算弹簧配置
  const springConfig = useMemo(() => {
    const firstEffect = effects[0]
    if (!firstEffect) return {}

    const config = firstEffect.config || {}

    if (mode === 'linear') {
      return { duration: config.duration || 500 }
    }

    return {
      tension: config.tension || 300,
      friction: config.friction || 10,
      mass: config.mass || 1,
      precision: 0.0001,
    }
  }, [effects, mode])

  const [styles, api] = useSpring(
    () => ({
      from: getInitialState(),
      config: springConfig,
    }),
    [getInitialState, springConfig]
  )

  const startAnimation = useCallback(() => {
    const targetState = getTargetState()

    if (sequence === 'sequential') {
      // 顺序执行动画
      let currentDelay = delay
      effects.forEach((effect, index) => {
        setTimeout(() => {
          api.start({
            to: targetState,
            onRest: index === effects.length - 1 ? onRest : undefined,
          })
        }, currentDelay)
        currentDelay += effect.config?.delay || 200
      })
    } else {
      // 并行执行动画
      setTimeout(() => {
        api.start({
          to: targetState,
          onRest,
        })
      }, delay)
    }
  }, [api, delay, effects, getTargetState, onRest, sequence])

  // 自动启动动画
  useEffect(() => {
    if (autoStart) {
      const timer = setTimeout(() => {
        startAnimation()
      }, globalDelay)
      return () => clearTimeout(timer)
    }
  }, [autoStart, globalDelay, startAnimation])

  // 计算变换样式
  const animatedStyle = useMemo(() => {
    const style: any = {}

    if (styles.opacity) {
      style.opacity = styles.opacity
    }

    const transforms: string[] = []

    if (styles.x || styles.y) {
      const x = styles.x || 0
      const y = styles.y || 0
      transforms.push(`translate3d(${x}px, ${y}px, 0)`)
    }

    if (styles.scale) {
      transforms.push(styles.scale.to((s: number) => `scale(${s})`))
    }

    if (styles.rotate) {
      const rotateAxis = effects.find(e => e.type === 'rotate')?.config?.rotateAxis || 'z'
      transforms.push(styles.rotate.to((r: number) => `rotate${rotateAxis.toUpperCase()}(${r}deg)`))
    }

    if (transforms.length > 0) {
      style.transform = transforms
    }

    return style
  }, [styles, effects])

  const containerClass = useMemo(
    () => `animation-container [will-change:transform,opacity] ${className}`.trim(),
    [className]
  )

  const transformOrigin = useMemo(() => {
    const scaleEffect = effects.find(e => e.type === 'scale')
    const rotateEffect = effects.find(e => e.type === 'rotate')
    return scaleEffect?.config?.transformOrigin || rotateEffect?.config?.transformOrigin || 'center'
  }, [effects])

  return (
    <div className={containerClass} style={{ transformOrigin }}>
      <animated.div style={animatedStyle}>{children}</animated.div>
    </div>
  )
}
