import React, { Suspense } from 'react'

import Loader from '@/components/shared/loader/Loader';
const User = React.lazy(() => import('@/pages/user/user'));

const page = () => {
    return (
        <Suspense fallback={<Loader />}><User /></Suspense>
    )
}

export default page
