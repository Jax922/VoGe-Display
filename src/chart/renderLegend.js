function hexToRgba(hex, alpha = 1) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function createLegend(myChart) {

    const options = myChart.getOption();
    console.log("legend--->", options);
    const colors = options.color;
    const legends = []

    
    console.log('legend', options)

    if (options.legend) {
        if (options.legend.length > 0 && options.legend[0].show === false) {
            return;
        }
    }

    for (let i = 0; i < options.series.length; i++) {
        let color = colors[i];
        if (options.series[i].itemStyle && options.series[i].itemStyle.color) {
            color = options.series[i].itemStyle.color;
        }
        legends.push({
            name: options.series[i].name,
            color: color,
        });
    }

    let legendContainer = document.getElementById('legend-container');
    let isAppend = false;
    if (!legendContainer) {
        legendContainer = document.createElement('div');
        legendContainer.id = 'legend-container';
        isAppend = true;
    } else {
        legendContainer.innerHTML = '';
    }

    if (options.series.length < 2) {
        return;
    }

    legendContainer.style.width = '20%';
    // legendContainer.style.height = '50px';
    legendContainer.style.position = 'absolute';
    legendContainer.style.top = `-${legends.length*50}px`;
    legendContainer.style.left = '0';
    legendContainer.style.display = 'flex';
    legendContainer.style.flexDirection = 'column'; 
    legendContainer.style.alignItems = 'center';



    for (let i = 0; i < legends.length; i++) {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-items';
        legendItem.style.display = 'inline-block';
        legendItem.style.margin = '5px 0px';
        legendItem.style.minWidth = '200px';
        legendItem.style.height = '50px';
        legendItem.style.textAlign = 'center';
        legendItem.style.lineHeight = '50px';
        legendItem.style.verticalAlign = 'middle';
        legendItem.style.color = legends[i].color;
        legendItem.style.border = '1px solid';
        legendItem.style.borderColor = legends[i].color;
        legendItem.style.borderRadius = '5px';
        legendItem.style.paddingLeft = '10px';
        legendItem.style.paddingRight = '10px';
        legendItem.style.backgroundColor = hexToRgba(legends[i].color, 0.3);
        legendItem.style.fontSize = '30px';
        legendItem.setAttribute('data-name', i);

        legendItem.innerHTML = legends[i].name;
        legendContainer.appendChild(legendItem);
    }

    if (isAppend) {
        const container = document.getElementById('chart-container');
        container.prepend(legendContainer);
    }
}

export default createLegend;