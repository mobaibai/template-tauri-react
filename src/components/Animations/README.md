# React Spring 动画组件库

基于 `@react-spring/web`
构建的高性能、易用的 React 动画组件库，提供丰富的动画效果和灵活的配置选项。

## 🚀 特性

- **高性能**: 基于 `@react-spring/web`，利用硬件加速和优化的渲染机制
- **TypeScript 支持**: 完整的类型定义，提供优秀的开发体验
- **组件化设计**: 每个动画效果都是独立的组件，易于使用和维护
- **丰富的预设**: 提供多种预设动画效果，开箱即用
- **灵活配置**: 支持自定义动画参数，满足各种需求
- **组合动画**: 支持多种动画效果的组合和序列执行
- **响应式**: 支持根据屏幕尺寸调整动画参数

## 📦 安装

确保项目中已安装 `@react-spring/web`：

```bash
npm install @react-spring/web
# 或
pnpm add @react-spring/web
```

## 🎯 快速开始

### 基础用法

```tsx
import { AnimationOpacity, AnimationSpring } from '@/components/animations'

// 透明度动画
<AnimationOpacity fromOpacity={0} toOpacity={1} duration={500}>
  <div>淡入效果</div>
</AnimationOpacity>

// 弹簧动画
<AnimationSpring direction="top" distance={30}>
  <div>从上方滑入</div>
</AnimationSpring>
```

### 使用预设动画

```tsx
import { AnimationContainer, entranceAnimations } from '@/components/animations'

;<AnimationContainer effects={[entranceAnimations.fadeInUp]}>
  <div>使用预设的淡入上滑动画</div>
</AnimationContainer>
```

## 📚 组件文档

### AnimationOpacity - 透明度动画

用于实现透明度变化的动画效果。

```tsx
interface AnimationOpacityProps {
  fromOpacity?: number // 初始透明度 (0-1)
  toOpacity?: number // 目标透明度 (0-1)
  duration?: number // 动画时长 (ms)
  mode?: 'spring' | 'linear' // 动画模式
  tension?: number // 弹簧张力
  friction?: number // 弹簧摩擦力
  mass?: number // 弹簧质量
  delay?: number // 延迟时间 (ms)
  loop?: boolean // 是否循环
  onRest?: () => void // 动画结束回调
  children: React.ReactNode
}
```

**示例：**

```tsx
// 线性淡入
<AnimationOpacity fromOpacity={0} toOpacity={1} duration={1000} mode="linear">
  <div>线性淡入效果</div>
</AnimationOpacity>

// 弹簧淡入
<AnimationOpacity
  fromOpacity={0}
  toOpacity={1}
  mode="spring"
  tension={280}
  friction={60}
>
  <div>弹簧淡入效果</div>
</AnimationOpacity>
```

### AnimationSpring - 弹簧动画

用于实现带有弹簧效果的位移动画。

```tsx
interface AnimationSpringProps {
  direction?: 'top' | 'bottom' | 'left' | 'right' // 滑入方向
  distance?: number // 滑动距离 (px)
  tension?: number // 弹簧张力
  friction?: number // 弹簧摩擦力
  mass?: number // 弹簧质量
  fromOpacity?: number // 初始透明度
  toOpacity?: number // 目标透明度
  duration?: number // 动画时长 (覆盖弹簧配置)
  delay?: number // 延迟时间 (ms)
  onRest?: () => void // 动画结束回调
  children: React.ReactNode
}
```

**示例：**

```tsx
// 从顶部滑入
<AnimationSpring direction="top" distance={50} tension={300}>
  <div>从顶部滑入</div>
</AnimationSpring>

// 从左侧滑入，带透明度变化
<AnimationSpring
  direction="left"
  distance={30}
  fromOpacity={0}
  toOpacity={1}
>
  <div>从左侧淡入滑入</div>
</AnimationSpring>
```

### AnimationSlide - 滑动动画

提供多种滑动方向的动画效果。

```tsx
type SlideDirection =
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideInUp'
  | 'slideInDown'
  | 'slideOutLeft'
  | 'slideOutRight'
  | 'slideOutUp'
  | 'slideOutDown'

interface AnimationSlideProps {
  direction?: SlideDirection // 滑动方向
  distance?: number // 滑动距离 (px)
  duration?: number // 动画时长 (ms)
  mode?: 'spring' | 'linear' // 动画模式
  tension?: number // 弹簧张力
  friction?: number // 弹簧摩擦力
  delay?: number // 延迟时间 (ms)
  onRest?: () => void // 动画结束回调
  children: React.ReactNode
}
```

**示例：**

```tsx
// 从左侧滑入
<AnimationSlide direction="slideInLeft" distance={100}>
  <div>从左侧滑入</div>
</AnimationSlide>

// 向上滑出
<AnimationSlide direction="slideOutUp" duration={800}>
  <div>向上滑出</div>
</AnimationSlide>
```

### AnimationScale - 缩放动画

提供各种缩放效果的动画。

