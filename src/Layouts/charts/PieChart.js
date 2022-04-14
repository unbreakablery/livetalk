import React, { PureComponent } from "react";
import createClass from "create-react-class";

import joyB from "../../assets/img/Joy (1).png";
import AngerB from "../../assets/img/Anger.png";
import DisgustB from "../../assets/img/Disgus.png";
import SurpriseB from "../../assets/img/Surprise.png";
import SadnessB from "../../assets/img/Sadness.png";
import FearB from "../../assets/img/Fear.png";
import NeutralB from "../../assets/img/Neutral.png";

import joy from "../../assets/img/Joy-neg_v2.svg";
import Anger from "../../assets/img/Anger-neg_v2.svg";
import Disgust from "../../assets/img/Disgust-neg_v2.svg";
import Surprise from "../../assets/img/Surprise-neg_v2.svg";
import Sadness from "../../assets/img/Sadness-neg_v2.svg";
import Fear from "../../assets/img/Fear-neg_v2.svg";
import Neutral from "../../assets/img/Neutra-neg_v2.svg";
import { PieChart, Pie, Cell } from "recharts";

let olddata = [
  { name: "Joy", value: 10, img: joy },
  { name: "Anger", value: 10, img: Anger },
  { name: "Disgust", value: 10, img: Disgust },
  { name: "Surprise", value: 10, img: Surprise },
  { name: "Sadness", value: 10, img: Sadness },
  { name: "Fear", value: 10, img: Fear },
  { name: "Neutral", value: 10, img: Neutral },
];

const COLORS = [
  "#F72585",
  "#4CC9F0",
  "#4361EE",
  "#3F37C9",
  "#480CA8",
  "#7209B7",
  "#B5179E",
];
const CustomizedLabel = createClass({
  render() {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      value,
      name,
      img,
      index,
      fill
    } = this.props;
    console.log(this.props)
    const RADIAN = Math.PI / 180;
    // eslint-disable-next-line
    const radius = 40 + innerRadius + (outerRadius - innerRadius);
    // eslint-disable-next-line
    const x = cx + radius * Math.cos(-midAngle * RADIAN) - 30;
    // eslint-disable-next-line
    const y = cy + radius * Math.sin(-midAngle * RADIAN) - 15;
    return (
      <g>
        <foreignObject
          x={index < 3 ? 0 : 400}
          y={index < 3 ? index*50 + 120 : index*50 - 50 }
          width={130}
          height={40}
        >
          <div className={`custom-label`} style={{backgroundColor: fill}}>
            <span className="top-label">
              <img src={img} className="float-left" alt="" />
              {name}
            </span>
            <span className="text">{value + "%"}</span>
          </div>
        </foreignObject>
      </g>
    );
  },
});

export default class Example extends PureComponent {
  render() {
    const emotion_data = this.props.data.emotions;
    if(this.props.isDarkMode) {
      olddata = [
        { name: "Joy", value: 10, img: joyB },
        { name: "Anger", value: 10, img: AngerB },
        { name: "Disgust", value: 10, img: DisgustB },
        { name: "Surprise", value: 10, img: SurpriseB },
        { name: "Sadness", value: 10, img: SadnessB },
        { name: "Fear", value: 10, img: FearB },
        { name: "Neutral", value: 10, img: NeutralB },
      ];
    }
    const { data } = emotion_data;
    var calculatedData = data[0].emotions[0];
    if(!calculatedData)
      return ( <div></div> );
    for (const [key, value] of Object.entries(data)) {
      calculatedData = calculatedData ? calculatedData.map((a, i) => a + ( value.emotions.length && value.emotions[0].length ? value.emotions[0][i] : 0 )) : [];
    }
    let sum = calculatedData.reduce((a, b) => a + b, 0);

    const newdata = olddata.map((val, i) => ({
      ...val,
      value: Number(((calculatedData[i].toFixed(0) / sum) * 100).toFixed(0)),
    }));

    const max = newdata.reduce(function(prev, current) {
      return (prev.value > current.value) ? prev : current
    })

    let Mainimg = max.img || newdata[0].img;
    const finalData = newdata
    return (
      <>
        <PieChart width={550} height={380}>
          <Pie
            data={finalData}
            cx={260}
            cy={180}
            startAngle={360}
            endAngle={0}
            innerRadius={60}
            outerRadius={120}
            fill="#000"
            stroke="none"
            paddingAngle={0}
            dataKey="value"
            labelLine={false}
            label={<CustomizedLabel />}
          >
            {olddata.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
        <img src={Mainimg} className="main-img" alt="img" />
      </>
    );
  }
}
