import { invoke } from '@tauri-apps/api/core'

import { useLoadingStore } from '@/stores'

// HTTP 响应接口
interface HttpResponse<T = any> {
  data: T
  status: number
  status_text: string
  headers: Record<string, string>
  success: boolean
}

// HTTP 配置接口
interface HttpConfig {
  headers?: Record<string, string>
  timeout?: number
  response_type?: 'json' | 'text' | 'buffer' | 'base64'
  [key: string]: any
}

// 选项接口
type Options = {
  showLoading?: boolean
  handleError?: boolean
}

/**
 * @description: HTTP客户端封装，基于Tauri的invoke调用
 * @param {Options} options
 * @return {type}
 * @example
 * const { get, post} = useIpcAjax({ showLoading: true, handleError: true })
 * const resGet = await get<DataType<ResponseDataListType | ItemType>>('/api/test', { timeout: 5000 })
 * const resPost = await post<DataType<ResponseDataListType | ItemType>>('/api/test', { name: 'test' }, { timeout: 5000 })
 */
export const useIpcAjax = (options?: Options) => {
  const table: Record<string, undefined | (() => void)> = {
    401: () => {
      console.log('401 Unauthorized')
    },
    402: () => {
      console.log('402 Payment Required')
    },
    403: () => {
      console.log('403 Forbidden')
    },
    404: () => {
      console.log('404 Not Found')
    },
    500: () => {
      console.log('500 Internal Server Error')
    },
    unknown: () => {
      console.log('Unknown error')
    },
  }

  const showLoading = options?.showLoading || false
  const handleError = options?.handleError ?? true
  const { setLoadingOpen } = useLoadingStore()

  const onError = (error: Error & { status?: number }) => {
    if (handleError && error.status) {
      const fn = table[error.status] || table.unknown
      fn?.()
    }
    throw error
  }

  const ipcAjax = {
    get: async <T>(url: string, config?: HttpConfig): Promise<HttpResponse<T>> => {
      if (showLoading) setLoadingOpen(true)

      try {
        const response = await invoke<HttpResponse<T>>('http_get', {
          url,
          config,
        })
        return response
      } catch (error) {
        return onError(error as Error & { status?: number })
      } finally {
        if (showLoading) setLoadingOpen(false)
      }
    },

    post: async <T>(url: string, data?: any, config?: HttpConfig): Promise<HttpResponse<T>> => {
      if (showLoading) setLoadingOpen(true)

      try {
        const response = await invoke<HttpResponse<T>>('http_post', {
          url,
          data,
          config,
        })
        return response
      } catch (error) {
        return onError(error as Error & { status?: number })
      } finally {
        if (showLoading) setLoadingOpen(false)
      }
    },
  }

  return ipcAjax
}
