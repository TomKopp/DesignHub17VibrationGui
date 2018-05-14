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



// const startExample = () => socket.emit('message', JSON.stringify({ action: 'VIBRATION', payload: '0=75,77,79,83,88,97,113,140,182,255,182,140,113,97,88,83,79,77,75&1=75,77,79,83,88,97,113,140,182,255,182,140,113,97,88,83,79,77,75&2=75,77,79,83,88,97,113,140,182,255,182,140,113,97,88,83,79,77,75&3=75,77,79,83,88,97,113,140,182,255,182,140,113,97,88,83,79,77,75&4=75,77,79,83,88,97,113,140,182,255,182,140,113,97,88,83,79,77,75&5=75,77,79,83,88,97,113,140,182,255,182,140,113,97,88,83,79,77,75&6=75,77,79,83,88,97,113,140,182,255,182,140,113,97,88,83,79,77,75&7=75,77,79,83,88,97,113,140,182,255,182,140,113,97,88,83,79,77,75' }));
const switchEdgy = () => socket.emit('bobble', JSON.stringify({ action: 'SWITCH_EDGY' }));
const playPause = () => socket.emit('bobble', JSON.stringify({ action: 'PLAYPAUSE' }));

let isRecording = false;
const recording = (e) => {
	isRecording = !isRecording;
	socket.emit('message', JSON.stringify({ action: 'RECORDING', payload: isRecording }));
	if (isRecording) {
		e.currentTarget.style.color = '#F24C47';
	} else {
		e.currentTarget.style.color = '#FFF';
	}
}
const example = () => socket.emit('message', JSON.stringify({ action: 'EXAMPLE' }));
document.getElementById('recordExample').addEventListener('click', recording);
document.getElementById('recordExample').addEventListener('touchstart', recording);
document.getElementById('startExample').addEventListener('click', example);
document.getElementById('startExample').addEventListener('touchstart', example);
document.getElementById('switchEdgy').addEventListener('click', switchEdgy);
document.getElementById('switchEdgy').addEventListener('touchstart', switchEdgy);
document.getElementById('playPause').addEventListener('click', playPause);
document.getElementById('playPause').addEventListener('touchstart', playPause);



const segments = document.querySelectorAll('[data-segmentId]');
const motors = Array.from(segments).map((el) => new Motor(el.dataset.segmentid, el, socket));
