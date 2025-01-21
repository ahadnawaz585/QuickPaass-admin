import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Button, Snackbar, TextField } from '@mui/material';
import { QrCode, CheckCircleOutline, PersonAdd, Refresh } from '@mui/icons-material';
import styles from './PhysicalScanner.module.scss';
import EmployeeService from '@/modules/AMS/services/employee.service';

interface ScannerProps {
  onScanSuccess: (employeeId: string) => void;
}

const PhysicalScanner: React.FC<ScannerProps> = ({ onScanSuccess }) => {
  const employeeService:EmployeeService = new EmployeeService();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [scannedCode, setScannedCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [browserSupported, setBrowserSupported] = useState<boolean>(true);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState<boolean>(false);
  const [device, setDevice] = useState<HIDDevice | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanTimeout, setScanTimeout] = useState<NodeJS.Timeout | null>(null);

  const SCAN_DELAY = 3000; // 3 seconds delay between scans

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

  const handleScan = (scannedData: string) => {
    if (isScanning) return; // Prevent scanning during cooldown

    setScannedCode(scannedData.trim());
    setIsScanning(true);

    // Clear any existing timeout
    if (scanTimeout) {
      clearTimeout(scanTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      setIsScanning(false);
    }, SCAN_DELAY);

    setScanTimeout(timeout);
  };

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

      const device: any = devices[0];
      await device.open();

      device.oninputreport = (event: any) => {
        const { data } = event;
        if (data) {
          try {
            const textDecoder = new TextDecoder();
            const scannedData = textDecoder.decode(data);
            handleScan(scannedData);
          } catch (err) {
            console.error('Error decoding data:', err);
            setError('Failed to decode scanned data.');
          }
        }
      };

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

  const handleMarkAttendance = async() => {
    if (scannedCode) {
      const employee =await employeeService.getEmployeeByCode(scannedCode);
      if(employee){
      onScanSuccess(employee.id);
      setScannedCode(''); // Clear the scanned code after marking attendance
    }
  }
  };

  const rescan = ()=>{
    setScannedCode('');
  }

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
      if (scanTimeout) {
        clearTimeout(scanTimeout);
      }
      navigator.hid.removeEventListener('disconnect', handleDisconnect);
    };
  }, [device, handleDisconnect, scanTimeout]);

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
              {isScanning && ' (Cooldown)'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box className={styles.scannerResult}>
            <TextField
              label="Scanned Code"
              value={scannedCode}
              onChange={(event) => {
                const inputValue = event.target.value; // Get the input's current value
                // console.log('Current Input Value:', inputValue);
                setScannedCode(inputValue); // Update the scannedCode state if needed
              }}
              variant="outlined"
              fullWidth
              autoFocus
              // InputProps={{
              //   readOnly: true,
              // }}
              sx={{ mt: 2 }}
            />
          </Box>

          {scannedCode!='' && (
            <>
            <Button
              variant="contained"
              color="success"
              onClick={handleMarkAttendance}
              startIcon={<PersonAdd />}
              sx={{ mt: 2 }}
              fullWidth
            >
              Mark Attendance
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={rescan}
              startIcon={<Refresh />}
              sx={{ mt: 2 }}
              fullWidth
            >
              Rescan
            </Button>
            </>
          )}

          <Box className={styles.scannerResult}>
            <Typography variant="h6">Scanner Status:</Typography>
            <Typography variant="body2" color={isScanning ? "warning.main" : "success.main"}>
              {isScanning ? 'Please wait before next scan...' : 'Ready to scan'}
            </Typography>
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