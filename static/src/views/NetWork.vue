<template>
    <div>
        <a-button @click="sendRequest(10)"> 同时发送10个请求 </a-button>

        <br /><br />

        <a-button @click="sendRequest(1)"> 发送一个请求 </a-button>

        <br /><br />

        <a-button @click="req1"> 发送 5 个超时请示，一个正常请求 </a-button>

        <br /><br />

        <a-button @click="getImg"> 发送一个获取图片资源的 get 请求 </a-button>

        <br /><br />

        <a-button @click="getCss"> 发送一个获取 css 资源的请求 </a-button>

        <br /><br />

        <!-- <a-button @click="getScript"> 发送一个获取 js 文件的请求</a-button> -->

        <!-- <img src="http://localhost:8081/flower-2.jpeg" alt="" width="300"> -->
        <img :src="imgSrc" height="600" @click="resetImg">
    </div>
</template>

<script lang="ts" setup>
import request from '@/utils/request'
import { getUserInfoApi, errorRequest } from '@/api/user'
import { searchTodoApi, addTodoApi } from '@/api/todo'
import { ref } from 'vue';

const imgSrc = ref('');

const sendRequest = (num: number) => {
    for(let i = 0; i < num; i++) {
        getUserInfoApi().then(res => {
            console.log(res)
        })
    }
}

const req1 = () => {

    for (let i = 0; i < 5; i ++) {
        request('/user/timeout', 'get')
    }
    
    getUserInfoApi()
}

const getImg = () => {
    imgSrc.value = 'http://localhost:8081/flower.jpeg'
}

const getCss = () => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href', 'http://localhost:8081/stylesheets/style.css')
    document.getElementsByTagName('head')[0].appendChild(link)
}

const resetImg = () => {
    imgSrc.value = ''
}

const getScript = () => {
    const script = document.createElement('script')
    script.setAttribute('src', 'http://localhost:8081/index.js')
    document.getElementsByTagName('head')[0].appendChild(script)
}

// sendRequest(1)
// getImg()
// getCss()
// getScript()

</script>
