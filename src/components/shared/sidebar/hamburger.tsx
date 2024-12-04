"use client"
import React, { FC, useState, useEffect } from 'react';
import styles from './hamburger.module.scss';
import Drawer from '@mui/material/Drawer';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import { permission } from '@/auth/access.service';


const Sidebar: FC<HamburgerProps> = ({ isSidebarOpen, toggleSidebar }) => {
    const pathname = usePathname();
    const [showSetting, setShowSetting] = useState<boolean>(false);
    const [showCa, setShowCa] = useState<boolean>(false);
    const [showVoucher, setShowVoucher] = useState<boolean>(false);
    const [showContact, setShowContact] = useState<boolean>(false);
    const [showLedger, setShowLedger] = useState<boolean>(false);

    useEffect(() => {

        const checkPermissions = async () => {
            setShowCa(await permission("ca.*"));
            setShowVoucher(await permission("voucher.*"));
            setShowContact(await permission("contact.*"));
            setShowLedger(await permission("ledger.*"));
            setShowSetting(await permission("setting.*"));
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
                <li className={styles.listItem}><Link className={`${styles.links} ${pathname?.startsWith('/analytics') ? styles.active : ''}`} href="/analytics">Analytics</Link></li>
                <li className={styles.listItem}>
                    {showCa && (
                        <Link className={`${styles.links} ${pathname?.startsWith('/ca') ? styles.active : ''}`} href="/ca">
                            Chart of Accounts
                        </Link>
                    )}
                </li>
                <li className={styles.listItem}>
                    {showVoucher && (
                        <Link className={`${styles.links} ${pathname?.startsWith('/voucher') ? styles.active : ''}`} href="/voucher">
                            Vouchers
                        </Link>
                    )}
                </li>
                <li className={styles.listItem}>
                    {showContact && (
                        <Link className={`${styles.links} ${pathname?.startsWith('/contact') ? styles.active : ''}`} href="/contact">
                            Contacts
                        </Link>
                    )}
                </li>
                <li className={styles.listItem}>
                    {showLedger && (
                        <Link className={`${styles.links} ${pathname?.startsWith('/ledger') ? styles.active : ''}`} href="/ledger">
                            Ledger
                        </Link>
                    )}
                </li>
               
            </ul>
        </Drawer>
    );
    // styles.listItem
    // <li className={styles.listItem}><Link className={`${styles.links} ${pathname === '/analytics' ? styles.active : ''}`} href="/analytics">Analytics</Link></li>
};

export default Sidebar;
