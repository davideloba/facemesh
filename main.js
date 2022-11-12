const videoElement = document.getElementsByTagName('video')[0];
const canvasElement = document.getElementsByTagName('canvas')[0];

let width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

let height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;


videoElement.width = width;
videoElement.height = height;
canvasElement.width = width;
canvasElement.height = height;


const getCaptureFrame = async () => {
    let bitmap = await createImageBitmap(videoElement);
    return bitmap;
}


// const canvasCtx = canvasElement.getContext('2d');
const offscreen = canvasElement.transferControlToOffscreen();

const drawMeshWorker = new Worker('drawMeshWorker.js');
drawMeshWorker.postMessage({ 'canvas': offscreen }, [offscreen]);

const onResults = results => {
    // console.log('data recived back!');
    drawMeshWorker.postMessage(results);
}

const faceMeshWorker = new Worker("faceMeshWorker.js");
faceMeshWorker.onmessage = async (e) => {
    if (e.data) onResults(e.data);
};

const camera = new Camera(videoElement, {
    onFrame: async () => {
        let image = await getCaptureFrame()
        faceMeshWorker.postMessage(image);
    },
    width: width,
    height: height
});
camera.start();
