

## 判断与循环：给程序加上逻辑处理

1. 逻辑分支判断的分支结构 if...else 语法结构
- 表达式是什么
一个重要的事实，变量有变量对应的值，表达式也有表达式对应的值。
那么条件表达式“a == b”所对应的值是什么呢？
其实就是数字 1 或者 0，分别表示
“条件成立”（a 与 b 的值相等）
“不成立”（a 与 b 的值不相等）

- 怎样理解if后面跟的一条语句，所谓一条语句的概念范围是什么？
```C
// 第一种 空语句
if (a == 3) {}

// 第二种 单一语句
if (a == 3) { printf("hello c!"); }

// 第三种，复合语句，被大括号包裹，中间是若干条语句
if (a == 3) {
    printf("hello geek1!\n");
    printf("hello geek2!\n");
    printf("hello geek3!\n");
}

// 第四种，结构语句，以 if，for，while 等开头的分支语句或循环语句
if (a == 3) 
    if (b == 4) {
        printf("hello geek!\n");
    }
```

2. 给程序添加重复执行功能：for和while
- while (循环条件) 一条语句；
- for (初始化1；循环条件2；循环后操作3) 一条语句；


### 重点
1. 熟练掌握分支和循环结构的执行顺序
2. if语句，首选判断表达式的真假，如果为真，则执行if里面的语句
3. for循环，分成四部分，其中2，4，3部分，构成一个循环，第1部分是初始化，只执行一次
4. 所谓一条语句的概念，包括了空语句，复合语句和结构语句


## 04 随机函数：随机试验真的可以算π值吗？

1. 真随机与伪随机
- 真随机：两次事件相互独立
- 伪随机序列
就是类似第二个序列那样的，没有什么明显规律的一个更大的循环序列
1-2-3-4-5-6， 4-2-1-6-3-5
一旦要是上一个随机函数的值确定了，下一个数字也就确定了。而纯正意义上的真随机，应该是前后两次出现的数字是两次独立事件，没有关系。

2. 程序中的随机函数
现在我们所接触到的语言中，没有真随机，全是伪随机。
也就是说，语言中给我吗准备好了一个随机函数，这个随机函数会根据上一个随机值和一个固定的计算规则，得到下一个随机值。

随机种子

### 要点
1. 计算机中都是伪随机函数，也就是说，下一次的随机值，跟本次的随机值是相关的。
2. 使用srand函数设置随机种子，也就是设置伪随机过程中的第一个起始点的位置。


## 05 数组

**字节**是存储数据的最基本单位，**比特**是表示信息的最基本单位

比特是数据表示的最小单元，就是通常所说的一个二进制位。
字节是数据存储的最基本单位，存储在计算机中的数据。一定是占用若干个字节的存储空间。
内存地址，是每一个字节的唯一标记。


1. 使用数组，可以很方便的定义出一组变量存储空间，数组下标从 0 开始。数据的2. 最基本存储单位是字节，每一个字节都有一个独一无二的地址。一个变量占用若干3. 个字节，第一个字节的地址，是这个变量的首地址，称为：变量地址。



## 07 指针变量也是变量

结构体 struct name {}
直接引用 .
间接引用 ->