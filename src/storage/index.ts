import CryptoJS from 'crypto-js'

import { APP_NAME } from '@/config'

// 十六位十六进制数作为密钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse('3333e6e143439161')
// 十六位十六进制数作为密钥偏移量
const SECRET_IV = CryptoJS.enc.Utf8.parse('e3bbe7e3ba84431a')

// 类型 window.localStorage, window.sessionStorage,
interface ConfigType {
  type?: 'localStorage' | 'sessionStorage'
  prefix?: string | undefined
  expire?: number
  isEncrypt?: boolean
}
const config: ConfigType = {
  type: 'localStorage', // 本地默认存储类型 localStorage
  prefix: APP_NAME, // 名称前缀: 项目名 + 版本
  expire: 0, // 过期时间 单位：秒
  isEncrypt: !__isDev__, // 生产环境加密
}

/**
 * @description: 判断是否支持 Storage
 * @return {type}
 * @example:
 * if (isSupportStorage()) console.log("支持 Storage")
 */
export function isSupportStorage() {
  return typeof Storage !== 'undefined'
}

/**
 * @description: 设置 setStorage
 * @param {string} key
 * @param {T} value 值
 * @param {type} expire 过期时间(秒)
 * @param {type} type 类型
 * @return {type}
 * @example:
 * setStorage("key", "data", { expire: 60, type: "localStorage" })
 */
export function setStorage<T>(
  key: string,
  value: T | null,
  { expire = 0, type = 'localStorage' }: ConfigType = {}
) {
  if (value === '' || value === null || value === undefined) {
    value = null
  }

  if (isNaN(expire) || expire < 0) throw new Error('Expire must be a number')

  const data = {
    value, // 存储值
    time: Date.now() / 1000, // 存值时间戳
    expire, // 过期时间
  }

  const encryptString = config.isEncrypt ? encrypt(JSON.stringify(data)) : JSON.stringify(data)

  window[type].setItem(autoAddPrefix(key), encryptString)
}

/**
 * @description: 获取 getStorage
 * @param {string} key
 * @param {type} type 存储类型
 * @return {type}
 * @example:
 * const data = getStorage("key", { type: "localStorage" })
 */
export function getStorage(key: string, { type = 'localStorage' }: ConfigType = {}) {
  key = autoAddPrefix(key)
  // key 不存在判断
  if (!window[type].getItem(key) || JSON.stringify(window[type].getItem(key)) === 'null') {
    return null
  }

  // 优化 持续使用中续期
  const item = window[type].getItem(key)
  const storage: Storage = config.isEncrypt
    ? JSON.parse(decrypt(item ?? ''))
    : JSON.parse(item ?? '')

  const nowTime = Date.now() / 1000

  // 过期删除
  if (storage.expire && storage.expire < nowTime) {
    removeStorage(key)
    return null
  } else {
    // 未过期期间被调用 则自动续期 进行保活
    setStorage(autoRemovePrefix(key), storage.value, { expire: storage.expire })
    return storage.value
  }
}

/**
 * @description: 删除 removeStorage
 * @param {string} key
 * @param {type} type 存储类型
 * @return {type}
 * @example:
 * removeStorage("key", { type: "localStorage" })
 */
export function removeStorage(key: string, { type = 'localStorage' }: ConfigType = {}) {
  window[type].removeItem(autoAddPrefix(key))
}

/**
 * @description: 是否存在 hasStorage
 * @param {string} key
 * @return {type}
 * @example:
 * if (hasStorage("key")) console.log("存在")
 */
export function hasStorage(key: string) {
  key = autoAddPrefix(key)
  const arr = getStorageAll().filter(item => {
    return item.key === key
  })
  return !!arr.length
}

/**
 * @description: 获取所有key
 * @return {type}
 * @example:
 * const keys = getStorageKeys()
 */
export function getStorageKeys() {
  const items = getStorageAll()
  const keys = []
  for (let index = 0; index < items.length; index++) {
    keys.push(items[index].key)
  }
  return keys
}

/**
 * @description: 根据索引获取key
 * @param {number} index
 * @param {type} type 存储类型
 * @return {type}
 * @example:
 * const key = getStorageForIndex(0, { type: "localStorage" })
 */
export function getStorageForIndex(index: number, { type = 'localStorage' }: ConfigType = {}) {
  return window[type].key(index)
}

/**
 * @description: 获取localStorage长度
 * @param {type} type 存储类型
 * @return {type}
 * @example:
 * const len = getStorageLength({ type: "localStorage" })
 */
export function getStorageLength({ type = 'localStorage' }: ConfigType = {}) {
  return window[type].length
}

/**
 * @description: 获取全部 getAllStorage
 * @param {type} type 存储类型
 * @return {type}
 * @example:
 * const all = getStorageAll({ type: "localStorage" })
 */
export function getStorageAll({ type = 'localStorage' }: ConfigType = {}) {
  const len = window[type].length // 获取长度
  const arr = [] // 定义数据集
  for (let i = 0; i < len; i++) {
    // 获取key 索引从0开始
    const getKey = window[type].key(i)
    // 获取key对应的值
    const getVal = getKey === null ? '' : window[type].getItem(getKey)
    // 放进数组
    arr[i] = { key: getKey, val: getVal }
  }
  return arr
}

/**
 * @description: 清空 clearStorage
 * @param {type} type 存储类型
 * @return {type}
 * @example:
 * clearStorage({ type: "localStorage" })
 */
export function clearStorage({ type = 'localStorage' }: ConfigType = {}) {
  window[type].clear()
}

/**
 * @description: 名称前自动添加前缀
 * @param {string} key
 * @return {type}
 * @example:
 * const key = autoAddPrefix("key")
 */
function autoAddPrefix(key: string) {
  const prefix = config.prefix ? `${config.prefix}_` : ''
  return prefix + key
}

/**
 * @description: 移除已添加的前缀
 * @param {string} key
 * @return {type}
 * @example:
 * const key = autoRemovePrefix("key")
 */
function autoRemovePrefix(key: string) {
  const len: number = config.prefix ? config.prefix.length + 1 : 0
  // return key.substr(len) 已弃用
  return key.substring(len)
}

/**
 * @description: 加密
 * @param {string} data
 * @return {*}
 * @example:
 * const data = encrypt("data")
 */
function encrypt(data: string) {
  if (typeof data === 'object') {
    try {
      data = JSON.stringify(data)
    } catch (error) {
      console.log('encrypt error:', error)
    }
  }
  const dataHex = CryptoJS.enc.Utf8.parse(data)
  const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.ciphertext.toString()
}

/**
 * @description: 解密
 * @param {string} data
 * @return {*}
 * @example:
 * const data = decrypt("data")
 */
function decrypt(data: string) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data)
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
