import React from 'react';
import { Box, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Clear';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, onClose }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 2,
        outline: 'none',
      }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon color="warning" />
        </IconButton>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Modal Content"
            style={{ maxWidth: '100%', maxHeight: '90vh', display: 'block', margin: '0 auto' }}
          />
        )}
      </Box>
    </Modal>
  );
};