const { spawn } = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const BenchmarkRunner = require('./benchmarkRunner');
const ResultLogger = require('./resultLogger');
const benchmarkList = require('./benchmarkList');

class LanguageBenchmarks {
	constructor(benchmarks, samples) {
		this.benchmarks = benchmarks;
		this.samples = samples;
	}

	async start() {
		console.log(`Beginning the benchmark run. There are a total of ${this.benchmarks.length} benchmark programs.`);
		console.log(`Each benchmark will execute ${this.samples} times each`);
		
		await this.compileBenchmarks(this.benchmarks);
		const results = await this.runBenchmarks(this.benchmarks, this.samples);

		console.log(`Completed the benchmark run. There was a total of ${results.length} successful benchmarks.`)

		const logger = new ResultLogger();
		logger.logResults(results, this.samples);
	}

	async compileBenchmarks(benchmarks) {
		const compilableBenchmarks = benchmarks.filter(benchmark => benchmark.compileCmd != null);
		for (let benchmark of compilableBenchmarks) {
			try {
				await this._compileBenchmark(benchmark);
				console.log(`The "${benchmark.benchmark}" benchmark has been compiled for ${benchmark.language}.`);
			} catch (err) {
				console.log(`The "${benchmark.benchmark}" benchmark couldn\'t be compiled for ${benchmark.language}. Check if "${benchmark.compileCmd}" is installed.`);
			}
		}
	}

	async runBenchmarks(benchmarks) {
		const results = [];
		for (let i = 1; i <= this.samples; i++) {
			for (let benchmark of benchmarks) {
				try {
					const result = await benchmark.run();
					results.push(result);
					console.log(`The "${benchmark.benchmark}" benchmark has been run for ${benchmark.language} ${i} of ${this.samples} times.`);
				} catch (err) {
					console.log(`The "${benchmark.benchmark}" benchmark couldn\'t run for ${benchmark.language}. Check if "${benchmark.runCmd}" is installed.`);
				}
			}
		}
		return results;
	}

	_compileBenchmark(benchmark) {
		return new Promise((resolve, reject) => {
			if (!benchmark.compileCmd && !benchmark.compileArgs) {
				resolve();
			} else {
				const compileProcess = benchmark.compileArgs
					? spawn(benchmark.compileCmd, benchmark.compileArgs)
					: spawn(benchmark.compileCmd);
	
				compileProcess.on('exit', code => resolve());
				compileProcess.on('error', err => reject(err));
			}
		});
	}
}

async function idk() {
	const { stdout, stderr } = await exec('gcc --version');
	console.log(stdout);
}

async function main() {
	const config = {
		samples: 3,
		// It takes WAY too long to run Python benchmarks...You kidding me!? 800+ seconds for primes!?
		//langsToSkip: ['Python'],
		langsToRun: ['NodeJS', 'Crystal', 'Java'],
		benchmarksToRun: ['SLL Merge-Sort']
	}

	const benchmarksToRun = benchmarkList.filter(b => config.langsToRun.includes(b.language) && config.benchmarksToRun.includes(b.benchmark));
	const runner = new LanguageBenchmarks(benchmarksToRun, config.samples);
	await runner.start();

	process.exit();
}

main();
