<template>
  <div
    v-show="props.data.show"
    :class="{
      'loading': true,
      'close': !props.data.show
    }"
  >
    <spin tip="加载中..."></spin>
  </div>
</template>

<script lang="ts" setup>
import spin from 'ant-design-vue/lib/spin'

const props = defineProps<{
  data: {
    show: boolean,
    title: string
  }
}>()
</script>

<style scoped lang="scss">
@keyframes disapper {
  from {
    opacity: 0;
  } to {
    opacity: 1;
  }
}

.loading {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: disapper .5s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;

  &.close {
    animation-direction: reverse;
  }

  $iconH: 25px;
  .loading-icon {
    width: $iconH;
    height: $iconH;
    > .svg {
      height: $iconH;
      width: $iconH;
      color: #fff;
    }
  }
  div {
    color: #fff;
    padding: 6px 15px;
  }

}
</style>
