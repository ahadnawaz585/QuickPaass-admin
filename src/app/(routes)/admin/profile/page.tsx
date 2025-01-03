import React, { Suspense } from 'react'
import Loader from '@/components/shared/loader/loader'
const Profile = React.lazy(() => import('@/modules/rbac/pages/profile/profile'))
const page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Profile />
        </Suspense>
    )
}

export default page
