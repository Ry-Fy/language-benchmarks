import math

PI = 3.141592653589793
SOLAR_MASS = 4 * PI * PI
DAYS_PER_YEAR = 365.24

class Body:
	def __init__(self, x, y, z, vx, vy, vz, mass):
		self.x = x
		self.y = y
		self.z = z
		self.vx = vx
		self.vy = vy
		self.vz = vz
		self.mass = mass

class SolarSystem:
	def __init__(self):
		self.bodies = [
			# Sol
			Body(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, SOLAR_MASS),
			# Jupiter
			Body(
				4.84143144246472090e+00,
				-1.16032004402742839e+00,
				-1.03622044471123109e-01,
				1.66007664274403694e-03 * DAYS_PER_YEAR,
				7.69901118419740425e-03 * DAYS_PER_YEAR,
				-6.90460016972063023e-05 * DAYS_PER_YEAR,
				9.54791938424326609e-04 * SOLAR_MASS
			),
			# Saturn
			Body(
				8.34336671824457987e+00,
				4.12479856412430479e+00,
				-4.03523417114321381e-01,
				-2.76742510726862411e-03 * DAYS_PER_YEAR,
				4.99852801234917238e-03 * DAYS_PER_YEAR,
				2.30417297573763929e-05 * DAYS_PER_YEAR,
				2.85885980666130812e-04 * SOLAR_MASS
			),
			# Uranus
			Body(
				1.28943695621391310e+01,
				-1.51111514016986312e+01,
				-2.23307578892655734e-01,
				2.96460137564761618e-03 * DAYS_PER_YEAR,
				2.37847173959480950e-03 * DAYS_PER_YEAR,
				-2.96589568540237556e-05 * DAYS_PER_YEAR,
				4.36624404335156298e-05 * SOLAR_MASS
			),
			# Neptune
			Body(
				1.53796971148509165e+01,
				-2.59193146099879641e+01,
				1.79258772950371181e-01,
				2.68067772490389322e-03 * DAYS_PER_YEAR,
				1.62824170038242295e-03 * DAYS_PER_YEAR,
				-9.51592254519715870e-05 * DAYS_PER_YEAR,
				5.15138902046611451e-05 * SOLAR_MASS
			),
		]

		px = 0.0
		py = 0.0
		pz = 0.0

		for body in self.bodies:
			px += body.vx * body.mass
			py += body.vy * body.mass
			pz += body.vz * body.mass

		sol = self.bodies[0]
		sol.vx = -px / SOLAR_MASS
		sol.vy = -py / SOLAR_MASS
		sol.vz = -pz / SOLAR_MASS
	
	def advance(self, dt):
		dx = 0.0
		dy = 0.0
		dz = 0.0
		dist = 0.0
		mag = 0.0
		bim = 0.0
		bjm = 0.0

		for i, bodyi in enumerate(self.bodies):
			for j in range(i + 1, len(self.bodies)):
				bodyj = self.bodies[j]
				dx = bodyi.x - bodyj.x
				dy = bodyi.y - bodyj.y
				dz = bodyi.z - bodyj.z

				dist = math.sqrt(dx * dx + dy * dy + dz * dz)
				mag = dt / (dist * dist * dist)

				bim = bodyi.mass * mag
				bjm = bodyj.mass * mag

				bodyi.vx -= dx * bjm
				bodyi.vy -= dy * bjm
				bodyi.vz -= dz * bjm

				bodyj.vx += dx * bim
				bodyj.vy += dy * bim
				bodyj.vz += dz * bim

			bodyi.x = bodyi.x + dt * bodyi.vx
			bodyi.y = bodyi.y + dt * bodyi.vy
			bodyi.z = bodyi.z + dt * bodyi.vz

	def energy(self):
		dx = 0.0
		dy = 0.0
		dz = 0.0
		e = 0.0

		for i, bodyi in enumerate(self.bodies):
			e += 0.5 * bodyi.mass * (bodyi.vx * bodyi.vx + bodyi.vy * bodyi.vy + bodyi.vz * bodyi.vz)
			
			for j in range(i + 1, len(self.bodies)):
				bodyj = self.bodies[j]
				dx = bodyi.x - bodyj.x
				dy = bodyi.y - bodyj.y
				dz = bodyi.z - bodyj.z

				dist = math.sqrt(dx * dx + dy * dy + dz * dz)
				e -= (bodyi.mass * bodyj.mass) / dist

		return e

def main():
	iterations = 50_000_000
	solarSystem = SolarSystem()
	print(f"Energy before:\t{round(solarSystem.energy(), 9)}")

	for i in range(0, iterations):
		solarSystem.advance(0.01)

	print(f"Energy after:\t{round(solarSystem.energy(), 9)}")


main()