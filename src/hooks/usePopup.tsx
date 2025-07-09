import { lazy, useState } from 'react'

import ReactDOM from 'react-dom'

import type { PopupType } from '@/components/Popup'

const Popup = lazy(() => import('@/components/Popup'))

/**
 * @description: 弹窗
 * @param {PopupType} options
 * @return {type}
 * @example:
 * const { popup, show, hide, toggle } = usePopup({
    children: <div className='popup-content'>这是一个全局弹窗</div>
  })
 * --HTML--
 * <div className='popup-container'>
 *   <button onClick={() => show()}>打开弹窗</button>
 *   {popup}
 * </div>
 */
export const usePopup = (options: PopupType) => {
  const { isOpen = false, title, maskClosable, width, className, style, children } = options
  const [open, setOpen] = useState(isOpen)
  const popup = ReactDOM.createPortal(
    <Popup
      isOpen={open}
      title={title}
      maskClosable={maskClosable}
      width={width}
      className={className}
      style={style}
      onCancel={() => setOpen(false)}
    >
      {children}
    </Popup>,
    document.getElementById('root') as HTMLElement
  )
  return {
    popup,
    show() {
      setOpen(true)
    },
    hide() {
      setOpen(false)
    },
    toggle() {
      setOpen(!open)
    },
  }
}
