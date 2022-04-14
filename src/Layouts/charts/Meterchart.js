import React from 'react'
import ReactSpeedometer from "../../Components/react-d3-speedometer"
import { Fab } from "@material-ui/core";

export default function Meterchart(props) {

  var rates = props.data;
  
  const get_median = arr => {
    const mid = Math.floor(arr.length / 2),
      nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  };

  const get_avg = arr => {
    const n = arr.length
    return arr.reduce((a, b) => a + b) / n
  }

  function get_standard_deviation(array) {
    const n = array.length
    const mean = get_avg(array)
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
  }

  var min = rates && Math.min(...rates);
  var max = rates && Math.max(...rates);
  var median = rates && get_median(rates);
  var std_dev = rates &&  get_standard_deviation(rates);
  var avg = rates && get_avg(rates);
  var range_min = parseFloat((avg - std_dev).toFixed(1));
  var range_max = parseFloat((avg + std_dev).toFixed(1));

  console.log("range_min", range_min)
  console.log("range_max", range_max)

  var stops = []
  var values = [];
  var customSegmentLabels = [];
  for(let i=0; i<=100; i+=1) {
    stops.push(parseFloat((i/10).toFixed(1)))
    // Segment labels
    if(i % 10 === 0 || i === 0 || i === 10)
      customSegmentLabels.push({
        text: (i/10).toFixed(0),
        position: "OUTSIDE",
        color: props.labelColor || '#FFF',
      });
    else
      customSegmentLabels.push({
        text: "",
        position: "OUTSIDE",
        color: props.labelColor || '#FFF',
      });
    // let index = parseInt(( Math.random() * 10 ) % 4)
    values.push(props.background || "#3B3C3D")
  }
  customSegmentLabels.pop()

  // Draw std_dev range
  for(let i=range_min; i<=range_max; i+=0.1){
    values[Math.round(i*10)] = "#7209B7";
  }

  values[min*10] = "#4CC9F0";
  values[max*10] = "#F72585";

  console.log("values", values)
  // draw min
  for(let i=max; i<=(max+0.1); i+=0.1){
    //values[max*10] = "#4CC9F0";
  }

  const speed = rates && [
    { text: "Minimum", btn: "interference", btnValue: min.toFixed(1), unit: "sy/sc" },
    { text: "Median", btn: "median", btnValue: median.toFixed(1), unit: "sy/sc" },
    {
      text: "Standard deviation",
      btn: "breathing",
      btnValue: std_dev.toFixed(1),
      unit: "sy/sc",
    },
    { text: "Maximum", btn: "silences", btnValue: max.toFixed(1), unit: "sy/sc" },
  ];
  

  
  return (
    <div>
    <div>
      <ReactSpeedometer
      customSegmentStops={stops}
      customSegmentLabels={customSegmentLabels}
      minValue={0}
      maxValue={10}
      segmentColors={values}
      width={350}
      height={220}
      value={median}
      needleColor={props.needleColor || "#fff"}
      currentValueText={""}
      />
    </div>
    <ul className="flex list justify-center">
    {speed?.map((val) => (
      <li key={val.text}>
        <Fab variant="extended" className={`inline-flex justify-between capitalize btn-${val.btn}`}>
          <span>{val.btnValue}</span>
          <span className="not-italic">{val.unit}</span>
        </Fab>
        <div className="text">{val.text}</div>
      </li>
    ))}
  </ul>
  </div>
  )
}
