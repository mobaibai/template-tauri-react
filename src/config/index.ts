const dev = 'localhost:5173'
const prod = 'xxx.com'

const getProtocol = (): string => {
  if (
    typeof globalThis !== 'undefined' &&
    'window' in globalThis &&
    (globalThis as any).window?.location
  ) {
    return (globalThis as any).window.location.protocol
  }
  return 'http:' // Node.js环境默认值
}

interface BaseApiType {
  API_BASE_URL: string
  API_RESOURCE_URL: string
}

/**
 * @description: 开发
 * @return {type}
 */
const development: BaseApiType = {
  API_BASE_URL: `${getProtocol()}//${dev}`, // 基本地址
  API_RESOURCE_URL: `${getProtocol()}//${dev}`, // 资源地址
}

/**
 * @description: 生产
 * @return {type}
 */
const production: BaseApiType = {
  API_BASE_URL: `${getProtocol()}//${prod}`,
  API_RESOURCE_URL: `${getProtocol()}//${prod}`,
}

/**
 * @description: 请求地址前缀
 * @return {type}
 */
export const BaseApi: BaseApiType =
  process.env.NODE_ENV === 'development' ? development : production

/**
 * @description: 项目名
 * @return {type}
 */
export const APP_NAME: string = 'APP_NAME'

/**
 * @description: 项目路径
 * @return {type}
 */
export const PRJ_PATH: string = '/template-react-vite/'

/**
 * @description: 主题色
 */
export const ThemePrimary: string = '#13c2c2'
