import * as React from 'react'

/**
 * @description: 设置页面 Title
 * @param {string} title
 * @return {type} null
 * @example:
 * useTitle('首页')
 */
export function useTitle(title?: string) {
  React.useEffect(() => {
    if (title === undefined || title === null) return
    document.title = title
  }, [title])
}
