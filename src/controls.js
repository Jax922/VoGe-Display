
import recordVideo from "./recordVideo";

let mediaRecorder;
let recordedBlobs;
let startTime;
let recordInterval;
let canDraw = true;
let draw = null;

const video = document.getElementById('video');
const recordInfo = document.getElementById('record-info');
const recordTime = document.getElementById('record-time');
const startButton = document.getElementById('record-play');
const pauseButton = document.getElementById('recordButtonPause');
const stopButton = document.getElementById('record-stop');
const recordBtn = document.getElementById("recordButton");
const chartElem = document.getElementById('chart-container');

const timelineBtn = document.getElementById("timelineButton");
const svgElement = document.querySelectorAll('.icon-svg path');
const chartContainer = document.getElementById('chart-container');

let firstLegendCapture = true;
let legendCanvas = null

let chartContainerInfo = {};
let legendContainerInfo = [];


//  disappear gesture control
const disappearCheckedBtn = document.getElementById('disappear');

// if (localStorage.getItem('disappearGesture') === 'yes') {
//     disappearCheckedBtn.checked = true;
// } else {
//     disappearCheckedBtn.checked = false;
// }

// init
localStorage.setItem('disappearGesture', 'no');

disappearCheckedBtn.addEventListener('click', (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
        localStorage.setItem('disappearGesture', 'yes');
    } else {
        localStorage.setItem('disappearGesture', 'no');
    }
});
// ===============================


function _setSvgElementColor(color) {
    svgElement.forEach((elem) => {
        elem.style.fill = color;
    });

}

function controlsEvent(myChart) {
    const debugBtn = document.getElementById("debugButton");

    timelineBtn.addEventListener('click', () => {
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineContainer.style.display === 'block') {
            timelineContainer.style.display = 'none';
            timelineBtn.style.color = 'gray';
            _setSvgElementColor('gray');
        } else {
            timelineContainer.style.display = 'block';
            timelineBtn.style.color = '#80B2D6';
            _setSvgElementColor('#80B2D6');
        }
    });

    debugBtn.addEventListener('click', () => {
        const status = debugBtn.getAttribute('data-status');
        if (status === 'off') {
            debugBtn.setAttribute('data-status', 'on');
            debugBtn.style.color = '#80B2D6';
            document.getElementById('debug-info').style.display = 'block';
            localStorage.setItem('debugActive', 'true');
            document.querySelectorAll('.debug-point').forEach((elem) => {
                elem.style.display = 'block';
            });
        } else {
            debugBtn.setAttribute('data-status', 'off');
            debugBtn.style.color = 'gray';
            document.getElementById('debug-info').style.display = 'none';
            localStorage.setItem('debugActive', 'false');
            document.querySelectorAll('.debug-point').forEach((elem) => {
                elem.style.display = 'none';
            });
        }
    });

    recordBtn.addEventListener('click', () => {
        const status = recordBtn.getAttribute('data-status');
        if (status === 'off') {
            const userRes = confirm('Start to Record?');
            if (!userRes) {
                return;
            }
            recordBtn.setAttribute('data-status', 'on');
            // recordBtn.style.color = '#80B2D6';
            _countDown(myChart);
            // document.getElementById('record-info').style.display = 'block';
        } else {
            // recordBtn.setAttribute('data-status', 'off');
            // recordBtn.style.color = 'gray';
            // document.getElementById('record-info').style.display = 'none';
            const recordPlay = document.getElementById("record-play");
            const recordPause = document.getElementById("record-pause");
            const isOnGoing = recordBtn.getAttribute('record-status') === 'ongoing';
            if (isOnGoing) {
                // want to pause


            } else {
                // want to play
                pauseButton.style.display = 'flex';
                recordBtn.setAttribute('record-status', 'ongoing');
                recordBtn.style.display = 'none';
                mediaRecorder.resume();
                canDraw = true;
                requestAnimationFrame(draw); 
                startTime = Date.now() - (parseInt(recordTime.textContent) * 1000);
                recordInterval = setInterval(updateRecordTime, 1000);
                // captureVideoAndChart(myChart);
            }
            
            

            // 
        }
    });

    stopButton.addEventListener('click', () => {
        _recordStop();
    });

    pauseButton.addEventListener('click', () => {
        _recordPause();
        recordBtn.style.display = 'flex';
        pauseButton.style.display = 'none';
        recordBtn.setAttribute('record-status', 'pause');
        canDraw = false;
    })

}

