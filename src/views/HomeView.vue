<template>
  <a-layout class="home">
    <a-layout-sider>Sider</a-layout-sider>
    <a-layout-content>Content</a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const msg = ref<string>('Home')
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>
