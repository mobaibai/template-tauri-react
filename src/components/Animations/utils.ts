import type { SpringConfig } from '@react-spring/web'

// 预定义的缓动函数
export const easingFunctions = {
  // 标准缓动
  linear: (t: number) => t,
  ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
  easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',

  // 自定义缓动
  easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',

  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',

  easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',

  // 弹性缓动
  easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const

// 预定义的弹簧配置
export const springConfigs = {
  // 基础配置
  default: { tension: 170, friction: 26, mass: 1 },
  gentle: { tension: 120, friction: 14, mass: 1 },
  wobbly: { tension: 180, friction: 12, mass: 1 },
  stiff: { tension: 210, friction: 20, mass: 1 },
  slow: { tension: 280, friction: 60, mass: 1 },
  molasses: { tension: 280, friction: 120, mass: 1 },

  // 专用配置
  bounce: { tension: 300, friction: 8, mass: 1.2 },
  elastic: { tension: 400, friction: 10, mass: 0.8 },
  smooth: { tension: 250, friction: 30, mass: 1 },
  snappy: { tension: 500, friction: 15, mass: 0.8 },

  // 入场动画配置
  fadeIn: { tension: 200, friction: 20, mass: 1 },
  slideIn: { tension: 300, friction: 15, mass: 1 },
  scaleIn: { tension: 350, friction: 12, mass: 0.9 },
  rotateIn: { tension: 250, friction: 18, mass: 1 },

  // 出场动画配置
  fadeOut: { tension: 300, friction: 25, mass: 1 },
  slideOut: { tension: 400, friction: 20, mass: 1 },
  scaleOut: { tension: 450, friction: 15, mass: 0.8 },
  rotateOut: { tension: 350, friction: 22, mass: 1 },
} as const

// 动画持续时间预设
export const durations = {
  instant: 0,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800,
  slowest: 1200,
} as const

// 延迟时间预设
export const delays = {
  none: 0,
  short: 100,
  medium: 300,
  long: 500,
  longer: 800,
} as const

/**
 * 创建弹簧配置
 * @param preset 预设名称
 * @param overrides 覆盖配置
 * @returns 弹簧配置对象
 */
export const createSpringConfig = (
  preset: keyof typeof springConfigs = 'default',
  overrides: Partial<SpringConfig> = {}
): SpringConfig => {
  return {
    ...springConfigs[preset],
    ...overrides,
    precision: 0.0001,
  }
}

/**
 * 创建线性动画配置
 * @param duration 持续时间
 * @param easing 缓动函数
 * @returns 线性动画配置对象
 */
export const createLinearConfig = (
  duration: number | keyof typeof durations = 'normal',
  easing: string | keyof typeof easingFunctions = 'ease'
): SpringConfig => {
  const durationValue = typeof duration === 'number' ? duration : durations[duration]
  const easingValue =
    typeof easing === 'string' && easing.includes('cubic-bezier')
      ? easing
      : easingFunctions[easing as keyof typeof easingFunctions] || easingFunctions.ease

  return {
    duration: durationValue,
    easing: typeof easingValue === 'function' ? easingValue : (t: number) => t,
  }
}

/**
 * 计算变换字符串
 * @param transforms 变换对象
 * @returns 变换字符串
 */
export const createTransform = (transforms: {
  x?: number
  y?: number
  z?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  rotate?: number
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  skew?: number
  skewX?: number
  skewY?: number
}): string => {
  const transformParts: string[] = []

  // 位移
  if (transforms.x !== undefined || transforms.y !== undefined || transforms.z !== undefined) {
    const x = transforms.x || 0
    const y = transforms.y || 0
    const z = transforms.z || 0
    transformParts.push(`translate3d(${x}px, ${y}px, ${z}px)`)
  }

  // 缩放
  if (transforms.scale !== undefined) {
    transformParts.push(`scale(${transforms.scale})`)
  }
  if (transforms.scaleX !== undefined) {
    transformParts.push(`scaleX(${transforms.scaleX})`)
  }
  if (transforms.scaleY !== undefined) {
    transformParts.push(`scaleY(${transforms.scaleY})`)
  }

  // 旋转
  if (transforms.rotate !== undefined) {
    transformParts.push(`rotate(${transforms.rotate}deg)`)
  }
  if (transforms.rotateX !== undefined) {
    transformParts.push(`rotateX(${transforms.rotateX}deg)`)
  }
  if (transforms.rotateY !== undefined) {
    transformParts.push(`rotateY(${transforms.rotateY}deg)`)
  }
  if (transforms.rotateZ !== undefined) {
    transformParts.push(`rotateZ(${transforms.rotateZ}deg)`)
  }

  // 倾斜
  if (transforms.skew !== undefined) {
    transformParts.push(`skew(${transforms.skew}deg)`)
  }
  if (transforms.skewX !== undefined) {
    transformParts.push(`skewX(${transforms.skewX}deg)`)
  }
  if (transforms.skewY !== undefined) {
    transformParts.push(`skewY(${transforms.skewY}deg)`)
  }

  return transformParts.join(' ')
}

/**
 * 创建交错动画延迟
 * @param index 元素索引
 * @param baseDelay 基础延迟
 * @param increment 递增延迟
 * @returns 计算后的延迟时间
 */
export const createStaggerDelay = (
  index: number,
  baseDelay: number = 0,
  increment: number = 100
): number => {
  return baseDelay + index * increment
}

/**
 * 创建随机延迟
 * @param min 最小延迟
 * @param max 最大延迟
 * @returns 随机延迟时间
 */
export const createRandomDelay = (min: number = 0, max: number = 500): number => {
  return Math.random() * (max - min) + min
}

/**
 * 插值函数
 * @param from 起始值
 * @param to 结束值
 * @param progress 进度 (0-1)
 * @returns 插值结果
 */
export const interpolate = (from: number, to: number, progress: number): number => {
  return from + (to - from) * progress
}

/**
 * 将角度转换为弧度
 * @param degrees 角度
 * @returns 弧度
 */
export const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180
}

/**
 * 将弧度转换为角度
 * @param radians 弧度
 * @returns 角度
 */
export const radiansToDegrees = (radians: number): number => {
  return (radians * 180) / Math.PI
}

/**
 * 限制数值在指定范围内
 * @param value 数值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的数值
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * 检测是否支持硬件加速
 * @returns 是否支持硬件加速
 */
export const supportsHardwareAcceleration = (): boolean => {
  if (typeof window === 'undefined') return false

  const testElement = document.createElement('div')
  testElement.style.transform = 'translateZ(0)'
  testElement.style.willChange = 'transform'

  return testElement.style.transform !== ''
}

/**
 * 获取元素的边界信息
 * @param element DOM 元素
 * @returns 边界信息
 */
export const getElementBounds = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  }
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
