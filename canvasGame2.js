import { Player, Board, Ball } from './classes.js';
import { fix_dpi, initCanvas, initScoreCard, initScoreBoard, checkLeaderBoard } from './util.js';
let canvas = initCanvas();
let score = initScoreCard();
let leaderBoard = [
	{ score: 0, initials: 'ABC' },
	{ score: 1, initials: 'BCD' },
	{ score: 2, initials: 'CDE' },
	{ score: 3, initials: 'DEF' },
	{ score: 4, initials: 'EFG' },
];

let scoreBoard = document.createElement('div');
scoreBoard.classList.add('scoreBoard');
scoreBoard.id = 'scoreBoard';
initScoreBoard(scoreBoard, leaderBoard);

const canvasWidth = +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
const canvasHeight = +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
const centerX = canvasWidth / 2;
const centerY = canvasHeight / 2;

let ctx = canvas.getContext('2d');
let mouseX = 0;
let board,
	ball,
	player,
	game = { state: false, level: 3, score: 0 };

function drawActors() {
	board.draw();
	player.draw(ctx);
	ball.draw(canvasHeight, canvasWidth, ctx, board, player, game);
	score.innerText = `Your Score: ${game.score}`;
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

	ball = new Ball({ x: centerX, y: centerY + 20, radius: 5 });

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
	drawMessage('Press space or click to play');
	override === false ? (game.state = override) : (game.state = true);
	score.innerText = `Your Score: ${game.score}`;
}
init(false);

function clear(ctx) {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function paint() {
	if (!game.state) {
		drawMessage('Game Over, press space or click to play again');
		leaderBoard = checkLeaderBoard(game.score, leaderBoard);
		scoreBoard.innerHTML = '';
		console.log(leaderBoard);
		initScoreBoard(scoreBoard, leaderBoard);
		game.score = 0;
		game.level = 3;
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
/*  enable for mouse support

function mouseMove(e) {
	if (e.clientX > mouseX) keyDown({ key: 'ArrowRight' });
	if (e.clientX < mouseX) keyDown({ key: 'ArrowLeft' });
	mouseX = e.clientX;
}

*/

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
// document.addEventListener('mousemove', mouseMove);
document.addEventListener('click', (e) => keyDown({ key: ' ' }));
