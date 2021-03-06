# 总览

1. 有限状态机练习 FSM文件夹
2. 浏览器工作原理之Response解析 server.js 及 clients


## 有限状态机


## 浏览器工作原理
URL -> BitMap

1. 浏览器首先使用HTTP协议或者HTTPS协议，向服务端请求页面
2. html parse =》 dom树
3. 在DOM树上添加渲染所需的CSS
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


## 第四步总结 标签
- 在状态机中，除了状态迁移，我们还会要加入业务逻辑
- 在标签结束状态提交标签token

```javascript
currentToken = {
  type: "startTag" | "endTag",
  tagName: ""
}
```


## 第五步总结 属性
- 属性值分为单引号，双引号，无引号三种写法，一次需要较多状态处理
- 处理属性的方式跟标签类似
- 属性结束时，我们把属性加到标签token上

## 第六步总结 构造DOM树
- 从标签goujianDOM树的基本技巧是使用栈
- 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
- 自封闭节点可视为入栈后立刻出栈   其实没有入栈
- 任何元素的父元素是它入栈钱的栈顶

```javascript
// element 的数据结构
let element = {
  type: "element",
  parent: element,
  children: [
    {element, ...}// 构成DOM树
  ],
  attributes: [
    {name: "class", value: ""},
    {name: "id", value: ""},
    {name: "href", value: ""},
    //...
  ],
  computedStyle: {  // sp是一个四元组
    'background-color': {value: "#ff1111", sp: [0, 0, 0, 0]}, 
    'width': {value: '30px', sp: []},
    //...
  }
}
```

## CSS计算 带CSS的DOM树  css computing

css 语法和词法分析

准备工作 安装 css取法分析器 添加launch.json使用调试

1. 第一步 收集CSS规则
- 遇到style标签时，我们把CSS规则保存起来
- 这里我们调用CSS Parser来分析CSS规则
- 必须要仔细研究此库分析CSS规则的格式

2. 第二步 选择computeCSS的时机
- 创建一个元素后，立即计算CSS
- 理论上，分析一个元素时，所有CSS规则已经收集完毕
- 但是在真实浏览器中，可能遇到写在body的style标签，需要重新计算CSS的情况，这里先忽略

3. 第三步 获取父元素序列
- 在computeCSS函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配
- 从上一步骤的stack，可以获取本元素所有的父元素
- 首先获取的是“当前元素”，所以我们获得和计算父元素匹配的顺序是**从内向外**

div div    #myid
不知道匹配      一定匹配当前元素
那个元素

4. 第四步 选择器与元素的匹配
- 选择器也要从当前元素向外排列
- 复杂选择器拆分成当个选择器，用循环匹配父元素

rules :  [rule, rule, rule]

rule : {
  declaration: [{property: 'width', value: '100px'}, {property: 'background-color', value: '#ff5000'}],
  selector: ['body div #myid']
}


```javascript
// 全局
rules: [[div div #myid], [main .box]];
stack [document, element, element, ....., element]

// 函数传入当前元素 
element

// 为例比较方便
elements = stack.reverse();

for (let rule of rules) {
  rule.split(" ").reverse();  // #myid, div, div  以第一个为例

  element 《===》rule[0] 比较

  let j = 1;

  for(let i = 0; i < elements.length; i++) {
    比较
  }
} 
```


5. CSS计算 | 计算选择器与元素匹配
- 根据选择器的类型和元素属性，计算是否与当前元素匹配
- 这里仅仅实现了三种基本选择器，实际的浏览器中要处理复合选择器
div#myid.box


6. CSS计算 | 生成computed属性

数据结构
element.computedStyle = {
  'background-color': {value: "#ff1111", ...},
  'width': {value: '30px', ....},
};

缺陷: 同一元素的不同不同规则没有全部应用

7. CSS计算 | specificity的计算逻辑
- CSS规则根据specificity和后来优先规则覆盖
- specificity四元组，越左边优先级越高
- 一个CSS规则的specificity根据包含简单选择器相加而成

Priority 优先级
specificity 特征 专指的程度

四元组
[0,      0,    0,      0]
inline   id   class  tag


## 排版/布局


### 排版 | 根据浏览器属性进行排版
flex

三代排版 + 隐约四代
1. float 
2. flex：容易实现
3. grid 更强大
4. CSS Houdini

row Main Axis
col Cross Axis
flex-direction: row
Main: width x left right
Cross: height y top bottom


row Cross Axis
col Main Axis
flex-direction: column
Main height y top bottom
Cross width x left right

编程技巧：当有传入内容有多种情况时，可以定义赋值给指定变量，从而减少if else 判断代码


layout的时机

flex 布局是需要子元素的
结束标签
endTag的时候


### 排版 | 收集元素进行（hang）

分行
- 根据主轴尺寸，把元素分进行（行）
- 若设置了no-wrap，则强行分配进第一行

放完后超出width
新建一行

for loop 处理每一个item的情况
大致分为三种情况
1. flex 性质的item
2. 父元素 nowrap 直接放
3. 需要计算 子元素的mainSize 与 剩余空间的大小

### 排版 | 计算主轴方向

- 找出所有flex元素
- 把主轴方向的剩余尺寸按比例分配给这些元素
- nowrap 若剩余空间为负数，flex 元素等比例压缩 

怎么样分配 mainSpace