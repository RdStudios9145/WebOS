const registerSystemApps = () => {
	class BottomBar {
		tbWindow;

		constructor() {
			this.height = 60;
			this.tbWindow = system.createWindow(
				"Bottom Bar",
				new Vec(system.width / 2, system.height - this.height / 2),
				new Vec(system.width, this.height),
				true,
			);
			this.tbWindow.immoveable = true;
			this.settingsIco = document.getElementById("settings-icon");

			addEventListener("mousemove", (e) => this.updateMove(e));
			addEventListener("mousedown", (e) => this.updateDown(e));
			addEventListener("mouseup", (e) => this.updateUp(e));

			this.render();
		}

		render() {
			// 4 color channels
			for (let i = 0; i < system.width * this.height * 4; i += 4) {
				this.tbWindow.image_buffer.data[i + 0] = 190;
				this.tbWindow.image_buffer.data[i + 1] = 0;
				this.tbWindow.image_buffer.data[i + 2] = 210;
				this.tbWindow.image_buffer.data[i + 3] = (i / system.width / 4) * 255;
			}
			system.dirty();
		}
	}
	system.runApp(system.registerApp(BottomBar));
};
