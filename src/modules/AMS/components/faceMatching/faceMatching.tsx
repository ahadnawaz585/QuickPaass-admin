"use client";

import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';
import { 
  Box, 
  Button, 
  Container, 
  Typography,
  Paper,
  CircularProgress,
  Tab,
  Tabs,
  Alert
} from '@mui/material';
import { 
  CameraAlt as CameraIcon,
  Compare as CompareIcon,
  Refresh as RefreshIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import styles from './styles.module.scss';

export default function FaceMatching() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<{
    isMatch: boolean;
    confidence: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/';
      
      try {
        setError(null);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoading(false);
      } catch (error) {
        console.error('Error loading models:', error);
        setError('Failed to load face detection models. Please refresh the page.');
      }
    };

    loadModels();
  }, []);

  const getFaceDescriptor = async (imageSrc: string) => {
    const img = new Image();
    img.src = imageSrc;
    await img.decode();
    
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      throw new Error('No face detected in the image');
    }

    return detection.descriptor;
  };

  const handleCapture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImage2(imageSrc);
        setMatchResult(null);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, imageNumber: 1 | 2) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageSrc = e.target?.result as string;
        if (imageNumber === 1) {
          setImage1(imageSrc);
        } else {
          setImage2(imageSrc);
        }
        setMatchResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const compareFaces = async () => {
    if (!image1 || !image2) return;

    try {
      setError(null);
      const descriptor1 = await getFaceDescriptor(image1);
      const descriptor2 = await getFaceDescriptor(image2);

      const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
      const threshold = 0.6; // Adjust this threshold based on your needs
      const confidence = Math.max(0, Math.min(100, (1 - distance) * 100));

      setMatchResult({
        isMatch: distance < threshold,
        confidence: Number(confidence.toFixed(2))
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during face comparison');
      setMatchResult(null);
    }
  };

  const handleReset = () => {
    setImage1(null);
    setImage2(null);
    setMatchResult(null);
    setError(null);
    if (fileInputRef1.current) fileInputRef1.current.value = '';
    if (fileInputRef2.current) fileInputRef2.current.value = '';
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
          Face Matching
        </Typography>

        <Tabs
          value={activeTab}
          onChange={(_, newValue) => {
            setActiveTab(newValue);
            handleReset();
          }}
          centered
          className={styles.tabs}
        >
          <Tab label="Compare Two Images" />
          <Tab label="Compare with Webcam" />
        </Tabs>

        <Box className={styles.matchingContainer}>
          <Box className={styles.imagesContainer}>
            {/* First Image */}
            <Box className={styles.imageBox}>
              <Typography variant="subtitle1" gutterBottom>
                Reference Image
              </Typography>
              {!image1 ? (
                <Box className={styles.uploadBox}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 1)}
                    ref={fileInputRef1}
                    style={{ display: 'none' }}
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<UploadIcon />}
                    onClick={() => fileInputRef1.current?.click()}
                  >
                    Upload Image
                  </Button>
                </Box>
              ) : (
                <img src={image1} alt="First" className={styles.uploadedImage} />
              )}
            </Box>

            {/* Second Image */}
            <Box className={styles.imageBox}>
              <Typography variant="subtitle1" gutterBottom>
                {activeTab === 0 ? 'Comparison Image' : 'Webcam'}
              </Typography>
              {activeTab === 0 ? (
                !image2 ? (
                  <Box className={styles.uploadBox}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 2)}
                      ref={fileInputRef2}
                      style={{ display: 'none' }}
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<UploadIcon />}
                      onClick={() => fileInputRef2.current?.click()}
                    >
                      Upload Image
                    </Button>
                  </Box>
                ) : (
                  <img src={image2} alt="Second" className={styles.uploadedImage} />
                )
              ) : (
                <Box className={styles.webcamContainer}>
                  {!image2 ? (
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className={styles.webcam}
                      mirrored
                    />
                  ) : (
                    <img src={image2} alt="Captured" className={styles.uploadedImage} />
                  )}
                </Box>
              )}
            </Box>
          </Box>

          <Box className={styles.buttonGroup}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RefreshIcon />}
              onClick={handleReset}
            >
              Reset
            </Button>
            {activeTab === 1 && !image2 && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<CameraIcon />}
                onClick={handleCapture}
                disabled={!image1}
              >
                Capture
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={<CompareIcon />}
              onClick={compareFaces}
              disabled={!image1 || !image2}
            >
              Compare Faces
            </Button>
          </Box>

          {error && (
            <Alert severity="error" className={styles.alert}>
              {error}
            </Alert>
          )}

          {matchResult && (
            <Alert 
              severity={matchResult.isMatch ? "success" : "warning"}
              className={styles.alert}
            >
              {matchResult.isMatch 
                ? `Face match! Confidence: ${matchResult.confidence}%`
                : `Faces do not match. Similarity: ${matchResult.confidence}%`}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
}