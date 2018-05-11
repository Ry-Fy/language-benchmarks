#include <stdio.h>
#include <stdlib.h>

int isPrime(int n) {
	if (n <= 1) {
		return 0;
	}

	if (n <= 3) {
		return 1;
	}

	if (n % 2 == 0 || n % 3 == 0) {
		return 0;
	}

	int i = 5;
	while (i * i <= n) {
		if (n % i == 0 || n % (i + 2) == 0) {
			return 0;
		}

		i += 6;
	}

	return 1;
}

long sumPrimes(int n) {
	int current = 1;
	int primesFound = 0;
	long sum = 0;

	while (primesFound < n) {
		if (isPrime(current)) {
			sum += current;
			primesFound++;
		}
		current++;
	}

	return sum;
}

int main() {
	int primeCount = 2000000;
	long result = sumPrimes(primeCount);
	printf("Sum of the first %d primes: %lu\n", primeCount, result);
}