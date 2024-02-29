const timelineNodes = document.querySelector('.timeline-nodes');
const timelineScript = document.querySelector('.timeline-script-content');
const timelineScriptNext = document.querySelector('.timeline-script-content-next');

let highlightIdx = -1;

function updateTimelineStatus(viewOfStoryTimeline, chartOption, text) {
    console.log("updateTimelineStatus", viewOfStoryTimeline);
    console.log("updateTimelineStatus", chartOption)

    const timelineNodeItems = document.querySelectorAll('.timeline-node');
    
    timelineNodeItems.forEach((item, idx) => {
        if (item.classList.contains("timeline-node-highlight")) {
            if (idx>highlightIdx) {
                highlightIdx = idx;
            }
        }
    })

    let isDataElem = false;
    viewOfStoryTimeline.forEach((content, idx) => {
        if (idx <= highlightIdx) { 
            if (content.type === "Data-Element" && chartOption.customOption.voiceContext === "data-elem") {
                isDataElem = checkDataElement(content.timeNode, chartOption, viewOfStoryTimeline, text);
            }
            if (content.type === "Ending" && !isDataElem) {
                checkEnding(chartOption, viewOfStoryTimeline, text, content.script);
            }
            return;
        }

        if(content.timeNode === "Warm-up") {
            checkWarmUp(content, chartOption);
        }
        if (content.type === "X-Axis") {
            if(content.timeNode === "X-Axis Line") {
                checkXAxisLine(chartOption, viewOfStoryTimeline);
            }
            if(content.timeNode === "X-Axis Tick") {
                checkXAxisTick(chartOption, viewOfStoryTimeline);
            }
            if(content.timeNode === "X-Axis") {
                checkXAxis(chartOption, viewOfStoryTimeline);
            }
        }

        if (content.type === "Y-Axis") {
            // checkYAxis(chartOption, viewOfStoryTimeline);
            if (content.timeNode === "Y-Axis Line") {
                checkYAxisLine(chartOption, viewOfStoryTimeline);
            }
            if (content.timeNode === "Y-Axis Tick") {
                checkYAxisTick(chartOption, viewOfStoryTimeline);
            }
            if (content.timeNode === "Y-Axis") {
                checkYAxis(chartOption, viewOfStoryTimeline);
            }
        }

        if (content.type === "Data-Element" && chartOption.customOption.voiceContext === "data-elem") {
            isDataElem = checkDataElement(content.timeNode, chartOption, viewOfStoryTimeline, text);
        }
        if (content.type === "Ending" && !isDataElem) {
            checkEnding(chartOption, viewOfStoryTimeline, text, content.script);
        }
    });
}
function checkWarmUp(chartOption) {

}

function checkXAxisLine(chartOption, viewOfStoryTimeline) {
    if (!chartOption.xAxis) {
        return; 
     }
 
     if(chartOption.xAxis && chartOption.xAxis.axisLine && chartOption.xAxis.axisLine.show) {
        updateTimelineNodeStyle("X-Axis Line", viewOfStoryTimeline);
        //  removeHighlightOfTimelineNode();
        //  const timelineNodeItems = document.querySelectorAll('.timeline-node');
        // const timelineNodeLabels = document.querySelectorAll('.timeline-node-label');
        // timelineNodeItems[1].classList.remove("timeline-node-future");
        //  timelineNodeItems[1].classList.add("timeline-node-highlight");
        //  timelineNodeLabels[1].classList.add("timeline-node-label-highlight");
        //  timelineScript.textContent = viewOfStoryTimeline[1].script;
        //  timelineScriptNext.textContent = viewOfStoryTimeline[2].script;
     }
}

function checkXAxis(chartOption, viewOfStoryTimeline) {
    if (!chartOption.xAxis) {
        return; 
     }
 
     if(chartOption.xAxis && chartOption.xAxis.axisLine && chartOption.xAxis.axisLine.show) {
        updateTimelineNodeStyle("X-Axis", viewOfStoryTimeline);
     }
}

