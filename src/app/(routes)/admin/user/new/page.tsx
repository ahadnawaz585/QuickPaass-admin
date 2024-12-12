import React, { Suspense } from 'react'
const NewUser = React.lazy(() => import('@/pages/user/new/newUser'));
import Loader from '@/components/shared/loader/Loader';
const page = () => {
    return (
        <Suspense fallback={<Loader />}><NewUser /></Suspense>
    )
}

export default page
