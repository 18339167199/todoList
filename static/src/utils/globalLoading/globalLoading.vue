<template>
  <div
    :class="{
      'loading': true,
      'open': props.data.show
    }"
  >
    <spin :indicator="indicator" wrapperClassName="global-loading"></spin>
  </div>
</template>

<script lang="ts" setup>
import { LoadingOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
import spin from 'ant-design-vue/lib/spin'

const props = defineProps<{
  data: {
    show: boolean,
    title: string
  }
}>()

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '35px',
    color: 'rgba(0, 0, 0, .5)'
  },
  spin: true,
})
</script>

<style scoped lang="scss">
@keyframes appear {
  from {
    opacity: 0;
  } to {
    opacity: 1;
  }
}

.loading {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, .5);
  position: fixed;
  top: 0;
  left: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: none;

  &.open {
    display: flex;
    animation: appear 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
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
