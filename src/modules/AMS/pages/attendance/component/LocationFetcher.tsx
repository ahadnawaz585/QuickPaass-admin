import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { Pin } from '@mui/icons-material';

interface LocationFetcherProps {
  isLoading: boolean;
  location: string | null;
}

const LocationFetcher: React.FC<LocationFetcherProps> = ({ isLoading, location }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
      <Pin/>
      {isLoading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">Fetching location...</Typography>
        </Box>
      ) : location ? (
        <Typography variant="body2">{location}</Typography>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Location not available
        </Typography>
      )}
    </Box>
  );
};

export default LocationFetcher;