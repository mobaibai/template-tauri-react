import { nanoid } from 'nanoid'

import React, { useEffect, useRef, useState } from 'react'

import { invoke } from '@tauri-apps/api/core'

import { Button, Skeleton } from 'antd'

import { AnimationOpacity, AnimationScale } from '@/components/Animations'
import { useTitleSafe } from '@/hooks/useTitleSafe'
import { useCountStore } from '@/stores/useCountStore'

import SystemInfoCard from './SystemInfoCard'

interface Props {
  title?: string
}
export const Home: React.FC<Props> = props => {
  useTitleSafe(props.title)

  const { inc, cut, count } = useCountStore()
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [systemInfo, setSystemInfo] = useState<SystemInfo[]>([])

  useEffect(() => {
    systemInfoHandler()
    timer.current = setInterval(() => {
      systemInfoHandler()
    }, 5000)

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [])

  /**
   * @description: 系统信息操作
   * @return {type}
   */
  const systemInfoHandler = async () => {
    try {
      const info = await invoke<SystemInfo[]>('get_system_info')
      if (info) {
        setSystemInfo(info)
      }
    } catch (error) {
      console.error('Failed to get system info:', error)
    }
  }

  return (
    <div className="home-container h-[calc(100vh-46px)] overflow-y-auto bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-purple-800 dark:to-blue-800">
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto min-h-full">
        {/* 系统信息展示 */}
        <AnimationOpacity fromOpacity={0} toOpacity={1} duration={600}>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-3 sm:mb-4 md:mb-6 text-gray-800 dark:text-white backdrop-blur-sm">
            系统信息
          </h2>
          <div className="system-info-items flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-2 md:space-x-4 mb-6 sm:mb-8">
            {systemInfo.length &&
              systemInfo.map((item: any) => (
                <div
                  key={nanoid()}
                  className="system-info-item w-full sm:flex-1 h-48 sm:h-56 md:h-64 lg:h-72"
                >
                  <SystemInfoCard>
                    <div className="card-content relative h-full">
                      <div className="content px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 h-full flex flex-col">
                        <div className="label text-sm sm:text-lg md:text-xl font-bold text-gray-600 dark:text-gray-400 flex items-center backdrop-blur-sm">
                          {item.key}
                        </div>
                        <div className="info flex flex-col flex-1">
                          <div className="name text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {item.name}：
                          </div>
                          <div className="text flex-1 flex items-center justify-center text-sm sm:text-base font-bold rainbow-text dark:rainbow-text">
                            {item.key !== 'metrics' ? (
                              <div>{item.value}</div>
                            ) : (
                              <div className="h-24 sm:h-28 md:h-32 lg:h-36 space-y-1 sm:space-y-2 overflow-y-auto flex flex-col justify-center text-xs sm:text-sm">
                                {item.value &&
                                  item.value.length &&
                                  item.value.map((item2: any) => (
                                    <div
                                      key={nanoid()}
                                    >{`${item2.type}：${item2.cpu.percentCPUUsage.toFixed(2)}%`}</div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SystemInfoCard>
                </div>
              ))}
          </div>
        </AnimationOpacity>

        {/* 计数器功能 */}
        <AnimationOpacity fromOpacity={0} toOpacity={1} duration={800}>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-3 sm:mb-4 md:mb-6 text-gray-800 dark:text-white">
            计数器
          </h2>
          <div className="count-action flex items-center justify-center">
            <div className="backdrop-blur-xl bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl">
              <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
                <AnimationScale type="scaleIn" fromScale={0.8} toScale={1} delay={300}>
                  <Button
                    onClick={cut}
                    size="large"
                    className="!bg-white/30 !border-white/50 hover:!bg-white/50 !text-gray-800 dark:!text-white !backdrop-blur-sm"
                  >
                    -
                  </Button>
                </AnimationScale>
                <div className="count-view w-16 sm:w-20 text-2xl sm:text-3xl md:text-4xl font-bold text-center rainbow-text dark:rainbow-text">
                  {count}
                </div>
                <AnimationScale type="scaleIn" fromScale={0.8} toScale={1} delay={500}>
                  <Button
                    onClick={inc}
                    size="large"
                    className="!bg-white/30 !border-white/50 hover:!bg-white/50 !text-gray-800 dark:!text-white !backdrop-blur-sm"
                  >
                    +
                  </Button>
                </AnimationScale>
              </div>
            </div>
          </div>
        </AnimationOpacity>
      </div>
    </div>
  )
}

export const HomeSkeleton = () => {
  return (
    <div className="home-skeleton p-4 sm:p-6 md:p-8 lg:p-[20px]">
      <Skeleton active />
    </div>
  )
}
