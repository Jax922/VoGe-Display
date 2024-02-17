import chartOperaionAPI from "../chart/OperationAPI";
import setOption from "../chart/chartSetOption";
import ALIAS from "./alias";
import updateBubbleChartTimeline from "./updateBubbleChartTimelineStatus";
import NLU from "../nlu/nlu";

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
        "show": true
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
        "show": true
    },
    "splitLine": {
        "show": false
    }
}

const defaultGrid = {
    "top": 100,
    "containLabel": true,
    "left": 50,
    "right": "110"
}

let legends = []
let singleDataItems = []
let legendsColor = []
let firstShowSeries = []
let splitLastData = null



function basicParser(text, chartOriginOption, chartCurrentOption, myChart, viewOfStoryTimeline) {

    if (!text) {
        return;
    }

    const baseOption = chartOriginOption.baseOption || {};
    _updateKeyWords(baseOption);
    _updateLegends(chartOriginOption);
    _updateLegendsColor(chartOriginOption);
    console.log("legends==========>", legends);
    console.log("legendsColor==========>", legendsColor);
    console.log("singleDataItems==========>", singleDataItems);

    _checkContext(text, chartCurrentOption);

    _titleNameShow(text, chartOriginOption, chartCurrentOption, myChart);
    _yearNameShow(text, chartOriginOption, chartCurrentOption, myChart);
    _highlight_data_elem(text, chartOriginOption, chartCurrentOption, myChart);

    if (chartCurrentOption.customOption["voiceContext"] === "x-axis") {
        _set_x_axis_show(chartOriginOption, chartCurrentOption, myChart);
    }

    if (chartCurrentOption.customOption["voiceContext"] === "y-axis") {
        _set_y_axis_show(chartOriginOption, chartCurrentOption, myChart);
    }

    if(chartCurrentOption.customOption["voiceContext"] === "data-elem") {
        _data_elem_handle(text, chartOriginOption, chartCurrentOption, myChart);
    }

    updateBubbleChartTimeline(chartCurrentOption, viewOfStoryTimeline, text, myChart);

}

function _updateKeyWords(baseOption) {
    if (baseOption.xAxis && baseOption.xAxis.name) {
         xAxis.push(baseOption.xAxis.name);
    }

    if (baseOption.yAxis && baseOption.yAxis.name) {
        yAxis.push(baseOption.yAxis.name);
    }
}

function _set_x_axis_show(chartOriginOption, chartCurrentOption, myChart) {
    if (chartCurrentOption.customOption && !chartOriginOption.customOption["xAxis"]) {
        return;
    }

    if(chartCurrentOption.customOption && chartCurrentOption.customOption["x_axis_show"] === true) {
        return;
    }

    chartCurrentOption.customOption = JSON.parse(JSON.stringify(chartOriginOption.customOption));

    


    _updateCustomOption(chartOriginOption, chartCurrentOption);

    chartCurrentOption.customOption["x_axis_show"] = true;
    let baseOption = chartOriginOption.baseOption || {};

    if (!chartCurrentOption.baseOption) {
        chartCurrentOption.baseOption = {};
    }

    chartCurrentOption.baseOption["xAxis"] = JSON.parse(JSON.stringify(baseOption["xAxis"]));
    // chartCurrentOption.baseOption.title = [JSON.parse(JSON.stringify(baseOption.title))[1]];
    chartCurrentOption.baseOption.title = [];
    chartCurrentOption.baseOption["yAxis"] = chartCurrentOption.baseOption["yAxis"] || defaultYAxis;
    chartCurrentOption["options"] = chartCurrentOption["options"] || [];
    chartCurrentOption.baseOption["grid"] = chartOriginOption.baseOption["grid"] || defaultGrid;
    chartCurrentOption.baseOption["tooltip"] = chartOriginOption.baseOption["tooltip"] || {};

    chartCurrentOption.baseOption.series = JSON.parse(JSON.stringify(chartOriginOption.baseOption.series));
    chartCurrentOption.baseOption["animationDurationUpdate"] = chartOriginOption.baseOption["animationDurationUpdate"] || 1000;
    chartCurrentOption.baseOption["animationEasingUpdate"] = chartOriginOption.baseOption["animationEasingUpdate"] || "quinticInOut";

    setOption(myChart, chartCurrentOption);
}

