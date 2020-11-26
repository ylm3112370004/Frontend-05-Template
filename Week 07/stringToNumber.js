/**
 * 
 * @param {String} s
 * @param {Number} radix 2 8 10 16
 * @return {Number}
 */
function StringToNumber(s, radix) {
  radix = radix || 10;
  let n = 0;
  let chars = s.split("").map(char => char.charCodeAt(0) - "0".charCodeAt(0));
  for (let char of chars) {
    if (radix === 16) {
      if (char === 17 || char === 49) { // A a
        char = 10;
      } else if(char === 18 || char === 50) { // B b
        char = 11;
      } else if (char === 19 || char === 51) { // C c
        char = 12;
      } else if (char === 20 || char === 52) { // D d
        char = 13;
      } else if (char === 21 || char === 53) { // E e
        char = 14;
      } else if (char === 22 || char === 54) { // F f
        char = 15;
      }
    }
    if (char < 0 || char >= radix) continue;
    n *= radix;
    n += char;
  }
  return n;
}

console.log(StringToNumber("12", 2));

console.log(StringToNumber("12", 2));

console.log(StringToNumber("1a", 16));