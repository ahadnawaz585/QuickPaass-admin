"use client";

import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { QrCode } from '@mui/icons-material';
import styles from './PhysicalScanner.module.scss';

interface ScannerDevice {
  deviceId: string;
  label: string;
}

const PhysicalScanner: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [scannedCode, setScannedCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

  const connectScanner = async () => {
    setIsInitializing(true);
    setError('');

    try {
        // const device = await navigator.usb.requestDevice({ 

        //     filters: [{ vendorId: 0x0424, productId: 0xEC00 }] // Example filter for a specific device
      
        //   });
      
      
      
        //   const deviceList = document.getElementById('deviceList');
      
        //   const listItem = document.createElement('li');
      
        //   listItem.textContent = `Product Name: ${device.productName}, Vendor ID: ${device.vendorId}`;
      
        //   deviceList?.appendChild(listItem);
          
      if (!('usb' in navigator)) {
        throw new Error('WebUSB is not supported in this browser.');
      }

      const device = await (navigator as any).usb.requestDevice({
        // filters: [{ vendorId: 0x0483, productId: 0x5740 }]
        filters: []
      });

      console.log(await device);

      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      device.addEventListener('inputreport', (event: any) => {
        const data = new TextDecoder().decode(event.data);
        setScannedCode(data.trim());
      });

      (navigator as any).usb.addEventListener('disconnect', (event: any) => {
        if (event.device === device) {
          setIsConnected(false);
          setError('Scanner disconnected. Please reconnect the device.');
        }
      });

      setIsConnected(true);
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotFoundError') {
          setError('No compatible scanner selected. Please try again.');
        } else {
          setError(`Failed to initialize scanner: ${err.message}`);
        }
      } else {
        setError('An unknown error occurred');
      }
      setIsConnected(false);
    } finally {
      setIsInitializing(false);
    }
  };

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
    </Box>
  );
};

export default PhysicalScanner;