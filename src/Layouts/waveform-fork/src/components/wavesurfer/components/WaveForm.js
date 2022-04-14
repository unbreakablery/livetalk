import React from "react";
// import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline'


const WaveForm = ({ id, children }) => {
  return <div id={id}>{children}</div>;
};

WaveForm.defaultProps = {
  waveColor: "violet",
  progressColor: "purple",
  id: "waveform",
  plugins: [],
  chart: {
    animations: {
      enabled: false
    }
  }
};

export default WaveForm;
