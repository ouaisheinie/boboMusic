import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

import { onMounted, ref, onUnmounted } from 'vue'
BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef, options) { // 传入的是一个ref对象
  const scroll = ref(null)

  // onMounted  onUnmounted 写在这里面  再到组件中调用是一样的
  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      ...options,
      observeDOM: true
    })
  })

  onUnmounted(() => {
    scroll.value.destroy() // scroll 实例的卸载逻辑
  })
}
