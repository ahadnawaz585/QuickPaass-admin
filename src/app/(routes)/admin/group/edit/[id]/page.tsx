import React, { Suspense } from 'react'
const EditGroupComponent = React.lazy(() => import('@/pages/group/edit/edit'));
import Loader from '@/components/shared/loader/Loader';
const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <EditGroupComponent />
    </Suspense>
  )
}

export default page
