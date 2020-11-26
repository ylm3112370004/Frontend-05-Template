# 总览

1. 有限状态机练习 FSM文件夹
2. 浏览器工作原理之Response解析 server.js 及 clients


## 有限状态机


## 浏览器工作原理
URL -> BitMap

1. 浏览器首先使用HTTP协议或者HTTPS协议，向服务端请求页面
2. 待补充
3. 待补充
4. 待补充
5. 待补充
6. 待补充

### http协议

1. 第一步 HTTP请求 总结
- 设计一个HTTP请求类
- Content-Type是必要字段，要有默认值
- body是 K,V格式
- 不同的Content-Type对body的格式有影响
application/json   JSON.stringify(body)
application/x-www-form-urlencoded    key=value&key1=value1...