function checkXAxisTick(chartOption, viewOfStoryTimeline) {
    if (!chartOption.xAxis) {
        return; 
     }
 
     if(chartOption.xAxis && chartOption.xAxis.axisLine && chartOption.xAxis.axisLine.show) {
        if (chartOption.xAxis.data && chartOption.xAxis.data.length > 0) {
            if (chartOption.xAxis.axisLabel && chartOption.xAxis.axisLabel.show) {
                updateTimelineNodeStyle("X-Axis Tick", viewOfStoryTimeline);
                // removeHighlightOfTimelineNode();
                // const timelineNodeItems = document.querySelectorAll('.timeline-node');
                // const timelineNodeLabels = document.querySelectorAll('.timeline-node-label');
                // timelineNodeItems[2].classList.remove("timeline-node-future");
                // timelineNodeItems[2].classList.add("timeline-node-highlight");
                // timelineNodeLabels[2].classList.add("timeline-node-label-highlight");
                // timelineScript.textContent = viewOfStoryTimeline[2].script;
            }
        }
     }
}

function checkYAxisLine(chartOption, viewOfStoryTimeline) {
    if (!chartOption.yAxis) {
        return; 
     }
 
    if(chartOption.yAxis && chartOption.yAxis.axisLine && chartOption.yAxis.axisLine.show) {
        updateTimelineNodeStyle("Y-Axis Line", viewOfStoryTimeline);
    }
}

function checkYAxisTick(chartOption, viewOfStoryTimeline) {
    if (!chartOption.yAxis) {
        return; 
     }
 
    if(chartOption.yAxis && chartOption.yAxis.axisLine && chartOption.yAxis.axisLine.show) {
        updateTimelineNodeStyle("Y-Axis Tick", viewOfStoryTimeline);
    }
}

function checkYAxis(chartOption, viewOfStoryTimeline) {
    if (!chartOption.yAxis) {
        return; 
     }
 
    if(chartOption.yAxis && chartOption.yAxis.axisLine && chartOption.yAxis.axisLine.show) {
        updateTimelineNodeStyle("Y-Axis", viewOfStoryTimeline);
    }
}

function checkDataElement(nodeName, chartOption, viewOfStoryTimeline, text) {
    let idx = -1;
    nodeName = nodeName.replace(/\(.*?\)/g, '');

    if(!text.toLowerCase().includes(nodeName.toLowerCase())) {
        return false;
    }

    let res = false;

    if(chartOption.xAxis && chartOption.xAxis.axisLine && chartOption.xAxis.axisLine.show) {
        if (chartOption.xAxis.data && chartOption.xAxis.data.length > 0) {
            if (chartOption.xAxis.axisLabel && chartOption.xAxis.axisLabel.show) {
                chartOption.xAxis.data.forEach((item, index) => {
                    if (item === nodeName) {
                        idx = index;
                    }
                })

                if (idx > -1) {
                    updateTimelineNodeStyle(nodeName, viewOfStoryTimeline);
                    res = true;
                    // check if the data-elem is have been shown
                    // if (chartOption.series && chartOption.series.length > 0) {
                    //     if (chartOption.series[0].data && chartOption.series[0].data.length > 0) {
                    //         if (chartOption.series[0].data[idx]) {
                    //             updateTimelineNodeStyle(nodeName);
                    //         }
                    //     }
                    // }
                }

            }
        }
     }
    return res;
}

function removeHighlightOfTimelineNode(){
    const timelineNodeItems = document.querySelectorAll('.timeline-node');
    const timelineNodeLabels = document.querySelectorAll('.timeline-node-label');
    timelineNodeItems.forEach(item => {
        item.classList.remove("timeline-node-highlight");
    })
    timelineNodeLabels.forEach(item => {
        item.classList.remove("timeline-node-label-highlight");
    })
}

