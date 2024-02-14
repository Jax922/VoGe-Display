import setOption from "../chart/chartSetOption";
import createLegend from "../chart/renderLegend";
import updateTimelineStatus from "./updateTimelineStatus";
import updateTimelineStatusImmediate from "./updateTimelineStatusImmdiate";
import chartOperaionAPI from "../chart/OperationAPI";


const xAxis = [
    "x axis",
    "x-axis",
    "horizontal axis",
    "horizontal"
]

const yAxis = [
    "y axis",
    "y-axis",
    "vertical axis",
    "vertical"
] // todo axis name

const dataElemContext = [
    "detail data",
    "detailed data",
]

const nextPage = [
    "next page",
    "nextpage",
    "next slide",
    "nextslide"
]

const defaultYAxis = {
    "type": "value",
    "axisLine": {
        "show": false
    },
    "axisTick": {
        "show": false
    },
    "axisLabel": {
        "show": false
    },
    "splitLine": {
        "show": false
    }
}

const defaultXAxis = {
    "axisLine": {
        "show": false
    },
    "axisTick": {
        "show": false
    },
    "axisLabel": {
        "show": false
    },
    "splitLine": {
        "show": false
    }
}

let dataElems = {};
let xLabels = [];
let yLabels = [];

function basicParser(text, chartOriginOption, chartCurrentOption, myChart, viewOfStoryTimeline) {

    if (!text) {
        return;
    }

    _updateKeyWords(chartOriginOption);

    dataElems = _createDataElem(chartOriginOption);
    
    const labels = _createLabels(chartOriginOption);
    xLabels = labels.xLabels;
    yLabels = labels.yLabels;

    chartCurrentOption.customOption = chartCurrentOption.customOption || {};

    if (!chartCurrentOption.customOption["voiceContext"]) {
        chartCurrentOption.customOption["voiceContext"] = "Unknown";
        if (chartOriginOption.customOption.mode === "immediate") {
            chartCurrentOption.customOption["voiceContext"] = "data-elem";
        }
    }

    chartCurrentOption = _checkContext(text, chartCurrentOption);
    
    if (chartCurrentOption.customOption["voiceContext"] === "none") {
        _nonContextInteraction(text, chartOriginOption, chartCurrentOption, myChart);
    }

    if (chartCurrentOption.customOption["voiceContext"] === "x-axis") {
        if (localStorage.getItem("xAxisMode") == "splitAxis") {
            if(chartCurrentOption.xAxis && chartCurrentOption.xAxis.axisLine && chartCurrentOption.xAxis.axisLine.show) {
                // have show the axis line
                _isShowXAxisLabel(text, chartOriginOption, chartCurrentOption, myChart)
            } else {
                // have not show the axis line
                _set_x_axis_show_with_context(chartOriginOption, chartCurrentOption, myChart);
            }
        } else {
            // directly show the axis line and ticks
            _set_x_axis_show(chartOriginOption, chartCurrentOption, myChart);
        }
        
        createLegend(myChart);
    }

    if (chartCurrentOption.customOption["voiceContext"] === "y-axis") {
        if (localStorage.getItem("yAxisMode") == "splitAxis") {
            if(chartCurrentOption.yAxis && chartCurrentOption.yAxis.axisLine && chartCurrentOption.yAxis.axisLine.show) {
                // have show the axis line
                _isShowYAxisLabel(text, chartOriginOption, chartCurrentOption, myChart);
            } else {
                // have not show the axis line
                _set_y_axis_show_with_context(chartOriginOption, chartCurrentOption, myChart);
            }
        } else {
            // directly show the axis line and ticks
            _set_y_axis_show(chartOriginOption, chartCurrentOption, myChart);
        }   

        // _set_y_axis_show_with_context(chartOriginOption, chartCurrentOption, myChart);
        createLegend(myChart);
    }

    if (chartCurrentOption.customOption["voiceContext"] === "data-elem") {
         // show data elements detection
        let showDataElem = _isDataElemExist(chartCurrentOption, text, myChart);

        if (showDataElem.length > 0) {
            _showDataElements(chartOriginOption, chartCurrentOption, myChart, showDataElem);
            createLegend(myChart);
        }
    }

    if(chartOriginOption.customOption && chartOriginOption.customOption.mode === "immediate") {
        updateTimelineStatusImmediate(viewOfStoryTimeline, xAxis, yAxis, xLabels, yLabels, text);
    } else {
        updateTimelineStatus(viewOfStoryTimeline, chartCurrentOption, text)
    }
    
    _auto_goto_data_context(chartCurrentOption)
    

    return {
        action: "show-axis",
        option: chartCurrentOption
    }
}

