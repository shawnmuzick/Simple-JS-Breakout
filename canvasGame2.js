import { Player, Board, Ball } from './classes.js';
import { fix_dpi, initCanvas } from './util.js';
let canvas = initCanvas();
const canvasWidth = +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
const canvasHeight = +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
const centerX = canvasWidth / 2;
const centerY = canvasHeight / 2;
const ctx = canvas.getContext('2d');
let gameLevel = 3;
let player = new Player({
	speed: 5,
	width: 100,
	height: 10,
	dx: 0,
	x: centerX,
	canvasHeight: canvasHeight,
});

let board = new Board({ width: canvasWidth, height: canvasHeight, rows: gameLevel, ctx: ctx });
board.buildTiles();

let ball = new Ball({ x: centerX, y: centerY, radius: 5 });

let game = { state: true };

function clear(ctx) {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function gameOver() {
	return;
}

function paint() {
	if (game.state) {
		clear(ctx);
		fix_dpi(canvas);
		board.draw();
		player.draw(ctx);
		player.move(canvas);
		ball.draw(canvasHeight, canvasWidth, ctx, board, player, game);
	}
	if (!game.state) {
		ctx.fillText('Game Over', centerX, centerY);
		requestAnimationFrame(gameOver);
		return;
	}
	if (board.winCondition === 0) {
		gameLevel++;

		player = new Player({
			speed: 5,
			width: 100,
			height: 10,
			dx: 0,
			x: centerX,
			canvasHeight: canvasHeight,
		});
		ball = new Ball({ x: centerX, y: centerY, radius: 5 });
		board = new Board({
			width: canvasWidth,
			height: canvasHeight,
			rows: gameLevel++,
			ctx: ctx,
		});
		board.buildTiles();
	}
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
			break;
	}
	fn();
}
function keyUp(e) {
	player.dx = 0;
}

paint();
document.addEventListener('keydown', keyDown);

document.addEventListener('keyup', keyUp);
