import { useEffect } from 'react'

import { useLocation } from 'react-router-dom'

import { invoke } from '@tauri-apps/api/core'

// 路由到标题的映射
const routeTitleMap: Record<string, string> = {
  '/': 'Tauri React 模板 - 首页',
  '/components': 'Tauri React 模板 - 功能组件',
  '/animations': 'Tauri React 模板 - 动画展示',
  '/request': 'Tauri React 模板 - 网络请求',
  '/model': 'Tauri React 模板 - 模型展示',
  '/versions': 'Tauri React 模板 - 版本信息',
}

/**
 * 自定义Hook：根据当前路由自动更新窗口标题
 */
export function useWindowTitle() {
  const location = useLocation()

  useEffect(() => {
    const updateTitle = async () => {
      try {
        const title = routeTitleMap[location.pathname] || 'Tauri React 模板'
        await invoke('update_window_title', { title })
      } catch (error) {
        console.error('更新窗口标题失败:', error)
      }
    }

    updateTitle()
  }, [location.pathname])
}

/**
 * 手动设置窗口标题
 * @param title 窗口标题
 */
export async function setWindowTitle(title: string) {
  try {
    await invoke('update_window_title', { title })
  } catch (error) {
    console.error('设置窗口标题失败:', error)
  }
}