function _updateKeyWords(chartOriginOption) {
    if (chartOriginOption.xAxis && chartOriginOption.xAxis.name) {
         xAxis.push(chartOriginOption.xAxis.name);
    }

    if (chartOriginOption.yAxis && chartOriginOption.yAxis.name) {
        yAxis.push(chartOriginOption.yAxis.name);
    }
}

function _auto_goto_data_context(chartOption) {
    if (!chartOption.xAxis) {
        return; 
    }

    if(chartOption.xAxis && chartOption.xAxis.axisLine && chartOption.xAxis.axisLine.show) {
        if (chartOption.xAxis.axisLabel && chartOption.xAxis.axisLabel.show) {
            if (chartOption.xAxis.data && chartOption.xAxis.data.length >= xLabels.length) {
                chartOption.customOption["voiceContext"] = "data-elem";
            }   
        }
    }
}

function _nonContextInteraction(text, chartOriginOption, chartCurrentOption, myChart) {
    // show x-axis elements detection
    let isShowXAxis = xAxis.some(element => text.includes(element));
    if (isShowXAxis) {
        _set_x_axis_show(chartOriginOption, chartCurrentOption, myChart);
        createLegend(myChart);
    }

    // show y-axis elements detection
    let isShowYAxis = yAxis.some(element => text.includes(element));
    if (isShowYAxis) {
        _set_y_axis_show(chartOriginOption, chartCurrentOption, myChart);
        createLegend(myChart);
    }

    // show data elements detection
    dataElems = _createDataElem(chartOriginOption);
    let showDataElem = _isDataElemExist(chartCurrentOption, text, myChart);

    if (showDataElem.length > 0) {
        _showDataElements(chartOriginOption, chartCurrentOption, myChart, showDataElem);
        createLegend(myChart);
    }

    let isNextPage = nextPage.some(element => text.includes(element));
    
}

function _createDataElem(chartOriginOption) {
    const series = chartOriginOption.series || [];
    const xAxis = chartOriginOption.xAxis || {data: []};
    let _dataElems = {};
    const xAxisTicks = xAxis.data.map(item => {
        if(item.value) {
            return item.value;
        } else {
            return item;
        }
    }) || [];

    for (let i = 0; i < series.length; i++) {
        const data = series[i].data || [];
        const name = series[i].name || "series" + i;

        let temp = {};

        for (let j = 0; j < data.length; j++) {
            if (typeof  xAxisTicks[j] === "string") {
                xAxisTicks[j] =  xAxisTicks[j].toLowerCase();
            }
            temp[xAxisTicks[j]] = data[j];
        }
        _dataElems[name] = temp;
    }

    return _dataElems;

}

