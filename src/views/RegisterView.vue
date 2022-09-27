<template>
  <div>{{ msg }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const msg = ref<string>('RegisterView')

const say = () => {
  console.log('Hello')
}
</script>

<style scoped>

</style>
