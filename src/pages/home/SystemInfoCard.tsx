import React from 'react'

interface SystemInfoCardProps {
  children: React.ReactNode
  className?: string
}

const SystemInfoCard: React.FC<SystemInfoCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`system-info-card relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 shadow-2xl transition-all duration-500 hover:bg-white/30 hover:dark:bg-black/30 hover:shadow-3xl hover:scale-105 ${className}`}
    >
      {/* 毛玻璃效果的内层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 dark:to-transparent" />
      {/* 边框高光效果 */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent"
        style={{
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
        }}
      />
      {/* 内容区域 */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default SystemInfoCard
