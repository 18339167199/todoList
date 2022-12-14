<template>
  <a-layout class="home">
    <a-layout-sider
      class="sidebar"
      width="350px"
    >
      <avatar-comp :height="data.avatarH"/>
      <div
        class="group-wrapper"
        :style="{ height: `calc(100% - ${data.avatarH})` }"
      >

      <!-- search -->
      <a-row>
        <a-input-search
          class="search-input"
          v-model:value.trim="data.searchKeyWord"
          placeholder="搜索待办"
          size="large"
          @search="onSearch"
          @change="searchKeyWordChange"
        >
          <template #enterButton>
            <a-button>
              <template #icon><SearchOutlined /></template>
            </a-button>
          </template>
        </a-input-search>
      </a-row>
      
      <!-- group -->
      <a-row class="groups">
        <a-col
          v-for="group in dataStore.getGroups"
          :key="group.id"
          :span="24"
        >
          <group-comp
            :data="group"
            :selected="data.selectedGroupId === group.id"
            @select="selectGroup"
            @openDrawer="openDrawer"
          />
        </a-col>
      </a-row>

      <!-- group manage bar -->
      <a-row class="groups-m-bar">
        <a-button class="group-m-btn" @click="openDrawer(DRAWER_TYPE.ADD_GROUP)">
          <template #icon><PlusOutlined /></template>
          添加分组
        </a-button>

        <!-- <a-tooltip
          overlayClassName="btn-tooltip"
          placement="topRight"
          width="auto"
          trigger="hover"
          title="删除分组"
          color="#108ee9"
          arrow-point-at-center
        >
          <a-button class="group-add-btn" @click="openDrawer(DRAWER_TYPE.DELETE_GROUP)">
            <template #icon><DeleteOutlined /></template>
          </a-button>
        </a-tooltip> -->
      </a-row>
      </div>

      <div style="position: absolute; bottom: 10%; left: 50%; transform: translate(-50%, 0); opacity: 0.4; user-select: none; -webkit-user-drag: none; font-size: 1rem">todoList v3.0</div>
    </a-layout-sider>
    <a-layout-content class="main" :data-color-mode="data.themeNumber">
      <a-row class="main-header">
        <a-col :span="12" style="text-align: left">
          <h1>{{ data.searchMode ? `"${data.curSearchKeyWord}"搜索结果` : dataStore.getGroupNameById(data.selectedGroupId) }}</h1>
        </a-col>
        <a-col
          :span="12" style="display: flex;
          justify-content: flex-end; align-items: center;"
        >
          <a-popover
            trigger="click"
            width="360px"
            title="主题"
            placement="bottomLeft"
            :overlayStyle="{ 'min-width': '360px' }"
          >
            <template #content>
              <a-row class="theme-wrapper">
                <a-col
                  :span="6"
                  v-for="themeNumber in 14"
                  :key="themeNumber"
                >
                  <div
                    class="color-block"
                    :theme-mode="themeNumber"
                    @click="selectTheme(themeNumber)">
                  </div>
                </a-col>
              </a-row>
            </template>

            <div class="theme-picker" title="切换主题色">
              <BgColorsOutlined />
            </div>
          </a-popover>
        </a-col>
      </a-row>
      <a-row class="main-content">
        <todo-list-comp
          :group-id="data.selectedGroupId"
          :search-mode="data.searchMode"
        />
        <div class="space"></div>
      </a-row>
      <a-row class="main-footer">
        <add-todo-comp
          :group-id="data.selectedGroupId"
          v-show="!data.searchMode && !!data.selectedGroupId"
        />
      </a-row>
    </a-layout-content>
  </a-layout>

  <!-- group drawer -->
  <a-drawer
    v-model:visible="data.drawerVisible"
    class="group-drawer"
    :title="{
      [DRAWER_TYPE.ADD_GROUP]: '新增分组',
      [DRAWER_TYPE.DELETE_GROUP]: '删除分组',
      [DRAWER_TYPE.UPDATE_GROUP]: '编辑分组'
    }[data.drawerType]"
    placement="left"
    width="30%"
    @after-visible-change="resetDrawerContent"
  >
    <!-- group 新增修改 -->
    <a-row
      class="drawer-content"
      v-show="data.drawerType === DRAWER_TYPE.ADD_GROUP || data.drawerType === DRAWER_TYPE.UPDATE_GROUP"
    >
      <a-col :span="24">
        <a-form
          name="createGroupForm"
          :model="data.createGroupForm"
          style="width: 100%"
          layout="vertical"
          @finish="createGroup"
          @finishFailed="() => { message.warn('请将信息填写完整！') }"
          ref="createGroupFormRef"
          :rules="{
            gname: [
              { required: true, message: '请输入分组名称' },
            ]
          }"
        >
          <a-form-item name="gname" label="分组名称:">
            <a-input size="large" v-model:value="data.createGroupForm.gname" />
          </a-form-item>
          <a-form-item name="descr" label="分组描述:">
            <a-input size="large" v-model:value="data.createGroupForm.descr" />
          </a-form-item>
          <a-form-item>
            <a-row style="justify-content: flex-end">
              <a-button
                type="primary"
                plain
                size="default"
                html-type="submit"
                style="width: 80px"
                :loading="data.drawerBtnLoading">确定
              </a-button>
            </a-row>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>

    <!-- 删除 group 多选框 -->
    <a-row
      class="drawer-content"
      v-show="data.drawerType === DRAWER_TYPE.DELETE_GROUP"
    >
      <a-col :span="24">
        <span style="display: block; margin-bottom: 20px; font-size: .8rem;">请选择需要删除的分组:</span>
        <a-checkbox-group
          v-model:value="data.deleteGroupIds"
          style="width: 100%"
        >
          <a-checkbox
            v-for="group in dataStore.getGroups"
            :key="group.id"
            style="margin-left: 0; margin: 0 20px 20px 0;"
            :value="group.id"
          >
            <span
              :data-count="group.todoCount"
              :class="{
                'delete-checkbox-content': true,
                'hide-badge': !group.todoCount
              }"
            >
              {{ group.gname }}</span>
            <div></div>
          </a-checkbox>
        </a-checkbox-group>
      </a-col>
      <a-col
        :span="24"
        style="text-align: right; margin-top: 20px;"
      >
        <a-button
          type="primary"
          @click="deleteGroups"
        >
          确定
        </a-button>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import AvatarComp from '#/avatarComp.vue'
