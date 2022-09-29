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
      [DRAWER_TYPE.EDIT_GROUP]: '编辑分组'
    }[data.drawerType]"
    placement="left"
    width="30%"
    @after-visible-change="drawerVisibleChange"
  >
    <a-row
      class="drawer-content"
      v-show="data.drawerType === DRAWER_TYPE.ADD_GROUP || data.drawerType === DRAWER_TYPE.EDIT_GROUP"
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
    gname: '',
    descr: '',
  },
  createGroupFormRules: {
    gname: [
      { required: true, message: '请输入分组名称' },
    ]
  }
})
const createGroupFormRef = ref<FormInstance>()
const onSearch = () => {
  if (!data.searchText) {
    message.warn('请输入搜索内容！')
    return
  }

  console.log('search: ' + data.searchText)
}
const selectGroup = (groupId: number) => {
  if (groupId && groupId > 0) {
    data.selectedGroupId = groupId
  }
}
const openDrawer = (type: DRAWER_TYPE, group?: Group) => {
  data.drawerType = type
  data.drawerVisible = true
  console.log('open', type)
}
const drawerVisibleChange = (visible: boolean) => {
  console.log('drawerVisible: ' + visible)
}
const createGroup = () => {
  data.drawerBtnLoading = true

  if (data.drawerType === DRAWER_TYPE.ADD_GROUP) {
    dataStore.addGroup({
      id: -1,
      userId: dataStore.getUserInfo.id,
      count: 0,
      gname: data.createGroupForm.gname,
      descr: data.createGroupForm.descr,
      createTime: getCurrentDateStr(),
      updateTime: ''
    })
  } else if (data.drawerType === DRAWER_TYPE.EDIT_GROUP) {
    // dataStore.updateGroup({
    //   id: 
    // })
  }

  setTimeout(() => {
    data.drawerBtnLoading = false
    data.drawerVisible = false
    createGroupFormRef.value?.resetFields()
    message.success('创建成功！')
  }, 1000)
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

</style>
