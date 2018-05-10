const { spawn } = require('child_process');
const BenchmarkStatCollector = require('./benchmarkStatCollector');

class Benchmark {
	constructor(language, benchmark, compileCmd, compileArgs, runCmd, runArgs) {
		this.language = language;
		this.benchmark = benchmark;
		this.compileCmd = compileCmd;
		this.compileArgs = compileArgs;
		this.runCmd = runCmd;
		this.runArgs = runArgs;
		this.statTimer = null;
	}

	compile() {
		return new Promise((resolve, reject) => {
			if (!this.compileCmd && !this.compileArgs) {
				resolve();
			} else {
				const compileProcess = this.compileArgs
					? spawn(this.compileCmd, this.compileArgs)
					: spawn(this.compileCmd);

				compileProcess.on('exit', (code) => {
					resolve();
				});
			}
		});
	}

	async run() {
		await this.compile();

		return new Promise((resolve, reject) => {
			const process = this.runArgs != null
				? spawn(this.runCmd, this.runArgs)
				: spawn(this.runCmd);
			
			const statCollector = new BenchmarkStatCollector(process.pid);
			statCollector.start();
	
			process.on('exit', (code) => {
				statCollector.stop();
				const result = statCollector.result();
				result.language = this.language;
				result.benchmark = this.benchmark;
				resolve(result);
			});
		});
	}
}

module.exports = Benchmark;