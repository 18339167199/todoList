<template>
  <a-popover
    placement="bottom"
    :mouseEnterDelay="0"
    trigger="contextmenu"
    destroyTooltipOnHide
    v-model:visible="popoverShow"
  >
    <template #content>
      <ul class="popover-ul has-hover-style">
        <li @click="onEdit">编辑分组</li>
        <li @click="onDelete">删除分组</li>
      </ul>
    </template>

    <div class="popover-reference-wrapper">
      <a-tooltip
        :title="props.data.descr"
        :disabled="props.data.descr"
        placement="right"
        trigger="hover"
        color="#108ee9"
        destroyTooltipOnHide
      >
        <a-row
          title="鼠标右键点击查看更多操作"
          @click.left="() => { $emit('select', props.data.id) }"
          @contextmenu.prevent="() => { popoverShow = true }"
          :class="{
            'groups-item': true,
            'active': selected
          }"
        >
          <span class="name">{{ props.data.gname }}</span>
          <span class="badge" v-if="!!props.data.todoCount">{{ props.data.todoCount }}</span>
        </a-row>
      </a-tooltip>
    </div>
  </a-popover>

</template>

<script setup lang="ts">
import { ref, createVNode } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import type { Group } from '@/types'
import { DRAWER_TYPE } from '@/utils/util'
import { useDataStore } from '@/stores/data'

const props = defineProps<{
  data: Group,
  selected: boolean
}>()
const emit = defineEmits(['openDrawer', 'select'])
const dataStore = useDataStore()

const popoverShow = ref<boolean>(false)

const onEdit = () => {
  popoverShow.value = false
  emit('openDrawer', DRAWER_TYPE.UPDATE_GROUP, props.data)
}

const onDelete = () => {
  popoverShow.value = false
  Modal.confirm({
    centered: true,
    content: `分组中的待办将一起删除，确定要删除分组“${props.data.gname}”吗？`,
    icon: createVNode(ExclamationCircleOutlined),
    cancelText: '取消',
    async onOk() {
      const result = await dataStore.deleteGroupByIds(props.data.id)
      if (result) {
        message.success('删除成功！')
      } else {
        message.error('删除失败！')
      }
    }
  })
}
</script>

<style scoped lang="scss">
$itemH: 41px;

.groups-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: $itemH;
  position: relative;
  padding: 10px 5px 10px 10px;
  cursor: pointer;
  border-radius: $border-radius;
  margin-bottom: 5px;
  line-height: 21px;
  @include transition('background-color,color', $default-transition-duration);
  &:hover {
    background-color: $hover-color;
    color: $text-color;
  }
  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 40%;
    border-radius: $border-radius;
    background-color: #5D71BF;
    opacity: 0;
    @include transition('opacity', $default-transition-duration);
  }
  &.active {
    color: $text-color;
    background-color: $hover-color;
    &:after { opacity: 1; }
  }

  .icon {
    position: relative;
    top: 1px;
    margin-right: 15px;
  }

  .badge {
    position: absolute;
    text-align: right;
    width: 20px;
    height: 20px;
    padding: 0;
    text-align: center;
    line-height: 20px;
    border-radius: 50%;
    background-color: $text-color;
    color: #fff;
    font-size: 12px;
    right: 15px;
    top: 50%;
    margin-top: -10px;
  }
}

.popover-ul {
  @include ul-style()
}
</style>
