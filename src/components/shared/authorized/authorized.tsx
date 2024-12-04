import React from 'react'
import styles from './authorized.module.scss';
import LockIcon from '@mui/icons-material/Lock';
const Authorized: React.FC<{ message?: string }> = ({ message }) => {
    return (
        <div className={styles.container}>
            <div className={styles.centeredContent}>
                <div className={styles.root}>
                    <LockIcon className={styles.lockIcon} />
                    <span className={styles.message}>{message || "You don't have access"}</span>
                </div>
            </div>
        </div>
    )
}

export default Authorized
