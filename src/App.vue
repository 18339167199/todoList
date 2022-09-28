<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useDataStore } from '@/stores/data'
import LocalStorage from './utils/localStroage'

const dataStore = useDataStore()
dataStore.restoreFromLocalStroage()
dataStore.$subscribe((mutation, state) => {
  LocalStorage.set('state', state)
})
</script>
