# 编译四则运算

- 定义四则运算：产生四则运算的词法定义和语法定义
- 词法分析：把输入的字符串流变成token
- 语法分析：把token变成抽象语法树AST
- 解释执行：后序遍历AST，执行得出结果

## 词法定义
1. Token:
- Number: 1 2 3 4 5 6 7 8 0的组合
- Operator: + - * / 之一
2. Whitespace: <sp>
3. LineTerminator: <LF> <CR>

## 语法定义 BNF



## 词法分析 状态机、正则表达式



## 语法分析 LL -> AST



## 解释执行 