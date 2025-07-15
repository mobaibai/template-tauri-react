import { Icon } from '@/components/Icon'
import { useTitle } from '@/hooks/useTitle'

interface Props {
  title?: string
}
export const Icons: React.FC<Props> = props => {
  useTitle(props.title)

  return (
    <div className="icons-container p-4 sm:p-6 md:p-8 lg:p-10 flex justify-center">
      <div className="icon-items flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 children:text-lg sm:children:text-xl md:children:text-24px">
        <div className="icon-item i-svg-spinners-clock rainbow-text" />
        <div className="icon-item i-svg-spinners-bouncing-ball rainbow-text" />
        <div className="icon-item i-cryptocurrency-color-blk" />
        <div className="icon-item i-eos-icons-application-outlined rainbow-text" />
        <div className="icon-item rainbow-text">
          <Icon name="vite" />
        </div>
      </div>
    </div>
  )
}

export default Icons
