<template>
  <div>{{ `${msg} - ${todoId}` }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const msg = ref<string>('TodoView')
const todoId = route.params.id
const say = () => {
  console.log('Hello')
}
</script>

<style scoped>

</style>
