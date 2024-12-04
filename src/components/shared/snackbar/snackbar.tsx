import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

interface DynamicSnackbarProps {
    text: string;
}

const DynamicSnackbar: React.FC<DynamicSnackbarProps> = ({ text }) => {
    const [open, setOpen] = useState(true);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert
                elevation={6}
                variant="filled"
                severity="info"
                onClose={handleClose} // Ensure the Snackbar closes when the Alert is closed
            >
                {text}
            </MuiAlert>
        </Snackbar>
    );
}

export default DynamicSnackbar;
