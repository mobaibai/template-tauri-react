import 'virtual:svgsprites'

// @ts-ignore
import { useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom'

// React19兼容包
import '@ant-design/v5-patch-for-react-19'

import { ConfigProvider } from 'antd'

import { Header } from '@/components/Header'
import { ThemePrimary } from '@/config'
import { useWindowTitle } from '@/hooks/useWindowTitle'

import RouterConainer from './router'
import './styles/app.scss'
import './styles/global.scss'

function App() {
  const _location = useLocation()
  const [isStart, setIsStart] = useState(false)

  // 自动更新窗口标题
  useWindowTitle()

  useEffect(() => {
    if (['#/start-loading'].includes(window.location.hash)) setIsStart(true)
    else setIsStart(false)
  }, [_location])

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: ThemePrimary,
          },
        }}
      >
        <div
          className={`bg-image w-screen h-screen overflow-hidden relative ${isStart ? 'opacity-90' : 'opacity-100'}`}
        >
          {!isStart && <Header />}
          <RouterConainer />
        </div>
      </ConfigProvider>
    </div>
  )
}

export default App
