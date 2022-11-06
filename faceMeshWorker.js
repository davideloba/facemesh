self.importScripts("face_mesh.js");

let FmModel = null;
let currentStatus = null;

const statusEnum = {
    Init: 'init',
    Idle: 'idle',
    Running: 'running',
}


onmessage = async e => {
    // console.log(currentStatus);
    switch (currentStatus) {
        case null:
            currentStatus = statusEnum.Init
            FmModel = await getModel();
            currentStatus = statusEnum.Idle
            break;
        case statusEnum.Idle:
            if (e.data) {
                currentStatus = statusEnum.Running
                await FmModel.send({ image: e.data });
            }
            break;
        case statusEnum.Init:
        case statusEnum.Running:
            //do nothing
            console.log(currentStatus, 'frame lost');
            break;

        default:
            break;
    }
}

const onResults = results => {
    postMessage(results);
    currentStatus = statusEnum.Idle
}

async function getModel() {
    let facemesh = new FaceMesh({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
    });
    facemesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    facemesh.onResults(onResults);
    return facemesh;
}

