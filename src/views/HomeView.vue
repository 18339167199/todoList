<template>
  <div>{{ msg }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const msg = ref<string>('Home')
</script>

<style lang="scss" scoped>

</style>
