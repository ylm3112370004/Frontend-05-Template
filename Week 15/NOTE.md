# 手势动画

## 动画与时间线

### 动画

概念：帧

实现帧的方式: 对齐 60帧/s
```javascript
// 1. 
setInterval(() => {}, 16);

// 2. 
let tick = () => { setTimeout(tick, 16)};

// 3. 
let tick = () => { 
  let handler = requestAnimationFrame(tick)
  cancelAnimationFrame(handler);
}
```


## 手势

### 事件监听

### 手势基本知识

1. 拖拽

通过浏览器提供的基础事件                                   ----end && v > 1.5px/s--->  flick
          end                                   move        
        ------->    tap                        ______
          move > 10px                  move   | _____|    end
start   -------------->  pan start  -------->  pan   ----------->   pan end

          s > 0.5s        --------move--------->
        ------------>  press  ---end---->  press end
 
2. scroll


### 鼠标事件 mouseEvent

1. mousedown
2. mousemove
3. mouseup


### 触屏事件 touchEvent

1. touchstart
2. touchmove
3. touchend
4. touchcancel