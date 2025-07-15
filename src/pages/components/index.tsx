import { nanoid } from 'nanoid'

import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Button } from 'antd'

import { usePopup } from '@/hooks/usePopup'
import { useTitle } from '@/hooks/useTitle'
import { RouteItems } from '@/router/config'

interface PathItem {
  name: string
  path: string
}
const pathList: PathItem[] = []
RouteItems[0]?.children?.[1]?.children?.forEach(item => {
  pathList.push({
    name: item.name || '',
    path: item.path,
  })
})

interface Props {
  title?: string
}
export const Components: React.FC<Props> = props => {
  useTitle(props.title)
  const location = useLocation()
  const navigate = useNavigate()

  const { popup, show } = usePopup({
    children: <div className="popup-content rainbow-text">这是一个全局弹窗</div>,
  })

  /**
   * @description: Button点击
   * @param {string} item
   * @return {type}
   */
  const onClickButton = (item: PathItem) => {
    if (location.pathname !== item.path) {
      navigate(item.path)
      if (pathList[1].path === item.path) show()
    }
  }

  return (
    <div className="components-container p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="name flex justify-center text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
        Components
      </div>
      <div className="components-items flex flex-wrap items-center justify-center mt-2 sm:mt-4 gap-2 sm:gap-3 md:gap-4">
        {pathList.map((item: PathItem) => (
          <div key={nanoid()} className="components-item">
            <Button
              type={location.pathname === item.path ? 'primary' : 'default'}
              onClick={() => onClickButton(item)}
              size={window.innerWidth < 640 ? 'small' : 'middle'}
              className="text-xs sm:text-sm"
            >
              {item.name}
            </Button>
          </div>
        ))}
      </div>
      <div className="content mt-4 sm:mt-6 md:mt-8">
        <Outlet />
      </div>
      {popup}
    </div>
  )
}
export default Components