function _set_y_axis_show(chartOriginOption, chartCurrentOption, myChart) {
    if (chartCurrentOption.customOption && !chartOriginOption.customOption["yAxis"]) {
        return;
    }

    if(chartCurrentOption.customOption && chartCurrentOption.customOption["y_axis_show"] === true) {
        return;
    }

    if (!chartCurrentOption.baseOption) {
        chartCurrentOption.baseOption = {};
    }

    _updateCustomOption(chartOriginOption, chartCurrentOption);

    chartCurrentOption.customOption["y_axis_show"] = true;
    chartCurrentOption.baseOption["xAxis"] = chartCurrentOption.baseOption["xAxis"] || defaultXAxis;
    chartCurrentOption.baseOption["yAxis"] = JSON.parse(JSON.stringify(chartOriginOption.baseOption["yAxis"]));
    chartCurrentOption.baseOption.title = [];
    chartCurrentOption.baseOption.series = JSON.parse(JSON.stringify(chartOriginOption.baseOption.series));
    chartCurrentOption.baseOption["animationDurationUpdate"] = chartOriginOption.baseOption["animationDurationUpdate"] || 1000;
    chartCurrentOption.baseOption["animationEasingUpdate"] = chartOriginOption.baseOption["animationEasingUpdate"] || "quinticInOut";

    // if(chartCurrentOption["yAxis"]["axisLabel"]) {
    //     chartCurrentOption["yAxis"]["axisLabel"]["show"] = true;
    // } else {
    //     chartCurrentOption["yAxis"]["axisLabel"] = {
    //         "show": true
    //     }
    // }

    chartCurrentOption["options"] = chartCurrentOption["options"] || [];
    chartCurrentOption.baseOption["grid"] = chartOriginOption.baseOption["grid"] || defaultGrid;
    chartCurrentOption.baseOption["tooltip"] = chartOriginOption.baseOption["tooltip"] || {};

    setOption(myChart, chartCurrentOption);
}

function _updateCustomOption(chartOriginOption, chartCurrentOption) {
    chartCurrentOption.customOption["mode"] = chartOriginOption.customOption["mode"];
    chartCurrentOption.customOption["height"] = chartOriginOption.customOption["height"];
    chartCurrentOption.customOption["theme"] = chartOriginOption.customOption["theme"] || "light";
    chartCurrentOption.customOption["xAxis"] = chartOriginOption.customOption["xAxis"];
    chartCurrentOption.customOption["yAxis"] = chartOriginOption.customOption["yAxis"];
}

function _updateLegends(chartOriginOption) {
    firstShowSeries = [];
    legends = [];
    const firstOption = chartOriginOption.options[0];
    if(firstOption && firstOption.series) {
        firstOption.series.forEach(element => {
            if(element.name) {
                legends.push(element.name.toLowerCase());
            }
            firstShowSeries.push(element);
        });
    }
}

function _updateLegendsColor(chartOriginOption) {
    // dataColorname
    
    // if (legendsColor.length <= 0) {
    //     legendsColor = [];
    // } 
    singleDataItems = [];
    const baseSeries = chartOriginOption.baseOption.series[0];
    const datas = baseSeries.data || [];

    datas.forEach((element, idx) => {
        let tempItems = [];
        if(element.data) {
            element.data.forEach(temp => {
                singleDataItems.push(temp[3]);
                tempItems.push(temp[3]);
            });
        }

        if(element.name) {
            if (legendsColor.length < datas.length) {
                legendsColor.push({color: element.dataColorname.toLowerCase(), name: element.name.toLowerCase(), items: tempItems, isShow: false});
            }
        }
        
    });

}


function _checkContext(text, chartCurrentOption) {
    const lastContext = chartCurrentOption.customOption["voiceContext"] || "";

    // auto goto data-elem context
    if(chartCurrentOption.customOption["x_axis_show"] && chartCurrentOption.customOption["y_axis_show"]) {
        chartCurrentOption.customOption["voiceContext"] = "data-elem";
        chartCurrentOption.customOption["data-elem-processing"] = "first-show";
    }

    const isXAxis = xAxis.some(element => text.includes(element));
    if (isXAxis && !chartCurrentOption.customOption["x_axis_show"]) {
        chartCurrentOption.customOption["voiceContext"] = "x-axis";
    }
    const isYAxis = yAxis.some(element => text.includes(element));
    if (isYAxis && !chartCurrentOption.customOption["y_axis_show"]) {
        chartCurrentOption.customOption["voiceContext"] = "y-axis";
    }
}

