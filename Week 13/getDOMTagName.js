// 0 遍历DOM 递归 + Node的属性
// 1 tagName只有element有
// 2 ParentNode.children 是一个只读属性，
//   返回一个Node的子elements ，  
//   是一个动态更新的 HTMLCollection。

// 补充：Node.childNodes 返回包含指定节点的子节点的集合，
// 该集合为即时更新的集合（live collection）。

let index = 0;

function getTagName(root) {
    if(!(root instanceof Element)) return;
    ++index;
//     console.log(++index, root.tagName);
    const children = root.children;
    if(children.length === 0) {
        return;
    }
    for(let child of children) {
        getTagName(child);
    }
}

getTagName(document.body);
console.log(index);