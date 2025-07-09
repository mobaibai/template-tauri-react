// import LoadingSpin1 from '@/components/Loading/LoadingSpin1'
// import LoadingSpin2 from '@/components/Loading/LoadingSpin2'
import { useEffect } from 'react'

import { invoke } from '@tauri-apps/api/core'

import LoadingEatBeans from '@/components/Loading/LoadingEatBeans'
import { useTitle } from '@/hooks/useTitle'

interface Props {
  title?: string
}
export const StartLoading: React.FC<Props> = props => {
  if (props.title) useTitle(props.title)

  useEffect(() => {
    // 组件挂载完成后通知后端显示loading窗口
    const notifyReady = async () => {
      try {
        await invoke('notify_loading_ready')
      } catch (error) {
        console.error('Failed to notify loading ready:', error)
      }
    }

    notifyReady()
  }, [])

  return (
    <div className="loading-container overflow-hidden select-none w-screen h-screen bg-transparent">
      {/* <LoadingSpin1 /> */}
      {/* <LoadingSpin2 /> */}
      <LoadingEatBeans />
    </div>
  )
}

export default StartLoading
