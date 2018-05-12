const { spawn } = require('child_process');
const BenchmarkStatCollector = require('./benchmarkStatCollector');

class Benchmark {
	constructor(config) {
		this.language = config.language;
		this.benchmark = config.benchmark;
		this.compileCmd = config.compileCmd;
		this.compileArgs = config.compileArgs;
		this.runCmd = config.runCmd;
		this.runArgs = config.runArgs;
		this.statTimer = null;
	}

	async run() {
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

			process.on('error', err => reject(err));
		});
	}
}

module.exports = Benchmark;