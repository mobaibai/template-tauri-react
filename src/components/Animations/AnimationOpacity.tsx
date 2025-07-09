import React, { type ReactNode, useEffect, useMemo } from 'react'

import { animated, useSpring } from '@react-spring/web'

export interface AnimationOpacityProps {
  /** 初始透明度 */
  fromOpacity?: number
  /** 目标透明度 */
  toOpacity?: number
  /** 动画时长（毫秒） */
  duration?: number
  /** 动画模式 */
  mode?: 'spring' | 'linear'
  /** 张力（仅在 spring 模式下生效） */
  tension?: number
  /** 摩擦力（仅在 spring 模式下生效） */
  friction?: number
  /** 质量（仅在 spring 模式下生效） */
  mass?: number
  /** 动画结束回调 */
  onRest?: () => void
  /** 子元素 */
  children: ReactNode
  /** 自定义类名 */
  className?: string
  /** 是否启用硬件加速 */
  enableHardwareAcceleration?: boolean
  /** 延迟执行时间（毫秒） */
  delay?: number
}

/**
 * @description 透明度动画组件
 * @param fromOpacity 初始透明度 (0-1)
 * @param toOpacity 目标透明度 (0-1)
 * @param duration 动画时长（毫秒）
 * @param mode 动画模式 spring | linear
 * @param tension 张力（仅在 spring 模式下生效）
 * @param friction 摩擦力（仅在 spring 模式下生效）
 * @param mass 质量（仅在 spring 模式下生效）
 * @param onRest 动画结束回调
 * @param children 子元素
 * @param className 自定义类名
 * @param enableHardwareAcceleration 是否启用硬件加速
 * @param delay 延迟执行时间（毫秒）
 * @example
 * <AnimationOpacity
 *  fromOpacity={0}
 *  toOpacity={1}
 *  duration={500}
 *  mode='linear'
 *  tension={170}
 *  friction={12}
 *  mass={1}
 *  onRest={() => console.log('动画结束')}
 *  className='animation-opacity'
 *  enableHardwareAcceleration={true}
 *  delay={0}
 *  children={<div>Hello World</div>}
 * />
 */
export const AnimationOpacity: React.FC<AnimationOpacityProps> = ({
  fromOpacity = 0,
  toOpacity = 1,
  duration = 500,
  mode = 'linear',
  tension = 170,
  friction = 12,
  mass = 1,
  children,
  onRest,
  className = '',
  enableHardwareAcceleration = true,
  delay = 0,
}) => {
  const [styles, api] = useSpring(
    () => ({
      from: { opacity: fromOpacity },
      config: mode === 'spring' ? { tension, friction, mass, precision: 0.0001 } : { duration },
    }),
    [fromOpacity, mode, tension, friction, mass, duration]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      api.start({
        to: { opacity: toOpacity },
        onRest,
      })
    }, delay)

    return () => clearTimeout(timer)
  }, [api, toOpacity, onRest, delay])

  const optimizedStyles = useMemo(
    () => ({
      ...styles,
      ...(enableHardwareAcceleration && {
        transform: styles.opacity.to(o => `translateZ(0) scale(${0.95 + o * 0.05})`),
      }),
    }),
    [styles, enableHardwareAcceleration]
  )

  const containerClass = useMemo(
    () =>
      `animation-opacity ${enableHardwareAcceleration ? '[will-change:opacity,transform]' : '[will-change:opacity]'} relative ${className}`.trim(),
    [className, enableHardwareAcceleration]
  )

  return (
    <div className={containerClass}>
      <animated.div style={optimizedStyles}>{children}</animated.div>
    </div>
  )
}

export default AnimationOpacity
