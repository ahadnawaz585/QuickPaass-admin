import React, { Suspense } from 'react'
import Loader from '@/components/shared/loader/loader';
const DetailedGroupComponent = React.lazy(() => import('@/modules/rbac/pages/group/detailed/detailed'));
const page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <DetailedGroupComponent />
        </Suspense>
    )
}
export default page
