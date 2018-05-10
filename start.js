const { spawn } = require('child_process');
const { performance } = require('perf_hooks');
const pidusage = require('pidusage');

class Benchmark {
	constructor(language, benchmark, compileCmd, compileArgs, runCmd, runArgs) {
		this.language = language;
		this.benchmark = benchmark;
		this.compileCmd = compileCmd;
		this.compileArgs = compileArgs;
		this.runCmd = runCmd;
		this.runArgs = runArgs;

		this.memoryMax = 0;
		this.memoryAvg = 0;
		this.memoryMeasurements = [];
		this.startTime = 0;
		this.endTime = 0;
		this.elapsedTime = 0;
		this.result = "Not Run";
		this.statTimer = null;
	}

	compile() {
		return new Promise((resolve, reject) => {
			if (!this.compileCmd || !this.compileArgs) {
				resolve();
			} else {
				const compileProcess = spawn(this.compileCmd, this.compileArgs);
				benchmarkProcess.on('exit', (code) => {
					resolve();
				});
			}
		});
	}

	async run() {
		await this.compile();
		return new Promise((resolve, reject) => {
			console.log(`Beginning "${this.benchmark}" benchmark for ${this.language}...`);
			this.startTime = performance.now();
			const benchmarkProcess = spawn(this.runCmd, this.runArgs);
			this.startStatTimer(benchmarkProcess.pid, 200);
	
			benchmarkProcess.on('exit', (code) => {
				this.endTime = performance.now();
				this.stopStatTimer();
				this.elapsedTime = (this.endTime - this.startTime) / 1000;
				this.result = code === 0 ? 'Success' : 'Failure';
				this.memoryMax = this.memoryMax;
				this.memoryAvg = this.memoryMeasurements.reduce((p, c) => p + c) / this.memoryMeasurements.length;
				console.log(`Completed "${this.benchmark}" benchmark for ${this.language}...`);
				resolve();
			});
		});
	}

	startStatTimer(pid, resolution) {
		this.statTimer = setInterval(async  () => {
			const stats = await pidusage(pid);
			const statMemoryInKb = stats.memory / 1000;
			if (statMemoryInKb > this.memoryMax) {
				this.memoryMax = statMemoryInKb;
			}
			this.memoryMeasurements.push(statMemoryInKb);
		}, resolution);
	}

	stopStatTimer() {
		clearInterval(this.statTimer);
	}

	report() {
		const resultsHeader = `===== Results === ${this.language} === ${this.benchmark} =====`;
		console.log(resultsHeader);
		console.log(`Result       : ${this.result}`);
		console.log(`Elapsed Time : ${this.elapsedTime.toFixed(2)} sec`);
		console.log(`Memory (avg) : ${(this.memoryAvg).toFixed(2)} kB`);
		console.log(`Memory (max) : ${(this.memoryMax).toFixed(2)} kB`);
		console.log('='.repeat(resultsHeader.length));
	}
}

const benchmarks = [
	new Benchmark('NodeJS', 'nbody', null, null, 'node', ['./benchmarks/nbody/nodejs/nbody.js']),
]

const runBenchmarks = async () => {
	for (let benchmark of benchmarks) {
		await benchmark.run();
		benchmark.report();
	}
}

runBenchmarks();