// 动画组件统一导出
export { AnimationContainer } from './AnimationContainer'
export { AnimationOpacity } from './AnimationOpacity'
export { AnimationRotate, useRotateAnimation } from './AnimationRotate'
export { AnimationScale, useScaleAnimation } from './AnimationScale'
export { AnimationSequence, useAnimationSequence } from './AnimationSequence'
export { AnimationSlide, useSlideAnimation } from './AnimationSlide'
export { AnimationSpring } from './AnimationSpring'

// 动画工具函数
export {
  clamp,
  createLinearConfig,
  createRandomDelay,
  createSpringConfig,
  createStaggerDelay,
  createTransform,
  debounce,
  getElementBounds,
  interpolate,
  throttle,
} from './utils'

// 预设动画配置
export { delays, durations, easingFunctions, springConfigs } from './utils'

// 动画预设
export {
  attentionAnimations,
  createStaggerConfig,
  entranceAnimations,
  exitAnimations,
  getAnimationPreset,
  pageTransitions,
  responsiveAnimations,
  sequenceAnimations,
  staggerAnimations,
} from './presets'

// 动画示例组件
export { AnimationExamples } from './examples'