function _countDown(myChart){
    var countdownElement = document.getElementById('countdown');
    var timeLeft = 5; 

    countdownElement.innerHTML = timeLeft;
    countdownElement.style.display = 'flex'; 

    var timer = setInterval(function() {
        timeLeft--;
        countdownElement.innerHTML = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            countdownElement.style.display = 'none';
            countdownElement.innerHTML = 5;
            _startRecord(myChart);
        }
    }, 1000);
}

function _startRecord(myChart) {
    const recordBtn = document.getElementById("recordButton");
    const pauseBtn = document.getElementById("recordButtonPause");
    recordBtn.style.display = 'none';
    recordBtn.setAttribute('have-record', 'yes');
    recordBtn.setAttribute('record-status', 'ongoing');
    // const recordPlay = document.getElementById("record-play");
    // const recordPause = document.getElementById("record-pause");
    const recordStop = document.getElementById("record-stop");
    const recordInfo = document.getElementById("record-info");

    // recordPlay.style.display = 'none';
    // recordPause.style.display = 'flex';
    pauseBtn.style.display = 'flex';

    recordInfo.style.display = 'flex';
    recordStop.style.display = 'flex';

    // _recordVideo(myChart);
    captureVideoAndChart(myChart);
}

async function _recordVideo(myChart) {
    // try {
        // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // video.srcObject = stream;

        // recordedBlobs = [];
        // mediaRecorder = new MediaRecorder(video.srcObject, { mimeType: 'video/webm' });

        // mediaRecorder.ondataavailable = (event) => {
        //     console.log("record--->", event);
        //     if (event.data && event.data.size > 0) {
        //         recordedBlobs.push(event.data);
        //     }
        // };

        // mediaRecorder.onerror = (event) => {
        //     console.error('MediaRecorder error:', event);
        // };

        // mediaRecorder.start(1000);
        // console.log('MediaRecorder started', mediaRecorder);
        recordVideo.startRecording();
        startTime = Date.now();
        recordInterval = setInterval(updateRecordTime, 1000);

        startButton.disabled = true;
        pauseButton.disabled = false;
        stopButton.disabled = false;
        recordInfo.style.display = 'block';
    // } catch (error) {
    //     console.error('Error accessing media devices:', error);
    // }
}

// function updateChartImage() {
//     const newDataURL = myChart.getDataURL();
//     if (newDataURL !== chartDataURL) {
//         chartDataURL = newDataURL;
//         chartImage.src = chartDataURL;
//     }
// }

function legendNeedToCapture(newChartContainerInfo, newLegendContainerInf) {
    const chartChanged = chartContainerInfo.width !== newChartContainerInfo.width || chartContainerInfo.height !== newChartContainerInfo.height || chartContainerInfo.left !== newChartContainerInfo.left || chartContainerInfo.top !== newChartContainerInfo.top;
    const legendChanged = legendContainerInfo.length !== newLegendContainerInf.length || legendContainerInfo.some((item, index) => { return item.border !== newLegendContainerInf[index].border; });

    return chartChanged || legendChanged;
}

async function captureLegendAndDrawOnCanvas(ctx) {
    const legendElement = document.getElementById('legend-container'); 

    if (!legendElement) {
        return;
    }


    const newChartContainerInfo = {
        width: chartContainerInfo.width,
        height: chartContainerInfo.height,
        left: chartContainerInfo.left,
        top: chartContainerInfo.top
    }

    const newLegendContainerInfo = [];
    const legendItems = document.getElementsByClassName('legend-items');
    for (let i = 0; i < legendItems.length; i++) {
        newLegendContainerInfo.push({
            border: legendItems[i].style.border
        });
     }

    const isChanged = legendNeedToCapture(newChartContainerInfo, newLegendContainerInfo);

    if (!isChanged && !firstLegendCapture) {
        return;
    }

    // update chartContainerInfo and legendContainerInfo
    chartContainerInfo = newChartContainerInfo;
    legendContainerInfo = newLegendContainerInfo;

    firstLegendCapture = false;
    
    legendCanvas = await html2canvas(legendElement, {
        backgroundColor: null,
    });

    const legendPosX = legendElement.offsetLeft;
    const legendPosY = legendElement.offsetTop;

    console.log("legendPosX--->", legendPosX);
    console.log("legendPosY--->", legendPosY);
    console.log("chartContainerInfo--->", chartContainerInfo);
    
}


