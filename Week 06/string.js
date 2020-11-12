// 写一段 JS 的函数，把一个 string 它代表的字节给它转换出来，
// 用 UTF8 对 string 进行遍码。

function UTF8_Encoding(str) {
  const buf = Buffer.from(str, 'utf8'); // 得到utf8的编码
  let ret = [];
  let byte = new Array(8).fill(0);
  for (let b of buf) {
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


console.log(UTF8_Encoding("a12b"));

// string代表的字节 转换出来