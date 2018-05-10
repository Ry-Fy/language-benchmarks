class BenchmarkResult {
	constructor(memoryMax, memoryAvg, elapsedSeconds) {
		this.memoryMax = memoryMax;
		this.memoryAvg = memoryAvg;
		this.elapsedSeconds = elapsedSeconds;
		this.language = "";
		this.benchmark = "";
	}
}

module.exports = BenchmarkResult;