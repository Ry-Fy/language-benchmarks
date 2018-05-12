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
		logger.logResults(results);
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

const testResults = [{"memoryMax":33.390592,"memoryAvg":33.39059199999998,"elapsedSeconds":7.476317195000127,"language":"NodeJS","benchmark":"N-Body"},{"memoryMax":33.439744,"memoryAvg":33.43974400000001,"elapsedSeconds":7.424253580998629,"language":"NodeJS","benchmark":"N-Body"},{"memoryMax":33.3824,"memoryAvg":33.38239999999998,"elapsedSeconds":7.394944720000028,"language":"NodeJS","benchmark":"N-Body"},{"memoryMax":2.56,"memoryAvg":2.560000000000001,"elapsedSeconds":7.4817123009990905,"language":"Crystal","benchmark":"N-Body"},{"memoryMax":2.695168,"memoryAvg":2.695167999999999,"elapsedSeconds":7.483747850000858,"language":"Crystal","benchmark":"N-Body"},{"memoryMax":2.646016,"memoryAvg":2.6460160000000017,"elapsedSeconds":7.631813831999898,"language":"Crystal","benchmark":"N-Body"},{"memoryMax":1.06496,"memoryAvg":1.0649599999999995,"elapsedSeconds":6.474707570001483,"language":"C","benchmark":"N-Body"},{"memoryMax":1.216512,"memoryAvg":1.216512000000001,"elapsedSeconds":6.310174528999254,"language":"C","benchmark":"N-Body"},{"memoryMax":1.18784,"memoryAvg":1.1878400000000007,"elapsedSeconds":6.311625156998634,"language":"C","benchmark":"N-Body"},{"memoryMax":0.843776,"memoryAvg":0.8437759999999992,"elapsedSeconds":7.078219632999971,"language":"Go","benchmark":"N-Body"},{"memoryMax":1.466368,"memoryAvg":1.4663680000000008,"elapsedSeconds":7.221582660000771,"language":"Go","benchmark":"N-Body"},{"memoryMax":0.843776,"memoryAvg":0.8437759999999992,"elapsedSeconds":7.154705684000626,"language":"Go","benchmark":"N-Body"},{"memoryMax":30.02368,"memoryAvg":30.02368000000001,"elapsedSeconds":6.99262596699968,"language":"C#","benchmark":"N-Body"},{"memoryMax":30.416896,"memoryAvg":30.41689599999998,"elapsedSeconds":6.990153596000746,"language":"C#","benchmark":"N-Body"},{"memoryMax":30.216192,"memoryAvg":30.216191999999985,"elapsedSeconds":7.07057504799962,"language":"C#","benchmark":"N-Body"},{"memoryMax":35.479552,"memoryAvg":35.47846776470587,"elapsedSeconds":6.928489242000506,"language":"Java","benchmark":"N-Body"},{"memoryMax":34.869248,"memoryAvg":34.86924799999998,"elapsedSeconds":6.909435975000262,"language":"Java","benchmark":"N-Body"},{"memoryMax":34.57024,"memoryAvg":34.535544470588256,"elapsedSeconds":6.926373089000583,"language":"Java","benchmark":"N-Body"},{"memoryMax":34.287616,"memoryAvg":34.23721437288138,"elapsedSeconds":12.05077161899954,"language":"NodeJS","benchmark":"Prime Sum"},{"memoryMax":34.009088,"memoryAvg":33.96785030508476,"elapsedSeconds":12.04476340300031,"language":"NodeJS","benchmark":"Prime Sum"},{"memoryMax":34.304,"memoryAvg":34.25359837288139,"elapsedSeconds":12.047398523001,"language":"NodeJS","benchmark":"Prime Sum"},{"memoryMax":2.236416,"memoryAvg":2.236416000000001,"elapsedSeconds":8.342651026999578,"language":"Crystal","benchmark":"Prime Sum"},{"memoryMax":2.236416,"memoryAvg":2.236416000000001,"elapsedSeconds":8.365580071000382,"language":"Crystal","benchmark":"Prime Sum"},{"memoryMax":2.224128,"memoryAvg":2.224127999999998,"elapsedSeconds":8.359925034999847,"language":"Crystal","benchmark":"Prime Sum"},{"memoryMax":0.720896,"memoryAvg":0.7208959999999999,"elapsedSeconds":7.190075596999377,"language":"C","benchmark":"Prime Sum"},{"memoryMax":0.729088,"memoryAvg":0.7290880000000005,"elapsedSeconds":7.196008362999186,"language":"C","benchmark":"Prime Sum"},{"memoryMax":0.724992,"memoryAvg":0.7249920000000002,"elapsedSeconds":7.1914517439994965,"language":"C","benchmark":"Prime Sum"},{"memoryMax":0.83968,"memoryAvg":0.8396800000000005,"elapsedSeconds":8.930173713998869,"language":"Go","benchmark":"Prime Sum"},{"memoryMax":0.83968,"memoryAvg":0.8396800000000005,"elapsedSeconds":8.945421753000469,"language":"Go","benchmark":"Prime Sum"},{"memoryMax":0.843776,"memoryAvg":0.8437759999999991,"elapsedSeconds":8.936285083999858,"language":"Go","benchmark":"Prime Sum"},{"memoryMax":27.148288,"memoryAvg":27.148287999999987,"elapsedSeconds":7.36627661300078,"language":"C#","benchmark":"Prime Sum"},{"memoryMax":27.086848,"memoryAvg":27.08684800000001,"elapsedSeconds":7.363891219999641,"language":"C#","benchmark":"Prime Sum"},{"memoryMax":27.2384,"memoryAvg":27.238399999999984,"elapsedSeconds":7.453762514000759,"language":"C#","benchmark":"Prime Sum"},{"memoryMax":32.407552,"memoryAvg":32.407551999999974,"elapsedSeconds":8.990235982999206,"language":"Java","benchmark":"Prime Sum"},{"memoryMax":31.367168,"memoryAvg":31.367167999999996,"elapsedSeconds":8.984048738000915,"language":"Java","benchmark":"Prime Sum"},{"memoryMax":32.37888,"memoryAvg":32.37887999999999,"elapsedSeconds":8.929506880998611,"language":"Java","benchmark":"Prime Sum"}];

async function idk() {
	const { stdout, stderr } = await exec('gcc --version');
	console.log(stdout);
}

async function main() {
	const config = {
		samples: 3,
		// It takes WAY too long to run Python benchmarks...You kidding me!? 800+ seconds for primes!?
		langsToSkip: ['Python']
	}
	
	config.langsToSkip.forEach(language => console.log(`Skipping ${language} for this run.`))

	//const runner = new LanguageBenchmarks(benchmarkList.filter(b => !config.langsToSkip.includes(b.language)), config.samples);
	//await runner.start();
	const logger = new ResultLogger();
	logger.logResults(testResults, config.samples)
	await idk();
	process.exit();
}

main();
