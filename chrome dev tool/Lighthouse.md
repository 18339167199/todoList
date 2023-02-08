## Lighthouse
Chrome 开发者工具 Lighthouse 文档：https://developer.chrome.com/docs/lighthouse/   
如何提升网站加载速度：https://web.dev/fast/#prioritize-resources  
PageSpeed 在线测量工具：https://pagespeed.web.dev/  

----

### 一、使用方式
1. Chrome 开发者工具栏中 Lighthouse  
   ![](./images/15.png)
2. 作为 Node 模块加载 [参考](https://www.npmjs.com/package/lighthouse)
   - npm install -g lighthouse
   - lighthouse <url>：对指定的 url 执行测试
3. PageSpeed Web UI：https://pagespeed.web.dev/

### 二、性能指标
[前端性能优化经验分享](https://mp.weixin.qq.com/s?__biz=MzUxNzk1MjQ0Ng==&mid=2247512984&idx=2&sn=8090004de841dffebd3a677f935a26cf&chksm=f992b549cee53c5f2ecece880aff361712492f9ae199ab8e75e200e67cc30bd957f65404c3d4&mpshare=1&srcid=0208rMT6myqRQGyFY7A3MFzN&sharer_sharetime=1675823709885&sharer_shareid=a390b83a87c3f2ca862c45397e49f636&from=singlemessage&scene=1&subscene=10000&clicktime=1675844510&enterid=1675844510&sessionid=0&ascene=1&fasttmpl_type=0&fasttmpl_fullversion=6541338-zh_CN-zip&fasttmpl_flag=0&realreporttime=1675844510841&devicetype=android-33&version=28002055&nettype=WIFI&abtest_cookie=AAACAA%3D%3D&lang=zh_CN&exportkey=n_ChQIAhIQWRTwnt6X7Z0kIa4yFHaYERLlAQIE97dBBAEAAAAAAILZIVCUP8UAAAAOpnltbLcz9gKNyK89dVj0U%2FK%2BV0dxgNq6ujEGzlRs0jIPEjxBRFp%2BGlPE2Oew3e6oQxH4T0WG9WAvYvpUxMKvYvJ6YKV1zmUR9Xvi%2BWp3PvT62rxEppeoXKS10ZMO9md%2FKSbaQcgsw8VByymtoq4DqCnrpWhyx2I619GoC4N0uzE9zxVdyESEzovusVdQKi2Q9%2Fas7lu2XQ6g39e4DonJZGuOeK2fGUSnJIF1eMKfrDKI8YVBgWahyZvqMhP0Q5sRJMu%2BYFASCVEGV8sen88%3D&pass_ticket=38Vl3Pz%2FwNX%2F9Yt0sgdoUh6j0%2F1y8B3gdrrG6ZPAMPiL5qGejKn0vZWy2XfjwrRbBzIi477BaZGVys8r1ITmqg%3D%3D&wx_header=3)  
[Chrome Lighthouse 性能指标](https://developer.chrome.com/docs/lighthouse/performance/)

#### 指标评分标准
1. <font color=red>0 - 49</font>：显示红色，该指标表现很差
2. <font color=orange>50 - 89</font>：显示橙色，该指标当前状态较好，但还可以改善
3. <font color=green>90 - 100</font>：显示绿色，该指标状态很好

#### 内容呈现相关
1. <font color=red>*</font> FCP ( First Contentful Paint )  
   **首次内容绘制**，首次绘制出页面元素（文本、图片、非空白的canvas、svg 等）的时间，可以用来衡量用户访问到显示出内容的白屏时间。

2. LCP ( Largest Contentful Paint )  
   **最大内容绘制**，是 **从页面开始加载到视窗内最大内容绘制的所需时间**，这里的内容指文本、图片、视频、非空的 canvas 或者 SVG 等

3. SI ( Speed Index )
   **速度指数**，Lighthouse 会在页面加载的过程中录制视频，并通过计算视频中帧和帧之间的视觉变化的进度，这个指标反应了**网页内容填充的速度**。页面解析渲染的过程中，资源的加载和主线程执行的任务会影响到速度指数的结果。
   
4. <font color=red>*</font> CLS ( Cumulative Layout Shift )
   **累计布局位移偏离**，记录了页面上非预期的元素位移波动。CLS 的值越低说明页面跳来跳去的情况越少，用户体验越好。 
    - 例如页面上图片从未加载的状态到加载完成之后的状态，造成图片后的元素产生位移的情况    
        <img src="./images/16.png" width="800" />
        <img src="./images/17.png" width="800" />
    - 在文档中插入一段内容之后，造成之后的元素位移的情况。

#### 用户交互相关
1. TTI ( Time To Interactive )  
   介绍 TTI 之前，首先要介绍一下长任务，一个任务的耗时超过 50ms，这个任务就可以被认为是长任务，用户的交互操作也是在主线程执行的，所以当发生 Long Task 时，用户的交互操作很可能无法及时执行，这时用户就会体验到卡顿（当页面响应时间超过 100ms 时，用户可以体验到卡顿）。  
   **首次可交互的时间**，测量页面所有的资源加载成功并能够可靠快速的响应用户输入的时间，通常发生在页面依赖的资源已经加载完成，此时浏览器可以快速响应用户交互的时间。需要满足以下的几个条件
   - 从 FCP 指标后开始计算
   - 持续 5s 内无长任务，且无两个以上正在进行的 GET 请求。
   - 往前回溯至 5s 前的最后一个长任务结束的时间。

2. TBT ( Total Blocking Time )  
   **总阻塞时间**，记录在 FCP 到 TTI 之间所有长任务的阻塞时间总和。主线程执行的任务分为长任务和短任务。规定持续时间超过 50ms 的任务为长任务。低于 50ms 的任务为短任务。长任务超过 50ms 的时间被认为是“阻塞”的，因此，TBT 是所有长任务中阻塞时间的总和。TBT = FCP 和 TTI 之间发生的每个长任务的「阻塞时间」总和。例：  

   <img src="./images/TBT-1.png" width="800" />  

   上图，有三个长任务，两个短任务。
  
   <img src="./images/TBT-2.png" width="800" />  

   而 TBT 时长为 200+40+105=345ms。

3. <font color=red>*</font> FID ( First Input Delay )  
   **首次输入延迟**，记录在 FCP 和 TTI 之间用户首次与页面交互时响应的延迟。记录第一次与页面交互到浏览器真正能够处理响应该交互的时间，这个延迟出现的原因是浏览器的主线程可能在忙于其他工作，比如解析 JS 文件等，所以无法及时响应用户。

### 三、Chrome Lighthouse 界面介绍
1. Mode [参考](https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/user-flows.md)：测试模式
   - Navigation（默认）：分析单个页面加载情况
   - Timespan：分析任意一段时间内的页面运行情况，包括期间用户的操作
   - Snapshot：分析页面在当前时刻的状态

2. Device：测试的设备
   - Mobile
   - Desktop

3. Categories：测试项目
   - Performance：各项性能指标
   - Accessibility：可访问性(无障碍)
   - SEO：seo情况
   - Best Practices [参考1](https://developer.chrome.com/docs/lighthouse/best-practices/) [参考2](https://codegino.com/blog/lighthouse-best-practices)：最佳实践，指页面的代码符合各种规范，例如 HTML 有 docType 的声明，img 标签有 alt 属性。浏览器控制台没有打印错误和警告，避免使用存在风险的第三方 JavaScript 库....
   - Progressive Web App：渐进式 Web App 指标

4. Publisher Ads：Lighthouse 通过一系列自动审核提高广告速度和测量广告的整体质量。

### 

