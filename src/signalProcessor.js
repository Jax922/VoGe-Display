
import _, { set } from 'lodash';
import chartOperaionAPI from './chart/operationAPI';
import createLegend from './chart/renderLegend';
import { init } from '@tensorflow/tfjs-backend-wasm/dist/backend_wasm';

let signalArray = [];
const longTouchTime = 1000; // long touch time
const signalWaitTime = 100; // wait 100ms to process signals
let timer = null;
let initMoveChartPosX = null;
let initMoveChartPosY = null;
let initMoveGesturePosX = null;
let initMoveGesturePosY = null;
let isMove = false;
let endMoveEventTimer = null;
let isZoom = false;
let initZoomHandPosition = {
    leftX: null,
    leftY: null,
    rightX: null,
    rightY: null,
};
let endZoomEventTimer = null;


// type: 'gesture' or 'voice'
// singalData: 
function singalCenterHandleUnit(type, action, singalData, state) {
    signalArray.push({ type, action, singalData });
    processSignals(state);
    if (!timer) {
        // timer = setTimeout(() => {
        //     processSignals(state);
        //     timer = null;
        // }, signalWaitTime);
    }

}

function processSignals(state) {
    const gestures = signalArray.filter((item) => item.type === 'gesture');
    const actionGestures = signalArray.filter((item) => item.action !== null);
    const nonActionGestures = signalArray.filter((item) => item.action === null);
    const voices = signalArray.filter((item) => item.type === 'voice');

    const pointGestures = actionGestures.filter(elem => elem.action === "point")

    if (actionGestures.length === 0 || pointGestures.length === 0) {
        localStorage.setItem('pointTouchTime', -1);
    }

    if (voices.length === 0) {
        if (actionGestures.length !== 0) {
            if (actionGestures[actionGestures.length - 1].action === "point") {

                if(localStorage.getItem('pointTouchTime') == -1) {
                    localStorage.setItem('pointTouchTime', new Date().getTime());
                    localStorage.setItem('pointHandInfo', JSON.stringify(actionGestures[0].singalData));
                }
            }
            _gestureHandleEntry(actionGestures, state);
        }
    } else if (gestures.length === 0) {
        _voiceHandleEntry(voices, state);
    } else {
        _multHandleEntry(gestures, voices, state);
    }

    // reset
    signalArray = []
}

// localStorage.setItem('pointTouchTime', new Date().getTime());
// ========= gestures =========
function _gestureHandleEntry(gestures, state) {
    switch (gestures[gestures.length - 1].action) {
        case 'point':
            _pointHandle(gestures[0].singalData, state);
            break;
        case 'move':
            _moveHandle(gestures[0].singalData, state);
        case 'zoom':
            console.log('zoom');
            _zoomHandle(gestures[0].singalData, state);
        default:
            break;
    }

}

// is in chart area
function isInChartArea(x, y) {
    const chartContainer = document.getElementById('chart-container');
    const chartRect = chartContainer.getBoundingClientRect();
    const left = chartRect.left - 20;
    const top = chartRect.top - 70;
    const right = chartRect.right + 20;
    const bottom = chartRect.bottom + 20;
    if (x >= left && x <= right && y >= top && y <= bottom) {
        return true;
    }
    return false;
}

// is in legend area
function isInLegendArea(x, y) {
    const legendContainer = document.getElementById('legend-container');
    if (!legendContainer) {
        return false;
    }
    const legendRect = legendContainer.getBoundingClientRect();
    if (x >= legendRect.left && x <= legendRect.right && y >= legendRect.top && y <= legendRect.bottom) {
        return true;
    }
    return false;
}

