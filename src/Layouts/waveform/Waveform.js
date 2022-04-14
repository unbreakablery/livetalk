import React, { useEffect, useRef, useState } from "react";

import WaveSurfer from "wavesurfer.js/";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions"

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: "#eee",
  progressColor: "#F72585",
  skipLength:2,
  cursorColor: "OrangeRed",
  barWidth: 1,
  barRadius: 0,
  scrollParent: true,
  responsive: true,
  height: 200,
  barGap:1,
  fillParent:true,
  hideScrollbar:false,
  // hideScrollbar:true,
  cursorColor:"#4CC9F0",
  // width:1000,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
  //////////////////////////////
  minPxPerSec: 100,
  plugins: [
    RegionsPlugin.create({
      regionsMinLength: 2,
      regions: [
        {
          start: 1,
          end: 3,
          loop: false,
          color: 'hsla(400, 100%, 30%, 0.5)'
        }, {
          start: 5,
          end: 7,
          loop: false,
          color: 'hsla(200, 50%, 70%, 0.4)',
          minLength: 1,
        }
      ],
      dragSelection: {
        slop: 5
      }
    })
  ]
});


export default function Waveform({ url }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current, WaveSurfer);
    wavesurfer.current = WaveSurfer.create(options);
    console.log("wavesurfer.current")

    wavesurfer.current.load(url);

    wavesurfer.current.on("ready", function() {
      // https://wavesurfer-js.org/docs/methods.html
      // wavesurfer.current.play();
      // setPlay(true);
      console.log("wavesurfer ready")
      // make sure object stillavailable when file loaded
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        // wavesurfer.current.play() // added by me
        setVolume(volume);
      }
    });

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [url]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  const onVolumeChange = e => {
    const { target } = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume || 1);
    }
  };

  return (
    <div>
      <div id="waveform" ref={waveformRef} />
      {/* <div className="controls">
        <button onClick={handlePlayPause}>{!playing ? "Play" : "Pause"}</button>
        <input
          type="range"
          id="volume"
          name="volume"
          // waveSurfer recognize value of `0` same as `1`
          //  so we need to set some zero-ish value for silence
          min="0.01"
          max="1"
          step=".025"
          onChange={onVolumeChange}
          defaultValue={volume}
        />
        <label htmlFor="volume">Volume</label>
      </div> */}
    </div>
  );
}
