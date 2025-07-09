import React, { useEffect, useRef, useState } from 'react'

import { useLocation } from 'react-router-dom'

import { animated, useSpring } from '@react-spring/web'

interface RouteTransitionProps {
  children: React.ReactNode
}

const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const location = useLocation()
  const mountedRef = useRef(false)
  const prevPathnameRef = useRef(location.pathname)

  const springs = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
    config: {
      tension: 280,
      friction: 60,
    },
  })

  useEffect(() => {
    // 组件首次挂载或路径变化时重置动画
    if (!mountedRef.current || prevPathnameRef.current !== location.pathname) {
      setIsVisible(false)

      // 使用 setTimeout 确保状态重置后再开始动画
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 10)

      mountedRef.current = true
      prevPathnameRef.current = location.pathname

      return () => {
        clearTimeout(timer)
      }
    }
  }, [location.pathname, children])

  // 组件卸载时重置状态
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  return (
    <animated.div
      style={{
        ...springs,
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </animated.div>
  )
}

export default RouteTransition
