import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// antd 按需加载
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    assetsInlineLimit: 10240, // 10kb
    minify: 'terser',
    terserOptions: {
      compress: { // 打包清除 console.log 和 debugger
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js', // 打包生成的文件分类放好
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks(id) { // 打包拆分过大的文件
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    },
    chunkSizeWarningLimit: 500, // 打包文件大小超过 500k 警告
  },
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
