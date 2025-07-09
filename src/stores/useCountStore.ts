import { create } from 'zustand'

interface Count {
  count: number
  inc: () => void
  cut: () => void
}
/**
 * @description: 使用数量状态
 * @param {type} create
 * @return {type}
 * @example:
 * const { count, inc, cut } = useCountStore()
 * --HTML--
 * <div className='count-container'>
 *   <button onClick={() => inc()}>增加</button>
 *   <button onClick={() => cut()}>减少</button>
 *   <p>当前数量: {count}</p>
 * </div>
 */
export const useCountStore = create<Count>(set => ({
  count: 0,
  inc: () => set(state => ({ count: state.count >= 100 ? 100 : state.count + 1 })),
  cut: () => set(state => ({ count: state.count <= 0 ? 0 : state.count - 1 })),
}))
