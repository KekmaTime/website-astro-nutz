---
title: "Special Pythagorean Triplet"
description: "Find the product of a Pythagorean triplet for which a + b + c = 1000"
date: "2025-02-07"
---

Problem Link: [Special Pythagorean Triplet](https://projecteuler.net/problem=9)

There are 2 approaches to solve this problem:

1. Brute Force with Optimization
2. Nested Loop Approach

### Brute Force with Optimization

#### Mathematical Framework:

For a Pythagorean triplet $(a,b,c)$, we need:
1. $a^2 + b^2 = c^2$ (Pythagorean theorem)
2. $a + b + c = 1000$ (Problem constraint)
3. $a < b < c$ (Natural ordering)

We can optimize by:
- Using $c = 1000 - a - b$ to ensure sum constraint
- Maintaining $a < b < c$ ordering
- Starting with smallest possible values

#### Algorithm:

1. Start with smallest possible values: $a=1, b=2$
2. Calculate $c$ using sum constraint
3. Check if triplet is Pythagorean
4. Systematically increment values while maintaining ordering
5. Stop when first solution is found

#### C++ Implementation:

```cpp
#include <iostream>

int main() {
    int a = 1, b = 2, c = 1000 - a - b;

    while (a < b && b < c) {
        if (a * a + b * b == c * c) {
            std::cout << a << " " << b << " " << c << std::endl;
            return 0;
        }

        b++;  
        c = 1000 - a - b;  
        if (b >= c) {
            a++;  
            b = a + 1;  
            c = 1000 - a - b;
        }
    }

    return 0;
}
```


#### Performance:

* Time Complexity: $O(n^2)$ where n is the target sum (1000)
* Space Complexity: $O(1)$

### Nested Loop Approach

#### Mathematical Framework:

Instead of tracking c explicitly, we can:
1. Iterate through possible values of a and b
2. Calculate c from the sum constraint
3. Verify the Pythagorean condition

This leads to cleaner code while maintaining efficiency.

#### Algorithm:

1. For each possible value of a
2. For each possible value of b > a
3. Calculate c = 1000 - a - b
4. Check if forms Pythagorean triplet
5. Return product when found

#### C++ Implementation:

```cpp
#include <iostream>

int main() {
  for (int a = 1; a < 1000; a++) {
    for (int b = a + 1; b < 1000; b++) {
      int c = 1000 - a - b;
      if (a * a + b * b == c * c) {
        std::cout << "Triplet: " << a << ", " << b << ", " << c << std::endl;
        std::cout << "Product: " << a * b * c << std::endl;
        return 0;
      }
    }
  }
  return 0;
}
```

#### Performance:

* Time Complexity: $O(n^2)$ where n is the target sum (1000)
* Space Complexity: $O(1)$

### Method Comparison:

| **Method**                | **Time Complexity** | **Space Complexity** | **Code Clarity**        |
| ------------------------- | ------------------- | -------------------- | ----------------------- |
| **Brute Force**          | $O(n^2)$           | $O(1)$              | More complex logic      |
| **Nested Loop**          | $O(n^2)$           | $O(1)$              | Cleaner and more direct |

### Conclusion:

Both approaches achieve the same time complexity, but the nested loop approach offers cleaner code and better readability. While the brute force method attempts to optimize by tracking the values explicitly, the nested loop approach achieves the same efficiency with simpler logic.

It's a good reminder that code clarity should be prioritized unless there are significant performance gains to be had from more complex implementations.