```tsx
type ScaleType = 'scaleIn' | 'scaleOut' | 'pulse' | 'bounce'

interface AnimationScaleProps {
  scaleType?: ScaleType // 缩放类型
  fromScale?: number // 初始缩放比例
  toScale?: number // 目标缩放比例
  fromOpacity?: number // 初始透明度
  toOpacity?: number // 目标透明度
  duration?: number // 动画时长 (ms)
  mode?: 'spring' | 'linear' // 动画模式
  tension?: number // 弹簧张力
  friction?: number // 弹簧摩擦力
  loop?: boolean // 是否循环
  delay?: number // 延迟时间 (ms)
  onRest?: () => void // 动画结束回调
  children: React.ReactNode
}
```

**示例：**

```tsx
// 缩放入场
<AnimationScale scaleType="scaleIn" fromScale={0} toScale={1}>
  <div>缩放入场</div>
</AnimationScale>

// 脉冲效果
<AnimationScale scaleType="pulse" fromScale={1} toScale={1.1} loop>
  <div>脉冲效果</div>
</AnimationScale>
```

### AnimationRotate - 旋转动画

提供各种旋转效果的动画。

```tsx
type RotateType = 'rotateIn' | 'rotateOut' | 'spin' | 'flip'

interface AnimationRotateProps {
  rotateType?: RotateType // 旋转类型
  fromRotate?: number // 初始旋转角度 (度)
  toRotate?: number // 目标旋转角度 (度)
  fromOpacity?: number // 初始透明度
  toOpacity?: number // 目标透明度
  duration?: number // 动画时长 (ms)
  mode?: 'spring' | 'linear' // 动画模式
  tension?: number // 弹簧张力
  friction?: number // 弹簧摩擦力
  loop?: boolean // 是否循环
  delay?: number // 延迟时间 (ms)
  onRest?: () => void // 动画结束回调
  children: React.ReactNode
}
```

**示例：**

```tsx
// 旋转入场
<AnimationRotate rotateType="rotateIn" fromRotate={-180} toRotate={0}>
  <div>旋转入场</div>
</AnimationRotate>

// 持续旋转
<AnimationRotate rotateType="spin" fromRotate={0} toRotate={360} loop>
  <div>持续旋转</div>
</AnimationRotate>
```

### AnimationContainer - 组合动画

用于组合多种动画效果，支持并行或顺序执行。

```tsx
interface AnimationContainerProps {
  effects: AnimationEffect[] // 动画效果数组
  mode?: 'parallel' | 'sequence' // 执行模式
  delay?: number // 全局延迟 (ms)
  stagger?: number // 交错延迟 (ms)
  loop?: boolean // 是否循环
  onRest?: () => void // 动画结束回调
  children: React.ReactNode
}
```

**示例：**

```tsx
// 并行动画
<AnimationContainer
  effects={[
    { type: 'opacity', config: { fromOpacity: 0, toOpacity: 1 } },
    { type: 'scale', config: { scaleType: 'scaleIn', fromScale: 0.5, toScale: 1 } }
  ]}
  mode="parallel"
>
  <div>淡入 + 缩放</div>
</AnimationContainer>

// 顺序动画
<AnimationContainer
  effects={[
    { type: 'spring', config: { direction: 'top', distance: 30 } },
    { type: 'opacity', config: { fromOpacity: 0, toOpacity: 1 } }
  ]}
  mode="sequence"
  stagger={200}
>
  <div>先滑入，再淡入</div>
</AnimationContainer>
```

### AnimationSequence - 序列动画

用于创建复杂的动画序列，支持多个步骤的精确控制。

```tsx
interface AnimationStep {
  name: string // 步骤名称
  to: Record<string, any> // 目标状态
  config?: SpringConfig // 弹簧配置
  delay?: number // 延迟时间 (ms)
}

interface AnimationSequenceProps {
  steps: AnimationStep[] // 动画步骤
  initialState?: Record<string, any> // 初始状态
  loop?: boolean // 是否循环
  globalDelay?: number // 全局延迟 (ms)
  onStepComplete?: (stepName: string) => void // 步骤完成回调
  onComplete?: () => void // 序列完成回调
  children: React.ReactNode
}
```

**示例：**

```tsx
const steps = [
  {
    name: 'prepare',
    to: { opacity: 0, scale: 0.5, y: -50 },
    config: { duration: 0 }
  },
  {
    name: 'fadeIn',
    to: { opacity: 1 },
    config: { tension: 280, friction: 60 },
    delay: 200
  },
  {
    name: 'slideDown',
    to: { y: 0 },
    config: { tension: 300, friction: 10 },
    delay: 300
  },
  {
    name: 'scaleUp',
    to: { scale: 1 },
    config: { tension: 200, friction: 8 },
    delay: 200
  }
]

<AnimationSequence steps={steps}>
  <div>复杂序列动画</div>
</AnimationSequence>
```

## 🎨 预设动画

库提供了丰富的预设动画，可以直接使用：

### 入场动画

```tsx
import { entranceAnimations } from '@/components/animations'

// 可用的入场动画
entranceAnimations.fadeIn
entranceAnimations.fadeInUp
entranceAnimations.fadeInDown
entranceAnimations.slideInLeft
entranceAnimations.zoomIn
entranceAnimations.bounceIn
// ... 更多
```

