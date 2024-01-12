
function tooltip(myChart, x, y, isShow) {
    const chartDom = document.getElementById('chartdom');
    const chartRect = chartDom.getBoundingClientRect();

    myChart.dispatchAction({
        type: isShow ? 'showTip' : 'hideTip',
        x: x-chartRect.left,
        y: y-chartRect.top,
    });
}

export default tooltip;