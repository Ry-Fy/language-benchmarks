const PI: f64 = 3.141592653589793;
const SOLAR_MASS: f64 = 4.0 * PI * PI;
const DAYS_PER_YEAR: f64 = 365.24;

struct Body {
	x: f64,
	y: f64,
	z: f64,
	vx: f64,
	vy: f64,
	vz: f64,
	mass: f64,
}

struct SolarSystem {
	bodies: Vec<Body>
}

impl SolarSystem {
	fn new() -> Self {
		let mut system_bodies = vec![
			Body {
				x: 0.0, y: 0.0, z: 0.0, vx: 0.0, vy: 0.0, vz: 0.0, mass: SOLAR_MASS,
			},
			// Jupiter
			Body {
				x: 4.84143144246472090e+00,
				y: -1.16032004402742839e+00,
				z: -1.03622044471123109e-01,
				vx: 1.66007664274403694e-03 * DAYS_PER_YEAR,
				vy: 7.69901118419740425e-03 * DAYS_PER_YEAR,
				vz: -6.90460016972063023e-05 * DAYS_PER_YEAR,
				mass: 9.54791938424326609e-04 * SOLAR_MASS,
			},
			// Saturn
			Body {
				x: 8.34336671824457987e+00,
				y: 4.12479856412430479e+00,
				z: -4.03523417114321381e-01,
				vx: -2.76742510726862411e-03 * DAYS_PER_YEAR,
				vy: 4.99852801234917238e-03 * DAYS_PER_YEAR,
				vz: 2.30417297573763929e-05 * DAYS_PER_YEAR,
				mass: 2.85885980666130812e-04 * SOLAR_MASS,
			},
			// Uranus
			Body {
				x: 1.28943695621391310e+01,
				y: -1.51111514016986312e+01,
				z: -2.23307578892655734e-01,
				vx: 2.96460137564761618e-03 * DAYS_PER_YEAR,
				vy: 2.37847173959480950e-03 * DAYS_PER_YEAR,
				vz: -2.96589568540237556e-05 * DAYS_PER_YEAR,
				mass: 4.36624404335156298e-05 * SOLAR_MASS,
			},
			// Neptune
			Body {
				x: 1.53796971148509165e+01,
				y: -2.59193146099879641e+01,
				z: 1.79258772950371181e-01,
				vx: 2.68067772490389322e-03 * DAYS_PER_YEAR,
				vy: 1.62824170038242295e-03 * DAYS_PER_YEAR,
				vz: -9.51592254519715870e-05 * DAYS_PER_YEAR,
				mass: 5.15138902046611451e-05 * SOLAR_MASS,
			},
		];

		let mut px = 0.0f64;
		let mut py = 0.0f64;
		let mut pz = 0.0f64;

		for body in system_bodies.iter() {
			px += body.vx * body.mass;
			py += body.vy * body.mass;
			pz += body.vz * body.mass;
		}

		{
			let sol = &mut system_bodies[0];
			sol.vx = -px / SOLAR_MASS;
			sol.vy = -py / SOLAR_MASS;
			sol.vz = -pz / SOLAR_MASS;
		}

		SolarSystem {
			bodies: system_bodies
		}
	}

	fn advance(&mut self, dt: f64) {
		let mut dx: f64;
		let mut dy: f64;
		let mut dz: f64;
		let mut dist: f64;
		let mut mag: f64;
		let mut bim: f64;
		let mut bjm: f64;
		let body_len = self.bodies.len();
		
		for i in 0..body_len {
			for j in (i + 1)..body_len {
				dx = self.bodies[i].x - self.bodies[j].x;
				dy = self.bodies[i].y - self.bodies[j].y;
				dz = self.bodies[i].z - self.bodies[j].z;

				dist = (dx * dx + dy * dy + dz * dz).sqrt();
				mag = dt / (dist * dist * dist);

				bim = self.bodies[i].mass * mag;
				bjm = self.bodies[j].mass * mag;

				self.bodies[i].vx -= dx * bjm;
				self.bodies[i].vy -= dy * bjm;
				self.bodies[i].vz -= dz * bjm;

				self.bodies[j].vx += dx * bim;
				self.bodies[j].vy += dy * bim;
				self.bodies[j].vz += dz * bim;
			}

			self.bodies[i].x = self.bodies[i].x + dt * self.bodies[i].vx;
			self.bodies[i].y = self.bodies[i].y + dt * self.bodies[i].vy;
			self.bodies[i].z = self.bodies[i].z + dt * self.bodies[i].vz;
		}
	}

	fn energy(&mut self) -> f64 {
		let mut dx: f64;
		let mut dy: f64;
		let mut dz: f64;
		let mut dist: f64;
		let mut e = 0_f64;

		for i in 0..self.bodies.len() {
			let bodyi = &self.bodies[i];
			e += 0.5 * bodyi.mass * (bodyi.vx * bodyi.vx + bodyi.vy * bodyi.vy + bodyi.vz * bodyi.vz);
			
			for j in (i + 1)..self.bodies.len() {
				let bodyj = &self.bodies[j];
				dx = bodyi.x - bodyj.x;
				dy = bodyi.y - bodyj.y;
				dz = bodyi.z - bodyj.z;

				dist = (dx * dx + dy * dy + dz * dz).sqrt();
				e -= (bodyi.mass * bodyj.mass) / dist;
			}
		}

		return e;
	}
}

fn main() {
	let iterations = 50_000_000;
	let mut solar_system = SolarSystem::new();
	println!("Energy before:\t{}", solar_system.energy());

	for _ in 0..iterations {
		solar_system.advance(0.01);
	}

	println!("Energy before:\t{}", solar_system.energy());
}