async function captureVideoAndChart(myChart) {
    const canvas = document.createElement('canvas');
    canvas.width = video.offsetWidth; 
    canvas.height = video.offsetHeight; 
    const ctx = canvas.getContext('2d');

    const legendElement = document.getElementById('legend-container'); 

    chartContainerInfo = {
        width: chartContainer.offsetWidth,
        height: chartContainer.offsetHeight,
        left: chartContainer.offsetLeft,
        top: chartContainer.offsetTop
    };

    if (legendElement && legendElement.style.display !== 'none') {
        const legendItems = document.getElementsByClassName('legend-items');
        for (let i = 0; i < legendItems.length; i++) {
            legendContainerInfo.push({
                border: legendItems[i].style.border
            });
        }
    }

    let chartImage = new Image();
    let chartDataURL = ""; 

    function updateChartImage() {
        if (!myChart || !myChart.getOption()) {
            return;
        }
        const newDataURL = myChart.getDataURL();
        if (newDataURL !== chartDataURL) {
            chartDataURL = newDataURL;
            chartImage.src = chartDataURL;
        }
    }
    // const legendElement = document.getElementById('legend-container'); 

    const stream = canvas.captureStream();
    const audioStream = video.captureStream().getAudioTracks()[0];
    if (audioStream) {
        stream.addTrack(audioStream);
    }
    recordedBlobs = [];
    mediaRecorder  = new MediaRecorder(stream, { mimeType: 'video/webm' });

    console.log("audioStream--->", audioStream);

    mediaRecorder.ondataavailable = (event) => {
        console.log("record--->", event);
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    };

    mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
    };

    draw = function () {
        if (!canDraw) {
            return;
        }
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // ctx.restore();
        // let chartImage = new Image();

        captureLegendAndDrawOnCanvas(ctx);

        let legendOffsetTop = -120;
        if (legendElement && legendElement.offsetTop) {
            legendOffsetTop = legendElement.offsetTop;
        }

        if (legendCanvas) {
            ctx.drawImage(legendCanvas, chartContainer.offsetLeft, chartContainer.offsetTop+legendOffsetTop);
        }
        
        const windowWidth = window.innerWidth;
        const windowOffsetLeft = (windowWidth - 1280) / 2
        const leftValue = chartContainer.offsetLeft
        const topValue = chartContainer.offsetTop
        ctx.drawImage(chartImage, leftValue, topValue, chartContainer.offsetWidth, chartContainer.offsetHeight); 
        updateChartImage();
        // chartImage.onload = function() {  };
        // chartImage.src = myChart.getDataURL();
        requestAnimationFrame(draw); 
    }

    if (draw) {
        draw(); 
    }
    mediaRecorder.start(1);
    console.log('MediaRecorder started', mediaRecorder);
    startTime = Date.now();
    recordInterval = setInterval(updateRecordTime, 1000);

    startButton.disabled = true;
    pauseButton.disabled = false;
    stopButton.disabled = false;
    recordInfo.style.display = 'block';
}

function _recordPause() {
    if (mediaRecorder.state === 'recording') {
        mediaRecorder.pause();
        clearInterval(recordInterval);
    } else {
        mediaRecorder.resume();
        startTime = Date.now() - (parseInt(recordTime.textContent) * 1000);
        recordInterval = setInterval(updateRecordTime, 1000);
    }
}

function _recordStop() {
    mediaRecorder.stop();
    clearInterval(recordInterval);
    // video.srcObject = null;

    recordInfo.style.display = 'none';
    // startButton.style.display = 'flex';

    pauseButton.style.display = 'none';
    recordBtn.style.display = 'flex';
    recordBtn.style.color = 'gray';
    recordBtn.setAttribute('data-status', 'off');
    recordBtn.style.display = 'flex';
    recordTime.textContent = 0;
    stopButton.style.display = 'none';


    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recordedVideo.webm';
    document.body.appendChild(a);
    a.click();

    canDraw = true;

    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

function updateRecordTime() {
    const elapsedTime = Date.now() - startTime;
    recordTime.textContent = (elapsedTime / 1000).toFixed(0);
}

export default controlsEvent;