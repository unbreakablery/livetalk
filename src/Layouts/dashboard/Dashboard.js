import React, { useCallback, useState } from 'react'
import { Button, Fab } from '@material-ui/core'
import './Dashboard.scss'
// import Waveform from '../waveform'
import Video from '../webcam/Webcam'
import Chart from '../charts/Videochart'
import Timer from 'react-compound-timer';
import { useParams, withRouter } from "react-router-dom";
import { Services } from "../../Components/services/Services";
import { useSelector } from 'react-redux/'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

////-----------Start Volum Meter Code Test-------------------------------
let audioContext = null;
let meter = null;
let mediaStreamSource = null;
let rafID = null;
////-----------End Volum Meter Code Test-------------------------------
let isStreaming = false;

function useInterval(callback, delay) {
    const savedCallback = React.useRef();
  
    // Remember the latest callback.
    React.useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    React.useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
}

function Dashboard(props) {
    const [state, setstate] = React.useState(
        {
            expressions: null,
        }
    )
    const { transcript, resetTranscript } = useSpeechRecognition()
    
    //-----------Start Volum Meter Code Test-------------------------------
    const [data, setData] = useState({"x":[], "y":[]})
    //-----------End Volum Meter Code Test---------------------------------


    let { seminar_id, participant_index } = useParams();
    const stateR = useSelector(state => state.states);
    const [streamingConfig, setStreamingConfig] = React.useState(null)
    const [pc, setPc] = React.useState(0);
    const [stats, setStats] = React.useState({syllables: []});
    const [buffer, setBuffer] = React.useState("");
    const [started, setStarted] = React.useState(false);
    const [isSendingAnalysis, setIsSendingAnalysis] = React.useState(false);
    const [volumeBuffer, setVolumeBuffer] = React.useState([]);

    React.useEffect(() => {
        const endpoint = `/user/seminar/participants?seminar_id=${seminar_id}`
        Services
            .servicesGet(endpoint, stateR.login)
            .then((res) => {
                if (res.data && res.data.length) {
                    setStreamingConfig({
                        token: stateR.login,
                        language: "fr-FR",
                        seminar_id: seminar_id,
                        participant_index: participant_index,
                        name: res.data[participant_index].first_name + " " + res.data[participant_index].last_name
                    })
                }
            })
        setPc(createPeerConnection());
    }, [])

    
    React.useEffect(() => {
        const words = transcript.split(" ")
        if (words.length > 20) {
            console.log("RESET....")
            resetTranscript()
        }

    }, [transcript, resetTranscript])

    const new_count = (word) => {
        if(word == null || word === ""){
          console.log('is null')
          return 0;}
        word = word.toLowerCase();                                     //word.downcase!
        if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
        word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
        return word.match(/[aeiouy]{1,2}/g) ? word.match(/[aeiouy]{1,2}/g).length : 0;                  //word.scan(/[aeiouy]{1,2}/).size
    }

    const TimeFunc = React.useRef()

    useInterval(()=>{
        if(!started)
            return;
        let newText = transcript.substr(buffer.length)
        setStats({...stats, syllables:[...stats.syllables, new_count(newText)]})
        setBuffer(transcript + "")
    }, 1000);

    useInterval(()=>{
        if(!started)
            return;
        const average = arr => arr.length ? arr.reduce( ( p, c ) => p + c, 0 ) / arr.length : 0;
        const volAvg  = average(volumeBuffer)
        console.log("Volume : " + volAvg)
        setData( Object.assign(data, {"y":[...data.y, volAvg] }) )
        setVolumeBuffer(old => [])
    }, 100);

    function createPeerConnection() {
        console.log("Create Peer Connection....")
        var config = {
            sdpSemantics: 'unified-plan'
        };

        let pc = new RTCPeerConnection(config);
        return pc;
    }

    function negotiate() {
        return pc.createOffer().then(function (offer) {
            return pc.setLocalDescription(offer);
        }).then(function () {
            // wait for ICE gathering to complete
            return new Promise(function (resolve) {
                if (pc.iceGatheringState === 'complete') {
                    resolve();
                } else {
                    function checkState() {
                        if (pc.iceGatheringState === 'complete') {
                            pc.removeEventListener('icegatheringstatechange', checkState);
                            resolve();
                        }
                    }
                    pc.addEventListener('icegatheringstatechange', checkState);
                }
            });
        }).then(function () {
            var offer = pc.localDescription;

            return fetch('http://127.0.0.1:8080/offer', {
                body: JSON.stringify({
                    sdp: offer.sdp,
                    type: offer.type,
                    ...streamingConfig
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
        }).then(function (response) {
            return response.json();
        }).then(function (answer) {
            return pc.setRemoteDescription(answer);
        }).catch(function (e) {
            console.log(e);
        });
    }

    function startStreaming() {
        SpeechRecognition.startListening({ continuous: true, language: "fr-FR" });

        //-----Start Volum Meter Test------------------
        // monkeypatch Web Audio
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        
        // grab an audio context
        audioContext = new AudioContext();
        //----End volum Meter test--------------------

        var time_start = null;
        var dcInterval = null;

        function current_stamp() {
            if (time_start === null) {
                time_start = new Date().getTime();
                return 0;
            } else {
                return new Date().getTime() - time_start;
            }
        }
        var parameters = { "ordered": true, "maxRetransmits": 5 };

        let dc = pc.createDataChannel('chat', parameters);
        dc.onclose = function () {
            clearInterval(dcInterval);
            console.log("Close....")
        };
        /*
        dc.onopen = function () {
            console.log('- open');
            dcInterval = setInterval(function () {
                var message = 'ping ' + current_stamp();
                console.log('> ' + message);
                dc.send(message);
            }, 500);
        };
        
        dc.onmessage = function (evt) {
            //console.log('< ' + evt.data);
            if (evt.data) {
                const newStats = JSON.parse(evt.data.split(" | ")[1].replaceAll("'", "\""))
                setStats(newStats)
            }

        };
        */
        isStreaming = true;

        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }).then(function (stream) {
            //-----------------Start Code Volum Meter Test------------------------
            onMicrophoneGranted(stream);
            //-----------------End Code Volum Meter Test------------------------
            stream.getTracks().forEach(function (track) {
                console.log(pc);
                pc.addTrack(track, stream);
            });
            return negotiate(pc);
        }, function (err) {
            alert('Could not acquire media: ' + err);
        });
    }

    function stopStreaming() {
        if (pc.getTransceivers) {
            pc.getTransceivers().forEach(function (transceiver) {
                if (transceiver.stop) {
                    transceiver.stop();
                }
            });
        }

        // close local audio / video
        pc.getSenders().forEach(function (sender) {
            sender.track.stop();
        });
        // setIsStreaming(false)
        isStreaming= false

        // close peer connection
        setTimeout(function () {
            pc.close();
        }, 500);
    }



    function handleStopTime() {
        TimeFunc.current.stop()
        setStarted(false)
        setIsSendingAnalysis(true)
        stopStreaming()
        /*********** Get the analysis ID  ***********/
        let i = setInterval(() => {
            console.log("RECUPERATION DU ANALYSIS ID....")
            Services.servicesGet(`/user/seminar/participants?seminar_id=${seminar_id}`, stateR.login).then((res) => {
                let participants = res.data;
                let participant = participants[participant_index]
                if (participant.analysis_id !== -1) {
                    setIsSendingAnalysis(false)
                    clearInterval(i);
                    props.history.push({ pathname: `/dashboard/feedback/${seminar_id}/${participant.analysis_id}/${participant.first_name} ${participant.last_name}` })
                }
            })
        }, 2000);
    }

    function handleStartTime() {
        console.log(pc)
        console.log("Start Recording...")
        setStarted(true)
        startStreaming()
        TimeFunc.current.start()
    }

    function setExpressions(expressions) {
        setstate(state => { return { ...state, ...{ expressions: expressions }} })
    }


    const getBubbleStyle = useCallback((key) => {
        if (state?.expressions && state.expressions[key] && started) {
            // console.log({ [key]: state.expressions[key] })
            return {
                width: `${state.expressions[key] * 100}%`,
                height: `${state.expressions[key] * 100}%`,
                transition: "all .5s linear"
            }
        }
    }, [state])

    const getWaveColor = useCallback((val) => {
        if( val < 0.01 )
             return "#4CC9F0"
        if( val < 0.02 )
             return "#F72585"
        else
            return "#3B3C3D"
        //return `${val*180 > 30 ? '#F72585' : val > 20 ? '#7209B7' : val < 10 ? '#4CC9F0' : '#3B3C3D'}`
    }, [data])

    

    //------Start Volum Meter code test---------------------------------
    function onMicrophoneGranted(stream) {
        // Create an AudioNode from the stream.
        mediaStreamSource = audioContext.createMediaStreamSource(stream);

        // Create a new volume meter and connect it.
        meter = createAudioMeter(audioContext);
        mediaStreamSource.connect(meter);

        // kick off the visual updating
        onLevelChange();
    }
    function onLevelChange( ) {
        setVolumeBuffer(old => [...old, meter.volume])
        // set up the next visual callback
        rafID = window.requestAnimationFrame( onLevelChange );
    }

    //--------------------------------------------------------------------
    //--------------------------------------------------------------------
    //--------------------- Plugins --------------------------------------
    //--------------------------------------------------------------------
    //--------------------------------------------------------------------
    function createAudioMeter(audioContext,clipLevel,averaging,clipLag) {
        var processor = audioContext.createScriptProcessor(512);
        processor.onaudioprocess = volumeAudioProcess;
        processor.clipping = false;
        processor.lastClip = 0;
        processor.volume = 0;
        processor.clipLevel = clipLevel || 0.98;
        processor.averaging = averaging || 0.95;
        processor.clipLag = clipLag || 750;

        // this will have no effect, since we don't copy the input to the output,
        // but works around a current Chrome bug.
        processor.connect(audioContext.destination);

        processor.checkClipping =
            function(){
                if (!this.clipping)
                    return false;
                if ((this.lastClip + this.clipLag) < window.performance.now())
                    this.clipping = false;
                return this.clipping;
            };

        processor.shutdown =
            function(){
                this.disconnect();
                this.onaudioprocess = null;
            };

        return processor;
    }

    function volumeAudioProcess( event ) {
        var buf = event.inputBuffer.getChannelData(0);
        var bufLength = buf.length;
        var sum = 0;
        var x;

        // Do a root-mean-square on the samples: sum up the squares...
        for (var i=0; i<bufLength; i++) {
            x = buf[i];
            if (Math.abs(x)>=this.clipLevel) {
                this.clipping = true;
                this.lastClip = window.performance.now();
            }
            sum += x * x;
        }

        // ... then take the square root of the sum.
        var rms =  Math.sqrt(sum / bufLength);

        // Now smooth this out with the averaging factor applied
        // to the previous sample - take the max here because we
        // want "fast attack, slow release."
        this.volume = Math.max(rms, this.volume*this.averaging);
    }

    //------End Volum Meter code test---------------------------------


    return (
        <div className="dashboard-page">
            <div className="bg-primary px-8 emotions">
                <div className="relative emotions-grid">
                    <div className="emotions-cam flex-col">
                        <div className="bg-dark rounded-2xl pb-3 pt-3 emotions-box">
                            <div className="text-center mb-6">
                                <Button variant="contained" className="rounded-3xl px-8 capitalize" color="primary">Emotions</Button>
                            </div>
                            <div className="flex items-center justify-center emotions-meter-wrapper">
                                <div>
                                    <div className="flex mt-4 justify-center space-x-10">
                                        <div className="w-28 flex items-center">
                                            <Button variant="contained" className="rounded-3xl mx-auto capitalize" color="primary">Joy</Button>
                                        </div>
                                        <div className="w-28 flex items-center">
                                            <Button variant="contained" className="rounded-3xl mx-auto capitalize" color="primary">Neutral</Button>
                                        </div>
                                        <div className="w-28 flex items-center">
                                            <Button variant="contained" className="rounded-3xl mx-auto capitalize" color="primary">Sadness</Button>
                                        </div>
                                    </div>
                                    <div className="emotions-bubbles flex justify-center space-x-10">
                                        <div className="h-28 w-28 flex items-center">
                                            <div style={getBubbleStyle("happy")} className="w-1 mx-auto mt-1 rounded-full bg-bubble"></div>
                                        </div>
                                        <div className="h-28 w-28 flex items-center">
                                            <div style={getBubbleStyle("neutral")} className="w-1 mx-auto rounded-full bg-bubble"></div>
                                        </div>
                                        <div className="h-28 w-28 flex items-center">
                                            <div style={getBubbleStyle("sad")} className="w-1 mx-auto mt-1 rounded-full bg-bubble"></div>
                                        </div>
                                    </div>
                                    <div className="emotions-bubbles flex justify-center space-x-10">
                                        <div className="h-24 w-28 flex items-center">
                                            <div style={getBubbleStyle("surprised")} className="w-1 mx-auto mt-1 rounded-full bg-bubble"></div>
                                        </div>
                                        <div className="h-24 w-28 flex items-center">
                                            <div style={getBubbleStyle("fearful")} className="w-1 mx-auto mt-1 rounded-full bg-bubble"></div>
                                        </div>
                                        <div className="h-24 w-28 flex items-center">
                                            <div style={getBubbleStyle("angry")} className=" mx-auto mt-1 rounded-full bg-bubble"></div>
                                        </div>
                                        <div className="h-24 w-28 flex items-center">
                                            <div style={getBubbleStyle("disgusted")} className="w-1 mx-auto mt-1 rounded-full bg-bubble"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center space-x-10">
                                        <div className="w-28 btn-bottom-bubbles flex items-center">
                                            <Button variant="contained" className="rounded-3xl mx-auto capitalize" color="primary">Surprise</Button>
                                        </div>
                                        <div className="w-28 btn-bottom-bubbles flex items-center">
                                            <Button variant="contained" className="rounded-3xl mx-auto capitalize" color="primary">Fear</Button>
                                        </div>
                                        <div className="w-28 btn-bottom-bubbles flex items-center">
                                            <Button variant="contained" className="rounded-3xl mx-auto capitalize" color="primary">Anger</Button>
                                        </div>
                                        <div className="w-28 btn-bottom-bubbles flex items-center">
                                            <Button variant="contained" className="rounded-3xl mx-auto capitalize" color="primary">Disgust</Button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="pt-5 video-container">
                            <div className="relative btn-f-track">
                                <Button variant="contained" className="rounded-3xl mx-auto capitalize" color="primary">Face Tracking</Button>
                            </div>
                            <Video setExpressions={setExpressions} isStreaming={isStreaming} />
                            <div className="action-buttons mt-5" style={{ zIndex: "99999" }}>
                                { isSendingAnalysis && "Submitting the seminar..."}
                                { !isSendingAnalysis && 
                                    <Button onClick={handleStopTime} startIcon={<StopIcon />} variant="contained">Stop</Button>
                                }
                                
                                <Button onClick={handleStartTime} startIcon={<PlayArrowIcon />} variant="contained">Start</Button>
                            </div>
                            <div className="relative">
                                {/* <span variant="contained" className="rounded-3xl mx-auto capitalize bottom-tag">{stats.text}</span> */}
                                <span variant="contained" className="rounded-3xl mx-auto bottom-tag">{transcript}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-dark rounded-2xl relative pt-3 waves-speed">
                        <div className="bg-lines-wrapper">
                            <div className="bg-lines" />
                            <div className="bg-lines" />
                            <div className="bg-lines" />
                            <div className="bg-lines" />
                            <div className="bg-lines" />
                            <div className="bg-lines" />
                            <div className="bg-lines" />
                            <div className="bg-lines" />
                            <div className="bg-lines" />
                            <div className="bg-lines" />
                            <div className="bg-lines" />
                        </div>
                        <div className="waves-speed-content">
                            <div className="wave-f">
                                <div className="wave-labels">
                                    <div className="indecater float-left">
                                        <ul>
                                            <li><span className="bg-interference"></span>Interference</li>
                                            <li><span className="bg-breathing"></span>Breathing</li>
                                            <li><span className="bg-silences"></span>Silences</li>
                                            <li><span className="bg-speaking"></span>Speaking</li>
                                        </ul>
                                    </div>
                                    <div className="relative btn-f-track">
                                        <Button variant="contained" className="rounded-3xl mx-auto capitalize" color="primary">Disturbances</Button>
                                    </div>
                                    <Fab variant="extended"> 0<span className="unit">Hz</span> </Fab>
                                </div>
                                <div className="clear-both"></div>
                                <div className="my-4 lg-none"></div>
                                {/* <Waveform /> */}
                                <div className="waves-wrapper">
                                    <div style={{
                                        transform: `translateX(${data.y.length * -10 + "px"})`, width: '12000px', height: '200px', transition: started ? 'all 0.1s ease' : 'none', display: "flex",
                                        "align-items": "center"
                                    }}>
                                        {data.y.map((val, i) =>
                                            <div key={`wave-${i}`} className="wave" style={{ height: `${val * 1500}px`, backgroundColor: getWaveColor(val) }}>
                                            </div>
                                        )}
                                        {/* <div className="clear-both"></div> */}
                                    </div>
                                </div>
                                {/* <span className="cursor" style={{height:`${ state.transform < -180 ? -180*8 :data.y[indexValue] * 3}px`}}></span> */}
                            </div>

                            <div>
                                <div className="btn-f-track speed-buttons-wrapper">
                                    <div style={{ width: "130px" }}></div>
                                    <Button variant="contained" className="rounded-3xl mx-auto capitalize" color="primary">Speed</Button>
                                    <Fab variant="extended"> {stats.syllables[stats.syllables.length-1] || 0}<span className="unit">sy./sc.</span> </Fab>
                                </div>
                                <Chart data={stats.syllables} />
                            </div>
                        </div>
                        <div className="line"></div>
                    </div>
                </div>
                {streamingConfig &&
                    <div className="bottom grid grid-cols-3">
                        <div className="title">{streamingConfig.name}</div>
                        <div className="timer">
                            <Timer
                                initialTime={0}
                                formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}
                                startImmediately={false}
                            >

                                {(control) => {
                                    TimeFunc.current = control
                                    return <React.Fragment>
                                        <Timer.Hours />:
                                    <Timer.Minutes />:
                                    <Timer.Seconds />
                                    </React.Fragment>
                                }}

                            </Timer>
                        </div>

                    </div>
                }

            </div>
        </div>
    )
}

export default withRouter(Dashboard);
