const isPrime = (n) => {
	if (n <= 1) {
		return false;
	}

	if (n <= 3) {
		return true;
	}

	if (n % 2 === 0 || n % 3 === 0) {
		return false;
	}

	let i = 5;
	while (i * i <= n) {
		if (n % i === 0 || n % (i + 2) === 0) {
			return false;
		}
		i += 6;
	}

	return true;
}

const sumPrimes = (n) => {
	let current = 1;
	let primesFound = 0;
	let sum = 0;

	while (primesFound < n) {
		if (isPrime(current)) {
			sum += current;
			primesFound++;
		}
		current++;
	}

	return sum;
}

const main = () => {
	const primeCount = 2000000;
	const result = sumPrimes(primeCount);
	console.log(`Sum of the first ${primeCount} primes: ${result}`);
}

main()