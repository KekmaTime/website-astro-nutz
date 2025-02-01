---
title: "Largest Product in a Series"
description: "Find the greatest product of thirteen adjacent digits in a 1000-digit number"
date: "2024-03-26"
---

Problem Link: [Largest Product in a Series](https://projecteuler.net/problem=8)

There are 2 primary approaches to solve this problem:

1. Brute Force
2. Sliding Window Optimization

### Brute Force Approach

#### Mathematical Framework
For a sequence of digits $S = s_1s_2s_3...s_{1000}$, evaluate all possible 13-digit contiguous subsequences:

$P_i = \prod_{k=0}^{12} s_{i+k} \quad \text{for} \quad 1 \leq i \leq 988$

Find the maximum value among all $P_i$.

#### Algorithm

- Iterate through all possible starting positions
- Calculate each product directly
- Track the maximum product found

#### C++ Implementation

```cpp
#include <iostream>
#include <string>

using namespace std;

long long bruteForceMaxProduct(const string &number, int k) {
    long long maxProduct = 0;

    // Iterate through all possible sets of k adjacent digits
    for (int i = 0; i <= number.length() - k; i++) {
        long long product = 1;
        
        // Compute the product of the current set of k digits
        for (int j = 0; j < k; j++) {
            product *= (number[i + j] - '0');  // Convert char to int
        }
        
        // Update max product if the new product is greater
        maxProduct = max(maxProduct, product);
    }

    return maxProduct;
}

int main() {
    string number =
        "73167176531330624919225119674426574742355349194934"
        "96983520312774506326239578318016984801869478851843"
        "85861560789112949495459501737958331952853208805511"
        "12540698747158523863050715693290963295227443043557"
        "66896648950445244523161731856403098711121722383113"
        "62229893423380308135336276614282806444486645238749"
        "30358907296290491560440772390713810515859307960866"
        "70172427121883998797908792274921901699720888093776"
        "65727333001053367881220235421809751254540594752243"
        "52584907711670556013604839586446706324415722155397"
        "53697817977846174064955149290862569321978468622482"
        "83972241375657056057490261407972968652414535100474"
        "82166370484403199890008895243450658541227588666881"
        "16427171479924442928230863465674813919123162824586"
        "17866458359124566529476545682848912883142607690042"
        "24219022671055626321111109370544217506941658960408"
        "07198403850962455444362981230987879927244284909188"
        "84580156166097919133875499200524063689912560717606"
        "05886116467109405077541002256983155200055935729725"
        "71636269561882670428252483600823257530420752963450";

    int k = 13; // Length of adjacent digits
    cout << "Brute force max product of " << k << " adjacent digits: " << bruteForceMaxProduct(number, k) << endl;

    return 0;
}
```


#### Performance

- Time Complexity: $O(n \cdot k)$ (988 × 13 = 12,844 operations)
- Space Complexity: $O(1)$

### Sliding Window Optimization

#### Mathematical Framework

For a sliding window of size k, we can efficiently calculate the next product by:

1. Dividing out the leftmost (outgoing) digit
2. Multiplying by the rightmost (incoming) digit

This gives us the formula:

$P_{i} = \frac{P_{i-1} \times s_{i+k-1}}{s_{i-1}}$

Where:

- $P_i$ is the product at position i
- $s_i$ represents the digit at position i
- k is the window size (13 in this case)

Special handling required for zero values to maintain numerical stability.

#### Algorithm

- Initialize with first window's product
- Slide window while updating product
- Track zeros separately to avoid division errors
- Maintain maximum product

#### C++ Implementation

```cpp
#include <iostream>
#include <string>

using namespace std;

long long findMaxProduct(const string &number, int k) {
    long long maxProduct = 0, currentProduct = 1;
    int zeroCount = 0;  // Track the number of zeros in the window

    // Compute the initial product of the first k digits
    for (int i = 0; i < k; i++) {
        int digit = number[i] - '0';
        if (digit == 0) zeroCount++;
        else currentProduct *= digit;
    }

    // If no zeros, set maxProduct
    if (zeroCount == 0) maxProduct = currentProduct;

    // Sliding window
    for (int i = k; i < number.length(); i++) {
        int newDigit = number[i] - '0';     // New digit entering the window
        int oldDigit = number[i - k] - '0'; // Old digit leaving the window

        // Remove the effect of the old digit
        if (oldDigit == 0) zeroCount--;
        else currentProduct /= oldDigit;

        // Add the effect of the new digit
        if (newDigit == 0) zeroCount++;
        else currentProduct *= newDigit;

        // Update maxProduct if no zeros are present in the window
        if (zeroCount == 0) {
            maxProduct = max(maxProduct, currentProduct);
        }
    }

    return maxProduct;
}

int main() {
    string number =
        "73167176531330624919225119674426574742355349194934"
        "96983520312774506326239578318016984801869478851843"
        "85861560789112949495459501737958331952853208805511"
        "12540698747158523863050715693290963295227443043557"
        "66896648950445244523161731856403098711121722383113"
        "62229893423380308135336276614282806444486645238749"
        "30358907296290491560440772390713810515859307960866"
        "70172427121883998797908792274921901699720888093776"
        "65727333001053367881220235421809751254540594752243"
        "52584907711670556013604839586446706324415722155397"
        "53697817977846174064955149290862569321978468622482"
        "83972241375657056057490261407972968652414535100474"
        "82166370484403199890008895243450658541227588666881"
        "16427171479924442928230863465674813919123162824586"
        "17866458359124566529476545682848912883142607690042"
        "24219022671055626321111109370544217506941658960408"
        "07198403850962455444362981230987879927244284909188"
        "84580156166097919133875499200524063689912560717606"
        "05886116467109405077541002256983155200055935729725"
        "71636269561882670428252483600823257530420752963450";

    int k = 13; // Length of adjacent digits
    cout << "Maximum product of " << k << " adjacent digits: " << findMaxProduct(number, k) << endl;
    
    return 0;
}
```

#### Performance

- Time Complexity: $O(n)$ (1,000 operations)
- Space Complexity: $O(1)$

### Method Comparison

| **Method**                | **Time Complexity** | **Space Complexity** | **Zero Handling**       |
| ------------------------- | ------------------- | -------------------- | ------------------------- |
| **Brute Force**           | $O(n \cdot k)$      | $O(1)$                | Implicit in calculation |
| **Sliding Window**        | $O(n)$              | $O(1)$                | Explicit zero tracking  |

### Conclusion

The brute force method provides a straightforward solution suitable for small values of k, while the sliding window technique offers superior performance for larger window sizes. The optimized approach reduces redundant calculations by 92% (from 12,844 to 1,000 operations) for this problem, demonstrating the power of algorithmic optimization in numerical processing tasks.

Both methods highlight important aspects of sequence analysis - the brute force method emphasizes clarity, while the sliding window technique showcases efficiency through incremental computation.