function _data_elem_handle(text, chartOriginOption, chartCurrentOption, myChart) {

    if(!chartCurrentOption.options[0]) {
        chartCurrentOption.options[0] = {
            "series": [],
            "title": {}
        };
    }

    // auto goto data-elem-processing context, when all series added
    if(chartCurrentOption.options[0].series.length >= legends.length && chartCurrentOption.customOption["data-elem-processing"] !== "data-play-processing") {
        const restSeries = chartOriginOption.options.slice(1);
        chartCurrentOption.options.push(...restSeries);
        chartCurrentOption.customOption["data-elem-processing"] = "data-play-processing";
    }

    if (chartCurrentOption.customOption["data-elem-processing"] == "first-show") {
        _data_elem_first_show(text, chartOriginOption, chartCurrentOption, myChart);
    }

    if (chartCurrentOption.customOption["data-elem-processing"] == "data-play-processing") {

        

       
        if (chartOriginOption.customOption.NLUMode == "hybrid") {
            (async () => {
                const isParse1 = _data_elem_play_processing(text, chartOriginOption, chartCurrentOption, myChart);
                const isParse2 = _goBack(text, chartOriginOption, chartCurrentOption, myChart);
                const isParse3 = _changeSpeedHandle(text, chartOriginOption, chartCurrentOption, myChart);
                const isParse4 = _splitUpHandle(text, chartOriginOption, chartCurrentOption, myChart);
                const isParse5 = _reuniteHandle(text, chartOriginOption, chartCurrentOption, myChart);
                if (!isParse1 && !isParse2 && !isParse3 && !isParse4 && !isParse5) {
                    const nlu_parse_res = await _nlu_parse(text, chartOriginOption, chartCurrentOption, myChart);
                }
            })(); 
        } else {
            _data_elem_play_processing(text, chartOriginOption, chartCurrentOption, myChart);
            _goBack(text, chartOriginOption, chartCurrentOption, myChart);
            _changeSpeedHandle(text, chartOriginOption, chartCurrentOption, myChart);
            _splitUpHandle(text, chartOriginOption, chartCurrentOption, myChart);
            _reuniteHandle(text, chartOriginOption, chartCurrentOption, myChart);
        }
        // _highlight_data_elem(text, chartOriginOption, chartCurrentOption, myChart);
    }
}

function _data_elem_first_show(text, chartOriginOption, chartCurrentOption, myChart) {
    chartCurrentOption.baseOption["timeline"] = chartOriginOption.baseOption["timeline"];
    chartCurrentOption.baseOption["timeline"].show = false;

    const matchedLegends = _findLegendsInText(text);

    if (matchedLegends.length <= 0) { return; }

    const findedSeries = _findSeriesByLegends(firstShowSeries, matchedLegends);

    if (findedSeries.length <= 0) { return; }
    
    if(!chartCurrentOption.options[0]) {
        chartCurrentOption.options[0] = {
            "series": [],
            "title": {}
        };
    }

    // add series to chartCurrentOption
    findedSeries.forEach(element => {
        const exist = chartCurrentOption.options[0].series.some(serie => serie.name.toLowerCase() === element.name.toLowerCase());
        if (!exist) {
            chartCurrentOption.options[0].series.push(element);
        }
    });

    // set isShow to true
    legendsColor.forEach(legend => {
        const found = findedSeries.some(item => item.name.toLowerCase() === legend.name.toLowerCase());
        if (found) {
            legend.isShow = true;
        }
    });

    chartCurrentOption.options[0].title = {};
    // chartCurrentOption.baseOption.title[0] = chartOriginOption.baseOption.title[0];
    console.log("chartCurrentOption==========>", chartCurrentOption);
    console.log("legend color==========>", legendsColor);
    setOption(myChart, chartCurrentOption);
}

