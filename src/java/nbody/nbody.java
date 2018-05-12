final class Body {
	public double x, y, z, vx, vy, vz, mass;
	public Body(double x, double y, double z, double vx, double vy, double vz, double mass) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.vx = vx;
		this.vy = vy;
		this.vz = vz;
		this.mass = mass;
	}
}

final class SolarSystem {
	final double PI = 3.141592653589793;
	final double SOLAR_MASS = 4 * PI * PI;
	final double DAYS_PER_YEAR = 365.24;
	private Body[] bodies;

	public SolarSystem() {
		bodies = new Body[] {
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
		};

		double px = 0.0;
		double py = 0.0;
		double pz = 0.0;

		for (Body body : bodies) {
			px += body.vx * body.mass;
			py += body.vy * body.mass;
			pz += body.vz * body.mass;
		}

		Body sol = bodies[0];
		sol.vx = -px / SOLAR_MASS;
		sol.vy = -py / SOLAR_MASS;
		sol.vz = -pz / SOLAR_MASS;
	}

	public void Advance(double dt) {
		double dx, dy, dz, dist, mag, bim, bjm;

		for (int i = 0; i < bodies.length; i++) {
			Body bodyi = bodies[i];
			
			for (int j = i + 1; j < bodies.length; j++) {
				Body bodyj = bodies[j];
				
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

	public double Energy() {
		double dx, dy, dz, dist;
		double e = 0.0;

		for (int i = 0; i < bodies.length; i++) {
			Body bodyi = bodies[i];
			e += 0.5 * bodyi.mass * (bodyi.vx * bodyi.vx + bodyi.vy * bodyi.vy + bodyi.vz * bodyi.vz);

			for (int j = i + 1; j < bodies.length; j++) {
				Body bodyj = bodies[j];

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

final class NBody {
	public static void main(String[] args) {
		int iterations = 50000000;
		SolarSystem solarSystem = new SolarSystem();

		System.out.format("Energy before:\t%.9f\n", solarSystem.Energy());

		for (int i = 0; i < iterations; i++) {
			solarSystem.Advance(0.01);
		}

		System.out.format("Energy after:\t%.9f\n", solarSystem.Energy());
	}
}
