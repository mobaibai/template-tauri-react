import React, { type ReactNode, useCallback, useEffect, useMemo } from 'react'

import { animated, useSpring } from '@react-spring/web'

export type RotateType =
  | 'rotateIn'
  | 'rotateOut'
  | 'rotateInDownLeft'
  | 'rotateInDownRight'
  | 'rotateInUpLeft'
  | 'rotateInUpRight'
  | 'spin'
  | 'flip'
  | 'flipX'
  | 'flipY'

export interface AnimationRotateProps {
  /** 旋转类型 */
  type?: RotateType
  /** 初始旋转角度（度） */
  fromRotate?: number
  /** 目标旋转角度（度） */
  toRotate?: number
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
  /** 旋转轴 */
  rotateAxis?: 'x' | 'y' | 'z'
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
  /** 循环次数（仅对 spin 有效） */
  loop?: number | boolean
  /** 旋转方向（顺时针或逆时针） */
  clockwise?: boolean
}

/**
 * @description 旋转动画组件
 * @param type 旋转类型
 * @param fromRotate 初始旋转角度（度）
 * @param toRotate 目标旋转角度（度）
 * @param duration 动画时长（毫秒）
 * @param tension 张力（仅在 spring 模式下生效）
 * @param friction 摩擦力（仅在 spring 模式下生效）
 * @param mass 质量（仅在 spring 模式下生效）
 * @param mode 动画模式 spring | linear
 * @param fromOpacity 初始透明度
 * @param toOpacity 目标透明度
 * @param transformOrigin 变换原点
 * @param rotateAxis 旋转轴 x | y | z
 * @param children 子元素
 * @param onRest 动画结束回调
 * @param className 自定义类名
 * @param delay 延迟执行时间（毫秒）
 * @param autoStart 是否自动开始动画
 * @param loop 循环次数（仅对 spin 有效）
 * @param clockwise 旋转方向（顺时针或逆时针）
 * @example
 * <AnimationRotate
 *  type='rotateIn'
 *  fromRotate={0}
 *  toRotate={360}
 *  duration={800}
 *  tension={200}
 *  friction={15}
 *  mass={1}
 *  mode='spring'
 *  fromOpacity={0}
 *  toOpacity={1}
 *  transformOrigin='center'
 *  rotateAxis='z'
 *  children={<div>Hello World</div>}
 *  onRest={() => console.log('动画结束')}
 *  className='animation-rotate'
 *  delay={0}
 *  autoStart={true}
 *  loop={false}
 *  clockwise={true}
 * />
 */
