const { spawn } = require('child_process');
const BenchmarkRunner = require('./benchmarkRunner');
const ResultLogger = require('./resultLogger');
const benchmarkList = require('./benchmarkList');

class LanguageBenchmarks {
	constructor(benchmarks) {
		this.benchmarks = benchmarks;
	}

	async start() {
		console.log(`Beginning benchmark run. There are ${this.benchmarks.length} benchmark programs to run.`)

		await this.compileBenchmarks(this.benchmarks);
		const results = await this.runBenchmarks(this.benchmarks);

		console.log(`Completed benchmark run. There were ${results.length} successfully run benchmarks.`)

		const logger = new ResultLogger();
		logger.logResults(results);
	}

	async compileBenchmarks(benchmarks) {
		const compilableBenchmarks = benchmarks.filter(benchmark => benchmark.compileCmd != null);
		for (let benchmark of compilableBenchmarks) {
			try {
				await this._compileBenchmark(benchmark);
				console.log(`The "${benchmark.benchmark}" benchmark has been compiled for ${benchmark.language}.`);
			} catch (err) {
				console.log(`The "${benchmark.benchmark}" benchmark couldn\'t be compiled for ${benchmark.language}. Are you sure you have "${benchmark.compileCmd}" installed?`);
			}
		}
	}

	async runBenchmarks(benchmarks) {
		const results = [];
		for (let benchmark of benchmarks) {
			try {
				const result = await benchmark.run();
				results.push(result);
				console.log(`The "${benchmark.benchmark}" benchmark has been run for ${benchmark.language}.`);
			} catch (err) {
				console.log(`The "${benchmark.benchmark}" benchmark couldn\'t run for ${benchmark.language}. Are you sure you have "${benchmark.runCmd}" installed?`);
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

const main = async () => {
	// It takes WAY too long to run any Python benchmarks
	const languagesToSkip = ['Python'];
	const benchmarksToRun = benchmarkList.filter(benchmark => !languagesToSkip.includes(benchmark.language));
	const runner = new LanguageBenchmarks(benchmarksToRun);
	await runner.start();
	process.exit();
}

main();
