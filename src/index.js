const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

// new Rect().draw(c);

const imgs = document.querySelectorAll(".bkg");
const img = imgs[Math.floor(Math.random() * imgs.length)];
// const globalCompositor = new Compositor(
// c,
// new Vec(canvas.width, canvas.height),
// );

const system = new System();
registerSystemApps();
