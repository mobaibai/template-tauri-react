import { usePopup } from '@/hooks/usePopup'
import { useTitle } from '@/hooks/useTitle'

interface Props {
  title?: string
}
const Modal: React.FC<Props> = props => {
  useTitle(props.title)

  const { popup, show } = usePopup({
    children: <div className="popup-content rainbow-text">这是一个全局弹窗</div>,
  })

  return (
    <div className="modal-container p-4 sm:p-6 md:p-8 lg:p-10 flex justify-center">
      {popup}
      <span
        className="cursor-pointer rainbow-text text-sm sm:text-base md:text-lg hover:scale-105 transition-transform"
        onClick={show}
      >
        弹窗演示
      </span>
    </div>
  )
}
export default Modal
