const Benchmark = require('./benchmark');

const benchmarkConfigs = [
	/* {
		language: 'NodeJS',
		benchmark: 'N-Body',
		compileCmd: null,
		compileArgs: null,
		runCmd: 'node',
		runArgs: ['./src/nodejs/nbody.js'],
	},
	{
		language: 'Crystal',
		benchmark: 'N-Body',
		compileCmd: 'crystal',
		compileArgs: ['build', '--release', './src/crystal/nbody.cr', '-o', './src/crystal/nbody.out'],
		runCmd: './src/crystal/nbody.out',
		runArgs: null,
	},
	{
		language: 'C',
		benchmark: 'N-Body',
		compileCmd: 'gcc',
		compileArgs: ['-Wall', './src/c/nbody.c', '-o', './src/c/nbody.out', '-lm', '-O3'],
		runCmd: './src/c/nbody.out',
		runArgs: null,
	},
	{
		language: 'Go',
		benchmark: 'N-Body',
		compileCmd: 'go',
		compileArgs: ['build', './src/go/nbody.out.go'],
		runCmd: './nbody.out',
		runArgs: null,
	},
	{
		language: 'C#',
		benchmark: 'N-Body',
		compileCmd: 'dotnet',
		compileArgs: ['build', './src/csharp/nbody', '-c', 'release'],
		runCmd: 'dotnet',
		runArgs: ['./src/csharp/nbody/bin/release/netcoreapp2.0/nbody.dll'],
	}, */
	{
		language: 'NodeJS',
		benchmark: 'Prime Sum',
		compileCmd: null,
		compileArgs: null,
		runCmd: 'node',
		runArgs: ['./src/nodejs/primesum.js'],
	},
	{
		language: 'Crystal',
		benchmark: 'Prime Sum',
		compileCmd: 'crystal',
		compileArgs: ['build', '--release', './src/crystal/primesum.cr', '-o', './src/crystal/primesum.out'],
		runCmd: './src/crystal/primesum.out',
		runArgs: null,
	},
	{
		language: 'C',
		benchmark: 'Prime Sum',
		compileCmd: 'gcc',
		compileArgs: ['-Wall', './src/c/primesum.c', '-o', './src/c/primesum.out', '-lm', '-O3'],
		runCmd: './src/c/primesum.out',
		runArgs: null,
	},
	{
		language: 'Go',
		benchmark: 'Prime Sum',
		compileCmd: 'go',
		compileArgs: ['build', './src/go/primesum.out.go'],
		runCmd: './primesum.out',
		runArgs: null,
	},
	{
		language: 'C#',
		benchmark: 'Prime Sum',
		compileCmd: 'dotnet',
		compileArgs: ['build', './src/csharp/primesum', '-c', 'release'],
		runCmd: 'dotnet',
		runArgs: ['./src/csharp/primesum/bin/release/netcoreapp2.0/primesum.dll'],
	},
]

const benchmarkList = benchmarkConfigs.map(config => new Benchmark(config));

module.exports = benchmarkList;