function _isDataElemExist(chartCurrentOption, text, myChart) {
    let matches = [];
    const firstCategoryKey = Object.keys(dataElems)[0]; 
    const xAxisOrder = Object.keys(dataElems[firstCategoryKey]);

    let isHighlightActive = false;
    let highlightDataIdx = [];

    xAxisOrder.forEach((item, index) => {
        for (let category in dataElems) {
            // for (let item in dataElems[category]) {
                if (typeof item === "string") {
                    item = item.toLowerCase();
                }

                let value = dataElems[category][item];
                
                if(!value){
                    continue;
                }

                if(chartCurrentOption.series && chartCurrentOption.series.length > 0) {
                    if (chartCurrentOption.series[0].data && chartCurrentOption.series[0].data.length > 0) {
                        if (chartCurrentOption.series[0].data[index]) {
                            // if the data has been shown, maybe @TODO highlight the data
                            if (text.includes(item)) {
                                isHighlightActive = true;
                                highlightDataIdx.push(index);
                            }
                            continue;
                        }
                    }
                }

                // add the value by the x + y
                if (text.includes(item) && text.includes(value.toString())) {
                    matches.push({tick: item, value: value, index: index, category: category});
                } else {
                    if (text.includes(item)) {
                        matches.push({tick: item, value: value, index: index, category: category});
                    }
                }

                
            // }
        }
    });

    // check if highlight the data
    if (isHighlightActive) {
        localStorage.setItem('voiceHighlightActive', 'true');
        _hightlightDataElem(myChart, chartCurrentOption, highlightDataIdx);
        setTimeout(() => {
            // clearInterval(intervalId);
            localStorage.setItem('voiceHighlightActive', 'false');
        }, 3000);
    }
    
    return matches;
}

// 
function _set_x_axis_show(chartOriginOption, chartCurrentOption, myChart) {
    if (chartCurrentOption.customOption && !chartOriginOption.customOption["xAxis"]) {
        return;
    }

    chartCurrentOption.customOption["x_axis_show"] = true;
    chartCurrentOption["xAxis"] = JSON.parse(JSON.stringify(chartOriginOption["xAxis"]));
    chartCurrentOption.title = JSON.parse(JSON.stringify(chartOriginOption.title));
    chartCurrentOption["yAxis"] = chartCurrentOption["yAxis"] || defaultYAxis;
    chartCurrentOption["series"] = chartCurrentOption["series"] || [];
    chartCurrentOption["grid"] = chartOriginOption["grid"] || {};
    chartCurrentOption["tooltip"] = chartOriginOption["tooltip"] || {};

    setOption(myChart, chartCurrentOption);
}

function _set_x_axis_show_with_context(chartOriginOption, chartCurrentOption, myChart) {
    if (chartCurrentOption.customOption && !chartOriginOption.customOption["xAxis"]) {
        return;
    }

    let isShowXAxisLabel = false;
    if (chartCurrentOption["xAxis"] && chartCurrentOption["xAxis"]["axisLabel"]) {
        isShowXAxisLabel = chartCurrentOption["xAxis"]["axisLabel"]["show"];
    }

    chartCurrentOption.customOption["x_axis_show"] = true;
    chartCurrentOption["xAxis"] = JSON.parse(JSON.stringify(chartOriginOption["xAxis"]));
    if (chartCurrentOption["xAxis"]["axisLabel"]) {
        if (!isShowXAxisLabel) {
            chartCurrentOption["xAxis"]["axisLabel"]["show"] = false;
            chartCurrentOption["xAxis"]["data"] = [];
        }
    }
    chartCurrentOption.title = JSON.parse(JSON.stringify(chartOriginOption.title));
    chartCurrentOption["yAxis"] = chartCurrentOption["yAxis"] || defaultYAxis;
    chartCurrentOption["series"] = chartCurrentOption["series"] || [];
    chartCurrentOption["grid"] = chartOriginOption["grid"] || {};
    chartCurrentOption["tooltip"] = chartOriginOption["tooltip"] || {};

    setOption(myChart, chartCurrentOption);
}

