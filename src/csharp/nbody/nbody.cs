using System;

namespace nbody {
	class Body {
		public double x, y, z, vx, vy, vz, mass;
	}

	class SolarSystem {
		const double PI = 3.141592653589793;
		const double SOLAR_MASS = 4 * PI * PI;
		const double DAYS_PER_YEAR = 365.24;
		private Body[] bodies;
		
		public SolarSystem() {
			bodies = new Body[] {
				 // Sun
				new Body() {
					x = 0.0, y = 0, z = 0.0, vx = 0.0, vy = 0.0, vz =0.0, mass = SOLAR_MASS,
				},
				// Jupiter
				new Body() {
					x = 4.84143144246472090e+00,
					y = -1.16032004402742839e+00,
					z = -1.03622044471123109e-01,
					vx = 1.66007664274403694e-03 * DAYS_PER_YEAR,
					vy = 7.69901118419740425e-03 * DAYS_PER_YEAR,
					vz = -6.90460016972063023e-05 * DAYS_PER_YEAR,
					mass = 9.54791938424326609e-04 * SOLAR_MASS,
				},
				// Saturn
				new Body() {
					x = 8.34336671824457987e+00,
					y = 4.12479856412430479e+00,
					z = -4.03523417114321381e-01,
					vx = -2.76742510726862411e-03 * DAYS_PER_YEAR,
					vy = 4.99852801234917238e-03 * DAYS_PER_YEAR,
					vz = 2.30417297573763929e-05 * DAYS_PER_YEAR,
					mass = 2.85885980666130812e-04 * SOLAR_MASS,
				},
				// Uranus
				new Body {
					x = 1.28943695621391310e+01,
					y = -1.51111514016986312e+01,
					z = -2.23307578892655734e-01,
					vx = 2.96460137564761618e-03 * DAYS_PER_YEAR,
					vy = 2.37847173959480950e-03 * DAYS_PER_YEAR,
					vz = -2.96589568540237556e-05 * DAYS_PER_YEAR,
					mass = 4.36624404335156298e-05 * SOLAR_MASS,
				},
				// Neptune
				new Body {
					x = 1.53796971148509165e+01,
					y = -2.59193146099879641e+01,
					z = 1.79258772950371181e-01,
					vx = 2.68067772490389322e-03 * DAYS_PER_YEAR,
					vy = 1.62824170038242295e-03 * DAYS_PER_YEAR,
					vz = -9.51592254519715870e-05 * DAYS_PER_YEAR,
					mass = 5.15138902046611451e-05 * SOLAR_MASS,
				},
			};

			double px = 0.0;
			double py = 0.0;
			double pz = 0.0;

			foreach (Body body in bodies) {
				px += body.vx * body.mass;
				py += body.vy * body.mass;
				pz += body.vz * body.mass;
			}

			Body sol = this.bodies[0];
			sol.vx = -px / SOLAR_MASS;
			sol.vy = -py / SOLAR_MASS;
			sol.vz = -pz / SOLAR_MASS;
		}

		public void Advance(double dt) {
			double dx, dy, dz, dist, mag, bim, bjm;

			for (int i = 0; i < this.bodies.Length; i++) {
				Body bodyi = this.bodies[i];
				
				for (int j = i + 1; j < this.bodies.Length; j++) {
					Body bodyj = this.bodies[j];
					
					dx = bodyi.x - bodyj.x;
					dy = bodyi.y - bodyj.y;
					dz = bodyi.z - bodyj.z;

					dist = Math.Sqrt(dx * dx + dy * dy + dz * dz);
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

		public double Energy() {
			double dx, dy, dz, dist;
			double e = 0.0;

			for (int i = 0; i < this.bodies.Length; i++) {
				Body bodyi = this.bodies[i];
				e += 0.5 * bodyi.mass * (bodyi.vx * bodyi.vx + bodyi.vy * bodyi.vy + bodyi.vz * bodyi.vz);

				for (int j = i + 1; j < this.bodies.Length; j++) {
					Body bodyj = this.bodies[j];

					dx = bodyi.x - bodyj.x;
					dy = bodyi.y - bodyj.y;
					dz = bodyi.z - bodyj.z;

					dist = Math.Sqrt(dx * dx + dy * dy + dz * dz);
					e -= (bodyi.mass * bodyj.mass) / dist;
				}
			}

			return e;
		}
	}

	class Program {
		static void Main(string[] args) {
			const int iterations = 50000000;
			SolarSystem solarSystem = new SolarSystem();
			Console.WriteLine($"Energy before:\t{0:f9}", solarSystem.Energy());

			for (int i = 0; i < iterations; i++) {
				solarSystem.Advance(0.01);
			}

			Console.WriteLine($"Energy before:\t{0:f9}", solarSystem.Energy());
		}
	}
}