// pointing event
function _pointHandle({ leftHandInfo, rightHandInfo }, state) {
    const myOption = state.myChart.getOption();
    const hand = leftHandInfo.hand || rightHandInfo.hand;
    const leftHand = leftHandInfo.hand;
    const rightHand = rightHandInfo.hand;
    let xLeft = -1000;
    let yLeft = -1000;
    let xRight = -1000;
    let yRight = -1000;
    if (leftHand) {
        xLeft = leftHand.keypoints[8].x;
        yLeft = leftHand.keypoints[8].y;
    }
    if (rightHand) {
        xRight = rightHand.keypoints[8].x;
        yRight = rightHand.keypoints[8].y;
    }

    // handle for clear chart
    if (leftHandInfo.gesture === 'palm' && rightHandInfo.gesture === 'palm') {
        if (leftHandInfo.hand && rightHandInfo.hand) {
            let distance = Math.sqrt((xLeft - xRight) * (xLeft - xRight) + (yLeft - yRight) * (yLeft - yRight));
            console.log("palm distance", distance);
            if (distance < 100) {
                state.myChart.clear();
            }
        }
    }

    let nowTouchTime = new Date().getTime();
    let pointTouchTime = -1;
    if (localStorage.getItem('pointTouchTime') != -1) {
        pointTouchTime =  nowTouchTime - localStorage.getItem('pointTouchTime');
    } 



    // handle for clear chart
    console.log("palm touch time", pointTouchTime);
    if (pointTouchTime <= longTouchTime) {
        const lastPointHandInfo = JSON.parse(localStorage.getItem("pointHandInfo"));
        if (leftHandInfo.gesture === 'palm' && leftHandInfo.hand ) {
            console.log("left x", xLeft, "left y", yLeft)
            if (xLeft < 10) {
                state.myChart.clear();
            }
            // let moveOffsetX1 = 0
            // let moveOffsetY1 = 0

            // if (leftHand && lastPointHandInfo.leftHandInfo.gesture && lastPointHandInfo.leftHandInfo.hand) {
            //     moveOffsetX1 = xLeft - lastPointHandInfo.leftHandInfo.hand.keypoints[8].x;
            //     moveOffsetY1 = yLeft - lastPointHandInfo.leftHandInfo.hand.keypoints[8].y;
            // }
            // let distance1 = Math.sqrt(moveOffsetX1*moveOffsetX1 + moveOffsetY1*moveOffsetY1);
            // console.log("distance1", distance1)
            // if (distance1 > 400) {
            //     // alert()
            //     // state.myChart.clear();
            // }

        }

        if (rightHandInfo.gesture === 'palm' && rightHandInfo.hand) {
            console.log("right x", xRight, "right y", yRight)
            // let moveOffsetX2 = 0
            // let moveOffsetY2 = 0
            // if (rightHand && lastPointHandInfo.rightHandInfo.gesture && lastPointHandInfo.rightHandInfo.hand) {
            //     moveOffsetX2 = xRight - lastPointHandInfo.rightHandInfo.hand.keypoints[8].x;
            //     moveOffsetY2 = yRight - lastPointHandInfo.rightHandInfo.hand.keypoints[8].y;
            // }
            // let distance2 = Math.sqrt(moveOffsetX2*moveOffsetX2 + moveOffsetY2*moveOffsetY2);
            // console.log("distance2", distance2)
            // if (distance2 > 400) {
            //     // alert()
            //     // state.myChart.clear();
            // }
            if (xRight > 1270) {
                state.myChart.clear();
            }
        }
    }




    
    
    // if point touch time over long touch time 
    if (pointTouchTime > longTouchTime) {
        


        // if (distance1 > 50 || distance2 > 50) {
        //     _moveHandle({ leftHandInfo, rightHandInfo }, state);
        // }

        if (rightHand && leftHand && lastPointHandInfo.leftHandInfo.hand && lastPointHandInfo.rightHandInfo.hand) {
            // let distance = Math.sqrt((xLeft - xRight) * (xLeft - xRight) + (yLeft - yRight) * (yLeft - yRight));
            // if (distance > 100) {
                _zoomHandle({ leftHandInfo, rightHandInfo }, state);
            // }

        } else {
            _moveHandle({ leftHandInfo, rightHandInfo }, state)
        }
       
    }

    const isInChartLeft = isInChartArea(xLeft, yLeft);
    const isInChartRight = isInChartArea(xRight, yRight);
    const isInLegendLeft = isInLegendArea(xLeft, yLeft);
    const isInLegendRight = isInLegendArea(xRight, yRight);

    // two hands highlight
    if (isInChartLeft && isInChartRight) {
        _highlight(state.myChart, myOption, [leftHand,rightHand]);
        return;
    }

    // left hand
    if (isInLegendLeft) {
        _legendSelect(xLeft, yLeft, state.myChart);
    } else {
        _unLegendSelect(state.myChart);
    }

    if (isInChartLeft) {
        _tooltipShow(state.myChart, leftHand, true);
        _highlight(state.myChart, myOption, [leftHand]);
    }

    // right hand
    if (isInLegendRight) {
        _legendSelect(xRight, yRight, state.myChart);
    }
    if (isInChartRight) {
        _tooltipShow(state.myChart, rightHand, true);
        _highlight(state.myChart, myOption, [rightHand]);
    }
}

