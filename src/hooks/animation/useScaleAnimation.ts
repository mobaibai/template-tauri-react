import { useCallback } from 'react'

import { useSpring } from '@react-spring/web'

// 缩放动画控制器 Hook，用于手动控制动画
export const useScaleAnimation = () => {
  const [styles, api] = useSpring(() => ({
    transform: 'scale(1)',
    opacity: 1,
  }))

  const scaleIn = useCallback(
    (fromScale = 0, toScale = 1, config?: any) => {
      api.set({ transform: `scale(${fromScale})`, opacity: 0 })
      return api.start({
        transform: `scale(${toScale})`,
        opacity: 1,
        config,
      })
    },
    [api]
  )

  const scaleOut = useCallback(
    (toScale = 0, config?: any) => {
      return api.start({
        transform: `scale(${toScale})`,
        opacity: 0,
        config,
      })
    },
    [api]
  )

  return { styles, scaleIn, scaleOut, api }
}
