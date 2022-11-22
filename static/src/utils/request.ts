import axios from "axios"
import type { AxiosRequestConfig, AxiosResponse, Method } from "axios"
import globalLoading from "@/utils/globalLoading"
import { isTokenEffective, getToken, clearToken } from "./util"

import { Modal } from 'ant-design-vue'

interface ApiResponse {
  code: number
  data: any
  msg: string
}

const requestLoadingControler = {
  count: 0,
  openLoading() {
    this.count++
    globalLoading.show()
  },
  closeLoading() {
    this.count--
    if (this.count === 0) {
      globalLoading.hide()
    }
  }
}

const axiosInstance = axios.create({
  baseURL: "https://c440up8jng.execute-api.ap-southeast-1.amazonaws.com/api",
  timeout: 50000,
})

// 请求白名单，不需要登录就能访问
const requestWhiteList = [
  '/user/login',
  '/user/register'
]

axiosInstance.defaults.headers["Content-Type"] = "application/json"

axiosInstance.interceptors.request.use(
  (requestConfig: AxiosRequestConfig) => {
    // 打开 loading
    requestLoadingControler.openLoading()

    // 白名单直接放行
    if (requestWhiteList.includes(requestConfig.url as string)) {
      return requestConfig
    }

    // 需要登录的接口加上认证 token 信息，不存在则重定向到 /login
    const token = getToken()
    if (isTokenEffective() && requestConfig.headers) {
      requestConfig.headers['authorization'] = `Bearer ${token}`
      console.log('request: ' + requestConfig.url)
    }

    return requestConfig
  },
  error => {
    requestLoadingControler.closeLoading()
    console.log('Request Error!', error)
  }
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    requestLoadingControler.closeLoading()
    return response
  },
  error => {
    requestLoadingControler.closeLoading()

    console.log(error)

    // 未登录错误，提示用户进行登录
    if (error.response.data.code === 1001) {
      Modal.warning({
        centered: true,
        content: `登录信息已过期，请重新登录！`,
        cancelText: '取消',
        onOk() {
          clearToken()
          window.location.href = window.location.origin + '/login'
        }
      })
      return
    }

    console.log('Response Error!', error)
  }
)

export default function request(
  url: string,
  method: Method,
  data?: any,
  headers?: { [prop: string]: string }
) {
  return new Promise<ApiResponse>((resolve, reject) => {
    axiosInstance({
      method,
      url,
      [method.toLowerCase() === "get" ? "params" : "data"]: data,
      headers,
    }).then(
      (resp: AxiosResponse<ApiResponse>) => {
        resolve(resp?.data)
      },
      (err: Error) => {
        reject(err)
      }
    )
  })
}
