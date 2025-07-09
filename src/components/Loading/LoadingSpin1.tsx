interface Props {}
export const LoadingSpin1: React.FC<Props> = () => {
  return (
    <div className="loading-spin-component w-full h-full flex-center relative bg-[rgba(25,28,41,0.9)] opacity-90">
      <div className="loader relative w-15em h-15em bg-[linear-gradient(-225deg,#ff0090_0%,#9f32ff_52%,#0095ff_100%)] rounded-50% animate-spin children:absolute children:w-full children:h-full children:rounded-inherit children:bg-inherit children:after:absolute children:after:content-[''] children:after:top-10px children:after:right-10px children:after:bottom-10px children:after:left-10px children:after:bg-#222 children:after:rounded-inherit">
        <span className="blur-12px"></span>
        <span className="blur-24px"></span>
        <span className="blur-48px"></span>
        <span className="blur-96px"></span>
      </div>
      <div className="text absolute animate-pulse c-#999 text-14px">加载中...</div>
    </div>
  )
}

export default LoadingSpin1
