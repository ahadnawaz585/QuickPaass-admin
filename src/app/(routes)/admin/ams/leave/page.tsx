import Loader from '@/components/shared/loader/loader';
import React, { Suspense } from 'react'
import { LeaveRequestList } from '@/modules/AMS/pages/leave/LeaveRequestList';
import { LeaveAllocationList } from '@/modules/AMS/pages/leave/LeaveAllocationList';
import { LeaveConfigList } from '@/modules/AMS/pages/leave/LeaveConfigList';

const page = () => {
    return (
        <>
            <LeaveAllocationList />
            <LeaveConfigList />
            <LeaveRequestList />
        </>
    )
}

export default page
