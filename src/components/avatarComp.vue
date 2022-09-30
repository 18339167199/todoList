<template>
  <a-row class="user" :style="{ height: props.height }">
    <a-popover
      trigger="click"
      placement="bottom"
    >
      <template #content>
        <ul class="user-operation-list has-hover-style">
          <!-- <li @click="toUser">编辑个人信息</li> -->
          <li @click="logout">退出登录</li>
        </ul>
      </template>

      <a-row class="user-wrapper">
        <a-avatar :size="parseInt(props.height.replace('px', '')) - 20" class="avatar">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <div class="info">
          <a-col class="info-name" :span="24">{{ dataStore.getUserInfo.nikeName || 'todo' }}</a-col>
          <a-col class="info-email" :span="24">{{ dataStore.getUserInfo.email }}</a-col>
        </div>
      </a-row>
    </a-popover>
  </a-row>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { UserOutlined } from '@ant-design/icons-vue'
import { useDataStore } from '@/stores/data'

const props = defineProps<{
  height: string
}>()

const router = useRouter()
const dataStore = useDataStore()

const logout = () => {
  dataStore.loginOut()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.user {
  cursor: pointer;
  transition: all .25s;
  border-radius: $border-radius;
  padding-top: 10px;
  padding-bottom: 10px;

  &:hover {
    margin-left: -5px;
    margin-right: -5px;
    padding-left: 5px;
    padding-right: 5px;
    background: $hover-color;
    color: $text-color;
  }

  .user-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .info {
      text-align: left;
      padding-left: 15px;
      flex-grow: 1;
      &-name {
        flex-grow: 1;
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        padding-bottom: 2px;
      }
      &-email {
        flex-grow: 1;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        padding-top: 2px;
      }
    }
  }
}

.user-operation-list {
  @include ul-style()
}
</style>
