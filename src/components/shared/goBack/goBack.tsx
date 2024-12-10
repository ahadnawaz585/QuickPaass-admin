"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GoBack = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <span onClick={handleGoBack}>
            <ArrowBackIcon style={{ cursor: 'pointer', color: '#2969c2',marginTop:'5px' }} />
        </span>
    )
}

export default GoBack
