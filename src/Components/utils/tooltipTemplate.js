const tooltipTemplate = ({ series, seriesIndex, dataPointIndex, w }) => {
    return `<div class="tooltip">${series[seriesIndex][dataPointIndex]} sy/sc</div>`;
}

export default tooltipTemplate