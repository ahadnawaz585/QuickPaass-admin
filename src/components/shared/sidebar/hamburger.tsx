"use client";
import React, { FC, useState, useEffect } from 'react';
import styles from './hamburger.module.scss';
import Drawer from '@mui/material/Drawer';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import { permission } from '@/auth/access.service';
import WorkIcon from '@mui/icons-material/Work';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // Import Arrow Icon

const Sidebar: FC<HamburgerProps> = ({ isSidebarOpen, toggleSidebar }) => {
    const pathname = usePathname();
    const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
    const [showUser, setShowUser] = useState<boolean>(false);
    const [showGroup, setShowGroup] = useState<boolean>(false);
    const [showRole, setShowRole] = useState<boolean>(false);
    const [showAMS, setShowAMS] = useState<boolean>(false);
    const [showAMSSubmenu, setShowAMSSubmenu] = useState(false);

    useEffect(() => {
        const checkPermissions = async () => {
            setShowAnalytics(await permission("analytics.*"));
            setShowUser(await permission("user.*"));
            setShowRole(await permission("role.*"));
            setShowGroup(await permission("group.*"));
            setShowAMS(await permission('ams.*'));
        };
        checkPermissions();
    }, []);

    return (
        <Drawer
            variant="persistent"
            anchor="right"
            open={isSidebarOpen}
            className={isSidebarOpen ? styles.sidebarOpen : styles.sidebar}
        >
            <div>
                <IconButton onClick={toggleSidebar}>
                    <CloseIcon />
                </IconButton>
            </div>

            <ul className={`${styles.menu} ${isSidebarOpen ? styles.hideMenu : ''}`}>
                {showAnalytics && (
                    <li className={styles.listItem}>
                        <Link className={`${styles.links} ${pathname?.startsWith('/admin/analytics') ? styles.active : ''}`} href="/admin/analytics">
                            <BarChartIcon />
                            Analytics
                        </Link>
                    </li>
                )}
                {showUser && (
                    <li className={styles.listItem}>
                        <Link className={`${styles.links} ${pathname?.startsWith('/admin/user') ? styles.active : ''}`} href="/admin/user">
                            <PeopleIcon />
                            User
                        </Link>
                    </li>
                )}
                {showRole && (
                    <li className={styles.listItem}>
                        <Link className={`${styles.links} ${pathname?.startsWith('/admin/role') ? styles.active : ''}`} href="/admin/role">
                            <PersonAddIcon />
                            Role
                        </Link>
                    </li>
                )}
                {showGroup && (
                    <li className={styles.listItem}>
                        <Link className={`${styles.links} ${pathname?.startsWith('/admin/group') ? styles.active : ''}`} href="/admin/group">
                            <PeopleIcon />
                            Group
                        </Link>
                    </li>
                )}
                {showAMS && (
                    <li
                        onClick={() => setShowAMSSubmenu(!showAMSSubmenu)} // Toggle the AMS submenu visibility on click
                        className={styles.listItem}
                    >
                        <div className={styles.amsContainer}>
                            <Link className={`${styles.links} ${pathname?.startsWith('/admin/ams') ? styles.active : ''}`} href="/admin/ams">
                                <WorkIcon />
                                AMS
                            </Link>
                            <ArrowDropDownIcon className={styles.addIcon} /> {/* Arrow Icon */}
                        </div>
                        {showAMSSubmenu && (
                            <div className={styles.amsSubmenu}>
                                <Link
                                    className={`${styles.links} ${pathname?.startsWith('/admin/ams/employee') ? styles.active : ''}`}
                                    href="/admin/ams/employee"
                                >
                                    Employee
                                    <AddCircleIcon className={styles.addIcon} />
                                </Link>
                                <Link
                                    className={`${styles.links} ${pathname?.startsWith('/admin/ams/attendance') ? styles.active : ''}`}
                                    href="/admin/ams/attendance"
                                >
                                    Attendance
                                    <AddCircleIcon className={styles.addIcon} />
                                </Link>
                                <Link
                                    className={`${styles.links} ${pathname?.startsWith('/admin/ams/leave') ? styles.active : ''}`}
                                    href="/admin/ams/leave"
                                >
                                    Leave
                                    <AddCircleIcon className={styles.addIcon} />
                                </Link>
                            </div>
                        )}
                    </li>
                )}
            </ul>
        </Drawer>
    );
};

export default Sidebar;
