"use client"
import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { 
  Box,
  Button, 
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Typography
} from '@mui/material';
import { Camera, Refresh } from '@mui/icons-material';
import AttendanceService from '../../services/attendance.service';

const CAPTURE_INTERVAL = 3000; // Capture every 3 seconds

interface AttendanceResponse {
  success: boolean;
  message: string;
  status?: string | null;
  data?: any;
}

function FaceMatch() {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', isError: false });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    message: '',
    employeeName: '',
    status: ''
  });

  const captureInterval = useRef<NodeJS.Timeout>();
  const attendanceService = new AttendanceService();

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current) return;

    try {
      setIsLoading(true);
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      // Remove the data:image/jpeg;base64, prefix
      const base64Image = imageSrc.split(',')[1];
      
      const response = await attendanceService.faceAttendance(base64Image);
      const data: any = response.data;

      if (!data.success) {
        setSnackbar({ 
          open: true, 
          message: data.message, 
          isError: true 
        });
        return;
      }

      if (data.status === null && data.message.includes('has not checked in yet')) {
        // Extract employee name and status from message
        const matches = data.message.match(/^(.*?) has not checked in yet.*\s(\w+)\?$/);
        if (matches) {
          setConfirmDialog({
            open: true,
            message: data.message,
            employeeName: matches[1],
            status: matches[2]
          });
          return;
        }
      }

      setSnackbar({
        open: true,
        message: data.message,
        isError: false
      });

    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error processing attendance',
        isError: true
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startCapturing = useCallback(() => {
    setIsCapturing(true);
    captureInterval.current = setInterval(handleCapture, CAPTURE_INTERVAL);
  }, [handleCapture]);

  const stopCapturing = useCallback(() => {
    setIsCapturing(false);
    if (captureInterval.current) {
      clearInterval(captureInterval.current);
    }
  }, []);

  const handleConfirmAttendance = async () => {
    // Here you would implement the confirmation logic
    setConfirmDialog({ open: false, message: '', employeeName: '', status: '' });
    setSnackbar({
      open: true,
      message: 'Attendance confirmed successfully',
      isError: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-2xl mx-auto p-6">
        <Typography variant="h4" className="mb-6 text-center">
          Face Attendance System
        </Typography>

        <Box className="relative">
          <Paper elevation={3} className="overflow-hidden rounded-lg">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full"
              mirrored
            />
          </Paper>

          {isLoading && (
            <Box className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <CircularProgress color="primary" />
            </Box>
          )}
        </Box>

        <Box className="mt-6 flex justify-center gap-4">
          {!isCapturing ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Camera />}
              onClick={startCapturing}
            >
              Start Face Detection
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Refresh />}
              onClick={stopCapturing}
            >
              Stop Detection
            </Button>
          )}
        </Box>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        ContentProps={{
          className: snackbar.isError ? 'bg-red-600' : 'bg-green-600'
        }}
      />

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>Confirm Attendance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
            Cancel
          </Button>
          <Button onClick={handleConfirmAttendance} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FaceMatch;