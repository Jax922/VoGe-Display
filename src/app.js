import initCamera from "./initCamera";
import gestureHandleMain from "./gesture/gestureRecognizer";
import getData from './getData';
import chartDisplay from './chart/chartDisplay';
import debugMain from './debug/debug';
import handleGesture from './handleGesture'
import handleVoice from './handleVoice'
import singalCenterHandleUnit from './signalProcessor'
import createLegend from './chart/renderLegend'
import setOption from './chart/chartSetOption'
import voiceGrammar from './voice/rules'
import bubbleVoiceGrammar from './voice/bubbleRule'
import controlsEvent from './controls'
import createTimeline from "./timeline";
import bubbleTimeline from "./bubbleTimeline";

const video = document.querySelector("#video")
const debug = new Stats();

const cameraConfig = {
    width: 1280,
    height: 720,
    fps: 60,
};

const pageState = {
  pageIndex: 0,
}

let pageOriginData = null;
let renderingMode = 'immediate';
let currentChartOptionData = null;
let viewOfStoryTimeline = null;

const nextPage = [
  "next page",
  "nextpage",
  "next slide",
  "nextslide"
]

const previousPage = [
  "previous page",
  "previouspage",
  "previous slide",
  "previousslide",
  "last page",
  "lastpage",
  "last slide",
  "lastslide"
]

// async function renderChart(uid, slide) {
//   try {
      
//       console.log("render", data);
//       chartDisplay(JSON.parse(data.pages[0].data));

//   } catch (error) {
//       console.error("Error fetching chart data:", error);
//   }
// }

function gestureCallback(myChart) {
  return (leftHandInfo, rightHandInfo) => {
    // if (est === null) {
    //   return;
    // }
    const action = handleGesture(myChart, leftHandInfo, rightHandInfo);
    // if (action) {
      singalCenterHandleUnit('gesture', action, {leftHandInfo, rightHandInfo}, {myChart, chartdata: JSON.parse(pageOriginData.pages[pageState.pageIndex].data), currentOption: currentChartOptionData});  
    // }
  }
}

function renderChart(option, myChart) {

    // render first page timeline
    console.log('pageOriginData.pages[pageState.pageIndex].data', pageOriginData.pages[pageState.pageIndex].data);
    let isBubble = JSON.parse(pageOriginData.pages[pageState.pageIndex].data).baseOption
    if (!isBubble) {
      viewOfStoryTimeline = createTimeline(pageOriginData.pages[pageState.pageIndex]);// create timeline info
    } else {
      viewOfStoryTimeline = bubbleTimeline.createTimeline(pageOriginData.pages[pageState.pageIndex]);// create timeline info
      myChart.on('timelinechanged', function (params) {
          if (params.currentIndex == 80) {
            myChart.dispatchAction({
              type: 'timelinePlayChange',
              playState: false,
            });
          }
      });
    }

    // save y axis range
    // saveYAxisRange();

  // check the rendering mode: progressive or immediate
  if (option.customOption && option.customOption.mode === 'progressive') {
    renderingMode = 'progressive';
    option.customOption["progress_step"] = 0;
    currentChartOptionData = {
      "customOption": {"x_axis_show": false,
                      "y_axis_show": false,
                      "legend_show": false,
                      "title_show": false,
                      "data_show": false}   
    }
  } else {
    renderingMode = 'immediate';
    currentChartOptionData = option;
    setOption(myChart, option);
    if (!isBubble) {
      createLegend(myChart);
    }
  }
}

function saveYAxisRange() {
  const pages = pageOriginData.pages;
  pages.forEach((page) => {
    if (page.data) {
      
      const chartOption = JSON.parse(page.data);
      if(chartOption.series && chartOption.series.length > 0) {
        let max = 0;
        let min = 0;
        chartOption.series.forEach((element) => {
          if (element.data && element.data.length > 0) {
            max = Math.max(max, Math.max(...element.data));
            min = Math.min(min, Math.min(...element.data));
          }
        })
        if (chartOption.yAxis) {
          chartOption.yAxis.max = max;
          chartOption.yAxis.min = min;
        } else {
          chartOption.yAxis = {
            max,
            min
          }
        }
      }
      page.data = JSON.stringify(chartOption);
    }
  })
  pageOriginData.pages = pages;
}

