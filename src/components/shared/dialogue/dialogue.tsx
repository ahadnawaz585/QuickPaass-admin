// DialogueComponent.tsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';



const DialogueComponent: React.FC<DialogueProps> = ({ heading, question, onClose, showYesOrNo = true }) => {
  const [open, setOpen] = useState(true); // Local state to manage dialog visibility

  const handleNoClick = () => {
    onClose(false);
    setOpen(false); // Close the dialog
  };

  const handleYesClick = () => {
    onClose(true);
    setOpen(false); // Close the dialog
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{heading}</DialogTitle>
      <DialogContent>
        <p>{question}</p>
      </DialogContent>
      {showYesOrNo && <DialogActions>
        <Button onClick={handleNoClick} color="error">
          No
        </Button>
        <Button onClick={handleYesClick} color="primary">
          Yes
        </Button>
      </DialogActions>}
      {!showYesOrNo && <DialogActions>
        <Button onClick={handleYesClick} color="primary">
          Ok
        </Button>
      </DialogActions>}
    </Dialog>
  );
};

export default DialogueComponent;
