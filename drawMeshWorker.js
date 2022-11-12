self.importScripts('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');
self.importScripts('face_mesh.js');

function onResults(results) {
    const canvasCtx = canvasElement.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION,
                { color: '#C0C0C070', lineWidth: 1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: '#FF3030' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: '#FF3030' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, { color: '#FF3030' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: '#30FF30' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, { color: '#30FF30' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, { color: '#30FF30' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: '#E0E0E0' });
        }
    }
    canvasCtx.restore();
}

let canvasElement = null;
let currentStatus = null;

const statusEnum = {
    Init: 'init',
    Idle: 'idle',
    Running: 'running',
}

onmessage = async e => {
    switch (currentStatus) {
        case null:
            if (e.data?.canvas) {
                currentStatus = statusEnum.Init;
                canvasElement = e.data.canvas;
                currentStatus = statusEnum.Idle;
            }
            break;

        case statusEnum.Idle:
            if (e.data) {
                currentStatus = statusEnum.Running;
                onResults(results = { ...e.data });
                currentStatus = statusEnum.Idle;
            }
            break;

        case statusEnum.Init:
        case statusEnum.Running:
            //do nothing
            console.log(currentStatus, 'draw missed');
            break;

        default:
            break;
    }
}

