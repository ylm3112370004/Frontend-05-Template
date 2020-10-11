# 寻路

## 地图编辑器：增删查改

1. 添加 mousedown && e.which !== 3

2. 删除 mousedown && e.which === 3

3. 保存 LocalStorage

4. 查 LocalStorage

### 结构
地图的格子 100*100

### 数据结构

JavaScript中的数组
不同的组合方式，不同的数据结构
push shift 队列 先进先出
push pop 栈 先进后出

## 寻路算法

广度优先搜索算法 

```javascript
function findPath(map, start, end) {
  let queue = [start];
  function insert(x, y) {
    // ......
    queue.push([x,y])
  }
  while(queue.length) {
    let [x,y] = queue.shift();

    insert(x - 1, y, [x, y]);  // 左
    insert(x, y - 1, [x, y]);  // 上
    insert(x + 1, y, [x, y]);  // 右
    insert(x, y + 1, [x, y]);  // 下
    // ......
  }
}
```

### 数据结构

0. 接口
```javascript
// 创建结构
new ClassName(data: [], compare: (a, b) => a - b)

// 获取最短距离节点
take: [x, y]()

// 插入节点
give: void(v: [x, y])
```

1. 数组存储数据
```javascript
class ArraySorted {
  constructor(data, compare) {
    this.data = data.slice();
    this.compare = compare || ((a, b) => a - b);
  }
  take() {
    if(this.data.length === 0) {
      return;
    }
    let min = this.data[0];
    let minIndex = 0;
    for(let i=1; i<this.data.length; i++) {
      if(this.compare(this.data[i], min) < 0) {
        min = this.data[i];
        minIndex = i;
      }
    }
    this.data[minIndex] = this.data[this.data.length-1];
    this.data.pop(); 
    return mim;
  }
  give(v) {
    this.data.push(v)
  }
}
```

2. 小顶堆 存储数据 底层数据结构：数组
```javascript
class HeapSorted {
  constructor(data, compare) {
    this.data = data.slice() || [];
    this.compare = compare || ((a, b) => a - b)
  }
  get length() {
    return this.data.length;
  }
  take() {
    if(this.data.length === 0) {
      return;
    }
    if(this.data.length === 1) {
      return this.data.shift();
    }
    let removeValue = this.data.shift();
    this.siftDown(0);
    return removeValue;
  }
  give(v) {
    // 构架小顶堆
    if(v !== null) {
      this.data.push(v);
      this.siftUp(this.data.length - 1);
      return true;
    }
    return false;
  }
  getParentIndex(index) {
    if(index === 0) {
      return;
    }
    return Math.floor((index-1) / 2)
  }
  getLeftIndex(index) {
    return index*2+1;
  }
  getRightIndex(index) {
    return index*2+2;
  }
  swap(array, a, b) {
    let tmp = array[a];
    array[a] = array[b];
    array[b] = tmp;
  }
  siftUp(index) {
    let parent = this.getParentIndex(index);
    while(index > 0 && this.compare(this.data[index], this.data[parent]) < 0) {
      this.swap(this.data, index, parent);
      index = parent;
      parent = this.getParentIndex(index);
    }
  }
  siftDown(index) {
    let element = index;
    let size = this.data.length-1;
    let leftIndex = this.getLeftIndex(element);
    let rightIndex = this.getRightIndex(element);
    if(leftIndex<size && this.compare(this.data[element], this.data[leftIndex])>0) {
      element = leftIndex
    }
    if(rightIndex<size && this.compare(this.data[element], this.data[rightIndex])>0) {
      element = rightIndex;
    }
    if(index !== element) {
      this.swap(this.data, element, index);
      this.siftDown(element);
    }
  }
}
```