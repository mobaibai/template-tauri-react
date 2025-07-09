import type { SWRConfiguration } from 'swr'
import useSWR from 'swr'

import { useIpcAjax } from '@/lib/ipc-ajax'
import { objectToQueryString } from '@/utils'

interface Props {
  method: 'GET' | 'POST'
  path: string | undefined
  params?: JSONValue
  swrConf?: SWRConfiguration
}

/**
 * @description: 设置Ipc数据(Tauri后端)
 * @param {type} method 请求方式
 * @param {type} path 请求地址
 * @param {type} params 请求参数
 * @param {type} swrConf SWR 设置
 * @return {type}
 * @example
 * const { data, mutate, isLoading, isValidating, error } = useIpcData({
 *  method: 'GET',
 *  path: '/api/test/list',
 *  params: { count: 10 }
 * })
 */
export const useIpcData = ({
  method = 'GET',
  path,
  params = {},
  swrConf = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  },
}: Props) => {
  const { get, post } = useIpcAjax({ showLoading: true, handleError: true })
  const { data, mutate, isLoading, isValidating, error } = useSWR<
    DataType<ResponseDataListType | ItemType>
  >(
    path,
    async (path: string) => {
      try {
        let res
        switch (method) {
          case 'GET':
            // GET 请求需要将参数转换为查询字符串
            const queryString = objectToQueryString(
              typeof params === 'object' && params !== null && !Array.isArray(params) ? params : {}
            )
            const getUrl = queryString ? `${path}?${queryString}` : path
            res = await get<DataType<ResponseDataListType | ItemType>>(getUrl)
            break
          case 'POST':
            res = await post<DataType<ResponseDataListType | ItemType>>(path, params)
            break
          default:
            throw new Error(`不支持的请求方法: ${method}`)
        }

        return res.data
      } catch (error) {
        console.error('IPC请求失败:', error)
        // 重新抛出错误，让SWR处理
        throw error
      }
    },
    swrConf
  )

  return {
    data,
    mutate,
    isLoading,
    isValidating,
    error,
  }
}
