const os = require('os');
const R = require('ramda');
const BenchmarkResult = require('./benchmarkResult');

class ResultLogger {
	constructor() {
		this._logWidth = 75;
		this._headerChar = '-';
		this._borderChar = '|';
	}

	logResults(results, samples) {
		console.log('');
		this._printHeader('platform details');
		this._printInfoLine('');
		this._printInfoLine(` OS:           ${os.type()} ${os.release()}`);
		this._printInfoLine(` CPU:          ${os.cpus()[0].model}`);
		this._printInfoLine(` CPU Cores:    ${os.cpus().length} Logical`);
		this._printInfoLine(` Memory:       ${(os.totalmem() / Math.pow(1024, 3)).toFixed(2)} GB`);
		this._printInfoLine('');
		this._printHeader('result details');
		this._printInfoLine('');
		this._printInfoLine(` Samples:      ${samples} / Benchmark`);
		this._printInfoLine(` Group Method: Arithmetic Mean`);
		this._printInfoLine('');
		const benchmarkGroups = R.groupWith((x, y) => x.benchmark === y.benchmark, results);
		const avgBenchmarks = R.map((group) => {
			const languageGroups = R.groupWith((x, y) => x.language === y.language, group);
			const avgGroups = R.map((x) => {
				const avgMemMax = x.map(b => b.memoryMax).reduce((p, c) => p + c) / x.length;
				const avgMemAvg = x.map(b => b.memoryAvg).reduce((p, c) => p + c) / x.length;
				const avgTime = x.map(b => b.elapsedSeconds).reduce((p, c) => p + c) / x.length;
				return new BenchmarkResult(
					avgMemMax,
					avgMemAvg,
					avgTime,
					x[0].language,
					x[0].benchmark
				)
			}, languageGroups)
			return avgGroups;
		}, benchmarkGroups);

		avgBenchmarks.forEach(resultSet => this._printResultSet(resultSet));
		this._printHeader('');
	}

	_printResultSet(resultSet) {
		this._printHeader(`${resultSet[0].benchmark}`)
		this._printInfoLine(``)

		const fixedResults = resultSet.map((result) => {
			return {
				memoryMax: result.memoryMax.toFixed(3),
				memoryAvg: result.memoryAvg.toFixed(3),
				elapsedSeconds: result.elapsedSeconds.toFixed(3),
				language: result.language,
				benchmark: result.benchmark,
			}
		});

		let memMaxHead = 'Mem Max (mB)';
		let memAvgHead = 'Mem Avg (mB)';
		let timeHead = 'Time (s)';
		let langHead = 'Language';
		let maxMaxLen = memMaxHead.length;
		let maxAvgLen = memAvgHead.length;
		let maxTimeLen = timeHead.length;
		let maxLangLen = langHead.length;
	
		for (let result of fixedResults) {
			if (result.memoryMax.length > maxMaxLen) {
				maxMaxLen = result.memoryMax.length;
			}

			if (result.memoryAvg.length > maxAvgLen) {
				maxAvgLen = result.memoryAvg.length;
			}

			if (result.elapsedSeconds.length > maxTimeLen) {
				maxTimeLen = result.elapsedSeconds.length;
			}

			if (result.language.length > maxLangLen) {
				maxLangLen = result.language.length;
			}
		}

		this._printInfoLine(` ${langHead}     ${timeHead}     ${memMaxHead}     ${memAvgHead}`);
		fixedResults.forEach((result) => {
			this._printInfoLine(' '
				+ this._padRight(result.language, maxLangLen)
				+ `     ${this._padLeft(result.elapsedSeconds, maxTimeLen)}`
				+ `     ${this._padLeft(result.memoryMax, maxMaxLen)}`
				+ `     ${this._padLeft(result.memoryAvg, maxAvgLen)}`
			);
		});
		this._printInfoLine(``)
	}

	_printHeader(message) {
		const paddedMessage = message.length === 0 ? '' : ` ${message} `.toUpperCase();
		const remainingLength = this._logWidth - paddedMessage.length;
		console.log(
			this._headerChar.repeat(Math.floor(remainingLength / 2)) 
			+ paddedMessage
			+ this._headerChar.repeat(Math.ceil(remainingLength / 2))
		);
	}

	_printInfoLine(message) {
		const remainingLength = this._logWidth - message.length - 4;
		const spacedMessage = message + ' '.repeat(remainingLength);
		console.log(`${this._borderChar} ${spacedMessage} ${this._borderChar}`);
	}

	_padLeft(message, length) {
		const padChars = length - message.length;
		return ' '.repeat(padChars) + message;
	}

	_padRight(message, length) {
		const padChars = length - message.length;
		return message + ' '.repeat(padChars);
	}
}

module.exports = ResultLogger;