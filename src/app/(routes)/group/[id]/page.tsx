import React, { Suspense } from 'react'
import Loader from '@/components/shared/loader/Loader';
const DetailedGroupComponent = React.lazy(() => import('@/pages/group/detailed/detailed'));
const page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <DetailedGroupComponent />
        </Suspense>
    )
}
export default page
