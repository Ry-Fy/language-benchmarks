final class PrimeSum {
	private static boolean IsPrime(int n) {
		if (n <= 1) {
			return false;
		}

		if (n <= 3) {
			return true;
		}

		if (n % 2 == 0 || n % 3 == 0) {
			return false;
		}

		int i = 5;
		while (i * i <= n) {
			if (n % i == 0 || n % (i + 2) == 0) {
				return false;
			}

			i += 6;
		}

		return true;
	}

	private static long SumPrimes(int n) {
		int current = 1;
		int primesFound = 0;
		long sum = 0;

		while (primesFound < n) {
			if (IsPrime(current)) {
				sum += current;
				primesFound++;
			}
			current++;
		}

		return sum;
	}

	public static void main(String[] args) {
		int primeCount = 2000000;
		long result = SumPrimes(primeCount);
		System.out.format("Sum of the first %d primes: %d", primeCount, result);
	}
}