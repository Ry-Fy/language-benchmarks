fn is_prime(n: i32) -> bool {
	if n <= 1 {
		return false;
	}

	if n <= 3 {
		return true;
	}

	if n % 2 == 0 || n % 3 == 0 {
		return false;
	}

	let mut i = 5_i32;
	while i * i <= n {
		if n % i == 0 || n % (i + 2) == 0 {
			return false;
		}

		i += 6;
	}

	return true;
}

fn sum_primes(n: i32) -> i64 {
	let mut current = 1_i32;
	let mut primes_found = 0_i32;
	let mut sum = 0_i64;

	while primes_found < n {
		if is_prime(current) {
			sum += current as i64;
			primes_found += 1;
		}
		current += 1;
	}

	return sum;
}

fn main() {
	let prime_count = 2_000_000_i32;
	let result = sum_primes(prime_count);
	println!("Sum of the first {} primes: {}", prime_count, result);
}
