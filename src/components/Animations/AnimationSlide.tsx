import React, { type ReactNode, useEffect, useMemo } from 'react'

import { animated, useSpring } from '@react-spring/web'

export type SlideDirection =
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideInUp'
  | 'slideInDown'
  | 'slideOutLeft'
  | 'slideOutRight'
  | 'slideOutUp'
  | 'slideOutDown'

export interface AnimationSlideProps {
  /** 滑动方向和类型 */
  direction?: SlideDirection
  /** 滑动距离（像素） */
  distance?: number
  /** 动画时长（毫秒） */
  duration?: number
  /** 张力（仅在 spring 模式下生效） */
  tension?: number
  /** 摩擦力（仅在 spring 模式下生效） */
  friction?: number
  /** 质量（仅在 spring 模式下生效） */
  mass?: number
  /** 动画模式 */
  mode?: 'spring' | 'linear'
  /** 缓动函数 */
  easing?: string
  /** 子元素 */
  children: ReactNode
  /** 动画结束回调 */
  onRest?: () => void
  /** 自定义类名 */
  className?: string
  /** 延迟执行时间（毫秒） */
  delay?: number
  /** 是否自动开始动画 */
  autoStart?: boolean
}

/**
 * @description 滑动动画组件
 * @param direction 滑动方向和类型
 * @param distance 滑动距离（像素）
 * @param duration 动画时长（毫秒）
 * @param tension 张力（仅在 spring 模式下生效）
 * @param friction 摩擦力（仅在 spring 模式下生效）
 * @param mass 质量（仅在 spring 模式下生效）
 * @param mode 动画模式 spring | linear
 * @param easing 缓动函数
 * @param children 子元素
 * @param onRest 动画结束回调
 * @param className 自定义类名
 * @param delay 延迟执行时间（毫秒）
 * @param autoStart 是否自动开始动画
 * @example
 * <AnimationSlide
 *  direction='slideInLeft'
 *  distance={100}
 *  duration={600}
 *  tension={280}
 *  friction={20}
 *  mass={1}
 *  mode='spring'
 *  easing='cubic-bezier(0.25, 0.46, 0.45, 0.94)'
 *  children={<div>Hello World</div>}
 *  onRest={() => console.log('动画结束')}
 *  className='animation-slide'
 *  delay={0}
 *  autoStart={true}
 * />
 */
export const AnimationSlide: React.FC<AnimationSlideProps> = ({
  direction = 'slideInLeft',
  distance = 100,
  duration = 600,
  tension = 280,
  friction = 20,
  mass = 1,
  mode = 'spring',
  easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  children,
  onRest,
  className = '',
  delay = 0,
  autoStart = true,
}) => {
  // 计算初始和目标位置
  const getTransforms = useMemo(() => {
    // const isSlideIn = direction.includes('In')
    const transforms: Record<SlideDirection, { from: string; to: string }> = {
      slideInLeft: {
        from: `translate3d(-${distance}px, 0, 0)`,
        to: 'translate3d(0, 0, 0)',
      },
      slideInRight: {
        from: `translate3d(${distance}px, 0, 0)`,
        to: 'translate3d(0, 0, 0)',
      },
      slideInUp: {
        from: `translate3d(0, ${distance}px, 0)`,
        to: 'translate3d(0, 0, 0)',
      },
      slideInDown: {
        from: `translate3d(0, -${distance}px, 0)`,
        to: 'translate3d(0, 0, 0)',
      },
      slideOutLeft: {
        from: 'translate3d(0, 0, 0)',
        to: `translate3d(-${distance}px, 0, 0)`,
      },
      slideOutRight: {
        from: 'translate3d(0, 0, 0)',
        to: `translate3d(${distance}px, 0, 0)`,
      },
      slideOutUp: {
        from: 'translate3d(0, 0, 0)',
        to: `translate3d(0, -${distance}px, 0)`,
      },
      slideOutDown: {
        from: 'translate3d(0, 0, 0)',
        to: `translate3d(0, ${distance}px, 0)`,
      },
    }
    return transforms[direction]
  }, [direction, distance])

  const springConfig = useMemo(() => {
    if (mode === 'linear') {
      return {
        duration,
        easing,
      }
    }
    return {
      tension,
      friction,
      mass,
      precision: 0.0001,
    }
  }, [mode, duration, easing, tension, friction, mass])

  const [styles, api] = useSpring(
    () => ({
      from: {
        transform: getTransforms.from,
        opacity: direction.includes('Out') ? 1 : 0,
      },
      config: springConfig,
    }),
    [getTransforms.from, direction, springConfig]
  )

  useEffect(() => {
    if (!autoStart) return

    const timer = setTimeout(() => {
      api.start({
        to: {
          transform: getTransforms.to,
          opacity: direction.includes('Out') ? 0 : 1,
        },
        onRest,
      })
    }, delay)

    return () => clearTimeout(timer)
  }, [api, getTransforms.to, direction, onRest, delay, autoStart])

  const containerClass = useMemo(
    () => `animation-slide [will-change:transform,opacity] overflow-hidden ${className}`.trim(),
    [className]
  )

  return (
    <div className={containerClass}>
      <animated.div style={styles}>{children}</animated.div>
    </div>
  )
}

// 控制器 Hook 已移至 src/hooks/animation/useSlideAnimation.ts
// 请从那里导入 useSlideAnimation

export default AnimationSlide
