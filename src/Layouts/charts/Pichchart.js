import React, { Component } from "react";
import Chart from "react-apexcharts";
import { Fab } from '@material-ui/core'
import './charts.scss'
const tooltipTemplate = ({ series, seriesIndex, dataPointIndex, w }) => {

  return `<div class="tooltip">${dataPointIndex * 10} sy/sc</div>`;
}


export default class Picchart extends Component {
  constructor(props) {
    super(props);
    let { options } = props;
    this.state = {
      options: {
        tooltip: {
          enabled: true,
          custom: tooltipTemplate,
          x: {
            show: true,
          }
        },
        chart: {
          id: "basic-bar",
          animations: {
            enabled: false,
          },
          toolbar: {
            show: false
          },
        },
        colors: [( ( options && options.barColor ) || '#4CC9F0')],
        xaxis: {
          type: "category",
          categories: this.getX(props.data),
          labels: {
            rotate: 0,
            show: true,
            hideOverlappingLabels: true,
            offsetY: 3,
            style: {
              colors: ( ( options && options.axisColor ) || '#fff'),
              fontSize: '16px',
              fontFamily: "OpenSans-light",
            },
          },
          // max: 500,
          cssClass: 'apexcharts-xaxis-label',
          tickAmount: 10,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            offsetY: 5,
          }
        },
        yaxis: [{
          axisBorder: {
            show: true,
            color: '#EBEEF2',
            offsetY: 5,
          },
          labels: {
            show: false,
          }
        }],
        grid: {
          yaxis: {
            lines: {
              show: false
            }
          },
        },
        plotOptions: {
          bar: {
            // borderRadius: 10,
            horizontal: false,
            columnWidth: '80%',
          },

        },
        dataLabels: {
          enabled: false,
        },
        annotations: {
          xaxis: [
            {
              x: this.getMeanX(props.data),
              strokeDashArray: 4,
              strokeWidth: 3,
              borderColor: '#f72585',
              label: {
                borderColor: '#f72585',
                orientation: 'horizontal',
              }
            }
          ]
        }

      },
      series: [
        {
          name: "series-1",
          data: this.getY(props.data)
        }
      ],
      mean: this.getMean(props.data)
    };
  }

  getX() {
    let xAxis = []
    for (let i = 0; i <= 500; i += 10) {
      xAxis.push(i)
    }
    return this.props.skipping ? xAxis.map((e,index) => index!==0 && (index % 2)!== 0 ? '' : e ) : xAxis;
  }

  getY(data) {
    let histogram = []
    let xAxis = []
    for (let i = 0; i < 500; i += 10) {
      histogram.push(0)
      xAxis.push(i)
    }
    data.forEach((p) => {
      for (let i = 0; i < 500; i += 10) {
        if (p >= i && p < i + 10)
          histogram[i / 10]++
      }
    })
    return histogram
  }

  getMean(data) {
    const n = data.length
    return n ? (data.reduce((a, b) => a + b) / n).toFixed(1) : 0
  }

  getMeanX(data) {
    let mean = parseInt(this.getMean(data))
    return mean - (mean % 10)
  }
  /*
    componentDidUpdate() {
      let pitch = this.props.data;
      let histogram = []
      let xAxis = []
      for(let i=0; i<500; i+=10) {
        histogram.push(0)
        xAxis.push(i)
      }
          
  
      pitch.forEach((p)=> {
          for(let i=0; i<500; i+=10){
              if( p >= i && p < i+10 )
                  histogram[i/10]++
          }
      })
  
      
  
      this.setState({ options: {
        chart: {
          id: "basic-bar",
          toolbar: {
            show: false
          },
          
        },
        colors:['#4CC9F0'],
        xaxis: {
          categories: xAxis,
          labels:{
              show: true,
              style: {
                colors: "#fff",
                fontSize: '14px',
            },
          }
        },
        yaxis:[{
            axisBorder: {
                show: true,
                color: '#EBEEF2',
                offsetX: 0
            },
            labels: {
                show: false,
            }
        }],
        grid: {
            yaxis: {
                lines: {
                    show: false
                }
            }, 
        },
        plotOptions: {
            bar: {
                horizontal: false,
                startingShape: 'rounded',
                endingShape: 'rounded',
                columnWidth: '70%',
            },
           
        },
        dataLabels: {
            enabled: false,
        },
       
      }})
      this.setState({ series : [
        {
          name: "series-1",
          data: histogram
        }
      ]})
    }
    */

  render() {
    return (
      <div className="app mt-10">
        <div className="row">
          <div className="mixed-chart">
            {this.state.series && this.state.options && <Chart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              width="65%"
              height="320"
            />
            }
            <Fab
              variant="extended"
              className="capitalize btn-custom"
            >
              {Math.round(this.state.mean)/*this.state.mean*/}
              <i className="not-italic">HZ</i>
            </Fab>
            {/* 
                  <div className="top-line"></div>
                */}
          </div>
        </div>
      </div>
    );
  }
}