function _set_y_axis_show(chartOriginOption, chartCurrentOption, myChart) {
    if (chartCurrentOption.customOption && !chartOriginOption.customOption["yAxis"]) {
        return;
    }

    chartCurrentOption.customOption["y_axis_show"] = true;
    chartCurrentOption["xAxis"] = chartCurrentOption["xAxis"] || defaultXAxis;
    chartCurrentOption["yAxis"] = JSON.parse(JSON.stringify(chartOriginOption["yAxis"]));

    if(chartCurrentOption["yAxis"]["axisLabel"]) {
        chartCurrentOption["yAxis"]["axisLabel"]["show"] = true;
    } else {
        chartCurrentOption["yAxis"]["axisLabel"] = {
            "show": true
        }
    }

    chartCurrentOption["series"] = chartCurrentOption["series"] || [];
    chartCurrentOption["grid"] = chartOriginOption["grid"] || {};
    chartCurrentOption["tooltip"] = chartOriginOption["tooltip"] || {};

    setOption(myChart, chartCurrentOption);
}

function _set_y_axis_show_with_context(chartOriginOption, chartCurrentOption, myChart) {
    if (chartCurrentOption.customOption && !chartOriginOption.customOption["yAxis"]) {
        return;
    }

    chartCurrentOption.customOption["y_axis_show"] = true;
    chartCurrentOption["xAxis"] = chartCurrentOption["xAxis"] || defaultXAxis;
    chartCurrentOption["yAxis"] = JSON.parse(JSON.stringify(chartOriginOption["yAxis"]));
    // if (chartCurrentOption["yAxis"]["axisLabel"]) {
    //     chartCurrentOption["yAxis"]["axisLabel"] = false;
    // }

    chartCurrentOption.yAxis.axisLabel.show = false;

    chartCurrentOption["series"] = chartCurrentOption["series"] || [];
    chartCurrentOption["grid"] = chartOriginOption["grid"] || {};
    chartCurrentOption["tooltip"] = chartOriginOption["tooltip"] || {};
    setOption(myChart, chartCurrentOption);

}

function _isShowXAxisLabel(text, chartOriginOption, chartCurrentOption, myChart) {
    if (chartCurrentOption.customOption && !chartOriginOption.customOption["xAxis"]) {
        return;
    }

    const isShowXAxisLabel = xLabels.some(element => text.includes(element));

    if (isShowXAxisLabel) {
        let showIdx = -1;
       xLabels.forEach((item, index) => {
        if (typeof item === "string") {
            item = item.toLowerCase();
        }
        if (text.includes(item)) {
            showIdx = index;
        }
       });

       if (showIdx !== -1 && chartCurrentOption["xAxis"] && chartCurrentOption["xAxis"]["data"] && showIdx >= (chartCurrentOption["xAxis"]["data"].length-1)) {
            chartCurrentOption["xAxis"]["axisLabel"]["show"] = true;
            chartCurrentOption["xAxis"]["data"] = chartOriginOption["xAxis"]["data"].slice(0, showIdx + 1);
            setOption(myChart, chartCurrentOption);
       }
    }

    return isShowXAxisLabel;
}

function _isShowYAxisLabel(text, chartOriginOption, chartCurrentOption, myChart) {
    if (chartCurrentOption.customOption && !chartOriginOption.customOption["yAxis"]) {
        return;
    }

    const isShowYAxisLabel = yLabels.some(element => text.includes(element));

    if (isShowYAxisLabel) {
        let showIdx = -1;
        yLabels.forEach((item, index) => {
            if (typeof item === "string") {
                item = item.toLowerCase();
            }
            if (text.includes(item)) {
                showIdx = index;
            }
        });

        if (showIdx !== -1) {
            chartCurrentOption["yAxis"]["axisLabel"]["show"] = true;
            // chartCurrentOption["yAxis"]["data"] = chartOriginOption["yAxis"]["data"].slice(0, showIdx + 1);
            setOption(myChart, chartCurrentOption);
        }
    }

    return isShowYAxisLabel;

}


