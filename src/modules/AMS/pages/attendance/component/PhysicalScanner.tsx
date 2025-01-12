'use client'

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

  const checkSupport = useCallback(() => {
    // if (!window.isSecureContext) {
    //   setBrowserSupported(false);
    //   setError('WebUSB requires a secure context (HTTPS or localhost). Your app is running on HTTP.');
    //   return;
    // }

    const isChromium = true;
    const isEdge = navigator.userAgent.indexOf('Edg') !== -1;

    if (!isChromium && !isEdge) {
      setBrowserSupported(false);
      setError('WebUSB is only supported in Chrome and Edge browsers.');
      return;
    }

    if (!('usb' in navigator)) {
      setBrowserSupported(false);
      setError('WebUSB is not supported in this browser.');
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
      const device = await (navigator as any).usb.requestDevice({
        filters: [{ vendorId: 0x04f2, productId: 0xb725 }],
      });

      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      device.addEventListener('inputreport', handleScannerInput);
      (navigator as any).usb.addEventListener('disconnect', handleDisconnect);

      setIsConnected(true);
      setError('');
      setShowSuccessSnackbar(true);
    } catch (err) {
      handleError(err);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleScannerInput = (event: any) => {
    try {
      const data = new TextDecoder().decode(event.data);
      setScannedCode(data.trim());
    } catch (err) {
      console.error('Error decoding scanner data:', err);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setError('Scanner disconnected. Please reconnect the device.');
  };

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      if (err.name === 'NotFoundError') {
        setError('No compatible scanner selected. Please try again.');
      } else if (err.name === 'SecurityError') {
        setError('Access to USB devices was denied. Please try again and grant permission.');
      } else {
        setError(`Failed to initialize scanner: ${err.message}`);
      }
    } else {
      setError('An unknown error occurred.');
    }
    setIsConnected(false);
  };

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
            Please use Chrome or Edge browser with HTTPS to access the scanner.
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

