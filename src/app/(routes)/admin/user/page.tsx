import React, { Suspense } from 'react'

import Loader from '@/components/shared/loader/loader';
const User = React.lazy(() => import('@/modules/rbac/pages/user/user'));

const page = () => {
    return (
        <Suspense fallback={<Loader />}><User /></Suspense>
    )
}

export default page
