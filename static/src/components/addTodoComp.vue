<template>
  <a-row class="add-todo">
    <a-input
      class="add-todo-input"
      v-model:value.trim="createTodoInfo.content"
      placeholder="添加待办"
      size="large"
      ref="addTodoInput"
    >
      <template #prefix>
        <PlusOutlined />
      </template>
      <template #addonAfter>
        <div class="addon-after">

          <!-- 添加备注 -->
          <a-popover
            trigger="click"
            placement="topLeft"
            title="添加备注"
            :overlayStyle="{ 'min-width': '360px' }"
          >
            <template #content>
              <a-textarea
                :rows="4"
                placeholder="待办备注"
                :maxlength="6"
                v-model:value="createTodoInfo.note"
              />
            </template>
            <a-tooltip title="添加备注"  trigger="hover" placement="bottomRight">
              <span class="addon-after-btn">
                <BookOutlined />
              </span>
            </a-tooltip>
          </a-popover>

          <!-- 添加截止日期 -->
          <a-tooltip title="添加截止日期"  trigger="hover" placement="bottomRight">
            <a-date-picker
              class="addon-after-date-picker"
              v-model:value="createTodoInfo.scheduledTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :disabled-date="disabledDate"
              :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
            />
          </a-tooltip>

          <!-- 取消 -->
          <a-tooltip title="清空"  trigger="hover" placement="bottomRight">
            <span class="addon-after-btn" title="取消" @click="clear">
              <CloseOutlined />
            </span>
          </a-tooltip>

          <!-- 确定 -->
          <a-tooltip title="确定"  trigger="hover" placement="bottomRight">
            <span class="addon-after-btn" title="确定" @click="createTodo">
              <CheckOutlined />
            </span>
          </a-tooltip>

        </div>
      </template>
    </a-input>
  </a-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import { reactive } from 'vue'
import { PlusOutlined, BookOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useDataStore } from '@/stores/data'
import type { Todo } from '@/types'

const props = defineProps<{
  groupId: string
}>()
const dataStore = useDataStore()
const createTodoInfo = reactive({
  content: '',
  note: '',
  scheduledTime: ''
})
const addTodoInput = ref()

const disabledDate = (current: Dayjs) => {
  return dayjs().isAfter(current.endOf('day'))
}

const clear = () => {
  createTodoInfo.content = ''
  createTodoInfo.note = ''
  createTodoInfo.scheduledTime = ''
}
const createTodo = () => {
  if (!createTodoInfo.content) {
    message.warn('请输入待办内容！')
    addTodoInput.value?.focus()
    return
  }

  const todo: Todo = {
    id: '',
    groupId: props.groupId,
    done: 0,
    star: 0,
    content: createTodoInfo.content,
    note: createTodoInfo.note,
    createTime: '',
    updateTime: '',
    scheduledTime: createTodoInfo.scheduledTime
  }
  const result = dataStore.addTodo(todo)
  if (result) {
    message.success('添加成功！')
    clear()
  } else {
    message.error('添加失败！')
  }
}
</script>

<style lang="scss" scoped>
.add-todo {
  width: 100%;

  &-input {
    ::v-deep(.ant-input-group) {
      .ant-input-affix-wrapper {
        border-top-left-radius: $border-radius;
        border-bottom-left-radius: $border-radius;
      }
      .ant-input-group-addon {
        border-top-right-radius: $border-radius;
        border-bottom-right-radius: $border-radius;
        padding: 0;
      }
    }

    ::v-deep(.ant-input-prefix) {
      margin-right: 10px
    }

    @mixin hover-style() {
      &:hover {
        background-color: #dedfe0;
      }
    }

    .addon-after {
      display: flex;
      justify-content: flex-start;
      height: 38px;
      background: #fff;
      &-btn {
        flex: 1;
        height: 100%;
        width: 38px;
        border: none;
        color: $text-color;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        @include transition('background-color', $default-transition-duration);
        @include hover-style();
      }
      &-date-picker {
        cursor: pointer;
        flex: 1;
        font-size: 1rem;
        height: 100%;
        width: 38px;
        padding: 0;
        border: none;
        box-shadow: none;
        @include transition('background-color', $default-transition-duration);
        @include hover-style();
        ::v-deep(.ant-picker-input) {
          height: 100%;
          display: flex;
          justify-content: center;
          > input {
            display: none;
          }
          .ant-picker-suffix {
            margin: 0;
            color: $text-color;
          }
          .ant-picker-clear {
            display: none !important;
          }
        }
      }
    }
  }
}
</style>
