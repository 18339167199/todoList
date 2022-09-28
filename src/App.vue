<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useDataStore } from '@/stores/data'
import LocalStorage from './utils/localStroage'
import { useRouter } from 'vue-router'

const dataStore = useDataStore()
const router = useRouter()

dataStore.restoreFromLocalStroage()
dataStore.$subscribe((mutation, state) => {
  LocalStorage.set('state', state)
})

router.beforeEach((to, from, next) => {
  if (!to.meta.requireAuth) {
    next()
    return
  }
  if (dataStore.hasLogined) {
    next()
  } else {
    next('/login')
  }
})
</script>
