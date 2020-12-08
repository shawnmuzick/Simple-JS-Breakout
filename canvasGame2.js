import { Player, Board, Ball } from './classes.js';
import { fix_dpi, initCanvas } from './util.js';
let canvas = initCanvas();
const canvasWidth = +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
const canvasHeight = +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
const centerX = canvasWidth / 2;
const centerY = canvasHeight / 2;
let ctx = canvas.getContext('2d');
let mouseX = 0;
let board,
	ball,
	player,
	game = { state: false, level: 3 };

function drawActors() {
	board.draw();
	player.draw(ctx);
	ball.draw(canvasHeight, canvasWidth, ctx, board, player, game);
}

function drawMessage(message) {
	ctx.font = '50px serif';
	ctx.textAlign = 'center';
	ctx.fillText(message, centerX, centerY);
}

function animate() {
	clear(ctx);
	fix_dpi(canvas);
	drawActors();
}

function init(override) {
	board = new Board({ width: canvasWidth, height: canvasHeight, rows: game.level, ctx: ctx });
	board.buildTiles();

	ball = new Ball({ x: centerX, y: centerY, radius: 5 });

	game.state = false;
	player = new Player({
		speed: 8,
		width: 100,
		height: 10,
		dx: 0,
		x: centerX,
		canvasHeight: canvasHeight,
	});
	animate();
	drawMessage('Press space to play');
	override === false ? (game.state = override) : (game.state = true);
}
init(false);

function clear(ctx) {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function paint() {
	if (!game.state) {
		drawMessage('Game Over, press space to play again');
		return;
	} else {
		animate();
		player.move(canvas);
	}
	if (board.winCondition === 0) {
		animate();
		game.level++;
		game.state = false;
		drawMessage(`Level ${game.level - 2} - Press Space to begin`);
		return;
	}
	requestAnimationFrame(paint);
}

function keyDown(e) {
	if (e.key === ' ' && game.state) {
		console.log(game.state);
		console.log('test');
		return;
	}
	let obj = {
		ArrowRight: player.right(),
		ArrowLeft: player.left(),
		' ': () => {
			init();
			paint();
		},
	};
	obj[e.key]();
	return;
}

function keyUp(e) {
	player.dx = 0;
	return;
}

function mouseMove(e) {
	if (e.clientX > mouseX) keyDown({ key: 'ArrowRight' });
	if (e.clientX < mouseX) keyDown({ key: 'ArrowLeft' });
	mouseX = e.clientX;
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
document.addEventListener('mousemove', mouseMove);
document.addEventListener('click', (e) => keyDown({ key: ' ' }));
