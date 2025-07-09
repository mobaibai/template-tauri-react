import { Skeleton } from 'antd'

export const ModalSkeleton = () => {
  return (
    <div className="modal-skeleton p-[20px]">
      <Skeleton active />
    </div>
  )
}
export default ModalSkeleton
