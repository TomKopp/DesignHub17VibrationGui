function Motor(id, DomNode, socket) {
    this._node = DomNode;
    this._segment = this._node.querySelector('.segment');
    this._fill = this._node.querySelector('.fill');
    this._angle = DomNode.dataset.angle;
    this._id = id;
    this._socket = socket;
    this._intensity;
    this._timeout;

    this._segment.addEventListener('mousedown', this.mouseDownHandler.bind(this));
    window.addEventListener('mouseup', this.mouseUpHandler.bind(this));

    this._node.firstElementChild.addEventListener('click', () => this.decreaseBy(5));
    this._node.lastElementChild.addEventListener('click', () => this.increaseBy(5));

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
            this._fill.style['stroke-width'] = mapInputToOutputRange(tmp, 0, 100, 5, 150);
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
    this._fill.style.stroke = '#F24C47';
    this._socket.emit('bobble', JSON.stringify({ action: 'CHANGE_DIRECTION', payload: { angle: this._angle } }));

    this.submit();
}

Motor.prototype.mouseUpHandler = function mouseUpHandler() {
    this._fill.style.stroke = '#ECECEC';
    this._socket.emit('bobble', JSON.stringify({ action: 'STOP_DIRECTION'}));

    clearTimeout(this._timeout);
}

Motor.prototype.submit = function submit() {

    const payload = { action: 'VIBRATION', payload: `${this.id}=${this.pwm}` };
    this._socket.emit('message', JSON.stringify(payload));

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
