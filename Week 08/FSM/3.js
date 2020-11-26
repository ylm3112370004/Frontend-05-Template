
function findA(str) {
  for (let i = 0; i < str.length; i++) {
    if ('a' === str[i]) {
      return i;
    }
  }
  return -1;
}

function match(str) {
  let state = false;
  for (let i = 0; i < str.length; i++) {
    if(str[i] === 'a') {
      state = true;
    } else if (state && str[i] === 'b') {
      return i-1;
    } else {
      state = false;
    }
  }
  return -1;
}

console.log(match('adfabdd'));


function match(str) {
  let state = "Initial";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "a") {
      state = "a";
    } else if (state === "a" && str[i] === "b") {
      state = "b";
    } else if (state === "b" && str[i] === "c") {
      state = "c";
    } else if (state === "c" && str[i] === "d") {
      state = "d";
    } else if (state === "d" && str[i] === "e") {
      state = "e";
    } else if (state === "e" && str[i] === "f") {
      // state = "f";
      return true;
    } else {
      state = "Initial";
    }
  }
  return false;
}

console.log(match("sdfsabfcdefgi"));