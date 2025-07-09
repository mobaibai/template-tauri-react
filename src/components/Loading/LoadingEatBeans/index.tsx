import './index.scss'

interface Props {}
/**
 * @description: 糖豆人
 * @return {type}
 */
export const LoadingEatBeans: React.FC<Props> = () => {
  return (
    <div className="loading-eat-beans-component w-full h-full flex-center bg-[rgba(25,28,41,0.7)] text-5rem">
      <div className="pacman-loader" aria-live="polite"></div>
    </div>
  )
}

export default LoadingEatBeans
