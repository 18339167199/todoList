<template>
  <a-layout class="login">
    <a-layout-content class="login-main">
      <login-comp
        v-show="!isRegisterMode"
        ref="login"
      />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginComp from '#/loginComp.vue'

const isRegisterMode = ref<boolean>(false)
const switchToRegister = () => {
  isRegisterMode.value = !(isRegisterMode.value)
}
</script>

<style lang="scss" scoped>
$bgcolor: rgb(212, 241, 239);
$main-body-bg: #323542;
$text-color: #fff;

.login {
  height: 100%;
  background: $bgcolor;
  color: $text-color;

  &-main {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
