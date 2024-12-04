import React from 'react';
import { Button } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';

const CustomButton: React.FC<CustomButtonProps> = ({
  buttonText,
  iconName,
  buttonClass,
  onClick,
}) => {
  return (
    <Button style={{ fontSize: '0.7rem' ,maxHeight:'25px'}}
      size="small"
      startIcon={
        iconName === 'cancel' ? (
          <CancelIcon />
        ) : iconName === 'add' ? (
          <AddIcon />
        ) : (
          undefined
        )
      }
      variant={buttonClass === 'primary' ? 'contained' : 'outlined'}
      color="primary"
      onClick={onClick}
    >
      <span>{buttonText}</span>
    </Button>
  );
};

export default CustomButton;
