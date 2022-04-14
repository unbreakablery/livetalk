import React from 'react'
import ReactApexChart from "react-apexcharts";
import ApexCharts from 'apexcharts'
import tooltipTemplate from '../../Components/utils/tooltipTemplate'

var lastDate = 0;
var data = []
var buffer = []
var TICKINTERVAL = 86400000
let XAXISRANGE = 777600000
function getDayWiseTimeSeries(baseval, count, yrange) {
  var i = 0;
  while (i < count) {
    var x = baseval;
    var y = 0;

    data.push({
      x, y
    });
    lastDate = baseval
    baseval += TICKINTERVAL;
    i++;
  }
}

getDayWiseTimeSeries(new Date('02 Mar 2017 GMT').getTime(), 10)

function getNewSeries(baseval, value) {
  var newDate = baseval + TICKINTERVAL;
  lastDate = newDate

  for (var i = 0; i < data.length - 10; i++) {
    // IMPORTANT
    // we reset the x and y of the data which is out of drawing area
    // to prevent memory leaks
    data[i].x = newDate - XAXISRANGE - TICKINTERVAL
    data[i].y = 0
  }

  data.push({
    x: newDate,
    y: value
  })
}


export default class ApexChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      series: [{
        data: data.slice()
      }],
      options: {
        tooltip: {
          enabled: true,
          custom: tooltipTemplate,
          x: {
            show: false,
          }
        },
        chart: {
          id: 'realtime',
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 2000
            }
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
          type: 'datetime',
          range: XAXISRANGE,
          cssClass: 'apexcharts-yxaxis-label',
          labels: {
            show: true,
            align: 'left',
            datetimeFormatter: {
              day: 'd',
            },
            style: {
              colors: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff',],
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
            show: false,

          },
        },
        yaxis: {
          type: 'datetime',
          max: 10,
          labels: {
            show: true,
            style: {
              colors: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff',],
              // fontSize: '16px',
              fontSize: (window.innerWidth <= 1600)? "12px" : "16px",
              fontFamily: 'OpenSans-Light',
              cssClass: 'apexcharts-yaxis-label',
            },
            offsetX: -5,
          },
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#fff',
            width: 6,
            offsetX: 0,
            offsetY: -3
          },
        },
        legend: {
          show: true,
          fontWeight: 900
        },
      },
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.data && this.props.data.length && this.props.data.length !== prevProps.data.length) {

      console.log(this.props.data)
      console.log("New Speed Data", this.props.data)
      getNewSeries(lastDate, this.props.data[this.props.data.length-1].toFixed(2))
      ApexCharts.exec('realtime', 'updateSeries', [{
        data: data
      }])
    }
  }


  componentDidMount() {
    // window.setInterval(() => {
    // Get the last value of the buffer
    if (buffer.length) {
      getNewSeries(lastDate, buffer[buffer.length - 1])
      console.log("Data", data)
      ApexCharts.exec('realtime', 'updateSeries', [{
        data: data
      }])
    }
    // }, 2000)
  }

  render() {
    const chartHeight = (window.innerWidth <= 1300) ? "150" : ((window.innerWidth <= 1600) && (window.innerWidth > 1300) ) ? "200px" : ((window.innerWidth < 1850) && (window.innerWidth > 1600)) ? "300" : "385"

    return (
      <div id="realtime-speed-chart">
        <div className="speed-y-axis" />
        <ReactApexChart options={this.state.options} width={"100%"} series={this.state.series} type="area" height={chartHeight} />
        <div className="speed-x-axis">
          <span>-10</span>
          <span>-9</span>
          <span>-8</span>
          <span>-7</span>
          <span>-6</span>
          <span>-5</span>
          <span>-4</span>
          <span>-3</span>
          <span>-2</span>
          <span>-1</span>
          <span>now</span>
        </div>
      </div>)
  }
}
