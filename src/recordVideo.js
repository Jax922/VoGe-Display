var elementToRecord = document.getElementById('chart-container');
var canvas2d = document.getElementById('background-canvas');
var context = canvas2d.getContext('2d');

canvas2d.width = elementToRecord.clientWidth;
canvas2d.height = elementToRecord.clientHeight;

var isRecordingStarted = false;
var isStoppedRecording = false;


(function looper() {
    if(!isRecordingStarted) {
        return setTimeout(looper, 500);
    }

    html2canvas(elementToRecord).then(function(canvas) {
        context.clearRect(0, 0, canvas2d.width, canvas2d.height);
        context.drawImage(canvas, 0, 0, canvas2d.width, canvas2d.height);

        if(isStoppedRecording) {
            return;
        }

        requestAnimationFrame(looper);
    });
})();

var recorder = new RecordRTC(canvas2d, {
    type: 'canvas'
});

function startRecording() {
    isStoppedRecording =false;
    isRecordingStarted = true;
    recorder.startRecording();
}

function stopRecording() {
    
    recorder.stopRecording(function() {
        isRecordingStarted = false;
        isStoppedRecording = true;
        var blob = recorder.getBlob();
        // window.open(URL.createObjectURL(blob));
          // 创建一个链接元素
        var a = document.createElement("a");
        // 利用blob创建一个临时的URL地址
        a.href = URL.createObjectURL(blob);
        // 指定下载文件名及其后缀
        a.download = "video.webm"; // 你可以根据实际情况更改文件名和后缀
        // 触发下载
        document.body.appendChild(a);
        a.click();
        // 清理
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
    });
    
}

export default {
    startRecording,
    stopRecording,
    recorder,
}