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