import GroupComp from '#/groupComp.vue'
import TodoListComp from '#/todoListComp.vue'
import AddTodoComp from '#/addTodoComp.vue'
import { message, type FormInstance } from 'ant-design-vue'
import {
  SearchOutlined,
  DeleteOutlined,
  PlusOutlined,
  BgColorsOutlined
} from '@ant-design/icons-vue'
import { useDataStore } from '@/stores/data'
import type { Group } from '@/types'
import { DRAWER_TYPE } from '@/utils/util'
import LocalStorage from '@/utils/localStroage'
import { Modal } from 'ant-design-vue'
import bus from '@/utils/bus'

const dataStore = useDataStore()
const data = reactive({
  avatarH: '80px',
  searchKeyWord: '',
  searchMode: false,
  curSearchKeyWord: '',
  selectedGroupId: -1,
  drawerVisible: false,
  drawerType: DRAWER_TYPE.ADD_GROUP,
  drawerBtnLoading: false,
  deleteGroupIds: [],
  themeNumber: LocalStorage.get<number>('themeNumber') || 1,
  createGroupForm: {
    id: -1,
    gname: '',
    descr: '',
  },
})
const createGroupFormRef = ref<FormInstance>()
const onSearch = () => {
  if (!data.searchKeyWord) {
    message.warn('请输入搜索内容！')
    return
  }

  data.curSearchKeyWord = data.searchKeyWord
  bus.emit('passKeyWord', data.searchKeyWord)
  data.searchMode = true
  data.selectedGroupId = -1
  dataStore.searchTodo(data.searchKeyWord)
}
const selectGroup = (groupId: number) => {
  if (groupId) {
    data.selectedGroupId = groupId
  }
}
const openDrawer = (type: DRAWER_TYPE, group?: Group) => {
  data.drawerType = type
  if (data.drawerType === DRAWER_TYPE.UPDATE_GROUP && group) {
    data.createGroupForm.id = group.id
    data.createGroupForm.gname = group.gname
    data.createGroupForm.descr = group.descr
  }
  data.drawerVisible = true
}
const resetDrawerContent = (visible: boolean) => {
  if (!visible) {
    data.createGroupForm.id = -1
    data.createGroupForm.gname = ''
    data.createGroupForm.descr = ''
    data.deleteGroupIds = []
  }
}
const createGroup = async () => {
  data.drawerBtnLoading = true
  const { gname, descr } = data.createGroupForm

  const method = {
    [DRAWER_TYPE.ADD_GROUP]: dataStore.addGroup.bind(this, { gname, descr }),
    [DRAWER_TYPE.UPDATE_GROUP]: dataStore.updateGroup.bind(this, data.createGroupForm)
  }[data.drawerType as (DRAWER_TYPE.ADD_GROUP | DRAWER_TYPE.UPDATE_GROUP)]

  const result = await method()

  if (!result) {
    message.error(data.drawerType === DRAWER_TYPE.ADD_GROUP ? '创建失败！' : '修改失败！')
    return
  }

  data.drawerBtnLoading = false
  data.drawerVisible = false
  createGroupFormRef.value?.resetFields()
  message.success(data.drawerType === DRAWER_TYPE.ADD_GROUP ? '创建成功！' : '修改成功！')
}
const deleteGroups = () => {
  if (data.deleteGroupIds.length === 0) {
    message.warn('请勾选要删除的分组！')
    return
  }

  // Modal.confirm({
  //   centered: true,
  //   content: `分组中的待办将一起删除，确定要删除选中的分组吗？`,
  //   cancelText: '取消',
  //   async onOk() {
  //     const result = await dataStore.deleteGroupByIds(data.deleteGroupIds)
  //     data.drawerVisible = false
  //     if (result) {
  //       message.success('删除成功！')
  //     } else {
  //       message.error('删除失败！')
  //     }
  //   }
  // })
}
const selectTheme = (themeNumber: number) => {
  data.themeNumber = themeNumber
  LocalStorage.set('themeNumber', themeNumber)
}
const searchKeyWordChange = () => {
  if (!data.searchKeyWord && data.searchMode) {
    data.searchMode = false
    data.selectedGroupId = dataStore.getGroups.length > 0 ? dataStore.getGroups[0].id : -1
    dataStore.fetchTodo(data.selectedGroupId)
    data.curSearchKeyWord = ''
  }
}

