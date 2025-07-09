/**
 * @description: 时间转换
 * @param {number} time 毫秒
 * @param {string} format 格式
 * @return {type} TimeString
 * @example:
 * const time = formatTime(1672531199000, 'yyyy-MM-dd HH:mm:ss')
 * console.log(time) // 2023-01-01 00:00:00
 */
export const formatTime = (time: number | string | Date, format: string): string => {
  if (typeof time === 'string') time = Number(time)
  if (typeof time !== 'number' || Number.isNaN(time)) return ''
  if (!format) format = 'yyyy-MM-dd HH:mm:ss'

  const date = time ? new Date(time) : new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  const ms = date.getMilliseconds().toString().padStart(3, '0')

  const formattedTime = format
    .replace(/yyyy/g, year.toString())
    .replace(/MM/g, month)
    .replace(/dd/g, day)
    .replace(/HH/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds)
    .replace(/fff/g, ms)

  return formattedTime
}

/**
 * @description: 对象转QueryString
 * @param {type} obj
 * @return {type} QueryString
 * @example:
 * const obj = { name: 'John', age: 30 }
 * const queryString = objectToQueryString(obj)
 * console.log(queryString) // name=John&age=30
 */
export const objectToQueryString = (obj: { [key: string]: any }) => {
  return Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&')
}

/**
 * @description: 文件单位转换
 * @param {number} size 文件大小
 * @param {string} fromUnit 初始单位
 * @param {string} toUnit 目标单位
 * @param {number} decimalPoint 保留小数位
 * @return {string | null} 转换结果，如果参数无效，则返回 null
 * @example:
 * const fileSize = convertFileSize(1024, 'KB', 'MB', 2)
 */
export const convertFileSize = (
  size: number,
  fromUnit: 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB' | 'ZB' | 'YB',
  toUnit: 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB' | 'ZB' | 'YB',
  decimalPoint: number = 2
): string | null => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const fromIndex = units.indexOf(fromUnit)
  const toIndex = units.indexOf(toUnit)

  if (fromIndex === -1 || toIndex === -1) {
    return null
  }

  if (!Number.isInteger(decimalPoint)) {
    return null
  }

  const exponent = toIndex - fromIndex
  const resultSize = size / Math.pow(1024, exponent)

  return `${parseFloat(resultSize.toFixed(decimalPoint))} ${toUnit}`
}
