var p1 = Promise.resolve(1);
var expand_v2 = x => {
  return (x<9)? '0'+x: x.toString();
}

p1.then(expand_v2)
.then(v2 => {
  return 'v3: ' + v2;
})