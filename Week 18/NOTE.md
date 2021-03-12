# 工具链（二）

## 前端什么需要测试

除一次性业务除外，都应该进行测试

1. 开源项目
2. 公司商业项目
- 组件
- 库

## 最流行的测试库

1. Mocha
2. Jest

### Mocha

1. 全局安装
2. 局部安装

#### Mocha本身是针对Node.js的测试框架

```javascript
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
```

1. it是真正的测试
2. 需要引用assert（断言）
3. describe 是分组

所以只支持require方式引入模块
但是可以搭配其他 babel

##### 解决 export 现代语法问题？

1. webpack 中的 dist 目录 
相当于使用webpack，但是相当于依赖build， 之后还要做一下code coverage，不应该与其他想混合
2. babel
- @babel/core
- @babel/register

最佳实践都是使用local的工具，而不是使用电脑全局的

##### mocha 执行

执行mocha时需要使用`./node_modules/.bin/mocha --require  @babel/register`

但是此时 是没有说明要将代码转换为什么版本，所以需要告诉babel，即添加一个配置文件.babelrc

```javascript
{
  "presets": ["@babel/preset-env"]
}
```

##### package.json

node的体系中 对测试是非常重视的，在`package.json`文件中 `script`中有默认的test命令，并且在test中会直接调用`./node_modules/bin/`下的内容，所以，我们的文件可以直接调用`mocha --require @babel/register`

```javascript
{
  "script": {
    "test": "mocha --require @babel/register"
  }
}
```

### Jest


## code coverage的计算

注意：写了一下test cases，但是到底有没有测试全面一个文件，或者一个方法，是应该有一定指标来衡量的。

测试覆盖了源文件中的那些代码

### nyc 工具

`nyc ./node_modules/.bin/mocha --require  @babel/register`

```javascript
// nyc 与 babel互相加一个插件 为什么
npm i babel-plugin-istanbul @istanbuljs/nyc-config-babel --save-dev
```

#### nyc 调试 配置

vscode中lunch.json