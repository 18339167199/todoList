<template>
  <div class="login-box">
    <h1>Todo</h1>
    <a-form
      class="form"
      :model="formState"
      @finish="login"
      @finishFailed="validateFailed"
      ref="form"
    >
      <!-- username -->
      <a-form-item
        name="username"
        :rules="[{ required: true, message: '请输入账户名!' }]"
      >
        <a-input
          size="large"
          v-model:value="formState.username"
          placeholder="请输入账号"
        />
      </a-form-item>

      <!-- password -->
      <a-form-item
        name="password"
        :rules="[{ required: true, message: '请输入密码!' }]"
      >
        <a-input-password
          size="large"
          v-model:value="formState.password"
          placeholder="请输入密码"
        />
      </a-form-item>

      <!-- submit button -->
      <a-form-item >
        <a-row style="width: 100%; justify-content: flex-end;">
          <a-button
            class="login-btn"
            html-type="submit"
            size="default"
          >
            登录
          </a-button>
        </a-row>
        
      </a-form-item>

    </a-form>
    <div class="register">
      <p class="p">
        <span>还没有账号？去注册！</span>
        <arrow-right-outlined class="arrow"/>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { ArrowRightOutlined } from '@ant-design/icons-vue'

type FormState = {
  username: string,
  password: string
}

const formState = reactive<FormState>({
  username: '',
  password: ''
})

const login = () => {
  console.log('login')
}

const validateFailed = () => {
  console.log('validateFailed!')
}
</script>

<style lang="scss" scoped>
$main-body-bg: #323542;

.login-box {
  width: 50%;
  max-width: 400px;
  border-radius: $border-radius;
  background: $main-body-bg;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;

  h1 {
    font-weight: bolder;
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 2.5rem;
    background: -webkit-linear-gradient(315deg, #42d392 35%, #323542);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .icon {
    justify-content: center;
    font-size: 5rem;
    margin-bottom: 1rem;
  }

  .register {
    margin: 0;
    text-align: right;
    font-size: .5rem;
    color: #fff;

    .p {
      cursor: pointer;
      margin: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      &:hover {
        color: #42d392;
      }

      .arrow {
        font-size: .8rem;
      }
    }
  }
}
</style>
