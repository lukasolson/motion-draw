function MotionDraw(canvas) {
	this.canvas = canvas;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	this.context = canvas.getContext("2d");
	this.context.lineCap = "round";
	this.context.lineWidth = 20;

	this.acceleration = {x: 0, y: 0};
	this.ballpoints = [];

	canvas.addEventListener("mousedown", (function (e) {
		this.addBallpoint(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
	}).bind(this));

	canvas.addEventListener("touchstart", (function (e) {
		e.preventDefault();
		for (var i = 0; i < e.changedTouches.length; i++) {
			this.addBallpoint(
				e.changedTouches[i].pageX - canvas.offsetLeft,
				e.changedTouches[i].pageY - canvas.offsetTop
			);
		}
	}).bind(this));

	window.addEventListener("devicemotion", (function (e) {
		this.acceleration.x = e.accelerationIncludingGravity.x;
		this.acceleration.y = e.accelerationIncludingGravity.y;
	}).bind(this));

	window.addEventListener("mousemove", (function (e) {
		this.acceleration.x = (e.pageX - window.innerWidth / 2) / (window.innerWidth / 2);
		this.acceleration.y = (window.innerHeight / 2 - e.pageY) / (window.innerHeight / 2);
	}).bind(this));

	window.requestAnimationFrame(this.moveBallpoints.bind(this));
}

MotionDraw.randomPastel = function () {
	var r = Math.floor(Math.random() * 4 + 1) * 64,
		g = Math.floor(Math.random() * 4 + 1) * 64,
		b = Math.floor(Math.random() * 4 + 1) * 64;
	return "rgb(" + r + ", " + g + ", " + b + ")";
};

MotionDraw.prototype = {
	addBallpoint: function (x, y) {
		this.ballpoints.push({x: x, y: y, color: MotionDraw.randomPastel()});
	},

	moveBallpoints: function () {
		for (var i = 0; i < this.ballpoints.length; i++) {
			this.moveBallpoint(this.ballpoints[i]);
		}
		window.requestAnimationFrame(this.moveBallpoints.bind(this));
	},

	moveBallpoint: function (ballpoint) {
		var x = ballpoint.x, y = ballpoint.y;
		ballpoint.x += this.acceleration.x;
		ballpoint.y -= this.acceleration.y;

		this.drawLine(x, y, ballpoint.x, ballpoint.y, ballpoint.color);
	},

	drawLine: function (x0, y0, x1, y1, color) {
		this.context.strokeStyle = color;
		this.context.beginPath();
		this.context.moveTo(x0, y0);
		this.context.lineTo(x1, y1);
		this.context.stroke();
	}
};