#include <stdio.h>

int main() {

  char str[100];
  scanf("%s", str);

  for (int i = 0; str[i]; i++) {
    printf("%c\n", str[i]);
  }

  printf("\n");
  return 0;
}


// int main() {
//   int n, m;
//   scanf("%d%d", &n ,&m);
//   int arr[n];
//   for (int i = 0; i < n; i++) {
//     scanf("%d", &arr[i]);
//   }
//   int flag;
//   for (int j = 1; j <= m; j++) {
//     flag = false;
//     for (int i = 0; i < n; i++) {
//       if ( j % arr[i] == 0) {
//         flag = true;
//         break;
//       }
//     }
//     if (!flag) printf("%d\n", j);
//   }
//   return 0;
// }