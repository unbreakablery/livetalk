import React from "react";
import { Button, Fab, Typography } from "@material-ui/core";
import Meterchart from "../charts/Meterchart";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Download from '../../assets/img/download-icon2.png'
import PieChart from '../charts/PieChart'
import PichChart from '../charts/Pichchart'
//import { useScreenshot, createFileName } from 'use-react-screenshot'
import "./report.scss";
import { Services } from '../../Components/services/Services'
import { useSelector, useDispatch } from 'react-redux'
import html2canvas from 'html2canvas'
import { jsPDF } from "jspdf";
import ReactWordcloud from 'react-wordcloud';
import Loader from '../loader2/Loader'
import { useParams, withRouter, Link } from "react-router-dom";
import { onDataFecthed, onGetVideo } from "../../redux/actions"
import {secs2min} from '../../Components/utils/sec2min'
import logo from "../../assets/img/logo_.png"
import domtoimage from 'dom-to-image';

function NumToTime(num) {
  var minutes = Math.floor(num / 60);
  var seconds = num % 60;

  if (seconds + ''.length < 2) {
    seconds = '0' + seconds;
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  return minutes + ":" + seconds.toFixed(0);
}

const options = {
  fontFamily: "OpenSans-Light",
  enableTooltip: false,
  fontSizes: [14, 40],
  rotations: 3,
  rotationAngles: [0, 90],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 1000,
};
const callbacks = {
  getWordColor: word => word.value = "#000",
}
const size = [100, 100];

function Report(props) {
  // console.log(props)
  const [state, setstate] = React.useState({
    data: "",
    loading: true,
    progress: 0
  });
  const { analysis_id, participant_name, seminar_id } = useParams();

  const disturbance = state.data && state.data.audio_annotations && state.data.audio_annotations.data.statistics;
  const worldcloud = state.data && state.data.wordcloud.data
  const filter = state.data && worldcloud.map((val) => { return { text: val[0], value: val[1] } })
  //const speechrates = state.data && state.data.wordcloud.data;
  const speechrates = state.data && state.data.speechrate.data.find(e => e.window_size === 10).data.speechrates
  const calculateMinSec = function (seconds) {
    let minutes = parseInt(seconds / 60) % 60
    let hours = parseInt(seconds / 3600)
    let format = (value) => `${(value < 10 ? `0${value}` : value)}`
    return `${format(hours)}:${format(minutes)}:${format(seconds % 60)}`
  }
  const duration = state.data && calculateMinSec(parseInt(state.data.metadata.duration))

  const downloadPDFReport = function () {
    const page1 = document.getElementById('page-1');
    const page2 = document.getElementById('page-2');
    const ratio1 = page1.clientHeight / page1.clientWidth;
    const ratio2 = page2.clientHeight / page2.clientWidth;
    const copyright = "© talk SWISS";
    const now = new Date();
    const today = (now.getDate() < 10 ? "0" + now.getDate().toString() : now.getDate().toString()) + "." + ((now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1).toString() : (now.getMonth() + 1).toString()) + "." + now.getFullYear();
    
    let width1 = 0;
    let height1 = 0;
    let width2 = 0;
    let height2 = 0;

    let pdf = new jsPDF('l', 'px', 'a4');
    
    const v_margin = 24;
    const h_margin = 22;
    const pageWidth = pdf.internal.pageSize.width - h_margin * 2;
    const pageHeight = pdf.internal.pageSize.height - v_margin * 2;
    
    let orientation1 = '';
    if (ratio1 > 1) {
      orientation1 = 'p';
      height1 = pageHeight;
      width1 = height1 / ratio1;
    } else {
      orientation1 = 'l';
      width1 = pageWidth;
      height1 = width1 * ratio1;
    }

    let orientation2 = '';
    if (ratio2 > 1) {
      orientation2 = 'p';
      height2 = pageHeight;
      width2 = height2 / ratio2;
    } else {
      orientation2 = 'l';
      width2 = pageWidth;
      height2 = width2 * ratio2;
    }
    
    pdf = new jsPDF(orientation1, 'px', 'a4');
    
    if (pdf) {
      domtoimage.toPng(page1, {bgcolor: "#fff"}).then(imgData1 => {
        pdf.addImage(imgData1, 'PNG', h_margin, v_margin, width1, height1);
        domtoimage.toPng(page2, {bgcolor: "#fff"}).then(imgData2 => {
          pdf.addPage('a4', orientation2);
          pdf.addImage(imgData2, 'PNG', h_margin, v_margin, width2, height2);
          pdf.setFontSize(10);
          pdf.text(copyright, h_margin, 430);
          pdf.text(today, 590 - h_margin, 430);
          pdf.save('Report.pdf', { returnPromise: true }).then(function() {
            setTimeout(() => {
              window.close();
            }, 1000);
          });
        });
      });
    }
  }

  const stateR = useSelector(state => state.states);

  const dispatch = useDispatch()

  function getProgress() {
    console.log("Get Progress.....")
    Services.servicesGet(`/user/analysis/progress?analysis_id=${analysis_id}`, stateR.login).then((res) => {
      // console.log("Status = ", res.data)
      //let r = Math.random()
      let r = res.data
      console.log("Status = ", r)
      setstate({ ...state, progress: r})
      if (r > 0.90) {
        Services.servicesGet(`/user/analysis?analysis_id=${analysis_id}`, stateR.login).then((res) => {
          // const localData = { audio_annotations: res.data.audio_annotations, emotions: res.data.emotions, speechrate: res.data.speechrate,}
          setstate({ ...state, data: res.data, loading: false })
          // console.log(res.data)
          // dispatch(onDataFecthed({ ...localData, storageAudioURL: res.data.storageAudioURL, storageVideoURL: res.data.storageVideoURL }))
          dispatch(onDataFecthed(res.data))
          setTimeout(() => {
            downloadPDFReport()
          }, 2500)
        })
        // clearInterval(i)
      } else {
        setTimeout(()=> {
          getProgress()
        }, 1000)
      }
    })
  }

  React.useEffect(() => {
    getProgress()
    const endpoint = "/user/analysis/video?analysis_id=" + analysis_id
    const Prefix = "http://test-api.endpoints.talk-speech.cloud.goog"

    fetch(Prefix + endpoint, {
      method: 'GET',
      headers: {
        'x-access-tokens': stateR.login,
      }
    }).then(res => {
      res.blob()
        .then(blob => {
          let url = window.URL.createObjectURL(blob)
          dispatch(onGetVideo(url))
        })
    })
    //////////////////////////////////////
  }, []);

  const digitize = n => {
    const arry = String(n).split(".")
    let result = arry.map(i => Number(i));
    if (result[0] < 10) {
      result[0] = '0' + result[0]
    }
    result[1] = ((result[1] / 1000)).toFixed(0)
    let time = result[0] + ':' + result[1]

    return time.slice(0, 5)

  }
  const pitch = state.data && state.data.pitch.data.pitch

  return (
    <>
      {state.data ?
        <div className="report" id="capture">
      {/* Home-Page -----------------------------------------------------------*/}
          <div className="home-page" id="page-1">
            <div className="left-side">
              <div className="img-container"> </div>
              <img className="logo" src={logo} alt="Talk image"/>
              <div className="contact">
                <ul>Neuchâtel
                  <li>
                    <p>Microcity Innovation</p>
                    <p>2000 Neuchâtel</p>
                  </li>
                  <li>
                    <p>Pierre-à-Mazel 39</p>
                    <p>+41 32 930 29 26</p>
                  </li>
                </ul>
                <ul>Orbe
                  <li>
                    <p>Aubépine 1</p>
                    <p>+41 24 441 63 63</p>
                  </li>
                  <li>
                    <p>1350 Orbe</p>
                    <a href="mailto:talk@talk.swiss">talk@talk.swiss</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="right-side">
              <div className="img-container"></div>
              <div className="content">
                  <img src={logo} alt="logo"/>
                  <h1>La parole au centre</h1>
                  <p>Décoder votre communication pour libérer votre potentiel humain</p>
                  <h2>{participant_name}</h2>
                  <a href="http://www.talk.swiss/" target="_blank" >www.talk.swiss</a>
                </div>
              </div>
          </div>
      {/* Report -----------------------------------------------------------*/}
          <div id="page-2">
            <div className="grid grid-cols-4 gap-4">
              <div className="Wordcloud">
                <Fab variant="extended" className="mb-12 btn-title">
                  Wordcloud
            </Fab>
                <ReactWordcloud
                  options={options}
                  callbacks={callbacks}
                  size={size}
                  words={filter}
                  className={"wordcloudComponent"}
                />
              </div>
              <div className="disturbances with-buttons">
                <Fab variant="extended" className="mb-12 btn-title">
                  Disturbances
                </Fab>
                {disturbance ?
                  <ul className="list">
                    <li className="flex items-center justify-between">
                      <span className="text">Interferences</span>
                      <Fab
                        variant="extended"
                        className="capitalize btn-interference"
                      >
                      <span>{/* disturbance && disturbance.accident && disturbance.accident.rate_per_minute && */ disturbance?.accident?.rate_per_minute.toFixed(2) || "0"}</span>
                        <i className="not-italic">int/min</i>
                      </Fab>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text">Breathing</span>
                      <Fab
                        variant="extended"
                        className="capitalize btn-breathing"
                      >
                        <span>{disturbance?.inspiration?.rate_per_minute.toFixed(0)/*disturbance?.inspiration?.rate_per_minute.toFixed(2)*/}</span>
                        <i className="not-italic">br/min</i>
                      </Fab>
                    </li>
                    {disturbance?.silences ?
                      <li className="flex items-center justify-between">
                        <span className="text">Silences</span>
                        <Fab
                          variant="extended"
                          className="capitalize btn-silences"
                        >
                          <span>{secs2min(disturbance.silences.total_seconds)}</span>
                          <i className="not-italic">min</i>
                        </Fab>
                      </li> :
                    <li className="flex items-center justify-between">
                      <span className="text">Silences</span>
                      <Fab
                        variant="extended"
                        className="capitalize btn-silences"
                      >
                        <span>{"00:00"}</span>
                        <i className="not-italic">min</i>
                      </Fab>
                    </li>
                    }
                    <li className="flex items-center justify-between">
                      <span className="text">Speaking</span>
                      {disturbance?.speaking ?<Fab
                        variant="extended"
                        className="capitalize btn-speaking"
                      >
                        {/* <span>{NumToTime(disturbance.speaking.total_seconds)}</span> */}
                        <span>{secs2min(disturbance.speaking.total_seconds)}</span>
                        <i className="not-italic">min</i>
                      </Fab> :
                      <Fab
                        variant="extended"
                        className="capitalize btn-speaking"
                      >
                        <span>{"00:00"}</span>
                        <i className="not-italic">min</i>
                      </Fab>}
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text">Total duration</span>
                      <Fab
                        variant="extended"
                        className="capitalize btn-total"
                        disabled
                      >

                        <span>{NumToTime(disturbance.total_duration)}</span>
                        <i className="not-italic">min</i>
                      </Fab>
                    </li>
                  </ul>
                : 
                  <ul className="list">
                    <li className="flex items-center justify-between">
                      <span className="text">Interferences</span>
                      <Fab
                        variant="extended"
                        className="capitalize btn-interference"
                      >
                        <span>{"0.00"}</span>
                        <i className="not-italic">int/min</i>
                      </Fab>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text">Breathing</span>
                      <Fab
                        variant="extended"
                        className="capitalize btn-breathing"
                      >
                        <span>{"0.00"}</span>
                        <i className="not-italic">br/min</i>
                      </Fab>
                    </li>
                    {
                      <li className="flex items-center justify-between">
                        <span className="text">Silences</span>
                        <Fab
                          variant="extended"
                          className="capitalize btn-silences"
                        >
                          <span>{"00:00"}</span>
                          <i className="not-italic">min</i>
                        </Fab>
                      </li>
                    }
                    <li className="flex items-center justify-between">
                      <span className="text">Speaking</span>
                      <Fab
                        variant="extended"
                        className="capitalize btn-speaking"
                      >
                        {/* <span>{NumToTime(disturbance.speaking.total_seconds)}</span> */}
                        <span>{"00:00"}</span>
                        <i className="not-italic">min</i>
                      </Fab>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text">Total duration</span>
                      <Fab
                        variant="extended"
                        className="capitalize btn-total"
                        disabled
                      >
                        <span>{"00:00"}</span>
                        <i className="not-italic">min</i>
                      </Fab>
                    </li>
                  </ul>
                }

              </div>
              <div className="col-span-2 speed">
                <Fab variant="extended" className="btn-title">
                  Speed
                </Fab>
                <Meterchart background={"#c1c1c1"} labelColor={"#2f3031"} needleColor={"#f91b84"} data={speechrates} />

              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-7">
              <div className="emotions">
                <Fab variant="extended" className="btn-title">
                  Emotions
            </Fab>
                <PieChart data={state.data} />
              </div>
              <div className="p-distribution">
                <Fab variant="extended" className="btn-title">
                  Pitch Distribution
            </Fab>
                {
                  pitch && <PichChart skipping={true} options={{barColor: "#7209b7", axisColor: "#2f3031"}} data={pitch} />
                }
              </div>
            </div>
          </div>
        </div>
        : <Loader progress={state.progress}/>}
    </>
  );
}

export default withRouter(Report)