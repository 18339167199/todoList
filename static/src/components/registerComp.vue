<template>
  <div class="register">
    <div class="register-wrapper">
      <h1>Todo</h1>
      <a-form
        name="registerForm"
        class="form"
        layout="vertical"
        :model="formState"
        @finish="register"
        @finishFailed="validateFailed"
        ref="registerForm"
      >
        <!-- input -->
        <a-form-item
          v-for="(formItem, key) in formItems"
          :key="key"
          :label="formItem.label"
          :name="key"
          :rules="formItem.rules"
          validateFirst
        >
          <a-input
            v-if="formItem.type === 'text'"
            size="large"
            v-model:value="formState[key]"
            :placeholder="formItem.placeholder"
          />
          <a-input-password
            v-else-if="formItem.type === 'password'"
            size="large"
            v-model:value="formState[key]"
            :placeholder="formItem.placeholder"
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
              注册
            </a-button>
          </a-row>
        </a-form-item>
      </a-form>
      <div class="to-login">
        <p class="p" @click="() => { emit('switch') }">
          <span>已有账号？去登陆！</span>
          <arrow-right-outlined class="arrow"/>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ArrowRightOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { registerApi } from '@/api/user'

type FormState = {
  username: string,
  password: string,
  dPassword: string,
  email: string,
  nikeName: string
}

type FormConfig = {
  type: 'text' | 'password',
  label: string,
  placeholder: string
  rules?: unknown
}

const emit = defineEmits(['switch'])
const registerForm = ref<FormInstance>()
const formState = reactive<FormState>({
  username: '',
  password: '',
  dPassword: '',
  email: '',
  nikeName: ''
})
const validateDpassword = () => {
  return new Promise((resolve, reject) => {
    if (formState.dPassword !== formState.password) {
      reject(new Error('两次输入的密码不一致，请检查'))
    }
    resolve(true)
  })
}
const formItems = reactive<{[propName in keyof FormState]: FormConfig}>({
  username: {
    type: 'text',
    label: '用户名',
    placeholder: '请输入用户名',
    rules: [
      { required: true, message: '请输入用户名' },
      { min: 4, max: 16, message: '用户名长度为 8 ~ 16 个字符' }
    ]
  },
  password: {
    type: 'password',
    label: '密码',
    placeholder: '请输入密码',
    rules: [
      { required: true, message: '请输入密码' },
    ]
  },
  dPassword: {
    type: 'password',
    label: '确认密码',
    placeholder: '请确认密码',
    rules: [
      { required: true, message: '请确认密码' },
      { validator: validateDpassword }
    ]
  },
  email: {
    type: 'text',
    label: '邮箱',
    placeholder: '请输入邮箱'
  },
  nikeName: {
    type: 'text',
    label: '昵称',
    placeholder: '请输入昵称'
  }
})
const register = async () => {
  try {
    const { code, msg } = await registerApi({
      username: formState.username,
      password: formState.password,
      email: formState.email,
      nikeName: formState.nikeName
    })

    if (code === 0) {
      emit('switch')
      registerForm.value?.resetFields()
      message.success('注册成功!')
    } else {
      message.error(msg)
    }
  } catch (err: any) {
    console.log(err)
    message.error(err.message)
  }
}
const validateFailed = () => {
  message.warn('必填项未填写完整或格式不正确!')
}
</script>

<style lang="scss" scoped>
$main-body-bg: #323542;

.register {
  position: relative;
  width: 80%;
  max-width: 500px;
  margin: 0 auto;
  border-radius: $border-radius;
  background: $main-body-bg;
  box-sizing: border-box;
  transition: opacity 1s cubic-bezier(.075,.82,.165,1);

  &-wrapper {
    padding: 2rem;
  }

  h1 {
    font-weight: bolder;
    margin-top: 0;
    margin-bottom: .5rem;
    font-size: 2.5rem;
    background: -webkit-linear-gradient(315deg, #42d392 35%, #323542);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .form {
    color: #fff;
    ::v-deep(.ant-form-item-label > label) {
      color: #fff;
      opacity: .8;
    }
  }

  .to-login {
    margin: 0;
    text-align: right;
    font-size: .5rem;
    color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    
    .p {
      cursor: pointer;
      margin: 0;
      &:hover {
        color: #42d392;
      }
    }
    .arrow {
      font-size: .8rem;
    }
  }
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
