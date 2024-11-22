import { useRef, useEffect, useState } from "react";
import "./App.css";
import * as faceapi from "face-api.js";

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [mood, setMood] = useState("Happy");
  // LOAD FROM USEEFFECT
  useEffect(() => {
    startVideo();
    videoRef && loadModels();
  }, []);

  // OPEN YOU FACE WEBCAM
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // LOAD MODELS FROM FACE API

  const loadModels = () => {
    Promise.all([
      // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(() => {
      faceMyDetect();
    });
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections.length > 0) {
        detections.forEach((detection) => {
          const expressions = detection.expressions;
          if (expressions.angry > 0.5) {
            console.log("Angry");
            setMood("Angry");
          }
        });
      }
    }, 1000);
  };

  return (
    <div className="myapp">
      <h1>FAce Detection</h1>
      <p>Your mode:{mood}</p>
      <div className="appvide">
        <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
      </div>
    </div>
  );
}

export default App;
