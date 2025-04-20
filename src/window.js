class Window {
	name;
	pos;
	size;
	id;
	image_buffer;
	headerless;
	immoveable = false;
	constructor(
		name = "New Window",
		pos = new Vec(500, 500),
		size = new Vec(100, 100),
		headerless = false,
		id = -1,
		buffer,
	) {
		this.name = name;
		this.pos = pos;
		this.size = size;
		this.id = id;
		this.image_buffer = buffer;
		this.headerless = headerless;
	}
}
