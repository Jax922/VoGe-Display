/* eslint-disable padded-blocks */
/* eslint-disable semi */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable eol-last */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import * as fp from '../fingerpose'
import pointDescription from './definition/pointing.js'
import horizontalPalmDescription from './definition/horizontalPalm.js'
import twoPointDescription from './definition/twopointing.js'
import palmDescription from './definition/palm.js'
import DEBUG from '../debug/debug.js'

const landmarkColors = {
    thumb: 'red',
    index: 'blue',
    middle: 'yellow',
    ring: 'green',
    pinky: 'pink',
    wrist: 'white'
}

const gestureStrings = {
    // 'thumbs_up': '👍',
    // 'victory': '✌🏻'
}

async function createDetector() {
    return window.handPoseDetection.createDetector(
        window.handPoseDetection.SupportedModels.MediaPipeHands,
        {
            runtime: "mediapipe",
            modelType: "full",
            maxHands: 2,
            solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915`,
        }
    )
}


async function gestureHandleMain(gestureCallback, isDebug=false) {

    const video = document.querySelector("#video")
    // const canvas = document.querySelector("#pose-canvas")

    // const resultLayer = {
    //   right: document.querySelector("#pose-result-right"),
    //   left: document.querySelector("#pose-result-left")
    // }
    // configure gesture estimator
    // add "✌🏻" and "👍" as sample gestures
    const knownGestures = [
        // fp.Gestures.VictoryGesture,
        // fp.Gestures.ThumbsUpGesture,
        pointDescription,
        twoPointDescription,
        horizontalPalmDescription,
        palmDescription,
    ]
   
    const GE = new fp.GestureEstimator(knownGestures)
    // load handpose model
    const detector = await createDetector()
    console.log("mediaPose model loaded")

    // main estimation loop
    const estimateHands = async () => {

        // get hand landmarks from video
        const hands = await detector.estimateHands(video, {
            flipHorizontal: true
        })

        let leftText = 'No hand'
        let rightText = 'No hand'
        const leftHandInfo = {
            handedness: 'left',
            gesture: 'none',
            hand: null,
        }
        const rightHandInfo = {
            handedness: 'right',
            gesture: 'none',
            hand: null,
        }
        

        for (const hand of hands) {

            if (hand.handedness.toLowerCase() === 'left') {
                leftHandInfo.hand = hand;
            }

            if (hand.handedness.toLowerCase() === 'right') {
                rightHandInfo.hand = hand;
            }

            if (hand.handedness.toLowerCase() === 'left' && isDebug) {
                leftText = 'Hand detected'
            }
            else if (hand.handedness.toLowerCase() === 'right' && isDebug) {
                rightText = 'Hand detected'
            }
            const est = GE.estimate(hand.keypoints3D, 9);
            
            // console.log(est);
            
            if (est.gestures.length > 0) {

                // find gesture with highest match score
                let result = est.gestures.reduce((p, c) => {
                    return (p.score > c.score) ? p : c
                })
                const chosenHand = hand.handedness.toLowerCase()

                if (chosenHand === 'left') {
                    leftHandInfo.gesture = result.name
                    leftHandInfo.hand = hand
                }
                else {
                    rightHandInfo.gesture = result.name
                    rightHandInfo.hand = hand
                }


                if (isDebug) {
                    if (chosenHand === 'left') {
                        leftText = result.name
                        if (result.name === 'point') {
                            leftText += `(${hand.keypoints[8].x.toFixed(1)}, ${hand.keypoints[8].y.toFixed(1)})`
                            DEBUG.showPointPosition('left', hand.keypoints[8].x, hand.keypoints[8].y);
                        } else {
                            DEBUG.hiddlePointPosition('left');
                        }
                    }
                    else {
                        rightText = result.name
                        if (result.name === 'point') {
                            rightText += `(${hand.keypoints[8].x.toFixed(1)}, ${hand.keypoints[8].y.toFixed(1)})`
                            DEBUG.showPointPosition('right', hand.keypoints[8].x, hand.keypoints[8].y);
                        } else {
                            DEBUG.hiddlePointPosition('right');
                        }
                    }
                }
                //   resultLayer[chosenHand].innerText = gestureStrings[result.name]
                //   updateDebugInfo(est.poseData, chosenHand)
            }

        }
        gestureCallback(leftHandInfo, rightHandInfo);

        if (isDebug) {
            DEBUG.updateGesture(leftText, rightText);
            if (hands.length < 0) {
                DEBUG.hiddlePointPosition();
            }
        }
        setTimeout(() => { estimateHands() }, 1000 / 60);
    }

    estimateHands()
    console.log("Starting predictions")
}

export default gestureHandleMain;