function _tooltipShow(myChart, hand, show) {
    let x = hand.keypoints[8].x;
    let y = hand.keypoints[8].y;
    chartOperaionAPI.tooltip(myChart, x, y, true);
}

function _highlight(myChart, myOption, hands) {
    // console.log('echartsCoord', seriesIndex);
    // handle highlight
    let seriesIdxs = []
    let dataIdxs = []

    if (!myOption){
        return;
    }
    const chartContainer = document.getElementById('chart-container');
    const chartRect = chartContainer.getBoundingClientRect();

    for (let i = 0; i < myOption.series.length; i++) {
        hands.forEach((hand) => {
            let temp = myChart.convertFromPixel({ seriesIndex: i }, [hand.keypoints[8].x - chartRect.left, hand.keypoints[8].y]);
            if (temp) {
                seriesIdxs.push(i);
                dataIdxs.push(temp[0]);
            }
        })
    }

    if(seriesIdxs.length > 0 || dataIdxs.length > 0) {
        chartOperaionAPI.highlight(myChart, seriesIdxs, dataIdxs, true);
    }
}


function _legendSelect(x, y, myChart, seriesName) {
    const selectName = "";
    const legendItemsDom = document.getElementsByClassName("legend-items");

    for (let i = 0; i < legendItemsDom.length; i++) {
        let rect = legendItemsDom[i].getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            seriesName = legendItemsDom[i].getAttribute("data-name");
            break;
        }
    }

    if (seriesName === "" || !seriesName) {
        return;
    }

    chartOperaionAPI.legendSelect(myChart, seriesName, true);
}

function _unLegendSelect(myChart) {
    chartOperaionAPI.legendSelect(myChart, 0, false);
}

function _moveHandle({ leftHandInfo, rightHandInfo }, state) {
    
    const hand = leftHandInfo.hand || rightHandInfo.hand;
    let x = null;
    let y = null;

    if (hand) {
        x = hand.keypoints[8].x;
        y = hand.keypoints[8].y;
    } else {
        return;
    }
    const isInChartLeft = isInChartArea(x, y);

    if(!isInChartLeft) {
        return;
    }

    const chartContainer = document.getElementById('chart-container');
    const chartRect = chartContainer.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const chartWidth = chartContainer.offsetWidth;
    const chartHeight = chartContainer.offsetHeight;
    const legendContainer = document.getElementById('legend-container');

    let legendWidth = 0;
    let legendHeight = 0;
    if (legendContainer) {
        const legendRect = legendContainer.getBoundingClientRect();
        legendWidth = legendContainer.offsetWidth;
        legendHeight = legendContainer.offsetHeight;
    }
    
    if (!isMove) {
        initMoveGesturePosX = x;
        initMoveGesturePosY = y;
        initMoveChartPosX = chartRect.left;
        initMoveChartPosY = chartRect.top;
        setTimeout(() => {
            isMove = true;
        }, 300);
    } else {
        const offsetX = x - initMoveGesturePosX;
        const offsetY = y - initMoveGesturePosY;

        let newLeft = initMoveChartPosX + offsetX;
        let newTop = initMoveChartPosY + offsetY;

        console.log(newLeft, newTop);

        if (newLeft < 0) {
            newLeft = 0;
        }

        if (newLeft > (1300 - chartWidth )) {
            newLeft = 1300 - chartWidth;
        }

        if (newTop < (10 + legendHeight)) {
            newTop = 10 + legendHeight;
        }

        if (newTop > (720 - chartHeight)) { 
            newTop = 720 - chartHeight;
        }

        chartContainer.style.left = `${newLeft}px`;
        chartContainer.style.top = `${newTop}px`;

        endMoveEventTimer && clearTimeout(endMoveEventTimer);
        endMoveEventTimer = setTimeout(() => {
            isMove = false;
        }, 500);
    }
}

