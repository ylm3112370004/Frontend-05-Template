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

```javascript
POST / HTTP/1.1
Host: 127.0.0.1
Content-Type: application/x-www-form-urlencoded

// name=%E6%9D%A8%E8%85%8A%E6%A2%85&gender=female  字符会需要编码
```

1. 开始标签
2. 结束标签
3. 自封闭标签


## 第四步总结
- 在状态机中，除了状态迁移，我们还会要加入业务逻辑
- 在标签结束状态提交标签token