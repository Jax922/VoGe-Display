

const rightPointElem = document.createElement('div');
const leftPointElem = document.createElement('div');

function updateGesture(left, right) {
    document.getElementById('debug-left-gesture').innerHTML = left;
    document.getElementById('debug-right-gesture').innerHTML = right;
}

function showPointPosition(handName, x, y) {

    if(localStorage.getItem('debugActive') !== 'true') {
        return;
    }

    let pointElem;
    if (handName === 'left') {
        pointElem = leftPointElem;
    } else {
        pointElem = rightPointElem;
    }

    const windowWidth = window.innerWidth;
    const windowOffsetLeft = (windowWidth-1280) / 2;

    pointElem.style.display = 'block';
    pointElem.classList.add('debug-point');
    pointElem.style.left = `${x+windowOffsetLeft}px`;
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