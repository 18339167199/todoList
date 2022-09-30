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
          v-model:value="data.searchText"
          placeholder="搜索待办"
          size="large"
          @search="onSearch"
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

        <a-tooltip
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
        </a-tooltip>
      </a-row>
      </div>
    </a-layout-sider>

    <a-layout-content>Content</a-layout-content>
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
    @after-visible-change="drawerVisibleChange"
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
          :rules="data.createGroupFormRules"
          layout="vertical"
          @finish="createGroup"
          @finishFailed="() => { message.warn('请将信息填写完整！') }"
          ref="createGroupFormRef"
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
              :data-count="group.count"
              :class="{
                'delete-checkbox-content': true,
                'hide-badge': !group.count
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
        >确定</a-button>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import AvatarComp from '#/avatarComp.vue'
import GroupComp from '#/groupComp.vue'
import { message, type FormInstance } from 'ant-design-vue'
import { SearchOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { useDataStore } from '@/stores/data'
import { getCurrentDateStr } from '@/utils/util'
import type { Group } from '@/types'
import { DRAWER_TYPE } from '@/utils/util'

const dataStore = useDataStore()
const data = reactive({
  avatarH: '80px',
  searchText: '',
  selectedGroupId: -1,
  drawerVisible: false,
  drawerType: DRAWER_TYPE.ADD_GROUP,
  drawerBtnLoading: false,
  createGroupForm: {
    id: -1,
    gname: '',
    descr: '',
  },
  createGroupFormRules: {
    gname: [
      { required: true, message: '请输入分组名称' },
    ]
  },
  deleteGroupIds: []
})
const createGroupFormRef = ref<FormInstance>()
const onSearch = () => {
  if (!data.searchText) {
    message.warn('请输入搜索内容！')
    return
  }
}
const selectGroup = (groupId: number) => {
  if (groupId && groupId > 0) {
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
const drawerVisibleChange = (visible: boolean) => {
  if (!visible) {
    data.createGroupForm.id = -1
    data.createGroupForm.gname = ''
    data.createGroupForm.descr = ''
  }
}
const createGroup = () => {
  let result = false
  data.drawerBtnLoading = true
  if (data.drawerType === DRAWER_TYPE.ADD_GROUP) {
    result = dataStore.addGroup({
      id: -1,
      userId: dataStore.getUserInfo.id,
      count: 0,
      gname: data.createGroupForm.gname,
      descr: data.createGroupForm.descr,
      createTime: getCurrentDateStr(),
      updateTime: ''
    })
  } else if (data.drawerType === DRAWER_TYPE.UPDATE_GROUP) {
    result = dataStore.updateGroup(data.createGroupForm)
  }

  if (!result) {
    message.error(data.drawerType === DRAWER_TYPE.ADD_GROUP ? '创建失败！' : '修改失败！')
    return
  }

  setTimeout(() => {
    data.drawerBtnLoading = false
    data.drawerVisible = false
    createGroupFormRef.value?.resetFields()
    message.success(data.drawerType === DRAWER_TYPE.ADD_GROUP ? '创建成功！' : '修改成功！')
  }, 1000)
}
const deleteGroups = () => {
  const result = dataStore.deleteGroupByIds(data.deleteGroupIds)
  data.drawerVisible = false
  if (result) {
    message.success('删除成功！')
  } else {
    message.error('删除失败！')
  }
}

data.selectedGroupId = dataStore.getGroups[0].id
watch(() => dataStore.getGroups, (newVal, oldVal) => {
  console.log(newVal, oldVal)
  const lastSelectedIdExit = dataStore.getGroups.some(group => group.id === data.selectedGroupId)
  if (!lastSelectedIdExit) {
    data.selectedGroupId = dataStore.getGroups[0].id
  }
})
</script>

<style lang="scss" scoped>
.home {
  height: 100%;

  .sidebar {
    padding: 10px 20px 0;
    color: #fff;

    .group-wrapper {
      position: relative;
      padding-top: 10px;

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
</style>
