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
      :style="{
        'margin-top': undoneTodo.length === 0 ? '0' : '10px'
      }"
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

    <div style="height: 5rem;"></div>
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
          <a-textarea
            :class="{ active: !!data.curTodo.done }"
            v-model:value="data.curTodo.content"
            :bordered="false"
            :rows="4"
            style="padding-left: 0; padding-right: 0;"
            ref="drawerContentTextarea"
          />
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
          <li @click="data.modalVisible = true"><MinusCircleOutlined />移动到其他分组</li>
          <li @click="updateTodoStatus('done', !!data.curTodo.done ? 0 : 1)">
            <template v-if="!data.curTodo.done">
              <CheckCircleOutlined/>标记为完成
            </template>
            <template v-else>
              <CheckCircleFilled />标记为未完成
            </template>
          </li>
          <li @click="updateTodoStatus('star', !!data.curTodo.star ? 0 : 1)">
            <template v-if="!data.curTodo.star">
              <StarOutlined />标记为重要
            </template>
            <template v-else>
              <StarFilled />标记为不重要
            </template>
          </li>
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
        />
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

  <!-- 移动 todo 到其他分组 Modal -->
  <a-modal
    v-model:visible="data.modalVisible"
    title="请选择分组"
    @ok="moveToGroup"
    @cancel="data.selectedGroupKeys = []"
  >
    <a-table
      :data-source="tableData"
      :columns="tableColumns"
      :pagination="false"
      emptyText="暂无分组"
      size="small"
      :row-selection="{
        selectedRowKeys: data.selectedGroupKeys,
        onChange: onSelectChange,
        type: 'radio',
        columnWidth: '60px'
      }"
    />
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, reactive, onUnmounted, ref } from 'vue'
import TodoItemComp from '#/todoItemComp.vue'
import { useDataStore } from '@/stores/data'
import { DownOutlined } from '@ant-design/icons-vue'
import {
  MinusCircleOutlined,
  FieldTimeOutlined,
  BookFilled,
  DeleteOutlined,
  CheckCircleOutlined,
  CheckCircleFilled,
  StarOutlined,
  StarFilled
} from '@ant-design/icons-vue'
import type { Todo } from '@/types'
import dayjs, { Dayjs } from 'dayjs'
import { Modal, message } from 'ant-design-vue'
import bus from '@/utils/bus'

const props = defineProps<{
  groupId: string,
  searchMode: boolean
}>()

const dataStore = useDataStore()
const data = reactive<{
  doneTodoShow: boolean,
  drawerVisible: boolean,
  searchKeyWord: string,
  modalVisible: boolean,
  selectedGroupKeys: number[],
  curTodo: Todo
}>({
  doneTodoShow: true,
  drawerVisible: false,
  searchKeyWord: '',
  modalVisible: false,
  selectedGroupKeys: [],
  curTodo: {
    id: '',
    groupId: '',
    done: 0,
    star: 0,
    content: '',
    note: '',
    createTime: '',
    updateTime: '',
    scheduledTime: ''
  }
})
const drawerContentTextarea = ref()
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
    id: '',
    groupId: '',
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
const updateTodoStatus = (type: 'done' | 'star', value: 0 | 1) => {
  const result = dataStore.updateTodoStatus({
    id: data.curTodo.id,
    type,
    value
  })
  if (!result) {
    message.error('更新失败！')
    return
  }
  data.curTodo[type] = value
  message.success(type === 'done'
    ? `已标记为${value ? '' : '未'}完成`
    : `已标记为${value ? '' : '不'}重要`
  )
}
const iscurTodoChange = () => {
  const originTodo = dataStore.getTodoById(data.curTodo.id)
  const curTodo = data.curTodo
  if (!originTodo || curTodo.id === '') {
    return false
  }
  return originTodo.content !== curTodo.content ||
    originTodo.note !== curTodo.note ||
    originTodo.scheduledTime !== curTodo.scheduledTime
}
const afterVisibleChange = (bool: boolean) => {
  if (!bool && iscurTodoChange()) {
    saveTodo()
  } else {
    drawerContentTextarea.value?.focus()
  }
}

const tableColumns = [
  {
    title: '分组名称',
    key: 'gname',
    dataIndex: 'gname'
  },
  {
    title: '分组描述',
    key: 'descr',
    dataIndex: 'descr'
  }
]
const tableData = computed(() => dataStore.getGroups
  .filter(group => group.id !== data.curTodo.groupId)
  .map(group => ({ key: group.id, ...group}))
)
const moveToGroup = () => {
  if (data.curTodo.id === '' || data.selectedGroupKeys.length === 0) {
    message.warn('请选择一个分组！')
    return
  }
  const result = dataStore.moveToGroup(data.curTodo.id, data.selectedGroupKeys[0])
  if (result) {
    data.modalVisible = false
    data.drawerVisible = false
    message.success(`待办已移动到"${dataStore.getGroupNameById(data.selectedGroupKeys[0])}"！`)
  } else {
    message.error('待办移动到其他分组失败！')
  }
}
const onSelectChange = (selectedGroupKeys: number[]) => {
  data.selectedGroupKeys = selectedGroupKeys
}

const tagConfig = {
  'finish': { color: 'green', text: '完成' },
  'pending': { color: 'warning', text: '待完成' },
  'expired': { color: 'red', text: '已过期' }
}
const getTodoStatus = computed(() => {
  if (data.curTodo.done) {
    return tagConfig.finish
  }
  if (data.curTodo.scheduledTime) {
    const isExpired = new Date(data.curTodo.scheduledTime).getTime() > new Date().getTime()
    return isExpired ? tagConfig.pending : tagConfig.expired 
  }
  return tagConfig.pending
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

const passKeyWordFunc = (keyWord: string) => {
  data.searchKeyWord = keyWord
}
bus.on('passKeyWord', passKeyWordFunc)

onUnmounted(() => {
  bus.off('passKeyWord', passKeyWordFunc)
})
</script>

<style lang="scss" scoped>
.todo-main {
  position: relative;
  padding-top: 10px;
  width: 100%;
  flex-direction: column;

  .done-todo {
    width: 100%;
  }

  .undone-todo {
    width: 100%;
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
      font-size: 1rem;
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
