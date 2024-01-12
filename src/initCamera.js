/* eslint-disable brace-style */
/* eslint-disable block-spacing */
/* eslint-disable arrow-parens */
/* eslint-disable semi */
/* eslint-disable comma-dangle */
/* eslint-disable object-curly-spacing */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
async function initCamera(video, width, height, fps) {
    const constraints = {
        audio: false,
        video: {
            facingMode: "user",
            width: width,
            height: height,
            frameRate: { max: fps }
        }
    }

    //   const video = document.querySelector("#pose-video")
    video.width = width;
    video.height = height;

    // get video stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    video.srcObject = stream

    return new Promise(resolve => {
        video.onloadedmetadata = () => { resolve(video) }
    })
}

export default initCamera;
