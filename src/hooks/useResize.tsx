import { useEffect, useRef, useState } from 'react'

// 默认适配宽高
export const width = 1920
export const height = 1080

type ResizeType = {
  w?: number
  h?: number
  fullScreen?: boolean
  delay?: number
}
/**
 * @description: 数据大屏适配
 * @param {ResizeType} options
 * @return {type}
 * @example:
 * const designWidth = 1875 // 设计稿宽度
 * const designHeight = 1044 // 设计稿高度
 * document.documentElement.style.setProperty('--design-width', `${designWidth}px`) // Css变量
 * document.documentElement.style.setProperty('--design-height', `${designHeight}px`)
 * const { screenRef } = useResize({ w: designWidth, h: designHeight， fullScreen: false, delay: 100 })
 * --HTML--
 * <div className='data-screen-container relative m-0 w-screen h-screen overflow-hidden'>
 *   <div ref={screenRef} className='screen-bg absolute top-1/2 left-1/2 w-[var(--design-width)] h-[var(--design-height)] ml-[calc(var(--design-width)*0.5-var(--design-width))] mt-[calc(var(--design-height)*0.5-var(--design-height))]'>
 *     内容展示区域
 *   </div>
 * </div>
 */
export const useResize = (options: ResizeType = {}) => {
  const { w = width, h = height, fullScreen = false, delay = 100 } = options
  // 缩放元素
  const screenRef = useRef<HTMLElement | undefined | any>(undefined)
  const [scale, setScale] = useState<number>(1)

  const resize = () => {
    // 浏览器宽高
    const clientWidth = document.body.clientWidth
    const clientHeight = document.body.clientHeight

    // 计算宽高缩放比例
    const scaleW = clientWidth / w
    const scaleH = clientHeight / h

    if (clientWidth / clientHeight <= w / h) {
      // 如果浏览器的宽高比小于设计稿的宽高比，就取浏览器宽度和设计稿宽度之比
      setScale(scaleW)
    } else {
      // 如果浏览器的宽高比大于设计稿的宽高比，就取浏览器高度和设计稿高度之比
      setScale(scaleH)
    }

    if (screenRef.current) {
      if (fullScreen) {
        // 如果不在乎缩放失真的情况，可以设置全屏
        screenRef.current.style.transform = `scale(${scaleW}, ${scaleH})`
      } else {
        // 否则选择适配比例缩放
        screenRef.current.style.transform = `scale(${clientWidth / clientHeight <= w / h ? scaleW : scaleH})`
      }
    }
  }

  const resizeDelay = useRef(debounce(resize, delay))

  useEffect(() => {
    resize()
    window.addEventListener('resize', resizeDelay.current)

    return () => {
      window.removeEventListener('resize', resizeDelay.current)
    }
  }, [])

  return {
    scale,
    screenRef,
  }
}

/*
用来返回防抖函数的工具函数
*/
function debounce(callback: Function, delay: number) {
  let timerId: NodeJS.Timeout | null
  return function (event: Event) {
    // 如果上次事件还没有真正处理, 清除
    if (timerId) {
      clearTimeout(timerId)
    }

    // 发事件发生指定事件后才调用处理事件的回调函数
    // 启动定时器, 只是准备真正处理
    timerId = setTimeout(() => {
      // 正在处理事件
      callback.call(null, event)
      // 删除准备处理的标记
      timerId = null
    }, delay)
  }
}