async function main() {
    
  
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has('model')) {
    alert('Cannot find aany slides in the query string.');
    return;
  }
  
  controlsEvent();
 

  // get data from firebase, and render chart
  pageOriginData = await getData(urlParams.get('userId'), urlParams.get('slide'));

  const myChart = chartDisplay();

  if (pageOriginData.pages[0].data) {
    const firstChartOptionData = JSON.parse(pageOriginData.pages[0].data);
    renderChart(firstChartOptionData, myChart);
  } else {
    alert('Cannot find any chart data in the query string.');
  }

 


  // init camera and start gesture recognition

  initCamera(video, cameraConfig.width, cameraConfig.height, cameraConfig.fps).then((video) =>{
    video.play();
    video.addEventListener('loadeddata', () => {
      gestureHandleMain(gestureCallback(myChart), true);
    })
    // video.addEventListener('play', () => {
    //   processVideo();
    // })
  });

  window.addEventListener('DOMContentLoaded', () => {
    
  });

// speech recognition
if ('webkitSpeechRecognition' in window) {
  console.log('Speech recognition supported');
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true; 
  // recognition.lang = 'cmn-Hans-CN';
  recognition.lang = 'en-US'; 
  recognition.interimResults = true; 

  recognition.start(); 

  let lastTimestamp = new Date().getTime(); 
  let lastTranscripts = [];

  recognition.onresult = function(event) {
      let transcript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      transcript = transcript.trim();
      transcript = transcript.toLowerCase();
      // handle numbers which are more than 1000
      const numberRegex = /(\d{1,3}(,\d{3})*(\.\d+)*)/g;
      transcript = transcript.replace(numberRegex, match => match.replace(/,/g, ''));

      if (!JSON.parse(pageOriginData.pages[pageState.pageIndex].data).baseOption) {
        voiceGrammar.basicParser(transcript, JSON.parse(pageOriginData.pages[pageState.pageIndex].data), currentChartOptionData, myChart, viewOfStoryTimeline);
      } else {
        // bubble chart
        bubbleVoiceGrammar.basicParser(transcript, JSON.parse(pageOriginData.pages[pageState.pageIndex].data), currentChartOptionData, myChart, viewOfStoryTimeline);
      }
      

      let isNextPage = nextPage.some(element => transcript.includes(element));
      if (isNextPage) {
        if (pageState.pageIndex < pageOriginData.pages.length - 1) {
          pageState.pageIndex += 1;
          myChart.clear();
          renderChart(JSON.parse(pageOriginData.pages[pageState.pageIndex].data), myChart);
        }
      }

      let isPreviousPage = previousPage.some(element => transcript.includes(element));
      if (isPreviousPage) {
        if (pageState.pageIndex > 0) {
          pageState.pageIndex -= 1;
          myChart.clear();
          renderChart(JSON.parse(pageOriginData.pages[pageState.pageIndex].data), myChart);
        }
      }

      document.getElementById('speech').innerHTML = interimTranscript.trim();



      // if (transcript.length > 0) {
      //   for (let i = 0; i < lastTranscripts.length; i++) {
      //     if (transcript.startsWith(lastTranscripts[i])) {
      //       transcript = transcript.slice(lastTranscripts[i].length);
      //       break;
      //     }
      //   }
      // }
      
      // console.log('Recognized text(now):', transcript);
      // console.log('Recognized text(int):', interimTranscript.trim());


      // console.log('Recognized text:', transcript.trim());
     

      // if (transcript.toLowerCase().includes("展示图表".toLowerCase())) {
      //   singalCenterHandleUnit('voice', 'show-chart', {},  {myChart, chartdata: JSON.parse(pageOriginData.pages[pageState.pageIndex].data), currentOption: currentChartOptionData});

      //   if (pageState.pageIndex < pageOriginData.pages.length - 1) {
      //     pageState.pageIndex += 1;
      //   }

      // }

      // if (transcript.toLowerCase().includes("展示图标".toLowerCase())) {

      //   singalCenterHandleUnit('voice', 'show-chart', {},  {myChart, chartdata: JSON.parse(pageOriginData.pages[pageState.pageIndex].data)});

      //   if (pageState.pageIndex < pageOriginData.pages.length - 1) {
      //     pageState.pageIndex += 1;
      //   }

      // }

      // if (transcript == '展示图表') {
      //   // singalCenterHandleUnit('voice', transcript, {});
      //   showChart.showChart(myChart, JSON.parse(pageOriginData.pages[pageState.pageIndex].data));
      // }
      // if (transcript == '开始展示图表') {
      //   pageState.pageIndex = 0;
      //   myChart.setOption(JSON.parse(pageOriginData.pages[pageState.pageIndex].data));
      // }

      // if (transcript == '隐藏图表') {
      //   myChart.clear();
      // }

      // if (transcript == '打开调试') {
      //   document.getElementById('debug-info').style.display = 'block';
      // }

      // if (transcript == '关闭调试') {
      //   document.getElementById('debug-info').style.display = 'none';
      // }


      // if (transcript == '展示x轴') {
      //   console.log('show x axis');
      //   singalCenterHandleUnit('voice', 'show-axis', {'axis': 'x'},  {myChart, chartdata: JSON.parse(pageOriginData.pages[pageState.pageIndex].data), currentOption: currentChartOptionData});
      // }

      // if (transcript == '展示X轴') {
      //   console.log('show x axis');
      //   singalCenterHandleUnit('voice', 'show-axis', {'axis': 'x'},  {myChart, chartdata: JSON.parse(pageOriginData.pages[pageState.pageIndex].data), currentOption: currentChartOptionData});
      // }

      // if (transcript == 'x轴') {
      //   console.log('show x axis');
      //   singalCenterHandleUnit('voice', 'show-axis', {'axis': 'x'},  {myChart, chartdata: JSON.parse(pageOriginData.pages[pageState.pageIndex].data), currentOption: currentChartOptionData});
      // }

      // if (transcript == 'X轴') {
      //   console.log('show x axis');
      //   singalCenterHandleUnit('voice', 'show-axis', {'axis': 'x'},  {myChart, chartdata: JSON.parse(pageOriginData.pages[pageState.pageIndex].data), currentOption: currentChartOptionData});
      // }

      // if (transcript == '上一页') {
      //   const currentTime = new Date().getTime();
      //   if (currentTime - lastTimestamp < 1000) {
      //     return;
      //   }
      //   lastTimestamp = currentTime;
      //   if (pageState.pageIndex > 0) {
      //     pageState.pageIndex -= 1;
      //     myChart.clear();
      //     myChart.setOption(JSON.parse(pageOriginData.pages[pageState.pageIndex].data));
      //   }
      // }

      // if (transcript == '下一页') {
      //   const currentTime = new Date().getTime();
      //   if (currentTime - lastTimestamp < 1000) {
      //     return;
      //   }
      //   lastTimestamp = currentTime;
      //   if (pageState.pageIndex < pageOriginData.pages.length - 1) {
      //     pageState.pageIndex += 1;
      //     myChart.clear();
      //     myChart.setOption(JSON.parse(pageOriginData.pages[pageState.pageIndex].data));
      //   }
      // }

  };

  recognition.onend = function() {
      console.log('Speech recognition service disconnected');
      recognition.start(); 
  };

  
} else {
  console.log('Speech recognition not supported');
}


}

main();
