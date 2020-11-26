/**
 * 整数
 * @param {Number} n
 * @param {Number} radix 2 8 10 16
 * @return {String}
 */
function NumberToString(n, radix) {
  radix = radix || 10;
  let hexMap = {10: "a", 11: "b", 12: "c", 13: "d", 14: "e", 15: "f"};
  let str = "";
  while (n !== 0) {
    let remainder = n % radix;
    if (remainder >= 10 && radix === 16) {
      str = hexMap[remainder] + str;
    } else {
      str = remainder + str;
    }
    n = Math.floor(n / radix);
  }
  return str;
}

console.log(NumberToString(124, 2));

console.log(NumberToString(1245, 10));

console.log(NumberToString(124, 8));

console.log(NumberToString(124, 16));