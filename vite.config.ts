import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// antd 按需加载
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // antd 按需加载插件配置
    Components({
      resolvers: [AntDesignVueResolver()]
    })
  ],
  resolve: {
    // 配置别名
    alias: {
      '@': path.resolve(__dirname, './src'),
      '#': path.resolve(__dirname, './src/components')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 全局的 scss 变量和 mixin
        additionalData: '@import "@/assets/scss/globalVar.scss"; @import "@/assets/scss/globalMixin.scss";'
      }
    }
  }
})
