class Vector {
	x = 0;
	y = 0;
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	add(x = 0, y = 0) {
		this.x += x;
		this.y += y;
	}
}

class Vec extends Vector {}
