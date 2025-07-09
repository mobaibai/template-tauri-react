import type { AnimationEffect } from './AnimationContainer'
import type { AnimationStep } from './AnimationSequence'
import { delays, durations, springConfigs } from './utils'

// 入场动画预设
export const entranceAnimations = {
  // 淡入效果
  fadeIn: {
    type: 'opacity' as const,
    config: {
      fromOpacity: 0,
      toOpacity: 1,
      duration: durations.normal,
    },
  },

  fadeInUp: [
    {
      type: 'opacity' as const,
      config: { fromOpacity: 0, toOpacity: 1 },
    },
    {
      type: 'spring' as const,
      config: {
        direction: 'bottom' as const,
        distance: 30,
        ...springConfigs.slideIn,
      },
    },
  ],

  fadeInDown: [
    {
      type: 'opacity' as const,
      config: { fromOpacity: 0, toOpacity: 1 },
    },
    {
      type: 'spring' as const,
      config: {
        direction: 'top' as const,
        distance: 30,
        ...springConfigs.slideIn,
      },
    },
  ],

  fadeInLeft: [
    {
      type: 'opacity' as const,
      config: { fromOpacity: 0, toOpacity: 1 },
    },
    {
      type: 'spring' as const,
      config: {
        direction: 'left' as const,
        distance: 30,
        ...springConfigs.slideIn,
      },
    },
  ],

  fadeInRight: [
    {
      type: 'opacity' as const,
      config: { fromOpacity: 0, toOpacity: 1 },
    },
    {
      type: 'spring' as const,
      config: {
        direction: 'right' as const,
        distance: 30,
        ...springConfigs.slideIn,
      },
    },
  ],

  // 滑入效果
  slideInUp: {
    type: 'slide' as const,
    config: {
      direction: 'slideInUp' as const,
      distance: 50,
      duration: durations.normal,
    },
  },

  slideInDown: {
    type: 'slide' as const,
    config: {
      direction: 'slideInDown' as const,
      distance: 50,
      duration: durations.normal,
    },
  },

  slideInLeft: {
    type: 'slide' as const,
    config: {
      direction: 'slideInLeft' as const,
      distance: 50,
      duration: durations.normal,
    },
  },

  slideInRight: {
    type: 'slide' as const,
    config: {
      direction: 'slideInRight' as const,
      distance: 50,
      duration: durations.normal,
    },
  },

  // 缩放效果
  zoomIn: {
    type: 'scale' as const,
    config: {
      scaleType: 'scaleIn' as const,
      fromScale: 0,
      toScale: 1,
      fromOpacity: 0,
      toOpacity: 1,
      ...springConfigs.scaleIn,
    },
  },

  zoomInUp: [
    {
      type: 'scale' as const,
      config: {
        scaleType: 'scaleIn' as const,
        fromScale: 0.6,
        toScale: 1,
        fromOpacity: 0,
        toOpacity: 1,
      },
    },
    {
      type: 'spring' as const,
      config: {
        direction: 'bottom' as const,
        distance: 60,
        ...springConfigs.bounce,
      },
    },
  ],

  // 旋转效果
  rotateIn: {
    type: 'rotate' as const,
    config: {
      rotateType: 'rotateIn' as const,
      fromRotate: -200,
      toRotate: 0,
      fromOpacity: 0,
      toOpacity: 1,
      ...springConfigs.rotateIn,
    },
  },

  // 弹跳效果
  bounceIn: {
    type: 'scale' as const,
    config: {
      scaleType: 'bounce' as const,
      fromScale: 0.3,
      toScale: 1,
      fromOpacity: 0,
      toOpacity: 1,
      ...springConfigs.bounce,
    },
  },

  // 弹性效果
  elasticIn: [
    {
      type: 'scale' as const,
      config: {
        scaleType: 'scaleIn' as const,
        fromScale: 0,
        toScale: 1,
        ...springConfigs.elastic,
      },
    },
    {
      type: 'opacity' as const,
      config: {
        fromOpacity: 0,
        toOpacity: 1,
      },
    },
  ],
} as const

