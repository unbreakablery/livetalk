import React, { useEffect, useState } from 'react'
import Chart from "react-apexcharts";
import { secs2min } from '../../Components/utils/sec2min'
import { useSelector } from 'react-redux'
import './charts.scss'
import tooltipTemplate from '../../Components/utils/tooltipTemplate'


const options = {
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
    tooltip: {
        enabled: true,
        custom: tooltipTemplate,
        x: {
            show: false,
        }
    },
    dataLabels: {
        enabled: false
    },
    fill: {
        type: 'solid',
        colors: ['#7209B7']

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
        width: 2,
        colors: ['#4CC9F0'],
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
        max: 20,
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
            offsetX: 5,
            offsetY: 0
        },
    },
    legend: {
        show: true,
        fontWeight: 900
    },

}

export default function SpeedChart({ x, y }) {
    const stateR = useSelector(state => state.states)
    let cursor = document.createElement("div")
    document.querySelector('.apexcharts-canvas.apexcharts-theme-light')
    const { videoPosition } = stateR
    const duration = stateR && stateR.data && stateR.data.metadata.duration
    useEffect(() => {
        if (document.querySelector('.apexcharts-canvas.apexcharts-theme-light')) {
            if (document.querySelectorAll('.apexcharts-canvas.apexcharts-theme-light .chart-cursor-2')) {
                document.querySelectorAll('.apexcharts-canvas.apexcharts-theme-light .chart-cursor-2').forEach(elem => {
                    elem.remove()
                })
            }
            document.querySelector('.apexcharts-canvas.apexcharts-theme-light')
            console.log('DOM ready')
            cursor.classList.add('chart-cursor-2')
            document.querySelector('.apexcharts-canvas.apexcharts-theme-light').appendChild(cursor)
        }
    }, [videoPosition])

    cursor.style.left = "calc(" + ((videoPosition / duration) * 97.3).toString() + "% + 21px)"

    const series = [{
        data: x.map((x, i) => {
            return ({ x: x == 0 ? "0" : secs2min(x), y: y[i] })
        })
    }]

    return (
        <div className="chart-wrapper relative" >
            <Chart
                series={series}
                type="area"
                width={"100%"}
                height="200"
                options={options}
            />
            {/* <div className="speedchart-x-axis absolute" /> */}
        </div>
    )
} 