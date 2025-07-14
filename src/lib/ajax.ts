import type { AxiosError, AxiosRequestConfig } from 'axios'
import axios from 'axios'

import { BaseApi } from '@/config'
import { useLoadingStore } from '@/stores'

// 静态配置项直接用 defaults 配置
axios.defaults.baseURL = BaseApi.API_BASE_URL
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 3000

// 动态配置项用拦截器来配置
axios.interceptors.request.use(config => {
  config.headers = config.headers || {}
  return config
})

type Options = {
  showLoading?: boolean
  handleError?: boolean
}
/**
 * @description: Ajax封装
 * @param {Options} options
 * @return {type}
 * @example:
 * const { get, post } = useAjax({ showLoading: true, handleError: true })
 * const resGet = await get<DataType<ResponseDataListType | ItemType>>('/api/get/test/list', { count: 10 })
 * const resPost = await post<DataType<ResponseDataListType | ItemType>>('/api/post/test/list', { count: 10 })
 */
export const useAjax = (options?: Options) => {
  const table: Record<string, undefined | (() => void)> = {
    401: () => {
      '登录验证'
    },
    402: () => {
      window.alert('请付费后观看')
    },
    403: () => {
      window.alert('没有权限')
    },
    unknown: () => {
      window.alert('未知错误')
    },
  }
  const showLoading = options?.showLoading || false
  const handleError = options?.handleError ?? true
  const { setLoadingOpen } = useLoadingStore()
  const onError = (error: AxiosError) => {
    if (error.response) {
      if (handleError) {
        const { status } = error.response
        const fn = table[status] || table.unknown
        fn?.()
      }
    }
    throw error
  }
  const ajax = {
    get: <T>(path: string, config?: AxiosRequestConfig<any>) => {
      if (showLoading) {
        setLoadingOpen(true)
      }
      return axios
        .get<T>(path, config)
        .catch(onError)
        .finally(() => {
          if (showLoading) {
            setLoadingOpen(false)
          }
        })
    },
    post: <T>(path: string, data: JSONValue, config?: AxiosRequestConfig<any>) => {
      if (showLoading) {
        setLoadingOpen(true)
      }
      return axios
        .post<T>(path, data, config)
        .catch(onError)
        .finally(() => {
          if (showLoading) {
            setLoadingOpen(false)
          }
        })
    },
    patch: () => {},
    delete: () => {},
  }
  return ajax
}

export default useAjax
