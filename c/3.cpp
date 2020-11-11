#include <stdio.h>

int main() {
  int a, b;
  scanf("%d", &a);
  for (int i = 1; i <= a; i++) {
    for (int j = 1; j <= i; j++) {
      printf("%d * %d = %d", i, j, i*j);
      if (j != i) {
        printf("\t");
      }
    }
    printf("\n");
  }
  return 0;
}
