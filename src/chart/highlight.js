
function highlight(myChart, seriesIndex, dataIndex, isHighlight) {
    // console.log('echartsCoord', seriesIndex, dataIndex)
    if (isHighlight) {
        myChart.dispatchAction({
            type: 'downplay',
        });
        for (let i = 0; i < seriesIndex.length; i++) {
            myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: seriesIndex[i],
                dataIndex: dataIndex[i],
            });
        }
        // myChart.dispatchAction({
        //     type: 'highlight',
        //     seriesIndex: seriesIndex,
        //     dataIndex: dataIndex,
        // });
    } else {
        
    
    }
}


export default highlight;