// zoom event
function _zoomHandle({ leftHandInfo, rightHandInfo }, state) {
    const leftHand = leftHandInfo.hand;
    const rightHand = rightHandInfo.hand;

    if (!leftHand || !rightHand) {
        return;
    }

    // const isInChartLeft = isInChartArea(leftHand.keypoints[8].x, leftHand.keypoints[8].y);
    // const isInChartRight = isInChartArea(rightHand.keypoints[8].x, rightHand.keypoints[8].y);

    // if(!isInChartLeft || !isInChartRight) {
    //     return;
    // }

    if(!isZoom) {
        initZoomHandPosition.leftX = leftHand.keypoints[8].x;
        initZoomHandPosition.leftY = leftHand.keypoints[8].y;
        initZoomHandPosition.rightX = rightHand.keypoints[8].x;
        initZoomHandPosition.rightY = rightHand.keypoints[8].y;
        // setTimeout(() => {
        //     isZoom = true;
        // }, 1000);
        isZoom = true;
    } else {
        const leftX = leftHand.keypoints[8].x;
        const leftY = leftHand.keypoints[8].y;
        const rightX = rightHand.keypoints[8].x;
        const rightY = rightHand.keypoints[8].y;

        const initDistance = Math.sqrt(Math.pow(initZoomHandPosition.leftX - initZoomHandPosition.rightX, 2) + Math.pow(initZoomHandPosition.leftY - initZoomHandPosition.rightY, 2));
        const currentDistance = Math.sqrt(Math.pow(leftX - rightX, 2) + Math.pow(leftY - rightY, 2));

        const initDistanceX = Math.abs(initZoomHandPosition.leftX - initZoomHandPosition.rightX);
        const initDistanceY = Math.abs(initZoomHandPosition.leftY - initZoomHandPosition.rightY);
        const currentDistanceX = Math.abs(leftX - rightX);
        const currentDistanceY = Math.abs(leftY - rightY);

        let scaleX = currentDistanceX / initDistanceX;
        let scaleY = currentDistanceY / initDistanceY;

        console.log(scaleX, scaleY);

        if (scaleX < 0.8) {
            scaleX = 0.8;
        }

        if (scaleX > 1.2) {
            scaleX = 1.2;
        }

        const chartContainer = document.getElementById('chart-container');
        const chartDom = document.getElementById('chartdom');
        const chartRect = chartContainer.getBoundingClientRect();
        const chartWidth = chartContainer.offsetWidth;
        const chartHeight = chartContainer.offsetHeight;

        let newWidth = chartWidth * scaleX;
        let newHeight = chartHeight * scaleY;


        if (newWidth > 2000) {
            newWidth = 2000;
        }

        if (newHeight > 720) {
            newHeight = 720;
        }

        const newLeft = chartRect.left - (newWidth - chartWidth) / 2;
        const newTop = chartRect.top - (newHeight - chartHeight) / 2;

        if (newWidth < 400) {
            newWidth = 400;
        }

        chartContainer.style.left = `${newLeft}px`;
        // chartContainer.style.top = `${newTop}px`;
        chartContainer.style.width = `${newWidth}px`;
        // chartContainer.style.height = `${newHeight}px`;

        chartDom.style.width = `${newWidth}px`;
        state.myChart.resize();
        // chartDom.style.height = `${adjustedPosAndSize.height}px`;

        endZoomEventTimer && clearTimeout(endMoveEventTimer);
        endZoomEventTimer = setTimeout(() => {
            isZoom = false;
        }, 300);
    }
   
}

