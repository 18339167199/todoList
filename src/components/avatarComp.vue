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
@mixin ul-style() {
  padding: 0;
  list-style: none;
  margin-bottom: 0;
  &.has-hover-style {
    li {
      cursor: pointer;
      @include transition('background-color', $default-transition-duration);
      &:hover {
        background-color: $hover-color;
        &::after { opacity: 0; }
      }
    }
  }
  li {
    position: relative;
    border-radius: $border-radius;
    padding: 10px 10px;

    &::after {
      content: '';
      border-top: 1px solid $border-color;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      bottom: 0;
      display: block;
      opacity: 1;
      @include transition('opacity', $default-transition-duration);
    }

    ::v-deep(.a-icon) {
      margin-right: 5px;
      margin-top: 1px;
    }
    &:last-of-type {
      &::after { display: none; }
    }

    .label {
      white-space: nowrap;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-right: 5px;
    }
  }
}

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
