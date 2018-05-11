def is_prime(n : Int32) : Bool
	if n <= 1
		return false
	end

	if n <= 3
		return true
	end

	if n % 2 == 0 || n % 3 == 0
		return false
	end

	i = 5
	while i * i <= n
		if n % i == 0 || n % (i + 2) == 0
			return false
		end

		i += 6
	end

	return true
end

def sum_primes(n : Int32) : Int64
	current = 1
	primes_found = 0
	sum = 0_i64

	while primes_found < n
		if is_prime(current)
			sum += current
			primes_found += 1
		end
		current += 1
	end

	return sum
end

def main() : Nil
	prime_count = 2_000_000
	result = sum_primes(prime_count)
	puts("Sum of the first #{prime_count} primes: #{result}")
end

main()