import { Skeleton } from 'antd'

export const RequestSkeleton = () => {
  return (
    <div className="request-skeleton p-10">
      <Skeleton active />
    </div>
  )
}

export default RequestSkeleton
