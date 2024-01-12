import chartOperaionAPI from './chart/operationAPI';

function tooltipShow(myChart, hand, show) {
    let x = hand.keypoints[8].x;
    let y = hand.keypoints[8].y;
    chartOperaionAPI.tooltip(myChart, x, y, true);
}

function zoomHandle(myChart, leftHand, rightHand) {
    const chartDom = document.getElementById('chartdom');
    chartDom.style.cursor = 'zoom-in';
    const chartRect = chartDom.getBoundingClientRect();
    
    // chartDom.style.width = `${chartRect.width-400}px`;
    // myChart.resize();
    console.log(chartRect.width);
}

function handleGesture(myChart, leftHandInfo, rightHandInfo) {

    const priority = ['zoom',  'tooltip'];
    let action = null;

    //clear operations
    chartOperaionAPI.tooltip(myChart, 0, 0, false);
    // chartOperaionAPI.highlight(myChart, 0, 0, false);

    // point
    if (leftHandInfo.hand === null && rightHandInfo.hand === null) {
        return null;
    }

    if (rightHandInfo.hand && rightHandInfo.gesture === 'point') {
        action = 'point';
    }

    if (leftHandInfo.hand && leftHandInfo.gesture === 'point') {
        action = 'point';
    }

    // zoom
    if (leftHandInfo.hand &&  leftHandInfo.gesture === 'point' && rightHandInfo.hand && rightHandInfo.gesture === 'point') {
        action = 'zoom';
    }

    // twopoint
    if (rightHandInfo.hand && rightHandInfo.gesture === 'twopoint') {
        action = 'move';
    }

    if (leftHandInfo.hand && leftHandInfo.gesture === 'twopoint') {
        action = 'move';
    }

    // palm
    if (rightHandInfo.hand && rightHandInfo.gesture === 'palm') {
        action = 'move';
    }

    if (leftHandInfo.hand && leftHandInfo.gesture === 'palm') {
        action = 'move';
    }


    // switch (action) {
    //     case 'zoom':
    //         zoomHandle(myChart, leftHandInfo.hand, rightHandInfo.hand);
    //         break;
    //     case 'tooltip':
    //         tooltipShow(myChart, rightHandInfo.hand);
    //         break;
    //     default:
    //         break;
    // }

    return action;
}


export default handleGesture;