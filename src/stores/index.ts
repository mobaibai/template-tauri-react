import { create } from 'zustand'

import { getStorage, removeStorage, setStorage } from '@/storage'

type Loading = {
  loadingOpen: boolean
  setLoadingOpen: (loadingOpen: boolean) => void
}
/**
 * @description: 设置Loading
 * @param {type} create
 * @return {type}
 * @example
 * const { loadingOpen, setLoadingOpen } = useLoadingStore()
 * --HTML--
 * <div className='loading-container'>
 *   <button onClick={() => setLoadingOpen(true)}>打开Loading</button>
 *   <button onClick={() => setLoadingOpen(false)}>关闭Loading</button>
 *   {loadingOpen && <Loading />}
 * </div>
 */
export const useLoadingStore = create<Loading>(set => ({
  loadingOpen: false,
  setLoadingOpen: (loadingOpen: boolean) => {
    set({ loadingOpen })
  },
}))

type LoginOpen = {
  loginOpen: boolean
  setLoginOpen: (loginOpen: boolean) => void
}
/**
 * @description: 设置登录弹窗
 * @param {type} create
 * @return {type}
 * @example
 * const { loginOpen, setLoginOpen } = useLoginOpenStore()
 * --HTML--
 * <div className='login-container'>
 *   <button onClick={() => setLoginOpen(true)}>打开登录弹窗</button>
 *   <button onClick={() => setLoginOpen(false)}>关闭登录弹窗</button>
 *   {loginOpen && <Login />}
 * </div>
 */
export const useLoginOpenStore = create<LoginOpen>(set => ({
  loginOpen: false,
  setLoginOpen: (loginOpen: boolean) => {
    set({ loginOpen })
  },
}))

type UserData = {
  uid: number | string
  localstore: string
  nickname: string
  realname: string
  avatar: string
  phone: string
  token: string
}
type Login = {
  userData: UserData
  setUserData: (userData: UserData) => void
  removeUserData: () => void
}
/**
 * @description: 登录数据处理
 * @param {type} create
 * @return {type}
 * @example
 * const { userData, setUserData, removeUserData } = useLoginStore()
 */
export const useLoginStore = create<Login>(set => {
  const initialValue: UserData = {
    uid: '',
    localstore: '',
    nickname: '',
    realname: '',
    avatar: '',
    phone: '',
    token: '',
  }
  return {
    userData: getStorage(`UserData`) || initialValue,
    setUserData: (userData: UserData) => {
      set({ userData })
      // 一小时
      const hoursSecond: number = 3600
      // 一天
      const day1Second: number = hoursSecond * 24
      // 当前秒
      const currentSecond: number = Date.now() / 1000
      // 过期时间(秒)
      const expire: number = currentSecond + day1Second
      setStorage(`UserData`, userData, { expire })
    },
    removeUserData: () => {
      set({ userData: initialValue })
      removeStorage(`UserData`)
    },
  }
})
