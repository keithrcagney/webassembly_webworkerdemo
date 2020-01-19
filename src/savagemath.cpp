#include <stdio.h>
#include "emscripten.h"

int main() { return 0; }

//define the JS method we're going to call
extern "C" {
  long long int CallJS(int n);
}

int fib(int n)
{
  if (n <= 1) return 1;
  return (fib(n - 1) + fib(n - 2));
}

//a method that JS will call into; calls JS method, passing val received
void Savage(int n)
{
  int result = fib(n);
  CallJS(result);
}

// em++ savagemath.cpp -s SIDE_MODULE=1 -s EXPORTED_FUNCTIONS='["CallJS"]' -O1 -o savagemath.wasm