// ========= voices =========
function _voiceHandleEntry(voices, state) {
    // switch (voices[voices.length - 1].action) {
    //     case 'show-axis':
    //         _showAxis(voices[voices.length - 1].singalData, state);
    //         break;
    //     default:
    //         break;
    // }
}

// function _showAxis({ axis }, state) {
//     console.log('show-axis', axis);
// }

// ========= mult =========
function _multHandleEntry(gestures, voices, state) {
    
    if(_showAxis(voices, state)) {
        return;
    }
    



    if (voices[voices.length - 1].action === 'show-chart') {
        const pointGestures = gestures.filter((item) => item.action === 'point');
        if (pointGestures.length > 0) {
            _showChart(pointGestures, voices, state, 'point');
        } else {
            _showChart(gestures, voices, state, 'non-point');
        }

    }
}


function _showChart(gestures, voices, state, type) {
    state.myChart.clear();
    const chartContainer = document.getElementById('chart-container');
    const chartDom = document.getElementById('chartdom');
    let gestureData = null

    for (let i = gestures.length - 1; i >= 0; i--) {
        if (gestures[i].singalData.leftHandInfo.hand !== null || gestures[i].singalData.rightHandInfo.hand !== null) {
            gestureData = gestures[i].singalData;
            break;
        }
    }


    console.log(gestureData);

    let chartPosX = 0;
    let chartPosY = 0;

    // no hands
    if (gestureData === null) {
        state.myChart.setOption(state.chartdata);
        createLegend(state.myChart);
        return;
    }


    if (type === 'point') {
        if (gestureData.leftHandInfo.hand && gestureData.leftHandInfo.gesture === 'point') {
            chartPosX = gestureData.leftHandInfo.hand.keypoints[8].x;
            chartPosY = gestureData.leftHandInfo.hand.keypoints[8].y;
        }

        if (gestureData.rightHandInfo.hand && gestureData.rightHandInfo.gesture === 'point') {
            chartPosX = gestureData.rightHandInfo.hand.keypoints[8].x;
            chartPosY = gestureData.rightHandInfo.hand.keypoints[8].y;
        }
    }

    if (type === 'non-point') {
        if (gestureData.leftHandInfo.hand && gestureData.rightHandInfo.hand) {
            // two hands show a chart
            chartPosX = gestureData.leftHandInfo.hand.keypoints[12].x;
            const leftDistance2Top = gestureData.leftHandInfo.hand.keypoints[12].y;
            const rightDistance2Top = gestureData.rightHandInfo.hand.keypoints[12].y;
            chartPosY = leftDistance2Top > rightDistance2Top ? rightDistance2Top : leftDistance2Top;
            // if (Math.abs(leftDistance2Top - rightDistance2Top) > 300) {
            //     chartPosY = leftDistance2Top > rightDistance2Top ? rightDistance2Top : leftDistance2Top;
            // } else { 
            //     chartPosY = ;
            // }
            let chartWidth = gestureData.rightHandInfo.hand.keypoints[12].x - gestureData.leftHandInfo.hand.keypoints[12].x;
            let chartHeight = gestureData.rightHandInfo.hand.keypoints[12].y - gestureData.rightHandInfo.hand.keypoints[0].y;

            // adjust the width and height
            if (chartHeight < 300) {
                chartHeight = 300;
            }

            // adjust the x,y
            if (window.innerHeight - chartPosY < chartHeight) {
                chartPosY = window.innerHeight - chartHeight - 50;
            }

            // show chart by steps
            chartContainer.style.left = `${chartPosX}px`;
            chartContainer.style.top = `${chartPosY}px`;
            chartContainer.style.width = `${chartWidth}px`;
            chartContainer.style.height = `${chartHeight}px`;
            chartDom.style.width = `${chartWidth}px`;
            chartDom.style.height = `${chartHeight}px`;
            state.myChart.resize();
            state.myChart.setOption(state.chartdata);
            createLegend(state.myChart);

            return;

        } else {
            const oneHand = gestureData.leftHandInfo.hand || gestureData.rightHandInfo.hand;
            chartPosX = oneHand.keypoints[9].x;
            chartPosY = oneHand.keypoints[9].y;
        }
    }

    const adjustedPosAndSize = _computeDynamicPositionAndChartSize(chartPosX, chartPosY);

    // show chart by steps
    chartContainer.style.left = `${adjustedPosAndSize.x}px`;
    chartContainer.style.top = `${adjustedPosAndSize.y}px`;
    chartContainer.style.width = `${adjustedPosAndSize.width}px`;
    chartContainer.style.height = `${adjustedPosAndSize.height}px`;
    chartDom.style.width = `${adjustedPosAndSize.width}px`;
    chartDom.style.height = `${adjustedPosAndSize.height}px`;
    state.myChart.resize();
    state.myChart.setOption(state.chartdata);
    createLegend(state.myChart);
}

