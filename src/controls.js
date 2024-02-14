let mediaRecorder;
let recordedBlobs;
let startTime;
let recordInterval;

const video = document.getElementById('video');
const recordInfo = document.getElementById('record-info');
const recordTime = document.getElementById('record-time');
const startButton = document.getElementById('record-play');
const pauseButton = document.getElementById('record-pause');
const stopButton = document.getElementById('record-stop');
const recordBtn = document.getElementById("recordButton");

const timelineBtn = document.getElementById("timelineButton");

function controlsEvent() {
    const debugBtn = document.getElementById("debugButton");

    timelineBtn.addEventListener('click', () => {
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineContainer.style.display === 'block') {
            timelineContainer.style.display = 'none';
            timelineBtn.style.color = 'gray';
        } else {
            timelineContainer.style.display = 'block';
            timelineBtn.style.color = '#0056b3';
        }
    });

    debugBtn.addEventListener('click', () => {
        const status = debugBtn.getAttribute('data-status');
        if (status === 'off') {
            debugBtn.setAttribute('data-status', 'on');
            debugBtn.style.color = '#0056b3';
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
            recordBtn.style.color = '#0056b3';
            _countDown();
            
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
                recordPlay.style.display = 'flex';
                recordPause.style.display = 'none';
                recordBtn.setAttribute('record-status', 'pause');
                _recordPause();
            } else {
                // want to play
                recordPlay.style.display = 'none';
                recordPause.style.display = 'flex';
                recordBtn.setAttribute('record-status', 'ongoing');
                _recordPause();
            }
            

            // 
        }
    });

    stopButton.addEventListener('click', () => {
        _recordStop();
    });

}

function _countDown(){
    var countdownElement = document.getElementById('countdown');
    var timeLeft = 10; 

    countdownElement.innerHTML = timeLeft;
    countdownElement.style.display = 'flex'; 

    var timer = setInterval(function() {
        timeLeft--;
        countdownElement.innerHTML = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            countdownElement.style.display = 'none';
            countdownElement.innerHTML = 10;
            _startRecord();
        }
    }, 1000);
}

function _startRecord() {
    const recordBtn = document.getElementById("recordButton");
    recordBtn.setAttribute('have-record', 'yes');
    recordBtn.setAttribute('record-status', 'ongoing');
    const recordPlay = document.getElementById("record-play");
    const recordPause = document.getElementById("record-pause");
    const recordStop = document.getElementById("record-stop");
    const recordInfo = document.getElementById("record-info");

    recordPlay.style.display = 'none';
    recordPause.style.display = 'flex';

    recordInfo.style.display = 'flex';
    recordStop.style.display = 'flex';

    _recordVideo();
}

async function _recordVideo() {
    // try {
        // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // video.srcObject = stream;

        recordedBlobs = [];
        mediaRecorder = new MediaRecorder(video.srcObject, { mimeType: 'video/webm' });

        mediaRecorder.ondataavailable = (event) => {
            console.log("record--->", event);
            if (event.data && event.data.size > 0) {
                recordedBlobs.push(event.data);
            }
        };

        mediaRecorder.onerror = (event) => {
            console.error('MediaRecorder error:', event);
        };

        mediaRecorder.start(1000);
        console.log('MediaRecorder started', mediaRecorder);
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
    startButton.style.display = 'flex';
    pauseButton.style.display = 'none';
    recordBtn.style.color = 'gray';
    recordBtn.setAttribute('data-status', 'off');
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