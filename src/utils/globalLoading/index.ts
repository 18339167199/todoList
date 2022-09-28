import globalLoading from './globalLoading.vue'
import { createApp, reactive } from 'vue'

const props = reactive({
  show: false,
  title: ''
})
const loadingApp = createApp(
  globalLoading,
  { data: props }
).mount(document.createElement('div'))

document.body.appendChild(loadingApp.$el)

export default {
  show(title = '加载中...') {
    props.show = true
    props.title = title
  },
  hide() {
    props.show = false
  },
  getStatus() {
    return props.show
  }
}
