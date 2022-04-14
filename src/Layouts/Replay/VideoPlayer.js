import React, { Fragment, useState, useRef, useCallback, useEffect } from 'react'
import Button from '@material-ui/core/Button'
// import Box from '@material-ui/core/Box'
import ReactPlayer from 'react-player/file'
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { VideoSeekSlider } from 'react-video-seek-slider';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FullScreenTogglers from './FullScreenTogglers'
import ChartsPanel from './ChartsPanel'
// import vid from '../../assets/video/video001.mp4'
import seekButton from '../../assets/img/seek-media-double.png'
import seekButtonSingle from '../../assets/img/seek-media-single.png'
import './replay.scss'
import '../../../node_modules/react-video-seek-slider/lib/ui-video-seek-slider.css'
import { secs2min } from '../../Components/utils/sec2min'
import { useSelector, useDispatch } from 'react-redux'
import { onPlay, onSlideWave, onGetVideo, videoPosition, setGDuration, isSliding, onGetVideoBlob } from '../../redux/actions';
import { useParams } from 'react-router-dom'

// const Prefix = "http://test-api.endpoints.talk-speech.cloud.goog"

export default function VideoPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [playedSeconds, setPlayedSeconds] = useState(0)
    const { analysis_id } = useParams()
    const dispatch = useDispatch()
    // const endpoint = "/user/analysis/video?analysis_id=" + analysis_id
    // try to use document.fullscreen for isFullScreen
    const [isFullScreen, setIsFullScreen] = useState(true)
    const vidPlayer = useRef(null)
    const handle = useFullScreenHandle()
    const stateR = useSelector(state => state.states)

    if (stateR && stateR.data) console.log("Data ready!")

    useEffect(() => {
        // fetch(Prefix + endpoint, {
        //     method: 'GET',
        //     headers: {
        //         'x-access-tokens': stateR.login,
        //     }
        // }).then(res => {
        //     res.blob()
        //         .then(blob => {
        //             let url = window.URL.createObjectURL(blob)
        //             dispatch(onGetVideo(url))
        //             dispatch(onGetVideoBlob(blob))
        //         })
        // })
    }, [])

    const togglePlay = useCallback(() => {
        setIsPlaying(!isPlaying)
        if (isPlaying) {
            dispatch(onPlay(false))
        } else {
            dispatch(onPlay(true))
        }
    }, [isPlaying])

    // const slideWave = (time) => {
    //     dispatch(onSlideWave(time))
    // }

    window.onkeyup = (e) => {
        if (e.code === "Space") togglePlay();
    };

    const seekForeward = (seconds) => {
        const currentTime = vidPlayer.current.getCurrentTime()
        vidPlayer.current.seekTo((currentTime + seconds), "seconds")
        dispatch(onSlideWave((currentTime + seconds) / duration))
        dispatch(isSliding(true))
    }

    const seekBackward = (seconds) => {
        const currentTime = vidPlayer.current.getCurrentTime()
        vidPlayer.current.seekTo((currentTime - seconds), "seconds")
        dispatch(onSlideWave((currentTime - seconds) / duration))
        dispatch(isSliding(true))
    }

    const slideTo = (seconds) => {
        vidPlayer.current.seekTo(seconds)
        dispatch(onSlideWave((seconds) / duration))
        dispatch(isSliding(true))
    }

    const moveSlider = (sliderSelector, fraction) => {
        document.querySelector(sliderSelector).style.transform = "scalex(" + fraction.toString() + ")"
    }

    const moveThumb = (thumbSelector, timePlayed, duration) => {
        document.querySelector(thumbSelector).style.left = ((timePlayed / duration) * 98).toString() + "%"
    }

    const autoStop = useCallback((duration, ref, isPlaying) => {
        const currentTime = ref.current.getCurrentTime()
        if (currentTime === duration) {
            isPlaying(false)
            dispatch(onPlay(false))
        }
    }, [isPlaying])

    /**
     * this comment below is the object passed as parameter in onProgress from ReactPlayer component.
     */
    // played = {
    //  loaded: 0.0929124616928907
    //  loadedSeconds: 88.847
    //  played: 0.018461006630846166
    //  playedSeconds: 17.65323
    // }

    return (
        <Fragment>
            <FullScreen handle={handle} className="full-screen" onChange={() => setIsFullScreen(!isFullScreen)}>
                <div className="video-wrapper">
                    <ReactPlayer ref={vidPlayer} onProgress={(e) => {
                        dispatch(videoPosition(e.playedSeconds))
                        setPlayedSeconds(e.playedSeconds)
                        moveSlider(".connect", e.played)
                        moveThumb(".thumb", e.playedSeconds, duration)
                        autoStop(duration, vidPlayer, setIsPlaying)
                    }} onDuration={(duration) => {
                        setDuration(duration)
                        setGDuration(duration)
                        }} style={{ maxWidth: "1050px" }} width="1020px" height="592px" url={stateR.videoUrl} controls={false} playing={isPlaying} />
                    <div className="video-controls-wrapper">
                        <div className="progress-bar-container">
                            <VideoSeekSlider
                                max={duration}
                                currentTime={() => playedSeconds}
                                onChange={(time) => {
                                    slideTo(time)
                                    // slideWave(time)
                                }}
                                offset={0}
                                secondsPrefix="00:00:"
                                minutesPrefix="00:"
                            />
                        </div>
                        <div className="video-controls">
                            <div className="video-time">{secs2min(playedSeconds) + " / " + secs2min(duration)}</div>
                            <div className="video-controls-buttons">
                                <Button fullWidth={true} variant="contained" className="seek-button seek-bakward double-seek" onClick={() => seekBackward(10)}><img src={seekButton}></img></Button>
                                <Button variant="contained" className="seek-button seek-bakward" onClick={() => seekBackward(5)}><img src={seekButtonSingle}></img></Button>
                                <Button variant="contained" className="play-button" onClick={togglePlay}>{isPlaying ? <PauseIcon style={{ color: "#151616" }} /> : <PlayArrowIcon style={{ color: "#151616" }} />}</Button>
                                <Button variant="contained" className="seek-button seek-forward" onClick={() => seekForeward(5)}><img src={seekButtonSingle}></img></Button>
                                <Button variant="contained" className="seek-button seek-forward double-seek" onClick={() => seekForeward(10)}><img src={seekButton}></img></Button>
                            </div>
                            <div>
                                {/* Come back to fix this component later */}
                                <FullScreenTogglers isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} handle={handle} />
                            </div>
                        </div>
                    </div>
                </div>
                <ChartsPanel isPlaying={isPlaying} />
            </FullScreen>
        </Fragment>
    )
}
