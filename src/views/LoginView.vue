<template>
  <div>{{ msg }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const msg = ref<string>('LoiginView')

const say = () => {
  console.log('Hello')
}
</script>

<style scoped>

</style>