function updateTimelineNodeStyle(nodeName, viewOfStoryTimeline) {
    const timelineNodeItems = document.querySelectorAll('.timeline-node');
    const timelineNodeLabels = document.querySelectorAll('.timeline-node-label');
    timelineNodeItems.forEach(item => {
        item.classList.remove("timeline-node-highlight");
    })
    timelineNodeLabels.forEach(item => {
        item.classList.remove("timeline-node-label-highlight");
    })
    nodeName = nodeName.replace(/\(.*?\)/g, '');
    timelineNodeItems.forEach((item, idx) => {
        // remove paraphrase
        let text = item.textContent.replace(/\(.*?\)/g, '');
        if (text.toLowerCase() === nodeName.toLowerCase()) {
            item.classList.add("timeline-node-highlight");
            item.classList.remove("timeline-node-future");
            timelineNodeLabels[idx].classList.add("timeline-node-label-highlight");
        }
    })

    //update script

    // console.log("update script", viewOfStoryTimeline);

    viewOfStoryTimeline.forEach((content, idx) => {
        let timeNode = content.timeNode.replace(/\(.*?\)/g, '');
        if (timeNode === nodeName) {
            timelineScript.textContent = content.script;
            if (idx + 1 < viewOfStoryTimeline.length) {
                if (timelineScriptNext.style.display === "none") {
                    timelineScriptNext.style.display = "block";
                    timelineScript.style.width = '630px';
                    timelineScript.style.borderRight = '1px solid #ccc';
                }
                timelineScriptNext.textContent = viewOfStoryTimeline[idx + 1].script;
            } else {
                timelineScriptNext.textContent = "";
                timelineScriptNext.style.display = "none";
                timelineScript.style.width = '1260px';
                timelineScript.style.borderRight = 'none';
            }
        }
    });

    // timelineScript.textContent = viewOfStoryTimeline[1].script;
    //  timelineScriptNext.textContent = viewOfStoryTimeline[2].script;

    // check if the timeline node is out of the screen
    moveToLeft();
}

function checkEnding(chartOption, viewOfStoryTimeline, text, script) {

    if(!chartOption.xAxis || !chartOption.xAxis.data) {
        return;
    }
    const dataLen = chartOption.xAxis.data.length;
    const match = script.match(/\[(.*?)\]/);
    const firstBracketContent = match ? match[1] : null;
    
    if (firstBracketContent && text.toLowerCase().includes(firstBracketContent.toLowerCase())) {
        if (chartOption.series && chartOption.series.length > 0) {
            if (chartOption.series[0].data && chartOption.series[0].data.length >= dataLen) {
                updateTimelineNodeStyle("Ending", viewOfStoryTimeline);
                return;
            }
        }
    }

    if (!firstBracketContent) {
        const nodeName = viewOfStoryTimeline[viewOfStoryTimeline.length - 2].timeNode;
        if (chartOption.series && chartOption.series.length > 0) {
            if (chartOption.series[0].data && chartOption.series[0].data.length >= dataLen) {
                const timelineNodeItems = document.querySelectorAll('.timeline-node');
                if (timelineNodeItems[timelineNodeItems.length - 2].classList.contains("timeline-node-highlight")) {
                    updateTimelineNodeStyle("Ending", viewOfStoryTimeline);
                }
            }
        }
    }   
}

function moveToLeft(){
    const timelineNodeItems = document.querySelectorAll('.timeline-node');

    if(timelineNodeItems.length <= 10) {
        return;
    }

    let highlightNodeIdx = -1;

    timelineNodeItems.forEach((item, idx) => {
        if (item.classList.contains("timeline-node-highlight")) {
            highlightNodeIdx = idx;
        }
    })

    if(highlightNodeIdx < 5) {
        return;
    }

    const nodesContainer = document.querySelector('.timeline-nodes');
    let currentMargin = parseInt(nodesContainer.style.marginLeft, 10);
    if (isNaN(currentMargin)) {
        currentMargin = 0;
    }
    const newMargin = currentMargin - 100;
    nodesContainer.style.marginLeft = `${newMargin}px`;
}

export default updateTimelineStatus;