// 出场动画预设
export const exitAnimations = {
  // 淡出效果
  fadeOut: {
    type: 'opacity' as const,
    config: {
      fromOpacity: 1,
      toOpacity: 0,
      duration: durations.normal,
    },
  },

  fadeOutUp: [
    {
      type: 'opacity' as const,
      config: { fromOpacity: 1, toOpacity: 0 },
    },
    {
      type: 'spring' as const,
      config: {
        direction: 'top' as const,
        distance: 30,
        ...springConfigs.slideOut,
      },
    },
  ],

  fadeOutDown: [
    {
      type: 'opacity' as const,
      config: { fromOpacity: 1, toOpacity: 0 },
    },
    {
      type: 'spring' as const,
      config: {
        direction: 'bottom' as const,
        distance: 30,
        ...springConfigs.slideOut,
      },
    },
  ],

  // 滑出效果
  slideOutUp: {
    type: 'slide' as const,
    config: {
      direction: 'slideOutUp' as const,
      distance: 50,
      duration: durations.normal,
    },
  },

  slideOutDown: {
    type: 'slide' as const,
    config: {
      direction: 'slideOutDown' as const,
      distance: 50,
      duration: durations.normal,
    },
  },

  // 缩放出场
  zoomOut: {
    type: 'scale' as const,
    config: {
      scaleType: 'scaleOut' as const,
      fromScale: 1,
      toScale: 0,
      fromOpacity: 1,
      toOpacity: 0,
      ...springConfigs.scaleOut,
    },
  },

  // 旋转出场
  rotateOut: {
    type: 'rotate' as const,
    config: {
      rotateType: 'rotateOut' as const,
      fromRotate: 0,
      toRotate: 200,
      fromOpacity: 1,
      toOpacity: 0,
      ...springConfigs.rotateOut,
    },
  },
} as const

// 注意力动画预设
export const attentionAnimations = {
  // 脉冲效果
  pulse: {
    type: 'scale' as const,
    config: {
      scaleType: 'pulse' as const,
      fromScale: 1,
      toScale: 1.05,
      loop: true,
      ...springConfigs.bounce,
    },
  },

  // 摇摆效果
  wobble: {
    type: 'rotate' as const,
    config: {
      rotateType: 'spin' as const,
      fromRotate: -5,
      toRotate: 5,
      loop: true,
      ...springConfigs.wobbly,
    },
  },

  // 震动效果
  shake: [
    {
      type: 'spring' as const,
      config: {
        direction: 'left' as const,
        distance: 10,
        ...springConfigs.stiff,
      },
    },
  ],

  // 心跳效果
  heartBeat: {
    type: 'scale' as const,
    config: {
      scaleType: 'pulse' as const,
      fromScale: 1,
      toScale: 1.3,
      loop: true,
      ...springConfigs.bounce,
    },
  },

  // 闪烁效果
  flash: {
    type: 'opacity' as const,
    config: {
      fromOpacity: 1,
      toOpacity: 0,
      loop: true,
      duration: durations.fast,
    },
  },
} as const

// 复杂动画序列预设
export const sequenceAnimations = {
  // 打字机效果
  typewriter: [
    {
      name: 'start',
      to: { opacity: 0, scale: 0.8 },
      config: { duration: 0 },
    },
    {
      name: 'fadeIn',
      to: { opacity: 1 },
      config: springConfigs.fadeIn,
      delay: delays.short,
    },
    {
      name: 'scaleUp',
      to: { scale: 1 },
      config: springConfigs.elastic,
      delay: delays.short,
    },
  ] as AnimationStep[],

  // 弹跳入场
  bounceEntrance: [
    {
      name: 'prepare',
      to: { opacity: 0, y: -60, scale: 0.3 },
      config: { duration: 0 },
    },
    {
      name: 'drop',
      to: { opacity: 1, y: 20, scale: 1.1 },
      config: springConfigs.bounce,
      delay: delays.short,
    },
    {
      name: 'settle',
      to: { y: -10, scale: 0.95 },
      config: springConfigs.gentle,
      delay: delays.short,
    },
    {
      name: 'final',
      to: { y: 0, scale: 1 },
      config: springConfigs.smooth,
      delay: delays.short,
    },
  ] as AnimationStep[],

  // 翻转卡片
  flipCard: [
    {
      name: 'prepare',
      to: { rotateY: 0, opacity: 1 },
      config: { duration: 0 },
    },
    {
      name: 'flipOut',
      to: { rotateY: 90, opacity: 0.5 },
      config: springConfigs.snappy,
      delay: delays.short,
    },
    {
      name: 'flipIn',
      to: { rotateY: 0, opacity: 1 },
      config: springConfigs.elastic,
      delay: delays.short,
    },
  ] as AnimationStep[],

  // 滑动展开
  slideReveal: [
    {
      name: 'hidden',
      to: { x: -100, opacity: 0, scale: 0.8 },
      config: { duration: 0 },
    },
    {
      name: 'slideIn',
      to: { x: 0, opacity: 0.7 },
      config: springConfigs.slideIn,
      delay: delays.short,
    },
    {
      name: 'scaleUp',
      to: { scale: 1, opacity: 1 },
      config: springConfigs.elastic,
      delay: delays.medium,
    },
  ] as AnimationStep[],

  // 呼吸效果
  breathing: [
    {
      name: 'inhale',
      to: { scale: 1.1, opacity: 0.8 },
      config: springConfigs.gentle,
      delay: delays.none,
    },
    {
      name: 'exhale',
      to: { scale: 1, opacity: 1 },
      config: springConfigs.gentle,
      delay: delays.long,
    },
  ] as AnimationStep[],
} as const

