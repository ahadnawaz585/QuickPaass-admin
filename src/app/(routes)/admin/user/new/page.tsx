import React, { Suspense } from 'react'
const NewUser = React.lazy(() => import('@/modules/rbac/pages/user/new/newUser'));
import Loader from '@/components/shared/loader/loader';
const page = () => {
    return (
        <Suspense fallback={<Loader />}><NewUser /></Suspense>
    )
}

export default page