watch(dataStore.groups, (groups) => {
  const lastSelectedIdExit = groups.some(group => group.id === data.selectedGroupId)
  if (!lastSelectedIdExit && groups.length > 0) {
    data.selectedGroupId = groups[0].id
  }
})

watch(() => data.selectedGroupId, (groupId) => {
  if (groupId) {
    data.searchMode = false
    dataStore.fetchTodo(groupId)
  }
})

// 获取分组数据
dataStore.fetchGroup().then(result => {
  if (result && dataStore.getGroups[0]?.id) {
    data.selectedGroupId = dataStore.getGroups[0].id
  }
})
</script>

<style lang="scss" scoped>
$background-color-list: // data-color-mode = ?
  #788CDE, // 1
  #A05FA1, // 2
  #C44F6F, // 3
  #C5524D, // 4
  #2D8660, // 5
  #28837E, // 6
  #6A7883, // 7
  #DFEDF9, // 8
  #F2E7F9, // 9
  #FFE4E9, // 10
  #F9E8DE, // 11
  #D5F1E5, // 12
  #D4F1EF, // 13
  #E7ECF0; // 14
$text-color-list: 
  #fff, #fff, #fff, #fff, #fff, #fff, #fff,
  $text-color, $text-color, $text-color, $text-color, $text-color, $text-color, $text-color;


