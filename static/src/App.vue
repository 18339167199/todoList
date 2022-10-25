<template>
  <a-config-provider :locale="locale">
    <router-view></router-view>
  </a-config-provider> 
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDataStore } from '@/stores/data'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { isTokenEffective } from '@/utils/util'

// antd 中文
dayjs.locale('zh-cn')

const locale = ref(zhCN)
const dataStore = useDataStore()

if (isTokenEffective()) {
  dataStore.restoreUserInfo()
}
</script>
