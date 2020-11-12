// 只处理了4字节的 有到6字节的 不是很常用
function getUTF8(str) {
  let utf8Arr = [];
  for (let c of str) {
    console.log(c.codePointAt(0));
    let codePoint = c.codePointAt(0);
    if (codePoint >= 0x00 && codePoint <= 0x7f) {
      // 一个字节
      utf8Arr.push(codePoint);
    } else if (codePoint >= 0x80 && codePoint <= 0x7ff) {
      // 两个字节
      // 110xxxxx 10xxxxxx
      utf8Arr.push(192 | (codePoint >> 6)); // 110 拼接 去掉后6位后的
      utf8Arr.push(128 | (63 & codePoint)); // 10 拼接 后6位
    } else if (codePoint >= 0x800 && codePoint <= 0xffff) {
      // 三个字节
      // 1110xxxx 10xxxxxx 10xxxxxx
      utf8Arr.push(224 | (codePoint >> 12)); // 1110 拼接 除去12位的
      utf8Arr.push(128 | (63 & (codePoint >> 6))); // 10 拼接 中间6位
      utf8Arr.push(128 | (63 & codePoint)); // 10 拼接 后6位
    } else if (codePoint >= 0x10000 && codePoint <= 0x10ffff) {
      // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      utf8Arr.push(240 | (codePoint >> 18)); // 1110 拼接 除去12位的
      utf8Arr.push(128 | (63 & (codePoint >> 12))); // 1110 拼接 除去12位的
      utf8Arr.push(128 | (63 & (codePoint >> 6))); // 10 拼接 中间6位
      utf8Arr.push(128 | (63 & codePoint)); // 10 拼接 后6位
    }
  }

  // 把数字转换为2进制
  // for (let a of utf8Arr) {
  //   console.log(typeof a);
  //   console.log(a.toString(2));
  // }
  return getBinary(utf8Arr);
}

// 10进制转2进制 258以内的
function getBinary(arr) {
  let ret = [];
  let byte = new Array(8).fill(0);
  for (let b of arr) {
    let temp = Object.create(byte);
    let i = byte.length - 1;
    if (b > 256) return;
    while (b !== 0) {
      temp[i--] = b%2;
      b = Math.floor(b/2);
    }
    ret.push(temp.join(""));
  }

  return ret;
}

console.log(getUTF8("一"));

// utf8编码规则地址
// https://www.cnblogs.com/chenwenbiao/archive/2011/08/11/2134503.html