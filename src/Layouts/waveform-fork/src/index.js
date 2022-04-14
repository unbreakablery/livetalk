import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import Buttons from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import { useSelector, useDispatch } from 'react-redux'
import { onWaveReady } from "../../../redux/actions";
import { WaveSurfer, WaveForm } from "./components/wavesurfer";
import "./styles.css";
import '../../../Layouts/charts/charts.scss'
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline'
import { isSliding } from '../../../redux/actions'

function Test() {
  console.log("Render test")
  return <></>
}

function App() {
  const [timelineVis, setTimelineVis] = useState(true);
  const [lstate, setLstate] = useState(null)
  const [waveReady, setWaveReady] = useState(false)
  const [waveLoading, setWaveLoading] = useState(true)
  // const waveTimeline = useRef(null)
  const toggleTimeline = useCallback(() => {
    setTimelineVis(!timelineVis);
  }, [timelineVis]);
  const dispatch = useDispatch()
  const stateR = useSelector(state => state.states)

  const wavesurferRef = useRef();
  const playButton = useRef(null)
  const pauseButton = useRef(null)

  if (stateR.play) {
    if (playButton && playButton.current) playButton.current.click()
  } else {
    if (pauseButton && pauseButton.current) pauseButton.current.click()
  }

  useEffect(() => {
    if (stateR && stateR.data && stateR.data.audio_annotations) {
      setLstate({ ...stateR.data.audio_annotations.data, waveDataReady: true })
      // setColors(getDataFromSate(stateR.data.audio_annotations))
      console.log("stateR.data.audio_annotations")
      console.log(stateR.data.audio_annotations)
    }
  }, [stateR.data.audio_annotations])

  function getDataFromSate(state) {
    console.log("Get data from state")
    let dummyState = Object.assign({}, state)
    return Array.from(Object.keys(dummyState)).map((key) => {
      if (Array.isArray(dummyState[key])) {
        return dummyState[key].map(obj => {
          switch (obj.vocaltype) {
            case "accident":
              return { start: obj.start, end: obj.end, color: "#F72585" };
            case "inspiration":
              return { start: obj.start, end: obj.end, color: "#7209B7" };
            case "silence":
              return { start: obj.start, end: obj.end, color: "#4CC9F0" };
            case "speaking":
              return { start: obj.start, end: obj.end, color: "#3B3C3D" };
            default:
              return { start: obj.start, end: obj.end, color: "#3B3C3D" };
          }
        })
      }
    }
    ).filter(val => Boolean(val)).flat()
  }

  const handleWSMount = useCallback((waveSurfer) => {
    console.log("handle wavesurfer mount...")
    wavesurferRef.current = waveSurfer;
    console.log(wavesurferRef.current)
    if (wavesurferRef.current) {
      console.log(stateR.videoUrl)
      console.log("%cinside wavesurfer if block", "color: red")

      if (stateR) {
        console.log("%cvideo URL: " + stateR.videoUrl, "color: blue")
        wavesurferRef.current.load(stateR.videoUrl);
        console.log("mounting!")
      }

      wavesurferRef.current.on("ready", () => {
        console.log("WaveSurfer is ready");
        dispatch(onWaveReady(null))
        setWaveReady(true)
        wavesurferRef.current.setVolume(0)
        wavesurferRef.current.pause()
      });

      wavesurferRef.current.on("region-removed", (region) => {
        console.log("region-removed --> ", region);
      });

      wavesurferRef.current.on("loading", (data) => {
        console.log("loading --> ", data);
      });

      if (window) {
        window.surferized = wavesurferRef.current;
      }
    }
  }, [stateR.videoUrl]);

  const playPause = useCallback(() => {
    wavesurferRef.current.playPause();
  }, []);

  const play = useCallback(() => {
    if (wavesurferRef && wavesurferRef.current) wavesurferRef.current.play();
  });

  const pause = useCallback(() => {
    if (wavesurferRef && wavesurferRef.current) wavesurferRef.current.pause();
  });
  // console.log(stateR.isSliding)
  if (stateR.isSliding) {
    if (wavesurferRef && wavesurferRef.current) {
      console.log("Slideee", stateR.slideTime)
      wavesurferRef.current.seekTo(stateR.slideTime);
      dispatch(isSliding(false))
    }
  }

  if (lstate) {
    (getDataFromSate(lstate))
    console.log("lstate ready")
    console.log(lstate)
  }

  const colors = getDataFromSate(lstate)
  console.log(colors)
  console.log({ waveReady })
  return (
    (colors.length) ? (
      <div className="App">
        {waveReady ? <></> : <h1 className="placeholder">Processing ...</h1>}
        <WaveSurfer
          plugins={[{
            plugin: TimelinePlugin,
            options: {
              container: "#waveform-timeline",
              primaryColor: "#fff",
              secondaryColor: "#fff",
              primaryFontColor: "#fff",
              secondaryFontColor: "#fff",
              fontFamily: "OpenSans-light",
              fontSize: 16,
              notchPercentHeight: 50,
              labelPadding: 8,
              unlabeledNotchColor: "#fff",
            }
          }]}
          onMount={handleWSMount}>
          <WaveForm
            id="waveform"
            backgroundColor="#232424"
            waveColor="#4CC9F0"
            fillParent={true}
            progressColor="#3B3C3D"
            cursorColor='#4CC9F0'
            barWidth="1"
            cursorWidth="1"
            height="180"
            width="1300"
            barGap="2"
            hideScrollbar={true}
            minPxPerSec={100}
            barHeight={2}
            colors={colors}
          />
        </WaveSurfer>
        <div id="waveform"></div>
        <div id="waveform-timeline"></div>
        <Buttons style={{ display: "none" }}>
          <Button onClick={playPause}>Play / Pause</Button>
          <Button ref={playButton} onClick={play}>Play</Button>
          <Button ref={pauseButton} onClick={pause}>Pause</Button>
          <Button onClick={toggleTimeline}>Toggle timeline</Button>
        </Buttons>
      </div>
    ) : <Test />

  );
}

export default App
