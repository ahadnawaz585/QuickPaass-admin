"use client";

import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography,
  Paper,
  CircularProgress,
  Tab,
  Tabs
} from '@mui/material';
import { 
  CameraAlt as CameraIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import styles from './styles.module.scss';

export default function FaceRegistration() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [name, setName] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/';
      
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoading(false);
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();
  }, []);

  const detectFace = async (imageSrc: string) => {
    const img = new Image();
    img.src = imageSrc;
    await img.decode();
    
    const detections = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    setFaceDetected(!!detections);
  };

  const handleCapture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        await detectFace(imageSrc);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageSrc = e.target?.result as string;
        setCapturedImage(imageSrc);
        await detectFace(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!capturedImage || !faceDetected || !name) return;
console.log(faceDetected);
    try {
      // Here you would typically make an API call to your backend
      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', capturedImage);

      // Example API call (replace with your actual endpoint)
      const response = await fetch('/api/register-face', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Face registered successfully!');
        // Reset form
        setName('');
        setCapturedImage(null);
        setFaceDetected(false);
      } else {
        throw new Error('Failed to register face');
      }
    } catch (error) {
      console.error('Error saving face:', error);
      alert('Failed to register face. Please try again.');
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setFaceDetected(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isModelLoading) {
    return (
      <Container className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6">Loading face detection models...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h4" gutterBottom className={styles.title}>
          Face Registration
        </Typography>

        <Box className={styles.formContainer}>
          <TextField
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            variant="outlined"
          />

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            centered
            className={styles.tabs}
          >
            <Tab label="Webcam" />
            <Tab label="Upload Image" />
          </Tabs>

          <Box className={styles.cameraContainer}>
            {!capturedImage ? (
              activeTab === 0 ? (
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className={styles.webcam}
                />
              ) : (
                <Box className={styles.uploadBox}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<UploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!name}
                  >
                    Upload Photo
                  </Button>
                </Box>
              )
            ) : (
              <img src={capturedImage} alt="Captured" className={styles.capturedImage} />
            )}
            {canvasRef.current && (
              <canvas ref={canvasRef} className={styles.canvas} />
            )}
          </Box>

          <Box className={styles.buttonGroup}>
            {!capturedImage ? (
              activeTab === 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CameraIcon />}
                  onClick={handleCapture}
                  disabled={!name}
                >
                  Capture Photo
                </Button>
              )
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<RefreshIcon />}
                  onClick={handleReset}
                >
                  Retake
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={!faceDetected}
                >
                  Save
                </Button>
              </>
            )}
          </Box>

          {capturedImage && !faceDetected && (
            <Typography color="error" className={styles.error}>
              No face detected. Please try again.
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}