// data play processing, include play, pause tasks
function _data_elem_play_processing(text, chartOriginOption, chartCurrentOption, myChart) {

    const playKeywords = ["play", "start", "start here", "play here", "playing", "starting", "begin", "beginning", "begin here", "beginning here"];
    if (playKeywords.some(element => text.includes(element))) {
        _autoReunite(chartOriginOption, chartCurrentOption, myChart);
        _start_play(text, chartOriginOption, chartCurrentOption, myChart);
        return true;
    }

    const pauseText = ["pause", "stop", "stop here", "pause here", "stopping", "pausing", "freeze", "holding", "hold"];
    if (pauseText.some(element => text.includes(element))) {
        _pause(myChart, text);
        return true;
    }

    return false;

}

function _start_play(text, chartOriginOption, chartCurrentOption, myChart) {
    chartCurrentOption.baseOption["timeline"].autoPlay = true;

        if (!chartCurrentOption.baseOption) {
            chartCurrentOption.baseOption = {
                title: [{}, {}],
                series: []
            };
        } else {
            if (!chartCurrentOption.baseOption.title) {
                chartCurrentOption.baseOption.title = [{}, {}];
            }
        }

        if(!chartCurrentOption.customOption["title_show"]) {
            chartCurrentOption.customOption["title_show"] = true;
            chartCurrentOption.baseOption.title[1] = chartOriginOption.baseOption.title[1];
        }
        if (!chartCurrentOption.customOption["year_show"]) {
            chartCurrentOption.customOption["year_show"] = true;
            chartCurrentOption.baseOption.title[0] = chartOriginOption.baseOption.title[0];
        }
        setOption(myChart, chartCurrentOption);
        _play(myChart);
}

function _highlight_data_elem(text, chartOriginOption, chartCurrentOption, myChart) {
    // _highlight_data_series(text, chartOriginOption, chartCurrentOption, myChart);
    _highlight_data_items(text, chartOriginOption, chartCurrentOption, myChart);
}

function _highlight_data_series(text, chartOriginOption, chartCurrentOption, myChart) {
    text = text.toLowerCase();
    if (text == "") {
        return;
    }

    const matched = _findLegendsInText(text);

    const seriesIdxs = [];
    const dataIdxs = [];


    legendsColor.forEach(legend => {
        if (matched.includes(legend.name) && legend.isShow) {
            seriesIdxs.push(legendsColor.indexOf(legend));
            legend.items.forEach((item, index) => {
                dataIdxs.push(index);
            });
        }
    });

    
    localStorage.setItem('voiceHighlightActive', 'true');
    chartOperaionAPI.highlight(myChart, seriesIdxs, dataIdxs, true);
    setTimeout(() => {
        // clearInterval(intervalId);
        localStorage.setItem('voiceHighlightActive', 'false');
    }, 3000);
    
}

function _highlight_data_items(text, chartOriginOption, chartCurrentOption, myChart) {

    text = text.toLowerCase();
    if (text == "") {
        return false;
    }

    const seriesIdxs = [];
    const dataIdxs = [];
    const highlightIdxs = [];
    let isSingleHighlight = false;
    let isSeriesHighlight = false;

    const matched = _findLegendsInText(text);

    legendsColor.forEach((legend, idx1) => {
        let temp1 = [idx1];
        let temp2 = [];
        let isFindSingleData = false;
        if (legend.isShow) {
            legend.items.forEach((item, idx2) => {
                let aliasData = ALIAS.countiesAlias.filter(alias => alias.name.toLowerCase() === item.toLowerCase());
                let isMatchAlias = false;
                if (aliasData.length > 0) {
                    isMatchAlias = aliasData[0].alias.some(elem => text.includes(elem.toLowerCase()))
                }
                if(text.includes(item.toLowerCase()) || isMatchAlias) {
                    temp2.push(idx2);
                    isFindSingleData = true;
                }
            })
            if (!isFindSingleData) {
                if (matched.includes(legend.name)) {
                    isSeriesHighlight = true;
                    seriesIdxs.push(idx1);
                    legend.items.forEach((item, idx3) => {
                        dataIdxs.push(idx3);
                    });
                }
            }
        }
        if (temp2.length > 0) {
            isSingleHighlight = true;
            highlightIdxs.push({
                seriesId: temp1,
                dataId: temp2
            })
        }
    });

    // if (isSingleHighlight) {

        localStorage.setItem('voiceHighlightActive', 'true');
        if(isSingleHighlight){
            highlightIdxs.forEach(item => {
                myChart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: item.seriesId,
                    dataIndex: item.dataId,
                })
            })
        }
        if(isSeriesHighlight) {
            myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: seriesIdxs,
                dataIndex: dataIdxs,
            })
        }
        setTimeout(() => {
            // clearInterval(intervalId);
            localStorage.setItem('voiceHighlightActive', 'false');
        }, 5000);
    // }

    return isSingleHighlight;
}

