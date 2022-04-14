import React, { useState, useRef, useEffect } from 'react'
import SpeedChart from '../charts/SpeedChart'
import WaveForm from '../waveform-fork/src'
import EmotionsChart from '../charts/EmotionsChart'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Legend from './Legend'
import { onWaveReady } from '../../redux/actions';
import { useSelector, useDispatch } from 'react-redux'
import { secs2min } from '../../Components/utils/sec2min'

export default function ChartsPanel({ isPlaying, slideTime }) {
    const [display, setDisplay] = useState(0)
    const [data, setData] = useState(null)
    // const [waveReady, setWaveReady] = useState(false)
    const panel0 = useRef(null)
    const panel1 = useRef(null)
    const panel2 = useRef(null)
    const wavesurfer = useRef(null)
    const test = useRef(null)
    const stateR = useSelector(state => state.states)
    const [emotionsXAxis, setEmotionsXAxis] = useState([]);
    const [emotionsYAxis, setEmotionsYAxis] = useState([]);
    const dispatch = useDispatch()

    useEffect(() => {
        setData(stateR.data)
    }, [stateR.data])

    useEffect(() => {
        const emotionsArray = (data && data.emotions && data.emotions.data) ? Array.from(Object.entries(data.emotions.data)) : []
        let newEmotionsXAxis = [];
        let newEmotionsYAxes = [];
            for (let i = 0; i < emotionsArray.length; i += 50) {
                newEmotionsXAxis.push(i !== 0 ? secs2min(i / 10) : 0);
                let aggregatedEmotions = [0, 0, 0, 0, 0, 0, 0]
                for (let j = i; j < i + 50; j++) {
                    if (emotionsArray[j] && emotionsArray[j][1].emotions && emotionsArray[j][1].emotions[0]) {
                        for (let k = 0; k < 7; k++) {
                            aggregatedEmotions[k] += emotionsArray[j][1].emotions[0][k]
                        }
                    }
                }
                newEmotionsYAxes.push(aggregatedEmotions)
            }
            setEmotionsXAxis(newEmotionsXAxis)
            setEmotionsYAxis(newEmotionsYAxes)
    }, [data])

    if (stateR.play) {
        if (wavesurfer && wavesurfer.current) {
            wavesurfer.current.play()
        }
    } else {
        if (wavesurfer && wavesurfer.current) {
            wavesurfer.current.pause()
        }
    }

    const handleChange = (e, newValue) => {
        switch (newValue) {
            case 0:
                dispatch(onWaveReady(true))
                panel0.current.style.display = "block"
                panel1.current.style.display = "none"
                panel2.current.style.display = "none"
                setDisplay(newValue)
                break;
            case 1:
                panel0.current.style.display = "none"
                panel1.current.style.display = "block"
                panel2.current.style.display = "none"
                setDisplay(newValue)
                break;
            case 2:
                panel0.current.style.display = "none"
                panel1.current.style.display = "none"
                panel2.current.style.display = "block"
                setDisplay(newValue)
                break;
            default:
                panel0.current.style.display = "block"
                panel1.current.style.display = "none"
                panel2.current.style.display = "none"
                break;
        }
    }

    const setLegend = (newValue) => {
        switch (newValue) {
            case 0:
                return <Legend items={[{ text: "Interference", color: "#F72585" }, { text: "Breathing", color: "#7209B7" }, { text: "Silence", color: "#4CC9F0" }, { text: "Speaking", color: "#3B3C3D" }]} special={"102 Hz"} />
            case 1:
                return <Legend className="speed-legend" special={"6.2 sy/sc"} />
            case 2:
                return <Legend items={[{ text: "Joy", color: "#F72585" }, { text: "Surprise", color: "#B5179E" }, { text: "Fear", color: "#7209B7" }, { text: "Neutral", color: "#480CA8" }, { text: "Disgust", color: "#3F37C9" }, { text: "Sadness", color: "#4361EE" }, { text: "Anger", color: "#4CC9F0" }]} />
            default:
                break;
        }
    }

    return (
        (data && data.speechrate && data.speechrate.data) ? (
            <div className="charts-panel-wrapper" style={{ padding: "0 50px", width: "100%" }}>
                <AppBar className="app-bar">
                    <Tabs ref={test} value={display} onChange={handleChange}>
                        <Tab label="Disturbances" />
                        <Tab label="Speed" />
                        <Tab label="Emotions" />
                    </Tabs>
                    {setLegend(display)}
                </AppBar>
                <div className="disturbance-wrapper" ref={panel0} value={display} index={1}  >
                    {/* <Legend items={[{ text: "Interference", color: "#F72585" }, { text: "Breathing", color: "#7209B7" }, { text: "Silence", color: "#4CC9F0" }, { text: "Speaking", color: "#3B3C3D" }]} /> */}
                    <div style={{ width: "100%" }}>
                        <WaveForm />
                    </div>
                </div>
                <div className="speed-wrapper" style={{ display: "none" }} ref={panel1} value={display} index={0}  >
                    <SpeedChart
                        x={data.speechrate.data[0].data.time}
                        y={data.speechrate.data[0].data.speechrates}
                        index={0}
                    />
                </div>
                <div className="emotions-wrapper" style={{ display: "none" }} ref={panel2} value={display} index={2}  >
                    <EmotionsChart xaxis={emotionsXAxis} seriesArray={emotionsYAxis} />
                </div>
            </div>)
            :
            <></>
    )
}