function _computeDynamicPositionAndChartSize(x, y) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const rate = 0.5;

    const centerWidth = 100;
    const centerHeight = 50;

    const centerArea = {
        minX: centerX - centerWidth,
        maxX: centerX + centerWidth,
        minY: centerY - centerHeight,
        maxY: centerY + centerHeight,
    }

    console.log(centerArea);
    console.log(x, y);

    // is in center area
    if (x >= centerArea.minX && x <= centerArea.maxX && y >= centerArea.minY && y <= centerArea.maxY) {
        let width = window.innerWidth * rate;
        let height = window.innerHeight * rate;
        console.log('center')
        return {
            x: (window.innerWidth - width) / 2,
            y: (window.innerHeight - height) / 2,
            width,
            height,
        }

    }

    // is in left-top area
    if (x < centerX && y < centerY) {
        console.log('left-top')
        return {
            x: x,
            y: y,
            width: window.innerWidth * rate,
            height: window.innerHeight * rate,
        }
    }

    // is in right-top area
    if (x > centerX && y < centerY) {
        console.log('right-top')
        return {
            x: x,
            y: y,
            width: window.innerWidth - 50 - x,
            height: window.innerHeight * rate,
        }
    }

    // is in left-bottom area
    if (x < centerX && y > centerY) {
        console.log('left-bottom')
        return {
            x: x,
            y: y - window.innerHeight * rate,
            width: window.innerWidth * rate,
            height: window.innerHeight * rate,
        }
    }

    // is in right-bottom area
    if (x > centerX && y > centerY) {
        console.log('right-bottom')
        return {
            x: x - window.innerWidth * rate,
            y: y - window.innerHeight * rate,
            width: window.innerWidth * rate,
            height: window.innerHeight * rate,
        }
    }


}

function _showAxis(voices, state) {
    const showAxis = voices.filter((item) => item.action === 'show-axis');
    if (showAxis.length > 0) {

        console.log(voices);
        console.log(state);

        _renderChart(state.myChart, state.chartdata, state.currentOption, 'xAxis');

        return true;
    }
    return false;
}

// rendering chart
function _renderChart(myChart, option, currentOption, key=null) {
    // check the rendering mode: progressive or immediate
    console.log(option);
  if (option.customOption && option.customOption.mode === 'progressive') {
    if (key !== null && option.baseOption && option.baseOption[key]) {
      // progressive rendering
      currentOption[key] = option.baseOption[key];
      myChart.setOption(currentOption);
      createLegend(myChart);
    }
    
  } else {

    setOption(myChart, JSON.parse(pageOriginData.pages[0].data));
    createLegend(myChart);
  }
}




export default singalCenterHandleUnit;