function _findLegendsInText(text) {
    const lowerCaseText = text.toLowerCase();
  
    // const matchedLegends = legends.filter(legend => lowerCaseText.includes(legend.toLowerCase()));
    const matchedLegends = legendsColor.filter(legend => lowerCaseText.includes(legend.name.toLowerCase())).map(legend => legend.name);
    const matchedColor = legendsColor.filter(legend => lowerCaseText.includes(legend.color.toLowerCase())).map(legend => legend.name);
    const uniqueSet = new Set([...matchedLegends, ...matchedColor]);
    const matched = [...uniqueSet];
  
    return matched;
}

function _findSeriesByLegends(series, matchedLegends) {
    const matchedSeries = series.filter(serie => matchedLegends.includes(serie.name.toLowerCase()));
    return matchedSeries;
}

function _play(myChart) {
    myChart.dispatchAction({
        type: 'timelinePlayChange',
        playState: true,
    });
}

function _pause(myChart, text) {

    _autoPause(myChart);

    let serieId = -1;

    ALIAS.yearAlias.forEach((item, idx) => {
        let aliasArray = item.alias || [];
        let isMatchAlias = aliasArray.some(elem => text.includes(elem));
        if(text.includes(item.name) || isMatchAlias) {
            serieId = idx;
        }
    })

    if (serieId > -1) {
        // setTimeout(() => {
            myChart.dispatchAction({
                type: 'timelineChange',
                currentIndex: serieId
            })
            // setOption(myChart, chartCurrentOption);
            // _autoPause(myChart);
        // }, 300);
    }


}

// title show
function _titleNameShow(text, chartOriginOption, chartCurrentOption, myChart) {

    if(chartCurrentOption.customOption["title_show"] === true) {
        return;
    }

    const titleName = chartOriginOption.baseOption.title[1].text || "";
    if (text == "" || titleName == "") {
        return;
    }

    if(!containsAtLeastTwoWords(titleName.toLowerCase(), text.toLowerCase())) {
        return;
    }

    chartCurrentOption.customOption["title_show"] = true;

    if (!chartCurrentOption.baseOption) {
        chartCurrentOption.baseOption = {
            title: [{}, {}],
            series: []
        };
    }

    chartCurrentOption.baseOption.title[1] = JSON.parse(JSON.stringify(chartOriginOption.baseOption.title))[1];

    setOption(myChart, chartCurrentOption);
}

// year show
function _yearNameShow(text, chartOriginOption, chartCurrentOption, myChart){
    if(chartCurrentOption.customOption["year_show"] === true) {
        return;
    }

    const yearName = chartOriginOption.baseOption.title[0].text || "";
    if (text == "" || yearName == "") {
        return;
    }

    if(text.includes(yearName) === false) {
        return;
    }

    const year1800 = ["1800", "eighteen hundred", "eighteen hundredth", "eighteen hundreds"];

    if(!year1800.some(element => text.includes(element))) {
        return;
    }
    
    chartCurrentOption.customOption["year_show"] = true;

    if (!chartCurrentOption.baseOption) {
        chartCurrentOption.baseOption = {
            title: [{}, {}],
            series: []
        };
    }

    chartCurrentOption.baseOption.title[0] = JSON.parse(JSON.stringify(chartOriginOption.baseOption.title))[0];
    setOption(myChart, chartCurrentOption);
}

function containsAtLeastTwoWords(str1, str2) {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
  
    let count = 0;
  
    for (let word of words2) {
      if (words1.includes(word)) {
        count++;
      }
      if (count >= 2) {
        return true;
      }
    }
  
    return count >= 2;
}