export const AnimationRotate: React.FC<AnimationRotateProps> = ({
  type = 'rotateIn',
  fromRotate = 0,
  toRotate = 360,
  duration = 800,
  tension = 200,
  friction = 15,
  mass = 1,
  mode = 'spring',
  fromOpacity = 0,
  toOpacity = 1,
  transformOrigin = 'center',
  rotateAxis = 'z',
  children,
  onRest,
  className = '',
  delay = 0,
  autoStart = true,
  loop = false,
  clockwise = true,
}) => {
  // 根据类型和轴计算旋转变换
  const getRotateTransform = useCallback(
    (angle: number, axis: string = rotateAxis): string => {
      const direction = clockwise ? 1 : -1
      const rotateValue = angle * direction

      switch (axis) {
        case 'x':
          return `rotateX(${rotateValue}deg)`
        case 'y':
          return `rotateY(${rotateValue}deg)`
        case 'z':
        default:
          return `rotateZ(${rotateValue}deg)`
      }
    },
    [rotateAxis, clockwise]
  )

  // 根据类型计算初始和目标变换
  const getTransforms = useMemo(() => {
    const transforms: Record<RotateType, { from: string; to: string; origin?: string }> = {
      rotateIn: {
        from: getRotateTransform(fromRotate - 180),
        to: getRotateTransform(toRotate),
      },
      rotateOut: {
        from: getRotateTransform(fromRotate),
        to: getRotateTransform(toRotate + 180),
      },
      rotateInDownLeft: {
        from: getRotateTransform(-45),
        to: getRotateTransform(0),
        origin: 'left bottom',
      },
      rotateInDownRight: {
        from: getRotateTransform(45),
        to: getRotateTransform(0),
        origin: 'right bottom',
      },
      rotateInUpLeft: {
        from: getRotateTransform(45),
        to: getRotateTransform(0),
        origin: 'left bottom',
      },
      rotateInUpRight: {
        from: getRotateTransform(-90),
        to: getRotateTransform(0),
        origin: 'right bottom',
      },
      spin: {
        from: getRotateTransform(fromRotate),
        to: getRotateTransform(toRotate),
      },
      flip: {
        from: 'rotateY(0deg)',
        to: 'rotateY(180deg)',
      },
      flipX: {
        from: 'rotateX(0deg)',
        to: 'rotateX(180deg)',
      },
      flipY: {
        from: 'rotateY(0deg)',
        to: 'rotateY(180deg)',
      },
    }
    return transforms[type]
  }, [type, fromRotate, toRotate, getRotateTransform])

  const springConfig = useMemo(() => {
    if (mode === 'linear') {
      return { duration }
    }

    // 为不同类型的动画提供不同的弹簧配置
    const configs: Record<RotateType, any> = {
      rotateIn: { tension, friction, mass },
      rotateOut: { tension, friction, mass },
      rotateInDownLeft: { tension: 300, friction: 10, mass: 0.8 },
      rotateInDownRight: { tension: 300, friction: 10, mass: 0.8 },
      rotateInUpLeft: { tension: 300, friction: 10, mass: 0.8 },
      rotateInUpRight: { tension: 300, friction: 10, mass: 0.8 },
      spin: { tension: 150, friction: 20, mass: 1 },
      flip: { tension: 400, friction: 12, mass: 0.9 },
      flipX: { tension: 400, friction: 12, mass: 0.9 },
      flipY: { tension: 400, friction: 12, mass: 0.9 },
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
    if (type === 'spin' && loop) {
      // 连续旋转动画
      api.start({
        to: { transform: getTransforms.to, opacity: toOpacity },
        loop: loop === true ? true : typeof loop === 'number' ? loop : false,
        onRest,
      })
    } else if (type.includes('flip')) {
      // 翻转动画：翻转然后回到原位
      api.start({
        to: async (next: (props: any) => Promise<void>) => {
          await next({ transform: getTransforms.to, opacity: toOpacity })
          if (loop) {
            await next({ transform: getTransforms.from, opacity: toOpacity })
          }
        },
        loop: loop === true ? true : typeof loop === 'number' ? loop : false,
        onRest,
      })
    } else {
      // 普通旋转动画
      api.start({
        to: {
          transform: getTransforms.to,
          opacity: type.includes('Out') ? fromOpacity : toOpacity,
        },
        onRest,
      })
    }
  }, [api, type, getTransforms, fromOpacity, toOpacity, loop, onRest])

  useEffect(() => {
    if (!autoStart) return

    const timer = setTimeout(startAnimation, delay)
    return () => clearTimeout(timer)
  }, [startAnimation, delay, autoStart])

  const containerClass = useMemo(
    () => `animation-rotate [will-change:transform,opacity] ${className}`.trim(),
    [className]
  )

  const containerStyle = useMemo(
    () => ({
      transformOrigin: getTransforms.origin || transformOrigin,
      perspective: type.includes('flip') || rotateAxis !== 'z' ? '1000px' : undefined,
    }),
    [transformOrigin, getTransforms.origin, type, rotateAxis]
  )

  return (
    <div className={containerClass} style={containerStyle}>
      <animated.div style={styles}>{children}</animated.div>
    </div>
  )
}

// 控制器 Hook 已移至 src/hooks/animation/useRotateAnimation.ts
// 请从那里导入 useRotateAnimation