// 交错动画预设
export const staggerAnimations = {
  // 列表项依次出现
  listItems: {
    baseDelay: delays.none,
    increment: delays.short,
    animation: entranceAnimations.fadeInUp,
  },

  // 卡片网格
  cardGrid: {
    baseDelay: delays.short,
    increment: delays.short,
    animation: entranceAnimations.zoomIn,
  },

  // 导航菜单
  navigation: {
    baseDelay: delays.medium,
    increment: delays.short,
    animation: entranceAnimations.slideInLeft,
  },

  // 图片画廊
  gallery: {
    baseDelay: delays.short,
    increment: delays.short,
    animation: entranceAnimations.fadeIn,
  },
} as const

// 页面转场动画预设
export const pageTransitions = {
  // 淡入淡出
  fade: {
    enter: entranceAnimations.fadeIn,
    exit: exitAnimations.fadeOut,
  },

  // 滑动
  slide: {
    enter: entranceAnimations.slideInRight,
    exit: {
      type: 'slide' as const,
      config: {
        direction: 'slideOutDown' as const,
        distance: 50,
        duration: durations.normal,
      },
    },
  },

  // 缩放
  scale: {
    enter: entranceAnimations.zoomIn,
    exit: exitAnimations.zoomOut,
  },

  // 旋转
  rotate: {
    enter: entranceAnimations.rotateIn,
    exit: exitAnimations.rotateOut,
  },
} as const

// 响应式动画预设（根据屏幕尺寸调整）
export const responsiveAnimations = {
  mobile: {
    distance: 20,
    duration: durations.fast,
    springConfig: springConfigs.gentle,
  },
  tablet: {
    distance: 30,
    duration: durations.normal,
    springConfig: springConfigs.default,
  },
  desktop: {
    distance: 40,
    duration: durations.normal,
    springConfig: springConfigs.elastic,
  },
} as const

/**
 * 根据动画名称获取预设配置
 * @param category 动画类别
 * @param name 动画名称
 * @returns 动画配置
 */
export const getAnimationPreset = (
  category: 'entrance' | 'exit' | 'attention' | 'sequence' | 'stagger' | 'transition',
  name: string
) => {
  const presets = {
    entrance: entranceAnimations,
    exit: exitAnimations,
    attention: attentionAnimations,
    sequence: sequenceAnimations,
    stagger: staggerAnimations,
    transition: pageTransitions,
  }

  return presets[category]?.[name as keyof (typeof presets)[typeof category]]
}

/**
 * 创建交错动画配置
 * @param count 元素数量
 * @param baseAnimation 基础动画
 * @param staggerConfig 交错配置
 * @returns 交错动画配置数组
 */
export const createStaggerConfig = (
  count: number,
  baseAnimation: AnimationEffect | AnimationEffect[],
  staggerConfig: {
    baseDelay?: number
    increment?: number
    reverse?: boolean
  } = {}
) => {
  const { baseDelay = 0, increment = 100, reverse = false } = staggerConfig
  const configs: Array<{
    animation: AnimationEffect | AnimationEffect[]
    delay: number
  }> = []

  for (let i = 0; i < count; i++) {
    const index = reverse ? count - 1 - i : i
    const delay = baseDelay + index * increment

    configs.push({
      animation: baseAnimation,
      delay,
    })
  }

  return configs
}
