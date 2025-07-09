import { nanoid } from 'nanoid'

import { useEffect, useRef, useState } from 'react'

import { Empty } from 'antd'

interface NavFollowProps<T> {
  list: Array<T>
  navItemName: string
  size?: 'small' | 'default' | 'large'
  followType?: 'bg' | 'border'
  color?: string
  onClickNavItemHandler?: (item: T) => void
}
/**
 * @description: 跟随导航
 * @params props {
 * @param {type} list List数据
 * @param {type} navItemName NavItem字段名
 * @param {type} size 大小
 * @param {type} followType 跟随Bar类型
 * @param {type} color 颜色
 * @param {type} onClickNavItemHandler NavItem点击事件
 * }
 * @return {type}
 */
export const NavFollow: React.FC<NavFollowProps<any>> = ({
  list,
  navItemName,
  size = 'default',
  followType = 'border',
  color = 'var(--theme-primary)',
  onClickNavItemHandler = () => {},
}) => {
  const [navIndex, useNavIndex] = useState<number>(0)
  const navIndexRef = useRef<number>(0)
  const followItemRef = useRef<HTMLDivElement>(null)
  const navItemRefs = list.map(() => useRef<HTMLDivElement>(null))

  const fontSize =
    size === 'small' ? 'text-[12px]' : size === 'default' ? 'text-[14px]' : 'text-[16px]'
  const borderHeight =
    (size === 'small'
      ? 'border-b-[3px]'
      : size === 'default'
        ? 'border-b-[4px]'
        : 'border-b-[5px]') + ' border-solid border-t-0 border-l-0 border-r-0'

  useEffect(() => {
    navAssignment()
    window.addEventListener('resize', windowResize)
    return () => {
      window.removeEventListener('resize', windowResize)
    }
  }, [])

  /**
   * @description: Nav点击
   * @return {type}
   */
  const onClickNav = (index: number) => {
    navIndexRef.current = index
    useNavIndex(index)
    navAssignment()
    onClickNavItemHandler(list[index])
  }

  /**
   * @description: 窗口改变
   * @return {type}
   */
  const windowResize = () => {
    navAssignment()
  }

  /**
   * @description: Nav赋值
   * @param {number} index
   * @return {type}
   */
  const navAssignment = () => {
    const navItem = navItemRefs[navIndexRef?.current]?.current
    const width =
      followType === 'bg' ? navItem?.offsetWidth : navItem && navItem?.offsetWidth - 20 * 2
    const height = navItem?.offsetHeight
    const left = followType === 'bg' ? navItem?.offsetLeft : navItem && navItem?.offsetLeft + 20
    const top = navItem?.offsetTop
    const followItem = followItemRef.current
    if (followItem) {
      followItem.style.width = width + 'px'
      followItem.style.height = height + 'px'
      followItem.style.left = left + 'px'
      followItem.style.top = top + 'px'
    }
  }

  return (
    <div className="follow-nav-component">
      <div className="nav-list flex flex-wrap relative">
        {list && list.length ? (
          list.map((item: any, index: number) => (
            <div
              key={nanoid()}
              ref={navItemRefs[index]}
              className={`nav-item z-10 mr-[12px] mb-[20px] px-[20px] py-[8px] rounded-md ${fontSize} transition-all duration-200 ${
                navIndex === index
                  ? `font-bold`
                  : `text-gray-600 hover:text-gray-800 hover:font-bold hover:cursor-pointer`
              }`}
              onClick={() => onClickNav(index)}
              style={{ color: `${navIndex === index ? color : ''}` }}
            >
              {item[navItemName]}
            </div>
          ))
        ) : (
          <div className="empty pt-[40px]">
            <Empty description="暂无数据..." />
          </div>
        )}
        <div
          ref={followItemRef}
          className={`follow-item absolute z-0 transition-all duration-500 ${followType === 'bg' ? 'bg-gray-200 rounded-md' : borderHeight}`}
          style={{ borderColor: color }}
        />
      </div>
    </div>
  )
}
