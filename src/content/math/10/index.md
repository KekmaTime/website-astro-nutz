---
title: "Summation of Primes"
description: "Find the sum of all the primes below two million."
date: "2025-02-08"
---

Problem Link: [Summation of Primes](https://projecteuler.net/problem=10)

There are 3 approaches to solve this problem:

1. Brute Force (Trial Division)
2. Basic Sieve of Eratosthenes
3. Optimized Sieve with Bitset

### Brute Force (Trial Division)

#### Mathematical Framework

To check whether a given number is prime, it must satisfy:

1. is greater than 1
2. is not divisible by any number from 2 to $\sqrt{n}$

Then sum all prime numbers found below the target.

#### Algorithm

* Check each number up to n for primality
* Use trial division up to square root for primality test
* Add prime numbers to running sum

#### C++ Implementation

```cpp
#include <cmath>
#include <iostream>

bool checkPrime(long n) {
  if (n <= 1) {
    return false;
  }
  for (long i = 2; i <= sqrt(n); i++) {
    if (n % i == 0) {
      return false;
    }
  }
  return true;
}

int main() {

  long n;
  std::cout << "Enter a number: ";
  std::cin >> n;

  long sum = 0;
  for (long i = 2; i < n; i++) {
    if (checkPrime(i)) {
      sum += i;
    }
  }

  std::cout << "Sum of all prime numbers below " << n << " is " << sum
            << std::endl;

  return 0;
}
```

#### Performance

* Time Complexity: $O(n\sqrt{n})$
* Space Complexity: $O(1)$

### Basic Sieve of Eratosthenes

#### Mathematical Foundation

A prime number is a natural number greater than 1 that has exactly two divisors: 1 and itself.
To determine prime numbers up to $n$, we use the Sieve of Eratosthenes, which systematically marks multiples of each prime.
A number $x$ is prime if and only if it is not a multiple of any smaller prime.

Complexity Analysis:

Outer Loop (Choosing Primes):
We iterate up to $n$ because any composite number $x$ must have at least one factor $\leq \sqrt{x}$.
So, we only need to check and mark numbers up to $n$.

Inner Loop (Marking Multiples):

For each prime $p$, we mark all multiples $p^2, p^2+p, p^2+2p, \ldots$ up to $n$.
The sum of the number of times we visit each number is given by:
$\sum_{p \leq n} \frac{n}{p}$
This follows the Harmonic series approximation and leads to a complexity of:
$O(n \log \log n)$
This is significantly better than the naive $O(n\sqrt{n})$ approach.

#### Algorithm

1. Create a boolean array `isPrime[n]`, initially all set to true
2. Mark multiples of each prime number as false
3. Sum the remaining true indices which are prime numbers

#### C++ Implementation

```cpp
#include <iostream>
#include <vector>

long sumPrimesBelow(long n) {
    if (n < 2) return 0;

    std::vector<bool> isPrime(n, true);
    isPrime[0] = isPrime[1] = false;

    for (long i = 2; i * i < n; i++) {
        if (isPrime[i]) {
            for (long j = i * i; j < n; j += i) {
                isPrime[j] = false;
            }
        }
    }

    long sum = 0;
    for (long i = 2; i < n; i++) {
        if (isPrime[i]) {
            sum += i;
        }
    }

    return sum;
}

int main() {
    long n;
    std::cout << "Enter a number: ";
    std::cin >> n;

    std::cout << "Sum of all prime numbers below " << n << " is " << sumPrimesBelow(n) << std::endl;
    
    return 0;
}
```

#### Performance

* Time Complexity: $O(n\log\log n)$
* Space Complexity: $O(n)$

### Ultra-Optimized Sieve

#### Mathematical Improvements

Skipping Even Numbers:

In the basic sieve, we mark every multiple, but half of them are even.
Instead, we only process odd numbers, reducing time complexity by a factor of 2.

Starting from $p^2$:

Instead of marking from $2p$, we start from $p^2$.
Why? Because smaller multiples of $p$ (like $2p$, $3p$, ..., $(p-1)p$) were already marked by smaller primes.
This reduces the number of unnecessary iterations.

Using Bitwise Storage:

The naive sieve uses 1 byte per number, but only 1 bit is needed (prime or not).
Using a bitset, we reduce memory usage by a factor of 8.
This makes cache locality better, reducing cache misses and improving CPU efficiency.

#### Algorithm

1. Use bitset for space-efficient prime marking
2. Handle 2 separately and only process odd numbers
3. Start marking composites from $i^2$
4. Increment by $i * 2$ to skip even multiples

#### C++ Implementation

```cpp
#include <iostream>
#include <bitset>
#include <vector>

const long LIMIT = 2000000;  // Adjust limit based on requirement
std::bitset<LIMIT> isPrime;  // Efficient bit storage

long sumPrimesBelow(long n) {
    if (n < 2) return 0;

    isPrime.set();  // Set all bits to 1 (assuming all are prime)
    isPrime[0] = isPrime[1] = 0;

    long sum = 2;  // Start with 2 (only even prime)

    // Process only odd numbers
    for (long i = 3; i < n; i += 2) {
        if (isPrime[i]) {
            sum += i;
            // Mark multiples of i as non-prime from i*i
            for (long j = i * i; j < n; j += i * 2) {
                isPrime[j] = 0;
            }
        }
    }

    return sum;
}

int main() {
    long n;
    std::cout << "Enter a number: ";
    std::cin >> n;

    std::cout << "Sum of all prime numbers below " << n << " is " << sumPrimesBelow(n) << std::endl;

    return 0;
}
```

#### Performance

* Time Complexity: $O(n\log\log n)$
* Space Complexity: $O(n/8)$ bits

### Method Comparison

| **Method**              | **Time Complexity**  | **Space Complexity** | **Performance for n=2,000,000** |
|------------------------|---------------------|---------------------|--------------------------------|
| **Brute Force**        | $O(n\sqrt{n})$      | $O(1)$              | Very Slow (>10s)               |
| **Basic Sieve**        | $O(n\log\log n)$    | $O(n)$              | Fast (~1s)                     |
| **Optimized Sieve**    | $O(n\log\log n)$    | $O(n/8)$            | Blazing Fast (~0.1s)           |

### Conclusion

While all three methods correctly solve the problem, the optimized Sieve of Eratosthenes demonstrates how mathematical insight combined with implementation optimizations can dramatically improve performance. The progression from brute force to optimized sieve shows a classic trade-off between memory usage and computational speed, with the optimized version achieving the best balance for this specific problem.

The final optimized version can handle the Project Euler requirement (finding sum of primes below two million) in under 0.1 seconds on modern CPUs, making it the ideal choice for this challenge.
