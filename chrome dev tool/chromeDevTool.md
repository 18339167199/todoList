# Google Chrome 开发者工具

## 常用地址
- [Chrome 开发者工具官网](https://developer.chrome.com/docs/)
- [PageSpeed](https://pagespeed.web.dev/)
- [PageSpeed Insights 网站性能测试工具文档](https://developers.google.com/speed/docs/insights/v5/about?hl=zh-cn)

## 一、NetWork
### 选项卡
1. ![image](./images/1.png) 监控网络请求按钮
   - 状态为红色时将监控每一个网络请求
   - 状态为灰色时不会监控网路请求

2. ![](./images/2.png) 清除按钮
  清除当前监控的网络请求记录

3. ![](./images/3.png) 过滤选项
   - 打开过滤选项 ![](./images/4.png)
      1. 关键词
      2. 正则表达式：/RegExp/
      3. 选项过滤（ctrl + 鼠标左键同时选中多个）
      4. 时间过滤
         ![](./images/6.png)

4. Preserve log  再刷新页面时，保留上一次请求的记录，可以用来对比上一次请求的结果和下一次请求的结果

5. Disable cache 禁用缓存

6. 模拟限速
   - No throttling：无限制
   - Fast 3G：较快的网络
   - Slow 3G: 较慢的网络
   - 自定义：
    ![](./images/5.png)

7. ![](./images/7.png) 导出/导入 HTTP 请求数据文件
   - 导出一个 har 文件，文件保存了当前所有网络请求的信息，har 文件格式基于 JSON
````json
{
    "log": {
        "version": "1.2",
        "creator": {
        "name": "WebInspector",
            "version": "537.36"
        },
        "pages": [
            {
                "startedDateTime": "2023-02-06T07:07:53.086Z", // 页面开始加载的时候
                "id": "page_9", // 页面唯一 id
                "title": "https://pagespeed.web.dev/", // 页面的 title
                "pageTimings": {
                    "onContentLoad": 1846.6320000588894, // 页面上所有的元素加载完成的时间
                    "onLoad": 2852.0880001597106 // 页面上开始加载到页面 onLoad 方法执行的时间
                }
            }
        ],
        "entries": [
            {
                "startedDateTime": "2015-09-06T10:02:41.645Z", // 请求发出的时间(ISO 8601)
                "time": 1221, // 该条请求花费的总的毫秒数
                "request": {
                    "method": "GET",
                    "url": "http://www.ihorve.com/", // 请求的url
                    "httpVersion": "HTTP/1.1", // http协议版本号
                    "cookies": [], // cookie对象列表
                    "headers": [ // header信息
                        {
                            "name": "Accept",
                            "value": "text/html,application/xhtml+xml"
                        }
                    ]
                },
                "response": {
                    "status": 200, // 状态码
                    "statusText": "OK",
                    "httpVersion": "HTTP/1.1",
                    "cookies": [], // cookie对象列表
                    "headers": [], // 响应头信息列表
                    "redirectURL": "", // 从响应头位置重定向目标URL
                    "headersSize": -1, // 从HTTP响应消息的开始，直到（且包括）的主体之前的双CRLF的总字节数，不可用设置为-1
                    "bodySize": 65047, // 响应体的字节数
                    "content": { // 响应体的详细信息
                        "size": 65047, // 响应体的字节数
                        "mimeType": "text/html; charset=UTF-8" // 响应体的mimeType
                    }
                },
                "cache": {}, // 缓存信息
                "timings": {
                    "blocked": 0, // 可选，等待网络连接的时间
                    "dns": -1, // 可选，dns解析时间，不可用设置为-1
                    "connect": -1, // 可选，创建TCP连接的时间，不可用设置为-1
                    "send": 0, // 发送HTTP请求到服务器的时间
                    "wait": 1126, // 等待响应的时间
                    "receive": 95, // 从服务器接收或从缓存读取的时间
                    "ssl": -1 // 可选，SSL/TLS协商需要的时间，不可用设置为-1
                }
            }
        ]
    }
}
````

8. ![](./images/8.png) 设置
   - Show overview：展示时间轴的预览
   - Capture screenshots：展示实时截图预览，可以预览到不同时间段内页面加载情况和网络请求的状况
   ![](./images/9.png)



### NetWork 主要内容
#### 属性
![](./images/10.png)
   1. Name：资源名称和请求的路径
   2. Status: 状态码
   3. Type：请求的资源类型 script/stylesheet/png/xhr/...
   4. Size：响应头和响应体结合的大小，或者文件的大小
   5. Time：请求开始到接收到最后一个字节数据的时间
   6. Waterfall：瀑布流，可以观察请求在各个阶段中花费的时间，相当于请求详情中的 Timing
   7. Priority: 请求的优先级
   8. Initiator：请求是怎么发起的
      + Parser：在 html 解析时发起
      + Redirect：由页面的重定向发起
      + script：由 script 执行的过程中发起
      + other：请求由其他过程发起，比如页面的连接点击

#### 网络请求 Timing
1. 参考资料
   - [Chrome Timing 名词介绍](https://developer.chrome.com/docs/devtools/network/reference/#timing-explanation)  
   - [CSDN 资料](https://blog.csdn.net/Arlingtonroad/article/details/109852319)

2. 根据请求的时间线来优化页面的性能