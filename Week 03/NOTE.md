# 使用LL算法构建AST

## 四则运算

1. 表达式
<Expression> ::= <AdditiveExpression>

<AdditiveExpression> ::=
  <MultiplicativeExpression>
  | <AdditiveExpression><+><MultiplicativeExpression>
  | <AdditiveExpression><-><MultiplicativeExpression>

<MultiplicativeExpression> ::=
  <Number>
  | <MultiplicativeExpression><*><Number>
  | <MultiplicativeExpression></><Number>

## 正则表达式
1. regexp

## LL词法分析
1. 分类识别
2. 递归调用