class Rect {
	pos = new Vec(0, 0);
	size = new Vec(10, 10);
	r = 10;
	style;
	constructor(pos = new Vec(), size = new Vec(10, 10), r = 10, style = "fill") {
		this.pos = pos;
		this.size = size;
		this.r = r;
		this.style = style;
	}

	draw(c) {
		c.beginPath();
		c.roundRect(
			this.pos.x - this.size.x / 2,
			this.pos.y - this.size.y / 2,
			this.size.x,
			this.size.y,
			this.r,
		);
		c[this.style]();
	}

	drawBad(c) {
		c.beginPath();
		c.moveTo(
			this.pos.x - this.size.x / 2 + this.r,
			this.pos.y - this.size.y / 2,
		);
		c.lineTo(
			this.pos.x + this.size.x / 2 - this.r,
			this.pos.y - this.size.y / 2,
		);
		c.arc(
			this.pos.x + this.size.x / 2 - this.r,
			this.pos.y - this.size.y / 2 + this.r,
			this.r,
			(270 * Math.PI) / 180,
			0,
		);
		c.moveTo(
			this.pos.x + this.size.x / 2,
			this.pos.y - this.size.y / 2 + this.r,
		);
		c.lineTo(
			this.pos.x + this.size.x / 2,
			this.pos.y + this.size.y / 2 - this.r,
		);
		c.arc(
			this.pos.x + this.size.x / 2 - this.r,
			this.pos.y + this.size.y / 2 - this.r,
			this.r,
			0,
			(90 / 180) * Math.PI,
		);
		c.moveTo(
			this.pos.x + this.size.x / 2 - this.r,
			this.pos.y + this.size.y / 2,
		);
		c.lineTo(
			this.pos.x - this.size.x / 2 + this.r,
			this.pos.y + this.size.y / 2,
		);
		c.arc(
			this.pos.x - this.size.x / 2 + this.r,
			this.pos.y + this.size.y / 2 - this.r,
			this.r,
			(90 / 180) * Math.PI,
			Math.PI,
		);
		c.moveTo(
			this.pos.x - this.size.x / 2,
			this.pos.y + this.size.y / 2 - this.r,
		);
		c.lineTo(
			this.pos.x - this.size.x / 2,
			this.pos.y - this.size.y / 2 + this.r,
		);
		c.arc(
			this.pos.x - this.size.x / 2 + this.r,
			this.pos.y - this.size.y / 2 + this.r,
			this.r,
			Math.PI,
			(270 / 180) * Math.PI,
		);
		if (this.fill) c.fill();
		else c.stroke();
	}
}
