class Compositor {
	windows = [];
	gifted_ids = [];
	order = [];
	image;
	ctx;
	dirty = true;
	header_height = 25;
	style = {
		primary: "#181818",
		textColor: "#fff",
		font: "15px monospace",
	};
	bkg;
	size;
	isMouseDown = false;
	draggingWindow = false;
	resizingWindow = false;
	deltaTime = 0;
	targetFPS = 30;

	constructor(c, size) {
		this.image = c.createImageData(
			document.documentElement.clientWidth,
			document.documentElement.clientHeight,
		);
		this.ctx = c;
		this.size = size;

		addEventListener("mousedown", (e) => globalCompositor.mousedown(e));
		addEventListener("mouseup", (e) => globalCompositor.mouseup(e));
		addEventListener("mousemove", (e) => globalCompositor.mousemove(e));
		addEventListener("contextmenu", (e) => e.preventDefault());
	}

	getWindow(id) {
		for (let i = 0; i < this.windows.length; ++i) {
			if (this.windows[i].id == id) return this.windows[i];
		}
	}

	createWindow(
		name = "New Window",
		pos = new Vec(500, 500),
		size = new Vec(100, 100),
		headerless = false,
	) {
		var id = Math.floor(Math.random() * 10000);
		while (this.gifted_ids.includes(id)) id = Math.floor(Math.random() * 10000);
		this.gifted_ids.push(id);

		let buffer = c.createImageData(size.x, size.y);
		const window = new Window(name, pos, size, headerless, id, buffer);

		this.windows.push(window);
		this.order.unshift(id);
		this.dirty = true;
		return window;
	}

	focusWindow(id) {
		const i = this.order.indexOf(id);
		if (i < 0) {
			console.err("Could not find window with ID: ", id);
			return -1;
		}
		this.order.splice(i, 1);
		this.order.unshift(id);
	}

	renderHeader(w) {
		let tl = new Vec(w.pos.x - w.size.x / 2, w.pos.y - w.size.y / 2);
		let header = new Rect(
			new Vec(w.pos.x + 1, w.pos.y - (w.size.y + this.header_height) / 2),
			new Vec(w.size.x + 2, this.header_height + 10),
			5,
		);
		this.ctx.fillStyle = this.style.primary;
		header.draw(this.ctx);
		this.ctx.fillStyle = this.style.textColor;
		this.ctx.font = this.style.font;
		this.ctx.fillText(
			w.name,
			tl.x + (this.header_height - 15) / 2,
			tl.y - (this.header_height - 10) / 2,
			w.size.x,
		);
	}

	composite() {
		if (!this.dirty) {
			setTimeout(() => globalCompositor.composite(), 1000 / this.targetFPS);
			return;
		}

		setTimeout(
			() => globalCompositor.composite(),
			Math.max(1000 / this.targetFPS - this.deltaTime, 1),
		);
		let renderTime = Date.now();

		if ((img.height > img.width && this.size.x > this.size.y) || false) {
			let scalar = this.size.x / img.width;
			this.ctx.drawImage(
				img,
				0,
				(scalar * img.height - this.size.y) / -2,
				this.size.x,
				img.height * scalar,
			);
		} else if (img.width > img.height) {
			let scalar = this.size.y / img.height;
			this.ctx.drawImage(
				img,
				-(scalar * img.width - this.size.x) / 2,
				0,
				img.width * scalar,
				this.size.y,
			);
		}

		for (let i = this.order.length - 1; i >= 0; --i) {
			let w = this.getWindow(this.order[i]);
			if (w.headerless)
				this.ctx.putImageData(
					w.image_buffer,
					w.pos.x - w.size.x / 2,
					w.pos.y - w.size.y / 2,
				);
			else {
				this.ctx.lineWidth = 1;
				new Rect(
					new Vec(w.pos.x + 1, w.pos.y - 5),
					new Vec(w.size.x, w.size.y + 11),
					5,
					"stroke",
				).draw(this.ctx);

				this.renderHeader(w);

				this.ctx.save();
				new Rect(w.pos, w.size, [0, 0, 5, 5], "clip").draw(this.ctx);

				this.ctx.putImageData(
					w.image_buffer,
					w.pos.x - w.size.x / 2 + 1,
					w.pos.y - w.size.y / 2,
				);

				this.ctx.restore();
			}
		}
		this.dirty = false;
		this.deltaTime = Date.now() - renderTime;

		// FPS
		// deltatime is in ms/frame, so 1/delta is frame/ms and 1000/delta is frame/s
		this.ctx.font = "15px monospace";
		this.ctx.fontStyle = "black";
		this.ctx.fillText(`FPS: ${1000 / Math.max(this.deltaTime, 1)}`, 10, 20);
	}

	mousedown(e) {
		this.isMouseDown = true;
		for (let i = 0; i < this.order.length; ++i) {
			let w = this.getWindow(this.order[i]);
			// if it is not inside the width of a window, discard it
			if (
				!(
					e.clientX >= w.pos.x - w.size.x / 2 &&
					e.clientX <= w.pos.x + w.size.x / 2
				)
			)
				continue;

			// if it is inside the body, focus it
			if (
				e.clientY >= w.pos.y - w.size.y / 2 &&
				e.clientY <= w.pos.y + w.size.y / 2
			) {
				this.focusWindow(this.order[i]);
				this.dirty = true;
				if (e.ctrlKey) {
					if (e.button == 0) this.draggingWindow = true;
					else if (e.button == 2)
						this.resizingWindow = { v: e.clientX >= w.pos.x };
				}
				return;
			}

			// if it is inside the header, focus it and set it to dragging
			if (
				e.button == 0 &&
				e.clientY >= w.pos.y - w.size.y / 2 - this.header_height &&
				e.clientY <= w.pos.y - w.size.y / 2
			) {
				this.focusWindow(this.order[i]);
				this.dirty = true;
				this.draggingWindow = true;
				return;
			}
		}
	}

	mouseup(e) {
		this.isMouseDown = false;
		this.draggingWindow = false;
		this.resizingWindow = false;
	}

	mousemove(e) {
		if (this.isMouseDown) {
			let w = this.getWindow(this.order[0]);
			if (this.draggingWindow) {
				w.pos.add(e.movementX, e.movementY);
			} else if (this.resizingWindow) {
				w.size.add((this.resizingWindow.v ? 1 : -1) * e.movementX, e.movementY);
				w.pos.add(e.movementX / 2, e.movementY / 2);
				this.updateWindowBuffer(w);
			}

			if (this.draggingWindow || this.resizingWindow) {
				this.dirty = true;
				this.focusWindow(this.order[0]);
				return;
			}
		}
	}

	updateWindowBuffer(w) {
		let wx = w.size.x;
		let hy = w.size.y;
		let buf = this.ctx.createImageData(wx, hy);
		let old = w.image_buffer.data;

		for (let y = 0; y < hy; y += 4) {
			for (let x = 0; x < 4 * wx; x++) {
				buf.data[y * wx + x] = old[y * wx + x];
			}
		}

		w.image_buffer = buf;
	}
}
