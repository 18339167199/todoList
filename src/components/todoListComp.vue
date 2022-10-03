<template>
  <a-row class="todo-main">
    <!-- undone todo -->
    <div
      class="done-todo"
      :span="24"
      v-show="undoneTodo.length > 0"
    >
      <todo-item-comp
        v-for="todo in undoneTodo"
        :key="todo.id"
        :data="todo"
        @click="openDrawer(todo)"
      />
    </div>

    <!-- done todo -->
    <div
      class="undone-todo"
      :span="24"
      v-show="doneTodo.length > 0"
    >
      <div class="fold-button-wrapper">
        <a-button @click="() => { data.doneTodoShow = !data.doneTodoShow }">
          <template #icon>
            <DownOutlined
              :class="{
                'fold-button': true,
                rotate: !data.doneTodoShow
              }"
            />
          </template>
          已完成 {{ doneTodo.length }}
        </a-button>
      </div>
      <div class="undone-todo-wrapper" v-show="data.doneTodoShow">
        <todo-item-comp
          v-for="todo in doneTodo"
          :key="todo.id"
          :data="todo"
          @click="openDrawer(todo)"
        />
      </div>
    </div>

    <!-- 无数据时展示 -->
    <div
      class="no-todo-show"
      v-show="!doneTodo.length && !undoneTodo.length"
    >
      暂无待办
    </div>
  </a-row>

  <a-drawer
    class="todo-drawer"
    v-model:visible="data.drawerVisible"
    title="待办详情"
    placement="right"
    width="30%"
    @after-visible-change="afterVisibleChange"
  >
    <a-row>
      <!-- preview -->
      <a-col class="todo-drawer-content-wrapper" :span="24">
        <div class="preview-header">
          <BookFilled class="icon" />
          <span class="">待办内容:</span>
          <a-tag :color="getTodoStatus.color">{{ getTodoStatus.text }}</a-tag>
        </div>
        <div class="preview-content">
          <a-input
            :class="{ active: !!data.curTodo.done }"
            v-model:value="data.curTodo.content"
            :bordered="false"
            style="padding-left: 0; padding-right: 0;"
          ></a-input>
        </div>
      </a-col>

      <!-- action -->
      <a-col
        class="todo-drawer-content-wrapper"
        :span="24"
        style="
          padding-left: 10px;
          padding-right: 10px;
        "
      >
        <ul class="action has-hover-style">
          <li><MinusCircleOutlined />移动到其他分组</li>
        </ul>
      </a-col>

      <!-- time -->
      <a-col
        class="todo-drawer-content-wrapper"
        :span="24"
        style="
          padding-left: 10px;
          padding-right: 10px;
        "
      >
        <ul class="time">
          <li><FieldTimeOutlined /> 创建于: &nbsp;{{ data.curTodo.createTime }}</li>
          <li v-if="!!data.curTodo.updateTime"><FieldTimeOutlined /> 更新于: &nbsp;{{ data.curTodo.updateTime }}</li>
          <li>
            <FieldTimeOutlined />
            截止于: &nbsp;
            <a-date-picker
              class="time-date-picker"
              v-model:value="data.curTodo.scheduledTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :disabled-date="disabledDate"
              :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
              placeholder="添加截止日期"
            />
          </li>
        </ul>
      </a-col>

      <!-- note -->
      <a-col class="todo-drawer-content-wrapper" :span="24">
        <div>备注:</div>
        <a-textarea
          class="note-textarea"
          :rows="8"
          show-count
          :maxlength="200"
          v-model:value="data.curTodo.note"
        ></a-textarea>
      </a-col>

      <!-- button -->
      <a-col :span="24" style="text-align: right;">
        <a-button
          class="btn-delete"
          type="link"
          danger
          @click="deleteTodo"
        >
          <template #icon><DeleteOutlined /></template>
          删除
        </a-button>
        <a-button
          type="primary"
          @click="saveTodo"
        >确定</a-button>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script lang="ts" setup>
import { computed, reactive, onUnmounted } from 'vue'
import TodoItemComp from '#/todoItemComp.vue'
import { useDataStore } from '@/stores/data'
import { DownOutlined } from '@ant-design/icons-vue'
import { MinusCircleOutlined, FieldTimeOutlined, BookFilled, DeleteOutlined } from '@ant-design/icons-vue'
import type { Todo } from '@/types'
import dayjs, { Dayjs } from 'dayjs'
import { Modal, message } from 'ant-design-vue'
import bus, { PASSKEYWORD } from '@/utils/bus'

const props = defineProps<{
  groupId: number,
  searchMode: boolean
}>()

