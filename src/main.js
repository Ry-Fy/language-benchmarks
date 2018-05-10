const Benchmark = require('./benchmark');

const benchmarks = [
	new Benchmark('NodeJS', 'nbody', null, null, 'node', ['./src/nodejs/nbody.js']),
	new Benchmark('Crystal', 'nbody', 'crystal', ['build', '--release', './src/crystal/nbody.cr', '-o', './src/crystal/nbody.out'], './src/crystal/nbody.out', null),
]

const main = async () => {
	const results = [];
	for (let benchmark of benchmarks) {
		const result = await benchmark.run();
		results.push(result);
		console.log(JSON.stringify(result));
	}
}

try {
	main();
} catch (err) {
	console.log(err);
}