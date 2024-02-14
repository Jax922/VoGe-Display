
function updateTimelineStatusImmediate(viewOfStoryTimeline, xAxisVoices, yAxisVoices, xTicks, yLabels, text) {
    const timelineNodeItems = document.querySelectorAll('.timeline-node');
    let highlightIdx = -1;
    timelineNodeItems.forEach((item, idx) => {
        if (item.classList.contains("timeline-node-highlight")) {
            highlightIdx = idx;
        }
    })

    const timelineNodeItemsArray = Array.from(timelineNodeItems);
    // const restTimelineNodes = timelineNodeItemsArray.slice(highlightIdx + 1);
    // const restTimelineNodes = timelineNodeItemsArray.slice(highlightIdx + 1, timelineNodeItems.length);

    // if (highlightIdx == viewOfStoryTimeline.length - 1) {
    //     // into the ending
    //     setInterval(() => {
    //         updateTimelineNodeStyle("Ending");
    //     }, 3000);

    //     return;
    // }

    const rests = viewOfStoryTimeline.slice(highlightIdx + 1, viewOfStoryTimeline.length);

    viewOfStoryTimeline.forEach((content, idx) => {
        if (idx <= highlightIdx) { return;}

        if(content.timeNode === "Warm-up") {
            checkWarmUp();
        }



        if (content.type === "X-Axis") {
            if(content.timeNode === "X-Axis Line") {
                checkXAxisLine(text, xAxisVoices, xTicks, viewOfStoryTimeline);
            }
            if(content.timeNode === "X-Axis Tick") {
                checkXAxisTick(text, xAxisVoices, xTicks, viewOfStoryTimeline);
            }
            if(content.timeNode === "X-Axis") {
                checkXAxisLine(text, xAxisVoices, xTicks, viewOfStoryTimeline);
            }
            return;
        }

        if (content.type === "Y-Axis") {
            // checkYAxis(chartOption, viewOfStoryTimeline);
            if (content.timeNode === "Y-Axis Line") {
                checkYAxisLine(text, yAxisVoices, yLabels, viewOfStoryTimeline);
            }
            if (content.timeNode === "Y-Axis Tick") {
                checkYAxisTick(text, yAxisVoices, yLabels, viewOfStoryTimeline);
            }
            if (content.timeNode === "Y-Axis") {
                checkYAxis(text, yAxisVoices, yLabels, viewOfStoryTimeline);
            }
            return;
        }

        if (content.type === "Data-Element") {
            checkDataElement(text, content.timeNode, viewOfStoryTimeline);
            return;
        }
        // if (content.type === "Ending") {
        //     checkEnding(chartOption, viewOfStoryTimeline, text);
        // }
    })

}

function checkWarmUp(chartOption) {

}

function checkXAxisLine(text, xAxisVoices, xTicks, viewOfStoryTimeline) {
    if (xAxisVoices.some(item => text.includes(item))) {
        updateTimelineNodeStyle("X-Axis");
    }
}

function checkXAxisTick(text, xAxisVoices, xTicks, viewOfStoryTimeline) {
    // if(xAxis.some(item => text.includes(item))) {
        if (xTicks.some(item => text.includes(item))) {
            updateTimelineNodeStyle("X-Axis Tick");
        } 

}

function checkYAxisLine(text, yAxisVoices, yLabels, viewOfStoryTimeline) {

    if (yAxisVoices.some(item => text.includes(item))) {
        updateTimelineNodeStyle("Y-Axis Line");
    }
}

function checkYAxisTick(text, yAxisVoices, yLabels, viewOfStoryTimeline) {

    if (yLabels.some(item => text.includes(item))) {
        updateTimelineNodeStyle("Y-Axis Tick");
    }
}

function checkYAxis(text, yAxisVoices, yLabels, viewOfStoryTimeline) {
    
        if (yAxisVoices.some(item => text.includes(item))) {
            updateTimelineNodeStyle("Y-Axis");
        }
}

function checkDataElement(text, nodeName, viewOfStoryTimeline) {
    nodeName = nodeName.toLowerCase();
    if (text.includes(nodeName)) {
        updateTimelineNodeStyle(nodeName);
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

function checkXAxis(chartOption, viewOfStoryTimeline) {

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

export default updateTimelineStatusImmediate;