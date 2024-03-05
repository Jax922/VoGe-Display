const timelineNodes = document.querySelector('.timeline-nodes');
const timelineScript = document.querySelector('.timeline-script-content');
const timelineScriptNext = document.querySelector('.timeline-script-content-next');

function updateBubbleChartTimeline(chartCurrentOption, viewOfStoryTimeline, text, myChart) {

    console.log("updateBubbleChartTimeline", viewOfStoryTimeline);

    const timelineNodeItems = document.querySelectorAll('.timeline-node');
    let highlightIdx = -1;

    timelineNodeItems.forEach((item, idx) => {
        if (item.classList.contains("timeline-node-highlight")) {
            highlightIdx = idx;
        }
    })

    if (chartCurrentOption.customOption.x_axis_show) {
        updateTimelineNodeStyle("X-Axis", viewOfStoryTimeline);
        // timelineScript.textContent = viewOfStoryTimeline[1].script;
        chartCurrentOption.customOption.timelineNodeIdx = 1;
    }

    if (chartCurrentOption.customOption.y_axis_show) {
        updateTimelineNodeStyle("Y-Axis", viewOfStoryTimeline);
        // timelineScript.textContent = viewOfStoryTimeline[2].script;
        chartCurrentOption.customOption.timelineNodeIdx = 2;
    }

    let matches = [];
    viewOfStoryTimeline.forEach((content, idx) => {
        if(content.dataNode) {
            const nodeName = extract_content(content.dataNode);
            let isMatch = text.toLowerCase().includes(nodeName.prefix.toLowerCase());
            if (nodeName.suffix && !isMatch) {
                isMatch = text.toLowerCase().includes(nodeName.suffix.toLowerCase());
            }

            if (isMatch) {
                matches.push({
                    name: content.timeNode,
                    index: idx
                });
            }
        }
    });

    const rightMatched = findClosestMatch(matches, chartCurrentOption.customOption.timelineNodeIdx);

    if (rightMatched) {
        updateTimelineNodeStyle(rightMatched.name, viewOfStoryTimeline);
        // timelineScript.textContent = viewOfStoryTimeline[rightMatched.index].script;
        chartCurrentOption.customOption.timelineNodeIdx = rightMatched.index;

        if(rightMatched.index === viewOfStoryTimeline.length - 2) {
            setTimeout(() => {
                updateTimelineNodeStyle("Ending", viewOfStoryTimeline);
                // timelineScript.textContent = viewOfStoryTimeline[viewOfStoryTimeline.length - 1].script;
                chartCurrentOption.customOption.timelineNodeIdx = viewOfStoryTimeline.length - 1;
            }, 10000);
        }
    }

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
    timelineNodeItems.forEach((item, idx) => {
        if (item.textContent.toLowerCase() === nodeName.toLowerCase()) {
            item.classList.add("timeline-node-highlight");
            item.classList.remove("timeline-node-future");
            timelineNodeLabels[idx].classList.add("timeline-node-label-highlight");
        }
    })

    viewOfStoryTimeline.forEach((content, idx) => {
        let timeNode = content.timeNode.replace(/\(.*?\)/gs, '');
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


    // check if the timeline node is out of the screen
    moveToLeft();
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

function extract_content(str) {
    const match = str.match(/([^()]+)(?:\(([^)]+)\))?/);
    if (match) {
      return {
        prefix: match[1].trim(),
        suffix: match[2] ? match[2].trim() : null 
      };
    }
    return { prefix: null, suffix: null };
}

function findClosestMatch(matches, timelineIndex) {
    let filteredMatchesUp = matches.filter(match => match.index > timelineIndex);
    let filteredMatchesDown = matches.filter(match => match.index <= timelineIndex);

    if (filteredMatchesUp.length > 0) {
        filteredMatchesUp.sort((a, b) => Math.abs(a.index - timelineIndex) - Math.abs(b.index - timelineIndex));
        return filteredMatchesUp[0];
    } else {
        filteredMatchesDown.sort((a, b) => Math.abs(a.index - timelineIndex) - Math.abs(b.index - timelineIndex));
        return filteredMatchesDown[0];
    }
}


export default updateBubbleChartTimeline;