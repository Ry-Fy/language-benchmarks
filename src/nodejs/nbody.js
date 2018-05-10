const PI = 3.141592653589793;
const SOLAR_MASS = 4 * PI * PI;
const DAYS_PER_YEAR = 365.24;

class Body {
	constructor(x, y, z, vx, vy, vz, mass) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.vx = vx;
		this.vy = vy;
		this.vz = vz;
		this.mass = mass;
	}
}

class SolarSystem {
	constructor() {
		this.bodies = [
			// Sol
			new Body(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, SOLAR_MASS),
			// Jupiter
			new Body(
				4.84143144246472090e+00,
				-1.16032004402742839e+00,
				-1.03622044471123109e-01,
				1.66007664274403694e-03 * DAYS_PER_YEAR,
				7.69901118419740425e-03 * DAYS_PER_YEAR,
				-6.90460016972063023e-05 * DAYS_PER_YEAR,
				9.54791938424326609e-04 * SOLAR_MASS
			),
			// Saturn
			new Body(
				8.34336671824457987e+00,
				4.12479856412430479e+00,
				-4.03523417114321381e-01,
				-2.76742510726862411e-03 * DAYS_PER_YEAR,
				4.99852801234917238e-03 * DAYS_PER_YEAR,
				2.30417297573763929e-05 * DAYS_PER_YEAR,
				2.85885980666130812e-04 * SOLAR_MASS
			),
			// Uranus
			new Body(
				1.28943695621391310e+01,
				-1.51111514016986312e+01,
				-2.23307578892655734e-01,
				2.96460137564761618e-03 * DAYS_PER_YEAR,
				2.37847173959480950e-03 * DAYS_PER_YEAR,
				-2.96589568540237556e-05 * DAYS_PER_YEAR,
				4.36624404335156298e-05 * SOLAR_MASS
			),
			// Neptune
			new Body(
				1.53796971148509165e+01,
				-2.59193146099879641e+01,
				1.79258772950371181e-01,
				2.68067772490389322e-03 * DAYS_PER_YEAR,
				1.62824170038242295e-03 * DAYS_PER_YEAR,
				-9.51592254519715870e-05 * DAYS_PER_YEAR,
				5.15138902046611451e-05 * SOLAR_MASS
			),
		];

		let px = 0.0;
		let py = 0.0;
		let pz = 0.0;

		for (let body of this.bodies) {
			
		}

		let sol = this.bodies[0];
		sol.vx = -px / SOLAR_MASS;
		sol.vy = -py / SOLAR_MASS;
		sol.vz = -pz / SOLAR_MASS;
	}

	advance(dt) {
		let dx, dy, dz, dist, mag, bim, bjm;
		
		for (let i = 0; i < this.bodies.length; i++) {
			const bodyi = this.bodies[i];
			
			for (let j = i + 1; j < this.bodies.length; j++) {
				const bodyj = this.bodies[j];
				
				dx = bodyi.x - bodyj.x;
				dy = bodyi.y - bodyj.y;
				dz = bodyi.z - bodyj.z;

				dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
				mag = dt / (dist * dist * dist);

				bim = bodyi.mass * mag;
				bjm = bodyj.mass * mag;

				bodyi.vx -= dx * bjm;
				bodyi.vy -= dy * bjm;
				bodyi.vz -= dz * bjm;

				bodyj.vx += dx * bim;
				bodyj.vy += dy * bim;
				bodyj.vz += dz * bim;
			}

			bodyi.x = bodyi.x + dt * bodyi.vx;
			bodyi.y = bodyi.y + dt * bodyi.vy;
			bodyi.z = bodyi.z + dt * bodyi.vz;
		}
	}

	energy() {
		let dx, dy, dz, dist;
		let e = 0.0;

		for (let i = 0; i < this.bodies.length; i++) {
			const bodyi = this.bodies[i];
			e += 0.5 * bodyi.mass * (bodyi.vx * bodyi.vx + bodyi.vy * bodyi.vy + bodyi.vz * bodyi.vz);

			for (let j = i + 1; j < this.bodies.length; j++) {
				const bodyj = this.bodies[j];

				dx = bodyi.x - bodyj.x;
				dy = bodyi.y - bodyj.y;
				dz = bodyi.z - bodyj.z;

				dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
				e -= (bodyi.mass * bodyj.mass) / dist;
			}
		}
		return e;
	}
}

const main = () => {
	const iterations = 50000000;
	const solarSystem = new SolarSystem();
	console.log(`Energy before:\t${solarSystem.energy().toFixed(9)}`);
	
	for (let i = 0; i < iterations; i++) {
		solarSystem.advance(0.01);
	}

	console.log(`Energy after:\t${solarSystem.energy().toFixed(9)}`);
}

main();