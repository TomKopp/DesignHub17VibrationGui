const mapInputToOutputRange = (val, inputMin, inputMax, outputMin, outputMax) => {
	return (outputMax - outputMin) * (val - inputMin) / (inputMax - inputMin) + outputMin;
};

const url = `ws://${window.location.hostname}:${window.location.port}`;
const ws = new WebSocket('ws://127.0.0.1:3000');

ws.onopen = () => document.querySelector('#connectionStatus > span').textContent = 'Connected';
ws.onclose = () => document.querySelector('#connectionStatus > span').textContent = 'Not Connected!';
ws.onerror = () => document.querySelector('#connectionStatus > span').textContent = 'An error occured';
ws.onmessage = (message) => console.log(message);


const Motor = function Motor(id, DomNode) {
	this._node = DomNode;
	this._progress = this._node.querySelector('progress');
	this._id = id;
	this._intensity;

	this._node.addEventListener('click', () => this.submit());
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
			this._intensity = value;
			this._progress.value = value;
			this._progress.textContent = `${value}%`;
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

Motor.prototype.submit = function submit() {
	const payload = { type: 'VIBRATION', payload: `${this.id}=${this.pwm}` };
	if (ws.readyState === ws.OPEN) {
		ws.send(JSON.stringify(payload));
	}
	console.log(payload);
}

Motor.prototype.increaseBy = function increaseBy(val) {
	this.intensity += val;
}

Motor.prototype.decreaseBy = function decreaseBy(val) {
	this.intensity -= val;
}

const m0 = new Motor(0, document.getElementById('motor0'));
const m1 = new Motor(1, document.getElementById('motor1'));
const m2 = new Motor(2, document.getElementById('motor2'));
const m3 = new Motor(3, document.getElementById('motor3'));
const m4 = new Motor(4, document.getElementById('motor4'));
const m5 = new Motor(5, document.getElementById('motor5'));
const m6 = new Motor(6, document.getElementById('motor6'));
const m7 = new Motor(7, document.getElementById('motor7'));

console.log(m0);
