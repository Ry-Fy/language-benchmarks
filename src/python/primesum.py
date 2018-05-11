def is_prime(n):
	if (n <= 1):
		return False
	
	if (n <=3):
		return True
	
	if (n % 2 == 0 or n % 3 == 0):
		return False
	
	i = 5
	while (i * i <= n):
		if (n % i == 0 or n % (i + 2) == 0):
			return False
		i += 6

	return True

def sum_primes(n):
	current = 1
	primes_found = 0
	prime_sum = 0

	while (primes_found < n):
		if (is_prime(current)):
			prime_sum += current
			primes_found += 1
		current += 1

	return prime_sum

def main():
	prime_count = 2_000_000
	result = sum_primes(prime_count)
	print(f"Sum of the first {prime_count} primes: {result}")

main()