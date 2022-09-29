<template>
  <a-popover
    placement="right"
    :mouseEnterDelay="0"
    destroyTooltipOnHide
    :visible="popoverShow"
  >
    <template #content>
      <a-menu>
        <a-menu-item @click="() => { $emit('openDrawer', DRAWER_TYPE.EDIT_GROUP, props.data) }">编辑分组</a-menu-item>
        <a-menu-item>删除分组</a-menu-item>
      </a-menu>
    </template>

    <div class="popover-reference-wrapper">
      <a-tooltip
        :title="props.data.descr"
        :disabled="props.data.descr"
        placement="top"
        trigger="hover"
        color="#108ee9"
      >
        <a-row
          title="鼠标右键点击查看更多操作"
          @click.left="() => { $emit('select', props.data.id) }"
          @contextmenu="() => { popoverShow = true }"
          :class="{
            'groups-item': true,
            'active': selected
          }"
        >
          <span class="name">{{ props.data.gname }}</span>
          <span class="badge" v-if="!!props.data.count">{{ props.data.count }}</span>
        </a-row>
      </a-tooltip>
    </div>
  </a-popover>

</template>

<script setup lang="ts">
  import { ref } from 'vue'
import type { Group } from '@/types'
import { DRAWER_TYPE } from '@/utils/util'

const props = defineProps<{
  data: Group,
  selected: boolean
}>()

const popoverShow = ref<boolean>(false)

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
</style>