function _showDataElements(chartOriginOption, chartCurrentOption, myChart, matches) {
    if (matches.length === 0) {
        return;
    }
    let defaultSeries = [];
    Object.keys(dataElems).forEach(category => {
        defaultSeries.push({name: category});
    });

    chartCurrentOption["series"] = chartCurrentOption["series"] || defaultSeries;

    for(let i = 0; i < matches.length; i++) {
        let match = matches[i];
        let serie = chartOriginOption["series"].find(item => item.name === match.category);
        
        let dataCopy = serie.data.slice(0, match.index + 1);
        let serieCopy = JSON.parse(JSON.stringify(serie));

        serieCopy.data = dataCopy;

        let isFind = false;
        chartCurrentOption["series"].forEach((item, index) => {
            if (item.name === match.category) {
                isFind = true;
                chartCurrentOption["series"][index] = serieCopy;
            }
        });

        if (!isFind) {
            chartCurrentOption["series"].push(serieCopy);
        }
    }

    chartCurrentOption.customOption["data_show"] = true;
    chartCurrentOption["xAxis"] = chartCurrentOption["xAxis"] || defaultXAxis;
    chartCurrentOption["yAxis"] = chartCurrentOption["yAxis"] || defaultYAxis;
    chartCurrentOption["grid"] = chartOriginOption["grid"] || {};
    chartCurrentOption["tooltip"] = chartOriginOption["tooltip"] || {};

    chartCurrentOption["series"] = chartCurrentOption["series"].filter(item => item.type && item.data && item.data.length > 0);
 
    setOption(myChart, chartCurrentOption);
}


function _checkContext(text, chartCurrentOption) {
    const lastContext = chartCurrentOption.customOption["voiceContext"] || "";

    const isXAxis = xAxis.some(element => text.includes(element));
    if (isXAxis) {
        chartCurrentOption.customOption["voiceContext"] = "x-axis";
    }
    const isYAxis = yAxis.some(element => text.includes(element));
    if (isYAxis) {
        chartCurrentOption.customOption["voiceContext"] = "y-axis";
    }
    const isDataElem = dataElemContext.some(element => text.includes(element));
    if (isDataElem) {
        chartCurrentOption.customOption["voiceContext"] = "data-elem";
    }

    return chartCurrentOption;
}

function _createLabels(chartOriginOption) {
    const xAxis = chartOriginOption.xAxis || {data: []};
    const yAxis = chartOriginOption.yAxis || {data: []};
    let _xLabels = [];
    let _yLabels = [];

    if (xAxis.data && xAxis.data.length > 0) {
        _xLabels = xAxis.data.map(item => {
            if (typeof item === "string") {
                return item.toLowerCase();
            }
            return item;
        });
    }

    // if (yAxis.data && yAxis.data.length > 0) {
    //     _yLabels = yAxis.data.map(item =>  {
    //         if (typeof item === "string") {
    //             return item.toLowerCase();
    //         }
    //         return item;
    //     });
    // }

    chartOriginOption.series.forEach(item => {
        if (item.data && item.data.length > 0) {
            item.data.forEach(dataItem => {
                if (typeof dataItem === "string") {
                    _yLabels.push(dataItem.toLowerCase());
                } else {
                    _yLabels.push(dataItem);
                }
            })
        }
    })

    return {
        xLabels: _xLabels,
        yLabels: _yLabels
    }
}

function _hightlightDataElem(myChart, chartCurrentOption, idx) {
    // myChart.dispatchAction({
    //     type: 'highlight',
    //     seriesIndex: 0,
    //     dataIndex: index
    // });
    const seriesIdxs = [];
    const dataIdxs = [];
    chartCurrentOption.series.forEach((item, index) => {
        idx.forEach(i => {
            if (item.data && item.data.length > 0) {
                if (item.data[i]) {
                    seriesIdxs.push(index);
                    dataIdxs.push(i);
                }
            }
        })
    })
    
    chartOperaionAPI.highlight(myChart, seriesIdxs, dataIdxs, true);
}

export default { basicParser }