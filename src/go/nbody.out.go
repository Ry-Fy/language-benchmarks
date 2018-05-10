package main

import (
	"fmt"
	"math"
)

const (
	PI float64 = 3.141592653589793
	SOLAR_MASS float64 = (4 * PI * PI)
	DAYS_PER_YEAR float64 = 365.24
)

// Body is a thing
type Body struct {
	x, y, z, vx, vy, vz, mass float64
}

// SolarSystem is a thing
type SolarSystem struct {
	bodies []*Body
}

// SolarSystemNew is a thing
func SolarSystemNew() SolarSystem {
	system := SolarSystem {
		bodies: []*Body {
			// Sol
			&Body {
				x: 0.0, y: 0.0, z: 0.0, vx: 0.0, vy: 0.0, vz: 0.0, mass: SOLAR_MASS,
			},
			// Jupiter
			&Body {
				x: 4.84143144246472090e+00,
				y: -1.16032004402742839e+00,
				z: -1.03622044471123109e-01,
				vx: 1.66007664274403694e-03 * DAYS_PER_YEAR,
				vy: 7.69901118419740425e-03 * DAYS_PER_YEAR,
				vz: -6.90460016972063023e-05 * DAYS_PER_YEAR,
				mass: 9.54791938424326609e-04 * SOLAR_MASS,
			},
			// Saturn
			&Body {
				x: 8.34336671824457987e+00,
				y: 4.12479856412430479e+00,
				z: -4.03523417114321381e-01,
				vx: -2.76742510726862411e-03 * DAYS_PER_YEAR,
				vy: 4.99852801234917238e-03 * DAYS_PER_YEAR,
				vz: 2.30417297573763929e-05 * DAYS_PER_YEAR,
				mass: 2.85885980666130812e-04 * SOLAR_MASS,
			},
			// Uranus
			&Body {
				x: 1.28943695621391310e+01,
				y: -1.51111514016986312e+01,
				z: -2.23307578892655734e-01,
				vx: 2.96460137564761618e-03 * DAYS_PER_YEAR,
				vy: 2.37847173959480950e-03 * DAYS_PER_YEAR,
				vz: -2.96589568540237556e-05 * DAYS_PER_YEAR,
				mass: 4.36624404335156298e-05 * SOLAR_MASS,
			},
			// Neptune
			&Body {
				x: 1.53796971148509165e+01,
				y: -2.59193146099879641e+01,
				z: 1.79258772950371181e-01,
				vx: 2.68067772490389322e-03 * DAYS_PER_YEAR,
				vy: 1.62824170038242295e-03 * DAYS_PER_YEAR,
				vz: -9.51592254519715870e-05 * DAYS_PER_YEAR,
				mass: 5.15138902046611451e-05 * SOLAR_MASS,
			},
		},
	}

	px := 0.0
	py := 0.0
	pz := 0.0

	for _, body := range system.bodies {
		px += body.vx * body.mass
		py += body.vy * body.mass
		pz += body.vz * body.mass
	}

	sol := system.bodies[0]
	sol.vx = -px / SOLAR_MASS
	sol.vy = -py / SOLAR_MASS
	sol.vz = -pz / SOLAR_MASS

	return system
}

// Advance is a thing
func (system *SolarSystem) Advance(dt float64) {
	var dx, dy, dz, dist, mag, bim, bjm float64

	for i, bodyi := range system.bodies {
		for j := i + 1; j < len(system.bodies); j++ {
			bodyj := system.bodies[j]
			dx = bodyi.x - bodyj.x
			dy = bodyi.y - bodyj.y
			dz = bodyi.z - bodyj.z

			dist = math.Sqrt(dx * dx + dy * dy + dz * dz)
			mag = dt / (dist * dist * dist)

			bim = bodyi.mass * mag
			bjm = bodyj.mass * mag

			bodyi.vx -= dx * bjm
			bodyi.vy -= dy * bjm
			bodyi.vz -= dz * bjm

			bodyj.vx += dx * bim
			bodyj.vy += dy * bim
			bodyj.vz += dz * bim
		}

		bodyi.x = bodyi.x + dt * bodyi.vx
		bodyi.y = bodyi.y + dt * bodyi.vy
		bodyi.z = bodyi.z + dt * bodyi.vz
	}
}

// Energy is a thing
func (system *SolarSystem) Energy() float64 {
	var dx, dy, dz, dist, e float64
	e = 0.0

	for i, bodyi := range system.bodies {
		e += 0.5 * bodyi.mass * (bodyi.vx * bodyi.vx + bodyi.vy * bodyi.vy + bodyi.vz * bodyi.vz)

		for j := i + 1; j < len(system.bodies); j++ {
			bodyj := system.bodies[j]
			dx = bodyi.x - bodyj.x
			dy = bodyi.y - bodyj.y
			dz = bodyi.z - bodyj.z

			dist = math.Sqrt(dx * dx + dy * dy + dz * dz)
			e -= (bodyi.mass * bodyj.mass) / dist
		}
	}

	return e
}

func main() {
	iterations := 50000000
	solarSystem := SolarSystemNew()
	fmt.Printf("Energy before:\t%.9f\n", solarSystem.Energy())

	for i := 0; i < iterations; i++ {
		solarSystem.Advance(0.01)
	}

	fmt.Printf("Energy after:\t%.9f\n", solarSystem.Energy())
}