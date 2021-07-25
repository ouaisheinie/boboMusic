// 实现一个最简单的指令 添加和删除loading
import { createApp } from 'vue'
import loading from './index'

const loadingDirective = {
  mounted(el, binding) {
    const app = createApp(loading)
    const instance = app.mount(document.createElement('div')) // 动态创建一个实例  挂载一个div到el上
    el.instance = instance

    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) { // 组件更新之后
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function append(el) {
  // 把对应dom对象挂载到对应的el
  el.appendChild(el.instance.$el) // $el 是对应的dom对象
}

function remove(el) {
  el.removeChild(el.instance.$el)
}

export default loadingDirective
