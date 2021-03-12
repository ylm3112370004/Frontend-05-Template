# 浏览器API

## 浏览器原理

### 

## 浏览器API

### DOM API


### 事件 API
使用过的

1. mouseEvent
event当中有一个问题 button buttons
- mousedown
- mousemove
- mouseup

2. touchEvent
- touchstart
- touchmove
- touchend
- touchcancel


###  Range API


### CSSOM


### CSSOM View


### 其它 API

## 内联元素缝隙、HTML实体、编码

### inline-block

- 缝隙产生的原因
1. TAB, LF, FF, CR, SPACE 都是空白字符
2. 多个连续的空白字符都会合并成一个空格，而空格也占据一个字符的空间
3. white-space属性可以修改合并规则

- 如何解决？
0. 简单办法，可以通过去掉空格
```javascript
  <div class="carousel">
    <div style="background-color: lightcoral;">1</div><div style="background-color: lightblue;">2</div><div style="background-color: lightgreen">3</div><div style="background-color: lightgrey; transform: translateX(-1200px);">4</div>
  </div>
```
1. 通过设置font-size解决
2. 通过更改布局方式解决，比如使用float, flex, grid来进行布局

### 浏览器怎么实现setTimeout