### 出场动画

```tsx
import { exitAnimations } from '@/components/animations'

// 可用的出场动画
exitAnimations.fadeOut
exitAnimations.fadeOutUp
exitAnimations.slideOutLeft
exitAnimations.zoomOut
// ... 更多
```

### 注意力动画

```tsx
import { attentionAnimations } from '@/components/animations'

// 可用的注意力动画
attentionAnimations.pulse
attentionAnimations.shake
attentionAnimations.heartBeat
attentionAnimations.flash
// ... 更多
```

## 🛠️ 工具函数

### 弹簧配置

```tsx
import { springConfigs } from '@/components/animations'

// 预设的弹簧配置
springConfigs.default // 默认配置
springConfigs.gentle // 温和
springConfigs.wobbly // 摇摆
springConfigs.stiff // 僵硬
springConfigs.slow // 缓慢
springConfigs.molasses // 粘稠
```

### 创建自定义配置

```tsx
import { createLinearConfig, createSpringConfig } from '@/components/animations'

// 创建弹簧配置
const customSpring = createSpringConfig({
  tension: 280,
  friction: 60,
  mass: 1,
})

// 创建线性配置
const customLinear = createLinearConfig({
  duration: 1000,
  easing: 'easeInOut',
})
```

### 交错动画

```tsx
import { createStaggerConfig } from '@/components/animations'

// 创建交错动画配置
const staggerConfig = createStaggerConfig(
  5, // 元素数量
  entranceAnimations.fadeInUp, // 基础动画
  {
    baseDelay: 0,
    increment: 100, // 每个元素延迟100ms
    reverse: false,
  }
)
```

## 📱 响应式动画

根据屏幕尺寸调整动画参数：

```tsx
import { responsiveAnimations } from '@/components/animations'

// 获取响应式配置
const isMobile = window.innerWidth < 768
const config = isMobile
  ? responsiveAnimations.mobile
  : responsiveAnimations.desktop

<AnimationSpring
  distance={config.distance}
  {...config.springConfig}
>
  <div>响应式动画</div>
</AnimationSpring>
```

## 🎯 最佳实践

### 1. 性能优化

- 使用 `will-change` CSS 属性启用硬件加速
- 避免在动画过程中修改布局属性
- 使用 `transform` 和 `opacity` 进行动画

```tsx
// ✅ 好的做法
<AnimationOpacity fromOpacity={0} toOpacity={1}>
  <div style={{ willChange: 'opacity, transform' }}>
    内容
  </div>
</AnimationOpacity>

// ❌ 避免的做法
<div style={{ animation: 'slideIn 1s ease-in-out' }}>
  内容
</div>
```

### 2. 动画时长

- 短距离移动：200-300ms
- 中等距离移动：300-500ms
- 长距离移动或复杂动画：500-800ms
- 避免超过 1 秒的动画

### 3. 缓动函数选择

- 入场动画：使用 `easeOut` 类型
- 出场动画：使用 `easeIn` 类型
- 交互反馈：使用 `easeInOut` 类型

### 4. 组合动画

```tsx
// 推荐：使用 AnimationContainer 组合多个效果
<AnimationContainer
  effects={[
    { type: 'opacity', config: { fromOpacity: 0, toOpacity: 1 } },
    { type: 'spring', config: { direction: 'bottom', distance: 20 } },
  ]}
  mode="parallel"
>
  <Card>内容</Card>
</AnimationContainer>
```

### 5. 条件动画

```tsx
const [isVisible, setIsVisible] = useState(false)

return (
  <>
    <button onClick={() => setIsVisible(!isVisible)}>切换显示</button>

    {isVisible && (
      <AnimationOpacity fromOpacity={0} toOpacity={1}>
        <div>条件显示的内容</div>
      </AnimationOpacity>
    )}
  </>
)
```

### 6. 列表动画

```tsx
const items = ['Item 1', 'Item 2', 'Item 3']

return (
  <div>
    {items.map((item, index) => (
      <AnimationSpring
        key={item}
        direction="left"
        delay={index * 100} // 交错延迟
      >
        <div>{item}</div>
      </AnimationSpring>
    ))}
  </div>
)
```

## 🔧 自定义 Hook

库还提供了一些自定义 Hook 用于更灵活的控制：

```tsx
import { useScaleAnimation, useSlideAnimation } from '@/components/animations'

const MyComponent = () => {
  const [slideProps, slideApi] = useSlideAnimation({
    direction: 'slideInLeft',
    distance: 50,
  })

  const handleClick = () => {
    slideApi.start({
      to: { x: 100 },
      config: { tension: 300, friction: 10 },
    })
  }

  return (
    <animated.div style={slideProps} onClick={handleClick}>
      点击我
    </animated.div>
  )
}
```

## 📖 示例

查看 `examples.tsx` 文件获取完整的使用示例，或在项目中导入 `AnimationExamples`
组件查看实时演示。

```tsx
import { AnimationExamples } from '@/components/animations'

// 在你的应用中使用

;<AnimationExamples />
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个动画组件库！

## 📄 许可证

MIT License
