const Benchmark = require('./benchmark');

const benchmarks = [
	new Benchmark('NodeJS', 'nbody', null, null, 'node', ['./src/nodejs/nbody.js']),
	new Benchmark('Crystal', 'nbody', 'crystal', ['build', '--release', './src/crystal/nbody.cr', '-o', './src/crystal/nbody.out'], './src/crystal/nbody.out', null),
	new Benchmark('C', 'nbody', 'gcc', ['-Wall', './src/c/nbody.c', '-o', './src/c/nbody.out', '-lm', '-O3'], './src/c/nbody.out', null),
]

//

const main = async () => {
	const runsPer = 5;
	const results = [];
	for (let benchmark of benchmarks) {
		for (let i = 0; i < runsPer; i++) {
			const result = await benchmark.run();
			results.push(result);
			console.log(JSON.stringify(result));
		}
	}
}

try {
	main();
} catch (err) {
	console.log(err);
}