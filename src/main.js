const { spawn } = require('child_process');
const os = require('os');
const Benchmark = require('./benchmark');
const benchmarkList = require('./benchmarkList');

const compile = (benchmark) => {
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

const testResults = [{"memoryMax":24.584192,"memoryAvg":24.000024380952404,"elapsedSeconds":8.811149284999818,"language":"NodeJS","benchmark":"N-Body"},{"memoryMax":1.662976,"memoryAvg":1.6629760000000002,"elapsedSeconds":7.689790242999792,"language":"Crystal","benchmark":"N-Body"},{"memoryMax":0.83968,"memoryAvg":0.8396800000000001,"elapsedSeconds":5.651342480998486,"language":"C","benchmark":"N-Body"},{"memoryMax":1.380352,"memoryAvg":1.3803520000000002,"elapsedSeconds":7.75611818599701,"language":"Go","benchmark":"N-Body"},{"memoryMax":25.62048,"memoryAvg":25.09978498245616,"elapsedSeconds":11.91114978500083,"language":"NodeJS","benchmark":"Prime Sum"},{"memoryMax":1.605632,"memoryAvg":1.605632,"elapsedSeconds":9.949877636000513,"language":"Crystal","benchmark":"Prime Sum"},{"memoryMax":0.827392,"memoryAvg":0.8273920000000001,"elapsedSeconds":8.954447901003062,"language":"C","benchmark":"Prime Sum"},{"memoryMax":1.359872,"memoryAvg":1.3598720000000004,"elapsedSeconds":11.307389226000756,"language":"Go","benchmark":"Prime Sum"}]

class BenchmarkRunner {
	constructor(benchmarks) {
		this.benchmarks = benchmarks;
		this.logWidth = 75;
		this.headerChar = '-';
		this.borderChar = '|';
	}

	async start() {
		console.log(`Beginning benchmark run. There are ${benchmarkList.length} benchmark programs to run.`)
		await this.compileBenchmarks(this.benchmarks);
		const results = await this.runBenchmarks(this.benchmarks);
		console.log(`Completed benchmark run. There are ${results.length} benchmark programs successfully run.`)
		this.printReport(results);
	}

	async compileBenchmarks(benchmarks) {
		const compilableBenchmarks = benchmarks.filter(benchmark => benchmark.compileCmd != null);
		for (let benchmark of compilableBenchmarks) {
			try {
				await compile(benchmark);
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

	printHeader(message) {
		const paddedMessage = message.length === 0 ? '' : ` ${message} `.toUpperCase();
		const remainingLength = this.logWidth - paddedMessage.length;
		console.log(
			this.headerChar.repeat(Math.floor(remainingLength / 2)) 
			+ paddedMessage
			+ this.headerChar.repeat(Math.ceil(remainingLength / 2))
		);
	}

	printInfoLine(message) {
		const remainingLength = this.logWidth - message.length - 4;
		const spacedMessage = message + ' '.repeat(remainingLength);
		console.log(`${this.borderChar} ${spacedMessage} ${this.borderChar}`);
	}

	leftPad(message, length) {
		const padChars = length - message.length;
		return ' '.repeat(padChars) + message;
	}

	rightPad(message, length) {
		const padChars = length - message.length;
		return message + ' '.repeat(padChars);
	}

	printReport(results) {
		console.log('');
		this.printHeader('platform details');
		this.printInfoLine(``)
		this.printInfoLine(`OS:          ${os.type()} ${os.release()}`);
		this.printInfoLine(`CPU:         ${os.cpus()[0].model}`);
		this.printInfoLine(`CPU Cores:   ${os.cpus().length} Logical`);
		this.printInfoLine(`Memory:      ${os.totalmem() / Math.pow(1024, 3)} GB`);
		this.printInfoLine(``)
		this.getGrouptedResults(results).forEach(resultSet => this.printResultSet(resultSet));
		this.printHeader('');
	}

	printResultSet(resultSet) {
		this.printHeader(`${resultSet[0].benchmark}`)
		this.printInfoLine(``)

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

		this.printInfoLine(`${langHead}     ${timeHead}     ${memMaxHead}     ${memAvgHead}`);
		fixedResults.forEach((result) => {
			this.printInfoLine(this.rightPad(result.language, maxLangLen)
				+ `     ${this.leftPad(result.elapsedSeconds, maxTimeLen)}`
				+ `     ${this.leftPad(result.memoryMax, maxMaxLen)}`
				+ `     ${this.leftPad(result.memoryAvg, maxAvgLen)}`
			);
		});
		this.printInfoLine(``)
	}

	getGrouptedResults(results) {
		const resultGroups = [];
	
		for (let result of results) {
			if (resultGroups.length === 0) {
				resultGroups.push([result]);
				continue;
			}
	
			const matchingGroup = resultGroups.filter(resultGroup => resultGroup[0].benchmark === result.benchmark);
				
			if (matchingGroup && matchingGroup.length > 0) {
				matchingGroup[0].push(result);
			} else {
				const newResultGroup = [result];
				resultGroups.push(newResultGroup);
			}
		}
	
		const sortedGroups = resultGroups.map(group => group.sort((a, b) => a.elapsedSeconds < b.elapsedSeconds ? -1 : 1));
		return sortedGroups;
	}
}

const main = async () => {
	const runner = new BenchmarkRunner(benchmarkList);
	await runner.start();
	process.exit();
}

main();
