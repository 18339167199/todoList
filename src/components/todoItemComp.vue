<template>
  <a-row
    title="点击查看更多信息"
    :class="{
      'todo-item': true,
      'active': data.done
    }"
  >
    <div title="标记为完成" class="check" @click.stop="onDone">
      <span class="circle">
        <CheckOutlined />
      </span>
    </div>
    <div class="content">{{ data.content }}</div>
    <div class="star" title="标记为重要" @click.stop="onStar">
      <StarFilled v-show="data.star"/>
      <StarOutlined v-show="!data.star"/>
    </div>
  </a-row>
</template>
  
<script lang="ts" setup>
import type { Todo } from '@/types'
import { CheckOutlined, StarFilled, StarOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  data: Todo
}>()

const onStar = () => {
  console.log('star')
}

const onDone = () => {
  console.log('onDone')
}
</script>

<style lang="scss" scoped>
$height: 40px;

.todo-item {
  height: $height;
  margin-bottom: 4px;
  background: #fff;
  border-radius: $border-radius;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center999;

  &.active {
    .check {
      .circle {
        background-color: #5E5F60;
        ::v-deep(.anticon) {
          color: #fff;
          font-weight: bolder;
          opacity: 1;
        }
        &:hover {
          ::v-deep(.anticon) {
            color: #fff;
          }
        }
      }
    }
    .content {
      color: #777777;
      text-decoration: line-through;
    }
  }

  .check {
    position: relative;
    height: 100%;
    width: 40px;
    text-align: center;
    line-height: $height;
    flex-grow: 0;
    
    .circle {
      position: absolute;
      display: block;
      width: 25px;
      height: 25px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      border: 2px solid #5E5F60;
      cursor: pointer;
      @include transition('background-color', $default-transition-duration);
      background: #fff;

      ::v-deep(.anticon) {
        opacity: 0;
        @include transition('opacity', $default-transition-duration);
      }

      &:hover {
        ::v-deep(.anticon) {
          color: $text-color;
          opacity: 1;
        }
      }
    }
  }
  .content {
    flex-grow: 1;
    line-height: $height;
    text-align: left;
    padding: 0 2%;
    font-size: 14px;
    color: $text-color;
    &.active {
      text-decoration: line-through;
    }
  }
  .star {
    flex-grow: 0;
    width: 40px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $text-color;
    ::v-deep(.anticon) {
      cursor: pointer;
    }
    .star-filled {
      font-size: 19px;
    }
  }
}
</style>
