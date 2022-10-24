import axios from "axios"
import type { AxiosRequestConfig, AxiosResponse, Method } from "axios"
import globalLoading from "@/utils/globalLoading"
import { isTokenEffective, getToken } from "./util"
import { useRouter } from 'vue-router'

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
  baseURL: "/api",
  timeout: 5000,
})

axiosInstance.defaults.headers["Content-Type"] = "application/json"

axiosInstance.interceptors.request.use(
  (requestConfig: AxiosRequestConfig) => {
    // 打开 loading
    requestLoadingControler.openLoading()
    // 检查是否存在登录 token 且是否过期
    const token = getToken()
    if (isTokenEffective() && requestConfig.headers) {
      requestConfig.headers["Authorization"] = token
    } else {
      useRouter().push('/login')
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
