import React, { useRef, useCallback, useEffect, useState } from 'react'
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

function Video({ setExpressions, isStreaming ,start, stop }) {
  // const webcamRef = useRef(null);
  const camera = useRef()
  // const mediaRecorderRef = useRef(null);
  // const [capturing, setCapturing] = useState(false);
  // const [recordedChunks, setRecordedChunks] = useState([]);

  const [modelLoaded, setModelLoaded] = useState(false)

  async function loadModels() {
    console.log("loading models")
    return await Promise.all([
      faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"),
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models")
    ]).then(() => console.log("models loaded")).then(() => setModelLoaded(true))
  }

  async function detectFaces() {
    if (camera && camera.current && camera.current.video) {
      // console.log("inside if block")
      const { video } = camera.current;
      // (async () => {
      video.onloadedmetadata = () => {
        const canvas = faceapi.createCanvasFromMedia(video)
        document.querySelector("#cam-wrapper").append(canvas)
        const displaySize = { width: video.clientWidth, height: video.clientHeight }
        faceapi.matchDimensions(canvas, displaySize)
        // console.log("before if")
        if (canvas) {
          // console.log("after if")
          setInterval(async () => {
            const results = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({})).withFaceLandmarks(true).withFaceExpressions()
            if(!results.length)
              return
            const resized = faceapi.resizeResults(results, displaySize)
            // console.log(results[0]?.expressions)
            setExpressions(results[0]?.expressions)
            // DrawFaceLandmarks()
            let options = {
              drawLines: true,
              drawPoints: false,
              lineWidth: 1,
              lineColor: "#FFFFFF",
            }
            let drawOptions = new faceapi.draw.DrawFaceLandmarksOptions(options)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            let lndmk = resized[0] ? resized[0].landmarks : []
            // console.log(lndmk)
            // window.det = resized
            // faceapi.draw.drawFaceLandmarks(canvas, resized)
            new faceapi.draw.DrawFaceLandmarks(lndmk, drawOptions).draw(canvas)
          }, 200)
        }
      }
    }
  }

  /*
  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );
  */

  /*
  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);
   */

  const videoConstraints = {
     facingMode: "user",
     width: 640
  };

  useEffect(() => {
    (async () => {
      console.log("effect")
      await loadModels()
      await detectFaces()
    })()
  }, [])

  return (
    <div id="cam-wrapper">
      <Webcam audio={true} ref={camera} videoConstraints={videoConstraints} />
    </div>
  );
}

export default Video
