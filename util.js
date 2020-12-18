let dpi = window.devicePixelRatio;
export function fix_dpi(canvas) {
	let style_height = +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
	let style_width = +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
	canvas.setAttribute('height', style_height * dpi);
	canvas.setAttribute('width', style_width * dpi);
}

export function initCanvas() {
	let canvas = document.createElement('canvas');
	canvas.setAttribute('id', 'canvas');
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	document.body.appendChild(canvas);
	return canvas;
}
export function initScoreBoard(scoreBoard, arr) {
	for (let i = arr.length - 1; i >= 0; i--) {
		let item = document.createElement('div');
		let score = document.createElement('p');
		let initials = document.createElement('p');
		score.innerText = arr[i].score;
		initials.innerText = arr[i].initials;
		item.appendChild(score);
		item.appendChild(initials);
		item.id = `${arr[i].score}-${arr[i].initials}`;
		scoreBoard.appendChild(item);
	}
	document.body.appendChild(scoreBoard);
}

export function initScoreCard() {
	let scoreCard = document.createElement('div');
	scoreCard.classList.add('scoreCard');
	let score = document.createElement('p');
	score.classList.add('score');
	scoreCard.appendChild(score);
	document.body.appendChild(scoreCard);
	return score;
}
export function checkLeaderBoard(score, arr) {
	for (let i = arr.length - 1; i >= 0; i--) {
		if (score > arr[i].score) {
			let initials = window.prompt(
				'congratulations, you made the leaderboard! Enter your initials'
			);
			arr.splice(i + 1, 0, { score: score, initials: initials });
			arr.shift();
			break;
		}
	}
	return arr;
}
