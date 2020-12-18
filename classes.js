export class Player {
	constructor({ speed, width, height, dx, x, canvasHeight }) {
		this.speed = speed;
		this.width = width;
		this.height = height;
		this.dx = dx;
		this.x = x;
		this.y = canvasHeight - height;
	}

	left() {
		return () => (this.dx = -this.speed);
	}

	right() {
		return () => (this.dx = this.speed);
	}

	move(canvas) {
		if (this.x + this.dx + this.width / 2 > canvas.width) {
			this.x += 0;
		} else if (this.x + this.dx - this.width / 2 < 0) {
			this.x += 0;
		} else {
			this.x += this.dx;
		}
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.rect(this.x - this.width / 2, this.y, this.width, this.height);
		ctx.fillStyle = 'orange';
		ctx.fill();
	}
}

export class Brick {
	constructor({ x, y, width, height, on }) {
		this.x = x * width;
		this.y = y * height;
		this.width = width;
		this.height = height;
		this.color = 'blue';
		this.on = on;
	}

	draw(ctx, i, j) {
		ctx.beginPath();
		ctx.rect(j * this.width, i * this.height, this.width, this.height);
		ctx.fillStyle = this.on ? this.color : 'transparent';
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = this.on ? 'black' : 'transparent';
		ctx.stroke();
	}
}
export class Board {
	constructor({ width, height, rows, ctx }) {
		this.width = width;
		this.height = height;
		this.tiles = [];
		this.ctx = ctx;
		this.winCondition = 0;
		this.rows = rows;
	}

	buildTiles() {
		for (let i = 0; i < this.rows; i++) {
			this.tiles[i] = [];
			for (let j = 0; j < 10; j++) {
				this.tiles[i][j] = { on: true };
			}
		}
		this.winCondition = this.tiles.length * this.tiles[0].length;
	}

	draw() {
		for (let i = 0; i < this.tiles.length; i++) {
			for (let j = 0; j < this.tiles[0].length; j++) {
				this.tiles[i][j] = new Brick({
					x: j,
					y: i,
					width: this.width / this.tiles[i].length,
					height: 10,
					on: this.tiles[i][j].on,
				});
				this.tiles[i][j].draw(this.ctx, i, j);
			}
		}
	}
}
export class Ball {
	constructor({ x, y, radius }) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.dx = 0;
		this.dy = 5;
	}

	draw(canvasHeight, canvasWidth, ctx, board, player, game) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = 'green';
		ctx.fill();

		this.x += this.dx;
		this.y += this.dy;
		this.checkWallCollision(canvasHeight, canvasWidth, game);
		this.checkBrickCollision(board, game);
		this.checkPlayerCollision(player);
	}

	checkWallCollision(canvasHeight, canvasWidth, game) {
		if (this.x + this.radius >= canvasWidth || this.x - this.radius <= 0) {
			this.dx *= -1;
		}
		if (this.y - this.radius <= 0) {
			this.dy *= -1;
		}
		if (this.y + this.radius > canvasHeight) {
			game.state = false;
		}
	}

	checkBrickCollision(board, game) {
		let grid = board.tiles;
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				let item = grid[i][j];
				if (
					this.y - this.radius < item.y + item.height &&
					this.y - this.radius > item.y
				) {
					if (
						this.x + this.radius > item.x &&
						this.x + this.radius < item.x + item.width
					) {
						if (item.on) {
							this.dy *= -1;
							item.on = false;
							board.winCondition--;
							game.score++;
						}
					}
				}
			}
		}
	}

	checkPlayerCollision(player) {
		if (this.y + this.radius > player.y) {
			if (
				this.x + this.radius >= player.x - player.width / 2 &&
				this.x + this.radius <= player.x + player.width / 2
			) {
				this.dy *= -1;
				if (this.x < player.x) {
					this.dx =
						this.dx / 2 -
						(player.x - (player.x - player.width / 2)) / 10;
				} else if (this.x > player.x) {
					this.dx =
						this.dx / 2 +
						(player.x - (player.x - player.width / 2)) / 10;
				} else {
					this.dx = player.dx;
				}
			}
		}
	}
}
