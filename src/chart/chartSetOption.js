
const sizeFunction = function (x) {
    var y = Math.sqrt(x / 5e8) + 0.1;
    return y * 150;
};


function setOption(myChart, data) {
    if (data && data.options) {
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
        for (let j = 0; j < data.baseOption.series.length; j++) {
            if (data.baseOption.series[j].symbolSize) {
                data.baseOption.series[j].symbolSize = function (val) {
                    return sizeFunction(val[2]);
                }
            }
        }
    }


    // resize chart 
    console.log('data', data)
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


    myChart.setOption(data);
}

export default setOption;