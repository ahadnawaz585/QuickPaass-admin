import React, { Suspense } from 'react'
import Loader from '@/components/shared/loader/Loader';
const DetaileUser = React.lazy(() => import('@/pages/user/detailed/detailed'));
const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <DetaileUser />
    </Suspense>
  )
}

export default page
