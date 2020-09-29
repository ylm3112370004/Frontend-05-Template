学习笔记

# TicTacToe
1. TicTacToe：扫描二维码开始游戏 GO
![TicTacToe二维码图片](http://qhewqxg9u.hb-bkt.clouddn.com/ticTacToe.png)

## css 
inline-block  默认baseline ==》 middle

## js

### 怎么判断赢
1. 逻辑判断
横向 纵向 左斜向 右斜向

2. check的时机
落子之后

### 加入AI的能力

1. 判断的时机
落子之后 显示之前

判断当前情况下 是否有一步可以赢


### 胜负剪枝 （win-lost）

一个点能赢，不能保证赢的最多，五子棋中练习
当遍历的过程复杂时，遍历的深度需要控制

### 一维数组 代替 二维数组

使用乘法 `i * 3 + j`

### break 双层 需要添加 outer

```javascript
function willWin(pattern, color) {
  outer:for(let i=0; i<pattern.length; i++) {
    for(let j=0; j<pattern[i].length; j++) {
      if(pattern[i][j] === 0) {
        let tmp = clone(pattern)
        tmp[i][j] = color;
        if(check(tmp, color)) {
          return [j, i]; // 返回一个点
          break;
        }
      }
    }
  }
  return null;
}
```

### 一维数据 浅拷贝
一维数据中 `Object.create(obj)` 以obj为原型,
如果修改数组中的值，那么

```javascript
function clone(pattern) {
  return Object.create(pattern);
}
let arr = [1,1,1,1,1,1,1,1,1,1];
let obj = Object.create(arr);
obj[3] = 4;
console.log(obj);
```

# 异步编程 AP中

如果 涉及到时间：
在JavaScript中没有**同步等待时间的一种机制**，所以一定是**异步处理机制**

## 回调

## promise
是很多个语言中都有的一个异步处理机制

JavaScript在v5的版本引入的promise的机制

## async await