function _goBack(text, chartOriginOption, chartCurrentOption, myChart) {
    const keywords = ["back", "go back", "backing", "rewind", "rewinding", "backing to", "go back to", "back to", "Jump to", "Move", "Move to the year of", "Jump to the year of", "Go to the year of"]
    if (text == "") {
        return;
    }

    if (keywords.some(element => text.includes(element))) {
        _autoReunite(chartOriginOption, chartCurrentOption, myChart);
        _gotoSpecificYear(text, chartOriginOption, chartCurrentOption, myChart)
        return true;
    }

    return false;
}

function _gotoSpecificYear(text, chartOriginOption, chartCurrentOption, myChart) {
    let serieId = -1;

        ALIAS.yearAlias.forEach((item, idx) => {
            let aliasArray = item.alias || [];
            let isMatchAlias = aliasArray.some(elem => text.includes(elem));
            if(text.includes(item.name) || isMatchAlias) {
                serieId = idx;
                _autoPause(myChart);
            }
        })


        if (serieId > -1) {
            setTimeout(() => {
                myChart.dispatchAction({
                    type: 'timelineChange',
                    currentIndex: serieId
                })
                setOption(myChart, chartCurrentOption);
                _autoPause(myChart);
            }, 300);
        }
}

// auto pause
function _autoPause(myChart) {
    myChart.dispatchAction({
        type: 'timelinePlayChange',
        playState: false,
    });
}

function _changeSpeedHandle(text, chartOriginOption, chartCurrentOption, myChart) {
    if (text == "") {
        return;
    }

    const speedup = ["speed up", "faster", "fast"];
    const speeddown = ["slow down", "slower", "slow"];

    if (speedup.some(element => text.includes(element))) {
        _changeSpeed(myChart, chartCurrentOption, true);
        return true;
    } else if (speeddown.some(element => text.includes(element))) {
        _changeSpeed(myChart, chartCurrentOption, false);
        return true;
    }

    return false;

}

// change speed
function _changeSpeed(myChart, chartCurrentOption, isSpeedup) {
    let originValue = chartCurrentOption.baseOption["timeline"].playInterval;
    if (originValue === undefined) {
        originValue = 1000;
    }
    
    const rate = isSpeedup ? 0.5 : 1.5;

    if (originValue * rate < 500) {
        return; // limit the speed
    }

    chartCurrentOption.baseOption["timeline"].playInterval = originValue * rate;
    setOption(myChart, chartCurrentOption);
    myChart.dispatchAction({
        type: 'timelinePlayChange',
        playState: true
    });
}

// split up 

function _splitUpHandle(text, chartOriginOption, chartCurrentOption, myChart) {
    if (text == "") {
        return;
    }

    const splitup = ["split up", "split", "Split up", "Divide", "Separate", "Split", "Dividing", "Separating", "Split up the data element of", "Divide the data element of", "Separate the data element of"];
    
    if (splitup.some(element => text.includes(element))) {
        _splitUp( chartOriginOption, chartCurrentOption, myChart);
        return true;
    }

    return false;
}

