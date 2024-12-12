import Loader from '@/components/shared/loader/loader'
import React, { Suspense } from 'react'
const DetailedRoleComponent = React.lazy(()=>import('@/pages/role/detailed/detailed'))
const page = () => {
    return (
        <Suspense fallback={<Loader/>}>
            <DetailedRoleComponent />
        </Suspense>
    )
}
export default page
