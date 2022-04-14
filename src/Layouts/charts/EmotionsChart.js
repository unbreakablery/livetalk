import React, { useEffect } from 'react'
import Chart from 'react-apexcharts'
import { useSelector } from 'react-redux'
import './charts.scss'

function getArrayMax(array) {
    if (array.length) {
        return array.reduce((a, b) => Math.max(a, b))
    }
}
function getArrayMin(array) {
    if (array.length) {
        return array.reduce((a, b) => Math.min(a, b))
    }
}

const tooltipTemplate = ({ series, seriesIndex, dataPointIndex, w }) => {
    const template = (name, number, color) => '<div class="tooltips tooltip" style="background-color:#A6A7A7; padding-right: 5px" ><span class=name style=background-color:' + color + '>' + name + '</span><span class="number">' + number + '</span></div >'
    let datapointsArray = series.map(value => value[dataPointIndex])

    let max = getArrayMax(datapointsArray)
    const mapObj = {
        "0": {
            emotion: "Anger",
            color: "#4CC9F0"
        },
        "1": {
            emotion: "Disgust",
            color: "#3F37C9"
        },
        "2": {
            emotion: "Fear",
            color: "#7209B7",
        },
        "3": {
            emotion: "Joy",
            color: "#F72585"
        },
        "4": {
            emotion: "Sadness",
            color: "#4361EE"
        },
        "5": {
            emotion: "Surprise",
            color: "#B5179E"
        },
        "6": {
            emotion: "Neutral",
            color: "#480CA8"
        },
    }

    return `${template(mapObj[datapointsArray.indexOf(max)].emotion, max.toPrecision(2), mapObj[datapointsArray.indexOf(max)].color)}`
    //  ${template("Joy", series[0][dataPointIndex].toPrecision(2), "#F72585")}
    //  ${template("Surprise", series[1][dataPointIndex].toPrecision(2), "#B5179E")}
    //  ${template("Fear", series[2][dataPointIndex].toPrecision(2), "#7209B7")}
    // ${template("Neutral", series[3][dataPointIndex].toPrecision(2), "#480CA8")}
    // ${template("Disgust", series[4][dataPointIndex].toPrecision(2), "#3F37C9")}
    // `${template("Sadness", series[5][dataPointIndex].toPrecision(2), "#4361EE")}`
    // return `${template("Anger", series[6][dataPointIndex].toPrecision(2), "#4CC9F0")}`
}

export default function ({ xaxis, seriesArray }) {
    const stateR = useSelector(state => state.states)
    let cursor2 = document.createElement("div")
    const { videoPosition } = stateR

    const duration = stateR && stateR.data && stateR.data.metadata.duration

    useEffect(() => {
        if (document.querySelector('foreignObject')) {
            if (document.querySelectorAll('foreignObject .chart-cursor')) {
                document.querySelectorAll('foreignObject .chart-cursor').forEach(elem => {
                    elem.remove()
                })
            }
            console.log('DOM ready')
            cursor2.classList.add('chart-cursor')
            document.querySelector('foreignObject').appendChild(cursor2)
        }
    })

    cursor2.style.left = "calc(" + ((videoPosition / duration) * 97.5).toString() + "% + 12px)"

    let angerArr = [],
        disgustArr = [],
        fearArr = [],
        happinessArr = [],
        sadnessArr = [],
        surpriseArr = [],
        neutralArr = [];

    seriesArray.map(arr => {
        if (arr && arr.length) {
            const [
                anger,
                disgust,
                fear,
                happiness,
                sadness,
                surprise,
                neutral,
            ] = arr
            angerArr.push(anger)
            disgustArr.push(disgust)
            fearArr.push(fear)
            happinessArr.push(happiness)
            sadnessArr.push(sadness)
            surpriseArr.push(surprise)
            neutralArr.push(neutral)
        }
    })

    const series = [
        {
            name: "Anger",
            type: "line",
            data: angerArr,
            color: "#4CC9F0",
        },
        {
            name: "Disgust",
            type: "line",
            data: disgustArr,
            color: '#3F37C9',
        },
        {
            name: "Fear",
            type: "line",
            data: fearArr,
            color: '#7209B7',
        },
        {
            name: "Hapiness",
            type: "line",
            data: happinessArr,
            color: '#F72585',
        },
        {
            name: "Sadness",
            type: "line",
            data: sadnessArr,
            color: '#4361EE',
        },
        {
            name: "Surprise",
            type: "line",
            data: surpriseArr,
            color: '#B5179E',
        },
        {
            name: "Neutral",
            type: "line",
            data: neutralArr,
            color: '#480CA8',
        },
    ]

    const arrayMax = getArrayMax([angerArr,
        disgustArr,
        fearArr,
        happinessArr,
        sadnessArr,
        surpriseArr,
        neutralArr].flat())
        
    const arrayMin = getArrayMin([angerArr,
        disgustArr,
        fearArr,
        happinessArr,
        sadnessArr,
        surpriseArr,
        neutralArr].flat())

    const options = {
        tooltip: {
            enabled: true,
            custom: tooltipTemplate,
            x: {
                show: false,
            }
        },
        chart: {
            background: "#232424",
            height: 200,
            animations: {
                enabled: false,
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: {
                    show: false
                }
            }
        },
        stroke: {
            curve: 'smooth',
            colors: ['#4CC9F0', '#3F37C9', '#7209B7', '#F72585', '#4361EE', '#B5179E', '#480CA8'],
            width: 4,
        },
        title: {
            text: '',
            align: 'right'
        },
        markers: {
            size: 0
        },
        xaxis: {
            type: 'category',
            tickAmount: 17,
            categories: xaxis,
            cssClass: 'apexcharts-yxaxis-label',
            labels: {
                show: true,
                align: 'left',
                hideOverlappingLabels: true,
                rotate: 0,
                style: {
                    colors: '#fff',
                    fontSize: '14px',
                    fontFamily: 'OpenSans-Light',
                    cssClass: 'apexcharts-xaxis-label',
                },
            },
            axisBorder: {
                show: false,
            },
            crosshairs: {
                show: true,
                position: 'back',
                stroke: {
                    color: '#b6b6b6',
                    width: 1,
                    dashArray: 0,
                },
            },
            axisTicks: {
                show: true,
            },

        },
        yaxis: {
            show: true,
            seriesName: "Anger",
            min: arrayMin,
            max: arrayMax,
            labels: {
                show: false,
                style: {
                    colors: '#fff',
                    fontSize: '14px',
                    fontFamily: 'OpenSans-Light',
                    cssClass: 'apexcharts-yaxis-label',
                },
            },
            axisTicks: {
                show: true,
                borderType: 'solid',
                color: '#fff',
                width: 6,
                offsetX: 0,
                offsetY: 0
            },

        },
        legend: {
            show: true,
            fontWeight: 300,
            fontFamiliy: 'Open Sans',
            fontSize: '14px',
            position: "top",
            horizontalAlign: "right",
            labels: {
                useSeriesColors: true
            }
        },
    }

    return (
        <div className="chart-wrapper">
            <Chart
                series={series}
                type="line"
                width={"100%"}
                height="200"
                options={options}
            />
        </div>
    )
}
