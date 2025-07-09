import './index.scss'

interface Props {}
export const LoadingSpin2: React.FC<Props> = () => {
  return (
    <div className="loading-spin2-component w-full h-full flex-center opacity-80">
      <div id="loader-wrapper">
        <div id="loader"></div>
        <div className="loader-section section-left"></div>
        <div className="loader-section section-right"></div>
      </div>
    </div>
  )
}

export default LoadingSpin2
