const timelineNodes = document.querySelector('.timeline-nodes');
const timelineScript = document.querySelector('.timeline-script-content');


function updateTimelineStatus(viewOfStoryTimeline, chartOption, text) {
    console.log("updateTimelineStatus", viewOfStoryTimeline);
    console.log("updateTimelineStatus", chartOption)

    const timelineNodeItems = document.querySelectorAll('.timeline-node');
    let highlightIdx = -1;
    timelineNodeItems.forEach((item, idx) => {
        if (item.classList.contains("timeline-node-highlight")) {
            highlightIdx = idx;
        }
    })

    viewOfStoryTimeline.forEach((content, idx) => {
        if (idx <= highlightIdx) { return;}

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
            checkDataElement(content.timeNode, chartOption, viewOfStoryTimeline, text);
        }
        if (content.type === "Ending") {
            checkEnding(chartOption, viewOfStoryTimeline, text);
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
        updateTimelineNodeStyle("X-Axis Line");
        //  removeHighlightOfTimelineNode();
        //  const timelineNodeItems = document.querySelectorAll('.timeline-node');
        // const timelineNodeLabels = document.querySelectorAll('.timeline-node-label');
        // timelineNodeItems[1].classList.remove("timeline-node-future");
        //  timelineNodeItems[1].classList.add("timeline-node-highlight");
        //  timelineNodeLabels[1].classList.add("timeline-node-label-highlight");
        //  timelineScript.textContent = viewOfStoryTimeline[1].script;
     }
}

function checkXAxis(chartOption, viewOfStoryTimeline) {
    if (!chartOption.xAxis) {
        return; 
     }
 
     if(chartOption.xAxis && chartOption.xAxis.axisLine && chartOption.xAxis.axisLine.show) {
        updateTimelineNodeStyle("X-Axis");
     }
}

function checkXAxisTick(chartOption, viewOfStoryTimeline) {
    if (!chartOption.xAxis) {
        return; 
     }
 
     if(chartOption.xAxis && chartOption.xAxis.axisLine && chartOption.xAxis.axisLine.show) {
        if (chartOption.xAxis.data && chartOption.xAxis.data.length > 0) {
            if (chartOption.xAxis.axisLabel && chartOption.xAxis.axisLabel.show) {
                updateTimelineNodeStyle("X-Axis Tick");
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
        updateTimelineNodeStyle("Y-Axis Line");
    }
}

function checkYAxisTick(chartOption, viewOfStoryTimeline) {
    if (!chartOption.yAxis) {
        return; 
     }
 
    if(chartOption.yAxis && chartOption.yAxis.axisLine && chartOption.yAxis.axisLine.show) {
        updateTimelineNodeStyle("Y-Axis Tick");
    }
}

function checkYAxis(chartOption, viewOfStoryTimeline) {
    if (!chartOption.yAxis) {
        return; 
     }
 
    if(chartOption.yAxis && chartOption.yAxis.axisLine && chartOption.yAxis.axisLine.show) {
        updateTimelineNodeStyle("Y-Axis");
    }
}

function checkDataElement(nodeName, chartOption, viewOfStoryTimeline, text) {
    let idx = -1;

    if(!text.toLowerCase().includes(nodeName.toLowerCase())) {
        return;
    }

    if(chartOption.xAxis && chartOption.xAxis.axisLine && chartOption.xAxis.axisLine.show) {
        if (chartOption.xAxis.data && chartOption.xAxis.data.length > 0) {
            if (chartOption.xAxis.axisLabel && chartOption.xAxis.axisLabel.show) {
                chartOption.xAxis.data.forEach((item, index) => {
                    if (item === nodeName) {
                        idx = index;
                    }
                })

                if (idx > -1) {
                    // check if the data-elem is have been shown
                    if (chartOption.series && chartOption.series.length > 0) {
                        if (chartOption.series[0].data && chartOption.series[0].data.length > 0) {
                            if (chartOption.series[0].data[idx]) {
                                updateTimelineNodeStyle(nodeName);
                            }
                        }
                    }
                }

            }
        }
     }
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

function updateTimelineNodeStyle(nodeName) {
    const timelineNodeItems = document.querySelectorAll('.timeline-node');
    const timelineNodeLabels = document.querySelectorAll('.timeline-node-label');
    timelineNodeItems.forEach(item => {
        item.classList.remove("timeline-node-highlight");
    })
    timelineNodeLabels.forEach(item => {
        item.classList.remove("timeline-node-label-highlight");
    })
    timelineNodeItems.forEach((item, idx) => {
        if (item.textContent.toLowerCase() === nodeName.toLowerCase()) {
            item.classList.add("timeline-node-highlight");
            item.classList.remove("timeline-node-future");
            timelineNodeLabels[idx].classList.add("timeline-node-label-highlight");
        }
    })

    // check if the timeline node is out of the screen
    moveToLeft();
}

function checkEnding(chartOption, viewOfStoryTimeline, text) {

    if(!chartOption.xAxis || !chartOption.xAxis.data) {
        return;
    }

    const dataLen = chartOption.xAxis.data.length;
    const nodeName = viewOfStoryTimeline[viewOfStoryTimeline.length - 2].timeNode;
    if (chartOption.series && chartOption.series.length > 0) {
        if (chartOption.series[0].data && chartOption.series[0].data.length >= dataLen) {
            // if (text.includes(nodeName)) {
            //     removeHighlightOfTimelineNode();
            //     const timelineNodeItems = document.querySelectorAll('.timeline-node');
            //     const timelineNodeLabels = document.querySelectorAll('.timeline-node-label');
            //     timelineNodeItems[timelineNodeItems.length - 1].classList.remove("timeline-node-future");
            //     timelineNodeItems[timelineNodeItems.length - 1].classList.add("timeline-node-highlight");
            //     timelineNodeLabels[timelineNodeLabels.length - 1].classList.add("timeline-node-label-highlight");
            //     timelineScript.textContent = viewOfStoryTimeline[viewOfStoryTimeline.length - 1].script;
            // }
            const timelineNodeItems = document.querySelectorAll('.timeline-node');
            if (timelineNodeItems[timelineNodeItems.length - 2].classList.contains("timeline-node-highlight")) {
                updateTimelineNodeStyle("Ending");
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