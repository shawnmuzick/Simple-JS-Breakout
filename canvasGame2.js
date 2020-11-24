import { Player, Board, Ball } from './classes.js';
const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'canvas');
canvas.style.width = '100%';
canvas.style.height = '100%';

let dpi = window.devicePixelRatio;
function fix_dpi() {
	let style_height = +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
	let style_width = +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
	canvas.setAttribute('height', style_height * dpi);
	canvas.setAttribute('width', style_width * dpi);
}
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

const canvasWidth = +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
const canvasHeight = +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
const centerX = canvasWidth / 2;
const centerY = canvasHeight / 2;
const tiles = [
	[{ on: true }, { on: true }, { on: true }, { on: true }, { on: true }],
	[{ on: true }, { on: true }, { on: true }, { on: true }, { on: true }],
	[{ on: true }, { on: true }, { on: true }, { on: true }, { on: true }],
	[{ on: true }, { on: true }, { on: true }, { on: true }, { on: true }],
	[{ on: true }, { on: true }, { on: true }, { on: true }, { on: true }],
	[{ on: true }, { on: true }, { on: true }, { on: true }, { on: true }],
	[{ on: true }, { on: true }, { on: true }, { on: true }, { on: true }],
	[{ on: true }, { on: true }, { on: true }, { on: true }, { on: true }],
];
let player = new Player({
	speed: 10,
	width: 100,
	height: 10,
	dx: 0,
	x: centerX,
	y: canvasHeight - 10,
});
let board = new Board({ width: canvasWidth, height: canvasHeight * (3 / 4), tiles, ctx });
let ball = new Ball({ x: centerX, y: centerY, radius: 5 });

function clear() {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function paint() {
	clear();
	fix_dpi();
	board.draw();
	player.draw(ctx);
	player.move(canvas);
	ball.draw(canvasHeight, canvasWidth, ctx, board, player);
	requestAnimationFrame(paint);
}

function keyDown(e) {
	let fn = null;
	switch (e.key) {
		case 'ArrowRight':
			fn = player.right();
			break;
		case 'ArrowLeft':
			fn = player.left();
			break;
		default:
			fn = () => {};
	}
	fn();
}

paint();
document.addEventListener('keydown', keyDown);
