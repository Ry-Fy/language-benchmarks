#include <stdio.h>
#include <math.h>
#include <stdlib.h>

#define PI 3.141592653589793
#define SOLAR_MASS ( 4 * PI * PI )
#define DAYS_PER_YEAR 365.24
#define BODY_COUNT 5

struct body {
	double x, y, z, vx, vy, vz, mass;
};

struct body bodies[BODY_COUNT] = {
	// Sol
	{
		0, 0, 0, 0, 0, 0, SOLAR_MASS
	},
	// Jupiter
	{
		4.84143144246472090e+00,
		-1.16032004402742839e+00,
		-1.03622044471123109e-01,
		1.66007664274403694e-03 * DAYS_PER_YEAR,
		7.69901118419740425e-03 * DAYS_PER_YEAR,
		-6.90460016972063023e-05 * DAYS_PER_YEAR,
		9.54791938424326609e-04 * SOLAR_MASS
	},
	// Saturn
	{
		8.34336671824457987e+00,
		4.12479856412430479e+00,
		-4.03523417114321381e-01,
		-2.76742510726862411e-03 * DAYS_PER_YEAR,
		4.99852801234917238e-03 * DAYS_PER_YEAR,
		2.30417297573763929e-05 * DAYS_PER_YEAR,
		2.85885980666130812e-04 * SOLAR_MASS
	},
	// Uranus
	{
		1.28943695621391310e+01,
		-1.51111514016986312e+01,
		-2.23307578892655734e-01,
		2.96460137564761618e-03 * DAYS_PER_YEAR,
		2.37847173959480950e-03 * DAYS_PER_YEAR,
		-2.96589568540237556e-05 * DAYS_PER_YEAR,
		4.36624404335156298e-05 * SOLAR_MASS
	},
	{
		1.53796971148509165e+01,
		-2.59193146099879641e+01,
		1.79258772950371181e-01,
		2.68067772490389322e-03 * DAYS_PER_YEAR,
		1.62824170038242295e-03 * DAYS_PER_YEAR,
		-9.51592254519715870e-05 * DAYS_PER_YEAR,
		5.15138902046611451e-05 * SOLAR_MASS
	}
};

void offset_sol_momentum(struct body* bodies) {
	double px = 0.0;
	double py = 0.0;
	double pz = 0.0;

	int i;
	for (i = 0; i < BODY_COUNT; i++) {
		px += bodies[i].vx * bodies[i].mass;
		py += bodies[i].vy * bodies[i].mass;
		pz += bodies[i].vz * bodies[i].mass;
	}

	bodies[0].vx = - px / SOLAR_MASS;
	bodies[0].vy = - py / SOLAR_MASS;
	bodies[0].vz = - pz / SOLAR_MASS;
}

void bodies_advance(struct body* bodies, double dt) {
	double dx, dy, dz, dist, mag, bim, bjm;

	int i;
	for (i = 0; i < BODY_COUNT; i++) {
		struct body* bodyi = &(bodies[i]);
		
		int j;
		for (j = i + 1; j < BODY_COUNT; j++) {
			struct body* bodyj = &(bodies[j]);

			dx = bodyi->x - bodyj->x;
			dy = bodyi->y - bodyj->y;
			dz = bodyi->z - bodyj->z;

			dist = sqrt(dx * dx + dy * dy + dz * dz);
			mag = dt / (dist * dist * dist);

			bim = bodyi->mass * mag;
			bjm = bodyj->mass * mag;

			bodyi->vx -= dx * bjm;
			bodyi->vy -= dy * bjm;
			bodyi->vz -= dz * bjm;

			bodyj->vx += dx * bim;
			bodyj->vy += dy * bim;
			bodyj->vz += dz * bim;
		}

		bodyi->x = bodyi->x + dt * bodyi->vx;
		bodyi->y = bodyi->y + dt * bodyi->vy;
		bodyi->z = bodyi->z + dt * bodyi->vz;
	}
}

double bodies_energy(struct body* bodies) {
	double dx, dy, dz, dist;
	double e = 0.0;

	int i;
	for (i = 0; i < BODY_COUNT; i++) {
		struct body* bodyi = &(bodies[i]);
		e += 0.5 * bodyi->mass * (bodyi->vx * bodyi->vx + bodyi->vy * bodyi->vy + bodyi->vz * bodyi->vz);

		int j;
		for (j = i + 1; j < BODY_COUNT; j++) {
			struct body* bodyj = &(bodies[j]);

			dx = bodyi->x - bodyj->x;
			dy = bodyi->y - bodyj->y;
			dz = bodyi->z - bodyj->z;

			dist = sqrt(dx * dx + dy * dy + dz * dz);
			e -= (bodyi->mass * bodyj->mass) / dist;
		}
	}

	return e;
}

int main(int argc, char** argv) {
	int iterations = 50000000;
	offset_sol_momentum(bodies);
	printf("Energy before:\t%.9f\n", bodies_energy(bodies));

	int i;
	for (i = 0; i < iterations; i++) {
		bodies_advance(bodies, 0.01);
	}

	printf("Energy after:\t%.9f\n", bodies_energy(bodies));
	return 0;
}