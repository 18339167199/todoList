<template>
  <a-layout class="login">
    <a-layout-content class="login-main">
      <login-comp
        v-show="!isRegisterMode"
        @switch="switchStaus"
        ref="login"
      />
      <register-comp
        v-show="isRegisterMode"
        @switch="switchStaus"
        ref="register"
      />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginComp from '#/loginComp.vue'
import RegisterComp from '#/registerComp.vue'

const isRegisterMode = ref<boolean>(true)
const switchStaus = () => {
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
