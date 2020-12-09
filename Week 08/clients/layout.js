const constant = (style) => {
  let data = {
    'row': { mainSize: 'width', mainStart: 'left', mainEnd: 'right', mainSign: +1, mainBase: 0, crossSize: 'height', crossStart: 'top', crossEnd: 'bottom' },
    'row-reverse': { mainSize: 'width', mainStart: 'right', mainEnd: 'left', mainSign: -1, mainBase: style.width, crossSize: 'height', crossStart: 'top', crossEnd: 'bottom' },
    'column': { mainSize: 'height', mainStart: 'top', mainEnd: 'bottom', mainSign: +1, mainBase: 0, crossSize: 'width', crossStart: 'left', crossEnd: 'right' },
    'column-reverse': { mainSize: 'height', mainStart: 'top', mainEnd: 'bottom', mainSign: -1, mainBase: style.height, crossSize: 'width', crossStart: 'left', crossEnd: 'right' },
  }
  return data[style.flexDirection];
}


// 1. 用px标识的处理为数字
// 2. 纯数字的转换一下
// 预处理的逻辑
function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }
  for (let prop in element.computedStyle) {
    console.log(1, prop);
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    if (element.style[prop].toString().match(/^[0-9\.]+/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}

function layout(element) {
  // 准备工作
  if (!element.computedStyle) return;
  let elementStyle = getStyle(element);

  if (elementStyle.display !== "flex") return;

  let items = element.children.filter(e => e.type === "element"); // 过滤text

  items.sort(function (a, b) {    // 支持order属性？？？
    return (a.order || 0) - (b.order || 0);
  });

  let style = elementStyle;

  ['width', 'height'].forEach(size => {
    if (style[size] === "auto" || style[size] === '') {
      style[size] = null;   // 统一后，方便判断
    }
  })
  if (style.flexDirection || style.flexDirection === "auto") { // 排版方向
    style.flexDirection = 'row';  
  }
  if (style.alignItems || style.alignItems === "auto") {  //属性定义项目在交叉轴上如何对齐。
    style.alignItems = 'stretch'; // 全部拉伸
  }
  if (style.justifyContent || style.justifyContent === "auto") { //属性定义了项目在主轴上的对齐方式
    style.justifyContent = 'flex-start';
  }
  if (style.flexWrap || style.flexWrap === "auto") { // 默认情况下，项目都排在一条线（轴线）上，flex-wrap属性
    style.flexWrap = 'no-wrap';  // nowrap/wrap/wrap-reverse                    // 定义了轴线拍不下，如何换行
  }
  if (style.alignContent || style.alignContent === "auto") { //属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。
    style.alignContent = 'stretch';// flex-start/flex-end/center/stretch/space-between/space-around
  }
  let { mainSize, mainStart, mainEnd, mainSign, mainBase, 
    crossSize, crossStart, crossEnd, crossSign, crossBase } = constant(style);

  if (style.flexWrap === "wrap-reverse") {
    let tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }
}

module.exports = layout;