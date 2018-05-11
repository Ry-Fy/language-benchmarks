const { spawn } = require('child_process');
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
		}
	});
}

const main = async () => {
	const runsPer = 1;
	const results = [];
	
	for (let benchmark of benchmarkList) {
		await compile(benchmark);
	}

	for (let benchmark of benchmarkList) {
		for (let i = 0; i < runsPer; i++) {
			const result = await benchmark.run();
			results.push(result);
			console.log(JSON.stringify(result));
		}
	}
}

try {
	main();
} catch (err) {
	console.log(err);
}