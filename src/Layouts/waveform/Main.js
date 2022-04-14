import React, { useState } from "react";
import "./loader.scss";

import Waveform from "./Waveform";
import PlayList from "./PlayList";

// const url = "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3";

const tracks = [
  {
    id: 0,
    title: "Brahms: St Anthony Chorale - Theme, Two Pianos Op.56b",
    url:
      "https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3"
  },
];

export default function App() {
  const [selectedTrack, setSelectedTrack] = useState(tracks[0]);
React.useEffect(() => {
  const abc = document.getElementById("waveform")
  console.log(abc)

}, [])
  return (
    <div className="App">
      <Waveform url={selectedTrack.url} progressColor='purple' />
      <PlayList
        tracks={tracks}
        selectedTrack={selectedTrack}
        setSelectedTrack={setSelectedTrack}
      />
    </div>
  );
}
