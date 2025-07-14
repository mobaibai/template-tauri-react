import { useSpring } from '@react-spring/web'

// 滑动动画控制器 Hook，用于手动控制动画
export const useSlideAnimation = () => {
  const [styles, api] = useSpring(() => ({
    transform: 'translate3d(0, 0, 0)',
    opacity: 1,
  }))

  // 开始滑入动画
  const slideIn = (direction: string, distance = 30, config = {}) => {
    let x = 0
    let y = 0

    if (direction.includes('Left')) {
      x = -distance
    } else if (direction.includes('Right')) {
      x = distance
    }

    if (direction.includes('Up')) {
      y = -distance
    } else if (direction.includes('Down')) {
      y = distance
    }

    // 先设置初始位置
    api.set({
      transform: `translate3d(${x}px, ${y}px, 0)`,
      opacity: 0,
    })

    // 然后执行动画到目标位置
    api.start({
      transform: 'translate3d(0, 0, 0)',
      opacity: 1,
      ...config,
    })
  }

  // 开始滑出动画
  const slideOut = (direction: string, distance = 30, config = {}) => {
    let x = 0
    let y = 0

    if (direction.includes('Left')) {
      x = -distance
    } else if (direction.includes('Right')) {
      x = distance
    }

    if (direction.includes('Up')) {
      y = -distance
    } else if (direction.includes('Down')) {
      y = distance
    }

    api.start({
      transform: `translate3d(${x}px, ${y}px, 0)`,
      opacity: 0,
      ...config,
    })
  }

  return {
    styles,
    api,
    slideIn,
    slideOut,
  }
}