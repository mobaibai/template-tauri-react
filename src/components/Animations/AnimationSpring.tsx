import React, { type ReactNode, useCallback, useEffect, useMemo } from 'react'

import { animated, useSpring } from '@react-spring/web'

export type SpringDirection =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'

export interface AnimationSpringProps {
  /** 起始方向 */
  direction?: SpringDirection
  /** 移动距离（像素） */
  distance?: number
  /** 张力 */
  tension?: number
  /** 摩擦力 */
  friction?: number
  /** 初始透明度 */
  fromOpacity?: number
  /** 目标透明度 */
  toOpacity?: number
  /** 质量 */
  mass?: number
  /** 动画时长（毫秒，设置后将覆盖弹簧配置） */
  duration?: number
  /** 子元素 */
  children: ReactNode
  /** 动画结束回调 */
  onRest?: () => void
  /** 自定义类名 */
  className?: string
  /** 延迟执行时间（毫秒） */
  delay?: number
  /** 是否启用弹性效果 */
  enableBounce?: boolean
}

/**
 * @description 弹簧动画组件
 * @param direction 起始方向 top | bottom | left | right | topLeft | topRight | bottomLeft | bottomRight
 * @param distance 移动距离（像素）
 * @param tension 张力
 * @param friction 摩擦力
 * @param fromOpacity 初始透明度
 * @param toOpacity 目标透明度
 * @param mass 质量
 * @param duration 动画时长（毫秒，设置后将覆盖弹簧配置）
 * @param children 子元素
 * @param onRest 动画结束回调
 * @param className 自定义类名
 * @param delay 延迟执行时间（毫秒）
 * @param enableBounce 是否启用弹性效果
 * @example
 * <AnimationSpring
 *  direction='top'
 *  distance={30}
 *  tension={300}
 *  friction={10}
 *  fromOpacity={0}
 *  toOpacity={1}
 *  mass={1}
 *  duration={600}
 *  children={<div>Hello World</div>}
 *  onRest={() => console.log('动画结束')}
 *  className='animation-spring'
 *  delay={0}
 *  enableBounce={true}
 * />
 */
export const AnimationSpring: React.FC<AnimationSpringProps> = ({
  direction = 'top',
  distance = 30,
  tension = 300,
  friction = 10,
  fromOpacity = 0,
  toOpacity = 1,
  mass = 1,
  duration,
  children,
  onRest,
  className = '',
  delay = 0,
  enableBounce = true,
}) => {
  // 根据方向计算初始位置
  const getTransform = useCallback(
    (dir: SpringDirection): string => {
      const transforms: Record<SpringDirection, string> = {
        top: `translate3d(0, -${distance}px, 0)`,
        bottom: `translate3d(0, ${distance}px, 0)`,
        left: `translate3d(-${distance}px, 0, 0)`,
        right: `translate3d(${distance}px, 0, 0)`,
        topLeft: `translate3d(-${distance}px, -${distance}px, 0)`,
        topRight: `translate3d(${distance}px, -${distance}px, 0)`,
        bottomLeft: `translate3d(-${distance}px, ${distance}px, 0)`,
        bottomRight: `translate3d(${distance}px, ${distance}px, 0)`,
      }
      return transforms[dir]
    },
    [distance]
  )

  const springConfig = useMemo(() => {
    if (duration) {
      return { duration }
    }

    return {
      tension: enableBounce ? tension : tension * 1.5,
      friction: enableBounce ? friction : friction * 1.5,
      mass,
      precision: 0.0001,
    }
  }, [duration, tension, friction, mass, enableBounce])

  const [styles, api] = useSpring(
    () => ({
      from: {
        opacity: fromOpacity,
        transform: getTransform(direction),
      },
      config: springConfig,
    }),
    [getTransform, direction, fromOpacity, springConfig]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      api.start({
        to: {
          opacity: toOpacity,
          transform: 'translate3d(0, 0, 0)',
        },
        onRest,
      })
    }, delay)

    return () => clearTimeout(timer)
  }, [api, toOpacity, onRest, delay])

  const opacityInterpolation = useMemo(
    () => styles.opacity.to([0, 1], [fromOpacity, toOpacity]),
    [styles.opacity, fromOpacity, toOpacity]
  )

  const containerClass = useMemo(
    () =>
      `animation-spring [will-change:transform,opacity] [transform:translate3d(0,0,0)] ${className}`.trim(),
    [className]
  )

  return (
    <div className={containerClass}>
      <animated.div
        style={{
          opacity: opacityInterpolation,
          transform: styles.transform,
        }}
      >
        {children}
      </animated.div>
    </div>
  )
}

export default AnimationSpring
