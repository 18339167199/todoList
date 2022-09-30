import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import '@/assets/scss/main.scss'

// antd message style
import 'ant-design-vue/lib/message/style/index.css'
import 'ant-design-vue/lib/modal/style/index.css'

// globalLoading
import './utils/globalLoading'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
