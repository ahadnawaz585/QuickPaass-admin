import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Button, Snackbar } from '@mui/material';
import { QrCode, CheckCircleOutline } from '@mui/icons-material';
import styles from './PhysicalScanner.module.scss';

const PhysicalScanner: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [scannedCode, setScannedCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [browserSupported, setBrowserSupported] = useState<boolean>(true);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState<boolean>(false);
  const [device, setDevice] = useState<HIDDevice | null>(null);

  const checkSupport = useCallback(() => {
    if (!('hid' in navigator)) {
      setBrowserSupported(false);
      setError('WebHID is not supported in this browser.');
      return;
    }
  }, []);

  useEffect(() => {
    checkSupport();
  }, [checkSupport]);

  const connectScanner = async () => {
    if (!browserSupported) return;
  
    setIsInitializing(true);
    setError('');
  
    try {
      const devices = await navigator.hid.requestDevice({
        filters: [{ vendorId: 7554, productId: 23712 }],
      });
  
      if (devices.length === 0) {
        throw new Error('No device selected.');
      }
  
      const device:any = devices[0];
      console.log('Selected Device:', device);
      await device.open();
        console.log("hello")
      device.oninputreport = (event:any) => {
        console.log('Input report received:', event);
        const { data, reportId } = event;
        console.log('Report ID:', reportId);
        console.log('Raw Data (Uint8Array):', new Uint8Array(data.buffer));
  
        if (data) {
          try {
            const textDecoder = new TextDecoder();
            const scannedData = textDecoder.decode(data);
            console.log('Decoded Data:', scannedData);
            setScannedCode(scannedData.trim());
          } catch (err) {
            console.error('Error decoding data:', err);
            setError('Failed to decode scanned data.');
          }
        }
      };
      console.log("bye")
      setDevice(device);
      setIsConnected(true);
      setShowSuccessSnackbar(true);
      setError('');
    } catch (err) {
      handleError(err);
    } finally {
      setIsInitializing(false);
    }
  };
  

  const handleError = (err: unknown) => {
    console.error('Error occurred:', err);
    if (err instanceof Error) {
      if (err.name === 'NotFoundError') {
        setError('No compatible scanner selected. Please try again.');
      } else if (err.name === 'SecurityError') {
        setError('Access to HID devices was denied. Please try again and grant permission.');
      } else if (err.name === 'NotAllowedError') {
        setError('Permission denied. Please ensure you grant access to the HID device.');
      } else {
        setError(`Failed to initialize scanner: ${err.message}`);

      }
    } else {
      setError('An unknown error occurred.');
    }
    setIsConnected(false);
    setDevice(null);
  };

  const handleDisconnect = useCallback(
    (e: HIDConnectionEvent) => {
      if (e.device === device) {
        setIsConnected(false);
        setDevice(null);
        setError('Scanner disconnected. Please reconnect the device.');
      }
    },
    [device]
  );

  useEffect(() => {
    navigator.hid.addEventListener('disconnect', handleDisconnect);
    return () => {
      if (device) {
        device.close().catch(console.error);
      }
      navigator.hid.removeEventListener('disconnect', handleDisconnect);
    };
  }, [device, handleDisconnect]);

  if (!browserSupported) {
    return (
      <Box className={styles.scannerContainer}>
        <Typography variant="h5" component="h2" className={styles.title}>
          <QrCode className={styles.icon} />
          Barcode Scanner
        </Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please use a browser that supports WebHID.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box className={styles.scannerContainer}>
      <Typography variant="h5" component="h2" className={styles.title}>
        <QrCode className={styles.icon} />
        Barcode Scanner
      </Typography>

      {!isConnected && (
        <Button
          variant="contained"
          color="primary"
          onClick={connectScanner}
          disabled={isInitializing}
          className={styles.connectButton}
        >
          {isInitializing ? 'Connecting...' : 'Connect Scanner'}
        </Button>
      )}

      {isInitializing ? (
        <Box display="flex" justifyContent="center" alignItems="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
         <Box className={`${styles.scannerStatus} ${isConnected ? styles.connected : styles.disconnected}`}>
            <Typography variant="body1">
              Status: {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box className={styles.scannerResult}>
            <Typography variant="h6">Scanned Code:</Typography>
            {scannedCode ? (
              <Typography variant="body1">{scannedCode}</Typography>
            ) : (
              <Typography variant="body2" className={styles.noData}>
                No code scanned yet
              </Typography>
            )}
          </Box>
        </>
      )}

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSuccessSnackbar(false)}
        message={
          <Box display="flex" alignItems="center">
            <CheckCircleOutline sx={{ mr: 1 }} />
            Scanner connected successfully
          </Box>
        }
      />
    </Box>
  );
};

export default PhysicalScanner;