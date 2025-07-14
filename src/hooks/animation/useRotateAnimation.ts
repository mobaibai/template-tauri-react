import { useCallback } from 'react'
import { useSpring } from '@react-spring/web'

// 旋转动画控制器 Hook，用于手动控制动画
export const useRotateAnimation = () => {
  const [styles, api] = useSpring(() => ({
    transform: 'rotateZ(0deg)',
    opacity: 1,
  }))

  const rotateIn = useCallback(
    (fromAngle = -180, toAngle = 0, axis = 'z', config?: any) => {
      api.set({
        transform: `rotate${axis.toUpperCase()}(${fromAngle}deg)`,
        opacity: 0,
      })
      return api.start({
        transform: `rotate${axis.toUpperCase()}(${toAngle}deg)`,
        opacity: 1,
        config,
      })
    },
    [api]
  )

  const rotateOut = useCallback(
    (toAngle = 180, axis = 'z', config?: any) => {
      return api.start({
        transform: `rotate${axis.toUpperCase()}(${toAngle}deg)`,
        opacity: 0,
        config,
      })
    },
    [api]
  )

  const spin = useCallback(
    (angle = 360, axis = 'z', config?: any) => {
      return api.start({
        to: async next => {
          await next({ transform: `rotate${axis.toUpperCase()}(${angle}deg)` })
          api.set({ transform: 'rotateZ(0deg)' })
        },
        config,
      })
    },
    [api]
  )

  return { styles, rotateIn, rotateOut, spin, api }
}