using System;

namespace primesum {
	class Program {
		static bool IsPrime(int n) {
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

		static long SumPrimes(int n) {
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

		static void Main(string[] args) {
			int primeCount = 2000000;
			long result = SumPrimes(primeCount);
			Console.WriteLine($"Sum of the first {primeCount} primes: ${result}");
		}
	}
}