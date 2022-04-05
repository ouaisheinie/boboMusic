import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
// 全局注册自定义指令
import loadingDirective from '@/components/base/loading/directive'

// 引入全局样式文件
import './assets/scss/index.scss'

createApp(App).use(store).use(router).use(lazyPlugin, {
  loading: require('@/assets/images/logo@2x.png')
}).directive('loading', loadingDirective).mount('#app')
