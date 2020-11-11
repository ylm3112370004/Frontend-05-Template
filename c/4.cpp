#include <stdio.h>
#include <stdlib.h>
int main() {
  int count;
  scanf("%d", &count);
  for (int i = 0; i < count; i++) {
    printf("%d\n", rand() % 1000);
  }

  return 0;
}

