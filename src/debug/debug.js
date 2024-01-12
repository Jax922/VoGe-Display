

const rightPointElem = document.createElement('div');
const leftPointElem = document.createElement('div');

function updateGesture(left, right) {
    document.getElementById('debug-left-gesture').innerHTML = left;
    document.getElementById('debug-right-gesture').innerHTML = right;
}

function showPointPosition(handName, x, y) {
    let pointElem;
    if (handName === 'left') {
        pointElem = leftPointElem;
    } else {
        pointElem = rightPointElem;
    }

    pointElem.style.display = 'block';
    pointElem.classList.add('debug-point');
    pointElem.style.left = `${x}px`;
    pointElem.style.top = `${y}px`;
    document.body.appendChild(pointElem);
}

function hiddlePointPosition(handName) {
    let pointElem;
    if (handName === 'left') {
        pointElem = leftPointElem;
    } else {
        pointElem = rightPointElem;
    }
    pointElem.style.display = 'none';
}


export default {
    updateGesture,
    showPointPosition,
    hiddlePointPosition,
};