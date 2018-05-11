package main

import (
	"fmt"
)

func isPrime(n int32) bool {
	if n <= 1 {
		return false
	}

	if n <= 3 {
		return true
	}

	if n%2 == 0 || n%3 == 0 {
		return false
	}

	var i int32 = 5
	for i*i <= n {
		if n%i == 0 || n%(i+2) == 0 {
			return false
		}

		i += 6
	}

	return true
}

func sumPrimes(n int32) int64 {
	var current int32 = 1
	var primesFound int32
	var sum int64

	for primesFound < n {
		if isPrime(current) {
			sum += int64(current)
			primesFound++
		}
		current++
	}

	return sum
}

func main() {
	var primeCount int32 = 2000000
	result := sumPrimes(primeCount)
	fmt.Printf("Sum of the first %d primes: %d", primeCount, result)
}
