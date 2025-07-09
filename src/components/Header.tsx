import { useEffect, useState } from 'react'

import { NavLink, useLocation } from 'react-router-dom'

import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import type { ItemType } from 'antd/es/menu/interface'

import { RouteItems } from '@/router/config'

const menuItems: MenuProps['items'] = []
RouteItems[0]?.children?.forEach(item => {
  menuItems.push({
    label: <NavLink to={item.path}>{item.name}</NavLink>,
    key: item.path,
  })
})

interface Props {}
export const Header: React.FC<Props> = () => {
  const location = useLocation()
  const [menuCurrent, setMenuCurrent] = useState<string>(location.pathname)

  useEffect(() => {
    menuItems.forEach((item: ItemType | any) => {
      if (location.pathname.includes(item.key)) {
        setMenuCurrent(item.key)
      }
    })
  }, [location.pathname])

  return (
    <div className="header-container">
      <div className="menu">
        <Menu selectedKeys={[menuCurrent]} mode="horizontal" items={menuItems} />
      </div>
    </div>
  )
}
