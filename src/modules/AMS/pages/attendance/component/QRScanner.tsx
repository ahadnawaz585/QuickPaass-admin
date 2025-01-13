import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Box, Typography } from '@mui/material';

interface QRScannerProps {
  onScanSuccess: (employeeId: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        console.log(decodedText);
        onScanSuccess(decodedText);
      },
      (error) => {
        console.error('QR Code scanning error:', error);
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [onScanSuccess]);

  return (
    <Box className="qr-scanner-container">
      <Typography variant="h6" gutterBottom>
        Scan QR Code
      </Typography>
      <Box className="scanner-wrapper">
        <div id="qr-reader" />
      </Box>
    </Box>
  );
};

export default QRScanner;