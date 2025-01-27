---
title: "10,001st Prime"
description: " What is the 10,001st prime number?"
date: "2025-02-02"
---

Problem Link: [10,001st Prime](https://projecteuler.net/problem=7)

There are 2 ways to solve this problem.

1. Brute Force
2. Sieve of Eratosthenes


### Brute Force ( Trial Division )

#### Mathematical Framework:

To check whether a given number is prime, it must satisfy the following condition:

1. is greater than 1
2. is not divisible by any number from 2 to $\sqrt{n}$

#### Algorithm: 

* Start with the first prime number, 2
* Check each number from 2 to $\sqrt{n}$ to see if it is divisible by the current prime number
* Count each prime number found until we reach the 10,001st prime number

#### C++ Implementation:

```c++
#include <iostream>
#include <cmath>

bool isPrime(int num) {
    if (num < 2) return false;
    for (int i = 2; i <= std::sqrt(num); ++i) {
        if (num % i == 0) return false;
    }
    return true;
}

int main() {
    int count = 0;
    int num = 2;

    while (count < 10001) {
        if (isPrime(num)) {
            ++count;
        }
        ++num;
    }

    std::cout << "10,001st prime: " << num - 1 << std::endl;
    return 0;
}
```


#### Performance:

* Time Complexity: $O(n * \sqrt{n})$
* Space Complexity: $O(1)$

While this is a simple and effective method, it is not the most efficient for large numbers.

### Sieve of Eratosthenes: A Leap Forward


This is a highly efficient algorithm for generating all prime numbers up to a given limit.

1. Create a boolean array of size, initialized to true
2. Mark multiples of each prime number as false
3. The remaining true values are prime numbers

To ensure our sieve covers enough numbers, we need to calculate the upper limit using the formula:

$n * \log(n) + n * \log(\log(n)) $ where $n$ is the number of primes to find.


#### C++ Implementation:

```c++
#include <iostream>
#include <vector>
#include <cmath>

int main() {
    const int n = 10001;
    int upper_bound = n * (std::log(n) + std::log(std::log(n))); // PNT estimate
    std::vector<bool> sieve(upper_bound + 1, true);

    sieve[0] = sieve[1] = false; // 0 and 1 are not primes

    for (int i = 2; i * i <= upper_bound; ++i) {
        if (sieve[i]) {
            for (int j = i * i; j <= upper_bound; j += i) {
                sieve[j] = false;
            }
        }
    }

    int count = 0;
    int result = -1;
    for (int i = 2; i <= upper_bound && count < n; ++i) {
        if (sieve[i]) count++;
        if (count == n) {
            result = i;
            break;
        }
    }

    if (result != -1) {
        std::cout << "The 10,001st prime number is: " << result << std::endl;
    } else {
        std::cout << "Error: Could not find the 10,001st prime number." << std::endl;
    }

    return 0;
}
```


#### Performance:

* Time Complexity: $O(n * \log(n))$
* Space Complexity: $O(n)$

This method is significantly faster than the trial division method, especially for large numbers.


### Method Comparison:


| **Method**                | **Time Complexity** | **Space Complexity** | **Implementation Complexity**        |
| ------------------------- | ------------------- | -------------------- | ------------------------------------ |
| **Brute Force**           | $O(n * \sqrt{n})$   | $O(1)$                | Simple but computationally expensive |
| **Sieve of Eratosthenes** | $O(n * \log(n))$   | $O(n)$                | More complex but highly efficient    |


### Conclusion:

The brute force approach provides a fundamental understanding of prime-finding algorithms, making it an excellent starting point for smaller-scale computations or educational purposes. However, when tackling more substantial tasks, such as identifying the 10,001st prime number, the Sieve of Eratosthenes proves to be significantly more efficient and scalable. Both methods offer unique perspectives on algorithmic problem-solving and numerical analysis, making them valuable tools for understanding these concepts.


