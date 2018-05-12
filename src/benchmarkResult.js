class BenchmarkResult {
	constructor(memoryMax, memoryAvg, elapsedSeconds, language, benchmark) {
		this.memoryMax = memoryMax;
		this.memoryAvg = memoryAvg;
		this.elapsedSeconds = elapsedSeconds;
		this.language = language || '';
		this.benchmark = benchmark || '';
	}
}

module.exports = BenchmarkResult;