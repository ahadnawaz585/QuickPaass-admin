import React, { Suspense } from 'react'
import Loader from '@/components/shared/loader/loader';
const DetaileUser = React.lazy(() => import('@/modules/rbac/pages/user/detailed/detailed'));
const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <DetaileUser />
    </Suspense>
  )
}

export default page
