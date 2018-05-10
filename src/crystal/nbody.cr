PI = 3.141592653589793
SOLAR_MASS = 4 * PI * PI
DAYS_PER_YEAR = 365.24

class Body
	property x, y, z, vx, vy, vz, mass
	def initialize(
		@x : Float64,
		@y : Float64,
		@z : Float64,
		@vx : Float64,
		@vy : Float64,
		@vz : Float64,
		@mass : Float64,
	) end
end

class SolarSystem
	@bodies : Array(Body)
	def initialize()
		@bodies = [
			# Sol
			Body.new(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, SOLAR_MASS),
			# Jupiter
			Body.new(
				x: 4.84143144246472090e+00,
				y: -1.16032004402742839e+00,
				z: -1.03622044471123109e-01,
				vx: 1.66007664274403694e-03 * DAYS_PER_YEAR,
				vy: 7.69901118419740425e-03 * DAYS_PER_YEAR,
				vz: -6.90460016972063023e-05 * DAYS_PER_YEAR,
				mass: 9.54791938424326609e-04 * SOLAR_MASS
			),
			# Saturn
			Body.new(
				x: 8.34336671824457987e+00,
				y: 4.12479856412430479e+00,
				z: -4.03523417114321381e-01,
				vx: -2.76742510726862411e-03 * DAYS_PER_YEAR,
				vy: 4.99852801234917238e-03 * DAYS_PER_YEAR,
				vz: 2.30417297573763929e-05 * DAYS_PER_YEAR,
				mass: 2.85885980666130812e-04 * SOLAR_MASS
			),
			# Uranus
			Body.new(
				x: 1.28943695621391310e+01,
				y: -1.51111514016986312e+01,
				z: -2.23307578892655734e-01,
				vx: 2.96460137564761618e-03 * DAYS_PER_YEAR,
				vy: 2.37847173959480950e-03 * DAYS_PER_YEAR,
				vz: -2.96589568540237556e-05 * DAYS_PER_YEAR,
				mass: 4.36624404335156298e-05 * SOLAR_MASS
			),
			# Neptune
			Body.new(
				x: 1.53796971148509165e+01,
				y: -2.59193146099879641e+01,
				z: 1.79258772950371181e-01,
				vx: 2.68067772490389322e-03 * DAYS_PER_YEAR,
				vy: 1.62824170038242295e-03 * DAYS_PER_YEAR,
				vz: -9.51592254519715870e-05 * DAYS_PER_YEAR,
				mass: 5.15138902046611451e-05 * SOLAR_MASS
			),
		]

		px = 0.0
		py = 0.0
		pz = 0.0

		@bodies.each do |body|
			px += body.vx * body.mass
			py += body.vy * body.mass
			pz += body.vz * body.mass
		end

		sol = @bodies[0]
		sol.vx = -px / SOLAR_MASS
		sol.vy = -py / SOLAR_MASS
		sol.vz = -pz / SOLAR_MASS
	end

	def advance(dt : Float64) : Nil
		dx, dy, dz, dist, mag, bim, bjm = 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0

		@bodies.each_with_index do |bodyi, i|
			j = i + 1
			while j < @bodies.size
				bodyj = @bodies[j]
				dx = bodyi.x - bodyj.x
				dy = bodyi.y - bodyj.y
				dz = bodyi.z - bodyj.z

				dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
				mag = dt / (dist * dist * dist)

				bim = bodyi.mass * mag
				bjm = bodyj.mass * mag

				bodyi.vx -= dx * bjm
				bodyi.vy -= dy * bjm
				bodyi.vz -= dz * bjm

				bodyj.vx += dx * bim
				bodyj.vy += dy * bim
				bodyj.vz += dz * bim
				j += 1
			end

			bodyi.x = bodyi.x + dt * bodyi.vx
			bodyi.y = bodyi.y + dt * bodyi.vy
			bodyi.z = bodyi.z + dt * bodyi.vz
		end
	end

	def energy() : Float64
		dx, dy, dz, dist, e = 0.0, 0.0, 0.0, 0.0, 0.0

		@bodies.each_with_index do |bodyi, i|
			e += 0.5 * bodyi.mass * (bodyi.vx * bodyi.vx + bodyi.vy * bodyi.vy + bodyi.vz * bodyi.vz)

			#@bodies[i + 1...@bodies.size].each do |bodyj|
			j = i + 1
			while j < @bodies.size
				bodyj = @bodies[j]
				dx = bodyi.x - bodyj.x
				dy = bodyi.y - bodyj.y
				dz = bodyi.z - bodyj.z

				dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
				e -= (bodyi.mass * bodyj.mass) / dist
				j += 1
			end
		end
		return e
	end
end

def main() : Nil
	iterations = 50_000_000
	solarSystem = SolarSystem.new()
	puts("Energy before:\t#{solarSystem.energy.round(9)}")

	iterations.times do
		solarSystem.advance(0.01)
	end

	puts("Energy after:\t#{solarSystem.energy.round(9)}")
end

main()