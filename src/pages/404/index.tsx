import { NavLink } from 'react-router-dom'

import { Button } from 'antd'

import page404 from '@/assets/bgs/page404.svg'
import { useTitle } from '@/hooks/useTitle'

type Props = {
  title?: string
}
const EmptyPage: React.FC<Props> = props => {
  useTitle(props.title)

  return (
    <div className="empty-page-container h-screen flex-center flex-col space-y-50px">
      <div className="empty flex-col flex-center space-y-20px">
        <div className="img">
          <img className="h-50" src={page404} alt="" />
        </div>
        <div className="text text-14px c-#ccc">页面迷路了</div>
      </div>
      <div className="nav">
        <NavLink className="c-[var(--theme-primary)]" to={'/'}>
          <Button type="primary">返回首页</Button>
        </NavLink>
      </div>
    </div>
  )
}
export default EmptyPage
