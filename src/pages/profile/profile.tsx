"use client"
import React, { useState, useEffect } from 'react';
import { Typography, Avatar, Button, Snackbar } from '@mui/material';
import UserService from '@/service/user.service';
import styles from "./profile.module.scss";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProfilePassword from '@/components/shared/profilePassword/profilePassword';
import { Edit, Logout } from '@mui/icons-material';
import AuthService from '@/auth/auth.service';
import { permission } from '@/auth/access.service';
// import sidebarService from '@/frontend/utilities/sidebar';
import withPermission from '@/components/HOC/withPermission';
const Component = () => {

    const router = useRouter();
    const userService: UserService = new UserService();
    const [username, setUsername] = useState<string | null>(null);
    const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
    const [showLogoutOfAllDevices, setShowLogoutOfAllDevices] = useState<boolean>(false);

    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);
    const [canChangePassword, setCanChangePassword] = useState<boolean>(false);
    const auth: AuthService = new AuthService();


    // useEffect(() => {
    //     // Hide the sidebar when the component mounts
    //     sidebarService.toggleSidebars(false);

    // }, []);

    useEffect(() => {
        fetchUser();
        Permissions();
    }, []);

    const Permissions = async () => {
        setCanChangePassword(await permission("profile.changePassword.*"));
        setShowLogoutOfAllDevices(await permission("profile.logout.*"));
    }

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    }

    const logout = async () => {
        console.log("logging out..");
        try {
            await auth.logout();
            console.log("Logout successful");
           window.location.assign('/login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    const logoutOfAllDevices = async () => {
        console.log("logging out..");
        try {
            await auth.logoutOfAllDevices();
            console.log("Logout successful");
            window.location.assign('/login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    const fetchUser = async () => {
        try {
            const user: string = await userService.getLoggedInUserDetial();
            setUsername(user);
        } catch (error) {
            console.error("Error fetching user: ", error);
        }
    }

    const updateUser = async (password: string) => {
        try {
            await userService.changePassword(password);
            fetchUser();
            setPasswordChanged(true);
            setSnackbarOpen(true);
            setTimeout(() => {
                logout();
            }, 3000);
        } catch (error) {
            console.error("Error changing password: ", error);
        }
    }

    const handlePasswordChange = () => {
        setShowChangePassword(!showChangePassword);
    }

    const handleLogout = () => {
        logout();
    }

    const handleLogoutOfAllDevices = () => {
        logoutOfAllDevices();
    }

    return (
        <div className={styles.profile}>
            <div className={styles.mainDetail}>
                {username && (
                    <>
                        <div className={styles.image}>
                            <Link href="/analytics"><Image
                                alt="logo"
                                height="200"
                                width="200"
                                priority
                                className="hidden md:block cursor-pointer"
                                src="/user.png"
                            />
                            </Link>
                        </div>
                        <div>
                            <p className={styles.username} >
                                {username}
                            </p>
                            <div className={styles.buttonContainer}>
                                {canChangePassword && <Button color="success" variant="contained" onClick={handlePasswordChange}><Edit fontSize='small' />Change Password</Button>}
                                <Button color="secondary" variant="contained" onClick={handleLogout}><Logout fontSize='small' />Logout</Button>
                            </div>
                           {showLogoutOfAllDevices && <div className={styles.buttonContainer}>
                                <Button color="error" variant="contained" onClick={handleLogoutOfAllDevices}><Logout fontSize='small' />Logout of All devices</Button>
                            </div>}
                        </div>
                    </>
                )}
            </div>

            {showChangePassword && <div className={styles.changePassword}><ProfilePassword showConfirmPassword={true} onSubmit={updateUser} onDiscard={handlePasswordChange} /></div>}

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="Your password has been changed successfully! You will need to log in again."
                action={
                    <Button color="inherit" size="small" onClick={handleSnackbarClose}>
                        Close
                    </Button>
                }
            />
        </div>
    );
}
const Profile = withPermission(Component,"profile.*")
export default Profile;
