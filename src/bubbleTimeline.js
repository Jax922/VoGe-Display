import { time } from "echarts";


const timelineMoreInfoBtn = document.querySelector('.timeline-more-info');
const timelineLessInfobtn = document.querySelector('.timeline-less-info');
const timelineContainer = document.querySelector('.timeline-container');
const timelineScriptContainer = document.querySelector('.timeline-script');
const timelineNodes = document.querySelector('.timeline-nodes');
const timelineScript = document.querySelector('.timeline-script-content');

function createTimeline(page) {

  const storyTimeline = page.storyTimeline;
  const optionData = JSON.parse(page.data);
  const viewOfStoryTimeline = handleViewOfStoryTimeline(storyTimeline, optionData.customOption.mode == "immediate");

  console.log("storyTimeline", storyTimeline);

  // render timeline nodes
  timelineNodes.innerHTML = "";
  viewOfStoryTimeline.forEach((node, idx) => {
    timelineNodes.appendChild(createTimelineNode(node.timeNode, idx));
  });

  // render timeline script
  timelineScript.textContent = viewOfStoryTimeline[0].script; // default script

  timelineLessInfobtn.addEventListener('click', () => {
    timelineContainer.style.height = "80px";
    timelineMoreInfoBtn.style.display = "inline-block";
    timelineLessInfobtn.style.display = "none";
    timelineScriptContainer.style.display = "none";
  });

  timelineMoreInfoBtn.addEventListener('click', () => {
    timelineContainer.style.height = "150px";
    timelineMoreInfoBtn.style.display = "none";
    timelineLessInfobtn.style.display = "inline-block";
    timelineScriptContainer.style.display = "block";
  });

  return viewOfStoryTimeline;
}

function createTimelineNode(nodeName, idx) {
  var node = document.createElement("div");
  node.classList.add("timeline-node");

  // node.style.marginLeft = "30px";
  // node.style.width = "200px";

  //timeline-node-future
  if (idx > 0) {
    node.classList.add("timeline-node-future");
  }

  //timeline-node-highlight
  if(idx == 0){
    node.classList.add("timeline-node-highlight");
  }

  node.setAttribute("data-node-index", idx);

  var label = document.createElement("div");
  label.classList.add("timeline-node-label");

  // timeline-node-label-highlight
  if(idx == 0){
    label.classList.add("timeline-node-label-highlight");
  }

  label.textContent = nodeName; 

  label.style.overflowWrap = "break-word";
  label.style.fontSize = "10px";
  // label.style.width = "inherit";
  // label.style.marginLeft = "30px";

  node.appendChild(label);

  return node;
}

const findTimeNodes = (contents) => {
  let timeNodes = [];
  contents.forEach(content => {
      timeNodes.push(content.timeNode);
  });
  return timeNodes;
}

const handleViewOfStoryTimeline = (storyTimeline, isImmediate) => {
  let viewOfStoryTimeline = [];
  storyTimeline.forEach(node => {
      if (node.isShow) {
          if (node.nodeName === "Warm-up") {
              node.contents.forEach(content => {
                  viewOfStoryTimeline.push(content);
              });
          }
          if (node.nodeName === "X-Axis") {
              // if(node.mode === "splitAxis" && !isImmediate) {
              //     localStorage.setItem('xAxisMode', 'splitAxis');
              //     node.contents.forEach(content => {
              //         viewOfStoryTimeline.push(content);
              //     });
              // } else { // combineAxis
              if(node.mode === "splitAxis"){
                localStorage.setItem('xAxisMode', 'splitAxis');
              } else {
                localStorage.setItem('xAxisMode', 'combineAxis');
              }
                  // localStorage.setItem('xAxisMode', 'combineAxis');
                  let timeNodes = findTimeNodes(node.contents);
                  let content = {
                      type: "X-Axis",
                      timeNode: "X-Axis",
                      script: node.contents.map(content => content.script).join("\n")
                  }
                  viewOfStoryTimeline.push(content);
              // }
          }
          if (node.nodeName === "Y-Axis") {
              // if(node.mode === "splitAxis" && !isImmediate) {
              //     localStorage.setItem('yAxisMode', 'splitAxis');
              //     node.contents.forEach(content => {
              //         viewOfStoryTimeline.push(content);
              //     });
              // } else { // combineAxis
              if(node.mode === "splitAxis"){
                localStorage.setItem('yAxisMode', 'splitAxis');
              } else {
                localStorage.setItem('yAxisMode', 'combineAxis');
              }
                  // localStorage.setItem('yAxisMode', 'combineAxis');
                  let timeNodes = findTimeNodes(node.contents);
                  let content = {
                      type: "Y-Axis",
                      timeNode: "Y-Axis",
                      script: node.contents.map(content => content.script).join("\n")
                  }
                  viewOfStoryTimeline.push(content);
              // }
          }
          if (node.nodeName === "Data Element") {
              node.contents.forEach(content => {
                  let obj = JSON.parse(JSON.stringify(content));
                  obj.timeNode = obj.timeNode + "-" + obj.dataNode;
                  viewOfStoryTimeline.push(obj);
              });
          }
          if (node.nodeName === "Ending") {
              node.contents.forEach(content => {
                  viewOfStoryTimeline.push(content);
              });
          }
      }
  });
  return viewOfStoryTimeline;
}

export default {createTimeline};