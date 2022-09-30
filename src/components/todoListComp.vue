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
      />
    </div>

    <!-- done todo -->
    <div
      class="undone-todo"
      :span="24"
      v-show="doneTodo.length > 0"
    >
      <div class="fold-button-wrapper">
        <a-button @click="() => { doneTodoShow = !doneTodoShow }">
          <template #icon>
            <DownOutlined
              :class="{
                'fold-button': true,
                rotate: !doneTodoShow
              }"
            />
          </template>
          已完成 {{ doneTodo.length }}
        </a-button>
      </div>
      <div class="undone-todo-wrapper" v-show="doneTodoShow">
        <todo-item-comp
          v-for="todo in doneTodo"
          :key="todo.id"
          :data="todo"
        />
      </div>
    </div>
  </a-row>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import TodoItemComp from '#/todoItemComp.vue'
import { useDataStore } from '@/stores/data'
import { DownOutlined } from '@ant-design/icons-vue'
import type { Todo } from '@/types';

const props = defineProps<{
  groupId: number
}>()

const doneTodoShow = ref<boolean>(true)

const dataStore = useDataStore()

const doneTodo = computed(() => dataStore
  .getTodosByGroupId(props.groupId)
  .filter(todo => !!todo.done)
  .sort((a: Todo, b: Todo) => b.star - a.star))

const undoneTodo = computed(() => dataStore
  .getTodosByGroupId(props.groupId)
  .filter(todo => !todo.done)
  .sort((a: Todo, b: Todo) => b.star - a.star))
</script>

<style lang="scss" scoped>
.todo-main {
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
}
</style>
