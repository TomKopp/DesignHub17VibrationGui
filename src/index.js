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



document.getElementById('switchEdgy').addEventListener('click', () => {
	socket.emit('bobble', JSON.stringify({ action: 'SWITCH_EDGY' }));
});

document.getElementById('playPause').addEventListener('click', () => {
	socket.emit('bobble', JSON.stringify({ action: 'PLAYPAUSE' }));
});



const segments = document.querySelectorAll('[data-segmentId]');
const motors = Array.from(segments).map((el) => new Motor(el.dataset.segmentid, el, socket));