.home {
  height: 100%;
  display: flex;

  .sidebar {
    padding: 10px 20px 0;
    color: #fff;
    background: #ba4345;

    .group-wrapper {
      position: relative;
      padding-top: 10px;

      .search-input {
        ::v-deep(.ant-input-wrapper) {
          .ant-input {
            border-top-left-radius: $border-radius;
            border-bottom-left-radius: $border-radius;
          }
          .ant-input-group-addon {
            &, & .ant-input-search-button {
              border-top-right-radius: $border-radius;
              border-bottom-right-radius: $border-radius;
            }
          } 
        }
      }

      .groups {
        padding-top: 10px;
      }

      .groups-m-bar {
        $btn-height: 45px;

        & {
          display: flex;
          justify-content: space-between;
          width: 100%;
          position: absolute;
          bottom: 0;
          left: 0;
          height: $btn-height;
          padding-bottom: 5px;
          color: #fff;
        }

        @mixin basic-btn {
          @include transition('background-color', $default-transition-duration);
          background-color: transparent;
          border: none;
          border-radius: $border-radius;
          color: #fff;
          &:hover {
            background-color: $hover-color;
            color: $text-color;
          }
        }
        
        .group-m-btn {
          flex: 1;
          width: 100%;
          height: 100%;
          // justify-content: flex-start;
          font-size: $text-font-size;
          text-align: left;
          @include basic-btn();
          ::v-deep(.anticon) {
            margin-right: 5px;
          }
        }
        .group-add-btn {
          flex-grow: 0;
          height: 100%;
          width: $btn-height;
          margin-left: 0;
          font-size: $text-font-size;
          @include basic-btn();
        }
      }

    }
  }

  .main {
    display: flex;
    flex-direction: column;
    padding: 0 2rem;
    background-color: var(--background-color);
    color: var(--text-color);
    @include transition('background-color', $default-transition-duration);

    @each $color in $background-color-list {
      $index: index($background-color-list, $color);
      &[data-color-mode="#{$index}"] {
        --background-color: #{$color};
        --text-color: #{nth($text-color-list, $index)};
      }
    }

    $headerH: 60px;
    .main-header {
      flex: 0;
      background-color: transparent;
      padding: 0;
      color: inherit;
      font-size: 2rem;
      height: $headerH;
      h1 {
        color: inherit;
        font-size: inherit;
        font-weight: bold;
        margin: 0;
        line-height: $headerH;
      }
      .theme-picker {
        height: 45px;
        width: 45px;
        border-radius: $border-radius;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        @include transition('background-color', $default-transition-duration);
        &:hover {
          background-color: rgba(255, 255, 255, .5);
        }
      }
    }

    .main-content {
      position: relative;
      flex: 1;
      overflow-y: scroll;
      border-radius: $border-radius;
      // 滚动条整体
      &::-webkit-scrollbar {
        z-index: 50;
        width: 6px;
        height: 3px;
        background: transparent;
        opacity: 0;
      }

      // 滚动滑块样式
      &::-webkit-scrollbar-thumb {
        -webkit-border-radius: $border-radius;
        -moz-border-radius: $border-radius;
        border-radius: $border-radius;
        background: rgba(#909399, 0);
        transition: all 1s;
      }
      &:hover::-webkit-scrollbar-thumb {
        background: rgba(#909399, 1);
      }

      // 滚动条上下的箭头按钮
      &::-webkit-scrollbar-button {
          display: none;
      }
      ::-webkit-scrollbar-corner {
          display: none;
      }
    }

    .main-footer {
      padding-top: .5rem;
      background-color: var(--background-color);
      height: $headerH * 1.5;
    }
  }
}

.group-drawer {
  .drawer-content {
    .delete-checkbox-content {
      &.hide-badge:after {
        display: none;
      }
      &:after {
        content: attr(data-count);
        display: inline-block;
        background-color: $text-color;
        color: #fff;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
        margin-left: 3px;
        transform: scale(.75);
      }
    }
  }
}

.theme-wrapper {
  .ant-col{
    .color-block {
      padding: calc(50% - 2px);
      margin: 2px;
      background-position: center;
      background-size: cover;
      cursor: pointer;
    }
    @for $i from 1 through 14 {
      &:nth-child(#{$i}) .color-block {
        background: #{nth($background-color-list, $i)};
        color: #{nth($text-color-list, $i)};
      }
    }
  }
}
</style>
