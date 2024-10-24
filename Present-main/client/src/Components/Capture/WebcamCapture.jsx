// src/components/WebcamCapture.jsx
import React, { useRef } from 'react';
import './WebcamCapture.css'

const WebcamCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => {
        console.error("Error accessing webcam: ", err);
      });
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const imageSrc = canvas.toDataURL('image/jpeg');
    onCapture(imageSrc);
  };

  React.useEffect(() => {
    startVideo();
  }, []);

  return (
    <div className='main_display'>
      <video ref={videoRef} autoPlay style={{ width: '60%', transform: 'scaleX(-1)'}} />
      <br />
      <button onClick={capturePhoto} className='captureButton'>Capture Photo</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WebcamCapture;


