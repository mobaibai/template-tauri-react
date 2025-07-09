import { Outlet } from 'react-router-dom'

interface PageProps {}
export const LayoutPage: React.FC<PageProps> = () => {
  return (
    <div className="layout-container">
      <Outlet />
    </div>
  )
}
