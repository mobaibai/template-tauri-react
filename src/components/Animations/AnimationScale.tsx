import React, { type ReactNode, useCallback, useEffect, useMemo } from 'react'

import { animated, useSpring } from '@react-spring/web'

export type ScaleType =
  | 'scaleIn'
  | 'scaleOut'
  | 'scaleInX'
  | 'scaleInY'
  | 'scaleOutX'
  | 'scaleOutY'
  | 'pulse'
  | 'bounce'

export interface AnimationScaleProps {
  /** 缩放类型 */
  type?: ScaleType
  /** 初始缩放比例 */
  fromScale?: number
  /** 目标缩放比例 */
  toScale?: number
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
  /** 初始透明度 */
  fromOpacity?: number
  /** 目标透明度 */
  toOpacity?: number
  /** 变换原点 */
  transformOrigin?: string
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
  /** 循环次数（仅对 pulse 和 bounce 有效） */
  loop?: number | boolean
}

/**
 * @description 缩放动画组件
 * @param type 缩放类型 scaleIn | scaleOut | scaleInX | scaleInY | scaleOutX | scaleOutY | pulse | bounce
 * @param fromScale 初始缩放比例
 * @param toScale 目标缩放比例
 * @param duration 动画时长（毫秒）
 * @param tension 张力（仅在 spring 模式下生效）
 * @param friction 摩擦力（仅在 spring 模式下生效）
 * @param mass 质量（仅在 spring 模式下生效）
 * @param mode 动画模式 spring | linear
 * @param fromOpacity 初始透明度
 * @param toOpacity 目标透明度
 * @param transformOrigin 变换原点
 * @param children 子元素
 * @param onRest 动画结束回调
 * @param className 自定义类名
 * @param delay 延迟执行时间（毫秒）
 * @param autoStart 是否自动开始动画
 * @param loop 循环次数（仅对 pulse 和 bounce 有效）
 * @example
 * <AnimationScale
 *  type='scaleIn'
 *  fromScale={0}
 *  toScale={1}
 *  duration={500}
 *  tension={300}
 *  friction={10}
 *  mass={1}
 *  mode='spring'
 *  fromOpacity={0}
 *  toOpacity={1}
 *  transformOrigin='center'
 *  children={<div>Hello World</div>}
 *  onRest={() => console.log('动画结束')}
 *  className='animation-scale'
 *  delay={0}
 *  autoStart={true}
 *  loop={false}
 * />
 */
export const AnimationScale: React.FC<AnimationScaleProps> = ({
  type = 'scaleIn',
  fromScale = 0,
  toScale = 1,
  duration = 500,
  tension = 300,
  friction = 10,
  mass = 1,
  mode = 'spring',
  fromOpacity = 0,
  toOpacity = 1,
  transformOrigin = 'center',
  children,
  onRest,
  className = '',
  delay = 0,
  autoStart = true,
  loop = false,
}) => {
  // 根据类型计算初始和目标变换
  const getTransforms = useMemo(() => {
    const transforms: Record<ScaleType, { from: string; to: string }> = {
      scaleIn: {
        from: `scale(${fromScale})`,
        to: `scale(${toScale})`,
      },
      scaleOut: {
        from: `scale(${toScale})`,
        to: `scale(${fromScale})`,
      },
      scaleInX: {
        from: `scaleX(${fromScale})`,
        to: `scaleX(${toScale})`,
      },
      scaleInY: {
        from: `scaleY(${fromScale})`,
        to: `scaleY(${toScale})`,
      },
      scaleOutX: {
        from: `scaleX(${toScale})`,
        to: `scaleX(${fromScale})`,
      },
      scaleOutY: {
        from: `scaleY(${toScale})`,
        to: `scaleY(${fromScale})`,
      },
      pulse: {
        from: `scale(${toScale})`,
        to: `scale(${toScale * 1.1})`,
      },
      bounce: {
        from: `scale(${fromScale})`,
        to: `scale(${toScale})`,
      },
    }
    return transforms[type]
  }, [type, fromScale, toScale])

  const springConfig = useMemo(() => {
    if (mode === 'linear') {
      return { duration }
    }

    // 为不同类型的动画提供不同的弹簧配置
    const configs: Record<ScaleType, any> = {
      scaleIn: { tension, friction, mass },
      scaleOut: { tension, friction, mass },
      scaleInX: { tension, friction, mass },
      scaleInY: { tension, friction, mass },
      scaleOutX: { tension, friction, mass },
      scaleOutY: { tension, friction, mass },
      pulse: { tension: 400, friction: 8, mass: 0.8 },
      bounce: { tension: 600, friction: 8, mass: 1.2 },
    }

    return {
      ...configs[type],
      precision: 0.0001,
    }
  }, [mode, duration, tension, friction, mass, type])

  const [styles, api]: any = useSpring(
    () => ({
      from: {
        transform: getTransforms.from,
        opacity: type.includes('Out') ? toOpacity : fromOpacity,
      },
      config: springConfig,
    }),
    [getTransforms.from, type, fromOpacity, toOpacity, springConfig]
  )

  const startAnimation = useCallback(() => {
    if (type === 'pulse') {
      // 脉冲动画：放大然后缩小
      api.start({
        to: async (next: (props: { transform: string; opacity: number }) => Promise<void>) => {
          await next({ transform: getTransforms.to, opacity: toOpacity })
          await next({ transform: getTransforms.from, opacity: toOpacity })
        },
        loop: loop === true ? true : typeof loop === 'number' ? loop : false,
        onRest,
      })
    } else if (type === 'bounce') {
      // 弹跳动画：多次弹跳效果
      api.start({
        to: async (next: (props: { transform: string; opacity: number }) => Promise<void>) => {
          await next({
            transform: `scale(${toScale * 1.2})`,
            opacity: toOpacity,
          })
          await next({
            transform: `scale(${toScale * 0.9})`,
            opacity: toOpacity,
          })
          await next({ transform: getTransforms.to, opacity: toOpacity })
        },
        onRest,
      })
    } else {
      // 普通缩放动画
      api.start({
        to: {
          transform: getTransforms.to,
          opacity: type.includes('Out') ? fromOpacity : toOpacity,
        },
        onRest,
      })
    }
  }, [api, type, getTransforms, fromOpacity, toOpacity, toScale, loop, onRest])

  useEffect(() => {
    if (!autoStart) return

    const timer = setTimeout(startAnimation, delay)
    return () => clearTimeout(timer)
  }, [startAnimation, delay, autoStart])

  const containerClass = useMemo(
    () => `animation-scale [will-change:transform,opacity] ${className}`.trim(),
    [className]
  )

  const containerStyle = useMemo(
    () => ({
      transformOrigin,
    }),
    [transformOrigin]
  )

  return (
    <div className={containerClass} style={containerStyle}>
      <animated.div style={styles}>{children}</animated.div>
    </div>
  )
}
