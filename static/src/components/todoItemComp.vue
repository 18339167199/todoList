<template>
  <a-row
    title="点击查看更多信息"
    :class="{
      'todo-item': true,
      'active': props.data.done
    }"
  >
    <div
      :title="props.data.done ? '标记为未完成' : '标记为完成'"
      class="check"
      @click.stop="updateTodoStatus('done', !!props.data.done ? 0 : 1)"
    >
      <span class="circle">
        <CheckOutlined />
      </span>
    </div>
    <div class="content">{{ props.data.content }}</div>
    <div
      class="star"
      title="标记为重要"
      @click.stop="updateTodoStatus('star', !!props.data.star ? 0 : 1)"
    >
      <StarFilled v-show="props.data.star"/>
      <StarOutlined v-show="!props.data.star"/>
    </div>
  </a-row>
</template>
  
<script lang="ts" setup>
import type { Todo } from '@/types'
import { CheckOutlined, StarFilled, StarOutlined } from '@ant-design/icons-vue'
import { useDataStore } from '@/stores/data'
import { message } from 'ant-design-vue'

const props = defineProps<{ data: Todo }>()
const dataStore = useDataStore()
const updateTodoStatus = async (type: 'done' | 'star', value: 0 | 1) => {
  const result = await dataStore.updateTodoStatus({ id: props.data.id, type, value })
  if (result) {
    message.success(type === 'done'
      ? `已标记为${value ? '' : '未'}完成`
      : `已标记为${value ? '' : '不'}重要`
    )
  } else {
    message.error('操作失败！')
  }
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
  align-items: center;
  flex-wrap: nowrap;

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
    flex-shrink: 0;
    
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
    height: 100%;
    line-height: $height;
    text-align: left;
    padding: 0 2%;
    font-size: 14px;
    color: $text-color;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    flex-grow: 1;
    flex-shrink: 1;
    &.active {
      text-decoration: line-through;
    }
  }
  .star {
    width: 40px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $text-color;
    font-size: 20px;
    cursor: pointer;
    flex-grow: 0;
    flex-shrink: 0;
  }
}
</style>
