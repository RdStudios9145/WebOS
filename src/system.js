class System {
	compositor;
	apps = [];

	constructor() {
		this.compositor = new Compositor(c, new Vec(canvas.width, canvas.height));
		this.compositor.composite();

		this.width = canvas.width;
		this.height = canvas.height;
	}

	createWindow(
		name = "New Window",
		pos = new Vec(500, 500),
		size = new Vec(100, 100),
		headerless = false,
	) {
		return this.compositor.createWindow(name, pos, size, headerless);
	}

	registerApp(app) {
		this.apps.push(app);
		return this.apps.length - 1;
	}

	runApp(id) {
		this.compositor.dirty = true;
		return new this.apps[id]();
	}

	dirty() {
		this.compositor.dirty = true;
	}
}
