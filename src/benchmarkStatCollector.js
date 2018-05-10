const { performance } = require('perf_hooks');
const pidusage = require('pidusage');
const BenchmarkResult = require('./benchmarkResult');

class BenchmarkStatCollector {
	constructor(pid) {
		this.pid = pid;
		this._active = false;
		this._endTime = 0;
		this._measurements = [];
		this._memoryAvg = 0;
		this._memoryMax = 0;
		this._startTime = 0;
		this._statCollector = null;
	}

	start() {
		this._active = true;
		this._startTimer();
		this._startStatCollector();
	}

	stop() {
		this._active = false;
		this._stopTimer();
		this._stopStatCollector();
		
		if (this._measurements && this._measurements.length > 0) {
			this._memoryAvg = this._measurements.reduce((p, c) => p + c) / this._measurements.length;
		}
	}

	result() {
		if (this._active) {
			this._stop()
		}

		return new BenchmarkResult(this._memoryMax, this._memoryAvg, this._elapsedSeconds())
	}

	_elapsedSeconds() {
		const msElapsed = this._endTime - this._startTime;
		return (msElapsed / 1000).toFixed(3);
	}

	_startTimer() {
		this._startTime = performance.now();
	}

	_stopTimer() {
		this._endTime = performance.now();
	}

	_startStatCollector(pid) {
		this.statCollector = setInterval(async () => {
			const stats = await pidusage(this.pid);
			const statMemoryMegabytes = stats.memory / 1000000;
			if (statMemoryMegabytes > this._memoryMax) {
				this._memoryMax = statMemoryMegabytes;
			}
			this._measurements.push(statMemoryMegabytes);
		}, 200);
	}

	_stopStatCollector() {
		clearInterval(this.statCollector);
	}
}

module.exports = BenchmarkStatCollector;