function _splitUp(chartOriginOption, chartCurrentOption, myChart) {

    _autoPause(myChart);

    const splitData = chartOriginOption.customOption["splitData"][0];

    if (!splitData || chartCurrentOption.customOption["isSplited"]) {
        return;
    }

    chartCurrentOption.customOption["isSplited"] = true;


    const splitObjName = splitData.name;
    const lastIdx = chartCurrentOption.options.length - 1;
    const year = splitData.index;

    const copyLastData = JSON.parse(JSON.stringify(chartCurrentOption.options[lastIdx]));
    const copySplitData = JSON.parse(JSON.stringify(splitData));

    splitLastData = copyLastData.series[0].data.filter(item => item[3] === splitObjName);



    copySplitData.data = splitLastData

    chartCurrentOption.options.forEach((item, idx) => {
        if(item.title.text === year) {
            chartCurrentOption.options[idx].series[0].data = chartCurrentOption.options[idx].series[0].data.filter(item => item[3] !== splitObjName);
        }
    });



    //
    chartCurrentOption.options[lastIdx].series.push(copySplitData);
    chartCurrentOption.baseOption.series.push(copySplitData);

    setOption(myChart, chartCurrentOption);
    // _autoPause(myChart);

    chartCurrentOption.options[lastIdx].series[chartCurrentOption.options[lastIdx].series.length - 1] = splitData;
    chartCurrentOption.baseOption.series[chartCurrentOption.baseOption.series.length - 1] = splitData;

    setOption(myChart, chartCurrentOption);
    _autoPause(myChart);

    if (legendsColor.length < 5){
        legendsColor.push({
            color: splitData.dataColorname.toLowerCase(),
            name: "null1",
            items: splitData.data.map(item => item[3]),
            isShow: true
        });
    }

    // copyLastData.series[0].data = copyLastData.series[0].data.filter(item => item.name !== splitObjName);
    // copyLastData.series.push(splitData);
    // chartCurrentOption.options.push(copyLastData);

    // const lastYear = chartCurrentOption.baseOption.timeline.data[chartCurrentOption.baseOption.timeline.data.length - 1];
    // chartCurrentOption.baseOption.timeline.data.push(lastYear);

    // myChart.dispatchAction({
    //     type: 'timelineChange',
    //     currentIndex: lastIdx+1
    // });

    // setOption(myChart, chartCurrentOption);
    // _autoPause(myChart);

    // chartCurrentOption.baseOption.series.forEach((item, idx) => {
    //     item.data[0].data = item.data[0].data.filter(item => item[3] !== splitObjName);
    // });


    return;

    // chartCurrentOption.options[lastIdx].series.push(splitData);
    // copyLastData.series.push(splitData);
    // chartCurrentOption.options.push(copyLastData)

    // chartCurrentOption.baseOption.series.forEach((item, idx) => {
    //     item.data[0].data = item.data[0].data.filter(item => item[3] !== splitObjName);
    // });

    // chartCurrentOption.baseOption.series.push(splitData);



 

    // setOption(myChart, chartCurrentOption);


}

function _reuniteHandle(text, chartOriginOption, chartCurrentOption, myChart) {
    if (text == "") {
        return;
    }

    const reunite = ["reunite", "reunion", "Reunite", "Merge", "Reunite the data element of",
    "Combine the data element of", "Merge the data element of"];
    
    if (reunite.some(element => text.includes(element))) {
        _reunite(chartOriginOption, chartCurrentOption, myChart);
        return true;
    }

    return false;
}

function _reunite(chartOriginOption, chartCurrentOption, myChart){

    _autoPause(myChart);

    chartCurrentOption.customOption["isSplited"] = false;

    chartCurrentOption.options.forEach((item, idx) => {
        if(item.title.text === "2015") {
            chartCurrentOption.options[idx].series[0].data.unshift(splitLastData[0]);
        }
        if (item.series.length >= 5) {
            chartCurrentOption.options[idx].series.pop();
        }
    });

    chartCurrentOption.baseOption.series.pop();

    setOption(myChart, chartCurrentOption, true);
    myChart.dispatchAction({
        type: 'timelineChange',
        currentIndex: 80
    });
    _autoPause(myChart);
}
function _nlu_parse(text, chartOriginOption, chartCurrentOption, myChart) {
    return (async () => {
        const parsedData = await NLU.parse(text);
        if (parsedData && parsedData.intent && parsedData.intent.confidence > 0.8) {
            switch (parsedData.intent.name){
                case "play":
                    _autoReunite(chartOriginOption, chartCurrentOption, myChart);
                    _start_play(text, chartOriginOption, chartCurrentOption, myChart);
                    return true;
                case "pause":
                    _pause(myChart, text);
                    return true;
                case "speed_up":
                    _changeSpeed(myChart, chartCurrentOption, true);
                    return true;
                case "slow_down":
                    _changeSpeed(myChart, chartCurrentOption, false);
                    return true;
                case "resume_play":
                    _autoReunite(chartOriginOption, chartCurrentOption, myChart);
                    _start_play(text, chartOriginOption, chartCurrentOption, myChart);
                    return true;
                case "rewind":
                    _autoReunite(chartOriginOption, chartCurrentOption, myChart);
                    _gotoSpecificYear(text, chartOriginOption, chartCurrentOption, myChart);
                    return true;
            }
        }
        return false;
    })();
}

function _autoReunite(chartOriginOption, chartCurrentOption, myChart) {
    if (chartCurrentOption.customOption["isSplited"]) {
        _reunite(chartOriginOption, chartCurrentOption, myChart);
    }
}


export default {basicParser}


