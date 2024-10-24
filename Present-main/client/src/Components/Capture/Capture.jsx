// src/App.jsx
import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import WebcamCapture from './WebcamCapture';
import { useLocation } from 'react-router-dom';



const Capture = () => {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  // const [userName, setUserName] = useState('');
  const location = useLocation();
  let {division, timeSlot, subject } = location.state || {};

  // Names of the two classes in your model
  let studentNames = []; // Update with actual student names
  if(division==="division1"){
      studentNames = ["Nishit (210303105179)", "Neet", "Ajay (210303105063)"];
  } else {
     studentNames = ["Neet (210303105144)", "Neet (210303105144)", "Neet (210303105144)"];
  }
  let modelPath = "";

  useEffect(() => {
    const loadModel = async () => {
      console.log(division);
      if (division){
        modelPath = `Models/${division}/model.json`
      }
      const loadedModel = await tf.loadLayersModel(modelPath);
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const handleCapture = async (imageSrc) => {
    if (model) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = async () => {
        const tensor = tf.browser.fromPixels(img)
          .resizeNearestNeighbor([224, 224]) // Ensure this matches your model's input size
          .toFloat()
          .div(tf.scalar(255))
          .expandDims();

        const predictions = await model.predict(tensor).data();
        console.log("Predictions:", predictions); 

        // Determine the detected student based on the highest confidence score
        let maxIndex = predictions.indexOf(Math.max(...predictions));
        console.log(maxIndex);
        const maxConfidence = predictions[maxIndex];

        const threshold = 0.4; // Adjust this threshold as needed

        if (maxConfidence > threshold) {
          const detectedStudent = studentNames[maxIndex];
          setPrediction(`${detectedStudent} Detected`);

          // Attendance Logic
          if (!attendanceList.includes(detectedStudent)) {
            setAttendanceList((prev) => [...prev, detectedStudent]);
            console.log(`Attendance recorded for: ${detectedStudent}`); // Log to console
          }
        } else {
          setPrediction('Not Recognized');
        }
      };
    }
  };


  return (
    <div>
      <h1 className='heading'>Smart Attendance System</h1>
      <WebcamCapture onCapture={handleCapture}  />
      {/* {prediction && <div>Prediction: {prediction}</div>} */}
      {attendanceList.length > 0 && (
        <div className='attendance-list'>
          <h2>Attendance List:</h2>
          <ul>
            {attendanceList.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Capture;




