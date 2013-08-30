var KINETIC_ENERGY_LOSS_CONSTANT = 0.75, LINE_WIDTH = 20, GRAVITY = -9.8;

$(document).ready(function() {
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		offset = $(canvas).offset(),
		xAcceleration = 0,
		yAcceleration = GRAVITY,
		mobileDevice = (window.ondevicemotion === null); // Would be undefined on other devices, not null
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	context.font = "bold 16px Arial";
	context.lineCap = "round";
	
	var lines = [];
	
	var drawLine = function(line) {
		
		var x = line.x, y = line.y;
		line.x += line.xVelocity;
		line.y += line.yVelocity;
		
		if (line.x < 0 || line.x > canvas.width) {
			line.xVelocity *= -KINETIC_ENERGY_LOSS_CONSTANT;
			if (line.x < 0) {
				line.x = -line.x;
			} else {
				line.x += canvas.width - line.x;
			}
		}
		
		if (line.y < 0 || line.y > canvas.height) {
			line.yVelocity *= -KINETIC_ENERGY_LOSS_CONSTANT;
			if (line.y < 0) {
				line.y = -line.y;
			} else {
				line.y += canvas.height - line.y;
			}
		}
		
		context.strokeStyle = line.color;
		context.lineWidth = LINE_WIDTH;
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(line.x, line.y);
		context.stroke();
	};
	
	setInterval(function() {
		for (var i = 0; i < lines.length; i++) {
			lines[i].xVelocity += xAcceleration * 48 / 1000;
			lines[i].yVelocity -= yAcceleration * 48 / 1000;
			drawLine(lines[i]);
		}
	}, 1000 / 48);
	
	window.ondevicemotion = function(e) {
		xAcceleration = e.accelerationIncludingGravity.x;
		yAcceleration = e.accelerationIncludingGravity.y;
	};
	
	canvas.ontouchstart = function(e) {
		e.preventDefault();
		
		for (var i = 0; i < e.changedTouches.length; i++) {
			var touch = e.changedTouches[i],
				line = {
					x: touch.pageX - offset.left,
					y: touch.pageY - offset.top,
					xVelocity: mobileDevice ? 0 : Math.random() * 20 - 10,
					yVelocity: 0,
					color: randomPastel()
				};
			lines.push(line);
		}
	};
	
	//////////////////////////////////////////////////////////
	// Code to enable mouse events to be treated as touches //
	//////////////////////////////////////////////////////////
	
	var wrapMouseEvent = function(e) {
		e.changedTouches = [{
			pageX: e.pageX,
			pageY: e.pageY
		}];
	};
	
	canvas.onmousedown = function(e) {
		wrapMouseEvent(e);
		canvas.ontouchstart(e);
	};
});

var randomPastel = function() {
	var r = Math.floor(Math.random() * 4 + 1) * 64,
		g = Math.floor(Math.random() * 4 + 1) * 64,
		b = Math.floor(Math.random() * 4 + 1) * 64;
	return "rgb(" + r + ", " + g + ", " + b + ")";
};