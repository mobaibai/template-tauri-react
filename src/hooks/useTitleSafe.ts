import { useEffect } from 'react'

/**
 * @description: 安全地设置页面 Title，避免条件渲染问题
 * @param {string} title - 页面标题
 * @return {void}
 * @example:
 * useTitleSafe('首页')
 */
export function useTitleSafe(title?: string) {
  useEffect(() => {
    if (title) {
      document.title = title
    }
  }, [title])
}