const dataStore = useDataStore()
const data = reactive<{
  doneTodoShow: boolean,
  drawerVisible: boolean,
  searchKeyWord: string,
  curTodo: Todo
}>({
  doneTodoShow: true,
  drawerVisible: false,
  searchKeyWord: '',
  curTodo: {
    id: -1,
    groupId: -1,
    done: 0,
    star: 0,
    content: '',
    note: '',
    createTime: '',
    updateTime: '',
    scheduledTime: ''
  }
})
const disabledDate = (current: Dayjs) => {
  return dayjs().isAfter(current.endOf('day'))
}
const openDrawer = (todo: Todo) => {
  let prop: keyof Todo
  for (prop in todo) {
    (data.curTodo[prop] as Todo[keyof Todo]) = todo[prop] 
  }
  data.drawerVisible = true
}
const resetCurTodo = () => {
  data.curTodo = {
    id: -1,
    groupId: -1,
    done: 0,
    star: 0,
    content: '',
    note: '',
    createTime: '',
    updateTime: '',
    scheduledTime: ''
  }
}
const deleteTodo = () => {
  Modal.confirm({
    centered: true,
    content: `确定要删除待办“${data.curTodo.content}”吗？`,
    cancelText: '取消',
    onOk() {
      const result = dataStore.deleteTodo(data.curTodo.id)
      if (result) {
        message.success('删除成功！')
      } else {
        message.error('删除失败！')
      }
      data.drawerVisible = false
    }
  })
}
const saveTodo = () => {
  const result = dataStore.updateTodo(data.curTodo)
  if (result) {
    resetCurTodo()
    message.success('更新成功！')
    data.drawerVisible = false
  } else {
    message.error('更新失败！')
  }
}
const iscurTodoChange = () => {
  const originTodo = dataStore.getTodoById(data.curTodo.id)
  const curTodo = data.curTodo
  if (!originTodo || curTodo.id === -1) {
    return false
  }
  return originTodo.content !== curTodo.content ||
    originTodo.note !== curTodo.note ||
    originTodo.scheduledTime !== curTodo.scheduledTime
}
const afterVisibleChange = (bool: boolean) => {
  if (!bool && iscurTodoChange()) {
    saveTodo()
  }
}

const getTodoStatus = computed(() => {
  if (data.curTodo.done) {
    return {
      color: 'green',
      text: '完成'
    }
  }
  if (data.curTodo.scheduledTime) {
    const isExpired = new Date(data.curTodo.scheduledTime).getTime() > new Date().getTime()
    return {
      color: isExpired ? 'warning' : 'danger',
      text: isExpired ? '待完成' : '已过期'
    }
  }
  return {
    color: 'warning',
    text: '待完成'
  }
})

const doneTodo = computed(() => {
  let dataSource = props.searchMode
    ? dataStore.searchTodo(data.searchKeyWord)
    : dataStore.getTodosByGroupId(props.groupId)
  return dataSource.filter(todo => !!todo.done).sort((a: Todo, b: Todo) => b.star - a.star)
})

const undoneTodo = computed(() => {
  let dataSource = props.searchMode
    ? dataStore.searchTodo(data.searchKeyWord)
    : dataStore.getTodosByGroupId(props.groupId)
  return dataSource.filter(todo => !todo.done).sort((a: Todo, b: Todo) => b.star - a.star)
})

bus.on(PASSKEYWORD, (keyWord: string) => {
  data.searchKeyWord = keyWord
})

onUnmounted(() => {
  bus.off(PASSKEYWORD)
})
</script>

<style lang="scss" scoped>
.todo-main {
  position: relative;
  padding-top: 10px;
  width: 100%;
  flex-direction: column;

  .undone-todo {
    margin-top: 10px;
    text-align: left;
    .fold-button-wrapper {
      margin-bottom: 4px;
      ::v-deep(.ant-btn) {
        border-radius: $border-radius;
        height: 40px;
        background: rgba(255,255,255,.6);
      }
      .fold-button {
        transition: all $default-transition-duration;
        transform: translateY(1px);
        &.rotate {
          transform: rotate(180deg) translateY(2px);
        }
      }
    }
  }

  .no-todo-show {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: .8rem;
    font-weight: bolder;
  }
}

.todo-drawer {

  &-content-wrapper {
    border: 1px solid #dcdfe6;
    border-radius: $border-radius;
    padding: 10px 20px;
    margin-bottom: 10px;
    ::v-deep(.anticon) {
      font-size: 16px;
    }
  }

  .preview {
    &-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      > * {
        margin-right: 5px;
      }
      ::v-deep(.ant-tag) {
        border-radius: $border-radius;
        margin-right: 0;
      }
    }
    &-content {
      ::v-deep(.ant-input) {
        &.active {
          color: #777;
          text-decoration: line-through;
        }
      }
    }
  }

  .action, .time {
    @include ul-style()
  }

  .time {
    &-date-picker {
      border: none;
      box-shadow: none;
      padding: 0;
      ::v-deep(.ant-picker-suffix) {
        display: none;
      }
    }
  }

  .note-textarea {
    ::v-deep(.ant-input) {
      border: none;
      padding: 0;
      &:focus {
        box-shadow: none;
      }
    }
  }

}
</style>
