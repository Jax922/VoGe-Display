
function legendSelect(myChart, seriseName, isSelect) {

    myChart.dispatchAction({
        type: 'downplay',
    });

    _downplayLegend();

    if (!isSelect) {
        return;
    }

    seriseName = parseInt(seriseName);
    let dataLength = 0;
    if (myChart.getOption().series[seriseName] && myChart.getOption().series[seriseName].data) {
        dataLength = myChart.getOption().series[seriseName].data.length;
    }
    if (myChart.getOption().dataset && myChart.getOption().dataset[0].source) {
        dataLength = myChart.getOption().dataset[0].source.length-1;
    }
    if (dataLength === 0) {
        dataLength = 10;
    }

    const seriesIndex = Array(dataLength).fill(seriseName);
    const dataIndex = [...Array(dataLength).keys()];
    console.log(seriesIndex, dataIndex)

    for (let i = 0; i < seriesIndex.length; i++) {
        myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: seriesIndex[i],
            dataIndex: dataIndex[i],
        });
    }

    _highlightLegend(seriseName, true);

}

function _newRGB(rgba) {
    const result = /rgba\((\d{1,3}), (\d{1,3}), (\d{1,3}), .*\)/.exec(rgba);
    if (result) {
        const [r, g, b] = result.slice(1, 4);
        return `rgba(${r}, ${g}, ${b}, 0.8)`;
    }
    return rgba;
}

function _highlightLegend(seriesIndex, isHighlight) {
    const legendsItem = document.getElementsByClassName('legend-items');

    const legend = legendsItem[seriesIndex];

    console.log(legend.style.backgroundColor);

    if (isHighlight) {
        legend.style.border = '3px dashed #ccc';
    } else {
        legend.style.border = '';
    }
}

function _downplayLegend() {
    const legendsItem = document.getElementsByClassName('legend-items');

    for (let i = 0; i < legendsItem.length; i++) {
        legendsItem[i].style.border = '';
    }
}

export default legendSelect;