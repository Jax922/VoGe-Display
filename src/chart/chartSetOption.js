
let sizeFunction = function (x) {
    var y = Math.sqrt(x / 5e8) + 0.1;
    return y * 90;
};



function calculateBubbleSize(minValue, maxValue, minSize, maxSize) {

    return function (x) {
      const normalized = (x - minValue) / (maxValue - minValue);
      return normalized * (maxSize - minSize) + minSize;
    }
  
}

function setOption(myChart, data, isMerge = false) {
    console.log('setOption=====>', data);
    if (data && data.options) {
        // if (data.customOption.maxValue) {
        //     sizeFunction = calculateBubbleSize(data.customOption.minValue, data.customOption.maxValue, data.customOption.minSize, data.customOption.maxSize);
        //   } else {
        //     sizeFunction = function (x) {
        //       var y = Math.sqrt(x / 5e8) + 0.1;
        //       return y * 80;
        //     };
        // }
        for (let i = 0; i < data.options.length; i++) {
            for (let j = 0; j < data.options[i].series.length; j++) {
                if (data.options[i].series[j].symbolSize) {
                    data.options[i].series[j].symbolSize = function (val) {
                        return sizeFunction(val[2]);
                    }
                }
            }
        }
    }

    if (data && data.baseOption) {
        // if (data.customOption.maxValue) {
        //     sizeFunction = calculateBubbleSize(data.customOption.minValue, data.customOption.maxValue, data.customOption.minSize, data.customOption.maxSize);
        //   } else {
        //     sizeFunction = function (x) {
        //       var y = Math.sqrt(x / 5e8) + 0.1;
        //       return y * 80;
        //     };
        // }
        for (let j = 0; j < data.baseOption.series.length; j++) {
            if (data.baseOption.series[j].symbolSize) {
                data.baseOption.series[j].symbolSize = function (val) {
                    if (val) {
                        return sizeFunction(val[2]);
                    } else {
                        return 0;
                    }
                }
            }
        }
    }


    // resize chart 
    if (data && data.customOption) {
        const chartContainer = document.getElementById('chart-container');
        const chartDom = document.getElementById('chartdom');
        if (data.customOption.height) {
            chartContainer.style.height = data.customOption.height;
            chartDom.style.height = data.customOption.height;
            myChart.resize();
        }
        if (data.customOption.width) {
            chartContainer.style.width = data.customOption.width;
            chartDom.style.width = data.customOption.width;
            myChart.resize();
        }
    }


    myChart.setOption(data, isMerge);
}

export default setOption;