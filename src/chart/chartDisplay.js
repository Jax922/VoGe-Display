import * as echarts from 'echarts';
import {transform} from 'echarts-stat';

echarts.registerTransform(transform.histogram);
echarts.registerTransform(transform.clustering);

function chartDisplay() {
    const container = document.getElementById('chart-container');
    const chartDom = document.createElement('div');
    chartDom.id = 'chartdom';
    chartDom.style.width = '1180px';
    chartDom.style.height = '400px';
    chartDom.style.padding = '0';
    chartDom.style.position = 'fixed';
    chartDom.style.bottom = '0';
    chartDom.style.left = '0';

    const myChart = echarts.init(chartDom, null, {
        renderer: 'canvas'
    });
    container.prepend(chartDom);

    
    return myChart;
}




export default chartDisplay;

