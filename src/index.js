const mapInputToOutputRange = (val, inputMin, inputMax, outputMin, outputMax) => {
	return (outputMax - outputMin) * (val - inputMin) / (inputMax - inputMin) + outputMin;
};

const clampValue = (val, min, max) => {
	return Math.min(Math.max(min, val), max);
}

// IPv4: 'ws://127.0.0.1:3000'
// IPv6: 'ws://[::1]:1337'
const url = `ws://${window.location.hostname}:${window.location.port}`;

// const ws = new WebSocket(url);
// ws.onopen = () => document.querySelector('#connectionStatus > span').textContent = 'Connected';
// ws.onclose = () => document.querySelector('#connectionStatus > span').textContent = 'Not Connected!';
// ws.onerror = () => document.querySelector('#connectionStatus > span').textContent = 'An error occured';
// ws.onmessage = (message) => console.log(message);

const socket = io(url);
socket.on('connect', () => document.querySelector('#connectionStatus > span').textContent = 'Connected');
socket.on('disconnect', () => document.querySelector('#connectionStatus > span').textContent = 'Not Connected!');
socket.on('connect_error', document.querySelector('#connectionStatus > span').textContent = 'An connection error occured');
socket.on('error', () => document.querySelector('#connectionStatus > span').textContent = 'An error occured');


function Motor(id, DomNode) {
	this._node = DomNode;
	this._progress = this._node.querySelector('progress');
	this._id = id;
	this._intensity;
	this._timeout;

	this._node.addEventListener('mousedown', this.mouseDownHandler.bind(this));
	window.addEventListener('mouseup', this.mouseUpHandler.bind(this));
	this._node.previousElementSibling.addEventListener('click', () => this.decreaseBy(5));
	this._node.nextElementSibling.addEventListener('click', () => this.increaseBy(5));

	this.intensity = 50;
}

Object.defineProperties(Motor.prototype, {
	id: {
		get() {
			return this._id;
		}
	},
	intensity: {
		get() {
			return this._intensity;
		},
		set(value) {
			const tmp = clampValue(value, 0, 100);
			this._intensity = tmp;
			this._progress.value = tmp;
			this._progress.textContent = `${tmp}%`;
		}
	},
	pwm: {
		get() {
			const inputMin = 0;
			const inputMax = 100;
			const outputMin = 75;
			const outputMax = 255;
			return mapInputToOutputRange(this._intensity, inputMin, inputMax, outputMin, outputMax);
		}
	}
});

Motor.prototype.mouseDownHandler = function mouseDownHandler() {
	this.submit();
}

Motor.prototype.mouseUpHandler = function mouseUpHandler() {
	clearTimeout(this._timeout);
}

Motor.prototype.submit = function submit() {
	const payload = { type: 'VIBRATION', payload: `${this.id}=${this.pwm}` };
	socket.emit('message', JSON.stringify(payload));

	this._timeout = setTimeout(this.submit.bind(this), 250);
	// if (ws.readyState === ws.OPEN) {
	// 	ws.send(JSON.stringify(payload));
	// }
	// console.log(payload);
}

Motor.prototype.increaseBy = function increaseBy(val) {
	this.intensity += val;
}

Motor.prototype.decreaseBy = function decreaseBy(val) {
	this.intensity -= val;
}

const m0 = new Motor(0, document.getElementById('Herbert'));
const m1 = new Motor(1, document.getElementById('Willhelm'));
const m2 = new Motor(2, document.getElementById('Volker'));
const m3 = new Motor(3, document.getElementById('Dietmar'));
const m4 = new Motor(4, document.getElementById('Günther'));
const m5 = new Motor(5, document.getElementById('Albert'));
const m6 = new Motor(6, document.getElementById('Rufus'));
const m7 = new Motor(7, document.getElementById('Werner'));

console.log(m0);
