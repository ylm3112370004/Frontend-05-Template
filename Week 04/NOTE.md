


## 字典树

### 基本性质
1. 结点本身不存完整单词；
2. 从根结点到某一个结点，路径上经过的字符连接起来，为该结点对应的字符串；
3. 每个节点的所所有子结点路径代表的字符都不相同

### 核心思想
- Trie树的核心思想是空间换时间。
- 利用字符串的公共前缀来降低查询时间的开销以达到提高效率的目的。


### 递归模板
```javascript
const recursion = (level, params) =>{
  // recursion terminator
  if(level > MAX_LEVEL){
    process_result
    return 
  }
  // process current level
  process(level, params)
  //drill down
  recursion(level+1, params)
  //clean current level status if needed
  
}
```