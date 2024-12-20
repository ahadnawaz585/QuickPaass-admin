import React, { Suspense } from 'react'
import Loader from '@/components/shared/loader/Loader'
const Profile = React.lazy(() => import('@/pages/profile/profile'))
const page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Profile />
        </Suspense>
    )
}

export default page
