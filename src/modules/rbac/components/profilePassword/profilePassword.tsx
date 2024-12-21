"use client"

import React, { useState } from 'react';
import { Typography, TextField, Button, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import UserService from '@/modules/rbac/services/user.service';
import styles from "./profilePassword.module.scss";

interface ProfilePasswordProps {
    onSubmit: (password: string) => void;
    onDiscard: () => void;
    showConfirmPassword: boolean;
}

const ProfilePassword: React.FC<ProfilePasswordProps> = ({ onSubmit, onDiscard, showConfirmPassword }) => {
    const userService: UserService = new UserService();
    const [previousPassword, setPreviousPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [passwordMatched, setPasswordMatched] = useState<boolean>(false);
    const [showPasswordFields, setShowPasswordFields] = useState<boolean>(!showConfirmPassword); // Show password fields directly if showConfirmPassword is false
    const [passwordMatchMessage, setPasswordMatchMessage] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false); // State to manage password visibility

    const checkPassword = async (password: string) => {
        try {
            const matched: boolean = await userService.checkPreviousPassword(password);
            setPasswordMatched(matched);
            if (matched) {
                setShowPasswordFields(true);
                setPasswordMatchMessage('Password matched!');
            } else {
                setPasswordMatchMessage('Password does not match!');
            }
        } catch (error) {
            console.error("Error matching user password: ", error);
        }
    }

    const handleSubmit = () => {
        if (newPassword.length < 8) {
            setPasswordMatchMessage('New password must be at least 8 characters long.');
            return;
        }

        if (!showConfirmPassword || newPassword === confirmNewPassword) {
            onSubmit(newPassword);
            resetFields();
        } else {
            setPasswordMatchMessage('New passwords do not match!');
        }
    }

    const handleDiscard = () => {
        resetFields();
        onDiscard();
    }

    const resetFields = () => {
        setPreviousPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setPasswordMatched(false);
        setShowPasswordFields(!showConfirmPassword); 
        setPasswordMatchMessage('');
    }

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                {showConfirmPassword && !passwordMatched && !showPasswordFields && (
                    <>
                        <TextField
                            className={styles.checkPassword}
                            label="Enter Previous Password"
                            type="password"
                            variant='standard'
                            value={previousPassword}
                            onChange={(e) => setPreviousPassword(e.target.value)}
                        />
                        <Button variant="contained" className={styles.checkPassword} onClick={() => checkPassword(previousPassword)}>Check Password</Button>
                        {passwordMatchMessage && (
                            <Typography variant="body2" color="error">{passwordMatchMessage}</Typography>
                        )}
                    </>
                )}
                {showPasswordFields && (
                    <div>
                        <TextField
                            label="Enter New Password"
                            type={showPassword ? "text" : "password"}
                            className={styles.newPassword}
                            variant='standard'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                )
                            }}
                        />
                        {showConfirmPassword && (
                            <TextField
                                label="Confirm New Password"
                                type={showPassword ? "text" : "password"}
                                variant='standard'
                                className={styles.newPassword}
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                        )}
                        {passwordMatchMessage && (
                            <Typography variant="body2" className={styles.message}>{passwordMatchMessage}</Typography>
                        )}
                        <div className={styles.buttonContainer}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={showConfirmPassword && (!passwordMatched || newPassword !== confirmNewPassword || newPassword === '')}
                            >
                                Submit
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={handleDiscard}>Discard</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePassword;
