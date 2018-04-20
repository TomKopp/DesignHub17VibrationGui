const mapInputToOutputRange = (val, inputMin, inputMax, outputMin, outputMax) => {
	return (outputMax - outputMin) * (val - inputMin) / (inputMax - inputMin) + outputMin;
};

const ws = new WebSocket('ws://127.0.0.1:3000');


const Motor = function Motor(id, DomNode) {
	this._node = DomNode;
	this._progress = this._node.querySelector('progress');
	this._id = id;
	this._intensity = 0;

	this._node.addEventListener('click', () => this.submit());
}

Object.defineProperties(Motor.prototype, {
	id: {
		get: function () {
			return this._id;
		},
		set: undefined
	},
	intensity: {
		get: function () {
			return this._intensity;
		},
		set: function (value) {
			this._intensity = value;
			this._progress.value = value;
			this._progress.textContent = `${value}%`;
		}
	},
	pwm: {
		get: function () {
			const inputMin = 0;
			const inputMax = 100;
			const outputMin = 75;
			const outputMax = 255;
			return mapInputToOutputRange(this._intensity, inputMin, inputMax, outputMin, outputMax);
		},
		set: undefined
	}
});

Motor.prototype.submit = function submit() {
	if (ws.readyState === ws.OPEN) {
		ws.send(`${this.id}=${this.pwm}`);
	}
	console.log(`${this.id}=${this.pwm}`);
}


const bla = new Motor(1, document.getElementById('motor1'));

console.log(bla);
